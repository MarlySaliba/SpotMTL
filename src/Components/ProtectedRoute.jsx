import { Navigate } from "react-router-dom";
import useLanguage from "../i18n/useLanguage";
import useAuth from "../authentication/useAuth";

export default function ProtectedRoute({ children, requiredRole }) {
  const { isLoading, user } = useAuth();
  const { language } = useLanguage();

  if (isLoading) {
    return (
      <p className="protected-route__status">
        {language === "fr"
          ? "Vérification de la session..."
          : "Checking session..."}
      </p>
    );
  }

  if (!user) {
    return <Navigate replace to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate replace to="/account" />;
  }

  return children;
}
