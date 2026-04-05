import { useState } from "react";
import Icon, { Icons } from "../components/Icon";
import { forgotPasswordAPI } from "../api/api";

// Forgot Password page — sends a reset link to the teacher's email
// Props:
//   goLogin - navigate back to login page

function ForgotPasswordPage({ goLogin }) {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState("");

  const submit = async () => {
    if (!email) { setError("Please enter your email"); return; }
    setLoading(true);
    setError("");
    try {
      const data = await forgotPasswordAPI(email);
      if (data.message && data.message.toLowerCase().includes("not")) throw new Error(data.message);
      setDone(true);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">🔑</div>
        <div className="auth-title">Reset password</div>
        <div className="auth-sub">Enter your email to receive a reset link</div>

        {/* Success state */}
        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📧</div>
            <div style={{ color: "var(--accent3)", fontWeight: 600, marginBottom: 8 }}>
              Reset link sent!
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)" }}>
              Check your email inbox
            </div>
          </div>
        ) : (
          <>
            {error && <div className="error-box">{error}</div>}

            <div className="field">
              <label>Email</label>
              <div className="input-wrap">
                <Icon d={Icons.mail} size={16} />
                <input
                  type="email"
                  placeholder="teacher@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>
            </div>

            <button className="btn" onClick={submit} disabled={loading} style={{ width: "100%" }}>
              {loading ? <span className="spinner" /> : "Send Reset Link"}
            </button>
          </>
        )}

        <div className="auth-link">
          <span onClick={goLogin}>← Back to Sign In</span>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;