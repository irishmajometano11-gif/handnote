
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { NoteId } from "./notes";

// Pattern order: Thumb, Index, Middle, Ring, Pinky
const gestureMap: Record<string, NoteId> = {
  "01000": "do",
  "01100": "re",
  "01110": "mi",
  "01111": "fa",
  "10001": "sol",
  "00110": "la",
  "00111": "ti",
  "00001": "highDo",
};

function distance(
  a: NormalizedLandmark,
  b: NormalizedLandmark
) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function recognizeGesture(
  landmarks: NormalizedLandmark[]
): NoteId | null {
  if (landmarks.length !== 21) return null;

  const wrist = landmarks[0];

  // Thumb: compare tip and IP joint relative to pinky base.
  const thumbReference = landmarks[17];
  const thumbExtended =
    distance(landmarks[4], thumbReference) >
    distance(landmarks[3], thumbReference) * 1.15;

  const fingers = [
    [8, 6],   // Index
    [12, 10], // Middle
    [16, 14], // Ring
    [20, 18], // Pinky
  ];

  const fingerPattern = fingers
    .map(([tip, pip]) => {
      const tipDistance = distance(landmarks[tip], wrist);
      const pipDistance = distance(landmarks[pip], wrist);

      return tipDistance > pipDistance * 1.12 ? "1" : "0";
    })
    .join("");

  const pattern =
    (thumbExtended ? "1" : "0") + fingerPattern;

  return gestureMap[pattern] ?? null;
}
