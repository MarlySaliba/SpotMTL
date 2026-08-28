import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./authentication/AuthProvider";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import ProtectedRoute from "./Components/ProtectedRoute";
import Account from "./Pages/Account";
import Admin from "./Pages/Admin";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Privacy from "./Pages/Privacy";
import Search from "./Pages/Search";
import Signup from "./Pages/Signup";
import Terms from "./Pages/Terms";
import LanguageProvider from "./i18n/LanguageProvider";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <AuthProvider>
          <div className="app-shell">
            <Header />
            <main className="app-shell__main">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Pages/Home" element={<Home />} />
                <Route path="/Pages/Search" element={<Search />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="administrator">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />

                <Route
                  path="/Pages/Login"
                  element={<Navigate replace to="/login" />}
                />
                <Route
                  path="/Pages/Signup"
                  element={<Navigate replace to="/signup" />}
                />
                <Route
                  path="/Pages/Account"
                  element={<Navigate replace to="/account" />}
                />
                <Route
                  path="/Pages/Admin"
                  element={<Navigate replace to="/admin" />}
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </Router>
    </LanguageProvider>
  );
}

export default App;
