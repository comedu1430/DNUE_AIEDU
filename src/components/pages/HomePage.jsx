import { useEffect, useRef, useState } from "react";
import { getLocalizedProgramsItems } from "../../siteData";

const SPLINE_LANDING_URL = "https://my.spline.design/displacelines-LS4TQIxZI0gVrTKi0K58h1m1/";
const splineRestartUrl = (id) => `${SPLINE_LANDING_URL}?restart=${id}`;
const SPLINE_RESTART_INTERVAL_MS = 55_000;

const handleHomeProgramLinkClick = (event, item, onOpenProtectedProgram) => {
  if (!item.requiresPassword) {
    return;
  }

  event.preventDefault();
  onOpenProtectedProgram(item);
};

function LandingBackdrop() {
  const [frames, setFrames] = useState([{ id: "initial", src: SPLINE_LANDING_URL, loaded: false }]);
  const [activeFrameId, setActiveFrameId] = useState("initial");
  const activeFrameRef = useRef("initial");
  const loadTimersRef = useRef([]);
  const cleanupTimerRef = useRef(null);

  useEffect(() => {
    activeFrameRef.current = activeFrameId;
  }, [activeFrameId]);

  useEffect(() => {
    const restartTimer = window.setInterval(() => {
      setFrames((existingFrames) => {
        if (existingFrames.length > 1) {
          return existingFrames;
        }

        const restartId = Date.now();
        return [...existingFrames, { id: restartId, src: splineRestartUrl(restartId), loaded: false }];
      });
    }, SPLINE_RESTART_INTERVAL_MS);

    return () => {
      window.clearInterval(restartTimer);
      loadTimersRef.current.forEach((timerId) => window.clearTimeout(timerId));
      if (cleanupTimerRef.current) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  const handleFrameLoad = (frameId) => {
    const delay = frameId === "initial" ? 180 : 120;
    const timerId = window.setTimeout(() => {
      setFrames((existingFrames) =>
        existingFrames.map((frame) => (frame.id === frameId ? { ...frame, loaded: true } : frame))
      );

      if (frameId !== activeFrameRef.current) {
        activeFrameRef.current = frameId;
        setActiveFrameId(frameId);

        if (cleanupTimerRef.current) {
          window.clearTimeout(cleanupTimerRef.current);
        }

        cleanupTimerRef.current = window.setTimeout(() => {
          setFrames((existingFrames) => existingFrames.filter((frame) => frame.id === frameId));
        }, 900);
      }
    }, delay);

    loadTimersRef.current.push(timerId);
  };

  return (
    <div className="landing-lightfield" aria-hidden="true">
      {frames.map((frame) => (
        <iframe
          key={frame.id}
          className={`landing-spline ${frame.loaded ? "is-loaded" : ""} ${
            frame.id === activeFrameId ? "is-active" : ""
          }`}
          src={frame.src}
          frameBorder="0"
          loading="eager"
          allow="autoplay; fullscreen"
          title="Landing background"
          onLoad={() => handleFrameLoad(frame.id)}
        />
      ))}
    </div>
  );
}

function HomePage({ language, onOpenProtectedProgram }) {
  const homeProgramItems = getLocalizedProgramsItems(language);

  return (
    <div className="home-stack">
      <section className="landing-page">
        <LandingBackdrop />
        <div className="landing-overlay" />
        <div className="landing-hero reveal-on-scroll is-visible">
          <div className="landing-copy">
            <div className="landing-type-lockup">
              <p className="landing-kicker">
                Daegu National University of Education
                <br />
                Graduate School of AI Education
              </p>
              <h1>
                Research, Pedagogy, and AI Innovation
                <br />
                for Future Learning Environments.
              </h1>
            </div>
            <p className="landing-description">
              Advanced doctoral study and research for AI pedagogy, educational data,
              <br />
              and future classroom innovation across schools, learning design, educational systems.
            </p>
          </div>
        </div>
      </section>

      <section className="home-publications home-news">
        <div className="content-shell home-publications-inner reveal-on-scroll">
          <div className="home-publications-head">
            <p>Programs</p>
          </div>
          <div className="home-publications-grid">
            {homeProgramItems.map((item) => (
              <article key={`${item.date}-${item.title}`} className="home-publication-card">
                <div className="home-publication-year">{item.date}</div>
                <div className="home-publication-items">
                  <div className="home-publication-entry">
                    <p className="home-publication-type">{language === "ko" ? "운영 프로그램" : "Program"}</p>
                    <h3>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(event) => handleHomeProgramLinkClick(event, item, onOpenProtectedProgram)}
                      >
                        {item.displayTitle}
                      </a>
                    </h3>
                    <p className="home-publication-meta">{item.displaySummary}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export { HomePage };
