import { asset, getVisibleSections, SITE_MAP } from "../siteData";

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
                if (getVisibleSections(menu.key).length > 0) {
                  onToggleDesktopMenu(menu.key);
                }
              }}
            >
              <button className="desktop-nav-link" type="button" onClick={() => onNavigate(menu.key, "")}>
                <span>{menu.label}</span>
              </button>
              {getVisibleSections(menu.key).length > 0 ? (
                <div className="desktop-dropdown">
                  {getVisibleSections(menu.key).map((section) => (
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

export { Header };

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
