import { useEffect, useRef, useState } from "react";
import { getLocalizedProgramsItems } from "../../siteData";

const SPLINE_LANDING_URL = "https://my.spline.design/displacelines-LS4TQIxZI0gVrTKi0K58h1m1/";
const splineRestartUrl = (id) => `${SPLINE_LANDING_URL}?restart=${id}`;
const SPLINE_RESTART_INTERVAL_MS = 55_000;
const HOME_PROGRAMS_COLLAPSED_COUNT = 5;

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

function HomePage({ language, onOpenProtectedProgram, onOpenAnnual }) {
  const homeProgramItems = getLocalizedProgramsItems(language);
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const visibleProgramItems = showAllPrograms
    ? homeProgramItems
    : homeProgramItems.slice(0, HOME_PROGRAMS_COLLAPSED_COUNT);
  const hasMorePrograms = homeProgramItems.length > HOME_PROGRAMS_COLLAPSED_COUNT;
  const annualNotice = {
    tag: language === "ko" ? "상단 고정" : "Pinned",
    type: language === "ko" ? "공지" : "Notice",
    title: language === "ko" ? "연간 지속 사업" : "Annual Programs",
    summary:
      language === "ko"
        ? "AI교육전공에서 연중 운영하는 정기 프로그램 일정을 확인할 수 있습니다."
        : "Review the recurring annual programs organized throughout the year in the AI Education major.",
  };

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
            <article className="home-publication-card home-publication-card-pinned">
              <div className="home-publication-year home-publication-year-pinned">
                <span className="home-publication-pin" aria-label={annualNotice.tag}>
                  <span className="sr-only">{annualNotice.tag}</span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path d="M15 4.5a1.5 1.5 0 0 1 1.5 1.5v1.1l1.9 1.9a1 1 0 0 1-.7 1.7h-2v4.2l1.1 1.1a1 1 0 0 1-.7 1.7h-4.1V22a1 1 0 0 1-2 0v-4.4H6.9a1 1 0 0 1-.7-1.7l1.1-1.1v-4.2h-2a1 1 0 0 1-.7-1.7l1.9-1.9V6A1.5 1.5 0 0 1 8 4.5z"></path>
                  </svg>
                </span>
              </div>
              <div className="home-publication-items">
                <div className="home-publication-entry home-publication-entry-pinned">
                  <p className="home-publication-type">{annualNotice.type}</p>
                  <h3>
                    <button type="button" className="home-publication-link-button" onClick={onOpenAnnual}>
                      {annualNotice.title}
                    </button>
                  </h3>
                  <p className="home-publication-meta">{annualNotice.summary}</p>
                </div>
              </div>
            </article>
            {visibleProgramItems.map((item) => (
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
          {hasMorePrograms ? (
            <div className="home-publications-more">
              <button type="button" className="home-publications-more-button" onClick={() => setShowAllPrograms((current) => !current)}>
                {showAllPrograms
                  ? language === "ko"
                    ? "접기"
                    : "Show less"
                  : language === "ko"
                    ? "더보기"
                    : "Show more"}
              </button>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export { HomePage };
