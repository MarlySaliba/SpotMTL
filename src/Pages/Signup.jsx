import SignupForm from "../authentication/Signup";
import useLanguage from "../i18n/useLanguage";

export default function Signup() {
  const { language } = useLanguage();

  return (
    <article className="auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">
          {language === "fr" ? "Créer un compte" : "Create an account"}
        </h1>
        <p className="auth-page__intro">
          {language === "fr"
            ? "Créez votre profil SpotMTL en quelques étapes."
            : "Create your SpotMTL profile in a few steps."}
        </p>
        <SignupForm />
      </div>
    </article>
  );
}
