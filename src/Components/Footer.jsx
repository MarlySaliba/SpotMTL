import { Link } from "react-router-dom";
import useLanguage from "../i18n/useLanguage";

const footerCopy = {
  fr: {
    description:
      "Découvrez des attractions, des activités et des restaurants partout à Montréal.",
    legal: "Liens juridiques",
    privacy: "Politique de confidentialité",
    rights: "Tous droits réservés.",
    storage:
      "Témoins et stockage : SpotMTL utilise le témoin strictement nécessaire spotmtl_session pour sécuriser les connexions. Il est HttpOnly, SameSite=Lax, limité au chemin /api, valide au plus 7 jours, puis révoqué et effacé à la déconnexion. Aucun témoin d'analyse, de publicité ou de suivi n'est utilisé. Le choix de langue demeure dans le stockage local du navigateur.",
    terms: "Conditions d'utilisation",
  },
  en: {
    description:
      "Discover attractions, activities, and restaurants across Montréal.",
    legal: "Legal links",
    privacy: "Privacy Policy",
    rights: "All rights reserved.",
    storage:
      "Cookies and storage: SpotMTL uses the strictly necessary spotmtl_session cookie to secure sign-ins. It is HttpOnly, SameSite=Lax, limited to the /api path, valid for up to 7 days, and revoked and cleared at logout. No analytics, advertising, or tracking cookies are used. The language choice remains in browser local storage.",
    terms: "Terms and Conditions",
  },
};

export default function Footer() {
  const { language } = useLanguage();
  const copy = footerCopy[language];

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__brand">
            Spot <span className="site-footer__brand-accent">MTL</span>
          </p>
          <p className="site-footer__description">
            {copy.description}
          </p>
          <p className="site-footer__storage-note">
            {copy.storage}
          </p>
        </div>

        <div className="site-footer__legal">
          <nav
            className="site-footer__nav"
            aria-label={copy.legal}
          >
            <Link className="site-footer__link" to="/terms">
              {copy.terms}
            </Link>
            <Link className="site-footer__link" to="/privacy">
              {copy.privacy}
            </Link>
          </nav>
          <p className="site-footer__copyright">
            © {new Date().getFullYear()} SpotMTL. {copy.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
