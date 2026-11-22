import type { CSSProperties } from "react";
import "./HomePage.css";

// Loads image1, image2, image3, image4 from src/assets (any extension).
// A missing image just shows a placeholder.
const allImages = import.meta.glob(
  "../assets/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}",
  { eager: true, import: "default" }
) as Record<string, string>;

function getImage(n: number): string {
  const pattern = new RegExp(`/image\\s*${n}\\.`, "i");
  const key = Object.keys(allImages).find((path) =>
    pattern.test(path)
  );
  return key ? allImages[key] : "";
}

const BOX_IMAGES = [getImage(1), getImage(2), getImage(3), getImage(4)];

const steps = [
  {
    title: "Allow your webcam",
    text: "Open Learn Mode and allow webcam access so HandNote can see your hand.",
  },
  {
    title: "Follow the gesture guide",
    text: "Learn which hand gesture plays each note by following the guide on screen.",
  },
  {
    title: "Practice your notes",
    text: "Practice musical notes and short sequences at your own pace.",
  },
  {
    title: "Compose a melody",
    text: "Create and play your own melodies in Compose Mode.",
  },
];



const BOX_HEIGHT = 200;   
const IMAGE_HEIGHT = 380; 
const SPACE_BEFORE_IMAGES = 40;

const pageStyle: CSSProperties = {
  minHeight: "calc(100vh - 75px)",
  background: "#f4f7fc",
  color: "#103567",
};

const innerStyle: CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "45px 30px 60px",
  boxSizing: "border-box",
};

const headingStyle: CSSProperties = {
  margin: "20px 0 16px",
  maxWidth: 700,
  fontSize: "clamp(28px, 3.2vw, 42px)",
  lineHeight: 1.2,
  letterSpacing: "-1px",
  color: "#0b336b",
  fontWeight: 800,
};

// both rows use the same columns, so boxes and images line up
const rowStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: 16,
};

const boxStyle: CSSProperties = {
  boxSizing: "border-box",
  minHeight: BOX_HEIGHT,
  padding: 22,
  borderRadius: 14,
  background: "white",
  border: "1px solid #dce5ef",
};

const numberStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 34,
  height: 34,
  marginBottom: 14,
  borderRadius: "50%",
  background: "#287db7",
  color: "white",
  fontSize: 14,
  fontWeight: 800,
};

const boxTitleStyle: CSSProperties = {
  margin: "0 0 8px",
  fontSize: 15,
  color: "#0b336b",
};

const boxTextStyle: CSSProperties = {
  margin: 0,
  fontSize: 13,
  lineHeight: 1.7,
  color: "#416d94",
};

const imageStyle: CSSProperties = {
  display: "block",
  boxSizing: "border-box",
  width: "100%",
  maxWidth: "100%",
  height: IMAGE_HEIGHT,
  borderRadius: 14,
  objectFit: "cover",
  objectPosition: "top center",
  background: "#0f172a",
};

const placeholderStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 6,
  boxSizing: "border-box",
  width: "100%",
  height: IMAGE_HEIGHT,
  borderRadius: 14,
  border: "2px dashed #8db4d2",
  background: "#eaf3fb",
  color: "#4785b4",
  fontSize: 13,
  fontWeight: 700,
};

export default function HowItWorksPage() {
  return (
    <div style={pageStyle}>
      <div style={innerStyle}>
        <div className="home-eyebrow">
          <span className="home-eyebrow-line" />
          HOW IT WORKS
        </div>

        <h2 style={headingStyle}>
          Four simple steps to your first melody.
        </h2>

        {}
        <div style={{ ...rowStyle, marginTop: 36, alignItems: "stretch" }}>
          {steps.map((step, index) => (
            <div style={boxStyle} key={step.title}>
              <span style={numberStyle}>{index + 1}</span>
              <h3 style={boxTitleStyle}>{step.title}</h3>
              <p style={boxTextStyle}>{step.text}</p>
            </div>
          ))}
        </div>

        {}
        <div
          style={{
            ...rowStyle,
            marginTop: SPACE_BEFORE_IMAGES,
            alignItems: "start",
          }}
        >
          {steps.map((step, index) =>
            BOX_IMAGES[index] ? (
              <img
                key={step.title}
                src={BOX_IMAGES[index]}
                alt={step.title}
                style={imageStyle}
              />
            ) : (
              <div key={step.title} style={placeholderStyle}>
                <span style={{ fontSize: 30 }}>🖼️</span>
                <span>Image {index + 1}</span>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}