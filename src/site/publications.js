import notionPublications from "../data/notionPublications.json";

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

export { PUBLICATION_LISTS, getLocalizedPublication };
