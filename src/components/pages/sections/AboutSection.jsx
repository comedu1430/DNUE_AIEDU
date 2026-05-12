import { ABOUT_SECTION_LABELS, getPageContent } from "../../../siteData";

function AboutOverview({ sectionKey, language }) {
  const content = getPageContent("about", "", language);
  const labels = ABOUT_SECTION_LABELS[language] || ABOUT_SECTION_LABELS.en;
  const activeSection = sectionKey || "greetings";
  const isContactSection = activeSection === "reservation";
  const overviewSections = ["greetings", "introduction", "history"];
  const currentTitle = isContactSection ? labels.reservation : language === "ko" ? "전공 개요" : "Overview";
  const contactItems =
    language === "ko"
      ? [
          { label: "입학 문의", value: "교육전문대학원 행정실 053-620-1299" },
          { label: "수업 문의", value: "AI교육전공 사무실 053-620-1430" },
          { label: "주소", value: "대구광역시 남구 중앙대로 219 대구교육대학교 상록교육관 405호" },
        ]
      : [
          { label: "Admissions Inquiries", value: "Graduate School Administration Office 053-620-1299" },
          { label: "Academic Inquiries", value: "Graduate School of AI Education Office 053-620-1430" },
          {
            label: "Address",
            value: "Sangrok Education Center No.405, DNUE, 219 Jungang-daero, Nam-gu, Daegu City, Republic of Korea (42411)",
          },
        ];

  return (
    <div className="about-overview">
      <h2 className="about-current-title">{currentTitle}</h2>
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

export { AboutOverview };
