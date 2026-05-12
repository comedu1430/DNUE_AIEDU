import { useMemo, useState } from "react";
import {
  ACADEMIC_CALENDAR,
  ACADEMIC_CALENDAR_KO,
  CONFERENCE_GROUPS,
  CS_TOP_CONFERENCES,
  CURRICULUM_COURSES,
  CURRICULUM_SUMMARY,
  CURRICULUM_SUMMARY_KO,
  GRADUATION_REQUIREMENTS_DOC_URL,
  GRADUATION_REQUIREMENTS_PREVIEW_URL,
  TOP_CS_SCORE_RULES,
  getText,
} from "../../../siteData";

function ConferenceTables({ sectionKey, language }) {
  const text = getText(language);
  const [topConferenceQuery, setTopConferenceQuery] = useState("");
  const [topConferenceSearchMode, setTopConferenceSearchMode] = useState("acronym");
  const [domesticConferenceQuery, setDomesticConferenceQuery] = useState("");
  const [domesticConferenceSearchMode, setDomesticConferenceSearchMode] = useState("conference");
  const [internationalConferenceQuery, setInternationalConferenceQuery] = useState("");
  const [internationalConferenceSearchMode, setInternationalConferenceSearchMode] = useState("conference");
  const selectedGroup = CONFERENCE_GROUPS.find((group) => group.key === sectionKey) || CONFERENCE_GROUPS[0];
  const showTopConferences = sectionKey === "top-cs";
  const showDomesticSearch = sectionKey === "domestic";
  const showInternationalSearch = sectionKey === "international";
  const normalizedQuery = topConferenceQuery.trim().toLowerCase();
  const normalizedDomesticQuery = domesticConferenceQuery.trim().toLowerCase();
  const normalizedInternationalQuery = internationalConferenceQuery.trim().toLowerCase();

  const filteredTopConferences = useMemo(() => {
    if (!normalizedQuery) {
      return CS_TOP_CONFERENCES;
    }

    return CS_TOP_CONFERENCES.filter((item) => {
      const searchableFields = {
        acronym: [item.acronym],
        conference: [item.name],
        rank: [
          item.normalizedAverage,
          item.normalizedAverage ? `${text.average} ${item.normalizedAverage}` : "",
          item.kiise2024,
          item.bk21Plus2018,
          item.kaistCs2022,
          item.snuCse2024,
          item.postechCse2026,
          item.kiise2024 ? `KIISE ${item.kiise2024}` : "",
          item.bk21Plus2018 ? `BK21 ${item.bk21Plus2018}` : "",
          item.kaistCs2022 ? `KAIST ${item.kaistCs2022}` : "",
          item.snuCse2024 ? `SNU ${item.snuCse2024}` : "",
          item.postechCse2026 ? `POSTECH ${item.postechCse2026}` : "",
        ],
      };
      return (searchableFields[topConferenceSearchMode] || searchableFields.acronym).join(" ").toLowerCase().includes(normalizedQuery);
    });
  }, [normalizedQuery, topConferenceSearchMode, text.average]);

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
    if (!monthName || !yearMatch || value.includes("to be announced")) return 0;
    const afterMonth = value.slice(value.indexOf(monthName) + monthName.length);
    const dayMatch = afterMonth.match(/\b(\d{1,2})(?:st|nd|rd|th)?\b/);
    const day = dayMatch ? Number(dayMatch[1]) : 1;
    return new Date(Number(yearMatch[1]), monthMap[monthName], day).getTime();
  };

  const getScheduleDateParts = (schedule) => {
    const value = schedule.toLowerCase();
    const monthName = Object.keys(monthMap).find((month) => value.includes(month));
    const yearMatch = value.match(/\b(20\d{2})\b/);
    if (!monthName || !yearMatch || value.includes("to be announced")) return null;
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
      if (seen.has(key)) return false;
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
      if (!groupedItems.has(key)) groupedItems.set(key, { key, label, items: [] });
      groupedItems.get(key).items.push(item);
    });
    return Array.from(groupedItems.values());
  };

  const filterConferenceItems = (items, query, mode) => {
    if (!query) return items;
    return items.filter((item) => {
      const dateParts = getScheduleDateParts(item.schedule);
      const searchableFields = {
        conference: [item.name, item.note],
        date: [item.schedule, dateParts?.label, dateParts?.year, dateParts ? monthLabels[dateParts.month] : ""],
        location: [item.location],
      };
      return (searchableFields[mode] || searchableFields.conference).join(" ").toLowerCase().includes(query);
    });
  };

  const renderConferenceSearch = ({ id, label, mode, setMode, options, placeholder, query, setQuery }) => (
    <div className="publication-search conference-main-search">
      <label className="publication-search-label" htmlFor={id}>
        {label}
      </label>
      <div className="publication-search-row">
        <div className="section-select-wrap publication-search-select-wrap">
          <label className="sr-only" htmlFor={`${id}-mode`}>
            {language === "ko" ? "검색 기준 선택" : "Select search mode"}
          </label>
          <select
            id={`${id}-mode`}
            className="section-select publication-search-select"
            value={mode}
            onChange={(event) => {
              setMode(event.target.value);
              setQuery("");
            }}
          >
            {options.map((option) => (
              <option key={`${id}-${option.value}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <input
          id={id}
          className="publication-search-input conference-main-search-input"
          type="search"
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
    </div>
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
                      <td data-label={text.conferenceEvent}>
                        {item.url ? (
                          <a href={item.url} target="_blank" rel="noreferrer">
                            {item.name}
                          </a>
                        ) : (
                          item.name
                        )}
                      </td>
                      <td data-label={text.schedule}>{item.schedule}</td>
                      <td data-label={text.location}>{item.location}</td>
                      <td data-label={text.notes}>{item.note}</td>
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
          <details className="top-cs-explainer">
            <summary>{language === "ko" ? "평균 산정 방식 보기" : "View average calculation method"}</summary>
            <div className="top-cs-explainer-body">
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
              <p className="top-cs-source-note">
                {language === "ko"
                  ? "이 목록과 평균 산정 방식은 Pusnow의 CS 분야 우수 학술대회 목록 Gist를 참고하여, 본 홈페이지의 표시 형식에 맞게 재구성했습니다."
                  : "This list and averaging method are adapted from Pusnow's Gist on top CS conferences and reformatted for this website."}{" "}
                <a href="https://gist.github.com/Pusnow/6eb933355b5cb8d31ef1abcb3c3e1206" target="_blank" rel="noreferrer">
                  {language === "ko" ? "원문 보기" : "View source"}
                </a>
              </p>
            </div>
          </details>
          {renderConferenceSearch({
            id: "top-cs-search",
            label: text.searchConferenceList,
            mode: topConferenceSearchMode,
            setMode: setTopConferenceSearchMode,
            options: [
              { value: "acronym", label: language === "ko" ? "약자" : "Acronym" },
              { value: "conference", label: language === "ko" ? "학회명" : "Conference" },
              { value: "rank", label: language === "ko" ? "인정 기준" : "Rank" },
            ],
            placeholder: {
              acronym: language === "ko" ? "약자로 검색" : "Search by acronym",
              conference: language === "ko" ? "학회명으로 검색" : "Search by conference name",
              rank: language === "ko" ? "평균 또는 인정 기준으로 검색" : "Search by average or recognition",
            }[topConferenceSearchMode],
            query: topConferenceQuery,
            setQuery: setTopConferenceQuery,
          })}
          <p className="conference-result-count">{text.showingConferences(filteredTopConferences.length, CS_TOP_CONFERENCES.length)}</p>
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
                    <td data-label={text.acronym}>{item.acronym}</td>
                    <td data-label={text.conferenceName}>{item.name}</td>
                    <td data-label={text.scoresRecognition}>
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

  const filteredItems = showInternationalSearch
    ? filterConferenceItems(selectedGroup.items, normalizedInternationalQuery, internationalConferenceSearchMode)
    : showDomesticSearch
      ? filterConferenceItems(selectedGroup.items, normalizedDomesticQuery, domesticConferenceSearchMode)
      : selectedGroup.items;

  return (
    <div className="conference-sections">
      <p className="conference-updated">{text.updatedApril}</p>
      {showDomesticSearch
        ? renderConferenceSearch({
            id: "domestic-conference-search",
            label: language === "ko" ? "국내 학회 검색" : "Search domestic conferences",
            mode: domesticConferenceSearchMode,
            setMode: setDomesticConferenceSearchMode,
            options: [
              { value: "conference", label: language === "ko" ? "학회명" : "Conference" },
              { value: "date", label: language === "ko" ? "일정" : "Date" },
              { value: "location", label: language === "ko" ? "장소" : "Location" },
            ],
            placeholder: {
              conference: language === "ko" ? "학회명으로 검색" : "Search by conference name",
              date: language === "ko" ? "연도, 월, 일정으로 검색" : "Search by year, month, or schedule",
              location: language === "ko" ? "국가, 도시, 장소로 검색" : "Search by country, city, or location",
            }[domesticConferenceSearchMode],
            query: domesticConferenceQuery,
            setQuery: setDomesticConferenceQuery,
          })
        : null}
      {showInternationalSearch
        ? renderConferenceSearch({
            id: "international-conference-search",
            label: language === "ko" ? "국제학회 검색" : "Search international conferences",
            mode: internationalConferenceSearchMode,
            setMode: setInternationalConferenceSearchMode,
            options: [
              { value: "conference", label: language === "ko" ? "학회명" : "Conference" },
              { value: "date", label: language === "ko" ? "일정" : "Date" },
              { value: "location", label: language === "ko" ? "장소" : "Location" },
            ],
            placeholder: {
              conference: language === "ko" ? "학회명으로 검색" : "Search by conference name",
              date: language === "ko" ? "연도, 월, 일정으로 검색" : "Search by year, month, or schedule",
              location: language === "ko" ? "국가, 도시, 장소로 검색" : "Search by country, city, or location",
            }[internationalConferenceSearchMode],
            query: internationalConferenceQuery,
            setQuery: setInternationalConferenceQuery,
          })
        : null}
      {renderGroupedTable(filteredItems, selectedGroup.title)}
    </div>
  );
}

function GraduationRequirements({ language }) {
  const copy =
    language === "ko"
      ? {
          title: "학위취득요건",
          action: "Google Docs에서 열기",
          previewTitle: "학위취득요건 문서 미리보기",
        }
      : {
          title: "Graduation Requirements",
          action: "Open in Google Docs",
          previewTitle: "Graduation requirements document preview",
        };

  return (
    <div className="requirements-panel">
      <section className="requirement-group">
        <div className="requirement-intro requirement-doc-intro">
          <h3>{copy.title}</h3>
          <div className="requirement-doc-actions">
            <a className="requirement-rule-link requirement-doc-link" href={GRADUATION_REQUIREMENTS_DOC_URL} target="_blank" rel="noreferrer">
              {copy.action}
            </a>
          </div>
        </div>
        <div className="requirement-doc-preview">
          <iframe className="requirement-doc-frame" src={GRADUATION_REQUIREMENTS_PREVIEW_URL} title={copy.previewTitle} loading="lazy" />
        </div>
      </section>
    </div>
  );
}

function AcademicCalendarPage({ language }) {
  const text = getText(language);
  const calendar = language === "ko" ? ACADEMIC_CALENDAR_KO : ACADEMIC_CALENDAR;

  return (
    <div className="curriculum-panel academic-calendar-panel">
      <section className="curriculum-section">
        <h2>{text.semesterSchedule}</h2>
        <div className="curriculum-table-wrap academic-calendar-table-wrap">
          <table className="curriculum-table academic-calendar-table">
            <thead>
              <tr>
                <th>{text.semester}</th>
                <th>{text.item}</th>
                <th>{text.remarks}</th>
              </tr>
            </thead>
            <tbody>
              {calendar.flatMap((group) =>
                group.items.map((item, index) => (
                  <tr key={`${group.semester}-${item.title}`}>
                    {index === 0 ? (
                      <th rowSpan={group.items.length} data-label={text.semester}>
                        {group.semester}
                      </th>
                    ) : null}
                    <td data-label={text.item}>{item.title}</td>
                    <td data-label={text.remarks}>{item.note || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="academic-calendar-mobile-list" aria-label={text.semesterSchedule}>
          {calendar.map((group) => (
            <article key={`mobile-${group.semester}`} className="academic-calendar-card">
              <div className="academic-calendar-card-head">
                <span>{text.semester}</span>
                <strong>{group.semester}</strong>
              </div>
              <div className="academic-calendar-card-body">
                {group.items.map((item) => (
                  <div key={`${group.semester}-${item.title}`} className="academic-calendar-card-row">
                    <p>{item.title}</p>
                    {item.note ? <span>{item.note}</span> : null}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
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
                  <th data-label={text.category}>{text[group.category]}</th>
                  <td data-label={text.courseName}>{group.courses.join(" / ")}</td>
                  <td data-label={text.semesterCredits}>{group.semesterCredits}</td>
                  <td data-label={text.requirement}>{group.requirement || "-"}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th data-label={isKo ? "구분" : "Category"}>{isKo ? "계" : "Total"}</th>
                <td />
                <td data-label={text.semesterCredits}>42</td>
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

export { AcademicCalendarPage, ConferenceTables, CurriculumPage, GraduationRequirements };
