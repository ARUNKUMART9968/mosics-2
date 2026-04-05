import { useState, useCallback } from "react";
import "./index.css";

// Pages
import LoginPage        from "./pages/LoginPage";
import RegisterPage     from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import DashboardPage    from "./pages/DashboardPage";
import StudentsPage     from "./pages/StudentsPage";
import RankingPage      from "./pages/RankingPage";

// Components
import Sidebar from "./components/Sidebar";
import Toast   from "./components/Toast";

// ── APP ───────────────────────────────────────────────────────────────────
// This is the root component. It handles:
//   1. Auth state  (logged in or not)
//   2. Which auth page to show (login / register / forgot)
//   3. Which main page to show (dashboard / students / ranking)
//   4. Global toast notifications

function App() {
  // Token stored in localStorage so login persists on refresh
  const [token, setToken]     = useState(() => localStorage.getItem("token"));
  const [authPage, setAuthPage] = useState("login"); // "login" | "register" | "forgot"
  const [page, setPage]       = useState("dashboard"); // active main page
  const [toast, setToast]     = useState(null);        // { msg, type, id }

  // Show a toast notification
  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, id: Date.now() });
  }, []);

  // Save token → user is logged in
  const handleLogin = (t) => {
    localStorage.setItem("token", t);
    setToken(t);
  };

  // Clear token → user is logged out
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthPage("login");
  };

  // ── Not logged in → show auth pages ───────────────────────────────────
  if (!token) {
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

  // ── Logged in → show main layout ──────────────────────────────────────
  return (
    <div className="layout">
      {/* Left sidebar navigation */}
      <Sidebar page={page} setPage={setPage} onLogout={handleLogout} />

      {/* Main content area */}
      <main className="main">
        {page === "dashboard" && <DashboardPage toast={showToast} />}
        {page === "students"  && <StudentsPage  toast={showToast} />}
        {page === "ranking"   && <RankingPage   toast={showToast} />}
      </main>

      {/* Global toast notification */}
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