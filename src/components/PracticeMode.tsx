
import { useEffect, useRef, useState } from "react";
import { NOTES, type NoteId } from "../lib/notes";

type PracticeModeProps = {
  detectedNote: NoteId | null;
  gestureEvent: number;
  active: boolean;
};

type ExerciseType = "single" | "sequence";

const noteIds = Object.keys(NOTES) as NoteId[];

const sequences: NoteId[][] = [
  ["do", "re", "mi"],
  ["mi", "fa", "sol"],
  ["sol", "la", "ti"],
  ["do", "mi", "sol", "highDo"],
];

const initialFeedback = "Show the target gesture to the webcam.";

export default function PracticeMode({
  detectedNote,
  gestureEvent,
  active,
}: PracticeModeProps) {
  const [exerciseType, setExerciseType] =
    useState<ExerciseType>("single");

  const [targetIndex, setTargetIndex] = useState(0);
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const [correct, setCorrect] = useState(0);
  const [errors, setErrors] = useState(0);
  const [completed, setCompleted] = useState(0);

  const [feedback, setFeedback] = useState(initialFeedback);
  const [feedbackType, setFeedbackType] =
    useState<"neutral" | "correct" | "incorrect">("neutral");

  // Remember the latest gesture event so older gestures
  // are not counted again when Practice Mode becomes active.
  const lastProcessedEvent = useRef(gestureEvent);

  const sequence = sequences[sequenceIndex];

  const target: NoteId =
    exerciseType === "single"
      ? noteIds[targetIndex]
      : sequence[stepIndex];

  const accuracy =
    correct + errors === 0
      ? 0
      : Math.round((correct / (correct + errors)) * 100);

  useEffect(() => {
    if (!active) {
      lastProcessedEvent.current = gestureEvent;
      return;
    }

    if (
      gestureEvent === 0 ||
      gestureEvent === lastProcessedEvent.current
    ) {
      return;
    }

    lastProcessedEvent.current = gestureEvent;

    if (detectedNote === null) {
      return;
    }

    const expected =
      exerciseType === "single"
        ? noteIds[targetIndex]
        : sequences[sequenceIndex][stepIndex];

    if (detectedNote !== expected) {
      setErrors((value) => value + 1);
      setFeedbackType("incorrect");
      setFeedback(
        `You performed ${NOTES[detectedNote].name}. Try ${NOTES[expected].name}.`
      );
      return;
    }

    setCorrect((value) => value + 1);
    setFeedbackType("correct");
    setFeedback(`Correct! You performed ${NOTES[expected].name}.`);

    if (exerciseType === "single") {
      setCompleted((value) => value + 1);
      setTargetIndex((value) => (value + 1) % noteIds.length);
    } else if (stepIndex + 1 >= sequence.length) {
      setCompleted((value) => value + 1);
      setStepIndex(0);
      setSequenceIndex((value) => (value + 1) % sequences.length);
      setFeedback("Excellent! You completed the sequence.");
    } else {
      setStepIndex((value) => value + 1);
    }

    // Process only newly accepted gesture events.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gestureEvent, active]);

  function restart() {
    lastProcessedEvent.current = gestureEvent;

    setTargetIndex(0);
    setSequenceIndex(0);
    setStepIndex(0);

    setCorrect(0);
    setErrors(0);
    setCompleted(0);

    setFeedback(initialFeedback);
    setFeedbackType("neutral");
  }

  function changeType(type: ExerciseType) {
    if (type === exerciseType) return;

    setExerciseType(type);
    restart();
  }

  return (
    <section className="practice-panel">
      <div className="practice-header">
        <div>
          <h2>Practice Mode</h2>
          <p>Improve your musical note recognition skills.</p>
        </div>

        <span className="practice-label">Interactive</span>
      </div>

      {/* Exercise selection */}
      <div className="practice-type-selector">
        <button
          className={exerciseType === "single" ? "selected" : ""}
          onClick={() => changeType("single")}
          aria-pressed={exerciseType === "single"}
        >
          Single Notes
        </button>

        <button
          className={exerciseType === "sequence" ? "selected" : ""}
          onClick={() => changeType("sequence")}
          aria-pressed={exerciseType === "sequence"}
        >
          Note Sequences
        </button>
      </div>

      {/* Target note */}
      <div className="practice-target-card">
        <span className="practice-section-label">
          YOUR TARGET NOTE
        </span>

        <h3>{NOTES[target].name}</h3>

        <p>Perform this hand gesture in front of the webcam.</p>
      </div>

      {/* Sequence progress */}
      {exerciseType === "sequence" && (
        <div className="practice-sequence">
          <div className="practice-sequence-heading">
            <span>Note Sequence</span>
            <span>
              Step {stepIndex + 1} of {sequence.length}
            </span>
          </div>

          <div className="practice-sequence-notes">
            {sequence.map((note, index) => (
              <span
                key={`${sequenceIndex}-${index}`}
                className={`practice-sequence-note ${
                  index < stepIndex
                    ? "completed"
                    : index === stepIndex
                      ? "current"
                      : ""
                }`}
              >
                {NOTES[note].name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Live feedback */}
      <div
        className={`practice-feedback ${feedbackType}`}
        role="status"
        aria-live="polite"
      >
        <span className="practice-feedback-icon">
          {feedbackType === "correct"
            ? "✓"
            : feedbackType === "incorrect"
              ? "!"
              : "◎"}
        </span>

        <span>{feedback}</span>
      </div>

      {/* Performance statistics */}
      <div className="practice-statistics">
        <div className="practice-stat-card">
          <span>Correct</span>
          <strong>{correct}</strong>
        </div>

        <div className="practice-stat-card">
          <span>Errors</span>
          <strong>{errors}</strong>
        </div>

        <div className="practice-stat-card">
          <span>Completed</span>
          <strong>{completed}</strong>
        </div>
      </div>

      {/* Accuracy */}
      <div className="practice-accuracy">
        <div className="practice-accuracy-heading">
          <span>Practice Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>

        <div className="practice-progress-track">
          <div
            className="practice-progress-fill"
            style={{ width: `${accuracy}%` }}
          />
        </div>
      </div>

      {/* Restart */}
      <button
        className="practice-restart-button"
        onClick={restart}
      >
        ↻ Restart Practice
      </button>
    </section>
  );
}
