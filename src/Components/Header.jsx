import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../authentication/useAuth";
import useLanguage from "../i18n/useLanguage";

const navigationByLanguage = {
  fr: [
    { id: 1, title: "ACCUEIL", path: "/Pages/Home" },
    { id: 3, title: "SERVICES", path: "/Pages/Service" },
    { id: 4, title: "RECHERCHE", path: "/Pages/Search" },
    { id: 5, title: "ACTIVITÉS", path: "/Pages/Activity" },
    { id: 6, title: "MA LISTE", path: "/Pages/MyList" },
    { id: 7, title: "MENU", path: "/Pages/Menu" },
  ],
  en: [
    { id: 1, title: "HOME", path: "/Pages/Home" },
    { id: 3, title: "SERVICES", path: "/Pages/Service" },
    { id: 4, title: "SEARCH", path: "/Pages/Search" },
    { id: 5, title: "ACTIVITIES", path: "/Pages/Activity" },
    { id: 6, title: "MY LIST", path: "/Pages/MyList" },
    { id: 7, title: "MENU", path: "/Pages/Menu" },
  ],
};

const authenticationNavigationByLanguage = {
  fr: {
    account: "MON COMPTE",
    admin: "ADMINISTRATION",
    login: "CONNEXION",
    logout: "DÉCONNEXION",
    signup: "INSCRIPTION",
  },
  en: {
    account: "MY ACCOUNT",
    admin: "ADMINISTRATION",
    login: "LOG IN",
    logout: "LOG OUT",
    signup: "SIGN UP",
  },
};

const interfaceCopy = {
  fr: {
    closeMenu: "Fermer le menu",
    languageAction: "Afficher le site en anglais",
    mainNavigation: "Navigation principale",
    openMenu: "Ouvrir le menu",
    resetHome: "Réinitialiser les filtres et revenir à la page d'accueil",
  },
  en: {
    closeMenu: "Close menu",
    languageAction: "Display the website in French",
    mainNavigation: "Main navigation",
    openMenu: "Open menu",
    resetHome: "Reset filters and return to the Home page",
  },
};

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { isLoading, logout, user } = useAuth();
  const { language, toggleLanguage } = useLanguage();
  const copy = interfaceCopy[language];
  const authenticationCopy = authenticationNavigationByLanguage[language];
  const [homeItem, ...remainingItems] = navigationByLanguage[language];
  const authenticationItems = isLoading
    ? []
    : user
      ? [
          { id: "account", title: authenticationCopy.account, path: "/account" },
          ...(user.role === "administrator"
            ? [{ id: "admin", title: authenticationCopy.admin, path: "/admin" }]
            : []),
          { id: "logout", title: authenticationCopy.logout, action: "logout" },
        ]
      : [
          { id: "login", title: authenticationCopy.login, path: "/login" },
          { id: "signup", title: authenticationCopy.signup, path: "/signup" },
        ];
  const menuList = [homeItem, ...authenticationItems, ...remainingItems];

  function reset() {
    localStorage.removeItem("searchState");
    localStorage.removeItem("searchQuery");
  }

  function handleNavigate(path) {
    navigate(path);
    setIsOpen(false);
  }

  function handleLanguageToggle() {
    toggleLanguage();
    setIsOpen(false);
  }

  async function handleLogout() {
    setIsOpen(false);
    setIsLoggingOut(true);

    try {
      await logout();
    } catch {
      // AuthProvider still clears the local account state if revocation fails.
    } finally {
      setIsLoggingOut(false);
      navigate("/", { replace: true });
    }
  }

  function handleMenuItem(item) {
    if (item.action === "logout") {
      void handleLogout();
      return;
    }

    handleNavigate(item.path);
  }

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          to="/"
          onClick={reset}
          className="site-header__brand"
          aria-label={copy.resetHome}
        >
          Spot <span className="site-header__brand-accent">MTL</span>
        </Link>

        <div className="site-header__actions">
          <nav
            className="site-header__desktop-nav"
            aria-label={copy.mainNavigation}
          >
            {menuList.map((item) => (
              <button
                key={item.id}
                className="site-header__nav-button"
                disabled={item.action === "logout" && isLoggingOut}
                onClick={() => handleMenuItem(item)}
              >
                {item.title}
              </button>
            ))}
          </nav>

          <button
            className="site-header__language-button"
            onClick={handleLanguageToggle}
            aria-label={copy.languageAction}
            title={copy.languageAction}
          >
            <span lang={language === "fr" ? "en-CA" : "fr-CA"}>
              {language === "fr" ? "EN" : "FR"}
            </span>
          </button>

          <button
            className="site-header__menu-toggle"
            onClick={() => setIsOpen((current) => !current)}
            aria-controls="mobile-navigation"
            aria-expanded={isOpen}
            aria-label={isOpen ? copy.closeMenu : copy.openMenu}
          >
            <span className="site-header__menu-toggle-line" />
            <span className="site-header__menu-toggle-line" />
            <span className="site-header__menu-toggle-line" />
          </button>
        </div>

        {isOpen && (
          <nav
            id="mobile-navigation"
            className="site-header__mobile-nav"
            aria-label={copy.mainNavigation}
          >
            {menuList.map((item) => (
              <button
                key={item.id}
                className="site-header__mobile-link"
                disabled={item.action === "logout" && isLoggingOut}
                onClick={() => handleMenuItem(item)}
              >
                {item.title}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
