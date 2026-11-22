import "./HomePage.css";

export default function HowItWorksPage() {
  return (
    <div className="handnote-home info-page">
      <section className="home-how">
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
    </div>
  );
}