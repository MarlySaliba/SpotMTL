import { useNavigate } from "react-router-dom";
import useAuth from "../authentication/useAuth";
import useLanguage from "../i18n/useLanguage";

const copyByLanguage = {
  fr: {
    admin: "Administrateur",
    email: "Adresse courriel",
    logout: "Se déconnecter",
    name: "Nom",
    role: "Rôle",
    title: "Mon compte",
    user: "Utilisateur",
  },
  en: {
    admin: "Administrator",
    email: "Email address",
    logout: "Log out",
    name: "Name",
    role: "Role",
    title: "My account",
    user: "User",
  },
};

export default function Account() {
  const { logout, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const copy = copyByLanguage[language];

  async function handleLogout() {
    try {
      await logout();
    } finally {
      navigate("/", { replace: true });
    }
  }

  return (
    <article className="account-page account-page--profile">
      <h1 className="account-page__title">{copy.title}</h1>
      <dl className="account-details">
        <div className="account-details__row">
          <dt className="account-details__term">{copy.name}</dt>
          <dd className="account-details__value">{user.name}</dd>
        </div>
        <div className="account-details__row">
          <dt className="account-details__term">{copy.email}</dt>
          <dd className="account-details__value account-details__value--email">
            {user.email}
          </dd>
        </div>
        <div className="account-details__row">
          <dt className="account-details__term">{copy.role}</dt>
          <dd className="account-details__value">
            {user.role === "administrator" ? copy.admin : copy.user}
          </dd>
        </div>
      </dl>
      <button
        className="account-page__logout"
        onClick={handleLogout}
        type="button"
      >
        {copy.logout}
      </button>
    </article>
  );
}
