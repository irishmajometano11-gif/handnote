import { useEffect, useState } from "react";

import HandTracker from "./components/HandTracker";
import LearnMode from "./components/LearnMode";
import PracticeMode from "./components/PracticeMode";
import CompositionMode from "./components/CompositionMode";
import HomePage from "./components/HandNoteLanding";
import HowItWorksPage from "./components/HowItWorksPage";
import About from "./components/AboutPage";

import { enableAudio } from "./lib/audio";
import { NOTES, type NoteId } from "./lib/notes";

type Mode =
  | "home"
  | "how"
  | "about"
  | "learn"
  | "practice"
  | "composition";

export default function App() {
  const [mode, setMode] = useState<Mode>("home");

  // Track whether the user has started learning
  const [learningStarted, setLearningStarted] = useState(false);

  const [detectedNote, setDetectedNote] =
    useState<NoteId | null>(null);

  const [targetNote, setTargetNote] =
    useState<NoteId>("do");

  const [gestureEvent, setGestureEvent] = useState(0);

  // Turn sound on automatically at the user's first interaction
  useEffect(() => {
    function unlockAudio() {
      enableAudio().catch((error) => {
        console.error("Failed to enable sound:", error);
      });
    }

    window.addEventListener("pointerdown", unlockAudio, {
      once: true,
    });
    window.addEventListener("keydown", unlockAudio, {
      once: true,
    });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
      window.removeEventListener("keydown", unlockAudio);
    };
  }, []);

  // Always start at the top when switching screens
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [mode]);

  // Start Learning button
  function handleStartLearning() {
    // Make sure sound is on before the learning screen opens
    enableAudio().catch((error) => {
      console.error("Failed to enable sound:", error);
    });

    setLearningStarted(true);
    setMode("learn");
  }

  // Handle navigation between pages
  function handleNavigate(nextMode: Mode) {
    const isLearningMode =
      nextMode === "learn" ||
      nextMode === "practice" ||
      nextMode === "composition";

    // Prevent access to learning modes before starting
    if (isLearningMode && !learningStarted) {
      return;
    }

    setMode(nextMode);
  }

  function handleGestureDetected(note: NoteId | null) {
    setDetectedNote(note);

    if (note !== null) {
      setGestureEvent((previous) => previous + 1);
    }
  }

  const isHome = mode === "home";
  // Home, How it works and About share the landing-style header
  const isLanding =
    mode === "home" || mode === "how" || mode === "about";
  const isCorrect = detectedNote === targetNote;

  return (
    <div
      className={`handnote-app ${
        isLanding ? "home-active" : ""
      }`}
    >
      {/* HEADER */}
      <header
        className={`app-header ${
          isLanding ? "home-header" : ""
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

            {!isLanding && (
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
            aria-current={isHome ? "page" : undefined}
          >
            Home
          </button>

          {/* HOW IT WORKS + ABOUT - LANDING SCREENS ONLY */}
          {isLanding && (
            <>
              <button
                type="button"
                className={mode === "how" ? "active" : ""}
                onClick={() => handleNavigate("how")}
                aria-current={
                  mode === "how" ? "page" : undefined
                }
              >
                How it works
              </button>

              <button
                type="button"
                className={mode === "about" ? "active" : ""}
                onClick={() => handleNavigate("about")}
                aria-current={
                  mode === "about" ? "page" : undefined
                }
              >
                About
              </button>
            </>
          )}

          {/* LEARNING MODES - HIDDEN ON LANDING SCREENS */}
          {!isLanding && (
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
      </header>

      {/* HOMEPAGE */}
      {mode === "home" && (
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

      {/* HOW IT WORKS SCREEN */}
      {mode === "how" && <HowItWorksPage />}

      {/* ABOUT SCREEN */}
      {mode === "about" && <About />}

      {/* LEARNING DASHBOARD */}
      {!isLanding && learningStarted && (
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