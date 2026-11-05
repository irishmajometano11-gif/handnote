
import type { NoteId } from "../lib/notes";

type HandGestureGuideProps = {
  note: NoteId;
};

const raisedFingers: Record<NoteId, number[]> = {
  do: [1],
  re: [1, 2],
  mi: [1, 2, 3],
  fa: [1, 2, 3, 4],
  sol: [0, 4],
  la: [2, 3],
  ti: [2, 3, 4],
  highDo: [4],
};

const fingerNames = [
  "Thumb",
  "Index",
  "Middle",
  "Ring",
  "Pinky",
];

export default function HandGestureGuide({
  note,
}: HandGestureGuideProps) {
  const raised = raisedFingers[note];

  const fingers = [
    { x: 46, y: 132, rotation: -42, length: 67 },
    { x: 86, y: 78, rotation: -5, length: 93 },
    { x: 124, y: 60, rotation: 0, length: 111 },
    { x: 163, y: 76, rotation: 5, length: 96 },
    { x: 199, y: 109, rotation: 13, length: 70 },
  ];

  return (
    <div className="hand-gesture-guide">
      <div className="hand-gesture-visual">
        <svg
          viewBox="0 0 250 280"
          role="img"
          aria-label={`Hand gesture diagram for ${note}`}
          className="hand-gesture-svg"
        >
          {/* Palm */}
          <rect
            x="67"
            y="132"
            width="125"
            height="115"
            rx="38"
            fill="#334155"
            stroke="#64748b"
            strokeWidth="3"
          />

          {/* Fingers */}
          {fingers.map((finger, index) => {
            const isRaised = raised.includes(index);
            const length = isRaised ? finger.length : 35;

            return (
              <g
                key={fingerNames[index]}
                transform={`rotate(
                  ${finger.rotation}
                  ${finger.x}
                  ${finger.y + 70}
                )`}
              >
                <rect
                  x={finger.x - 13}
                  y={finger.y + finger.length - length}
                  width="26"
                  height={length + 35}
                  rx="13"
                  fill={isRaised ? "#38bdf8" : "#475569"}
                  stroke={isRaised ? "#7dd3fc" : "#64748b"}
                  strokeWidth="2"
                />
              </g>
            );
          })}

          {/* Wrist */}
          <rect
            x="98"
            y="226"
            width="64"
            height="39"
            rx="10"
            fill="#334155"
            stroke="#64748b"
            strokeWidth="3"
          />
        </svg>
      </div>

      <div className="hand-gesture-legend">
        <span className="gesture-legend-raised">
          <span className="gesture-legend-dot raised" />
          Raised finger
        </span>

        <span>
          <span className="gesture-legend-dot folded" />
          Folded finger
        </span>
      </div>

      <p className="hand-gesture-caption">
        Raise: {raised.map((index) => fingerNames[index]).join(", ")}
      </p>
    </div>
  );
}
