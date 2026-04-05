import Icon, { Icons } from "./Icon";

// Sidebar navigation shown after login
// Props:
//   page      - currently active page key
//   setPage   - function to change page
//   onLogout  - called when Sign Out is clicked

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Icons.dashboard },
  { key: "students",  label: "Students",  icon: Icons.students  },
  { key: "ranking",   label: "Rankings",  icon: Icons.trophy    },
];

function Sidebar({ page, setPage, onLogout }) {
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
        </button>
      ))}

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