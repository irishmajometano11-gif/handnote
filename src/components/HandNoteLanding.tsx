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

  // Automatically enable audio and play the selected note.
  function selectNote(id: NoteId) {
    setSelectedNote(id);
    void playHomeNote(id);
  }

  function scrollToSection(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: "smooth" });
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
              onClick={() => scrollToSection("how-it-works")}
            >
              See how it works
            </button>

            <button
              type="button"
              className="home-secondary-button"
              onClick={() => scrollToSection("about-handnote")}
            >
              About HandNote
            </button>
          </div>

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

      {/* HOW IT WORKS */}
      <section className="home-how" id="how-it-works">
        <div className="home-about-inner">
          <div className="home-eyebrow">
            <span className="home-eyebrow-line" />
            HOW IT WORKS
          </div>

          <h2>Four simple steps to your first melody.</h2>

          <div className="home-how-grid">
            <div className="home-how-step">
              <span className="home-how-number">1</span>
              <h3>Allow your webcam</h3>
              <p>
                Open Learn Mode and allow webcam access so HandNote
                can see your hand.
              </p>
            </div>

            <div className="home-how-step">
              <span className="home-how-number">2</span>
              <h3>Follow the gesture guide</h3>
              <p>
                Learn which hand gesture plays each note by following
                the guide on screen.
              </p>
            </div>

            <div className="home-how-step">
              <span className="home-how-number">3</span>
              <h3>Practice your notes</h3>
              <p>
                Practice musical notes and short sequences at your
                own pace.
              </p>
            </div>

            <div className="home-how-step">
              <span className="home-how-number">4</span>
              <h3>Compose a melody</h3>
              <p>
                Create and play your own melodies in Compose Mode.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ABOUT HANDNOTE */}
      <section className="home-about" id="about-handnote">
        <div className="home-about-inner">
          <div className="home-eyebrow">
            <span className="home-eyebrow-line" />
            ABOUT HANDNOTE
          </div>

          <h2>Learn and play music using only your hands.</h2>

          <p className="home-about-intro">
            HandNote is a browser-based music learning and
            composition system that uses your webcam to recognize
            hand gestures. Each gesture represents a musical note,
            so you can learn, practice and compose music without a
            physical instrument. No special hardware or
            installation is needed, just a device with a camera
            and a web browser.
          </p>

          <div className="home-about-grid">
            <div className="home-about-card">
              <h3>Learn Mode</h3>
              <p>
                Follow the hand gesture guide and discover which
                gesture produces each note.
              </p>
            </div>

            <div className="home-about-card">
              <h3>Practice Mode</h3>
              <p>
                Practice musical notes and short sequences to build
                accuracy and confidence.
              </p>
            </div>

            <div className="home-about-card">
              <h3>Composition Mode</h3>
              <p>
                Create your own melodies with gestures, then play
                them back.
              </p>
            </div>

            <div className="home-about-card">
              <h3>Gesture Recognition</h3>
              <p>
                Your webcam follows your hand movements in real time
                and turns each gesture into a musical note, with no
                extra equipment needed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}