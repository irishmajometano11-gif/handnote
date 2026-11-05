
import { useState } from "react";

import HandTracker from "./components/HandTracker";
import LearnMode from "./components/LearnMode";
import PracticeMode from "./components/PracticeMode";
import CompositionMode from "./components/CompositionMode";
import HomePage from "./components/HandNoteLanding";

import { enableAudio } from "./lib/audio";
import { NOTES, type NoteId } from "./lib/notes";

type Mode = "home" | "learn" | "practice" | "composition";

export default function App() {
  const [mode, setMode] = useState<Mode>("home");

  // Track whether the user has started learning
  const [learningStarted, setLearningStarted] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(false);

  const [detectedNote, setDetectedNote] =
    useState<NoteId | null>(null);

  const [targetNote, setTargetNote] =
    useState<NoteId>("do");

  const [gestureEvent, setGestureEvent] = useState(0);

  // Start Learning button
  function handleStartLearning() {
    setLearningStarted(true);
    setMode("learn");
  }

  // Handle navigation between pages
  function handleNavigate(nextMode: Mode) {
    // Prevent access to learning modes before starting
    if (nextMode !== "home" && !learningStarted) {
      return;
    }

    setMode(nextMode);
  }

  async function handleEnableSound() {
    try {
      await enableAudio();
      setSoundEnabled(true);
    } catch (error) {
      console.error("Failed to enable sound:", error);
    }
  }

  function handleGestureDetected(note: NoteId | null) {
    setDetectedNote(note);

    if (note !== null) {
      setGestureEvent((previous) => previous + 1);
    }
  }

  const isHome = mode === "home";
  const isCorrect = detectedNote === targetNote;

  return (
    <div
      className={`handnote-app ${
        isHome ? "home-active" : ""
      }`}
    >
      {/* HEADER */}
      <header
        className={`app-header ${
          isHome ? "home-header" : ""
        }`}
      >
        {/* BRAND */}
        <button
          type="button"
          className="app-brand brand-home-link"
          onClick={() => handleNavigate("home")}
          aria-label="Go to HandNote homepage"
        >
          <span className="brand-icon">♫</span>

          <div>
            <h1>HandNote</h1>

            {!isHome && (
              <p>Gesture-Based Music Learning</p>
            )}
          </div>
        </button>

        {/* NAVIGATION */}
        <nav
          className="mode-navigation"
          aria-label="HandNote navigation"
        >
          {/* HOME - ALWAYS VISIBLE */}
          <button
            type="button"
            className={isHome ? "active" : ""}
            onClick={() => handleNavigate("home")}
            aria-current={
              isHome ? "page" : undefined
            }
          >
            Home
          </button>

          {/* LEARNING MODES - HIDDEN ON HOMEPAGE */}
          {!isHome && (
            <>
              {/* LEARN */}
              <button
                type="button"
                className={
                  mode === "learn" ? "active" : ""
                }
                onClick={() => handleNavigate("learn")}
                aria-current={
                  mode === "learn" ? "page" : undefined
                }
              >
                Learn
              </button>

              {/* PRACTICE */}
              <button
                type="button"
                className={
                  mode === "practice" ? "active" : ""
                }
                onClick={() => handleNavigate("practice")}
                aria-current={
                  mode === "practice" ? "page" : undefined
                }
              >
                Practice
              </button>

              {/* COMPOSE */}
              <button
                type="button"
                className={
                  mode === "composition" ? "active" : ""
                }
                onClick={() =>
                  handleNavigate("composition")
                }
                aria-current={
                  mode === "composition"
                    ? "page"
                    : undefined
                }
              >
                Compose
              </button>
            </>
          )}
        </nav>

        {/* SOUND BUTTON */}
        {!isHome && (
          <button
            type="button"
            className={`audio-button ${
              soundEnabled ? "enabled" : ""
            }`}
            onClick={handleEnableSound}
          >
            {soundEnabled
              ? "✓ Sound Enabled"
              : "♫ Enable Sound"}
          </button>
        )}
      </header>

      {/* HOMEPAGE */}
      {isHome && (
        <HomePage
          onNavigate={(nextMode: Mode) => {
            if (nextMode === "learn") {
              handleStartLearning();
            } else {
              handleNavigate(nextMode);
            }
          }}
        />
      )}

      {/* LEARNING DASHBOARD */}
      {!isHome && learningStarted && (
        <main className="dashboard-layout">
          {/* WEBCAM */}
          <section className="webcam-column">
            <HandTracker
              onGestureDetected={handleGestureDetected}
            />

            {/* GESTURE FEEDBACK */}
            {mode === "learn" && (
              <div
                className={`gesture-feedback ${
                  detectedNote === null
                    ? "waiting"
                    : isCorrect
                      ? "correct"
                      : "incorrect"
                }`}
                role="status"
                aria-live="polite"
              >
                <span>
                  {detectedNote === null
                    ? "⏳ Waiting for gesture"
                    : isCorrect
                      ? "✓ Correct gesture!"
                      : `↻ Try again — ${
                          NOTES[detectedNote].name
                        }`}
                </span>

                <span className="feedback-target">
                  Target: {NOTES[targetNote].name}
                </span>
              </div>
            )}
          </section>

          {/* LEARNING PANELS */}
          <section className="learning-column">
            {/* LEARN MODE */}
            {mode === "learn" && (
              <LearnMode
                detectedNote={detectedNote}
                onTargetChange={setTargetNote}
              />
            )}

            {/* PRACTICE MODE */}
            <div
              style={{
                display:
                  mode === "practice"
                    ? "block"
                    : "none",
              }}
            >
              <PracticeMode
                detectedNote={detectedNote}
                gestureEvent={gestureEvent}
                active={mode === "practice"}
              />
            </div>

            {/* COMPOSITION MODE */}
            <div
              style={{
                display:
                  mode === "composition"
                    ? "block"
                    : "none",
              }}
            >
              <CompositionMode
                detectedNote={detectedNote}
                gestureEvent={gestureEvent}
                active={mode === "composition"}
              />
            </div>
          </section>
        </main>
      )}
    </div>
  );
}
