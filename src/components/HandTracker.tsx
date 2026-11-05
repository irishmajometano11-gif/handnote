
import { useEffect, useRef, useState } from "react";
import {
  FilesetResolver,
  HandLandmarker,
} from "@mediapipe/tasks-vision";

import { recognizeGesture } from "../lib/gestures";
import { NOTES, type NoteId } from "../lib/notes";
import { playNote } from "../lib/audio";

type HandTrackerProps = {
  onGestureDetected?: (note: NoteId | null) => void;
};

export default function HandTracker({
  onGestureDetected,
}: HandTrackerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [status, setStatus] = useState("Camera not started");
  const [handCount, setHandCount] = useState(0);
  const [detectedNote, setDetectedNote] = useState("None");

  const lastGestureRef = useRef<NoteId | null>(null);
  const stableCountRef = useRef(0);
  const playedGestureRef = useRef<NoteId | null>(null);

  const onGestureDetectedRef = useRef(onGestureDetected);

  useEffect(() => {
    onGestureDetectedRef.current = onGestureDetected;
  }, [onGestureDetected]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let landmarker: HandLandmarker | null = null;
    let animationId = 0;
    let stopped = false;

    async function startCamera() {
      try {
        setStatus("Loading hand tracking model...");

        const vision = await FilesetResolver.forVisionTasks(
          "/mediapipe/wasm"
        );

        if (stopped) return;

        landmarker = await HandLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath:
               "/mediapipe/hand_landmarker.task",
              delegate: "CPU",
            },
            runningMode: "VIDEO",
            numHands: 2,
          }
        );

        if (stopped) {
          landmarker.close();
          return;
        }

        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (stopped) {
          stream.getTracks().forEach((track) =>
            track.stop()
          );
          return;
        }

        const video = videoRef.current;

        if (!video) {
          stream.getTracks().forEach((track) =>
            track.stop()
          );
          return;
        }

        video.srcObject = stream;
        await video.play();

        if (stopped) return;

        setStatus("Camera active");

        function detect() {
          if (stopped || !video || !landmarker) return;

          if (video.readyState >= 2) {
            const results = landmarker.detectForVideo(
              video,
              performance.now()
            );

            setHandCount(results.landmarks.length);

            const hand = results.landmarks[0];

            const gesture = hand
              ? recognizeGesture(hand)
              : null;

            if (
              gesture === lastGestureRef.current &&
              gesture !== null
            ) {
              stableCountRef.current++;
            } else {
              lastGestureRef.current = gesture;
              stableCountRef.current = gesture ? 1 : 0;
            }

            if (gesture === null) {
              setDetectedNote("None");

              if (playedGestureRef.current !== null) {
                playedGestureRef.current = null;
                onGestureDetectedRef.current?.(null);
              }
            } else if (stableCountRef.current >= 5) {
              setDetectedNote(NOTES[gesture].name);

              if (playedGestureRef.current !== gesture) {
                playedGestureRef.current = gesture;

                playNote(gesture);

                onGestureDetectedRef.current?.(gesture);
              }
            }
          }

          animationId = requestAnimationFrame(detect);
        }

        detect();
      } catch (error) {
        if (!stopped) {
          console.error(
            "HandNote initialization error:",
            error
          );

          const message =
            error instanceof Error
              ? error.message
              : String(error);

          setStatus(`Error: ${message}`);
        }
      }
    }

    startCamera();

    return () => {
      stopped = true;

      cancelAnimationFrame(animationId);

      stream?.getTracks().forEach((track) =>
        track.stop()
      );

      landmarker?.close();
    };
  }, []);

  return (
    <section className="camera-panel">
      <div className="panel-heading">
        <h2>Live Hand Tracking</h2>

        <span
          className="camera-status"
          style={{
            color:
              status === "Camera active"
                ? "#86efac"
                : "#fbbf24",
          }}
        >
          {status === "Camera active"
            ? "● Camera Active"
            : status}
        </span>
      </div>

      <div className="camera-frame">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="camera-video"
        />
      </div>

      <div className="camera-information">
        <span>
          Hands Detected: <strong>{handCount}</strong>
        </span>

        <span>
          Recognized Note: <strong>{detectedNote}</strong>
        </span>
      </div>
    </section>
  );
}
