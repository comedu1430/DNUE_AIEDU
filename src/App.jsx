import { useEffect, useMemo, useRef, useState } from "react";

const SITE_MAP = [
  {
    key: "about",
    label: "ABOUT",
    sections: [
      { key: "greetings", label: "Overview" },
      { key: "introduction", label: "Vision" },
      { key: "history", label: "Educational Goals" },
      { key: "donation", label: "Career Paths" },
      { key: "reservation", label: "Contact" },
    ],
  },
  {
    key: "people",
    label: "PEOPLE",
    sections: [
      { key: "faculty", label: "Faculty" },
      { key: "students", label: "PhD Students" },
    ],
  },
  {
    key: "research",
    label: "RESEARCH",
    sections: [
      { key: "all", label: "All" },
      { key: "international-journal", label: "International Journal" },
      { key: "international-conference", label: "International Conference" },
      { key: "korean-journal", label: "Korean Journal" },
      { key: "korean-conference", label: "Korean Conference" },
      { key: "prizes", label: "Prizes" },
    ],
  },
  {
    key: "academics",
    label: "ACADEMICS",
    sections: [
      { key: "admission", label: "Admissions" },
      { key: "notices", label: "Program Notices" },
      { key: "graduation", label: "Graduation Requirements" },
      { key: "completion", label: "Completion Guide" },
      { key: "curriculum", label: "Curriculum" },
      { key: "certificate", label: "Professional Competencies" },
      { key: "resources", label: "Resources" },
      { key: "integrated", label: "Interdisciplinary Extension" },
    ],
  },
  {
    key: "news",
    label: "NEWS",
    sections: [
      { key: "school-news", label: "Department News" },
      { key: "seminars", label: "Seminars" },
      { key: "media", label: "Media" },
      { key: "announcements", label: "Announcements" },
    ],
  },
  {
    key: "bk21",
    label: "PROJECT",
    sections: [
      { key: "welcome", label: "Overview" },
      { key: "vision", label: "Vision" },
      { key: "members", label: "Participants" },
      { key: "projects", label: "Project Notices" },
      { key: "achievements", label: "Achievements" },
      { key: "bk-resources", label: "Resources" },
    ],
  },
];

const NEWS_ITEMS = [
  { title: "The AI Education major overview and educational goals have been organized from official materials.", date: "OVERVIEW" },
  { title: "The faculty page now reflects official research areas and contact details.", date: "FACULTY" },
  { title: "The doctoral curriculum has been structured for quick reference.", date: "CURRICULUM" },
];

const RESEARCH_ITEMS = [
  { title: "AI Education Research Methodology", date: "REQUIRED" },
  { title: "AI-based Teaching and Learning Methodology", date: "ELECTIVE" },
  { title: "AI Curriculum and Class Consulting", date: "PRACTICE" },
];

const FACULTY_PROFILES = [
  {
    name: "Panwoo Park",
    position: "Professor",
    office: "Sangnok Education Hall 407",
    email: "pwpark@dnue.ac.kr",
    phone: "053-620-1432",
    research: "Computer Education, AI Education, Distance Education",
    courses: [
      "AI Education Research Methodology: develops scientific reasoning, measurement tools, and analytical methods required for AI education research.",
      "AI Education Research Seminar: reviews recent research trends in AI education and strengthens the ability to critically evaluate research design and findings.",
      "AI Curriculum and Class Consulting: compares domestic and international AI curricula and explores practical methods for curriculum design and class consulting.",
    ],
  },
  {
    name: "Inhwan Yoo",
    position: "Professor",
    office: "Sangnok Education Hall 408",
    email: "bluenull@dnue.ac.kr",
    phone: "053-620-1434",
    research: "Computer Education, AI Education",
    courses: [
      "SW/AI Education Topics: examines the theoretical background, current technologies, and international trends in SW-AI education.",
      "Data Science Topics: covers core concepts and techniques in data science and explores how data supports AI model development.",
      "AI-based Teaching and Learning Methodology: studies instructional design, assessment, inquiry learning, and the effective use of AI tools in teaching.",
    ],
  },
  {
    name: "Youngkwon Bae",
    position: "Professor",
    office: "Sangnok Education Hall 406",
    email: "bae@dnue.ac.kr",
    phone: "053-620-1435",
    research: "Computer Education, AI Education",
    courses: [
      "AI Digital Policy Seminar: investigates domestic and international AI and digital policies and discusses their implications for educational settings.",
      "AI Digital Innovation Plan Seminar: explores recent theories and practices in digital innovation from the perspectives of students, teachers, administrators, and parents.",
      "AI-based Educational Content Development: studies methods for designing and developing educational content with AI-supported tools.",
    ],
  },
  {
    name: "Wooyeol Kim",
    position: "Professor",
    office: "Sangnok Education Hall 403",
    email: "john@dnue.ac.kr",
    phone: "053-620-1431",
    research: "Computer Education, AI Education",
    courses: [
      "Advanced Research in Programming Languages: explores programming for computational problem solving through the perspective of programming language theory.",
      "Understanding AI Digital Leadership: discusses strategies and execution required for leaders in educational environments shaped by AI and digital change.",
      "AI Digital Education Project Research: develops applied and collaborative capability through team-based research projects in AI and digital education.",
    ],
  },
  {
    name: "Youngho Lee",
    position: "Professor",
    office: "Sangnok Education Hall 402",
    email: "yhlee@dnue.ac.kr",
    phone: "053-620-1433",
    research: "Computer Education, AI Education",
    courses: [
      "AI Digital Literacy Research: analyzes AI digital literacy assessment tools from media, ethics, and tool-use perspectives for classroom application.",
      "Topics in AI Programming: studies current AI programming techniques and includes practice in implementing and evaluating AI models with diverse datasets.",
    ],
  },
  {
    name: "Jaekwon Shim",
    position: "Professor",
    office: "Sangnok Education Hall 404",
    email: "jkshim@dnue.ac.kr",
    phone: "053-620-1437",
    research: "Computer Education, AI Education",
    courses: [
      "AI Education Consulting Topics: examines consulting elements for innovative teaching and learning strategies across the design and delivery of AI education.",
      "AIDT Research: analyzes AI-based teaching and learning platforms and digital textbooks in terms of pedagogy, content, environment, and learning ecology.",
    ],
  },
];

const STUDENT_PROFILES = [
  {
    name: "Graduate Students in AI Education",
    position: "Master's and Doctoral Tracks",
    office: "Graduate School of AI Education",
    email: "graduate@dnue.ac.kr",
    phone: "053-620-1430",
    research: "AI literacy, curriculum design, classroom innovation, and educational data use",
  },
];

const RESEARCH_CARD_SETS = {
  all: [
    {
      title: "Selected publications from journals, conferences, and academic presentations",
      summary: "This section can present the overall publication archive of the AI Education major, including international and domestic outputs.",
      variant: "left",
    },
    {
      title: "Research outputs in AI education, curriculum design, and classroom innovation",
      summary: "Items can later be organized by publication type to help visitors browse the academic profile of the major more clearly.",
      variant: "right",
    },
  ],
  "international-journal": [
    {
      title: "International journal publications",
      summary: "Use this category for peer-reviewed journal articles published in international academic journals.",
      variant: "left",
    },
    {
      title: "Research articles with global academic visibility",
      summary: "This area can highlight internationally indexed work related to AI education, digital literacy, and instructional design.",
      variant: "right",
    },
  ],
  "international-conference": [
    {
      title: "International conference papers",
      summary: "Use this category for presentations and proceedings published through international conferences.",
      variant: "left",
    },
    {
      title: "Conference-based dissemination of current research",
      summary: "This section can collect recent presentations and international academic exchange outcomes.",
      variant: "right",
    },
  ],
  "korean-journal": [
    {
      title: "Korean journal publications",
      summary: "Use this category for peer-reviewed articles published in domestic academic journals.",
      variant: "left",
    },
    {
      title: "Domestic scholarship in AI education",
      summary: "This section can archive Korean journal articles that represent the major's research foundations and applied studies.",
      variant: "right",
    },
  ],
  "korean-conference": [
    {
      title: "Korean conference papers",
      summary: "Use this category for domestic conference presentations, proceedings, and related academic activities.",
      variant: "left",
    },
    {
      title: "Local academic engagement and presentation records",
      summary: "This area can present conference outputs connected to the Korean academic community.",
      variant: "right",
    },
  ],
  prizes: [
    {
      title: "Awards and prizes",
      summary: "Use this category for awards, recognitions, and major distinctions received by faculty and students.",
      variant: "left",
    },
    {
      title: "Academic and institutional recognition",
      summary: "This section can highlight notable achievements that reflect the quality and impact of the program.",
      variant: "right",
    },
  ],
};

const PAGE_COPY = {
  about: {
    title: "About",
    headline: "Graduate School of AI Education",
    subheadline: "",
    body: {
      greetings: [
        "The AI Education major prepares specialists in AI education who can cultivate creative and convergent talent for the age of artificial intelligence.",
        "The program operates a curriculum designed to develop expertise in three areas: AI scholarship and research, AI-integrated education, and AI-enabled educational practice.",
        "It also prepares educators who can respond to technological change in artificial intelligence, robotics, big data, and the Internet of Things and lead innovation in school education.",
      ],
      introduction: [
        "Grounded in an understanding of current AI technologies, the major pursues interdisciplinary research across education, computer science, data science, and the social sciences.",
        "Its vision is to lead shifts in the educational paradigm in the age of AI and to nurture creative and critically minded professionals for future society.",
      ],
      history: [
        "First, students build theoretical expertise in AI education and acquire current research methodologies to conduct creative and innovative inquiry.",
        "Second, they study programming languages and AI technologies in depth so that they can develop effective AI-based teaching and learning content.",
        "Third, they strengthen competence in AI digital policy and leadership to analyze problems in educational settings and propose effective consulting-based solutions.",
        "Fourth, they investigate personalized educational design and assessment methods using data science and AI in order to develop field-centered practical education models.",
        "Fifth, they build sound values and attitudes for future learning environments based on AI literacy and ethical understanding, and practice the social responsibility of AI education.",
      ],
      donation: [
        "Graduates may become AI education researchers who investigate teaching and learning strategies, assessment methods, and policy directions for effective educational use of AI technologies.",
        "They may also advance into roles as school administrators or educational specialists who lead future-oriented policy, school management, and educational innovation in schools and education offices.",
        "Another pathway is work in public and private research institutes or AI-based education companies, where graduates can contribute to educational data analysis, AI system planning and evaluation, policy development, and advisory work.",
      ],
      reservation: [
        "• Admissions inquiries: Graduate School Administration Office 053-620-1299",
        "• Academic inquiries: Graduate School of AI Education Office 053-620-1430",
        "• Location: Sangnok Education Hall 405",
      ],
      default: [
        "This page introduces the overall direction and educational goals of the AI Education major.",
      ],
    },
  },
  people: {
    title: "People",
    headline: "Faculty and members of the AI Education major",
    subheadline: "",
    body: {
      faculty: [],
      students: [],
      default: [
        "This page introduces the faculty and academic members who shape the AI Education major.",
      ],
    },
  },
  research: {
    title: "Publications",
    headline: "Publication categories and academic outputs",
    subheadline: "",
    body: {
      all: [
        "This page can serve as the central publication archive for the AI Education major.",
        "Journal articles, conference papers, and awards can be organized by category so that visitors can browse academic outputs at a glance.",
      ],
      "international-journal": [
        "This category can be used for international journal articles related to AI education, digital pedagogy, instructional design, and educational innovation.",
      ],
      "international-conference": [
        "This category can collect papers, proceedings, and presentations shared through international conferences and global academic events.",
      ],
      "korean-journal": [
        "This category can organize domestic journal publications that reflect scholarly work in Korean academic contexts.",
      ],
      "korean-conference": [
        "This category can present domestic conference papers, workshop presentations, and local academic exchange outcomes.",
      ],
      prizes: [
        "This category can highlight awards, prizes, and recognitions received by faculty members and students.",
      ],
      default: [
        "This page is intended to organize publication and achievement records in a clear and searchable way.",
      ],
    },
  },
  academics: {
    title: "Academics",
    headline: "Curriculum and academic structure of the AI Education major",
    subheadline: "",
    body: {
      admission: [
        "Detailed admissions schedules and procedures can later be aligned with the official guidance of the Graduate School of Education.",
        "At present, this page serves as an introduction for applicants interested in AI education, curriculum design, and educational innovation.",
      ],
      notices: [
        "This section can be used for program updates related to admissions, courses, events, and academic materials.",
      ],
      graduation: [
        "The graduation requirements page can later summarize credits, thesis expectations, research progress, and review procedures according to official regulations.",
        "Because this kind of information is policy-heavy, it is important to keep the structure clear and easy to scan.",
      ],
      completion: [
        "The completion guide is suitable for summarizing required courses, electives, thesis completion, and semester-based credit structure.",
      ],
      curriculum: [
        "According to the official doctoral curriculum, the required major courses are SW/AI Education Topics, AI Education Research Methodology, and Advanced Research in Programming Languages.",
        "Elective courses include AI Digital Policy Seminar, AI Education Consulting Topics, AI Digital Innovation Plan Seminar, AI Digital Literacy Research, AIDT Research, Understanding AI Digital Leadership, Understanding Giftedness and AI, Topics in AI Programming, Data Science Topics, AI and Media Art, AI Education Research Seminar, AI Digital Education Project Research, AI-based Teaching and Learning Methodology, AI-based Educational Content Development, and AI Curriculum and Class Consulting.",
      ],
      certificate: [
        "The major aims to develop three types of specialists: experts in AI scholarship and research, experts in AI-convergent education, and experts in AI-enabled educational practice.",
        "On that basis, a more detailed competency framework or certificate track can be added in the future.",
      ],
      resources: [
        "This resource section can later provide syllabi, academic forms, research references, and administrative documents.",
      ],
      integrated: [
        "The AI Education major is interdisciplinary in nature, combining education, computer science, data science, sociology, and related fields.",
        "Its direction can therefore expand beyond classroom implementation into policy, leadership, content development, assessment, and data-informed practice.",
      ],
      default: [
        "This page is intended to present the curriculum and academic structure of the program in a systematic way.",
      ],
    },
  },
  news: {
    title: "News",
    headline: "Program news, seminars, and announcements",
    subheadline: "",
    body: {
      "school-news": [
        "The AI Education major homepage is currently organized around the official program overview, faculty information, and curriculum content.",
        "In the future, this section can feature academic events, faculty achievements, student projects, and program updates.",
      ],
      seminars: [
        "The seminar section can introduce topics related to AI education, instructional design, digital literacy, data science, and practical classroom use of AI.",
      ],
      media: [
        "The media area can archive interviews, feature articles, research spotlights, and external coverage.",
      ],
      announcements: [
        "Announcements can be used for schedule changes, operational notices, document guidance, and course-related information.",
      ],
      default: [
        "This page is intended to collect and deliver the latest information related to the program.",
      ],
    },
  },
  bk21: {
    title: "Project",
    headline: "A flexible section for project overview and future expansion",
    subheadline: "",
    body: {
      welcome: [
        "This page can later be used for a project overview or a welcome message from the project lead.",
      ],
      vision: [
        "The vision page can present long-term direction, strategy, and key research and education priorities.",
      ],
      members: [
        "The participants page can organize faculty, researchers, and graduate students involved in the project.",
      ],
      projects: [
        "Project notices can be used for support information, schedules, updates, and operating documents.",
      ],
      achievements: [
        "The achievements page can be used to present research outputs, reports, awards, and cases in an organized way.",
      ],
      "bk-resources": [
        "The resources page can collect project forms, reports, and operational documents.",
      ],
      default: [
        "This project section is prepared as a separate area for future expansion.",
      ],
    },
  },
};

function getMenu(menuKey) {
  return SITE_MAP.find((menu) => menu.key === menuKey);
}

function getSectionLabel(menuKey, sectionKey) {
  return getMenu(menuKey)?.sections.find((section) => section.key === sectionKey)?.label || "";
}

function getPageContent(menuKey, sectionKey) {
  const page = PAGE_COPY[menuKey];
  if (!page) {
    return null;
  }
  return {
    ...page,
    paragraphs: page.body[sectionKey] || page.body.default || [],
  };
}

function getProfiles(sectionKey) {
  if (sectionKey === "faculty") {
    return FACULTY_PROFILES;
  }
  if (sectionKey === "students") {
    return STUDENT_PROFILES;
  }
  return FACULTY_PROFILES;
}

function Brand({ dark, onHome }) {
  return (
    <button className="brand" type="button" aria-label="Home" onClick={onHome}>
      <span className={`brand-mark ${dark ? "is-dark" : "is-light"}`} aria-hidden="true" />
      <span className="brand-text">
        Daegu National University of Education
        <br />
        Graduate School of AI Education
      </span>
    </button>
  );
}

function Header({ dark, isHome, onHome, onNavigate, onOpenMenu, desktopMenuKey, onToggleDesktopMenu }) {
  return (
    <header className={`top-header ${dark ? "is-dark" : "is-light"} ${isHome ? "is-home" : "is-inner"}`}>
      <Brand dark={dark} onHome={onHome} />
      <nav
        className="desktop-nav"
        aria-label="Primary"
        onMouseLeave={() => onToggleDesktopMenu("")}
      >
        <ul className="desktop-nav-list">
          {SITE_MAP.map((menu) => (
            <li
              key={menu.key}
              className={`desktop-nav-item ${desktopMenuKey === menu.key ? "is-open" : ""}`}
              onMouseEnter={() => {
                if (menu.sections.length > 0) {
                  onToggleDesktopMenu(menu.key);
                }
              }}
            >
              <button className="desktop-nav-link" type="button" onClick={() => onNavigate(menu.key, "")}>
                {menu.label}
              </button>
              {menu.sections.length > 0 ? (
                <div className="desktop-dropdown">
                  {menu.sections.map((section) => (
                    <button
                      key={section.key}
                      type="button"
                      className="desktop-dropdown-link"
                      onClick={() => onNavigate(menu.key, section.key)}
                    >
                      {section.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
      <button className={`menu-button ${dark ? "is-dark" : "is-light"}`} type="button" aria-label="Open menu" onClick={onOpenMenu}>
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

function HeroSummaryList({ title, items }) {
  return (
    <div className="hero-summary-list">
      <div className="hero-summary-head">
        <h5>{title}</h5>
        <button type="button">MORE</button>
      </div>
      <ul>
        {items.map((item) => (
          <li key={`${title}-${item.title}`}>
            <p>{item.title}</p>
            <span>{item.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HomePage() {
  return (
    <section className="landing-page">
      <video className="landing-bg-video" autoPlay muted loop playsInline preload="metadata" aria-hidden="true">
        <source src="https://gsds.snu.ac.kr/wp-content/uploads/2023/03/Sequence-013.mp4" type="video/mp4" />
      </video>
      <div className="landing-overlay" />
      <div className="landing-copy">
        <h1>
          Daegu National University of Education
          <br />
          Graduate School of AI Education
        </h1>
        <p>
          The AI Education major prepares specialists who can cultivate creative and convergent talent for the age of artificial intelligence
          while building both theoretical understanding and practical capability for innovation in school education.
        </p>
        <a className="learn-more" href="#content">
          LEARN MORE
        </a>
      </div>
      <div className="hero-summary-bar">
        <div className="hero-summary-grid">
          <HeroSummaryList title="NEWS" items={NEWS_ITEMS} />
          <HeroSummaryList title="RESEARCH HIGHLIGHTS" items={RESEARCH_ITEMS} />
        </div>
      </div>
    </section>
  );
}

function EditorialVisual() {
  return (
    <aside className="editorial-visual" aria-hidden="true">
      <svg viewBox="0 0 620 520">
        <g fill="none" stroke="rgba(0,0,0,0.18)" strokeWidth="1">
          {Array.from({ length: 40 }).map((_, i) => {
            const scale = 1 - i * 0.015;
            const rotate = i * 6;
            return (
              <path
                key={i}
                d="M310 60 C420 45, 545 120, 540 260 C535 420, 370 470, 245 452 C110 430, 58 300, 86 198 C118 86, 205 74, 310 60 Z"
                transform={`translate(310 260) scale(${scale}) rotate(${rotate}) translate(-310 -260)`}
              />
            );
          })}
        </g>
      </svg>
    </aside>
  );
}

function ResearchCards({ sectionKey }) {
  const cards = RESEARCH_CARD_SETS[sectionKey] || RESEARCH_CARD_SETS.all;

  return (
    <div className="research-card-grid">
      {cards.map((card) => (
        <article key={card.title} className="research-card">
          <div className={`research-card-art ${card.variant}`} aria-hidden="true">
            <div className="research-card-ring outer" />
            <div className="research-card-ring inner" />
          </div>
          <h4>{card.title}</h4>
          <p>{card.summary}</p>
        </article>
      ))}
    </div>
  );
}

function ProfileGrid({ sectionKey }) {
  const profiles = getProfiles(sectionKey);
  const isFaculty = sectionKey === "faculty";

  return (
    <div className={`profile-grid ${isFaculty ? "faculty-profile-grid" : ""}`}>
      {profiles.map((profile) => (
        <article key={`${sectionKey}-${profile.name}`} className={`profile-card ${isFaculty ? "faculty-profile-card" : ""}`}>
          <div className="profile-image" aria-hidden="true" />
          <div className="profile-content">
            <h4>{profile.name}</h4>
            <p>{profile.position}</p>
            {isFaculty ? (
              <>
                <p><strong>Research Area</strong> {profile.research}</p>
                <p><strong>Courses</strong> {profile.courses.join(" / ")}</p>
                <p><strong>Office</strong> {profile.office}</p>
                <p><strong>Phone</strong> {profile.phone}</p>
                <p><strong>Email</strong> {profile.email}</p>
              </>
            ) : (
              <>
                <p>{profile.research}</p>
                <p>{profile.office}</p>
                <p>{profile.phone}</p>
                <p>{profile.email}</p>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function InternalPage({ menuKey, sectionKey, onSectionSelect }) {
  const menu = getMenu(menuKey);
  const content = getPageContent(menuKey, sectionKey);
  const currentSection = sectionKey || menu?.sections[0]?.key || "";
  const currentLabel = currentSection ? getSectionLabel(menuKey, currentSection) : "";
  const showVisual = menuKey === "about";
  const showProfiles = menuKey === "people";
  const showResearchCards = menuKey === "research";
  const useWidePeopleLayout = menuKey === "people" && currentSection === "faculty";

  if (!menu || !content) {
    return null;
  }

  return (
    <section className="internal-page" id="content">
      <div className="internal-header-block">
        <h1>{content.title}</h1>
        {menu.sections.length > 0 ? (
          <div className="section-tabs" role="tablist" aria-label={`${content.title} sections`}>
            {menu.sections.map((section) => (
              <button
                key={section.key}
                type="button"
                className={`section-tab ${currentSection === section.key ? "is-active" : ""}`}
                onClick={() => onSectionSelect(menuKey, section.key)}
              >
                {section.label}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <div className={`content-shell internal-grid ${showVisual ? "" : "single-column"} ${showResearchCards ? "research-layout" : ""} ${useWidePeopleLayout ? "wide-people-layout" : ""}`}>
        <article className="internal-copy">
          {!showResearchCards ? <h2>{currentLabel || content.headline}</h2> : null}
          {!showResearchCards && content.subheadline ? <h3>{content.subheadline}</h3> : null}
          {!showResearchCards ? content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : null}
          {showProfiles ? <ProfileGrid sectionKey={currentSection} /> : null}
        </article>
        {showVisual ? <EditorialVisual /> : null}
        {showResearchCards ? <ResearchCards sectionKey={currentSection} /> : null}
      </div>
    </section>
  );
}

function Footer({ isHome, onNavigate }) {
  return (
    <footer className={`site-footer ${isHome ? "is-home" : "is-inner"}`}>
      <div className="footer-main-tone">
        <div className="content-shell footer-grid">
          <div className="footer-sitemap">
            {SITE_MAP.map((group) => (
              <div key={group.key} className="footer-column">
                <button type="button" className="footer-heading" onClick={() => onNavigate(group.key, "")}>
                  {group.label}
                </button>
                {group.sections.length > 0 ? (
                  <ul>
                    {group.sections.map((section) => (
                      <li key={section.key}>
                        <button type="button" className="footer-link" onClick={() => onNavigate(group.key, section.key)}>
                          {section.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
          <div className="footer-signature">
            <button className="footer-signature-home" type="button" onClick={() => onNavigate("home", "")} aria-label="Home">
              <span className={`footer-signature-mark ${isHome ? "is-dark" : "is-light"}`} aria-hidden="true" />
              <span className="footer-signature-title">
                Daegu National University of Education
                <br />
                Graduate School of AI Education
              </span>
            </button>
            <div className="footer-meta">
              <p>Daegu National University of Education Graduate School of AI Education © 2026. All rights reserved.</p>
              <p>Privacy Policy</p>
              <p>Video Information Processing Policy</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function MenuOverlay({ expandedMenuKey, onToggleMenu, onSelectSection, onClose }) {
  return (
    <aside className="menu-overlay" aria-modal="true" role="dialog">
      <div className="menu-panel">
        <button className="close-button" type="button" aria-label="Close menu" onClick={onClose}>
          ×
        </button>
        <div className="menu-list">
          {SITE_MAP.map((menu) => (
            <div key={menu.key} className={`menu-group ${expandedMenuKey === menu.key ? "is-expanded" : ""}`}>
              <button className="menu-link" type="button" onClick={() => onToggleMenu(menu.key)}>
                <span>{menu.label}</span>
              </button>
              {menu.sections.length > 0 ? (
                <ul className={`submenu-list ${expandedMenuKey === menu.key ? "is-open" : ""}`}>
                  {menu.sections.map((sub) => (
                    <li key={sub.key}>
                      <button type="button" className="submenu-link" onClick={() => onSelectSection(menu.key, sub.key)}>
                        {sub.label}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentSection, setCurrentSection] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenuKey, setExpandedMenuKey] = useState("");
  const [desktopMenuKey, setDesktopMenuKey] = useState("");
  const shellRef = useRef(null);

  const isHome = currentPage === "home";

  const activeSection = useMemo(() => {
    if (isHome) {
      return "";
    }
    return currentSection || getMenu(currentPage)?.sections[0]?.key || "";
  }, [currentPage, currentSection, isHome]);

  const navigateHome = () => {
    setCurrentPage("home");
    setCurrentSection("");
    setMenuOpen(false);
    setExpandedMenuKey("");
    setDesktopMenuKey("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateTo = (menuKey, sectionKey = "") => {
    setCurrentPage(menuKey);
    setCurrentSection(sectionKey);
    setMenuOpen(false);
    setExpandedMenuKey(sectionKey ? menuKey : "");
    setDesktopMenuKey("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openMobileMenu = () => {
    setMenuOpen(true);
    setExpandedMenuKey("");
  };

  const toggleMenu = (menuKey) => {
    const menu = getMenu(menuKey);
    if (!menu) {
      return;
    }
    if (menu.sections.length === 0) {
      navigateTo(menuKey, "");
      return;
    }
    setExpandedMenuKey((current) => (current === menuKey ? "" : menuKey));
  };

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!shellRef.current?.contains(event.target)) {
        return;
      }

      const navItem = event.target.closest(".desktop-nav-item");
      if (!navItem) {
        setDesktopMenuKey("");
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div className="app-shell" ref={shellRef}>
      <Header
        dark={isHome}
        isHome={isHome}
        onHome={navigateHome}
        onNavigate={navigateTo}
        onOpenMenu={openMobileMenu}
        desktopMenuKey={desktopMenuKey}
        onToggleDesktopMenu={(menuKey) => {
          setDesktopMenuKey(menuKey);
        }}
      />
      {isHome ? <HomePage /> : <InternalPage menuKey={currentPage} sectionKey={activeSection} onSectionSelect={navigateTo} />}
      <Footer isHome={isHome} onNavigate={navigateTo} />
      {menuOpen ? (
        <MenuOverlay
          expandedMenuKey={expandedMenuKey}
          onToggleMenu={toggleMenu}
          onSelectSection={navigateTo}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </div>
  );
}
