
import { useEffect, useRef, useState } from "react";

import { NOTES, type NoteId } from "../lib/notes";
import { playNote } from "../lib/audio";
import { exportCompositionWav } from "../lib/tempexportAudio";

type CompositionModeProps = {
  detectedNote: NoteId | null;
  gestureEvent: number;
  active: boolean;
};

type SavedComposition = {
  id: string;
  name: string;
  notes: NoteId[];
  tempo: number;
  savedAt: string;
};

const MAX_NOTES = 200;
const STORAGE_KEY = "handnote-saved-compositions";

const VALID_NOTES = Object.keys(NOTES) as NoteId[];

function readSavedCompositions(): SavedComposition[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];

    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];

    return parsed.filter((item): item is SavedComposition => {
      if (!item || typeof item !== "object") return false;

      const entry = item as Partial<SavedComposition>;

      return (
        typeof entry.id === "string" &&
        typeof entry.name === "string" &&
        typeof entry.savedAt === "string" &&
        typeof entry.tempo === "number" &&
        Number.isFinite(entry.tempo) &&
        entry.tempo >= 60 &&
        entry.tempo <= 500 &&
        Array.isArray(entry.notes) &&
        entry.notes.length <= MAX_NOTES &&
        entry.notes.every((note) =>
          VALID_NOTES.includes(note as NoteId)
        )
      );
    });
  } catch (error) {
    console.error("Could not read saved compositions:", error);
    return [];
  }
}

export default function CompositionMode({
  detectedNote,
  gestureEvent,
  active,
}: CompositionModeProps) {
  const [melody, setMelody] = useState<NoteId[]>([]);
  const [recording, setRecording] = useState(false);
  const [tempo, setTempo] = useState(100);
  const [playing, setPlaying] = useState(false);
  const [playIndex, setPlayIndex] = useState(0);

  const [message, setMessage] = useState(
    "Press Start Recording, then perform hand gestures."
  );

  const [compositionName, setCompositionName] = useState("");

  const [savedCompositions, setSavedCompositions] =
    useState<SavedComposition[]>(readSavedCompositions);

  const [currentCompositionId, setCurrentCompositionId] =
    useState<string | null>(null);

  const lastEventRef = useRef(gestureEvent);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const nextIndexRef = useRef(0);
  const melodyRef = useRef(melody);
  const tempoRef = useRef(tempo);

  useEffect(() => {
    melodyRef.current = melody;
  }, [melody]);

  useEffect(() => {
    tempoRef.current = tempo;
  }, [tempo]);

  function updateMelody(notes: NoteId[]) {
    melodyRef.current = notes;
    setMelody(notes);
  }

  function stopPlayback(reset = false) {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    setPlaying(false);

    if (reset) {
      nextIndexRef.current = 0;
      setPlayIndex(0);
    }
  }

  // Stop playback and recording when leaving Composition Mode.
  useEffect(() => {
    if (!active) {
      lastEventRef.current = gestureEvent;
      setRecording(false);

      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }

      setPlaying(false);
      nextIndexRef.current = 0;
      setPlayIndex(0);
    }
  }, [active, gestureEvent]);

  // Record one note per newly accepted gesture event.
  useEffect(() => {
    if (!active) {
      lastEventRef.current = gestureEvent;
      return;
    }

    if (gestureEvent === lastEventRef.current) return;

    lastEventRef.current = gestureEvent;

    if (!recording || detectedNote === null) return;

    if (melodyRef.current.length >= MAX_NOTES) {
      setRecording(false);
      setMessage(`Maximum of ${MAX_NOTES} notes reached.`);
      return;
    }

    const updated = [...melodyRef.current, detectedNote];

    updateMelody(updated);
    setMessage(`${NOTES[detectedNote].name} added to your melody.`);

    if (updated.length >= MAX_NOTES) {
      setRecording(false);
      setMessage(`Maximum of ${MAX_NOTES} notes reached.`);
    }
  }, [gestureEvent, detectedNote, recording, active]);

  function scheduleNextNote() {
    const notes = melodyRef.current;
    const index = nextIndexRef.current;

    if (index >= notes.length) {
      stopPlayback(true);
      setMessage("Playback completed.");
      return;
    }

    playNote(notes[index]);
    setPlayIndex(index);
    nextIndexRef.current = index + 1;

    const beatDuration = (60 / tempoRef.current) * 1000;

    timerRef.current = setTimeout(
      scheduleNextNote,
      beatDuration
    );
  }

  function startPlayback() {
    if (melodyRef.current.length === 0) {
      setMessage("Record some notes before playing.");
      return;
    }

    if (playing) return;

    setRecording(false);
    setPlaying(true);
    setMessage("Playing your composition...");
    scheduleNextNote();
  }

  function pausePlayback() {
    stopPlayback();
    setMessage("Playback paused.");
  }

  function restartPlayback() {
    stopPlayback(true);

    if (melodyRef.current.length === 0) {
      setMessage("Record some notes before playing.");
      return;
    }

    nextIndexRef.current = 0;
    setPlayIndex(0);
    setPlaying(true);
    setRecording(false);
    setMessage("Playing from the beginning...");

    scheduleNextNote();
  }

  function toggleRecording() {
    if (playing) stopPlayback(true);

    if (recording) {
      setRecording(false);
      setMessage("Recording stopped.");
    } else {
      if (melodyRef.current.length >= MAX_NOTES) {
        setMessage("Remove a note before recording more.");
        return;
      }

      lastEventRef.current = gestureEvent;
      setRecording(true);
      setMessage("Recording active. Perform a hand gesture.");
    }
  }

  function undoNote() {
    stopPlayback(true);

    updateMelody(melodyRef.current.slice(0, -1));
    setMessage("Last note removed.");
  }

  function clearMelody() {
    stopPlayback(true);
    setRecording(false);
    updateMelody([]);
    setCurrentCompositionId(null);
    setCompositionName("");
    setMessage("Composition cleared. Saved compositions are unchanged.");
  }

  function persistCompositions(compositions: SavedComposition[]) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(compositions)
      );

      setSavedCompositions(compositions);
      return true;
    } catch (error) {
      console.error("Could not save compositions:", error);
      setMessage(
        "Saving failed. Check your browser storage settings."
      );
      return false;
    }
  }

  // Download an individual saved composition as a WAV file.
  async function handleDownloadSavedComposition(
    composition: SavedComposition
  ) {
    if (composition.notes.length === 0) {
      setMessage("This composition has no notes to export.");
      return;
    }

    try {
      setMessage(`Preparing "${composition.name}" for download...`);

      const safeName = composition.name
        .trim()
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 60);

      const filename = `HandNote-${
        safeName || "Composition"
      }.wav`;

      await exportCompositionWav(
        composition.notes,
        composition.tempo,
        filename
      );

      setMessage(`"${composition.name}" exported successfully!`);
    } catch (error) {
      console.error("Audio export failed:", error);
      setMessage("Unable to export audio. Please try again.");
    }
  }

  function saveComposition() {
    if (melodyRef.current.length === 0) {
      setMessage("Record some notes before saving.");
      return;
    }

    const name = compositionName.trim();

    if (!name) {
      setMessage("Please enter a composition name.");
      return;
    }

    const existing = savedCompositions.find(
      (item) => item.id === currentCompositionId
    );

    const composition: SavedComposition = {
      id: existing?.id ?? crypto.randomUUID(),
      name,
      notes: [...melodyRef.current],
      tempo,
      savedAt: new Date().toISOString(),
    };

    const updated = existing
      ? savedCompositions.map((item) =>
          item.id === existing.id ? composition : item
        )
      : [composition, ...savedCompositions];

    if (persistCompositions(updated)) {
      setCurrentCompositionId(composition.id);
      setMessage(`"${name}" saved successfully.`);
    }
  }

  function loadComposition(composition: SavedComposition) {
    stopPlayback(true);
    setRecording(false);
    lastEventRef.current = gestureEvent;

    updateMelody([...composition.notes]);
    setTempo(composition.tempo);
    tempoRef.current = composition.tempo;
    setCompositionName(composition.name);
    setCurrentCompositionId(composition.id);

    setMessage(`"${composition.name}" loaded successfully.`);
  }

  function deleteComposition(id: string) {
    const composition = savedCompositions.find(
      (item) => item.id === id
    );

    if (!composition) return;

    const confirmed = window.confirm(
      `Delete "${composition.name}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const updated = savedCompositions.filter(
      (item) => item.id !== id
    );

    if (persistCompositions(updated)) {
      if (currentCompositionId === id) {
        setCurrentCompositionId(null);
      }

      setMessage(`"${composition.name}" deleted.`);
    }
  }

  function newComposition() {
    stopPlayback(true);
    setRecording(false);
    updateMelody([]);
    setTempo(100);
    tempoRef.current = 100;
    setCompositionName("");
    setCurrentCompositionId(null);
    setMessage("New composition started.");
  }

  // Clean up timers on unmount.
  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <section className="composition-panel">
      <div className="composition-header">
        <div>
          <h2>Composition Mode</h2>
          <p>Create your own melody using hand gestures.</p>
        </div>

        <span className="composition-badge">
          {recording ? "● Recording" : "Music Studio"}
        </span>
      </div>

      {/* Recording */}
      <div className="composition-recording">
        <div>
          <span className="composition-label">
            GESTURE RECORDING
          </span>
          <p>
            {recording
              ? "Perform gestures to add musical notes."
              : "Start recording to capture hand gestures."}
          </p>
        </div>

        <button
          className={`composition-record-button ${
            recording ? "recording" : ""
          }`}
          onClick={toggleRecording}
        >
          {recording ? "■ Stop Recording" : "● Start Recording"}
        </button>
      </div>

      {/* Melody timeline */}
      <div className="composition-timeline">
        <div className="composition-section-heading">
          <h3>My Melody</h3>
          <span>{melody.length} / {MAX_NOTES} notes</span>
        </div>

        {melody.length === 0 ? (
          <div className="composition-empty">
            <span>♫</span>
            <p>No notes recorded yet.</p>
            <small>
              Perform hand gestures to build a melody.
            </small>
          </div>
        ) : (
          <div className="composition-notes">
            {melody.map((note, index) => (
              <div
                key={index}
                className={`composition-note ${
                  playing && index === playIndex ? "playing" : ""
                }`}
              >
                <small>{index + 1}</small>
                <strong>{NOTES[note].name}</strong>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tempo */}
      <div className="composition-tempo">
        <div className="composition-section-heading">
          <h3>Playback Tempo</h3>
          <strong>{tempo} BPM</strong>
        </div>

        <input
          type="range"
          min="60"
          max="500"
          step="5"
          value={tempo}
          onChange={(event) =>
            setTempo(Number(event.target.value))
          }
          aria-label="Playback tempo"
        />

        <div className="composition-tempo-labels">
          <span>Slow · 60 BPM</span>
          <span>Fast · 500 BPM</span>
        </div>
      </div>

      {/* Playback */}
      <div className="composition-controls">
        <button
          onClick={startPlayback}
          disabled={playing || !melody.length}
        >
          ▶ {playIndex > 0 ? "Resume" : "Play"}
        </button>

        <button
          onClick={pausePlayback}
          disabled={!playing}
        >
          ⏸ Pause
        </button>

        <button
          onClick={restartPlayback}
          disabled={!melody.length}
        >
          ↻ Restart
        </button>
      </div>

      {/* Editing */}
      <div className="composition-edit-controls">
        <button
          onClick={undoNote}
          disabled={!melody.length}
        >
          ↶ Undo Last Note
        </button>

        <button
          onClick={clearMelody}
          disabled={!melody.length}
        >
          Clear Composition
        </button>
      </div>

      {/* Save composition */}
      <div className="composition-save-section">
        <div className="composition-section-heading">
          <h3>Save Composition</h3>
        </div>

        <div className="composition-save-row">
          <input
            type="text"
            value={compositionName}
            maxLength={60}
            placeholder="Enter composition name..."
            aria-label="Composition name"
            onChange={(event) =>
              setCompositionName(event.target.value)
            }
          />

          <button
            onClick={saveComposition}
            disabled={!melody.length}
          >
            Save
          </button>
        </div>

        {currentCompositionId && (
          <p className="composition-save-hint">
            Saving updates the currently loaded composition.
          </p>
        )}

        <button
          className="composition-new-button"
          onClick={newComposition}
        >
          + New Composition
        </button>
      </div>

      {/* Saved compositions */}
      <div className="composition-library">
        <div className="composition-section-heading">
          <h3>My Compositions</h3>
          <span>{savedCompositions.length} saved</span>
        </div>

        {savedCompositions.length === 0 ? (
          <p className="composition-library-empty">
            No saved compositions yet.
          </p>
        ) : (
          <div className="composition-library-list">
            {savedCompositions.map((composition) => (
              <div
                className="composition-library-item"
                key={composition.id}
              >
                <div className="composition-library-info">
                  <strong>{composition.name}</strong>

                  <span>
                    {composition.notes.length} notes ·{" "}
                    {composition.tempo} BPM
                  </span>

                  <small>
                    Saved{" "}
                    {new Date(
                      composition.savedAt
                    ).toLocaleDateString()}
                  </small>
                </div>

                <div className="composition-library-actions">
                  <button
                    onClick={() =>
                      loadComposition(composition)
                    }
                  >
                    Load
                  </button>

                  {/* NEW: DOWNLOAD SAVED COMPOSITION */}
                  <button
                    type="button"
                    onClick={() =>
                      handleDownloadSavedComposition(composition)
                    }
                  >
                    ↓ Download
                  </button>

                  <button
                    className="composition-delete-button"
                    onClick={() =>
                      deleteComposition(composition.id)
                    }
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p
        className="composition-message"
        role="status"
        aria-live="polite"
      >
        {message}
      </p>
    </section>
  );
}
