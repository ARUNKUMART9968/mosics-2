// InactiveBanner — shown at the top of the main content area when the
// logged-in teacher's isActive flag is false.
// Props:
//   onGoProfile - function to navigate to the Profile page

function InactiveBanner({ onGoProfile }) {
  return (
    <div
      style={{
        background: "rgba(255,68,68,0.08)",
        border: "1px solid rgba(255,68,68,0.3)",
        borderRadius: 12,
        padding: "12px 18px",
        marginBottom: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Red pulsing dot */}
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: "50%",
            background: "#ff6b6b",
            display: "inline-block",
            flexShrink: 0,
            boxShadow: "0 0 0 3px rgba(255,68,68,0.2)",
          }}
        />
        <div>
          <span
            style={{
              fontFamily: "Syne",
              fontWeight: 700,
              color: "#ff6b6b",
              fontSize: 14,
              marginRight: 8,
            }}
          >
            You are Inactive.
          </span>
          <span style={{ color: "var(--text2)", fontSize: 13 }}>
            You can view data but cannot add, edit, or delete records.
          </span>
        </div>
      </div>

      <button
        className="btn sm"
        onClick={onGoProfile}
        style={{
          background: "rgba(255,68,68,0.15)",
          border: "1px solid rgba(255,68,68,0.35)",
          color: "#ff6b6b",
          flexShrink: 0,
          padding: "7px 14px",
          fontSize: 12,
          fontFamily: "Syne",
          fontWeight: 600,
          borderRadius: 8,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Activate →
      </button>
    </div>
  );
}

export default InactiveBanner;