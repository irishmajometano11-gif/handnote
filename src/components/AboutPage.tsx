import "./HomePage.css";
import image5 from "../assets/image5.png";


// 👉 PASTE YOUR IMAGE LINK HERE (leave "" to show the placeholder)
const IMAGE_LINK = image5; // under the 4 boxes

const features = [
  {
    title: "Learn Mode",
    text: "Follow the hand gesture guide and discover which gesture produces each note.",
  },
  {
    title: "Practice Mode",
    text: "Practice musical notes and short sequences to build accuracy and confidence.",
  },
  {
    title: "Composition Mode",
    text: "Create your own melodies with gestures, then play them back.",
  },
  {
    title: "Gesture Recognition",
    text: "Your webcam follows your hand movements in real time and turns each gesture into a musical note, with no extra equipment needed.",
  },
];

export default function AboutPage() {
  return (
    <div className="handnote-home info-page">
      <section className="home-about">
        <div className="home-about-inner">
          <div className="home-eyebrow">
            <span className="home-eyebrow-line" />
            ABOUT
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

          {/* THE 4 BOXES */}
          <div className="home-about-grid">
            {features.map((feature) => (
              <div className="home-about-card" key={feature.title}>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            ))}
          </div>

          {/* ONE BIG IMAGE FILLING THE SPACE BELOW THE BOXES */}
          <div className="info-image-wrap">
            {IMAGE_LINK ? (
              <img
                src={IMAGE_LINK}
                alt="About"
                className="info-image"
              />
            ) : (
              <div className="info-image-placeholder">
                <span>🖼️</span>
                <p>Your image here</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}