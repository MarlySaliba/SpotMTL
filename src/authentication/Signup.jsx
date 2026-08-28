import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/auth";
import useLanguage from "../i18n/useLanguage";
import useAuth from "./useAuth";

const copyByLanguage = {
  fr: {
    confirm: "Confirmer le mot de passe",
    duplicate: "Un compte existe déjà avec cette adresse courriel.",
    email: "Adresse courriel",
    error: "La création du compte a échoué. Veuillez réessayer.",
    login: "Se connecter",
    loginLead: "Vous avez déjà un compte?",
    mismatch: "Les mots de passe ne correspondent pas.",
    name: "Nom",
    password: "Mot de passe",
    passwordHelp: "Utilisez au moins 12 caractères.",
    privacy: "Politique de confidentialité",
    submit: "Créer mon compte",
    submitting: "Création du compte...",
    terms: "Conditions d'utilisation",
    termsLead: "En créant un compte, vous acceptez les",
    termsJoin: "et reconnaissez la",
  },
  en: {
    confirm: "Confirm password",
    duplicate: "An account already exists with this email address.",
    email: "Email address",
    error: "The account could not be created. Please try again.",
    login: "Log in",
    loginLead: "Already have an account?",
    mismatch: "The passwords do not match.",
    name: "Name",
    password: "Password",
    passwordHelp: "Use at least 12 characters.",
    privacy: "Privacy Policy",
    submit: "Create my account",
    submitting: "Creating account...",
    terms: "Terms and Conditions",
    termsLead: "By creating an account, you agree to the",
    termsJoin: "and acknowledge the",
  },
};

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const copy = copyByLanguage[language];

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");

    if (password !== confirmation) {
      setErrorMessage(copy.mismatch);
      return;
    }

    setIsSubmitting(true);
    try {
      await register({ name, email, password });
      navigate("/account", { replace: true });
    } catch (error) {
      setErrorMessage(
        error instanceof ApiError && error.status === 409
          ? copy.duplicate
          : copy.error,
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="signup-name">
          {copy.name}
        </label>
        <input
          id="signup-name"
          type="text"
          autoComplete="name"
          className="auth-form__input"
          maxLength={80}
          minLength={2}
          onChange={(event) => setName(event.target.value)}
          required
          value={name}
        />
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="signup-email">
          {copy.email}
        </label>
        <input
          id="signup-email"
          type="email"
          autoComplete="email"
          className="auth-form__input"
          maxLength={254}
          onChange={(event) => setEmail(event.target.value)}
          required
          value={email}
        />
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="signup-password">
          {copy.password}
        </label>
        <input
          id="signup-password"
          type="password"
          autoComplete="new-password"
          className="auth-form__input"
          aria-describedby="signup-password-help"
          maxLength={128}
          minLength={12}
          onChange={(event) => setPassword(event.target.value)}
          required
          value={password}
        />
        <p className="auth-form__help" id="signup-password-help">
          {copy.passwordHelp}
        </p>
      </div>

      <div className="auth-form__field">
        <label className="auth-form__label" htmlFor="signup-confirmation">
          {copy.confirm}
        </label>
        <input
          id="signup-confirmation"
          type="password"
          autoComplete="new-password"
          className="auth-form__input"
          maxLength={128}
          minLength={12}
          onChange={(event) => setConfirmation(event.target.value)}
          required
          value={confirmation}
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

      <p className="auth-form__terms">
        {copy.termsLead}{" "}
        <Link className="auth-form__link" to="/terms">
          {copy.terms}
        </Link>{" "}
        {copy.termsJoin}{" "}
        <Link className="auth-form__link" to="/privacy">
          {copy.privacy}
        </Link>
        .
      </p>

      <p className="auth-form__prompt">
        {copy.loginLead}{" "}
        <Link className="auth-form__link" to="/login">
          {copy.login}
        </Link>
      </p>
    </form>
  );
}
