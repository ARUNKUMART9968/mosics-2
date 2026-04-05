import { useState } from "react";
import Icon, { Icons } from "../components/Icon";
import { loginAPI } from "../api/api";

// Login page — shown when user is not authenticated
// Props:
//   onLogin      - called with JWT token after successful login
//   goRegister   - navigate to register page
//   goForgot     - navigate to forgot password page

function LoginPage({ onLogin, goRegister, goForgot }) {
  const [form, setForm]       = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const submit = async () => {
    if (!form.email || !form.password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await loginAPI(form.email, form.password);
      if (!data.token) throw new Error(data.message || "Login failed");
      onLogin(data.token);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">🎓</div>
        <div className="auth-title">Welcome back</div>
        <div className="auth-sub">Sign in to your teacher account</div>

        {error && <div className="error-box">{error}</div>}

        {/* Email */}
        <div className="field">
          <label>Email</label>
          <div className="input-wrap">
            <Icon d={Icons.mail} size={16} />
            <input
              type="email"
              placeholder="teacher@school.com"
              value={form.email}
              onChange={handleChange("email")}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
        </div>

        {/* Password */}
        <div className="field">
          <label>Password</label>
          <div className="input-wrap">
            <Icon d={Icons.lock} size={16} />
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange("password")}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>
        </div>

        {/* Forgot password link */}
        <div style={{ textAlign: "right", marginBottom: 20 }}>
          <span
            style={{ fontSize: 13, color: "var(--accent)", cursor: "pointer" }}
            onClick={goForgot}
          >
            Forgot password?
          </span>
        </div>

        <button className="btn" onClick={submit} disabled={loading} style={{ width: "100%" }}>
          {loading ? <span className="spinner" /> : "Sign In"}
        </button>

        <div className="auth-link">
          Don't have an account?{" "}
          <span onClick={goRegister}>Register</span>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;