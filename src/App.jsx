import { useEffect, useMemo, useRef, useState } from "react";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const personAnchorId = ({ section, name, year = "" }) =>
  `${section}-${year ? `${year}-` : ""}${slugify(name)}`;
const studentCvSlug = (name, year) => `${slugify(name)}-${year}`;

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
    label: "PUBLICATIONS",
    sections: [
      { key: "2026", label: "2026" },
      { key: "2025", label: "2025" },
      { key: "2024", label: "2024" },
    ],
  },
  {
    key: "labs",
    label: "LABS",
    sections: [],
  },
  {
    key: "academics",
    label: "ACADEMICS",
    sections: [
      { key: "admission", label: "Admissions" },
      { key: "graduation", label: "Graduation Requirements" },
      { key: "curriculum", label: "Curriculum" },
    ],
  },
  {
    key: "news",
    label: "NEWS",
    sections: [],
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
    image: asset("panwoo-park.png"),
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
    image: asset("inhwan-yoo.png"),
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
    image: asset("youngkwon-bae.png"),
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
    image: asset("wooyeol-kim.png"),
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
    image: asset("youngho-lee.png"),
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
    image: asset("jaekwon-shim.png"),
    research: "Computer Education, AI Education",
    courses: [
      "AI Education Consulting Topics: examines consulting elements for innovative teaching and learning strategies across the design and delivery of AI education.",
      "AIDT Research: analyzes AI-based teaching and learning platforms and digital textbooks in terms of pedagogy, content, environment, and learning ecology.",
    ],
  },
];

const STUDENT_PROFILES = {
  "2026": [
    { name: "Jaeeon Park", lab: "Member of the Panwoo Park Lab" },
    { name: "Kidong Kwon", lab: "Member of the Inhwan Yoo Lab" },
    { name: "Horyeon Nam", lab: "Member of the Youngkwon Bae Lab" },
    { name: "Jeongeun Choi", lab: "Member of the Wooyeol Kim Lab" },
    { name: "Eunjeong Lee", lab: "Member of the Youngho Lee Lab" },
    { name: "Jaeeun Yoon", lab: "Member of the Jaekwon Shim Lab" },
  ],
  "2025": [
    { name: "Incheol Kim", lab: "Member of the Panwoo Park Lab" },
    { name: "Gukhwan Bae", lab: "Member of the Youngkwon Bae Lab" },
    { name: "Jaeeun Ahn", lab: "Member of the Inhwan Yoo Lab" },
    { name: "Youngtak Jeong", lab: "Member of the Wooyeol Kim Lab" },
    { name: "Hyejeong Cho", lab: "Member of the Jaekwon Shim Lab" },
    { name: "Minjeong Kang", lab: "Member of the Youngho Lee Lab" },
    { name: "Jungeun Kim", lab: "Member of the Panwoo Park Lab" },
    { name: "Daeryun Park", lab: "Member of the Inhwan Yoo Lab" },
    { name: "Intae Hwang", lab: "Member of the Youngho Lee Lab" },
  ],
  "2024": [
    { name: "Jinhee Oh", lab: "Member of the Panwoo Park Lab" },
    { name: "Minji Lee", lab: "Member of the Inhwan Yoo Lab" },
    { name: "Seunghyun Lee", lab: "Member of the Youngho Lee Lab" },
    { name: "Yonghan Lee", lab: "Member of the Jaekwon Shim Lab" },
    { name: "Jeongseo Lee", lab: "Member of the Youngkwon Bae Lab" },
    { name: "Saesoon Lee", lab: "Member of the Wooyeol Kim Lab" },
  ],
};

const LAB_CARDS = [
  {
    title: "Panwoo Park Lab",
    keywords: ["AI Education Research", "Distance Learning", "Curriculum Design"],
    description: "Research on AI education methodology, curriculum consulting, and comparative studies of AI instruction across learning environments.",
  },
  {
    title: "Inhwan Yoo Lab",
    keywords: ["SW/AI Education", "Data Science", "Instructional Design"],
    description: "Work focused on SW-AI education topics, data-driven learning design, and AI-based teaching and learning methodologies.",
  },
  {
    title: "Youngkwon Bae Lab",
    keywords: ["AI Policy", "Digital Innovation", "Educational Content"],
    description: "Research on digital innovation planning, AI policy in education, and the development of AI-supported educational content.",
  },
  {
    title: "Wooyeol Kim Lab",
    keywords: ["Programming Languages", "Leadership", "Project Research"],
    description: "Explores advanced programming language research, AI digital leadership, and collaborative project-based inquiry in education.",
  },
  {
    title: "Youngho Lee Lab",
    keywords: ["AI Literacy", "AI Programming", "Classroom Practice"],
    description: "Focused on AI digital literacy, AI programming practices, and practical classroom applications of AI in school settings.",
  },
  {
    title: "Jaekwon Shim Lab",
    keywords: ["AI Consulting", "AIDT Research", "Learning Ecology"],
    description: "Investigates AI education consulting, AI-based teaching and learning platforms, and the design of future learning ecosystems.",
  },
];

const STUDENT_CV_PROFILES = Object.entries(STUDENT_PROFILES).flatMap(([year, profiles]) =>
  profiles.map((profile) => ({
    ...profile,
    year,
    slug: studentCvSlug(profile.name, year),
    title: "Curriculum Vitae",
    email: `${slugify(profile.name).replace(/-/g, ".")}@dnue.ac.kr`,
    keywords: ["AI Pedagogy", "Educational Data", "Future Learning"],
    education: [
      "Graduate School of AI Education, Daegu National University of Education",
      `PhD Student Cohort ${year}`,
    ],
    researchInterests: [
      "AI pedagogy and instructional innovation",
      "Educational data and future classroom design",
      "School-based applications of artificial intelligence",
    ],
    activities: [
      "Participation in doctoral seminars and collaborative research activities",
      "Development of research interests aligned with the direction of the lab",
    ],
    presentedPapers: [],
  }))
);

const PUBLICATION_LISTS = {
  "2026": [
    {
      type: "Korean Journal",
      title: "Comparative Analysis of AI Models for Enhancing Collaborative Learning Support Systems: Focusing on Korean Speech Recognition and Feedback",
      authors: "Gukhwan Bae, Youngho Lee, and Panwoo Park",
      venue: "Journal of the Korean Association of Information Education, 30(1), 125-135.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003309150",
    },
    {
      type: "Korean Journal",
      title: "Exploring AI Education Improvement Strategies Based on the Concept of Context Engineering in the 2022 Revised Curriculum",
      authors: "Inhwan Yoo and Minjeong Kang",
      venue: "The Journal of the Korean Association of Computer Education, 30(1), 137-147.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003309156",
    },
    {
      type: "Korean Journal",
      title: "Exploring AI Programming Education Methods Using AI Agents and Educational Robots",
      authors: "Inhwan Yoo and Daeryun Park",
      venue: "The Journal of the Korean Association of Computer Education, 30(1), 149-159.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003309158",
    },
    {
      type: "Korean Journal",
      title: "A Study on the Development of a Teacher Training System to Enhance Digital Educational Competency",
      authors: "Jeongseo Lee and Wooyeol Kim",
      venue: "Journal of Consulting Convergence Research, 6(1), 2-7.",
      doi: "10.55479/JCCR.2026.6.1.2",
      url: "https://doi.org/10.55479/JCCR.2026.6.1.2",
    },
  ],
  "2025": [
    {
      type: "Korean Journal",
      title: "The Impact of Prompt Formats on the Robustness of LLMs",
      authors: "Seunghyun Lee and Youngho Lee",
      venue: "The Journal of the Korean Association of Computer Education, 28(12), 1-12.",
      doi: "10.32431/kace.2025.28.12.001",
      url: "https://doi.org/10.32431/kace.2025.28.12.001",
    },
    {
      type: "Korean Journal",
      title: "Research on Developing and Applying a Korean-based Lightweight LLM for Schools",
      authors: "Gukhwan Bae, Youngho Lee, and Panwoo Park",
      venue: "Journal of the Korean Association of Information Education, 29(4), 459-470.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003236175",
    },
    {
      type: "Korean Journal",
      title: "Development and Implementation of IB PYP-based Unit of Inquiry and Machine Learning Education Program",
      authors: "Hyejeong Cho and Inhwan Yoo",
      venue: "Journal of Elementary Education, 41(3), 1-20.",
      doi: "10.23103/dnueje.2025.41.3.1",
      url: "https://doi.org/10.23103/dnueje.2025.41.3.1",
    },
    {
      type: "Korean Journal",
      title: "Development of an AI Chatbot for Teaching Reading to Elementary School Students",
      authors: "Seunguk Jeong and Panwoo Park",
      venue: "Intelligence Information Convergence and Future Education, 4(28), 1-7.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003278172",
    },
    {
      type: "Korean Journal",
      title: "Policies and Case Studies of Major Countries for Artificial Intelligence-based Education",
      authors: "Panwoo Park",
      venue: "Journal of the Korean Association of Information Education, 29(2), 133-140.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003201860",
    },
    {
      type: "Korean Journal",
      title: "A Study on the Design and Development of an AI Based Group Chat System for Collaborative Learning",
      authors: "Youngho Lee",
      venue: "Intelligence Information Convergence and Future Education, 4(31), 1-8.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003280651",
    },
  ],
  "2024": [
    {
      type: "Korean Journal",
      title: "Designing an Automated Syllabus Assessment Framework Using a RAG-based LLM",
      authors: "Younghan Lee and Jaekwon Shim",
      venue: "Journal of Convergence Science, Technology, and Society, 3(2), 59-67.",
      doi: "10.56366/jcsts.2024.3.2.59",
      url: "https://doi.org/10.56366/jcsts.2024.3.2.59",
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
  labs: {
    title: "Labs",
    headline: "Research groups and thematic lab directions",
    subheadline: "",
    body: {
      default: [],
    },
  },
  research: {
    title: "Publications",
    headline: "Yearly publication archive and academic outputs",
    subheadline: "",
    body: {
      "2026": [
        "A publication archive for 2026 can be organized here in a clean text-based format.",
      ],
      "2025": [
        "A publication archive for 2025 can be organized here in a clean text-based format.",
      ],
      "2024": [
        "A publication archive for 2024 can be organized here in a clean text-based format.",
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
  return FACULTY_PROFILES;
}

function Brand({ dark, onHome, textOnly = false, markOnly = false }) {
  return (
    <button className={`brand ${textOnly ? "is-text-only" : ""} ${markOnly ? "is-mark-only" : ""}`} type="button" aria-label="Home" onClick={onHome}>
      {!textOnly ? <img className={`brand-mark ${dark ? "is-dark" : "is-light"}`} src={asset("dnue-mark.svg")} alt="" aria-hidden="true" /> : null}
      {!markOnly ? (
        <span className="brand-text">
          Daegu National University of Education
          <br />
          Graduate School of AI Education
        </span>
      ) : null}
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
                <span>{menu.label}</span>
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
            <a className="learn-more" href="#home-publications">
              PUBLICATIONS
            </a>
          </div>
        </div>
      </section>
      <section className="home-publications reveal-on-scroll" id="home-publications">
        <div className="content-shell home-publications-inner">
          <div className="home-publications-head">
            <p>Publications</p>
          </div>
          <div className="home-publications-grid">
            {["2026", "2025", "2024"].map((year) => {
              const items = PUBLICATION_LISTS[year] || [];
              return (
                <article key={year} className="home-publication-card">
                  <div className="home-publication-year">{year}</div>
                  {items.length === 0 ? (
                    <div className="home-publication-empty">
                      <p>No publications yet</p>
                    </div>
                  ) : (
                    <div className="home-publication-items">
                      {items.map((item) => (
                        <a
                          key={`${year}-${item.title}`}
                          className="home-publication-entry"
                          href={item.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <p className="home-publication-type">{item.type}</p>
                          <h3>{item.title}</h3>
                          <p className="home-publication-meta">{item.authors}</p>
                          <p className="home-publication-meta">{item.venue}</p>
                          {item.doi ? <p className="home-publication-meta home-publication-doi">DOI {item.doi}</p> : null}
                        </a>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function LandingBackdrop() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
  }, []);

  const handleLoad = () => {
    window.setTimeout(() => {
      setIsLoaded(true);
    }, 180);
  };

  return (
    <div className="landing-lightfield" aria-hidden="true">
      <iframe
        className={`landing-spline ${isLoaded ? "is-loaded" : ""}`}
        src="https://my.spline.design/displacelines-LS4TQIxZI0gVrTKi0K58h1m1/"
        frameBorder="0"
        title="Landing background"
        onLoad={handleLoad}
      />
    </div>
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

function PublicationList({ sectionKey, query, searchMode }) {
  const items = PUBLICATION_LISTS[sectionKey] || PUBLICATION_LISTS["2026"];
  const normalizedQuery = query.trim().toLowerCase();
  const allItems = Object.entries(PUBLICATION_LISTS).flatMap(([year, yearItems]) =>
    yearItems.map((item) => ({ ...item, year }))
  );
  const filteredItems = normalizedQuery
    ? allItems.filter((item) =>
        (searchMode === "authors" ? item.authors : item.title)
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : items.map((item) => ({ ...item, year: sectionKey }));

  if (items.length === 0) {
    return (
      <div className="publication-list">
        <article className="publication-item">
          <p className="publication-type">No publications yet</p>
          <h4>No publication entries have been added for {sectionKey}.</h4>
        </article>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="publication-list">
        <article className="publication-item">
          <p className="publication-type">No matching results</p>
          <h4>No publications matched “{query}”.</h4>
        </article>
      </div>
    );
  }

  return (
    <div className="publication-list">
      {filteredItems.map((item) => (
        <article key={`${item.year}-${item.title}`} className="publication-item">
          {normalizedQuery ? <p className="publication-year-tag">{item.year}</p> : null}
          <p className="publication-type">{item.type}</p>
          <h4>
            <a href={item.url} target="_blank" rel="noreferrer">
              {item.title}
            </a>
          </h4>
          <p>{item.authors}</p>
          <p>{item.venue}</p>
          {item.doi ? (
            <p className="publication-doi">
              <span>DOI</span>
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.doi}
              </a>
            </p>
          ) : null}
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
        <article
          key={`${sectionKey}-${profile.name}`}
          id={personAnchorId({ section: sectionKey, name: profile.name })}
          className={`profile-card ${isFaculty ? "faculty-profile-card" : ""}`}
        >
          <div className={`profile-image ${profile.image ? "has-photo" : ""} ${profile.imageClassName ?? ""}`} aria-hidden="true">
            {profile.image ? <img className="profile-photo" src={profile.image} alt="" loading="lazy" /> : null}
          </div>
          <div className="profile-content">
            <h4>{profile.name}</h4>
            <p>{profile.position}</p>
            {isFaculty ? (
              <>
                <p><strong>Research Area</strong> {profile.research}</p>
                <p className="profile-courses"><strong>Courses</strong> {profile.courses.join(" / ")}</p>
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

function StudentYearGroups({ onOpenCv }) {
  const years = ["2024", "2025", "2026"];

  return (
    <div className="student-year-groups">
      {years.map((year) => (
        <section key={year} className="student-year-group">
          <h3>{year}</h3>
          <div className="profile-grid student-profile-grid">
            {STUDENT_PROFILES[year].map((profile) => (
              <article key={`${year}-${profile.name}`} id={personAnchorId({ section: "students", name: profile.name, year })} className="profile-card">
                <div className={`profile-image ${profile.image ? "has-photo" : ""}`} aria-hidden="true">
                  {profile.image ? <img className="profile-photo" src={profile.image} alt="" loading="lazy" /> : null}
                </div>
                <div className="profile-content">
                  <h4>{profile.name}</h4>
                  <p>{profile.lab}</p>
                  <button type="button" className="student-cv-link" onClick={() => onOpenCv(studentCvSlug(profile.name, year))}>
                    CV
                  </button>
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
            <h2>{lab.title}</h2>
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

function StudentCvPage({ slug, onBack }) {
  const profile = STUDENT_CV_PROFILES.find((item) => item.slug === slug);

  if (!profile) {
    return null;
  }

  return (
    <section className="internal-page student-cv-page" id="content">
      <div className="content-shell student-cv-shell reveal-on-scroll is-visible">
        <button type="button" className="student-cv-back" onClick={onBack}>
          ← Back to PhD Students
        </button>
        <div className="student-cv-header">
          <p className="student-cv-kicker">PhD Students · {profile.year}</p>
          <h1>{profile.name}</h1>
          <div className="student-cv-meta">
            <p>
              <span>Email</span>
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
            </p>
            <p>
              <span>Lab</span>
              {profile.lab}
            </p>
          </div>
        </div>
        <div className="student-cv-stack">
          <section className="student-cv-section">
            <h3>Research Keywords</h3>
            <p>{profile.keywords.join(" / ")}</p>
          </section>
          <section className="student-cv-section">
            <h3>Education</h3>
            <ul>
              {profile.education.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="student-cv-section">
            <h3>Research Interests</h3>
            <ul>
              {profile.researchInterests.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="student-cv-section">
            <h3>Academic Activities</h3>
            <ul>
              {profile.activities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>
          <section className="student-cv-section">
            <h3>Presented Papers</h3>
            {profile.presentedPapers.length > 0 ? (
              <ul>
                {profile.presentedPapers.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>No presented papers have been added yet.</p>
            )}
          </section>
        </div>
      </div>
    </section>
  );
}

function InternalPage({ menuKey, sectionKey, onSectionSelect, onOpenCv }) {
  const menu = getMenu(menuKey);
  const content = getPageContent(menuKey, sectionKey);
  const currentSection = sectionKey || menu?.sections[0]?.key || "";
  const currentLabel = currentSection ? getSectionLabel(menuKey, currentSection) : "";
  const showVisual = menuKey === "about";
  const showProfiles = menuKey === "people";
  const showLabs = menuKey === "labs";
  const showPublications = menuKey === "research";
  const useWidePeopleLayout = menuKey === "people" && (currentSection === "faculty" || currentSection === "students");
  const useWideLabsLayout = menuKey === "labs";
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

      <div className={`content-shell internal-grid reveal-on-scroll ${showVisual ? "" : "single-column"} ${showPublications ? "research-layout" : ""} ${useWidePeopleLayout ? "wide-people-layout" : ""} ${useWideLabsLayout ? "wide-labs-layout" : ""}`}>
        <article className="internal-copy">
          {!showPublications && !showLabs ? <h2>{currentLabel || content.headline}</h2> : null}
          {!showPublications && !showLabs && content.subheadline ? <h3>{content.subheadline}</h3> : null}
          {!showPublications && !showLabs ? content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : null}
          {showPublications ? (
            <div className="publication-search">
              <label className="publication-search-label" htmlFor="publication-search">
                Search publications
              </label>
              <div className="publication-search-row">
                <div className="section-select-wrap publication-search-select-wrap">
                  <label className="sr-only" htmlFor="publication-search-mode">
                    Select publication search mode
                  </label>
                  <select
                    id="publication-search-mode"
                    className="section-select publication-search-select"
                    value={publicationSearchMode}
                    onChange={(event) => setPublicationSearchMode(event.target.value)}
                  >
                    <option value="authors">Author</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <input
                  id="publication-search"
                  className="publication-search-input"
                  type="search"
                  placeholder={publicationSearchMode === "authors" ? "Search by author" : "Search by title"}
                  value={publicationQuery}
                  onChange={(event) => setPublicationQuery(event.target.value)}
                />
              </div>
            </div>
          ) : null}
          {showProfiles && currentSection === "faculty" ? <ProfileGrid sectionKey={currentSection} /> : null}
          {menuKey === "people" && currentSection === "students" ? <StudentYearGroups onOpenCv={onOpenCv} /> : null}
          {showLabs ? <LabsShowcase onOpenFaculty={() => onSectionSelect("people", "faculty")} /> : null}
        </article>
        {showVisual ? <EditorialVisual /> : null}
        {showPublications ? <PublicationList sectionKey={currentSection} query={publicationQuery} searchMode={publicationSearchMode} /> : null}
      </div>
    </section>
  );
}

function Footer({ isHome, onNavigate }) {
  return (
    <footer className={`site-footer ${isHome ? "is-home" : "is-inner"}`}>
      <div className="footer-main-tone">
        <div className="content-shell footer-grid reveal-on-scroll">
          <div className="footer-signature">
            <button className="footer-signature-home" type="button" onClick={() => onNavigate("home", "")} aria-label="Home">
              <img className={`footer-signature-mark ${isHome ? "is-dark" : "is-light"}`} src={asset("dnue-mark.svg")} alt="" aria-hidden="true" />
              <span className="footer-signature-title">
                Daegu National University of Education
                <br />
                Graduate School of AI Education
              </span>
            </button>
            <div className="footer-meta">
              <p>Daegu National University of Education Graduate School of AI Education © 2026. All rights reserved.</p>
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
              <button
                className="menu-link"
                type="button"
                onClick={() => {
                  if (menu.sections.length === 0) {
                    onSelectSection(menu.key, "");
                    return;
                  }
                  onToggleMenu(menu.key);
                }}
              >
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
  const [currentCvSlug, setCurrentCvSlug] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenuKey, setExpandedMenuKey] = useState("");
  const [desktopMenuKey, setDesktopMenuKey] = useState("");
  const shellRef = useRef(null);

  const isHome = currentPage === "home";
  const isStudentCv = currentPage === "student-cv";

  const activeSection = useMemo(() => {
    if (isHome) {
      return "";
    }
    return currentSection || getMenu(currentPage)?.sections[0]?.key || "";
  }, [currentPage, currentSection, isHome]);

  const navigateHome = () => {
    setCurrentPage("home");
    setCurrentSection("");
    setCurrentCvSlug("");
    setMenuOpen(false);
    setExpandedMenuKey("");
    setDesktopMenuKey("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navigateTo = (menuKey, sectionKey = "") => {
    setCurrentPage(menuKey);
    setCurrentSection(sectionKey);
    setCurrentCvSlug("");
    setMenuOpen(false);
    setExpandedMenuKey(sectionKey ? menuKey : "");
    setDesktopMenuKey("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openStudentCv = (slug) => {
    setCurrentPage("student-cv");
    setCurrentSection("");
    setCurrentCvSlug(slug);
    setMenuOpen(false);
    setExpandedMenuKey("");
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

  useEffect(() => {
    const nodes = document.querySelectorAll(".reveal-on-scroll");
    if (!nodes.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    nodes.forEach((node) => {
      if (!node.classList.contains("is-visible")) {
        observer.observe(node);
      }
    });

    return () => observer.disconnect();
  }, [currentPage, activeSection, menuOpen]);

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
      {isHome ? (
        <HomePage />
      ) : isStudentCv ? (
        <StudentCvPage slug={currentCvSlug} onBack={() => navigateTo("people", "students")} />
      ) : (
        <InternalPage
          menuKey={currentPage}
          sectionKey={activeSection}
          onSectionSelect={navigateTo}
          onOpenCv={openStudentCv}
        />
      )}
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
