
import { useState } from "react";
import { NOTES, type NoteId } from "../lib/notes";
import { playHomeNote } from "../lib/audio";
import handPreview from "../assets/HandNote.png";
import "./HomePage.css";

type HomePageProps = {
  onNavigate: (mode: "learn" | "practice" | "composition") => void;
};

const noteIds = Object.keys(NOTES) as NoteId[];

const noteLetters: Record<NoteId, string> = {
  do: "C",
  re: "D",
  mi: "E",
  fa: "F",
  sol: "G",
  la: "A",
  ti: "B",
  highDo: "C5",
};

export default function HomePage({
  onNavigate,
}: HomePageProps) {
  const [selectedNote, setSelectedNote] =
    useState<NoteId>("do");

  const [showInstructions, setShowInstructions] =
    useState(false);

  // Automatically enable audio and play the selected note.
  function selectNote(id: NoteId) {
    setSelectedNote(id);
    void playHomeNote(id);
  }

  return (
    <div className="handnote-home">
      {/* STARTING KIT */}
      <div className="home-starting-kit">
        <strong>GEAR UP</strong>
        <span> 🔴 A webcam</span>
        <span>💡 A Good Lightning</span>
        <span>💭 A little curiosity</span>
      </div>

      {/* MAIN HOMEPAGE */}
      <main className="home-hero">
        {/* LEFT SIDE */}
        <div className="home-hero-content">
          <div className="home-eyebrow">
            <span className="home-eyebrow-line" />
            LEARN BY GESTURE. PLAY BY EAR.
          </div>

          <h1>
            Learn Music.
            <br />
            One Gesture
            <br />
            at a Time.
          </h1>

          <p className="home-description">
           Make music with nothing but your hands and a webcam. 
           Discover each note, practice at your own pace, 
           and turn them into a melody that is yours.
          </p>

          <div className="home-actions">
            <button
              type="button"
              className="home-primary-button"
              onClick={() => onNavigate("learn")}
            >
              See Music <span>→</span>
            </button>

            <button
              type="button"
              className="home-secondary-button"
              onClick={() =>
                setShowInstructions((previous) => !previous)
              }
            >
              {showInstructions
                ? "Hide instructions"
                : "See how it works"}
            </button>
          </div>

          {showInstructions && (
            <div className="home-instructions">
              <strong>How HandNote Works</strong>
              <p>
                1. Open Learn Mode and allow webcam access.
              </p>
              <p>
                2. Follow the hand gesture guide to play notes.
              </p>
              <p>
                3. Practice musical notes and short sequences.
              </p>
              <p>
                4. Create and play melodies in Compose Mode.
              </p>
            </div>
          )}

          <div className="home-footnote">
            ✧ Your first melody is one gesture away.
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="home-preview-card">
          <div className="home-preview-header">
            <strong>▣ Your first note</strong>
            <span>● INTERACTIVE PREVIEW</span>
          </div>

          <div className="home-preview-body">
            {/* REPLACEABLE IMAGE */}
            <div className="home-preview-image">
              <span className="home-preview-label">
              
              </span>

              <div className="home-placeholder-art">
                <img
                  src={handPreview}
                  alt="Hand gesture preview"
                  className="home-preview-image"
                />
              </div>

            </div>

            {/* CURRENT NOTE */}
            <div className="home-preview-note">
              <span>MEET THE NOTE</span>

              <strong>{noteLetters[selectedNote]}</strong>

              <p>
                {NOTES[selectedNote].name} ·{" "}
                {NOTES[selectedNote].frequency} Hz
              </p>

              <div className="home-sound-wave">
                ▏▍▏▌▏▍▏
              </div>
            </div>
          </div>

          {/* PLAYABLE NOTES */}
          <div className="home-preview-keyboard">
            {noteIds.map((id) => (
              <button
                key={id}
                type="button"
                className={
                  selectedNote === id ? "active" : ""
                }
                onClick={() => selectNote(id)}
                aria-label={`Play ${NOTES[id].name}`}
              >
                {noteLetters[id]}
              </button>
            ))}
          </div>

          <p className="home-preview-caption">
            ♪ Move with intention. Listen with curiosity. Learn through play.
          </p>
        </div>
      </main>
    </div>
  );
}
