import { useEffect, useMemo, useRef, useState } from "react";
import { CONFERENCE_INDEX_COMPUTER_SCIENCE_EVENTS } from "./data/conferenceIndexComputerScienceEvents";
import { CS_TOP_CONFERENCES } from "./data/csConferences";
import { DS_DEADLINES_PAST_EVENTS } from "./data/dsPastEvents";
import notionPublications from "./data/notionPublications.json";
import notionStudents from "./data/notionStudents.json";

const asset = (path) => `${import.meta.env.BASE_URL}${path}`;
const slugify = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
const personAnchorId = ({ section, name, year = "" }) =>
  `${section}-${year ? `${year}-` : ""}${slugify(name)}`;
const studentCvSlug = (name, year) => `${slugify(name)}-${year}`;

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
    backToStudents: "Back to PhD Students",
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
      { key: "curriculum", label: "Curriculum" },
      { key: "graduation", label: "Graduation Requirements" },
    ],
  },
  {
    key: "conferences",
    label: "CONFERENCES",
    sections: [
      { key: "domestic", label: "Domestic" },
      { key: "international", label: "International" },
      { key: "top-cs", label: "Top CS Conferences" },
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
    koName: "박판우",
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
    koCourses: [
      "AI교육 연구방법론 : 인공지능 교육 연구에 필요한 과학적 논리, 측정도구, 분석방법을 수행하는 방법을 습득한다.",
      "AI교육 연구세미나 : AI교육과 관련된 최신 연구 동향을 파악하고, 논문의 연구 방법론과 결과를 비판적으로 평가하여 AI교육 분야에서의 연구 역량을 강화 및 연구 주제 발굴 능력을 습득한다.",
      "AI교육과정과 수업 컨설팅 : 국내외 인공지능 교육과정을 탐색·비교하며, 효과적인 AI교육과정을 설계하는 방법과 수업 컨설팅 방법에 대해 학습하여, AI교육 현장에서의 적용 방안을 모색한다.",
    ],
  },
  {
    name: "Inhwan Yoo",
    koName: "유인환",
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
    koCourses: [
      "SW/AI교육 특론 : 인공지능 시대에 요구되는 창의융합형 인재 양성을 위한 SW-AI 교육의 이론적 배경의 이해와 최신 기술의 탐구를 병행한다. SW-AI교육과 관련된 본질적인 개념과 논점부터 출발하여 국내외 SW-AI 교육 동향을 탐구하고, 바람직한 SW-AI 교육을 위한 목표 및 내용, 방법 등에 대해 탐구한다.",
      "데이터과학 특론 : 데이터 과학의 핵심 개념, 기술을 다루고, 데이터와 인공지능의 연계성을 설명하고, AI모델 개발에 데이터를 어떻게 활용하는지 탐구한다.",
      "AI기반 교수학습설계 방법론 : AI기반 교수학습 설계와 평가 방법론, 탐구학습의 원리, AI의 기본 개념과 기술 및 도구를 효과적으로 활용하여 가르치는 방법론을 탐구한다.",
    ],
  },
  {
    name: "Youngkwon Bae",
    koName: "배영권",
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
    koCourses: [
      "AI디지털 정책 세미나 : AI와 디지털관련 국내외 정책에 대해서 조사 및 분석하여 우리나라의 정책적 시사점을 도출하고, 교육현장에 효과적으로 적용하는 방안에 대해서 토론한다.",
      "AI디지털 혁신 방안 세미나 : 디지털 관련 최신의 이론과 실제를 탐구하여 교육의 주체인 학생, 교사, 관리자, 학부모의 관점에서 디지털로 인해 변화되는 방향성에 대해 토론한다.",
      "AI기반 교육 콘텐츠 개발 : 다양한 교구를 활용하여 AI의 기본 개념과 기술을 전달하는 방법을 탐구하고, AI지원 도구를 활용하여 교육 콘텐츠를 설계 및 개발하는 방법에 대해 학습한다.",
    ],
  },
  {
    name: "Wooyeol Kim",
    koName: "김우열",
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
    koCourses: [
      "프로그래밍 언어 심화 연구 : 컴퓨팅 기반의 문제를 해결하기 위해서 컴퓨터 프로그래밍을 탐구하고, 프로그래밍 언어론의 관점에서 다양한 프로그래밍 언어를 학습한다.",
      "AI디지털 리더십 이해 : 교육에 영향을 미치는 시대에 리더는 어떤 전략과 실행력을 갖춰야 하는지 논의하고, 교육현장에서 적용할 수 있는 사례를 분석하여 토론한다.",
      "AI디지털 교육 프로젝트 연구 : AI와 디지털 교육과 관련된 연구 프로젝트를 팀 단위로 수행하면서 실무 역량과 협업 능력을 기르고, 디지털 교육 분야에서의 응용 가능성을 탐구한다.",
    ],
  },
  {
    name: "Youngho Lee",
    koName: "이영호",
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
    koCourses: [
      "AI디지털 리터러시 연구 : 미디어, 윤리, 도구적인 관점에서 국내외 AI디지털 리터러시 검사 도구를 분석하여 현장에 적용하는 방안을 탐구한다.",
      "AI프로그래밍 특론 : 최신 AI프로그래밍 기술을 다루고, 프로그래밍 실습을 통해 AI모델을 구현하고 다양한 데이터셋을 활용하여 성능을 평가하는 방법을 학습한다.",
    ],
  },
  {
    name: "Jaekwon Shim",
    koName: "심재권",
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
    koCourses: [
      "AI교육 컨설팅 특론 : AI교육을 설계하는 초기 단계부터 과정 전반에 걸쳐 교수자에게 혁신 교수·학습 방법 및 전략에 대한 컨설팅 요소를 탐구한다.",
      "AIDT 연구 : 인공지능 기술 기반의 교수학습 플랫폼과 디지털교과서를 교수학습방법, 내용, 환경, 학습생태계 등으로 분석하여 교육적인 효과를 논한다.",
    ],
  },
];

const STATIC_STUDENT_PROFILES = {
  "2026": [
    { name: "Jaeeon Park", koName: "박재언", lab: "Member of the Panwoo Park Lab", koLab: "박판우 교수 연구실" },
    { name: "Kidong Kwon", koName: "권기동", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Horyeon Nam", koName: "남호련", lab: "Member of the Youngkwon Bae Lab", koLab: "배영권 교수 연구실" },
    { name: "Jeongeun Choi", koName: "최정은", lab: "Member of the Wooyeol Kim Lab", koLab: "김우열 교수 연구실" },
    { name: "Eunjeong Lee", koName: "이은정", lab: "Member of the Youngho Lee Lab", koLab: "이영호 교수 연구실" },
    { name: "Jaeeun Yoon", koName: "윤재은", lab: "Member of the Jaekwon Shim Lab", koLab: "심재권 교수 연구실" },
  ],
  "2025": [
    { name: "Incheol Kim", koName: "김인철", lab: "Member of the Panwoo Park Lab", koLab: "박판우 교수 연구실" },
    { name: "Gukhwan Bae", koName: "배국환", lab: "Member of the Youngkwon Bae Lab", koLab: "배영권 교수 연구실" },
    { name: "Jaeeun Ahn", koName: "안재은", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Youngtak Jeong", koName: "정영탁", lab: "Member of the Wooyeol Kim Lab", koLab: "김우열 교수 연구실" },
    { name: "Hyejeong Cho", koName: "조혜정", lab: "Member of the Jaekwon Shim Lab", koLab: "심재권 교수 연구실" },
    { name: "Minjeong Kang", koName: "강민정", lab: "Member of the Youngho Lee Lab", koLab: "이영호 교수 연구실" },
    { name: "Jungeun Kim", koName: "김정은", lab: "Member of the Panwoo Park Lab", koLab: "박판우 교수 연구실" },
    { name: "Daeryun Park", koName: "박대륜", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Intae Hwang", koName: "황인태", lab: "Member of the Youngho Lee Lab", koLab: "이영호 교수 연구실" },
  ],
  "2024": [
    { name: "Jinhee Oh", koName: "오진희", lab: "Member of the Panwoo Park Lab", koLab: "박판우 교수 연구실" },
    { name: "Minji Lee", koName: "이민지", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Seunghyun Lee", koName: "이승현", lab: "Member of the Youngho Lee Lab", koLab: "이영호 교수 연구실" },
    { name: "Yonghan Lee", koName: "이용한", lab: "Member of the Jaekwon Shim Lab", koLab: "심재권 교수 연구실" },
    { name: "Jeongseo Lee", koName: "이정서", lab: "Member of the Youngkwon Bae Lab", koLab: "배영권 교수 연구실" },
    { name: "Saesoon Lee", koName: "이새순", lab: "Member of the Wooyeol Kim Lab", koLab: "김우열 교수 연구실" },
  ],
};

const buildStudentProfiles = (students) => {
  if (!Array.isArray(students) || students.length === 0) {
    return STATIC_STUDENT_PROFILES;
  }

  return students.reduce((groups, student) => {
    const year = String(student.year || student.cohort || "2024");
    const currentGroup = groups[year] || [];

    return {
      ...groups,
      [year]: [...currentGroup, student],
    };
  }, {});
};

const STUDENT_PROFILES = buildStudentProfiles(notionStudents);

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

const CONFERENCE_GROUPS = [
  {
    key: "domestic",
    title: "Domestic Conferences / Events",
    items: [
      {
        name: "AIED 2026",
        schedule: "June 29 - July 3, 2026",
        location: "Seoul, Korea",
        note: "International conference on AI in Education",
      },
      {
        name: "AAAI 2026 Summer Symposium Series",
        schedule: "June 22 - June 24, 2026",
        location: "Seoul, Korea",
        note: "Hosted by Dongguk University",
      },
      {
        name: "ICML 2026",
        schedule: "July 6 - July 11, 2026",
        location: "Seoul, Korea",
        note: "International conference on machine learning",
      },
      {
        name: "ICDCS 2026",
        schedule: "June 22 - June 25, 2026",
        location: "Seoul, Korea",
        note: "International conference on distributed computing systems",
      },
      {
        name: "AI EXPO KOREA 2026",
        schedule: "May 6 - May 8, 2026",
        location: "COEX, Seoul",
        note: "AI exhibition and conference",
      },
      {
        name: "ISS 2026",
        schedule: "June 16 - June 18, 2026",
        location: "DCC, Daejeon",
        note: "Domestic case for a space-related event",
      },
      {
        name: "KDD 2026",
        schedule: "August 9 - August 13, 2026; August 25 - August 29, 2026",
        location: "Jeju / Barcelona",
        note: "Jeju schedule included",
      },
      {
        name: "DASFAA 2026",
        schedule: "April 27 - April 30, 2026",
        location: "Jeju, Korea",
        note: "International conference in database fields",
      },
    ],
    pastItems: [],
  },
  {
    key: "international",
    title: "International Conferences / Events",
    items: [
      {
        name: "SIGMOD 2027",
        schedule: "June 13 - June 19, 2027",
        location: "Huntington Beach, CA, USA",
        note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (2/4): April 17, 2026",
      },
      {
        name: "CCS 2026",
        schedule: "November 15 - November 19, 2026",
        location: "The Hague, The Netherlands",
        note: "ACM Conference on Computer and Communications Security; Systems - computer security; Deadline (2/2): April 29, 2026",
      },
      {
        name: "CoRL 2026",
        schedule: "November 9 - November 12, 2026",
        location: "Austin, TX, USA",
        note: "Conference on Robot Learning; workshops on November 9 and main conference on November 10-12",
      },
      {
        name: "IMC 2026",
        schedule: "November 3 - November 6, 2026",
        location: "Karlsruhe, Germany",
        note: "Internet Measurement Conference; Systems - measurement and performance analysis; Deadline (2/2): April 29, 2026",
      },
      {
        name: "NDSS 2027",
        schedule: "February TBD, 2027",
        location: "San Diego, CA, USA",
        note: "ISOC Network and Distributed System Security Symposium; Systems - computer security; Deadline (1/2): May 6, 2026",
      },
      {
        name: "PODS 2027",
        schedule: "June 13 - June 19, 2027",
        location: "Huntington Beach, CA, USA",
        note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (1/2): May 30, 2026",
      },
      {
        name: "VLDB 2026",
        schedule: "August 31 - September 4, 2026",
        location: "Boston, MA, USA",
        note: "International Conference on Very Large Data Bases; Systems - databases; Deadline: June 15, 2026",
      },
      {
        name: "ICSE 2027",
        schedule: "April 25 - May 1, 2027",
        location: "Dublin, Ireland",
        note: "International Conference on Software Engineering; Systems - software engineering; Deadline: June 30, 2026",
      },
      {
        name: "POPL 2027",
        schedule: "January 10 - January 16, 2027",
        location: "Mexico City, Mexico",
        note: "ACM SIGPLAN Symposium on Principles of Programming Languages; Systems - programming languages; Deadline: July 9, 2026",
      },
      {
        name: "SIGMOD 2027",
        schedule: "June 13 - June 19, 2027",
        location: "Huntington Beach, CA, USA",
        note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (3/4): July 17, 2026",
      },
      {
        name: "NDSS 2027",
        schedule: "February TBD, 2027",
        location: "San Diego, CA, USA",
        note: "ISOC Network and Distributed System Security Symposium; Systems - computer security; Deadline (2/2): August 19, 2026",
      },
      {
        name: "ASPLOS 2027",
        schedule: "April 11 - April 15, 2027",
        location: "Crete, Greece",
        note: "ACM International Conference on Architectural Support for Programming Languages and Operating Systems; Systems - computer architecture; Deadline (2/2): September 9, 2026",
      },
      {
        name: "FAST 2027",
        schedule: "February 23 - February 25, 2027",
        location: "Renton, WA, USA",
        note: "USENIX Conference on File and Storage Technologies; Systems - operating systems; Deadline (2/2): September 15, 2026",
      },
      {
        name: "SIGMOD 2027",
        schedule: "June 13 - June 19, 2027",
        location: "Huntington Beach, CA, USA",
        note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (4/4): October 17, 2026",
      },
      {
        name: "PODS 2027",
        schedule: "June 13 - June 19, 2027",
        location: "Huntington Beach, CA, USA",
        note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (2/2): December 10, 2026",
      },
      {
        name: "SC 2026",
        schedule: "November 15 - November 20, 2026",
        location: "Chicago, IL, USA",
        note: "The International Conference for High Performance Computing, Networking, Storage, and Analysis; Systems - high-performance computing; Deadline: April 8, 2026",
      },
      ...CONFERENCE_INDEX_COMPUTER_SCIENCE_EVENTS,
    ],
    pastItems: DS_DEADLINES_PAST_EVENTS,
  },
];

const GRADUATION_REQUIREMENTS = [
  {
    number: "01",
    title: "Publication Record Requirement",
    body: "Students must satisfy the publication record requirement before applying for the doctoral dissertation review.",
  },
  {
    number: "02",
    title: "Authorship and Timing",
    body: "Only publications in which the student is the primary author are recognized. The work must be published before the dissertation review, and papers accepted for publication or presentation are also recognized.",
  },
  {
    number: "03",
    title: "Recognized Venues",
    body: "Only journals and academic conferences approved by the AI Education major are recognized as valid publication records.",
  },
  {
    number: "04",
    title: "Conference Requirement",
    body: "Students must have three academic conference papers.",
  },
  {
    number: "05",
    title: "Journal Requirement",
    body: "Students must have either two papers in KCI-listed or KCI-candidate journals, or one paper in an SSCI- or SCIE-level journal.",
  },
];

const GRADUATION_REQUIREMENTS_KO = [
  {
    number: "01",
    title: "논문 실적 요건",
    body: "졸업을 위해서는 학위논문 심사 신청 이전에 논문 실적 기준을 충족해야 합니다.",
  },
  {
    number: "02",
    title: "저자 기준과 인정 시점",
    body: "주저자로 참여한 논문만 실적으로 인정되며, 학위논문 심사 이전에 게재되어야 합니다. 게재 또는 발표가 확정된 논문도 인정됩니다.",
  },
  {
    number: "03",
    title: "인정 학술지 및 학술대회",
    body: "AI교육전공에서 인정하는 학술지와 학술대회만 논문 실적으로 인정됩니다.",
  },
  {
    number: "04",
    title: "학술대회 논문 요건",
    body: "학술대회 논문 3편을 충족해야 합니다.",
  },
  {
    number: "05",
    title: "학술지 논문 요건",
    body: "KCI 등재 또는 등재후보 학술지 논문 2편, 또는 SSCI·SCIE급 학술지 논문 1편을 충족해야 합니다.",
  },
];

const TOP_CS_SCORE_RULES = [
  {
    value: "1.00",
    kiise: "Top",
    bk21: "4",
    kaist: "O",
    snu: "O",
    postech: "Top",
  },
  {
    value: "0.75",
    kiise: "",
    bk21: "3",
    kaist: "",
    snu: "",
    postech: "",
  },
  {
    value: "0.50",
    kiise: "Excellent",
    bk21: "2",
    kaist: "",
    snu: "",
    postech: "Excellent",
  },
  {
    value: "0.25",
    kiise: "",
    bk21: "1",
    kaist: "",
    snu: "",
    postech: "",
  },
  {
    value: "0.00",
    kiise: "",
    bk21: "",
    kaist: "",
    snu: "",
    postech: "",
  },
];

const STUDENT_CV_PROFILES = Object.entries(STUDENT_PROFILES).flatMap(([year, profiles]) =>
  profiles.map((profile) => ({
    ...profile,
    year,
    slug: profile.slug || studentCvSlug(profile.name, year),
    title: profile.title || "Curriculum Vitae",
    email: profile.email || `${slugify(profile.name).replace(/-/g, ".")}@dnue.ac.kr`,
    keywords: profile.keywords?.length ? profile.keywords : ["AI Pedagogy", "Educational Data", "Future Learning"],
    koKeywords: profile.koKeywords?.length ? profile.koKeywords : ["AI 교수학습", "교육 데이터", "미래 학습"],
    education: profile.education?.length ? profile.education : [
      "Graduate School of AI Education, Daegu National University of Education",
      `PhD Student Cohort ${year}`,
    ],
    koEducation: profile.koEducation?.length ? profile.koEducation : [
      "대구교육대학교 AI교육전공 박사과정",
      `${year}학년도 입학`,
    ],
    researchInterests: profile.researchInterests?.length ? profile.researchInterests : [
      "AI pedagogy and instructional innovation",
      "Educational data and future classroom design",
      "School-based applications of artificial intelligence",
    ],
    koResearchInterests: profile.koResearchInterests?.length ? profile.koResearchInterests : [
      "AI 교수학습 및 수업 혁신",
      "교육 데이터와 미래 교실 설계",
      "학교 현장 기반 인공지능 활용",
    ],
    activities: profile.activities?.length ? profile.activities : [
      "Participation in doctoral seminars and collaborative research activities",
      "Development of research interests aligned with the direction of the lab",
    ],
    koActivities: profile.koActivities?.length ? profile.koActivities : [
      "박사과정 세미나 및 공동 연구 활동 참여",
      "소속 연구실의 방향과 연계한 연구 관심 분야 개발",
    ],
    presentedPapers: profile.presentedPapers || [],
    koPresentedPapers: profile.koPresentedPapers || [],
  }))
);

const STATIC_PUBLICATION_LISTS = {
  "2026": [
    {
      type: "Korean Journal",
      title: "Comparative Analysis of AI Models for Enhancing Collaborative Learning Support Systems: Focusing on Korean Speech Recognition and Feedback",
      koTitle: "협력학습 지원 시스템 개선을 위한 AI 모델 비교 분석: 한국어 음성 인식 및 피드백을 중심으로",
      authors: "Gukhwan Bae, Youngho Lee, and Panwoo Park",
      koAuthors: "배국환, 이영호, 박판우",
      venue: "Journal of the Korean Association of Information Education, 30(1), 125-135.",
      koVenue: "정보교육학회논문지, 30(1), 125-135.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003309150",
    },
    {
      type: "Korean Journal",
      title: "Exploring AI Education Improvement Strategies Based on the Concept of Context Engineering in the 2022 Revised Curriculum",
      koTitle: "2022 개정 교육과정에서 Context Engineering 개념 기반의 AI 교육 개선 방안 탐색",
      authors: "Inhwan Yoo and Minjeong Kang",
      koAuthors: "유인환, 강민정",
      venue: "The Journal of the Korean Association of Computer Education, 30(1), 137-147.",
      koVenue: "컴퓨터교육학회 논문지, 30(1), 137-147.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003309156",
    },
    {
      type: "Korean Journal",
      title: "Exploring AI Programming Education Methods Using AI Agents and Educational Robots",
      koTitle: "AI 에이전트와 교육용 로봇을 활용한 AI 프로그래밍 교육 방법 탐색",
      authors: "Inhwan Yoo and Daeryun Park",
      koAuthors: "유인환, 박대륜",
      venue: "The Journal of the Korean Association of Computer Education, 30(1), 149-159.",
      koVenue: "컴퓨터교육학회 논문지, 30(1), 149-159.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003309158",
    },
    {
      type: "Korean Journal",
      title: "A Study on the Development of a Teacher Training System to Enhance Digital Educational Competency",
      koTitle: "디지털 교육 역량 강화를 위한 교사 연수 시스템 개발 연구",
      authors: "Jeongseo Lee and Wooyeol Kim",
      koAuthors: "이정서, 김우열",
      venue: "Journal of Consulting Convergence Research, 6(1), 2-7.",
      koVenue: "컨설팅융합연구, 6(1), 2-7.",
      doi: "10.55479/JCCR.2026.6.1.2",
      url: "https://doi.org/10.55479/JCCR.2026.6.1.2",
    },
  ],
  "2025": [
    {
      type: "Korean Journal",
      title: "The Impact of Prompt Formats on the Robustness of LLMs",
      koTitle: "프롬프트 형식이 LLM의 견고성에 미치는 영향",
      authors: "Seunghyun Lee and Youngho Lee",
      koAuthors: "이승현, 이영호",
      venue: "The Journal of the Korean Association of Computer Education, 28(12), 1-12.",
      koVenue: "컴퓨터교육학회 논문지, 28(12), 1-12.",
      doi: "10.32431/kace.2025.28.12.001",
      url: "https://doi.org/10.32431/kace.2025.28.12.001",
    },
    {
      type: "Korean Journal",
      title: "Research on Developing and Applying a Korean-based Lightweight LLM for Schools",
      koTitle: "학교를 위한 한국어 기반 경량 LLM 개발 및 적용 연구",
      authors: "Gukhwan Bae, Youngho Lee, and Panwoo Park",
      koAuthors: "배국환, 이영호, 박판우",
      venue: "Journal of the Korean Association of Information Education, 29(4), 459-470.",
      koVenue: "정보교육학회논문지, 29(4), 459-470.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003236175",
    },
    {
      type: "Korean Journal",
      title: "Development and Implementation of IB PYP-based Unit of Inquiry and Machine Learning Education Program",
      koTitle: "IB PYP 기반 탐구 단원 및 머신러닝 교육 프로그램 개발 및 실행",
      authors: "Hyejeong Cho and Inhwan Yoo",
      koAuthors: "조혜정, 유인환",
      venue: "Journal of Elementary Education, 41(3), 1-20.",
      koVenue: "초등교육연구, 41(3), 1-20.",
      doi: "10.23103/dnueje.2025.41.3.1",
      url: "https://doi.org/10.23103/dnueje.2025.41.3.1",
    },
    {
      type: "Korean Journal",
      title: "Development of an AI Chatbot for Teaching Reading to Elementary School Students",
      koTitle: "초등학생 읽기 지도를 위한 AI 챗봇 개발",
      authors: "Seunguk Jeong and Panwoo Park",
      koAuthors: "정승욱, 박판우",
      venue: "Intelligence Information Convergence and Future Education, 4(28), 1-7.",
      koVenue: "지능정보융합과 미래교육, 4(28), 1-7.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003278172",
    },
    {
      type: "Korean Journal",
      title: "Policies and Case Studies of Major Countries for Artificial Intelligence-based Education",
      koTitle: "인공지능 기반 교육을 위한 주요국의 정책 및 사례 연구",
      authors: "Panwoo Park",
      koAuthors: "박판우",
      venue: "Journal of the Korean Association of Information Education, 29(2), 133-140.",
      koVenue: "정보교육학회논문지, 29(2), 133-140.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003201860",
    },
    {
      type: "Korean Journal",
      title: "A Study on the Design and Development of an AI Based Group Chat System for Collaborative Learning",
      koTitle: "협력학습을 위한 AI 기반 그룹 채팅 시스템 설계 및 개발 연구",
      authors: "Youngho Lee",
      koAuthors: "이영호",
      venue: "Intelligence Information Convergence and Future Education, 4(31), 1-8.",
      koVenue: "지능정보융합과 미래교육, 4(31), 1-8.",
      doi: "",
      url: "https://www.kci.go.kr/kciportal/ci/sereArticleSearch/ciSereArtiView.kci?sereArticleSearchBean.artiId=ART003280651",
    },
  ],
  "2024": [
    {
      type: "Korean Journal",
      title: "Designing an Automated Syllabus Assessment Framework Using a RAG-based LLM",
      koTitle: "RAG 기반 LLM을 활용한 자동화된 강의계획서 평가 프레임워크 설계",
      authors: "Younghan Lee and Jaekwon Shim",
      koAuthors: "이용한, 심재권",
      venue: "Journal of Convergence Science, Technology, and Society, 3(2), 59-67.",
      koVenue: "융합과학기술사회연구, 3(2), 59-67.",
      doi: "10.56366/jcsts.2024.3.2.59",
      url: "https://doi.org/10.56366/jcsts.2024.3.2.59",
    },
  ],
};

const buildPublicationLists = (publications) => {
  if (!Array.isArray(publications) || publications.length === 0) {
    return STATIC_PUBLICATION_LISTS;
  }

  return publications.reduce((groups, publication) => {
    const year = String(publication.year || new Date().getFullYear());
    const currentGroup = groups[year] || [];
    const normalizedPublication = {
      type: publication.type || "Korean Journal",
      title: publication.title || "",
      koTitle: publication.koTitle || "",
      authors: publication.authors || "",
      koAuthors: publication.koAuthors || "",
      venue: publication.venue || "",
      koVenue: publication.koVenue || "",
      doi: publication.doi || "",
      url: publication.url || (publication.doi ? `https://doi.org/${publication.doi}` : ""),
      order: publication.order ?? 9999,
    };

    return {
      ...groups,
      [year]: [...currentGroup, normalizedPublication],
    };
  }, {});
};

const PUBLICATION_LISTS = buildPublicationLists(notionPublications);

const getLocalizedPublication = (item, language) => {
  if (language !== "ko") {
    return item;
  }

  return {
    ...item,
    title: item.koTitle || item.title,
    authors: item.koAuthors || item.authors,
    venue: item.koVenue || item.venue,
  };
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
        "• Address: Sangrok Education Center No.405, DNUE, 219 Jungang-daero, Nam-gu, Daegu City, Republic of Korea (42411)",
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
        "Doctoral Dissertation Review Application Requirements",
        "Publication record requirement: To graduate, students must satisfy the publication record requirement before applying for the dissertation review.",
        "Only publications in which the student is the primary author are recognized, and the work must be published before the dissertation review. Papers accepted for publication or presentation are also recognized.",
        "Only journals and academic conferences approved by the AI Education major are recognized as valid publication records.",
        "Students must have three academic conference papers.",
        "Students must have either two papers in KCI-listed or KCI-candidate journals, or one paper in an SSCI- or SCIE-level journal.",
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
  conferences: {
    title: "Conferences",
    headline: "Domestic and international conference schedules",
    subheadline: "",
    body: {
      default: [
        "Conference schedules are organized as a reference list for students and researchers in the AI Education major.",
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

const PAGE_COPY_KO = {
  about: {
    title: "About",
    headline: "AI교육전공 소개",
    subheadline: "",
    body: {
      greetings: [
        "AI교육전공은 인공지능 시대에 요구되는 창의융합형 인재를 기르기 위한 AI교육 전문가를 양성합니다.",
        "AI학술연구, AI융합교육, AI활용교육의 세 영역을 중심으로 특화된 교육과정을 운영합니다.",
        "인공지능, 로봇, 빅데이터, 사물인터넷 등 기술 변화에 대응하며 학교 교육 혁신을 이끌 수 있는 역량을 기릅니다.",
      ],
      introduction: [
        "최신 AI 기술에 대한 이해를 바탕으로 교육학, 컴퓨터과학, 데이터과학, 사회과학 등 다양한 학문 분야를 융합하여 연구합니다.",
        "AI 시대 교육 패러다임의 변화를 주도하고 미래 사회가 요구하는 창의적이고 비판적인 전문 인재를 양성하는 것을 비전으로 합니다.",
      ],
      history: [
        "첫째, AI교육 분야의 이론적 전문성과 최신 연구방법론을 습득하여 창의적이고 혁신적인 연구를 수행할 수 있는 역량을 기릅니다.",
        "둘째, 다양한 프로그래밍 언어와 AI 기술을 심도 있게 탐구하여 효과적인 AI 기반 교수·학습 콘텐츠를 개발할 수 있는 능력을 갖춥니다.",
        "셋째, AI디지털 정책과 리더십 역량을 강화하여 교육 현장의 문제를 분석하고 효과적인 해결책을 제시할 수 있는 컨설팅 능력을 함양합니다.",
        "넷째, 데이터과학과 AI를 활용한 맞춤형 교육 설계 및 평가 방법을 연구하여 현장 중심의 실천적 교육 모델을 개발합니다.",
        "다섯째, AI 리터러시와 윤리적 이해를 바탕으로 미래 교육 환경에서 요구되는 바람직한 가치관과 태도를 기르고 AI교육의 사회적 책무성을 실천합니다.",
      ],
      donation: [
        "졸업 후에는 AI 기술을 교육 현장에 효과적으로 적용하기 위한 교수·학습 전략, 평가 방법, 정책 방향 등을 탐구하는 AI교육 연구자로 진출할 수 있습니다.",
        "초·중등학교 및 교육청 등에서 미래 교육 정책을 수립하고 학교 경영과 교육 혁신을 주도하는 학교 관리자 및 교육전문직으로 활동할 수 있습니다.",
        "공공 및 민간 교육연구기관, AI 기반 교육기업 등에서 교육 데이터 분석, AI 시스템 기획 및 평가, 정책 개발과 자문을 수행할 수 있습니다.",
      ],
      reservation: [
        "• 입학 문의: 교육전문대학원 행정실 053-620-1299",
        "• 수업 문의: AI교육전공 사무실 053-620-1430",
        "• 주소: 대구광역시 남구 중앙대로 219 대구교육대학교 상록교육관 405호",
      ],
      default: ["AI교육전공의 방향과 교육 목표를 소개합니다."],
    },
  },
  people: {
    title: "People",
    headline: "AI교육전공 교수진 및 구성원",
    subheadline: "",
    body: {
      faculty: [],
      students: [],
      default: ["AI교육전공을 구성하는 교수진과 학문 공동체를 소개합니다."],
    },
  },
  labs: {
    title: "Labs",
    headline: "연구실과 연구 주제",
    subheadline: "",
    body: { default: [] },
  },
  research: {
    title: "Publications",
    headline: "연도별 논문 및 연구 성과",
    subheadline: "",
    body: {
      "2026": ["2026년 논문 성과를 연도별로 정리합니다."],
      "2025": ["2025년 논문 성과를 연도별로 정리합니다."],
      "2024": ["2024년 논문 성과를 연도별로 정리합니다."],
      default: ["논문 및 연구 성과를 검색 가능한 형태로 정리합니다."],
    },
  },
  academics: {
    title: "Academics",
    headline: "AI교육전공의 교육과정과 학사 구조",
    subheadline: "",
    body: {
      admission: [
        "입학 일정과 절차는 교육전문대학원의 공식 안내에 따라 정리할 수 있습니다.",
        "현재 이 페이지는 AI교육, 교육과정 설계, 교육 혁신에 관심 있는 지원자를 위한 안내 공간입니다.",
      ],
      graduation: [],
      curriculum: [],
      default: ["AI교육전공의 교육과정과 학사 구조를 체계적으로 소개합니다."],
    },
  },
  conferences: {
    title: "Conferences",
    headline: "국내외 학회 및 행사 일정",
    subheadline: "",
    body: {
      default: ["AI교육전공 학생과 연구자를 위한 국내외 학회 일정을 정리합니다."],
    },
  },
  bk21: {
    title: "Project",
    headline: "프로젝트 소개 및 확장 영역",
    subheadline: "",
    body: {
      default: ["향후 프로젝트 소개, 성과, 자료 등을 정리할 수 있는 별도 영역입니다."],
    },
  },
};

const CURRICULUM_SUMMARY = [
  { category: "requiredMajor", courses: ["SW/AI Education Topics", "AI Education Research Methodology", "Advanced Study of Programming Language"], semesterCredits: "1-4 / 3", requirement: "" },
  { category: "electiveMajor", courses: ["AI Digital Policy Seminar", "AI Education Consulting Topic", "AI Digital Innovation Plan Seminar", "AI Digital Literacy Research", "AI Digital Textbook Research", "Understanding AI Digital Leadership", "Understanding Giftedness and AI", "Topics in AI Programming", "Topics in Data Science", "AI and Media Art", "AI Education Research Seminar", "AI Digital Education Research", "AI-based Teaching and Learning Methodology", "AI-based Educational Content Development", "AI Curriculum and Class Consulting"], semesterCredits: "1-6 / 3", requirement: "Select 9" },
  { category: "dissertation", courses: ["Dissertation Research I", "Dissertation Research II"], semesterCredits: "5 / 3, 6 / 3", requirement: "P/F" },
];

const CURRICULUM_SUMMARY_KO = [
  { category: "requiredMajor", courses: ["SW/AI 교육 특론", "AI교육 연구방법론", "프로그래밍 언어 심화 연구"], semesterCredits: "1~4 / 3", requirement: "" },
  { category: "electiveMajor", courses: ["AI디지털 정책 세미나", "AI교육 컨설팅 특론", "AI디지털 혁신 방안 세미나", "AI디지털 리터러시 연구", "AIDT 연구", "AI디지털 리더십 이해", "영재와 AI의 이해", "AI프로그래밍 특론", "데이터과학 특론", "AI와 미디어아트", "AI교육 연구세미나", "AI디지털 교육 프로젝트 연구", "AI기반 교수학습설계 방법론", "AI기반 교육 콘텐츠 개발", "AI교육과정과 수업 컨설팅"], semesterCredits: "1~6 / 3", requirement: "택9" },
  { category: "dissertation", courses: ["논문연구Ⅰ", "논문연구Ⅱ"], semesterCredits: "5 / 3, 6 / 3", requirement: "P/F" },
];

const CURRICULUM_COURSES = [
  { category: "requiredMajor", title: "SW/AI Education Topics", koTitle: "SW/AI 교육 특론", description: "Explores domestic and international trends in software and AI education, including educational content, methods, environments, policy, and ethics.", koDescription: "소프트웨어와 인공지능 교육의 국내외 동향을 살펴보고 교육내용, 방법, 환경, 정책, 윤리 등을 포괄적으로 탐구합니다." },
  { category: "requiredMajor", title: "AI Education Research Methodology", koTitle: "AI교육 연구방법론", description: "Covers hypothesis setting, experimental design, statistical analysis, scientific reasoning, measurement tools, and analytic methods required for AI education research.", koDescription: "가설 설정, 실험 설계, 통계 분석 등 연구방법론의 핵심 주제를 다루고 AI교육 연구에 필요한 과학적 논리, 측정도구, 분석방법을 습득합니다." },
  { category: "requiredMajor", title: "Advanced Study of Programming Language", koTitle: "프로그래밍 언어 심화 연구", description: "Studies computer programming for computational problem solving and examines diverse programming languages from the perspective of programming language theory.", koDescription: "컴퓨팅 기반 문제 해결을 위해 프로그래밍을 탐구하고 프로그래밍 언어론의 관점에서 다양한 프로그래밍 언어를 학습합니다." },
  { category: "electiveMajor", title: "AI Digital Policy Seminar", koTitle: "AI디지털 정책 세미나", description: "Analyzes domestic and international AI and digital policies and discusses implications for effective application in educational settings.", koDescription: "AI와 디지털 관련 국내외 정책을 조사·분석하고 교육 현장에 효과적으로 적용하기 위한 시사점을 토론합니다." },
  { category: "electiveMajor", title: "AI Education Consulting Topic", koTitle: "AI교육 컨설팅 특론", description: "Explores consulting elements for innovative teaching and learning strategies across the design and implementation process of AI education.", koDescription: "AI교육 설계 초기 단계부터 과정 전반에 걸쳐 혁신 교수·학습 방법과 전략에 대한 컨설팅 요소를 탐구합니다." },
  { category: "electiveMajor", title: "AI Digital Innovation Plan Seminar", koTitle: "AI디지털 혁신 방안 세미나", description: "Examines current theory and practice in digital innovation from the perspectives of students, teachers, administrators, and parents.", koDescription: "디지털 관련 최신 이론과 실제를 탐구하고 학생, 교사, 관리자, 학부모 관점에서 교육 변화 방향을 토론합니다." },
  { category: "electiveMajor", title: "AI Digital Literacy Research", koTitle: "AI디지털 리터러시 연구", description: "Studies the history and concepts of digital literacy and analyzes AI digital literacy assessment tools from media, ethics, and tool-use perspectives.", koDescription: "디지털 리터러시의 역사와 개념을 이해하고 미디어, 윤리, 도구 관점에서 AI디지털 리터러시 검사도구의 현장 적용 방안을 탐구합니다." },
  { category: "electiveMajor", title: "AI Digital Textbook Research", koTitle: "AIDT 연구", description: "Analyzes AI-based learning platforms and digital textbooks in relation to pedagogy, content, environment, and learning ecology.", koDescription: "AI 기반 교수학습 플랫폼과 디지털교과서를 교수학습방법, 내용, 환경, 학습생태계 관점에서 분석합니다." },
  { category: "electiveMajor", title: "Understanding AI Digital Leadership", koTitle: "AI디지털 리더십 이해", description: "Discusses strategies and execution required of educational leaders in environments transformed by AI and digital technologies.", koDescription: "AI와 디지털 기술이 교육에 영향을 미치는 시대에 교육 리더에게 필요한 전략과 실행력을 논의합니다." },
  { category: "electiveMajor", title: "Understanding Giftedness and AI", koTitle: "영재와 AI의 이해", description: "Studies gifted education trends and explores directions for gifted education in an AI and digital society.", koDescription: "국내외 영재교육의 역사와 현황을 바탕으로 AI·디지털 사회 전환에 대비한 영재교육의 방향을 학습합니다." },
  { category: "electiveMajor", title: "Topics in AI Programming", koTitle: "AI프로그래밍 특론", description: "Covers machine learning, deep learning, natural language processing, programming practice, model implementation, and performance evaluation.", koDescription: "머신러닝, 딥러닝, 자연어처리 등 최신 AI프로그래밍 기술을 다루고 실습을 통해 AI모델 구현과 성능 평가 방법을 학습합니다." },
  { category: "electiveMajor", title: "Topics in Data Science", koTitle: "데이터과학 특론", description: "Covers data analysis, visualization, statistics, data literacy, and the relationship between data and AI model development.", koDescription: "데이터 분석, 시각화, 통계 기법, 데이터 리터러시를 다루고 데이터와 AI모델 개발의 연계성을 탐구합니다." },
  { category: "electiveMajor", title: "AI and Media Art", koTitle: "AI와 미디어아트", description: "Explores how AI is applied to media art and discusses creative expression, convergence, and ethical issues.", koDescription: "AI가 미디어아트에 적용되는 방식과 창의적 표현 방법을 탐구하고 AI와 예술 융합의 가능성과 윤리적 이슈를 논의합니다." },
  { category: "electiveMajor", title: "AI Education Research Seminar", koTitle: "AI교육 연구세미나", description: "Reviews recent AI education research and strengthens the ability to critically evaluate research methods and findings.", koDescription: "AI교육 관련 최신 연구 동향을 파악하고 논문의 연구 방법과 결과를 비판적으로 평가하는 역량을 기릅니다." },
  { category: "electiveMajor", title: "AI Digital Education Research", koTitle: "AI디지털 교육 프로젝트 연구", description: "Develops practical and collaborative capabilities through team-based research projects related to AI and digital education.", koDescription: "AI와 디지털 교육 관련 연구 프로젝트를 팀 단위로 수행하며 실무 역량과 협업 능력을 기릅니다." },
  { category: "electiveMajor", title: "AI-based Teaching and Learning Methodology", koTitle: "AI기반 교수학습설계 방법론", description: "Explores AI-based instructional design, assessment, inquiry learning, AI concepts, tools, personalized evaluation, and feedback.", koDescription: "AI기반 교수학습 설계와 평가 방법, 탐구학습, AI 도구 활용, 맞춤형 평가와 피드백 방법을 탐구합니다." },
  { category: "electiveMajor", title: "AI-based Educational Content Development", koTitle: "AI기반 교육 콘텐츠 개발", description: "Studies methods for teaching AI concepts with educational tools and designing educational content using AI-supported tools.", koDescription: "다양한 교구와 AI지원 도구를 활용하여 AI 기본 개념과 기술을 전달하고 교육 콘텐츠를 설계·개발하는 방법을 학습합니다." },
  { category: "electiveMajor", title: "AI Curriculum and Class Consulting", koTitle: "AI교육과정과 수업 컨설팅", description: "Compares domestic and international AI curricula and studies curriculum design and class consulting for AI education practice.", koDescription: "국내외 AI교육과정을 탐색·비교하고 효과적인 AI교육과정 설계와 수업 컨설팅 방법을 학습합니다." },
];

function getMenu(menuKey) {
  return SITE_MAP.find((menu) => menu.key === menuKey);
}

function getSectionLabel(menuKey, sectionKey) {
  return getMenu(menuKey)?.sections.find((section) => section.key === sectionKey)?.label || "";
}

function getPageContent(menuKey, sectionKey, language = "en") {
  const pages = language === "ko" ? PAGE_COPY_KO : PAGE_COPY;
  const fallbackPage = PAGE_COPY[menuKey];
  const page = pages[menuKey] || fallbackPage;
  if (!page) {
    return null;
  }
  return {
    ...page,
    paragraphs: page.body[sectionKey] || page.body.default || fallbackPage?.body?.[sectionKey] || fallbackPage?.body?.default || [],
  };
}

function getProfiles(sectionKey) {
  return FACULTY_PROFILES;
}

const ABOUT_SECTION_LABELS = {
  en: {
    greetings: "Overview",
    introduction: "Vision",
    history: "Educational Goals",
    donation: "Career Paths",
    reservation: "Contact",
  },
  ko: {
    greetings: "전공 개요",
    introduction: "비전",
    history: "교육 목표",
    donation: "진로",
    reservation: "문의 안내",
  },
};

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

function Header({ dark, isHome, onHome, onNavigate, onOpenMenu, desktopMenuKey, onToggleDesktopMenu, language, onToggleLanguage }) {
  return (
    <header className={`top-header ${dark ? "is-dark" : "is-light"} ${isHome ? "is-home" : "is-inner"}`}>
      <Brand dark={dark} onHome={onHome} />
      <nav
        className="desktop-nav"
        aria-label="Primary"
        onMouseLeave={() => onToggleDesktopMenu("")}
      >
        <ul className="desktop-nav-list">
          <li className="desktop-nav-item desktop-language-item">
            <LanguageToggle language={language} onToggleLanguage={onToggleLanguage} />
          </li>
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
      <div className="header-actions">
        <LanguageToggle language={language} onToggleLanguage={onToggleLanguage} className="mobile-language-toggle" />
        <button className={`menu-button ${dark ? "is-dark" : "is-light"}`} type="button" aria-label="Open menu" onClick={onOpenMenu}>
          <span />
          <span />
          <span />
        </button>
      </div>
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

function LanguageToggle({ language, onToggleLanguage, className = "" }) {
  const isKorean = language === "ko";

  return (
    <button
      className={`language-toggle ${isKorean ? "is-ko" : "is-en"} ${className}`}
      type="button"
      onClick={onToggleLanguage}
      aria-label="Toggle language"
    >
      <span className="language-globe" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18" />
          <path d="M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9" />
          <path d="M12 3c-2.4 2.5-3.6 5.5-3.6 9s1.2 6.5 3.6 9" />
        </svg>
      </span>
      <span className="language-options" aria-hidden="true">
        <span className="language-slider" />
        <span className="language-option">KR</span>
        <span className="language-option">EN</span>
      </span>
    </button>
  );
}

function HomePage({ language }) {
  const text = getText(language);

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
                      <p>{text.noPublicationsYet}</p>
                    </div>
                  ) : (
                    <div className="home-publication-items">
                      {items.map((item) => {
                        const localizedItem = getLocalizedPublication(item, language);
                        const showEnglishOriginal = language === "ko";

                        return (
                          <a
                            key={`${year}-${item.title}`}
                            className="home-publication-entry"
                            href={item.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <p className="home-publication-type">{localizedItem.type}</p>
                            <h3>{localizedItem.title}</h3>
                            {showEnglishOriginal ? <p className="home-publication-english-title">{item.title}</p> : null}
                            <p className="home-publication-meta">{localizedItem.authors}</p>
                            <p className="home-publication-meta">{localizedItem.venue}</p>
                            {item.doi ? <p className="home-publication-meta home-publication-doi">DOI {item.doi}</p> : null}
                          </a>
                        );
                      })}
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

const SPLINE_LANDING_URL = "https://my.spline.design/displacelines-LS4TQIxZI0gVrTKi0K58h1m1/";
const splineRestartUrl = (id) => `${SPLINE_LANDING_URL}?restart=${id}`;
const SPLINE_RESTART_INTERVAL_MS = 55_000;

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

function PublicationList({ sectionKey, query, searchMode, language }) {
  const text = getText(language);
  const items = PUBLICATION_LISTS[sectionKey] || PUBLICATION_LISTS["2026"] || [];
  const normalizedQuery = query.trim().toLowerCase();
  const allItems = Object.entries(PUBLICATION_LISTS).flatMap(([year, yearItems]) =>
    yearItems.map((item) => ({ ...item, year }))
  );
  const filteredItems = normalizedQuery
    ? allItems.filter((item) =>
        (searchMode === "authors"
          ? `${item.authors} ${item.koAuthors || ""}`
          : `${item.title} ${item.koTitle || ""}`)
          .toLowerCase()
          .includes(normalizedQuery)
      )
    : items.map((item) => ({ ...item, year: sectionKey }));

  if (items.length === 0) {
    return (
      <div className="publication-list">
        <article className="publication-item">
          <p className="publication-type">{text.noPublicationsYet}</p>
          <h4>{text.noPublicationEntries(sectionKey)}</h4>
        </article>
      </div>
    );
  }

  if (filteredItems.length === 0) {
    return (
      <div className="publication-list">
        <article className="publication-item">
          <p className="publication-type">{text.noMatchingResults}</p>
          <h4>{text.noPublicationsMatched(query)}</h4>
        </article>
      </div>
    );
  }

  return (
    <div className="publication-list">
      {filteredItems.map((item) => {
        const localizedItem = getLocalizedPublication(item, language);
        const showEnglishOriginal = language === "ko";

        return (
          <article key={`${item.year}-${item.title}`} className="publication-item">
            {normalizedQuery ? <p className="publication-year-tag">{item.year}</p> : null}
            <p className="publication-type">{localizedItem.type}</p>
            <h4>
              <a href={item.url} target="_blank" rel="noreferrer">
                {localizedItem.title}
              </a>
            </h4>
            {showEnglishOriginal ? <p className="publication-english-title">{item.title}</p> : null}
            <p>{localizedItem.authors}</p>
            <p>{localizedItem.venue}</p>
            {item.doi ? (
              <p className="publication-doi">
                <span>DOI</span>
                <a href={item.url} target="_blank" rel="noreferrer">
                  {item.doi}
                </a>
              </p>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}

function ProfileGrid({ sectionKey, language }) {
  const text = getText(language);
  const profiles = getProfiles(sectionKey);
  const isFaculty = sectionKey === "faculty";

  return (
    <div className={`profile-grid ${isFaculty ? "faculty-profile-grid" : ""}`}>
      {profiles.map((profile) => {
        const courses = language === "ko" && profile.koCourses ? profile.koCourses : profile.courses;

        return (
          <article
            key={`${sectionKey}-${profile.name}`}
            id={personAnchorId({ section: sectionKey, name: profile.name })}
            className={`profile-card ${isFaculty ? "faculty-profile-card" : ""}`}
          >
            <div className={`profile-image ${profile.image ? "has-photo" : ""} ${profile.imageClassName ?? ""}`} aria-hidden="true">
              {profile.image ? <img className="profile-photo" src={profile.image} alt="" loading="lazy" /> : null}
            </div>
            <div className="profile-content">
              <h4>{language === "ko" && profile.koName ? profile.koName : profile.name}</h4>
              <p>{profile.position}</p>
              {isFaculty ? (
                <>
                  <p><strong>{text.researchArea}</strong> {profile.research}</p>
                  <p className="profile-courses"><strong>{text.courses}</strong> {courses.join(" / ")}</p>
                  <p><strong>{text.office}</strong> {profile.office}</p>
                  <p><strong>{text.phone}</strong> {profile.phone}</p>
                  <p><strong>{text.email}</strong> {profile.email}</p>
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
        );
      })}
    </div>
  );
}

function StudentYearGroups({ onOpenCv, language }) {
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
                  <h4>{language === "ko" ? profile.koName : profile.name}</h4>
                  <p>{language === "ko" ? profile.koLab : profile.lab}</p>
                  <button type="button" className="student-cv-link" onClick={() => onOpenCv(profile.slug || studentCvSlug(profile.name, year))}>
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

function ConferenceTables({ sectionKey, language }) {
  const text = getText(language);
  const [topConferenceQuery, setTopConferenceQuery] = useState("");
  const [internationalConferenceQuery, setInternationalConferenceQuery] = useState("");
  const [internationalConferenceSearchMode, setInternationalConferenceSearchMode] = useState("conference");
  const selectedGroup = CONFERENCE_GROUPS.find((group) => group.key === sectionKey) || CONFERENCE_GROUPS[0];
  const showTopConferences = sectionKey === "top-cs";
  const showInternationalSearch = sectionKey === "international";
  const normalizedQuery = topConferenceQuery.trim().toLowerCase();
  const normalizedInternationalQuery = internationalConferenceQuery.trim().toLowerCase();
  const filteredTopConferences = useMemo(() => {
    if (!normalizedQuery) {
      return CS_TOP_CONFERENCES;
    }

    return CS_TOP_CONFERENCES.filter((item) =>
      [
        item.acronym,
        item.name,
        item.kiise2024,
        item.bk21Plus2018,
        item.kaistCs2022,
        item.snuCse2024,
        item.postechCse2026,
      ]
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  const monthMap = {
    january: 0,
    february: 1,
    march: 2,
    april: 3,
    may: 4,
    june: 5,
    july: 6,
    august: 7,
    september: 8,
    october: 9,
    november: 10,
    december: 11,
  };
  const monthLabels = Object.keys(monthMap).reduce((labels, month) => {
    labels[monthMap[month]] = `${month.charAt(0).toUpperCase()}${month.slice(1)}`;
    return labels;
  }, {});
  const parseScheduleDate = (schedule) => {
    const value = schedule.toLowerCase();
    const monthName = Object.keys(monthMap).find((month) => value.includes(month));
    const yearMatch = value.match(/\b(20\d{2})\b/);

    if (!monthName || !yearMatch || value.includes("to be announced")) {
      return 0;
    }

    const afterMonth = value.slice(value.indexOf(monthName) + monthName.length);
    const dayMatch = afterMonth.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
    const day = dayMatch ? Number(dayMatch[1]) : 1;

    return new Date(Number(yearMatch[1]), monthMap[monthName], day).getTime();
  };
  const getScheduleDateParts = (schedule) => {
    const value = schedule.toLowerCase();
    const monthName = Object.keys(monthMap).find((month) => value.includes(month));
    const yearMatch = value.match(/\b(20\d{2})\b/);

    if (!monthName || !yearMatch || value.includes("to be announced")) {
      return null;
    }

    return {
      year: Number(yearMatch[1]),
      month: monthMap[monthName],
      label: `${monthLabels[monthMap[monthName]]}, ${yearMatch[1]}`,
      key: `${yearMatch[1]}-${String(monthMap[monthName] + 1).padStart(2, "0")}`,
    };
  };
  const dedupeConferenceItems = (items) => {
    const seen = new Set();

    return items.filter((item) => {
      const key = `${item.name}|${item.schedule}|${item.location}`.toLowerCase().replace(/\s+/g, " ").trim();

      if (seen.has(key)) {
        return false;
      }

      seen.add(key);
      return true;
    });
  };
  const sortByScheduleAsc = (items) =>
    [...items].sort((a, b) => {
      const dateA = parseScheduleDate(a.schedule) || Number.MAX_SAFE_INTEGER;
      const dateB = parseScheduleDate(b.schedule) || Number.MAX_SAFE_INTEGER;

      return dateA - dateB || a.name.localeCompare(b.name);
    });
  const groupByYearMonth = (items) => {
    const groupedItems = new Map();

    sortByScheduleAsc(dedupeConferenceItems(items)).forEach((item) => {
      const dateParts = getScheduleDateParts(item.schedule);
      const key = dateParts?.key || "to-be-announced";
      const label = dateParts?.label || "To Be Announced";

      if (!groupedItems.has(key)) {
        groupedItems.set(key, { key, label, items: [] });
      }

      groupedItems.get(key).items.push(item);
    });

    return Array.from(groupedItems.values());
  };
  const filterConferenceItems = (items) => {
    if (!normalizedInternationalQuery) {
      return items;
    }

    return items.filter((item) => {
      const dateParts = getScheduleDateParts(item.schedule);
      const searchableFields = {
        conference: [item.name, item.note],
        date: [item.schedule, dateParts?.label, dateParts?.year, dateParts ? monthLabels[dateParts.month] : ""],
        location: [item.location],
      };
      const searchableText = (searchableFields[internationalConferenceSearchMode] || searchableFields.conference)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedInternationalQuery);
    });
  };

  const renderTable = (items, label) => (
    <section className="conference-section">
      <h2>{label}</h2>
      <div className="conference-table-wrap">
        <table className="conference-table">
          <thead>
            <tr>
              <th>{text.conferenceEvent}</th>
              <th>{text.schedule}</th>
              <th>{text.location}</th>
              <th>{text.notes}</th>
            </tr>
          </thead>
          <tbody>
            {sortByScheduleAsc(dedupeConferenceItems(items)).map((item) => (
              <tr key={`${label}-${item.name}-${item.schedule}-${item.location}-${item.note}`}>
                <td>
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noreferrer">
                      {item.name}
                    </a>
                  ) : (
                    item.name
                  )}
                </td>
                <td>{item.schedule}</td>
                <td>{item.location}</td>
                <td>{item.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
  const renderGroupedTable = (items, label) => (
    <section className="conference-section conference-grouped-section">
      <h2>{label}</h2>
      <div className="conference-month-groups">
        {groupByYearMonth(items).map((group) => (
          <article className="conference-month-group" key={`${label}-${group.key}`}>
            <h3>{group.label}</h3>
            <div className="conference-table-wrap">
              <table className="conference-table">
                <thead>
                  <tr>
                    <th>{text.conferenceEvent}</th>
                    <th>{text.schedule}</th>
                    <th>{text.location}</th>
                    <th>{text.notes}</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((item) => (
                    <tr key={`${label}-${group.key}-${item.name}-${item.schedule}-${item.location}-${item.note}`}>
                      <td>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer">
                            {item.name}
                          </a>
                        ) : (
                          item.name
                        )}
                      </td>
                      <td>{item.schedule}</td>
                      <td>{item.location}</td>
                      <td>{item.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  if (showTopConferences) {
    return (
      <div className="conference-sections">
        <p className="conference-updated">{text.updatedApril}</p>
        <section className="conference-section">
          <h2>{text.topCsConferences}</h2>
          <div className="top-cs-explainer">
            <p>
              <strong>{text.average}</strong> {language === "ko" ? "은 여러 기준 목록의 인정 값을 정규화한 뒤 산출한 점수입니다. 최우수 또는 동등한 인정은 1.00, 우수 인정은 0.50, 출처별 중간 척도는 0.25 또는 0.75, 미인정 또는 공란은 0.00으로 변환한 뒤 평균을 냅니다." : "is a normalized score calculated from multiple reference lists. Recognition values are converted to numbers before averaging: top-tier or equivalent recognition is treated as 1.00, strong recognition as 0.50, lower recognition as 0.25 or 0.75 depending on the source scale, and missing recognition as 0.00."}
            </p>
            <div className="score-rule-table-wrap">
              <table className="score-rule-table">
                <thead>
                  <tr>
                    <th>Value</th>
                    <th>KIISE (2024)</th>
                    <th>BK21 Plus IF (2018)</th>
                    <th>KAIST CS (2022)</th>
                    <th>SNU CSE (2024.4)</th>
                    <th>POSTECH CSE (2026.1)</th>
                  </tr>
                </thead>
                <tbody>
                  {TOP_CS_SCORE_RULES.map((rule) => (
                    <tr key={rule.value}>
                      <td>{rule.value}</td>
                      <td>{rule.kiise}</td>
                      <td>{rule.bk21}</td>
                      <td>{rule.kaist}</td>
                      <td>{rule.snu}</td>
                      <td>{rule.postech}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="conference-search">
            <label className="publication-search-label" htmlFor="top-cs-search">
              {text.searchConferenceList}
            </label>
            <input
              id="top-cs-search"
              className="publication-search-input conference-search-input"
              type="search"
              placeholder={text.searchConferencePlaceholder}
              value={topConferenceQuery}
              onChange={(event) => setTopConferenceQuery(event.target.value)}
            />
          </div>
          <p className="conference-result-count">
            {text.showingConferences(filteredTopConferences.length, CS_TOP_CONFERENCES.length)}
          </p>
          <div className="conference-table-wrap">
            <table className="conference-table top-cs-table">
              <thead>
                <tr>
                  <th>{text.acronym}</th>
                  <th>{text.conferenceName}</th>
                  <th>{text.scoresRecognition}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTopConferences.map((item) => (
                  <tr key={`${item.acronym}-${item.dblpKey}`}>
                    <td>{item.acronym}</td>
                    <td>{item.name}</td>
                    <td>
                      <span className="top-cs-score">{text.average} {item.normalizedAverage || "-"}</span>
                      <span className="top-cs-ranks">
                        KIISE {item.kiise2024 || "-"} / BK21 {item.bk21Plus2018 || "-"} / KAIST {item.kaistCs2022 || "-"} / SNU {item.snuCse2024 || "-"} / POSTECH {item.postechCse2026 || "-"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="conference-sections">
      <p className="conference-updated">{text.updatedApril}</p>
      {showInternationalSearch ? (
        <div className="publication-search conference-main-search">
          <label className="publication-search-label" htmlFor="international-conference-search">
            {language === "ko" ? "국제학회 검색" : "Search international conferences"}
          </label>
          <div className="publication-search-row">
            <div className="section-select-wrap publication-search-select-wrap">
              <label className="sr-only" htmlFor="international-conference-search-mode">
                {language === "ko" ? "국제학회 검색 기준 선택" : "Select international conference search mode"}
              </label>
              <select
                id="international-conference-search-mode"
                className="section-select publication-search-select"
                value={internationalConferenceSearchMode}
                onChange={(event) => setInternationalConferenceSearchMode(event.target.value)}
              >
                <option value="conference">{language === "ko" ? "컨퍼런스명" : "Conference"}</option>
                <option value="date">{language === "ko" ? "연도 / 월" : "Year / Month"}</option>
                <option value="location">{language === "ko" ? "국가 / 도시" : "Country / City"}</option>
              </select>
            </div>
            <input
              id="international-conference-search"
              className="publication-search-input conference-main-search-input"
              type="search"
              placeholder={
                language === "ko"
                  ? internationalConferenceSearchMode === "conference"
                    ? "컨퍼런스명으로 검색"
                    : internationalConferenceSearchMode === "date"
                      ? "연도 또는 월로 검색"
                      : "국가 또는 도시로 검색"
                  : internationalConferenceSearchMode === "conference"
                    ? "Search by conference name"
                    : internationalConferenceSearchMode === "date"
                      ? "Search by year or month"
                      : "Search by country or city"
              }
              value={internationalConferenceQuery}
              onChange={(event) => setInternationalConferenceQuery(event.target.value)}
            />
          </div>
        </div>
      ) : null}
      {renderGroupedTable(
        showInternationalSearch ? filterConferenceItems(selectedGroup.items) : selectedGroup.items,
        selectedGroup.title
      )}
    </div>
  );
}

function GraduationRequirements({ language }) {
  const requirements = language === "ko" ? GRADUATION_REQUIREMENTS_KO : GRADUATION_REQUIREMENTS;

  return (
    <div className="requirements-panel">
      <div className="requirements-list">
        {requirements.map((item) => (
          <article key={item.number} className="requirement-item">
            <span className="requirement-number">{item.number}</span>
            <div>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function CurriculumPage({ language }) {
  const text = getText(language);
  const isKo = language === "ko";
  const summary = isKo ? CURRICULUM_SUMMARY_KO : CURRICULUM_SUMMARY;
  const groupedCourses = ["requiredMajor", "electiveMajor"].map((category) => ({
    category,
    items: CURRICULUM_COURSES.filter((course) => course.category === category),
  }));

  return (
    <div className="curriculum-panel">
      <section className="curriculum-section">
        <h2>{text.curriculumOrganization}</h2>
        <div className="curriculum-table-wrap">
          <table className="curriculum-table">
            <thead>
              <tr>
                <th>{text.category}</th>
                <th>{text.courseName}</th>
                <th>{text.semesterCredits}</th>
                <th>{text.requirement}</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((group) => (
                <tr key={group.category}>
                  <th>{text[group.category]}</th>
                  <td>{group.courses.join(" / ")}</td>
                  <td>{group.semesterCredits}</td>
                  <td>{group.requirement || "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th>{isKo ? "계" : "Total"}</th>
                <td />
                <td>42</td>
                <td />
              </tr>
            </tfoot>
          </table>
        </div>
      </section>
      <section className="curriculum-section">
        <h2>{text.courseOverview}</h2>
        {groupedCourses.map((group) => (
          <div key={group.category} className="curriculum-course-group">
            <h3>{text[group.category]}</h3>
            <div className="curriculum-course-list">
              {group.items.map((course, index) => (
                <article key={course.title} className="curriculum-course-item">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{isKo ? course.koTitle : course.title}</h4>
                    <p>{isKo ? course.koDescription : course.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </section>
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
          <p className="student-cv-kicker">PhD Students · {profile.year}</p>
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

function AboutOverview({ sectionKey, language }) {
  const content = getPageContent("about", "", language);
  const labels = ABOUT_SECTION_LABELS[language] || ABOUT_SECTION_LABELS.en;
  const activeSection = sectionKey || "greetings";
  const isContactSection = activeSection === "reservation";
  const overviewSections = ["greetings", "introduction", "history", "donation"];
  const contactItems =
    language === "ko"
      ? [
          {
            label: "입학 문의",
            value: "교육전문대학원 행정실 053-620-1299",
          },
          {
            label: "수업 문의",
            value: "AI교육전공 사무실 053-620-1430",
          },
          {
            label: "주소",
            value: "대구광역시 남구 중앙대로 219 대구교육대학교 상록교육관 405호",
          },
        ]
      : [
          {
            label: "Admissions Inquiries",
            value: "Graduate School Administration Office 053-620-1299",
          },
          {
            label: "Academic Inquiries",
            value: "Graduate School of AI Education Office 053-620-1430",
          },
          {
            label: "Address",
            value:
              "Sangrok Education Center No.405, DNUE, 219 Jungang-daero, Nam-gu, Daegu City, Republic of Korea (42411)",
          },
        ];

  return (
    <div className="about-overview">
      <h2 className="about-current-title">{labels[activeSection]}</h2>
      {isContactSection ? (
        <div className="about-text-stack">
          {contactItems.map((item, index) => (
            <section key={item.label} className="about-text-section">
              <div className="about-section-head">
                <span className="about-section-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.label}</h3>
              </div>
              <div className="about-section-body">
                <ul className="about-point-list">
                  <li>{item.value}</li>
                </ul>
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="about-text-stack">
          {overviewSections.map((key, index) => (
            <section key={key} className="about-text-section">
              <div className="about-section-head">
                <span className="about-section-index">{String(index + 1).padStart(2, "0")}</span>
                <h3>{labels[key]}</h3>
              </div>
              <div className="about-section-body">
                <ul className="about-point-list">
                  {(content.body[key] || []).map((paragraph) => (
                    <li key={paragraph}>{paragraph}</li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
        )}
    </div>
  );
}

function InternalPage({ menuKey, sectionKey, onSectionSelect, onOpenCv, language }) {
  const text = getText(language);
  const menu = getMenu(menuKey);
  const content = getPageContent(menuKey, sectionKey, language);
  const currentSection = sectionKey || menu?.sections[0]?.key || "";
  const currentLabel = currentSection ? getSectionLabel(menuKey, currentSection) : "";
  const isAbout = menuKey === "about";
  const showVisual = false;
  const showProfiles = menuKey === "people";
  const showLabs = menuKey === "labs";
  const showPublications = menuKey === "research";
  const showConferences = menuKey === "conferences";
  const showGraduationRequirements = menuKey === "academics" && currentSection === "graduation";
  const showCurriculum = menuKey === "academics" && currentSection === "curriculum";
  const useWidePeopleLayout = menuKey === "people" && (currentSection === "faculty" || currentSection === "students");
  const useWideLabsLayout = menuKey === "labs" || menuKey === "conferences" || showCurriculum || isAbout;
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
          {isAbout ? <AboutOverview sectionKey={currentSection} language={language} /> : null}
          {!isAbout && !showPublications && !showLabs && !showConferences && !showGraduationRequirements && !showCurriculum ? <h2>{currentLabel || content.headline}</h2> : null}
          {!isAbout && !showPublications && !showLabs && !showConferences && !showGraduationRequirements && !showCurriculum && content.subheadline ? <h3>{content.subheadline}</h3> : null}
          {!isAbout && !showPublications && !showLabs && !showConferences && !showGraduationRequirements && !showCurriculum ? content.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>) : null}
          {showGraduationRequirements ? <GraduationRequirements language={language} /> : null}
          {showCurriculum ? <CurriculumPage language={language} /> : null}
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
          {menuKey === "people" && currentSection === "students" ? <StudentYearGroups onOpenCv={onOpenCv} language={language} /> : null}
          {showLabs ? <LabsShowcase onOpenFaculty={() => onSectionSelect("people", "faculty")} /> : null}
          {showConferences ? <ConferenceTables sectionKey={currentSection} language={language} /> : null}
        </article>
        {showVisual ? <EditorialVisual /> : null}
        {showPublications ? <PublicationList sectionKey={currentSection} query={publicationQuery} searchMode={publicationSearchMode} language={language} /> : null}
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
  const [language, setLanguage] = useState("en");
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
        language={language}
        onToggleLanguage={() => setLanguage((current) => (current === "en" ? "ko" : "en"))}
      />
      {isHome ? (
        <HomePage language={language} />
      ) : isStudentCv ? (
        <StudentCvPage slug={currentCvSlug} onBack={() => navigateTo("people", "students")} language={language} />
      ) : (
        <InternalPage
          menuKey={currentPage}
          sectionKey={activeSection}
          onSectionSelect={navigateTo}
          onOpenCv={openStudentCv}
          language={language}
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
