
import { NOTES, type NoteId } from "./notes";

// Frequencies for the eight HandNote notes
const NOTE_FREQUENCIES: Record<string, number> = {
  do: 261.63,
  re: 293.66,
  mi: 329.63,
  fa: 349.23,
  sol: 392.0,
  la: 440.0,
  ti: 493.88,
  highDo: 523.25,
};

export async function exportCompositionWav(
  melody: NoteId[],
  tempo: number,
  filename = "HandNote-Composition.wav"
): Promise<void> {
  if (melody.length === 0) {
    throw new Error("No notes available to export.");
  }

  if (!Number.isFinite(tempo) || tempo <= 0) {
    throw new Error("Invalid playback tempo.");
  }

  const sampleRate = 44100;
  const beatDuration = 60 / tempo;
  const totalDuration = melody.length * beatDuration + 0.3;

  const audioContext = new OfflineAudioContext(
    1,
    Math.ceil(totalDuration * sampleRate),
    sampleRate
  );

  melody.forEach((note, index) => {
    const frequency = NOTE_FREQUENCIES[note];

    if (!Number.isFinite(frequency) || frequency <= 0) {
      console.error("Unknown HandNote note:", note);
      console.log("Available note IDs:", Object.keys(NOTES));

      throw new Error(`Unknown musical note: ${note}`);
    }

    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();

    const startTime = index * beatDuration;
    const noteDuration = Math.min(beatDuration * 0.85, 0.6);
    const endTime = startTime + noteDuration;

    const attackDuration = Math.min(
      0.01,
      noteDuration / 3
    );

    const releaseDuration = Math.min(
      0.06,
      noteDuration / 3
    );

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
      frequency,
      startTime
    );

    oscillator.connect(gain);
    gain.connect(audioContext.destination);

    gain.gain.setValueAtTime(0, startTime);

    gain.gain.linearRampToValueAtTime(
      0.3,
      startTime + attackDuration
    );

    gain.gain.setValueAtTime(
      0.3,
      endTime - releaseDuration
    );

    gain.gain.linearRampToValueAtTime(
      0,
      endTime
    );

    oscillator.start(startTime);
    oscillator.stop(endTime);
  });

  const renderedBuffer = await audioContext.startRendering();
  const samples = renderedBuffer.getChannelData(0);

  // Convert audio samples into 16-bit PCM WAV
  const buffer = new ArrayBuffer(44 + samples.length * 2);
  const view = new DataView(buffer);

  function writeString(offset: number, value: string) {
    for (let i = 0; i < value.length; i++) {
      view.setUint8(offset + i, value.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + samples.length * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");

  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);

  writeString(36, "data");
  view.setUint32(40, samples.length * 2, true);

  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));

    view.setInt16(
      44 + i * 2,
      sample < 0
        ? sample * 32768
        : sample * 32767,
      true
    );
  }

  const blob = new Blob([buffer], {
    type: "audio/wav",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
}
