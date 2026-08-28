import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/auth";
import useLanguage from "../i18n/useLanguage";
import useAuth from "./useAuth";

const copyByLanguage = {
  fr: {
    email: "Adresse courriel",
    error: "La connexion a échoué. Veuillez réessayer.",
    invalid: "L'adresse courriel ou le mot de passe est incorrect.",
    password: "Mot de passe",
    signup: "Créer un compte",
    signupLead: "Vous n'avez pas encore de compte?",
    submit: "Se connecter",
    submitting: "Connexion...",
  },
  en: {
    email: "Email address",
    error: "Login failed. Please try again.",
    invalid: "The email address or password is incorrect.",
    password: "Password",
    signup: "Create an account",
    signupLead: "Do not have an account yet?",
    submit: "Log in",
    submitting: "Logging in...",
  },
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const copy = copyByLanguage[language];

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
      navigate("/account", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError && error.status === 401
          ? copy.invalid
          : copy.error,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="login-email">
          {copy.email}
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          className="auth-form__input"
          onChange={(event) => setEmail(event.target.value)}
          required
          value={email}
        />
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="login-password">
          {copy.password}
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          className="auth-form__input"
          maxLength={128}
          onChange={(event) => setPassword(event.target.value)}
          required
          value={password}
        />
      </div>

      {errorMessage && (
        <p className="auth-form__error" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        className="auth-form__submit"
        disabled={isSubmitting}
        type="submit"
      >
        {isSubmitting ? copy.submitting : copy.submit}
      </button>

      <p className="auth-form__prompt">
        {copy.signupLead}{" "}
        <Link className="auth-form__link" to="/signup">
          {copy.signup}
        </Link>
      </p>
    </form>
  );
}
