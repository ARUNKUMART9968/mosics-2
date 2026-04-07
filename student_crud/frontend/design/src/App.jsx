import { useState, useCallback, useEffect } from "react"; // add useEffect
import "./index.css";

// Pages
import LoginPage          from "./pages/LoginPage";
import RegisterPage       from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage  from "./pages/ResetPasswordPage"; // add this
import DashboardPage      from "./pages/DashboardPage";
import StudentsPage       from "./pages/StudentsPage";
import RankingPage        from "./pages/RankingPage";

// Components
import Sidebar from "./components/Sidebar";
import Toast   from "./components/Toast";

function App() {
  const [token, setToken]         = useState(() => localStorage.getItem("token"));
  const [authPage, setAuthPage]   = useState("login");
  const [resetToken, setResetToken] = useState(null); // add this
  const [page, setPage]           = useState("dashboard");
  const [toast, setToast]         = useState(null);

  // Detect reset password link on page load
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/reset-password/")) {
      const t = path.split("/reset-password/")[1];
      setResetToken(t);
      setAuthPage("reset");
    }
  }, []);

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthPage("login");
  };

  // ── Not logged in → show auth pages
  if (!token) {

    if (authPage === "reset") {
      return (
        <ResetPasswordPage
          token={resetToken}
          goLogin={() => {
            setAuthPage("login");
            setResetToken(null);
            window.history.pushState({}, "", "/");
          }}
        />
      );
    }

    if (authPage === "register") {
      return (
        <RegisterPage
          onDone={() => setAuthPage("login")}
          goLogin={() => setAuthPage("login")}
        />
      );
    }

    if (authPage === "forgot") {
      return <ForgotPasswordPage goLogin={() => setAuthPage("login")} />;
    }

    return (
      <LoginPage
        onLogin={handleLogin}
        goRegister={() => setAuthPage("register")}
        goForgot={() => setAuthPage("forgot")}
      />
    );
  }

  // ── Logged in → show main layout
  return (
    <div className="layout">
      <Sidebar page={page} setPage={setPage} onLogout={handleLogout} />
      <main className="main">
        {page === "dashboard" && <DashboardPage toast={showToast} />}
        {page === "students"  && <StudentsPage  toast={showToast} />}
        {page === "ranking"   && <RankingPage   toast={showToast} />}
      </main>
      {toast && (
        <Toast
          key={toast.id}
          msg={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;