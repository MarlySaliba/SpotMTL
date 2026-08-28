import { Link } from "react-router-dom";
import useLanguage from "../i18n/useLanguage";

const termsCopy = {
  fr: {
    date: "En vigueur et dernière mise à jour : 23 août 2026",
    eyebrow: "Informations juridiques",
    intro:
      "Les présentes conditions s'appliquent au site Web et à l'application SpotMTL dans leur version actuelle. En utilisant SpotMTL, vous acceptez les présentes conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser le service.",
    privacyLead:
      "Pour en savoir plus sur les pratiques actuelles en matière de renseignements personnels, consultez la",
    privacyLink: "Politique de confidentialité",
    sections: [
      {
        heading: "1. À propos de SpotMTL",
        paragraphs: [
          "SpotMTL est un service de découverte en phase initiale qui aide les gens à explorer des attractions, des activités, des restaurants et d'autres lieux à Montréal. La version actuelle permet de créer un compte et d'ouvrir une session, mais elle ne permet pas d'effectuer des réservations, des paiements ou des achats.",
        ],
      },
      {
        heading: "2. Comptes, identifiants et rôles",
        paragraphs: [
          "Vous devez fournir des renseignements exacts lors de la création de votre compte, protéger votre mot de passe et fermer votre session sur les appareils partagés. Vous êtes responsable de l'utilisation de votre compte et ne devez pas tenter d'utiliser le compte d'une autre personne.",
          "Chaque compte possède un rôle d'utilisateur ou d'administrateur. Les rôles sont contrôlés par le serveur : le formulaire d'inscription ne permet pas de demander ou de s'attribuer un rôle d'administrateur. Seul un processus administratif autorisé peut attribuer ce rôle.",
        ],
      },
      {
        heading: "3. Renseignements sur les lieux",
        paragraphs: [
          "Les descriptions, catégories, prix, heures d'ouverture, disponibilités, renseignements sur l'accessibilité et les restrictions alimentaires, détails saisonniers et images peuvent être incomplets, retardés ou inexacts. Vérifiez tout renseignement important directement auprès de l'établissement avant de vous déplacer, de faire des plans ou d'engager des dépenses. La présence d'un établissement dans SpotMTL ne signifie pas que SpotMTL en est propriétaire, l'exploite, le commandite ou le recommande.",
        ],
      },
      {
        heading: "4. Utilisation sécuritaire et licite",
        paragraphs: [
          "Vous pouvez utiliser SpotMTL à des fins personnelles et licites. Vous ne devez pas :",
        ],
        items: [
          "perturber le site Web, l'API, la base de données ou les mécanismes de sécurité;",
          "tenter d'accéder à des systèmes ou à des renseignements sans autorisation;",
          "envoyer des requêtes automatisées d'une manière qui perturbe le service;",
          "dénaturer le contenu de SpotMTL ou l'utiliser à des fins illégales;",
          "copier ou réutiliser à des fins commerciales du contenu protégé sans autorisation.",
        ],
      },
      {
        heading: "5. Propriété intellectuelle",
        paragraphs: [
          "Le nom SpotMTL, l'interface, les textes originaux, le code et la conception visuelle originale sont protégés par les lois applicables en matière de propriété intellectuelle. Les noms d'établissements, marques de commerce, photographies et autres éléments appartenant à des tiers demeurent la propriété de leurs titulaires respectifs. Les présentes conditions ne vous confèrent aucun droit de propriété.",
        ],
      },
      {
        heading: "6. Services de tiers",
        paragraphs: [
          "SpotMTL pourra éventuellement proposer des liens vers des services de tiers, notamment des services d'établissements, de cartographie ou de réservation. Ces services sont régis par leurs propres conditions et pratiques en matière de confidentialité. SpotMTL n'est pas responsable de leur contenu, de leur disponibilité, de leurs transactions ni de leur traitement des renseignements.",
        ],
      },
      {
        heading: "7. Disponibilité et modifications",
        paragraphs: [
          "Le service peut être modifié, suspendu ou retiré sans préavis pendant son développement. Des fonctionnalités peuvent être ajoutées, supprimées ou corrigées, et les présentes conditions peuvent être mises à jour lorsque le service évolue. La date indiquée en haut de la page permet d'identifier la version en vigueur.",
        ],
      },
      {
        heading: "8. Exclusions de garanties et responsabilité",
        paragraphs: [
          "SpotMTL est fourni selon sa disponibilité et ne garantit pas que chaque fiche ou fonctionnalité sera exacte, complète, sécuritaire ou accessible sans interruption. Dans la mesure permise par la loi, SpotMTL n'est pas responsable des pertes résultant de la confiance accordée aux renseignements sur les établissements ou de produits et services offerts par des tiers. Rien dans les présentes conditions n'exclut ni ne limite une responsabilité qui ne peut légalement être exclue ou limitée, notamment les droits et recours prévus par les lois applicables en matière de protection du consommateur.",
        ],
      },
      {
        heading: "9. Droit applicable",
        paragraphs: [
          "SpotMTL est conçu pour aider à découvrir des lieux à Montréal. Les lois applicables du Québec et du Canada, y compris les protections impératives accordées aux consommateurs, continuent de s'appliquer lorsqu'elles l'exigent. Les présentes conditions n'imposent aucun arbitrage avant qu'un litige ne survienne et n'emportent aucune renonciation à un droit auquel il est légalement impossible de renoncer.",
        ],
      },
      {
        heading: "10. Coordonnées et mise en production",
        paragraphs: [
          "SpotMTL ne publie pas encore de coordonnées juridiques dédiées, puisque le service est un prototype en phase initiale. Le nom de l'exploitant et ses coordonnées directes devront être ajoutés avant la mise en ligne publique d'une version de production.",
        ],
      },
    ],
    title: "Conditions d'utilisation",
  },
  en: {
    date: "Effective and last updated: August 23, 2026",
    eyebrow: "Legal information",
    intro:
      "These Terms apply to the current SpotMTL website and application. By using SpotMTL, you agree to these Terms. If you do not agree, please do not use the service.",
    privacyLead: "For information about current data practices, read the",
    privacyLink: "Privacy Policy",
    sections: [
      {
        heading: "1. About SpotMTL",
        paragraphs: [
          "SpotMTL is an early-stage discovery service that helps people explore attractions, activities, restaurants, and other places in Montréal. The current version supports account creation and sign-in, but it does not process bookings, payments, or purchases.",
        ],
      },
      {
        heading: "2. Accounts, credentials, and roles",
        paragraphs: [
          "You must provide accurate information when creating your account, protect your password, and sign out on shared devices. You are responsible for activity through your account and must not attempt to use another person's account.",
          "Each account has a user or administrator role. Roles are controlled by the server: the registration form cannot request or assign an administrator role. Only an authorized administrative process can assign that role.",
        ],
      },
      {
        heading: "3. Venue information",
        paragraphs: [
          "Descriptions, categories, prices, hours, availability, accessibility, dietary information, seasonal details, and images may be incomplete, delayed, or inaccurate. Verify important details directly with the venue before travelling, making plans, or spending money. A listing does not mean that SpotMTL owns, operates, sponsors, or endorses that venue.",
        ],
      },
      {
        heading: "4. Safe and lawful use",
        paragraphs: [
          "You may use SpotMTL for personal, lawful purposes. You must not:",
        ],
        items: [
          "interfere with the website, API, database, or security controls;",
          "attempt to access systems or information without permission;",
          "use automated requests in a way that disrupts the service;",
          "misrepresent SpotMTL content or use it for unlawful activity; or",
          "copy or commercially reuse protected content without permission.",
        ],
      },
      {
        heading: "5. Intellectual property",
        paragraphs: [
          "The SpotMTL name, interface, original text, code, and original visual design are protected by applicable intellectual-property laws. Venue names, trademarks, photographs, and other third-party materials remain the property of their respective owners. No ownership rights are transferred to you under these Terms.",
        ],
      },
      {
        heading: "6. Third-party services",
        paragraphs: [
          "SpotMTL may eventually link to venue, map, reservation, or other third-party services. Those services have their own terms and privacy practices. SpotMTL is not responsible for their content, availability, transactions, or handling of information.",
        ],
      },
      {
        heading: "7. Availability and changes",
        paragraphs: [
          "The service may change, pause, or stop without notice while it is in development. Features may be added, removed, or corrected, and these Terms may be updated when the service changes. The effective date at the top identifies the current version.",
        ],
      },
      {
        heading: "8. Disclaimers and responsibility",
        paragraphs: [
          "SpotMTL is provided on an as-available basis and does not guarantee that every listing or feature will be accurate, complete, secure, or uninterrupted. To the extent permitted by law, SpotMTL is not responsible for losses caused by reliance on venue information or by third-party products and services. Nothing in these Terms excludes responsibility that cannot legally be excluded, including rights and remedies protected by applicable consumer law.",
        ],
      },
      {
        heading: "9. Applicable law",
        paragraphs: [
          "SpotMTL is designed for discovering places in Montréal. Applicable Québec and Canadian laws, including mandatory consumer protections, continue to apply where required. These Terms do not require pre-dispute arbitration or waive rights that cannot legally be waived.",
        ],
      },
      {
        heading: "10. Contact and production readiness",
        paragraphs: [
          "SpotMTL does not yet publish a dedicated legal contact because the service is an early prototype. The operator name and direct contact information must be added before a public production launch.",
        ],
      },
    ],
    title: "Terms and Conditions",
  },
};

export default function Terms() {
  const { language } = useLanguage();
  const copy = termsCopy[language];

  return (
    <article className="legal-page">
      <header className="legal-page__header">
        <p className="legal-page__eyebrow">{copy.eyebrow}</p>
        <h1 className="legal-page__title">{copy.title}</h1>
        <p className="legal-page__date">{copy.date}</p>
        <p className="legal-page__intro">{copy.intro}</p>
      </header>

      {copy.sections.map((section) => (
        <section className="legal-page__section" key={section.heading}>
          <h2 className="legal-page__section-heading">{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} className="legal-page__paragraph">
              {text}
            </p>
          ))}
          {section.items && (
            <ul className="legal-page__list">
              {section.items.map((item) => (
                <li className="legal-page__list-item" key={item}>
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}

      <p className="legal-page__paragraph">
        {copy.privacyLead}{" "}
        <Link className="legal-page__link" to="/privacy">
          {copy.privacyLink}
        </Link>
        .
      </p>
    </article>
  );
}
