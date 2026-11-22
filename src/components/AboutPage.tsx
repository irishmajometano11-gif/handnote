import "./HomePage.css";

export default function AboutPage() {
  return (
    <div className="handnote-home info-page">
      <section className="home-about">
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