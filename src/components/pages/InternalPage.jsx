import { useEffect, useState } from "react";
import { getDefaultSection, getMenu, getPageContent, getSectionLabel, getText, getVisibleSections } from "../../siteData";
import {
  AboutOverview,
  AcademicCalendarPage,
  CurriculumPage,
  GraduationPasswordGate,
  GraduationRequirements,
  LabsShowcase,
  NewsPage,
  ProfileGrid,
  PublicationList,
  StudentYearGroups,
} from "./SectionContent";

function InternalPage({
  menuKey,
  sectionKey,
  onSectionSelect,
  language,
  graduationUnlocked,
  onUnlockGraduation,
  pendingProtectedNewsItem,
  onClearProtectedNewsItem,
}) {
  const text = getText(language);
  const menu = getMenu(menuKey);
  const content = getPageContent(menuKey, sectionKey, language);
  const currentSection = sectionKey || getDefaultSection(menuKey);
  const visibleSections = getVisibleSections(menuKey);
  const currentLabel = currentSection ? getSectionLabel(menuKey, currentSection) : "";
  const isAbout = menuKey === "about";
  const showVisual = false;
  const showProfiles = menuKey === "people";
  const showLabs = menuKey === "labs";
  const showPublications = menuKey === "research";
  const showNews = menuKey === "news";
  const showGraduationRequirements = menuKey === "academics" && currentSection === "graduation";
  const showAcademicCalendar = menuKey === "academics" && currentSection === "calendar";
  const showCurriculum = menuKey === "academics" && currentSection === "curriculum";
  const useWidePeopleLayout = menuKey === "people" && (currentSection === "faculty" || currentSection === "students");
  const useWideLabsLayout =
    menuKey === "labs" || menuKey === "news" || showCurriculum || showGraduationRequirements || showAcademicCalendar || isAbout;
  const [publicationQuery, setPublicationQuery] = useState("");
  const [publicationSearchMode, setPublicationSearchMode] = useState("authors");

  useEffect(() => {
    if (showPublications) {
      setPublicationQuery("");
    }
  }, [showPublications, currentSection]);

  if (!menu || !content) {
    return null;
  }

  return (
    <section className="internal-page" id="content">
      <div className="internal-header-block reveal-on-scroll">
        <h1>{content.title}</h1>
        {visibleSections.length > 0 ? (
          <div className="section-tabs" role="tablist" aria-label={`${content.title} sections`}>
            {visibleSections.map((section) => {
              const isProjectSection =
                menuKey === "news" &&
                currentSection.startsWith("projects-") &&
                section.key === "projects-2026";

              return (
                <button
                  key={section.key}
                  type="button"
                  className={`section-tab ${currentSection === section.key || isProjectSection ? "is-active" : ""}`}
                  onClick={() => onSectionSelect(menuKey, section.key)}
                >
                  {section.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div
        className={`content-shell internal-grid reveal-on-scroll ${showVisual ? "" : "single-column"} ${
          showPublications ? "research-layout" : ""
        } ${useWidePeopleLayout ? "wide-people-layout" : ""} ${useWideLabsLayout ? "wide-labs-layout" : ""}`}
      >
        <article className="internal-copy">
          {isAbout ? <AboutOverview sectionKey={currentSection} language={language} /> : null}
          {!isAbout && !showPublications && !showLabs && !showNews && !showGraduationRequirements && !showAcademicCalendar && !showCurriculum ? <h2>{currentLabel || content.headline}</h2> : null}
          {!isAbout && !showPublications && !showLabs && !showNews && !showGraduationRequirements && !showAcademicCalendar && !showCurriculum && content.subheadline ? <h3>{content.subheadline}</h3> : null}
          {!isAbout && !showPublications && !showLabs && !showNews && !showGraduationRequirements && !showAcademicCalendar && !showCurriculum ? content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : null}
          {showGraduationRequirements ? (
            graduationUnlocked ? <GraduationRequirements language={language} /> : <GraduationPasswordGate language={language} onUnlock={onUnlockGraduation} />
          ) : null}
          {showAcademicCalendar ? <AcademicCalendarPage language={language} /> : null}
          {showCurriculum ? <CurriculumPage language={language} /> : null}
          {showNews ? (
            <NewsPage
              language={language}
              sectionKey={currentSection}
              onBackToNews={() => onSectionSelect("news", "")}
              onOpenAnnual={() => onSectionSelect("news", "annual")}
              initialProtectedItem={pendingProtectedNewsItem}
              onClearProtectedItem={onClearProtectedNewsItem}
            />
          ) : null}
          {showPublications ? (
            <div className="publication-search">
              <label className="publication-search-label" htmlFor="publication-search">
                {text.searchPublications}
              </label>
              <div className="publication-search-row">
                <div className="section-select-wrap publication-search-select-wrap">
                  <label className="sr-only" htmlFor="publication-search-mode">
                    {text.selectPublicationSearchMode}
                  </label>
                  <select
                    id="publication-search-mode"
                    className="section-select publication-search-select"
                    value={publicationSearchMode}
                    onChange={(event) => setPublicationSearchMode(event.target.value)}
                  >
                    <option value="authors">{text.author}</option>
                    <option value="title">{text.title}</option>
                  </select>
                </div>
                <input
                  id="publication-search"
                  className="publication-search-input"
                  type="search"
                  placeholder={publicationSearchMode === "authors" ? text.searchByAuthor : text.searchByTitle}
                  value={publicationQuery}
                  onChange={(event) => setPublicationQuery(event.target.value)}
                />
              </div>
            </div>
          ) : null}
          {showProfiles && currentSection === "faculty" ? <ProfileGrid sectionKey={currentSection} language={language} /> : null}
          {menuKey === "people" && currentSection === "students" ? <StudentYearGroups language={language} /> : null}
          {showLabs ? <LabsShowcase onOpenFaculty={() => onSectionSelect("people", "faculty")} /> : null}
        </article>
        {showPublications ? <PublicationList sectionKey={currentSection} query={publicationQuery} searchMode={publicationSearchMode} language={language} /> : null}
      </div>
    </section>
  );
}

export { InternalPage };
