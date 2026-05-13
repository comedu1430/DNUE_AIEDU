import { useEffect, useMemo, useRef, useState } from "react";
import { Header } from "./components/SiteChrome";
import { Footer, MenuOverlay } from "./components/SiteFooterMenu";
import { HomePage, InternalPage } from "./components/SitePages";
import {
  PROGRAMS_ROUTE_SECTION_KEYS,
  buildAppUrlForRoute,
  getDefaultSection,
  getMenu,
  getVisibleSections,
  normalizePathRoute,
  parseRouteFromPathname,
  stripBasePath,
} from "./siteData";

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window === "undefined") {
      return "home";
    }

    return parseRouteFromPathname(window.location.pathname).page;
  });
  const [currentSection, setCurrentSection] = useState(() => {
    if (typeof window === "undefined") {
      return "";
    }

    return parseRouteFromPathname(window.location.pathname).section;
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [expandedMenuKey, setExpandedMenuKey] = useState("");
  const [desktopMenuKey, setDesktopMenuKey] = useState("");
  const [language, setLanguage] = useState("en");
  const [graduationUnlocked, setGraduationUnlocked] = useState(false);
  const [pendingProtectedProgramItem, setPendingProtectedProgramItem] = useState(null);
  const shellRef = useRef(null);

  const isHome = currentPage === "home";

  const activeSection = useMemo(() => {
    if (isHome) {
      return "";
    }

    return currentSection || getDefaultSection(currentPage);
  }, [currentPage, currentSection, isHome]);

  const navigateHome = () => {
    setCurrentPage("home");
    setCurrentSection("");
    setGraduationUnlocked(false);
    setPendingProtectedProgramItem(null);
    setMenuOpen(false);
    setExpandedMenuKey("");
    setDesktopMenuKey("");

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", buildAppUrlForRoute("home"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navigateTo = (menuKey, sectionKey = "") => {
    const resolvedMenu = getMenu(menuKey);
    const resolvedSection =
      menuKey === "programs"
        ? (PROGRAMS_ROUTE_SECTION_KEYS.has(sectionKey) ? sectionKey : "")
        : resolvedMenu?.sections.length
          ? (sectionKey && resolvedMenu.sections.some((section) => section.key === sectionKey)
              ? sectionKey
              : getDefaultSection(menuKey))
          : "";

    setCurrentPage(menuKey);
    setCurrentSection(resolvedSection);
    setGraduationUnlocked(false);
    setPendingProtectedProgramItem(null);
    setMenuOpen(false);
    setExpandedMenuKey(resolvedSection ? menuKey : "");
    setDesktopMenuKey("");

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", buildAppUrlForRoute(menuKey, resolvedSection));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const openProtectedProgramItem = (item) => {
    if (!item) {
      return;
    }

    setCurrentPage("programs");
    setCurrentSection("");
    setGraduationUnlocked(false);
    setPendingProtectedProgramItem(item);
    setMenuOpen(false);
    setExpandedMenuKey("");
    setDesktopMenuKey("");

    if (typeof window !== "undefined") {
      window.history.pushState(null, "", buildAppUrlForRoute("programs"));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
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

    if (getVisibleSections(menuKey).length === 0) {
      navigateTo(menuKey, "");
      return;
    }

    setExpandedMenuKey((current) => (current === menuKey ? "" : menuKey));
  };

  useEffect(() => {
    const handlePathChange = () => {
      const normalizedPath = normalizePathRoute(window.location.pathname);
      if (stripBasePath(window.location.pathname) !== normalizedPath) {
        const route = parseRouteFromPathname(window.location.pathname);
        window.history.replaceState(null, "", buildAppUrlForRoute(route.page, route.section));
      }

      const route = parseRouteFromPathname(window.location.pathname);
      setCurrentPage(route.page);
      setCurrentSection(route.section);
      setGraduationUnlocked(false);
      setPendingProtectedProgramItem(null);
      setMenuOpen(false);
      setExpandedMenuKey("");
      setDesktopMenuKey("");
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

    window.addEventListener("popstate", handlePathChange);
    handlePathChange();

    return () => window.removeEventListener("popstate", handlePathChange);
  }, []);

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
        onToggleDesktopMenu={setDesktopMenuKey}
        language={language}
        onToggleLanguage={() => setLanguage((current) => (current === "en" ? "ko" : "en"))}
      />
      {isHome ? (
        <HomePage
          language={language}
          onOpenProtectedProgram={openProtectedProgramItem}
          onOpenAnnual={() => navigateTo("programs", "annual")}
        />
      ) : (
        <InternalPage
          menuKey={currentPage}
          sectionKey={activeSection}
          onSectionSelect={navigateTo}
          language={language}
          graduationUnlocked={graduationUnlocked}
          onUnlockGraduation={() => setGraduationUnlocked(true)}
          pendingProtectedProgramItem={pendingProtectedProgramItem}
          onClearProtectedProgramItem={() => setPendingProtectedProgramItem(null)}
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
