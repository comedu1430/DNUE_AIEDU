import {
  LAB_CARDS,
  STUDENT_CV_PROFILES,
  STUDENT_PROFILES,
  getProfiles,
  getText,
  localizeFacultyOffice,
  personAnchorId,
} from "../../../siteData";

function ProfileGrid({ sectionKey, language }) {
  const text = getText(language);
  const profiles = getProfiles(sectionKey);
  const isFaculty = sectionKey === "faculty";

  return (
    <div className={`profile-grid ${isFaculty ? "faculty-profile-grid" : ""}`}>
      {profiles.map((profile) => {
        const courses = language === "ko" && profile.koCourses ? profile.koCourses : profile.courses || [];
        const displayName = language === "ko" && profile.koName ? profile.koName : profile.name;
        const displayPosition = language === "ko" && profile.koPosition ? profile.koPosition : profile.position;
        const displayResearch = language === "ko" && profile.koResearch ? profile.koResearch : profile.research;
        const displayOffice = localizeFacultyOffice(profile.office, language);

        return (
          <article
            key={`${sectionKey}-${profile.name}`}
            id={personAnchorId({ section: sectionKey, name: profile.name })}
            className={`profile-card ${isFaculty ? "faculty-profile-card no-photo" : ""}`}
          >
            {!isFaculty ? (
              <div className={`profile-image ${profile.image ? "has-photo" : ""} ${profile.imageClassName ?? ""}`} aria-hidden="true">
                {profile.image ? <img className="profile-photo" src={profile.image} alt="" loading="lazy" /> : null}
              </div>
            ) : null}
            {isFaculty ? (
              <>
                <div className="profile-content faculty-profile-main">
                  <div className="faculty-profile-title">
                    <h4>{displayName}</h4>
                    <p>{displayPosition}</p>
                  </div>
                  <div className="faculty-profile-meta">
                    <p><strong>{text.researchArea}</strong> <span>{displayResearch}</span></p>
                    <p><strong>{text.office}</strong> <span>{displayOffice}</span></p>
                    <p><strong>{text.phone}</strong> <span>{profile.phone}</span></p>
                    <p><strong>{text.email}</strong> <span>{profile.email}</span></p>
                  </div>
                </div>
                {courses.length > 0 ? (
                  <div className="profile-courses-block">
                    <p className="profile-courses-heading">{text.courses}</p>
                    <ul>
                      {courses.map((course) => (
                        <li key={`${profile.name}-${course}`}>{course}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </>
            ) : (
              <div className="profile-content">
                <h4>{displayName}</h4>
                <p>{profile.research}</p>
                <p>{profile.office}</p>
                <p>{profile.phone}</p>
                <p>{profile.email}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}

function StudentYearGroups({ language }) {
  const years = ["2024", "2025", "2026"];

  return (
    <div className="student-year-groups">
      {years.map((year) => (
        <section key={year} className="student-year-group">
          <h3>{year}</h3>
          <div className="profile-grid student-profile-grid">
            {STUDENT_PROFILES[year].map((profile) => (
              <article
                key={`${year}-${profile.name}`}
                id={personAnchorId({ section: "students", name: profile.name, year })}
                className="profile-card student-typography-card"
              >
                <div className="profile-content student-typography-content">
                  {language === "ko" ? (
                    <>
                      <h4 className="student-name-ko-primary">{profile.koName}</h4>
                      <p className="student-lab-ko">{profile.koLab}</p>
                    </>
                  ) : (
                    <>
                      <h4 className="student-name-en">{profile.name}</h4>
                      <p className="student-lab-en">{profile.lab}</p>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function LabsShowcase({ onOpenFaculty }) {
  return (
    <div className="labs-showcase">
      <div className="labs-scroll" role="list" aria-label="Lab cards">
        {LAB_CARDS.map((lab) => (
          <article key={lab.title} className="lab-card" role="listitem">
            <h2>
              {lab.title.replace(/\s+Lab$/, "")}
              <span>Lab</span>
            </h2>
            <div className="lab-card-tags">
              {lab.keywords.map((keyword) => (
                <span key={`${lab.title}-${keyword}`}>{keyword}</span>
              ))}
            </div>
            <p className="lab-card-description">{lab.description}</p>
            <button type="button" className="lab-card-homepage-button" onClick={onOpenFaculty} aria-label={`Open ${lab.title}`}>
              <span aria-hidden="true">→</span>
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function StudentCvPage({ slug, onBack, language }) {
  const text = getText(language);
  const profile = STUDENT_CV_PROFILES.find((item) => item.slug === slug);
  const keywords = language === "ko" && profile?.koKeywords?.length ? profile.koKeywords : profile?.keywords || [];
  const education = language === "ko" && profile?.koEducation?.length ? profile.koEducation : profile?.education || [];
  const researchInterests =
    language === "ko" && profile?.koResearchInterests?.length ? profile.koResearchInterests : profile?.researchInterests || [];
  const activities = language === "ko" && profile?.koActivities?.length ? profile.koActivities : profile?.activities || [];
  const presentedPapers =
    language === "ko" && profile?.koPresentedPapers?.length ? profile.koPresentedPapers : profile?.presentedPapers || [];

  if (!profile) {
    return null;
  }

  return (
    <section className="internal-page student-cv-page" id="content">
      <div className="content-shell student-cv-shell reveal-on-scroll is-visible">
        <button type="button" className="student-cv-back" onClick={onBack}>
          ← {text.backToStudents}
        </button>
        <div className="student-cv-header">
          <p className="student-cv-kicker">Ed. D. Students · {profile.year}</p>
          <h1>{language === "ko" ? profile.koName : profile.name}</h1>
          <div className="student-cv-meta">
            <p>
              <span>{text.email}</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p>
              <span>{text.lab}</span>
              {language === "ko" ? profile.koLab : profile.lab}
            </p>
          </div>
        </div>
        <div className="student-cv-stack">
          <section className="student-cv-section">
            <h3>{text.researchKeywords}</h3>
            <p>{keywords.join(" / ")}</p>
          </section>
          <section className="student-cv-section">
            <h3>{text.education}</h3>
            <ul>
              {education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="student-cv-section">
            <h3>{text.researchInterests}</h3>
            <ul>
              {researchInterests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="student-cv-section">
            <h3>{text.academicActivities}</h3>
            <ul>
              {activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="student-cv-section">
            <h3>{text.presentedPapers}</h3>
            {presentedPapers.length > 0 ? (
              <ul>
                {presentedPapers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>{text.noPresentedPapers}</p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

export { LabsShowcase, ProfileGrid, StudentCvPage, StudentYearGroups };
