import { CONFERENCE_INDEX_COMPUTER_SCIENCE_EVENTS } from "../data/conferenceIndexComputerScienceEvents";
import { CS_TOP_CONFERENCES } from "../data/csConferences";
import { DS_DEADLINES_PAST_EVENTS } from "../data/dsPastEvents";

const CONFERENCE_GROUPS = [
  {
    key: "domestic",
    title: "Domestic Conferences / Events",
    items: [
      { name: "AIED 2026", schedule: "June 29 - July 3, 2026", location: "Seoul, Korea", note: "International conference on AI in Education" },
      { name: "AAAI 2026 Summer Symposium Series", schedule: "June 22 - June 24, 2026", location: "Seoul, Korea", note: "Hosted by Dongguk University" },
      { name: "ICML 2026", schedule: "July 6 - July 11, 2026", location: "Seoul, Korea", note: "International conference on machine learning" },
      { name: "ICDCS 2026", schedule: "June 22 - June 25, 2026", location: "Seoul, Korea", note: "International conference on distributed computing systems" },
      { name: "AI EXPO KOREA 2026", schedule: "May 6 - May 8, 2026", location: "COEX, Seoul", note: "AI exhibition and conference" },
      { name: "ISS 2026", schedule: "June 16 - June 18, 2026", location: "DCC, Daejeon", note: "Domestic case for a space-related event" },
      { name: "KDD 2026", schedule: "August 9 - August 13, 2026; August 25 - August 29, 2026", location: "Jeju / Barcelona", note: "Jeju schedule included" },
      { name: "DASFAA 2026", schedule: "April 27 - April 30, 2026", location: "Jeju, Korea", note: "International conference in database fields" },
    ],
    pastItems: [],
  },
  {
    key: "international",
    title: "International Conferences / Events",
    items: [
      { name: "SIGMOD 2027", schedule: "June 13 - June 19, 2027", location: "Huntington Beach, CA, USA", note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (2/4): April 17, 2026" },
      { name: "CCS 2026", schedule: "November 15 - November 19, 2026", location: "The Hague, The Netherlands", note: "ACM Conference on Computer and Communications Security; Systems - computer security; Deadline (2/2): April 29, 2026" },
      { name: "CoRL 2026", schedule: "November 9 - November 12, 2026", location: "Austin, TX, USA", note: "Conference on Robot Learning; workshops on November 9 and main conference on November 10-12" },
      { name: "IMC 2026", schedule: "November 3 - November 6, 2026", location: "Karlsruhe, Germany", note: "Internet Measurement Conference; Systems - measurement and performance analysis; Deadline (2/2): April 29, 2026" },
      { name: "NDSS 2027", schedule: "February TBD, 2027", location: "San Diego, CA, USA", note: "ISOC Network and Distributed System Security Symposium; Systems - computer security; Deadline (1/2): May 6, 2026" },
      { name: "PODS 2027", schedule: "June 13 - June 19, 2027", location: "Huntington Beach, CA, USA", note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (1/2): May 30, 2026" },
      { name: "VLDB 2026", schedule: "August 31 - September 4, 2026", location: "Boston, MA, USA", note: "International Conference on Very Large Data Bases; Systems - databases; Deadline: June 15, 2026" },
      { name: "ICSE 2027", schedule: "April 25 - May 1, 2027", location: "Dublin, Ireland", note: "International Conference on Software Engineering; Systems - software engineering; Deadline: June 30, 2026" },
      { name: "POPL 2027", schedule: "January 10 - January 16, 2027", location: "Mexico City, Mexico", note: "ACM SIGPLAN Symposium on Principles of Programming Languages; Systems - programming languages; Deadline: July 9, 2026" },
      { name: "SIGMOD 2027", schedule: "June 13 - June 19, 2027", location: "Huntington Beach, CA, USA", note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (3/4): July 17, 2026" },
      { name: "NDSS 2027", schedule: "February TBD, 2027", location: "San Diego, CA, USA", note: "ISOC Network and Distributed System Security Symposium; Systems - computer security; Deadline (2/2): August 19, 2026" },
      { name: "ASPLOS 2027", schedule: "April 11 - April 15, 2027", location: "Crete, Greece", note: "ACM International Conference on Architectural Support for Programming Languages and Operating Systems; Systems - computer architecture; Deadline (2/2): September 9, 2026" },
      { name: "FAST 2027", schedule: "February 23 - February 25, 2027", location: "Renton, WA, USA", note: "USENIX Conference on File and Storage Technologies; Systems - operating systems; Deadline (2/2): September 15, 2026" },
      { name: "SIGMOD 2027", schedule: "June 13 - June 19, 2027", location: "Huntington Beach, CA, USA", note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (4/4): October 17, 2026" },
      { name: "PODS 2027", schedule: "June 13 - June 19, 2027", location: "Huntington Beach, CA, USA", note: "ACM SIGMOD/PODS International Conference on Management of Data; Systems - databases; Deadline (2/2): December 10, 2026" },
      { name: "SC 2026", schedule: "November 15 - November 20, 2026", location: "Chicago, IL, USA", note: "The International Conference for High Performance Computing, Networking, Storage, and Analysis; Systems - high-performance computing; Deadline: April 8, 2026" },
      ...CONFERENCE_INDEX_COMPUTER_SCIENCE_EVENTS,
    ],
    pastItems: DS_DEADLINES_PAST_EVENTS,
  },
];

const GRADUATION_REQUIREMENT_INTRO = {
  title: "Publication Record Requirement",
  body: "Students must satisfy the publication record requirement before applying for the doctoral dissertation review.",
};

const GRADUATION_REQUIREMENTS = [
  { number: "01", title: "Authorship and Timing", body: "Only publications in which the student is the primary author are recognized. The work must be published before the dissertation review, and papers accepted for publication or presentation are also recognized." },
  { number: "02", title: "Recognized Venues", body: "Only journals and academic conferences approved by the AI Education major are recognized as valid publication records." },
  { number: "03", title: "Conference Requirement", body: "Students must have three academic conference papers." },
  { number: "04", title: "Journal Requirement", body: "Students must have either two papers in KCI-listed or KCI-candidate journals, or one paper in an SSCI- or SCIE-level journal." },
];

const DEGREE_REQUIREMENT_INTRO = {
  title: "Graduate School Degree Completion Requirements",
  body: "The following requirements summarize the completion, degree conferment, and credit requirements specified in the Graduate School rules.",
  linkLabel: "DNUE Rules and Regulations",
  linkHref: "https://www.dnue.ac.kr/kor/CMS/RegulationBookMgr/list.do?mCode=MN026",
};

const DEGREE_REQUIREMENTS = [
  {
    number: "01",
    title: "Completion",
    body: "Article 23 specifies the timing and conditions for completion of the doctoral program.",
    items: [
      "Completion and graduation for degree programs are processed at the end of each semester.",
      "Completion means that the required period of study has elapsed and the prescribed credits have been earned.",
      "For completion, the overall grade point average across all courses must be 3.0 or higher.",
      "Students who complete the prescribed program may receive a certificate of completion according to the designated form.",
    ],
  },
  {
    number: "02",
    title: "Degree Conferment",
    body: "Article 24 specifies the requirements for doctoral degree conferment.",
    items: [
      "A doctoral degree is conferred to students who earn the prescribed credits, pass the comprehensive examination, pass the doctoral dissertation review and oral examination, and receive approval through deliberation by the Graduate School Committee.",
      "Detailed procedures for the comprehensive examination, dissertation review, oral examination, and degree conferment are separately determined by the President.",
    ],
  },
  {
    number: "03",
    title: "Completion Credits",
    body: "Article 29 specifies the credit requirements for completing the doctoral program.",
    items: [
      "Doctoral program completion requires at least 36 course credits and 6 dissertation research credits.",
      "Dissertation research credits are evaluated on a Pass/Fail basis.",
      "Credit requirements may be adjusted when necessary for curriculum operation.",
    ],
  },
];

const GRADUATION_REQUIREMENT_INTRO_KO = {
  title: "논문 실적 요건",
  body: "졸업을 위해서는 학위논문 심사 신청 이전에 논문 실적 기준을 충족해야 합니다.",
};

const GRADUATION_REQUIREMENTS_KO = [
  { number: "01", title: "저자 기준과 인정 시점", body: "주저자로 참여한 논문만 실적으로 인정되며, 학위논문 심사 이전에 게재되어야 합니다. 게재 또는 발표가 확정된 논문도 인정됩니다." },
  { number: "02", title: "인정 학술지 및 학술대회", body: "AI교육전공에서 인정하는 학술지와 학술대회만 논문 실적으로 인정됩니다." },
  { number: "03", title: "학술대회 논문 요건", body: "학술대회 논문 3편을 충족해야 합니다." },
  { number: "04", title: "학술지 논문 요건", body: "KCI 등재 또는 등재후보 학술지 논문 2편, 또는 SSCI·SCIE급 학술지 논문 1편을 충족해야 합니다." },
];

const DEGREE_REQUIREMENT_INTRO_KO = {
  title: "교육전문대학원 학위취득요건",
  body: "교육전문대학원 학칙에 따른 수료, 학위수여, 수료학점 관련 요건을 정리한 내용입니다.",
  linkLabel: "대구교육대학교 학칙 및 규정",
  linkHref: "https://www.dnue.ac.kr/kor/CMS/RegulationBookMgr/list.do?mCode=MN026",
};

const DEGREE_REQUIREMENTS_KO = [
  {
    number: "01",
    title: "수료",
    body: "제23조는 교육전문대학원 학위과정의 수료 시기와 수료 기준을 규정합니다.",
    items: [
      "교육전문대학원의 학위과정의 수료 및 졸업의 시기는 매 학기말로 합니다.",
      "수료란 학칙이 정하는 수업연한이 경과하고 정해진 학점을 취득한 것을 말합니다.",
      "수료를 위해서는 전 과목의 평점 평균이 3.0 이상이어야 합니다.",
      "교육전문대학원의 정해진 과정을 수료한 자에게 별지서식 제1호에 따라 수료증서를 교부할 수 있습니다.",
    ],
  },
  {
    number: "02",
    title: "학위수여",
    body: "제24조는 박사학위 수여를 위한 요건을 규정합니다.",
    items: [
      "정해진 학점을 취득하고 종합시험에 합격한 자로서 박사학위 논문심사와 구술시험을 통과하고, 교육전문대학원위원회의 심의를 거친 자에게 박사학위를 수여합니다.",
      "종합시험, 논문심사, 구술시험, 학위수여에 대한 세부사항은 총장이 따로 정합니다.",
    ],
  },
  {
    number: "03",
    title: "수료학점",
    body: "제29조는 박사과정 수료에 필요한 학점을 규정합니다.",
    items: [
      "박사과정 수료에 필요한 학점은 교과학점 36학점 이상과 논문연구학점 6학점으로 합니다.",
      "논문연구학점은 P/F제로 평가합니다.",
      "이수학점은 교과운영상 필요한 경우 조정할 수 있습니다.",
    ],
  },
];

const TOP_CS_SCORE_RULES = [
  { value: "1.00", kiise: "Top", bk21: "4", kaist: "O", snu: "O", postech: "Top" },
  { value: "0.75", kiise: "", bk21: "3", kaist: "", snu: "", postech: "" },
  { value: "0.50", kiise: "Excellent", bk21: "2", kaist: "", snu: "", postech: "Excellent" },
  { value: "0.25", kiise: "", bk21: "1", kaist: "", snu: "", postech: "" },
  { value: "0.00", kiise: "", bk21: "", kaist: "", snu: "", postech: "" },
];

const ACADEMIC_CALENDAR = [
  { semester: "1", items: [{ title: "Entrance Ceremony", note: "During March" }, { title: "New Student Orientation", note: "During March" }] },
  { semester: "2", items: [{ title: "Advisor Assignment", note: "Spring semester: mid-March / Fall semester: mid-September" }, { title: "Research Topic Exploration", note: "Consult with academic advisor" }] },
  { semester: "3", items: [{ title: "Academic Conference Participation / Presentation", note: "As needed" }] },
  { semester: "4", items: [{ title: "Academic Conference Participation / Presentation", note: "As needed" }] },
  { semester: "5", items: [{ title: "Dissertation Proposal Submission", note: "Spring semester: mid-March (evening program) / early August (seasonal program)\nFall semester: mid-September (evening program) / early January (seasonal program)" }] },
  { semester: "6", items: [{ title: "Qualification Exam Application", note: "Spring semester: mid-March / Fall semester: mid-September" }, { title: "Qualification Exam", note: "Spring semester: first Saturday of April\nFall semester: first Saturday of October" }, { title: "Dissertation Review Application", note: "Spring semester: late March to early April\nFall semester: early October" }, { title: "Dissertation Review", note: "" }] },
];

const ACADEMIC_CALENDAR_KO = [
  { semester: "1", items: [{ title: "입학식", note: "3월 중" }, { title: "신입생 오리엔테이션", note: "3월 중" }] },
  { semester: "2", items: [{ title: "지도교수 선정", note: "1학기: 3월 중순 / 2학기: 9월 중순" }, { title: "연구과제 탐색", note: "지도교수님과 상의" }] },
  { semester: "3", items: [{ title: "학술대회(참석/발표)", note: "수시" }] },
  { semester: "4", items: [{ title: "학술대회(참석/발표)", note: "수시" }] },
  { semester: "5", items: [{ title: "논문작성계획서 제출\n(전공 사무실 제출)", note: "1학기: 3월 중순(야간제) / 8월 초(계절제)\n2학기: 9월 중순(야간제) / 1월 초(계절제)" }] },
  { semester: "6", items: [{ title: "자격시험 신청\n(통합학사정보시스템 신청)", note: "1학기: 3월 중순 / 2학기: 9월 중순" }, { title: "자격시험", note: "1학기: 4월 첫째 주 토요일\n2학기: 10월 첫째 주 토요일" }, { title: "논문심사신청\n(전공 사무실 제출)", note: "1학기: 3월 말~4월 초\n2학기: 10월 초" }, { title: "논문심사", note: "" }] },
];

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

export {
  ACADEMIC_CALENDAR,
  ACADEMIC_CALENDAR_KO,
  CONFERENCE_GROUPS,
  CS_TOP_CONFERENCES,
  CURRICULUM_COURSES,
  CURRICULUM_SUMMARY,
  CURRICULUM_SUMMARY_KO,
  DEGREE_REQUIREMENT_INTRO,
  DEGREE_REQUIREMENT_INTRO_KO,
  DEGREE_REQUIREMENTS,
  DEGREE_REQUIREMENTS_KO,
  GRADUATION_REQUIREMENTS,
  GRADUATION_REQUIREMENTS_KO,
  GRADUATION_REQUIREMENT_INTRO,
  GRADUATION_REQUIREMENT_INTRO_KO,
  TOP_CS_SCORE_RULES,
};
