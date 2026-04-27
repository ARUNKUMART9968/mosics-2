import { useState, useCallback, useEffect } from "react";
import "./index.css";

// Pages
import LoginPage          from "./pages/LoginPage";
import RegisterPage       from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage  from "./pages/ResetPasswordPage";
import DashboardPage      from "./pages/DashboardPage";
import StudentsPage       from "./pages/StudentsPage";
import RankingPage        from "./pages/RankingPage";
import ProfilePage        from "./pages/ProfilePage";

// Components
import Sidebar        from "./components/Sidebar";
import Toast          from "./components/Toast";
import InactiveBanner from "./components/InactiveBanner";

import { getMyProfile } from "./api/api";

function App() {
  const [token, setToken]           = useState(() => localStorage.getItem("token"));
  const [authPage, setAuthPage]     = useState("login");
  const [resetToken, setResetToken] = useState(null);
  const [page, setPage]             = useState("dashboard");
  const [toast, setToast]           = useState(null);
  const [isActive, setIsActive]     = useState(true); // teacher active status

  // Detect reset password link on page load
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith("/reset-password/")) {
      const t = path.split("/reset-password/")[1];
      setResetToken(t);
      setAuthPage("reset");
    }
  }, []);

  // Fetch teacher profile once logged in to sync isActive
  useEffect(() => {
    if (!token) return;
    getMyProfile()
      .then((data) => {
        if (typeof data.isActive === "boolean") setIsActive(data.isActive);
      })
      .catch(() => {});
  }, [token]);

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
    setIsActive(true);
  };

  // Called by ProfilePage after toggle
  const handleStatusChange = (newStatus) => {
    setIsActive(newStatus);
  };

  // ── Not logged in → show auth pages ──────────────────
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

  // ── Logged in → show main layout ──────────────────────
  return (
    <div className="layout">
      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
        isActive={isActive}
      />

      <main className="main">
        {/* Show inactive warning banner on all pages (except profile) */}
        {!isActive && page !== "profile" && (
          <InactiveBanner onGoProfile={() => setPage("profile")} />
        )}

        {page === "dashboard" && <DashboardPage toast={showToast} />}
        {page === "students"  && (
          <StudentsPage toast={showToast} isActive={isActive} />
        )}
        {page === "ranking"   && <RankingPage toast={showToast} />}
        {page === "profile"   && (
          <ProfilePage
            toast={showToast}
            onStatusChange={handleStatusChange}
          />
        )}
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