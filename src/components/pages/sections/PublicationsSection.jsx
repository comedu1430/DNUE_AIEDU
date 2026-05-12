import { PUBLICATION_LISTS, getLocalizedPublication, getText } from "../../../siteData";

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

export { PublicationList };
