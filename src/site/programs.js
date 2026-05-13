const PROGRAMS_ANNUAL_ITEMS = [
  {
    number: "01",
    title: "OT & Workshop",
    koTitle: "OT 및 워크샵",
    schedule: "First week of March",
    koSchedule: "3월 1주차",
    note: "Annual opening activity for students in the major",
    koNote: "전공 신입생과 재학생을 위한 연간 시작 프로그램",
  },
  {
    number: "02",
    title: "Seminar I (Special Lecture)",
    koTitle: "전체 세미나 1(특강)",
    schedule: "May",
    koSchedule: "5월 중",
    note: "Special lecture and major-wide seminar",
    koNote: "특강 중심의 전체 세미나",
  },
  {
    number: "03",
    title: "Seminar II (Major Specialization)",
    koTitle: "전체 세미나 2(전공특성화)",
    schedule: "First week of August",
    koSchedule: "8월 1주차",
    note: "Specialized seminar for the AI Education major",
    koNote: "전공 특성화 세미나",
  },
  {
    number: "04",
    title: "Seminar III (Internal)",
    koTitle: "전체 세미나 3(자체)",
    schedule: "First week of September",
    koSchedule: "9월 1주차",
    note: "Cohort presentations",
    koNote: "기수별 발표",
  },
  {
    number: "05",
    title: "Seminar IV (Special Lecture)",
    koTitle: "전체 세미나 4(특강)",
    schedule: "October",
    koSchedule: "10월 중",
    note: "Late-year special lecture",
    koNote: "하반기 특강 세미나",
  },
];

const PROGRAMS_2025_ITEMS = [
  {
    date: "2025.10.20",
    title: "Programming with Generative AI",
    koTitle: "생성형 AI를 활용한 프로그래밍",
    summary: "A doctoral seminar on programming instruction and practice using generative AI tools.",
    koSummary: "생성형 AI 도구를 활용한 프로그래밍 수업과 실습을 다룬 박사과정 세미나입니다.",
    href: "https://ai--nk1th7i.gamma.site/",
  },
  {
    date: "2025.08.01",
    title: "Instructor Training for the Department of Computer Education",
    koTitle: "컴퓨터교육과 강사 교육",
    summary: "An instructor training program on course operation and teaching support for the Department of Computer Education.",
    koSummary: "컴퓨터교육과 강사를 대상으로 수업 운영과 교육 지원을 다룬 연수 프로그램입니다.",
    href: "https://drive.google.com/drive/folders/16uKBnnhEUilrhWA5EDZj5QkXuOIoK-Fd?usp=sharing",
    requiresPassword: true,
  },
  {
    date: "2025.07.28",
    title: "Programming Practice with CursorAI",
    koTitle: "CursorAI 활용 프로그래밍 실습",
    summary: "A hands-on program exploring programming practice with CursorAI in educational settings.",
    koSummary: "교육 현장에서 CursorAI를 활용한 프로그래밍 실습을 다룬 교육 프로그램입니다.",
    href: "https://drive.google.com/file/d/1xPr0KCvFHRN2-Hup70Z8KBhVPVvv05KI/view?usp=sharing",
  },
  {
    date: "2025.07.28",
    title: "Daegu Nambu Office Design Thinking School (5 days)",
    koTitle: "대구 남부청 디자인싱킹 스쿨 (5일)",
    summary: "A five-day design thinking school co-organized with the Daegu Nambu Office of Education.",
    koSummary: "대구 남부교육지원청과 함께 운영한 5일간의 디자인씽킹 스쿨 프로그램입니다.",
    href: "https://sites.google.com/view/nambuon/home",
  },
];

const PROGRAMS_2026_ITEMS = [
  {
    date: "2026.03.01",
    title: "AI Education Major Doctoral Program OT Materials",
    koTitle: "AI교육 전공 박사과정 OT 자료",
    summary: "Orientation guidance and materials for incoming doctoral students in the AI Education major.",
    koSummary: "AI교육 전공 박사과정 신입생을 위한 오리엔테이션 안내 및 자료입니다.",
    href: "https://docs.google.com/document/d/1UoLrAH57tZOekJkIMmPke6nAvPkZSjrh-1ZoBtz9GqM/edit?usp=sharing",
    requiresPassword: true,
  },
];

const PROGRAM_YEARS = ["2026", "2025"];

const PROGRAM_ITEMS_BY_YEAR = {
  "2026": PROGRAMS_2026_ITEMS,
  "2025": PROGRAMS_2025_ITEMS,
};

const toSortableProgramDate = (value) => {
  const [year = 0, month = 0, day = 0] = String(value)
    .split(".")
    .map((part) => Number.parseInt(part, 10) || 0);

  return year * 10000 + month * 100 + day;
};

const PROGRAM_ITEMS_LATEST_FIRST = PROGRAM_YEARS.flatMap((year) =>
  (PROGRAM_ITEMS_BY_YEAR[year] || []).map((item) => ({ ...item, year }))
).sort((left, right) => toSortableProgramDate(right.date) - toSortableProgramDate(left.date));

const getLocalizedAnnualPrograms = (language) =>
  PROGRAMS_ANNUAL_ITEMS.map((item) => ({
    ...item,
    displayTitle: language === "ko" ? item.koTitle : item.title,
    displaySchedule: language === "ko" ? item.koSchedule : item.schedule,
    displayNote: language === "ko" ? item.koNote : item.note,
  }));

const getLocalizedProgramsItems = (language) =>
  PROGRAM_ITEMS_LATEST_FIRST.map((item) => ({
    ...item,
    displayTitle: language === "ko" ? item.koTitle : item.title,
    displaySummary: language === "ko" ? item.koSummary : item.summary,
  }));

const getLocalizedProgramsItemsByYear = (language, year) =>
  ((PROGRAM_ITEMS_BY_YEAR[year] || []).slice().sort(
    (left, right) => toSortableProgramDate(right.date) - toSortableProgramDate(left.date)
  )).map((item) => ({
    ...item,
    year,
    displayTitle: language === "ko" ? item.koTitle : item.title,
    displaySummary: language === "ko" ? item.koSummary : item.summary,
  }));

export {
  PROGRAMS_ANNUAL_ITEMS,
  getLocalizedAnnualPrograms,
  getLocalizedProgramsItems,
  getLocalizedProgramsItemsByYear,
};
