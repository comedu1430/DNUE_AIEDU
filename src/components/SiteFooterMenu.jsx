import { asset, getVisibleSections, SITE_MAP } from "../siteData";
import { LanguageToggle } from "./SiteChrome";

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
              <p>© 2026. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer, MenuOverlay };

function MenuOverlay({ expandedMenuKey, onToggleMenu, onSelectSection, onClose, language, onToggleLanguage }) {
  return (
    <aside className="menu-overlay" aria-modal="true" role="dialog">
      <div className="menu-panel">
        <div className="menu-panel-top">
          <LanguageToggle language={language} onToggleLanguage={onToggleLanguage} className="menu-language-toggle" />
          <button className="close-button" type="button" aria-label="Close menu" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="menu-list">
          {SITE_MAP.map((menu) => (
            <div key={menu.key} className={`menu-group ${expandedMenuKey === menu.key ? "is-expanded" : ""}`}>
              <button
                className="menu-link"
                type="button"
                onClick={() => {
                  if (getVisibleSections(menu.key).length === 0) {
                    onSelectSection(menu.key, "");
                    return;
                  }
                  onToggleMenu(menu.key);
                }}
              >
                <span>{menu.label}</span>
              </button>
              {getVisibleSections(menu.key).length > 0 ? (
                <ul className={`submenu-list ${expandedMenuKey === menu.key ? "is-open" : ""}`}>
                  {getVisibleSections(menu.key).map((sub) => (
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
