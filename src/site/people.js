import { asset, slugify, studentCvSlug } from "./shared";

const FACULTY_PROFILES = [
  {
    name: "Panwoo Park",
    koName: "박판우",
    position: "Professor",
    koPosition: "교수",
    office: "Sangnok Education Hall 407",
    email: "pwpark@dnue.ac.kr",
    phone: "053-620-1432",
    image: asset("panwoo-park.png"),
    research: "Computer Education, AI Education, Distance Education",
    koResearch: "컴퓨터교육, AI교육, 원격교육",
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
    koPosition: "교수",
    office: "Sangnok Education Hall 408",
    email: "bluenull@dnue.ac.kr",
    phone: "053-620-1434",
    image: asset("inhwan-yoo.png"),
    research: "Computer Education, AI Education",
    koResearch: "컴퓨터교육, AI교육",
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
    koPosition: "교수",
    office: "Sangnok Education Hall 406",
    email: "bae@dnue.ac.kr",
    phone: "053-620-1435",
    image: asset("youngkwon-bae.png"),
    research: "Computer Education, AI Education",
    koResearch: "컴퓨터교육, AI교육",
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
    koPosition: "교수",
    office: "Sangnok Education Hall 403",
    email: "john@dnue.ac.kr",
    phone: "053-620-1431",
    image: asset("wooyeol-kim.png"),
    research: "Computer Education, AI Education",
    koResearch: "컴퓨터교육, AI교육",
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
    koPosition: "교수",
    office: "Sangnok Education Hall 402",
    email: "yhlee@dnue.ac.kr",
    phone: "053-620-1433",
    image: asset("youngho-lee.png"),
    research: "Computer Education, AI Education",
    koResearch: "컴퓨터교육, AI교육",
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
    koPosition: "교수",
    office: "Sangnok Education Hall 404",
    email: "jkshim@dnue.ac.kr",
    phone: "053-620-1437",
    image: asset("jaekwon-shim.png"),
    research: "Computer Education, AI Education",
    koResearch: "컴퓨터교육, AI교육",
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
    { name: "Jaeeon Park", koName: "박재언", lab: "Member of the - Lab", koLab: "교수 연구실" },
    { name: "Kidong Kwon", koName: "권기동", lab: "Member of the - Lab", koLab: "교수 연구실" },
    { name: "Horyeon Nam", koName: "남호련", lab: "Member of the - Lab", koLab: "교수 연구실" },
    { name: "Jeongeun Choi", koName: "최정은", lab: "Member of the - Lab", koLab: "교수 연구실" },
    { name: "Eunjeong Lee", koName: "이은정", lab: "Member of the - Lab", koLab: "교수 연구실" },
    { name: "Jaeeun Yoon", koName: "윤재은", lab: "Member of the - Lab", koLab: "교수 연구실" },
  ],
  "2025": [
    { name: "Incheol Kim", koName: "김인철", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Gukhwan Bae", koName: "배국환", lab: "Member of the Panwoo Park Lab", koLab: "박판우 교수 연구실" },
    { name: "Jaeeun Ahn", koName: "안재은", lab: "Member of the Youngkwon Bae Lab", koLab: "배영권 교수 연구실" },
    { name: "Youngtak Jeong", koName: "정영탁", lab: "Member of the Youngho Lee Lab", koLab: "이영호 교수 연구실" },
    { name: "Hyejeong Cho", koName: "조혜정", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Minjeong Kang", koName: "강민정", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Jungeun Kim", koName: "김정은", lab: "Member of the Youngho Lee Lab", koLab: "이영호 교수 연구실" },
    { name: "Daeryun Park", koName: "박대륜", lab: "Member of the Inhwan Yoo Lab", koLab: "유인환 교수 연구실" },
    { name: "Intae Hwang", koName: "황인태", lab: "Member of the Jaekwon Shim Lab", koLab: "심재권 교수 연구실" },
  ],
  "2024": [
    { name: "Jinhee Oh", koName: "오진희", lab: "Member of the Wooyeol Kim Lab", koLab: "김우열 교수 연구실" },
    { name: "Minji Lee", koName: "이민지", lab: "Member of the Youngkwon Bae Lab", koLab: "배영권 교수 연구실" },
    { name: "Seunghyun Lee", koName: "이승현", lab: "Member of the Youngho Lee Lab", koLab: "이영호 교수 연구실" },
    { name: "Yonghan Lee", koName: "이용한", lab: "Member of the Jaekwon Shim Lab", koLab: "심재권 교수 연구실" },
    { name: "Jeongseo Lee", koName: "이정서", lab: "Member of the Youngkwon Bae Lab", koLab: "배영권 교수 연구실" },
    { name: "Saesoon Lee", koName: "이새순", lab: "Member of the Wooyeol Kim Lab", koLab: "김우열 교수 연구실" },
  ],
};

const STUDENT_PROFILES = STATIC_STUDENT_PROFILES;

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
    slug: profile.slug || studentCvSlug(profile.name, year),
    title: profile.title || "Curriculum Vitae",
    email: profile.email || `${slugify(profile.name).replace(/-/g, ".")}@dnue.ac.kr`,
    keywords: profile.keywords?.length ? profile.keywords : ["AI Pedagogy", "Educational Data", "Future Learning"],
    koKeywords: profile.koKeywords?.length ? profile.koKeywords : ["AI 교수학습", "교육 데이터", "미래 학습"],
    education: profile.education?.length
      ? profile.education
      : ["Graduate School of AI Education, Daegu National University of Education", `Ed.D Student Cohort ${year}`],
    koEducation: profile.koEducation?.length ? profile.koEducation : ["대구교육대학교 AI교육전공 박사과정", `${year}학년도 입학`],
    researchInterests: profile.researchInterests?.length
      ? profile.researchInterests
      : ["AI pedagogy and instructional innovation", "Educational data and future classroom design", "School-based applications of artificial intelligence"],
    koResearchInterests: profile.koResearchInterests?.length
      ? profile.koResearchInterests
      : ["AI 교수학습 및 수업 혁신", "교육 데이터와 미래 교실 설계", "학교 현장 기반 인공지능 활용"],
    activities: profile.activities?.length
      ? profile.activities
      : ["Participation in doctoral seminars and collaborative research activities", "Development of research interests aligned with the direction of the lab"],
    koActivities: profile.koActivities?.length
      ? profile.koActivities
      : ["박사과정 세미나 및 공동 연구 활동 참여", "소속 연구실의 방향과 연계한 연구 관심 분야 개발"],
    presentedPapers: profile.presentedPapers || [],
    koPresentedPapers: profile.koPresentedPapers || [],
  }))
);

function getProfiles() {
  return FACULTY_PROFILES;
}

export {
  FACULTY_PROFILES,
  LAB_CARDS,
  STUDENT_CV_PROFILES,
  STUDENT_PROFILES,
  getProfiles,
};
