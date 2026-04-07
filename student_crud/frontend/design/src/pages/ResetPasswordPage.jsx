import { useState } from "react";
import Icon, { Icons } from "../components/Icon";

function ResetPasswordPage({ token, goLogin }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [done, setDone]         = useState(false);
  const [error, setError]       = useState("");

  const submit = async () => {
    if (!password || !confirm) {
      setError("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed");
      setDone(true);
    } catch (e) {
      setError(e.message);
    }

    setLoading(false);
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">🔐</div>
        <div className="auth-title">New Password</div>
        <div className="auth-sub">Enter your new password below</div>

        {done ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <div style={{ color: "var(--accent3)", fontWeight: 600, marginBottom: 8 }}>
              Password reset successful!
            </div>
            <div style={{ fontSize: 13, color: "var(--text2)", marginBottom: 24 }}>
              You can now sign in with your new password
            </div>
            <button className="btn" onClick={goLogin} style={{ width: "100%" }}>
              Go to Sign In
            </button>
          </div>
        ) : (
          <>
            {error && <div className="error-box">{error}</div>}

            <div className="field">
              <label>New Password</label>
              <div className="input-wrap">
                <Icon d={Icons.lock} size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="field">
              <label>Confirm Password</label>
              <div className="input-wrap">
                <Icon d={Icons.lock} size={16} />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                />
              </div>
            </div>

            <button
              className="btn"
              onClick={submit}
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading ? <span className="spinner" /> : "Reset Password"}
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

export default ResetPasswordPage;