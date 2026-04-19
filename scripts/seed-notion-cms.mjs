import {
  loadEnvFile,
  normalizeNotionId,
  notionRequest,
  queryAllDatabase,
  readText,
  requireEnv,
} from "./notion-utils.mjs";

loadEnvFile();

const token = requireEnv("NOTION_TOKEN");
const studentsDatabaseId = normalizeNotionId(requireEnv("NOTION_STUDENTS_DATABASE_ID"));
const publicationsDatabaseId = normalizeNotionId(requireEnv("NOTION_PUBLICATIONS_DATABASE_ID"));

const STUDENTS_BY_YEAR = {
  2026: [
    ["Jaeeon Park", "박재언", "Member of the Panwoo Park Lab", "박판우 교수 연구실"],
    ["Kidong Kwon", "권기동", "Member of the Inhwan Yoo Lab", "유인환 교수 연구실"],
    ["Horyeon Nam", "남호련", "Member of the Youngkwon Bae Lab", "배영권 교수 연구실"],
    ["Jeongeun Choi", "최정은", "Member of the Wooyeol Kim Lab", "김우열 교수 연구실"],
    ["Eunjeong Lee", "이은정", "Member of the Youngho Lee Lab", "이영호 교수 연구실"],
    ["Jaeeun Yoon", "윤재은", "Member of the Jaekwon Shim Lab", "심재권 교수 연구실"],
  ],
  2025: [
    ["Incheol Kim", "김인철", "Member of the Panwoo Park Lab", "박판우 교수 연구실"],
    ["Gukhwan Bae", "배국환", "Member of the Youngkwon Bae Lab", "배영권 교수 연구실"],
    ["Jaeeun Ahn", "안재은", "Member of the Inhwan Yoo Lab", "유인환 교수 연구실"],
    ["Youngtak Jeong", "정영탁", "Member of the Wooyeol Kim Lab", "김우열 교수 연구실"],
    ["Hyejeong Cho", "조혜정", "Member of the Jaekwon Shim Lab", "심재권 교수 연구실"],
    ["Minjeong Kang", "강민정", "Member of the Youngho Lee Lab", "이영호 교수 연구실"],
    ["Jungeun Kim", "김정은", "Member of the Panwoo Park Lab", "박판우 교수 연구실"],
    ["Daeryun Park", "박대륜", "Member of the Inhwan Yoo Lab", "유인환 교수 연구실"],
    ["Intae Hwang", "황인태", "Member of the Youngho Lee Lab", "이영호 교수 연구실"],
  ],
  2024: [
    ["Jinhee Oh", "오진희", "Member of the Panwoo Park Lab", "박판우 교수 연구실"],
    ["Minji Lee", "이민지", "Member of the Inhwan Yoo Lab", "유인환 교수 연구실"],
    ["Seunghyun Lee", "이승현", "Member of the Youngho Lee Lab", "이영호 교수 연구실"],
    ["Yonghan Lee", "이용한", "Member of the Jaekwon Shim Lab", "심재권 교수 연구실"],
    ["Jeongseo Lee", "이정서", "Member of the Youngkwon Bae Lab", "배영권 교수 연구실"],
    ["Saesoon Lee", "이새순", "Member of the Wooyeol Kim Lab", "김우열 교수 연구실"],
  ],
};

const PUBLICATIONS_BY_YEAR = {
  2026: [
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
  2025: [
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
  2024: [
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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const toRichText = (value) => [{ type: "text", text: { content: String(value || "") } }];
const title = (value) => ({ title: toRichText(value) });
const richText = (value) => ({ rich_text: toRichText(value) });
const number = (value) => ({ number: Number(value) });
const checkbox = (value) => ({ checkbox: Boolean(value) });
const select = (value) => ({ select: { name: value } });
const email = (value) => ({ email: value || null });
const url = (value) => ({ url: value || null });

function slugifyName(name, year) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${year}`;
}

function emailFor(name) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, ".").replace(/^\.|\.$/g, "")}@dnue.ac.kr`;
}

function buildStudents() {
  return Object.entries(STUDENTS_BY_YEAR).flatMap(([year, rows]) =>
    rows.map(([name, koName, lab, koLab], index) => ({
      name,
      koName,
      cohort: Number(year),
      email: emailFor(name),
      lab,
      koLab,
      advisor: lab.replace(/^Member of the /, "").replace(/ Lab$/, ""),
      keywordsEn: "AI Pedagogy\nEducational Data\nFuture Learning",
      keywordsKo: "AI 교수학습\n교육 데이터\n미래 학습",
      educationEn: `Graduate School of AI Education, Daegu National University of Education\nPhD Student Cohort ${year}`,
      educationKo: `대구교육대학교 AI교육전공 박사과정\n${year}학년도 입학`,
      interestsEn: "AI pedagogy and instructional innovation\nEducational data and future classroom design\nSchool-based applications of artificial intelligence",
      interestsKo: "AI 교수학습 및 수업 혁신\n교육 데이터와 미래 교실 설계\n학교 현장 기반 인공지능 활용",
      activitiesEn: "Participation in doctoral seminars and collaborative research activities\nDevelopment of research interests aligned with the direction of the lab",
      activitiesKo: "박사과정 세미나 및 공동 연구 활동 참여\n소속 연구실의 방향과 연계한 연구 관심 분야 개발",
      papersEn: "",
      papersKo: "",
      slug: slugifyName(name, year),
      order: Number(year) * 100 + index,
    }))
  );
}

function buildPublications() {
  return Object.entries(PUBLICATIONS_BY_YEAR).flatMap(([year, publications]) =>
    publications.map((publication, index) => ({
      ...publication,
      year: Number(year),
      order: Number(year) * 100 + index,
    }))
  );
}

async function createPage(databaseId, properties) {
  await notionRequest("/pages", {
    method: "POST",
    token,
    body: {
      parent: { database_id: databaseId },
      properties,
    },
  });
  await sleep(350);
}

async function seedStudents() {
  const existingPages = await queryAllDatabase(studentsDatabaseId);
  const existingNames = new Set(existingPages.map((page) => readText(page, "Name").toLowerCase()).filter(Boolean));
  let created = 0;
  let skipped = 0;

  for (const student of buildStudents()) {
    if (existingNames.has(student.name.toLowerCase())) {
      skipped += 1;
      continue;
    }

    await createPage(studentsDatabaseId, {
      Name: title(student.name),
      "Korean Name": richText(student.koName),
      Cohort: number(student.cohort),
      Email: email(student.email),
      "Lab EN": richText(student.lab),
      "Lab KO": richText(student.koLab),
      Advisor: richText(student.advisor),
      "Research Keywords EN": richText(student.keywordsEn),
      "Research Keywords KO": richText(student.keywordsKo),
      "Education EN": richText(student.educationEn),
      "Education KO": richText(student.educationKo),
      "Research Interests EN": richText(student.interestsEn),
      "Research Interests KO": richText(student.interestsKo),
      "Academic Activities EN": richText(student.activitiesEn),
      "Academic Activities KO": richText(student.activitiesKo),
      "Presented Papers EN": richText(student.papersEn),
      "Presented Papers KO": richText(student.papersKo),
      "CV Slug": richText(student.slug),
      Visible: checkbox(true),
      Order: number(student.order),
    });
    created += 1;
  }

  return { created, skipped };
}

async function seedPublications() {
  const existingPages = await queryAllDatabase(publicationsDatabaseId);
  const existingTitles = new Set(existingPages.map((page) => readText(page, "Title EN").toLowerCase()).filter(Boolean));
  let created = 0;
  let skipped = 0;

  for (const publication of buildPublications()) {
    if (existingTitles.has(publication.title.toLowerCase())) {
      skipped += 1;
      continue;
    }

    await createPage(publicationsDatabaseId, {
      "Title EN": title(publication.title),
      "Title KO": richText(publication.koTitle),
      Year: number(publication.year),
      Type: select(publication.type),
      "Authors EN": richText(publication.authors),
      "Authors KO": richText(publication.koAuthors),
      "Venue EN": richText(publication.venue),
      "Venue KO": richText(publication.koVenue),
      DOI: richText(publication.doi),
      URL: url(publication.url),
      Visible: checkbox(true),
      Order: number(publication.order),
    });
    created += 1;
  }

  return { created, skipped };
}

try {
  const students = await seedStudents();
  const publications = await seedPublications();

  console.log(`Students: created ${students.created}, skipped ${students.skipped}`);
  console.log(`Publications: created ${publications.created}, skipped ${publications.skipped}`);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
