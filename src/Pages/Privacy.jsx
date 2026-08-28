import { Link } from "react-router-dom";
import useLanguage from "../i18n/useLanguage";

const privacyCopy = {
  fr: {
    date: "En vigueur et dernière mise à jour : 23 août 2026",
    eyebrow: "Informations juridiques",
    intro:
      "La présente politique explique les pratiques actuelles du prototype SpotMTL en matière de renseignements personnels. Elle est distincte des",
    termsLink: "Conditions d'utilisation",
    summaryTitle: "En bref",
    summaryItems: [
      "La création d'un compte demande un nom, une adresse courriel et un mot de passe.",
      "SpotMTL conserve le nom, l'adresse courriel normalisée, une empreinte scrypt du mot de passe, le rôle du compte et ses dates de création et de mise à jour.",
      "Le mot de passe en clair et la valeur brute du jeton de session ne sont jamais enregistrés dans la base de données.",
      "Le témoin strictement nécessaire spotmtl_session maintient la connexion pendant au plus 7 jours.",
      "SpotMTL n'utilise aucun outil d'analyse, aucune publicité et aucun pixel de suivi.",
      "Les choix de recherche ne sont ni enregistrés ni associés à une identité.",
      "Le stockage local du navigateur sert uniquement à mémoriser la langue choisie et n'est pas utilisé pour le suivi.",
    ],
    sections: [
      {
        heading: "1. Renseignements que vous fournissez",
        paragraphs: [
          "Lorsque vous créez un compte, SpotMTL reçoit votre nom, votre adresse courriel et votre mot de passe. L'adresse courriel est normalisée avant d'être enregistrée. Le mot de passe est transformé en une empreinte au moyen de scrypt avant son enregistrement; SpotMTL ne conserve jamais le mot de passe en clair.",
          "La base de données conserve également le rôle du compte, soit utilisateur ou administrateur, ainsi que ses dates de création et de mise à jour. Le rôle est attribué et contrôlé par le serveur; il ne peut pas être choisi dans le formulaire d'inscription. SpotMTL ne traite actuellement aucun renseignement de paiement, aucune réservation, aucun avis ni aucune publication d'utilisateur.",
        ],
      },
      {
        heading: "2. Choix de recherche et données sur les attractions",
        paragraphs: [
          "Les filtres de recherche demeurent dans la mémoire temporaire de la page pendant que vous utilisez l'interface actuelle. Ils ne sont pas enregistrés dans un historique de recherche, associés à un compte ni inscrits dans la base de données PostgreSQL. La base de données contient des renseignements publics sur les attractions, comme leur nom, leur catégorie, leur prix, leur description et le chemin de leurs images.",
        ],
      },
      {
        heading: "3. Renseignements techniques sur les requêtes",
        paragraphs: [
          "Un serveur Web reçoit nécessairement les renseignements techniques requis pour retourner une page ou une réponse de l'API. Ceux-ci peuvent comprendre une adresse IP, l'heure de la requête, l'adresse demandée ainsi que les en-têtes du navigateur ou de l'appareil. L'application SpotMTL actuelle n'enregistre pas intentionnellement ces renseignements dans sa base de données, ne crée pas de profils de visiteurs et ne les utilise pas à des fins d'analyse.",
          "Lorsque SpotMTL sera hébergé publiquement, un fournisseur d'infrastructure pourrait conserver des journaux limités à des fins de sécurité ou d'exploitation. Le fournisseur, l'emplacement de stockage, les règles d'accès et la durée de conservation devront être ajoutés à la présente politique avant ce déploiement.",
        ],
      },
      {
        heading: "4. Témoins de connexion et stockage du navigateur",
        paragraphs: [
          "SpotMTL utilise un témoin de connexion strictement nécessaire nommé spotmtl_session. Il contient un identifiant de session aléatoire et opaque qui permet de maintenir votre connexion. Le témoin est HttpOnly, utilise SameSite=Lax, est limité au chemin /api et expire au plus tard après 7 jours. La valeur brute du jeton n'est pas conservée dans la base de données : seule son empreinte cryptographique y est enregistrée. À la déconnexion, la session est révoquée et le témoin est effacé du navigateur.",
          "SpotMTL n'utilise aucun témoin d'analyse, de publicité ou de suivi, aucun pixel de suivi et aucun identifiant publicitaire. Puisqu'aucun témoin optionnel n'est actif, aucune bannière de consentement aux témoins optionnels n'est affichée. Toute technologie optionnelle ajoutée plus tard devra être décrite ici et activée uniquement après l'avis et le consentement requis, le cas échéant.",
          "Le site utilise le stockage local du navigateur uniquement pour mémoriser la langue que vous choisissez, soit le français ou l'anglais, d'une visite à l'autre. Cette préférence reste dans votre navigateur. Elle n'est pas associée à votre compte ni utilisée pour vous identifier, vous localiser, établir votre profil, effectuer des analyses ou diffuser de la publicité. Vous pouvez la supprimer dans les paramètres du navigateur; le site reviendra alors au français par défaut.",
          "Le retour à la page d'accueil peut également supprimer d'anciennes clés inutilisées liées aux préférences de recherche, si elles sont présentes.",
        ],
      },
      {
        heading: "5. Utilisation et communication des renseignements",
        paragraphs: [
          "SpotMTL utilise les renseignements de compte pour créer et gérer les comptes, authentifier les utilisateurs, maintenir les sessions, appliquer les rôles contrôlés par le serveur et protéger le service. Les requêtes servent aussi à fournir le site Web, effectuer les vérifications d'état du service et retourner les résultats d'attractions.",
          "SpotMTL ne vend ni ne loue de renseignements personnels, et aucun fournisseur de publicité ou d'analyse ne reçoit de renseignements sur les visiteurs de la part de l'application. Tout futur fournisseur d'hébergement, de courriel, de cartographie, d'analyse ou de paiement devra être désigné ici avant son activation lorsque la loi l'exige.",
        ],
      },
      {
        heading: "6. Conservation et sécurité",
        paragraphs: [
          "Les renseignements de compte demeurent dans la base de données pendant que le compte existe. SpotMTL ne propose pas encore d'outil libre-service de suppression de compte et doit publier un calendrier de conservation ainsi qu'une procédure de demande avant la mise en production publique.",
          "Une session expire au plus tard 7 jours après sa création et est révoquée lors de la déconnexion. SpotMTL protège les mots de passe par une empreinte scrypt et ne conserve que l'empreinte des jetons de session côté serveur. Des mesures de protection raisonnables sont appliquées, mais aucun système ne peut garantir une sécurité absolue.",
        ],
      },
      {
        heading: "7. Vos droits en matière de confidentialité",
        paragraphs: [
          "Selon la loi applicable, une personne peut avoir le droit de demander l'accès à ses renseignements personnels ou leur rectification, de retirer son consentement, de demander leur portabilité lorsque ce droit s'applique ou de déposer une plainte en matière de confidentialité. Une procédure permettant d'exercer ces droits doit encore être publiée avant la mise en production publique.",
        ],
        caiLead:
          "SpotMTL doit encore publier le titre et les coordonnées directes de son responsable de la protection des renseignements personnels. Les personnes au Québec peuvent également consulter la",
        caiLink: "Commission d'accès à l'information du Québec",
      },
      {
        heading: "8. Enfants",
        paragraphs: [
          "SpotMTL est un prototype général de découverte de lieux qui ne s'adresse pas spécifiquement aux enfants. Le service ne dispose pas encore d'un mécanisme de vérification de l'âge ou de consentement parental. Les exigences applicables à la création de comptes par des personnes mineures devront être évaluées et mises en œuvre avant la mise en production publique.",
        ],
      },
      {
        heading: "9. Modifications de la présente politique",
        paragraphs: [
          "La présente politique sera révisée lorsque les pratiques de compte, les périodes de conservation, les fournisseurs ou les technologies utilisées par SpotMTL changeront. Toute modification importante fera l'objet d'un avis clair sur le site Web, et un consentement sera demandé lorsque la loi l'exige. La date indiquée en haut de la page permet d'identifier la version en vigueur.",
        ],
      },
      {
        heading: "10. Responsable de la protection des renseignements personnels",
        paragraphs: [
          "Aucune coordonnée dédiée n'est encore publiée. Le nom de l'exploitant, le titre du responsable de la protection des renseignements personnels et ses coordonnées directes devront être ajoutés avant le lancement public d'une version de production. Ce renseignement demeure un élément obligatoire à compléter maintenant que SpotMTL offre des comptes.",
        ],
      },
    ],
    title: "Politique de confidentialité",
  },
  en: {
    date: "Effective and last updated: August 23, 2026",
    eyebrow: "Legal information",
    intro:
      "This Policy explains the current SpotMTL prototype's personal-information practices. It is separate from the",
    termsLink: "Terms and Conditions",
    summaryTitle: "At a glance",
    summaryItems: [
      "Creating an account requires a name, email address, and password.",
      "SpotMTL stores the name, normalized email address, scrypt-derived password hash, account role, and creation and update timestamps.",
      "Plaintext passwords and raw session-token values are never stored in the database.",
      "The strictly necessary spotmtl_session cookie keeps users signed in for up to 7 days.",
      "SpotMTL does not use analytics, advertising, or tracking pixels.",
      "Search choices are not saved or linked to an identity.",
      "Browser local storage is used only to remember the chosen language and is not used for tracking.",
    ],
    sections: [
      {
        heading: "1. Information you provide",
        paragraphs: [
          "When you create an account, SpotMTL receives your name, email address, and password. The email address is normalized before it is stored. The password is transformed into a scrypt-derived hash before storage; SpotMTL never stores the plaintext password.",
          "The database also stores the account role, either user or administrator, and its creation and update timestamps. The role is assigned and controlled by the server and cannot be selected through the registration form. SpotMTL does not currently process payment information, bookings, reviews, or user submissions.",
        ],
      },
      {
        heading: "2. Search choices and attraction data",
        paragraphs: [
          "Search filters remain in temporary page memory while you use the current interface. They are not saved as search history, connected to an account, or written to the PostgreSQL database. The database stores public-facing attraction details such as names, categories, prices, descriptions, and image paths.",
        ],
      },
      {
        heading: "3. Technical request information",
        paragraphs: [
          "A web server necessarily receives technical details needed to return a page or API response, which can include an IP address, request time, requested URL, and browser or device headers. The current SpotMTL application does not intentionally save this information in its database, build visitor profiles, or use it for analytics.",
          "When SpotMTL is publicly hosted, an infrastructure provider may keep limited security or operational logs. The provider, storage location, access rules, and retention period must be added to this Policy before that deployment.",
        ],
      },
      {
        heading: "4. Cookies and browser storage",
        paragraphs: [
          "SpotMTL uses a strictly necessary authentication cookie named spotmtl_session. It contains a random, opaque session identifier that keeps you signed in. The cookie is HttpOnly, uses SameSite=Lax, is limited to the /api path, and expires no later than 7 days after it is issued. The raw token value is not stored in the database; only its cryptographic hash is stored there. At logout, the session is revoked and the browser cookie is cleared.",
          "SpotMTL does not use analytics, advertising, or tracking cookies, tracking pixels, or advertising identifiers. Because no optional cookie is active, no optional-cookie consent banner is displayed. Any optional technology added later must be described here and enabled only after the required notice and consent, where applicable.",
          "The site uses browser local storage only to remember the language you choose, either French or English, between visits. This preference stays in your browser. It is not linked to your account or used to identify, locate, profile, analyze, or advertise to you. You can remove it through your browser settings, after which the site will return to French by default.",
          "Returning to the Home page may also clear unused legacy search-preference keys if they are present.",
        ],
      },
      {
        heading: "5. How information is used and shared",
        paragraphs: [
          "SpotMTL uses account information to create and manage accounts, authenticate users, maintain sessions, apply server-controlled roles, and protect the service. Requests are also used to deliver the website, perform service health checks, and return attraction results.",
          "SpotMTL does not sell or rent personal information, and no advertising or analytics provider receives visitor information from the application. Any future hosting, email, map, analytics, or payment provider must be identified here before it is enabled where required.",
        ],
      },
      {
        heading: "6. Retention and security",
        paragraphs: [
          "Account information remains in the database while the account exists. SpotMTL does not yet provide a self-service account-deletion tool and must publish a retention schedule and request procedure before a public production launch.",
          "A session expires no later than 7 days after it is created and is revoked at logout. SpotMTL protects passwords with scrypt-derived hashes and stores only session-token hashes on the server. Reasonable safeguards are applied, but no system can guarantee absolute security.",
        ],
      },
      {
        heading: "7. Your privacy rights",
        paragraphs: [
          "Depending on applicable law, a person may have rights to request access to or correction of personal information, withdraw consent, request portability where applicable, or raise a privacy complaint. A procedure for exercising these rights must still be published before a public production launch.",
        ],
        caiLead:
          "SpotMTL must still publish the title and direct contact information of its privacy officer. Québec residents can also consult the",
        caiLink: "Commission d'accès à l'information du Québec",
      },
      {
        heading: "8. Children",
        paragraphs: [
          "SpotMTL is a general place-discovery prototype that is not specifically directed to children. The service does not yet have age-verification or parental-consent controls. Requirements that apply when minors create accounts must be assessed and implemented before a public production launch.",
        ],
      },
      {
        heading: "9. Changes to this Policy",
        paragraphs: [
          "This Policy will be revised when SpotMTL's account practices, retention periods, providers, or technologies change. Material changes will be presented through a clear website notice, and consent will be requested when required. The date at the top identifies the current version.",
        ],
      },
      {
        heading: "10. Privacy contact",
        paragraphs: [
          "A dedicated privacy contact is not yet published. The operator name, privacy-officer title, and direct contact details must be added before a public production launch. This remains a required item now that SpotMTL offers accounts.",
        ],
      },
    ],
    title: "Privacy Policy",
  },
};

export default function Privacy() {
  const { language } = useLanguage();
  const copy = privacyCopy[language];

  return (
    <article className="legal-page">
      <header className="legal-page__header">
        <p className="legal-page__eyebrow">{copy.eyebrow}</p>
        <h1 className="legal-page__title">{copy.title}</h1>
        <p className="legal-page__date">{copy.date}</p>
        <p className="legal-page__intro">
          {copy.intro}{" "}
          <Link className="legal-page__link" to="/terms">
            {copy.termsLink}
          </Link>
          .
        </p>
      </header>

      <aside className="legal-summary">
        <h2 className="legal-summary__title">{copy.summaryTitle}</h2>
        <ul className="legal-summary__list">
          {copy.summaryItems.map((item) => (
            <li className="legal-summary__item" key={item}>
              {item}
            </li>
          ))}
        </ul>
      </aside>

      {copy.sections.map((section) => (
        <section className="legal-page__section" key={section.heading}>
          <h2 className="legal-page__section-heading">{section.heading}</h2>
          {section.paragraphs.map((text) => (
            <p key={text} className="legal-page__paragraph">
              {text}
            </p>
          ))}
          {section.caiLead && (
            <p className="legal-page__paragraph">
              {section.caiLead}{" "}
              <a
                className="legal-page__link"
                href="https://www.cai.gouv.qc.ca/"
                rel="noreferrer"
                target="_blank"
              >
                {section.caiLink}
              </a>
              .
            </p>
          )}
        </section>
      ))}
    </article>
  );
}
