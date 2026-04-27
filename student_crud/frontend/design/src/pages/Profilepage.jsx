import { useState, useEffect } from "react";
import { getMyProfile, toggleActiveAPI } from "../api/api";

// ProfilePage — lets the logged-in teacher see and toggle their active status.
// Props:
//   toast        - function(msg, type) to show notifications
//   onStatusChange - called after toggle so App can refresh isActive state

function ProfilePage({ toast, onStatusChange }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const load = async () => {
    try {
      const data = await getMyProfile();
      setProfile(data);
    } catch {
      toast("Failed to load profile", "error");
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleToggle = async () => {
    setToggling(true);
    try {
      const res = await toggleActiveAPI();
      if (res.teacher) {
        setProfile(res.teacher);
        onStatusChange(res.teacher.isActive);
        toast(
          res.teacher.isActive
            ? "You are now Active — editing enabled!"
            : "You are now Inactive — editing disabled.",
          res.teacher.isActive ? "success" : "error"
        );
      } else {
        toast(res.message || "Toggle failed", "error");
      }
    } catch {
      toast("Failed to toggle status", "error");
    }
    setToggling(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: 60 }}>
        <span className="spinner" />
      </div>
    );
  }

  const isActive = profile?.isActive;

  return (
    <div>
      <div className="page-header">
        <div className="page-title">My Profile</div>
        <div className="page-sub">Manage your account status</div>
      </div>

      <div className="card" style={{ maxWidth: 520 }}>
        {/* Avatar + email */}
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 28 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "linear-gradient(135deg, var(--accent), var(--accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 28,
              flexShrink: 0,
            }}
          >
            🎓
          </div>
          <div>
            <div
              style={{
                fontFamily: "Syne",
                fontWeight: 700,
                fontSize: 18,
                marginBottom: 4,
              }}
            >
              {profile?.email}
            </div>
            <div style={{ fontSize: 13, color: "var(--text3)" }}>Teacher Account</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid var(--border)", marginBottom: 24 }} />

        {/* Status section */}
        <div
          style={{
            background: isActive
              ? "rgba(67,233,123,0.06)"
              : "rgba(255,68,68,0.06)",
            border: `1px solid ${isActive ? "rgba(67,233,123,0.25)" : "rgba(255,68,68,0.25)"}`,
            borderRadius: 14,
            padding: "20px 22px",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--text3)",
                  marginBottom: 6,
                }}
              >
                Current Status
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {/* Animated dot */}
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: isActive ? "var(--accent3)" : "#ff6b6b",
                    display: "inline-block",
                    boxShadow: isActive
                      ? "0 0 0 3px rgba(67,233,123,0.2)"
                      : "0 0 0 3px rgba(255,68,68,0.2)",
                    animation: isActive ? "pulse 2s infinite" : "none",
                  }}
                />
                <span
                  style={{
                    fontFamily: "Syne",
                    fontWeight: 700,
                    fontSize: 20,
                    color: isActive ? "var(--accent3)" : "#ff6b6b",
                  }}
                >
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>

            {/* Big toggle switch */}
            <div
              onClick={!toggling ? handleToggle : undefined}
              title={isActive ? "Click to set Inactive" : "Click to set Active"}
              style={{
                width: 64,
                height: 34,
                borderRadius: 17,
                background: isActive
                  ? "linear-gradient(135deg, var(--accent3), #38b2ac)"
                  : "var(--bg3)",
                border: `2px solid ${isActive ? "transparent" : "var(--border)"}`,
                position: "relative",
                cursor: toggling ? "not-allowed" : "pointer",
                transition: "background 0.3s, border 0.3s",
                flexShrink: 0,
                opacity: toggling ? 0.7 : 1,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 3,
                  left: isActive ? 32 : 3,
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: "white",
                  transition: "left 0.3s",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                {toggling ? (
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      border: "2px solid rgba(0,0,0,0.2)",
                      borderTop: "2px solid #333",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.6s linear infinite",
                    }}
                  />
                ) : isActive ? (
                  "✓"
                ) : (
                  "✕"
                )}
              </div>
            </div>
          </div>
        </div>

        {/* What this means */}
        <div
          style={{
            background: "var(--bg3)",
            borderRadius: 12,
            padding: "16px 18px",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text3)",
              textTransform: "uppercase",
              letterSpacing: "0.07em",
              marginBottom: 10,
            }}
          >
            What this means
          </div>
          <ul
            style={{
              listStyle: "none",
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {[
              {
                icon: "✅",
                text: "Active teachers can add, edit and delete students & marks",
              },
              {
                icon: "👁️",
                text: "Inactive teachers can still view all students and rankings",
              },
              {
                icon: "🔄",
                text: "You can toggle your own status at any time",
              },
            ].map((item, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  fontSize: 13,
                  color: "var(--text2)",
                }}
              >
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action button */}
        <button
          className={`btn ${isActive ? "danger" : "success"}`}
          onClick={handleToggle}
          disabled={toggling}
          style={{ width: "100%", marginTop: 20 }}
        >
          {toggling ? (
            <span className="spinner" />
          ) : isActive ? (
            "Set Myself Inactive"
          ) : (
            "Set Myself Active"
          )}
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(67,233,123,0.2); }
          50%       { box-shadow: 0 0 0 6px rgba(67,233,123,0.1); }
        }
      `}</style>
    </div>
  );
}

export default ProfilePage;