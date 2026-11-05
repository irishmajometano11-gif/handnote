
import { NOTES, type NoteId } from "./notes";

let audioContext: AudioContext | null = null;

// Enable or resume the audio context
export async function enableAudio() {
  audioContext ??= new AudioContext();

  if (audioContext.state !== "running") {
    await audioContext.resume();
  }
}

// Play a musical note
export function playNote(note: NoteId) {
  if (!audioContext || audioContext.state !== "running") return;

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.value = NOTES[note].frequency;

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.25, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start(now);
  oscillator.stop(now + 0.42);
}

// NEW: Automatically enable sound and play a homepage note
export async function playHomeNote(note: NoteId) {
  try {
    await enableAudio();
    playNote(note);
  } catch (error) {
    console.error("Unable to play homepage note:", error);
  }
}
