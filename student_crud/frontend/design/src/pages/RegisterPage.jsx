import { useState } from "react";
import Icon, { Icons } from "../components/Icon";
import { registerAPI } from "../api/api";

// Register page — creates a new teacher account
// Props:
//   onDone   - called after successful registration (navigates to login)
//   goLogin  - navigate to login page

function RegisterPage({ onDone, goLogin }) {
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
      const data = await registerAPI(form.email, form.password);
      if (data.message && !data.id) throw new Error(data.message);
      onDone(); // go back to login
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">🎓</div>
        <div className="auth-title">Create account</div>
        <div className="auth-sub">Register as a teacher</div>

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
            />
          </div>
        </div>

        <button className="btn" onClick={submit} disabled={loading} style={{ width: "100%" }}>
          {loading ? <span className="spinner" /> : "Create Account"}
        </button>

        <div className="auth-link">
          Already have an account?{" "}
          <span onClick={goLogin}>Sign in</span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;