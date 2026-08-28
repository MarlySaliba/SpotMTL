import { useEffect, useState } from "react";
import { getAdminUsers } from "../api/auth";
import useLanguage from "../i18n/useLanguage";

const copyByLanguage = {
  fr: {
    admin: "Administrateur",
    error: "Impossible de charger les comptes pour le moment.",
    loading: "Chargement des comptes...",
    title: "Administration des comptes",
    user: "Utilisateur",
  },
  en: {
    admin: "Administrator",
    error: "Accounts cannot be loaded right now.",
    loading: "Loading accounts...",
    title: "Account administration",
    user: "User",
  },
};

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const { language } = useLanguage();
  const copy = copyByLanguage[language];

  useEffect(() => {
    const controller = new AbortController();
    getAdminUsers({ signal: controller.signal })
      .then((accounts) => {
        setUsers(accounts);
        setStatus("success");
      })
      .catch((error) => {
        if (error?.name !== "AbortError") {
          setStatus("error");
        }
      });

    return () => controller.abort();
  }, []);

  return (
    <article className="account-page account-page--admin">
      <h1 className="account-page__title">{copy.title}</h1>

      {status === "loading" && (
        <p className="account-page__status">{copy.loading}</p>
      )}
      {status === "error" && (
        <p
          className="account-page__status account-page__status--error"
          role="alert"
        >
          {copy.error}
        </p>
      )}
      {status === "success" && (
        <ul className="admin-users">
          {users.map((account) => (
            <li className="admin-users__item" key={account.id}>
              <div className="admin-users__identity">
                <p className="admin-users__name">{account.name}</p>
                <p className="admin-users__email">{account.email}</p>
              </div>
              <span className="admin-users__role">
                {account.role === "administrator" ? copy.admin : copy.user}
              </span>
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
