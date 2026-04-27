import Icon, { Icons } from "./Icon";

// Sidebar navigation shown after login
// Props:
//   page      - currently active page key
//   setPage   - function to change page
//   onLogout  - called when Sign Out is clicked
//   isActive  - boolean: whether the current teacher is active

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { key: "students",  label: "Students",  icon: Icons.students  },
  { key: "ranking",   label: "Rankings",  icon: Icons.trophy    },
  { key: "profile",   label: "My Profile", icon: Icons.user     },
];

function Sidebar({ page, setPage, onLogout, isActive }) {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">🎓</div>
        <div className="sidebar-logo-text">EduManage</div>
      </div>

      {/* Nav links */}
      {navItems.map((n) => (
        <button
          key={n.key}
          className={`nav-item ${page === n.key ? "active" : ""}`}
          onClick={() => setPage(n.key)}
        >
          <Icon d={n.icon} size={16} />
          {n.label}

          {/* Show status dot on Profile item */}
          {n.key === "profile" && (
            <span
              style={{
                marginLeft: "auto",
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: isActive ? "var(--accent3)" : "#ff6b6b",
                flexShrink: 0,
              }}
              title={isActive ? "Active" : "Inactive"}
            />
          )}
        </button>
      ))}

      {/* Inactive status chip at bottom of nav */}
      {!isActive && (
        <div
          style={{
            margin: "8px 4px",
            padding: "8px 12px",
            borderRadius: 8,
            background: "rgba(255,68,68,0.08)",
            border: "1px solid rgba(255,68,68,0.2)",
            fontSize: 12,
            color: "#ff6b6b",
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ fontSize: 10 }}>●</span>
          Inactive Mode
        </div>
      )}

      {/* Logout at bottom */}
      <div className="sidebar-bottom">
        <button
          className="nav-item"
          onClick={onLogout}
          style={{ color: "#ff6b6b" }}
        >
          <Icon d={Icons.logout} size={16} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;