
import { useState } from "react";
import { NOTES, type NoteId } from "../lib/notes";
import { playNote } from "../lib/audio";
import HandGestureGuide from "./HandGestureGuide";

type LearnModeProps = {
  detectedNote: NoteId | null;
  onTargetChange: (note: NoteId) => void;
};

const gestureInstructions: Record<NoteId, string> = {
  do: "Raise only your index finger.",
  re: "Raise your index and middle fingers.",
  mi: "Raise your index, middle, and ring fingers.",
  fa: "Raise your index, middle, ring, and pinky fingers.",
  sol: "Extend your thumb and pinky while keeping the other fingers folded (Shaka gesture).",
  la: "Raise your middle and ring fingers.",
  ti: "Raise your middle, ring, and pinky fingers.",
  highDo: "Raise only your pinky finger.",
};

export default function LearnMode({
  onTargetChange,
}: LearnModeProps) {
  const [selectedNote, setSelectedNote] =
    useState<NoteId>("do");

  const note = NOTES[selectedNote];

  function handleSelectNote(id: NoteId) {
    setSelectedNote(id);
    onTargetChange(id);
  }

  return (
    <section className="learning-panel">
      <div className="learning-header">
        <h2>Learn Mode</h2>
        <p>
          Select a musical note and perform its hand
          gesture in front of the webcam.
        </p>
      </div>

      {/* Note selection */}
      <div className="note-grid">
        {(Object.keys(NOTES) as NoteId[]).map((id) => (
          <button
            key={id}
            className={`note-button ${
              selectedNote === id ? "selected" : ""
            }`}
            onClick={() => handleSelectNote(id)}
            aria-pressed={selectedNote === id}
          >
            {NOTES[id].name}
          </button>
        ))}
      </div>

      {/* Selected note */}
      <div className="selected-note-card">
        <span className="section-label">
          CURRENT MUSICAL NOTE
        </span>

        <h3>{note.name}</h3>

        <p className="note-frequency">
          Frequency: {note.frequency} Hz
        </p>

        {/* Visual guide */}
        <div className="learning-gesture-section">
          <h4>Hand Gesture Guide</h4>

          <HandGestureGuide note={selectedNote} />
        </div>

        {/* Instructions */}
        <div className="gesture-instructions">
          <h4>How to Perform This Gesture</h4>
          <p>{gestureInstructions[selectedNote]}</p>
        </div>

        {/* Sound */}
        <button
          className="play-note-button"
          onClick={() => playNote(selectedNote)}
        >
          ▶ Play {note.name} Sound
        </button>
      </div>
    </section>
  );
}
