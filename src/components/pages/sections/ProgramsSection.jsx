import { useEffect, useState } from "react";
import { getLocalizedAnnualPrograms, getLocalizedProgramsItems, openExternalLink } from "../../../siteData";
import { GraduationPasswordGate } from "./AccessGate";

function ProgramsPage({ language, sectionKey, onBackToPrograms, onOpenAnnual, initialProtectedItem, onClearProtectedItem }) {
  const annualPrograms = getLocalizedAnnualPrograms(language);
  const isKorean = language === "ko";
  const programItems = getLocalizedProgramsItems(language);
  const [protectedItem, setProtectedItem] = useState(initialProtectedItem ?? null);
  const annualNotice = {
    tag: isKorean ? "공지" : "Notice",
    type: isKorean ? "공지" : "Notice",
    title: isKorean ? "연간 지속 사업" : "Annual Programs",
    summary: isKorean
      ? "AI교육전공에서 연중 운영하는 정기 프로그램 일정을 확인할 수 있습니다."
      : "Review the recurring annual programs organized throughout the year in the AI Education major.",
  };
  const showAnnualDetail = sectionKey === "annual";

  useEffect(() => {
    setProtectedItem(null);
  }, [sectionKey]);

  useEffect(() => {
    setProtectedItem(initialProtectedItem ?? null);
  }, [initialProtectedItem]);

  const handleProjectLinkClick = (event, item) => {
    if (!item.requiresPassword) {
      return;
    }

    event.preventDefault();
    setProtectedItem(item);
    onClearProtectedItem?.();
  };

  const handleProtectedUnlock = () => {
    if (!protectedItem?.href) {
      return;
    }

    const targetHref = protectedItem.href;
    setProtectedItem(null);
    onClearProtectedItem?.();
    openExternalLink(targetHref);
  };

  if (protectedItem) {
    return (
      <GraduationPasswordGate
        key={protectedItem.href}
        language={language}
        onUnlock={handleProtectedUnlock}
        onBack={() => {
          setProtectedItem(null);
          onClearProtectedItem?.();
        }}
      />
    );
  }

  return (
    <div className="about-overview news-overview">
      {showAnnualDetail ? (
        <div className="about-text-stack news-annual-stack">
          <button type="button" className="news-detail-back" onClick={onBackToPrograms}>
            ← {isKorean ? "운영 프로그램 목록으로 돌아가기" : "Back to Program List"}
          </button>
          {annualPrograms.map((item) => (
            <section key={item.number} className="about-text-section">
              <div className="about-section-head">
                <span className="about-section-index">{item.number}</span>
                <h3>{item.displayTitle}</h3>
              </div>
              <div className="about-section-body">
                <ul className="about-point-list">
                  <li>{isKorean ? `일정: ${item.displaySchedule}` : `Schedule: ${item.displaySchedule}`}</li>
                  <li>{isKorean ? `안내: ${item.displayNote}` : `Note: ${item.displayNote}`}</li>
                </ul>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="publication-list">
          <>
            <article
              className="publication-item news-project-item news-notice-item is-clickable"
              role="button"
              tabIndex={0}
              onClick={onOpenAnnual}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onOpenAnnual();
                }
              }}
            >
              <p className="publication-type">{annualNotice.type}</p>
              <h4>
                <button
                  type="button"
                  className="news-notice-link"
                  onClick={(event) => {
                    event.stopPropagation();
                    onOpenAnnual();
                  }}
                >
                  {annualNotice.title}
                </button>
              </h4>
              <p>{annualNotice.summary}</p>
            </article>
            {programItems.map((item) => (
              <article key={`${item.date}-${item.title}`} className="publication-item news-project-item">
                <p className="publication-year-tag">{item.date}</p>
                <h4>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(event) => handleProjectLinkClick(event, item)}
                  >
                    {item.displayTitle}
                  </a>
                </h4>
                <p>{item.displaySummary}</p>
              </article>
            ))}
          </>
        </div>
      )}
    </div>
  );
}

export { ProgramsPage };
