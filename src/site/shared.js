const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const PRIVATE_PAGE_PASSWORD = "0430";
const GRADUATION_REQUIREMENTS_DOC_URL =
  "https://docs.google.com/document/d/1OQWHuEwq-Lvv3yGmLgYTgQVdYieG4CpvPmmGNwutU04/edit?tab=t.0";
const GRADUATION_REQUIREMENTS_PREVIEW_URL =
  "https://docs.google.com/document/d/1OQWHuEwq-Lvv3yGmLgYTgQVdYieG4CpvPmmGNwutU04/preview";
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const personAnchorId = ({ section, name, year = "" }) =>
  `${section}-${year ? `${year}-` : ""}${slugify(name)}`;
const studentCvSlug = (name, year) => `${slugify(name)}-${year}`;
const localizeFacultyOffice = (office, language) => {
  if (language !== "ko") return office;
  const match = String(office).match(/Sangnok Education Hall\s+(\d+)/i);
  if (match) {
    return `상록교육관 ${match[1]}호`;
  }
  return office;
};

const openExternalLink = (href) => {
  if (!href) {
    return;
  }
  const nextWindow = window.open(href, "_blank", "noopener,noreferrer");
  if (!nextWindow) {
    window.location.href = href;
  }
};

const PROGRAMS_ROUTE_SECTION_KEYS = new Set(["annual"]);
const APP_BASE_PATH = import.meta.env.BASE_URL.replace(/\/$/, "");

const UI_TEXT = {
  en: {
    languageButton: "KR",
    searchPublications: "Search publications",
    selectPublicationSearchMode: "Select publication search mode",
    author: "Author",
    title: "Title",
    searchByAuthor: "Search by author",
    searchByTitle: "Search by title",
    noPublicationsYet: "No publications yet",
    noPublicationEntries: (sectionKey) => `No publication entries have been added for ${sectionKey}.`,
    noMatchingResults: "No matching results",
    noPublicationsMatched: (query) => `No publications matched “${query}”.`,
    researchArea: "Research Area",
    courses: "Courses",
    office: "Office",
    phone: "Phone",
    email: "Email",
    lab: "Lab",
    backToStudents: "Back to Ed. D. Students",
    researchKeywords: "Research Keywords",
    education: "Education",
    researchInterests: "Research Interests",
    academicActivities: "Academic Activities",
    presentedPapers: "Presented Papers",
    noPresentedPapers: "No presented papers have been added yet.",
    updatedApril: "Updated in April 2026.",
    conferenceEvent: "Conference / Event",
    schedule: "Schedule",
    location: "Location",
    notes: "Notes",
    topCsConferences: "Top CS Conferences",
    topCsAverage:
      "Average is a normalized score calculated from multiple reference lists. Recognition values are converted to numbers before averaging: top-tier or equivalent recognition is treated as 1.00, strong recognition as 0.50, lower recognition as 0.25 or 0.75 depending on the source scale, and missing recognition as 0.00.",
    searchConferenceList: "Search conference list",
    searchConferencePlaceholder: "Search by acronym, conference name, or rank",
    showingConferences: (shown, total) => `Showing ${shown} of ${total} conferences.`,
    acronym: "Acronym",
    conferenceName: "Conference Name",
    scoresRecognition: "Scores / Recognition",
    average: "Average",
    pastEvents: "Past Events",
    curriculumOrganization: "Curriculum Organization",
    courseOverview: "Course Overview",
    semesterSchedule: "Semester Schedule",
    semester: "Semester",
    item: "Item",
    remarks: "Remarks",
    requiredMajor: "Required Major Courses",
    electiveMajor: "Elective Major Courses",
    dissertation: "Dissertation",
    category: "Category",
    courseName: "Course Name",
    semesterCredits: "Semester-Credits",
    requirement: "Requirement",
    credits: "Credits",
  },
  ko: {
    languageButton: "EN",
    searchPublications: "논문 검색",
    selectPublicationSearchMode: "논문 검색 기준 선택",
    author: "저자",
    title: "제목",
    searchByAuthor: "저자명으로 검색",
    searchByTitle: "논문 제목으로 검색",
    noPublicationsYet: "등록된 논문이 없습니다",
    noPublicationEntries: (sectionKey) => `${sectionKey}년에 등록된 논문이 없습니다.`,
    noMatchingResults: "검색 결과가 없습니다",
    noPublicationsMatched: (query) => `“${query}”에 해당하는 논문이 없습니다.`,
    researchArea: "연구분야",
    courses: "담당과목",
    office: "연구실",
    phone: "전화번호",
    email: "이메일",
    lab: "소속 연구실",
    backToStudents: "박사과정 학생으로 돌아가기",
    researchKeywords: "연구 키워드",
    education: "학력 및 과정",
    researchInterests: "연구 관심 분야",
    academicActivities: "학술 활동",
    presentedPapers: "발표 논문",
    noPresentedPapers: "아직 등록된 발표 논문이 없습니다.",
    updatedApril: "2026년 4월 업데이트.",
    conferenceEvent: "학회 / 행사",
    schedule: "일정",
    location: "장소",
    notes: "비고",
    topCsConferences: "CS 분야 우수 학술대회",
    topCsAverage:
      "평균은 여러 기준 목록의 인정 값을 정규화한 뒤 산출한 점수입니다. 최우수 또는 동등한 인정은 1.00, 우수 인정은 0.50, 출처별 중간 척도는 0.25 또는 0.75, 미인정 또는 공란은 0.00으로 변환한 뒤 평균을 냅니다.",
    searchConferenceList: "학회 목록 검색",
    searchConferencePlaceholder: "약자, 학회명, 등급으로 검색",
    showingConferences: (shown, total) => `전체 ${total}개 중 ${shown}개 표시.`,
    acronym: "약자",
    conferenceName: "학회명",
    scoresRecognition: "점수 / 인정 기준",
    average: "평균",
    pastEvents: "지난 일정",
    curriculumOrganization: "교육과정 편제",
    courseOverview: "교과목 개요",
    semesterSchedule: "학기별 주요 일정 안내",
    semester: "학기",
    item: "내용",
    remarks: "비고",
    requiredMajor: "전공필수",
    electiveMajor: "전공선택",
    dissertation: "논문",
    category: "구분",
    courseName: "교과명",
    semesterCredits: "학기-학점",
    requirement: "비고",
    credits: "학점",
  },
};

const getText = (language) => UI_TEXT[language] || UI_TEXT.en;

const SITE_MAP = [
  {
    key: "about",
    label: "ABOUT",
    sections: [
      { key: "greetings", label: "Overview" },
      { key: "reservation", label: "Contact" },
    ],
  },
  {
    key: "people",
    label: "PEOPLE",
    sections: [
      { key: "faculty", label: "Faculty" },
      { key: "students", label: "Ed. D. Students" },
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
      { key: "calendar", label: "Academic Calendar" },
      { key: "curriculum", label: "Curriculum" },
      { key: "graduation", label: "Graduation Requirements" },
    ],
  },
  {
    key: "programs",
    label: "PROGRAMS",
    sections: [],
  },
];

function getMenu(menuKey) {
  return SITE_MAP.find((menu) => menu.key === menuKey);
}

function getVisibleSections(menuKey) {
  return getMenu(menuKey)?.sections.filter((section) => !section.hidden) || [];
}

function getDefaultSection(menuKey) {
  return getVisibleSections(menuKey)[0]?.key || getMenu(menuKey)?.sections[0]?.key || "";
}

function getSectionLabel(menuKey, sectionKey) {
  return getMenu(menuKey)?.sections.find((section) => section.key === sectionKey)?.label || "";
}

const stripBasePath = (pathname) => {
  const rawPathname = String(pathname || "/");

  if (!APP_BASE_PATH || APP_BASE_PATH === ".") {
    return rawPathname || "/";
  }

  if (APP_BASE_PATH && rawPathname.startsWith(APP_BASE_PATH)) {
    return rawPathname.slice(APP_BASE_PATH.length) || "/";
  }

  return rawPathname || "/";
};

const parseRouteFromPathname = (pathname) => {
  const normalized = stripBasePath(pathname)
    .replace(/^\/+/, "")
    .trim();

  if (!normalized || normalized === "home") {
    return { page: "home", section: "" };
  }

  const [pageKey, sectionKey = ""] = normalized.split("/").filter(Boolean);
  const menu = getMenu(pageKey);

  if (pageKey === "programs") {
    return {
      page: "programs",
      section: PROGRAMS_ROUTE_SECTION_KEYS.has(sectionKey) ? sectionKey : "",
    };
  }

  if (!menu) {
    return { page: "home", section: "" };
  }

  if (!menu.sections.length) {
    return { page: pageKey, section: "" };
  }

  const validSection = menu.sections.find((section) => section.key === sectionKey);

  return {
    page: pageKey,
    section: validSection ? validSection.key : menu.sections[0].key,
  };
};

const normalizePathRoute = (pathname) => {
  const route = parseRouteFromPathname(pathname);
  return buildPathForRoute(route.page, route.section);
};

const buildPathForRoute = (pageKey, sectionKey = "") => {
  if (!pageKey || pageKey === "home") {
    return "/";
  }

  if (pageKey === "programs") {
    return sectionKey === "annual" ? "/programs/annual" : "/programs";
  }

  return sectionKey ? `/${pageKey}/${sectionKey}` : `/${pageKey}`;
};

const buildAppUrlForRoute = (pageKey, sectionKey = "") => {
  const routePath = buildPathForRoute(pageKey, sectionKey);
  return `${APP_BASE_PATH}${routePath}` || "/";
};

export {
  APP_BASE_PATH,
  GRADUATION_REQUIREMENTS_DOC_URL,
  GRADUATION_REQUIREMENTS_PREVIEW_URL,
  PROGRAMS_ROUTE_SECTION_KEYS,
  PRIVATE_PAGE_PASSWORD,
  SITE_MAP,
  asset,
  buildAppUrlForRoute,
  buildPathForRoute,
  getDefaultSection,
  getMenu,
  getSectionLabel,
  getText,
  getVisibleSections,
  localizeFacultyOffice,
  normalizePathRoute,
  openExternalLink,
  parseRouteFromPathname,
  personAnchorId,
  stripBasePath,
  slugify,
  studentCvSlug,
};
