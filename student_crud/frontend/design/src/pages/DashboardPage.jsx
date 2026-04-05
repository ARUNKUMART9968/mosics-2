import { useState, useEffect } from "react";
import Icon, { Icons } from "../components/Icon";
import { getAllStudents } from "../api/api";

// Dashboard page — shows summary stats and recent students
// Props:
//   toast - function(msg, type) to show notifications

function DashboardPage({ toast }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getAllStudents();
        setStudents(Array.isArray(data) ? data : []);
      } catch {
        toast("Failed to load data", "error");
      }
      setLoading(false);
    })();
  }, []);

  // Calculated stats
  const withMarks  = students.filter((s) => s.marks);
  const avgPct     = withMarks.length
    ? (withMarks.reduce((s, x) => s + x.marks.percentage, 0) / withMarks.length).toFixed(1)
    : 0;
  const goodAtt    = students.filter((s) => s.attendancePercent >= 75).length;

  const attBadge = (pct) =>
    pct >= 75 ? "green" : pct >= 50 ? "yellow" : "red";

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Dashboard</div>
        <div className="page-sub">Overview of your class</div>
      </div>

      {/* Stat Cards */}
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-icon purple">
            <Icon d={Icons.students} size={20} />
          </div>
          <div>
            <div className="stat-val">{students.length}</div>
            <div className="stat-label">Total Students</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <Icon d={Icons.check} size={20} />
          </div>
          <div>
            <div className="stat-val">{avgPct}%</div>
            <div className="stat-label">Avg Percentage</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon pink">
            <Icon d={Icons.trophy} size={20} />
          </div>
          <div>
            <div className="stat-val">{goodAtt}</div>
            <div className="stat-label">Good Attendance (≥75%)</div>
          </div>
        </div>
      </div>

      {/* Recent Students Table */}
      <div className="card">
        <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 16, marginBottom: 20 }}>
          Recent Students
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 30 }}>
            <span className="spinner" />
          </div>
        ) : students.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👨‍🎓</div>
            <p>No students yet. Add some from the Students page!</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Reg No.</th>
                  <th>Attendance</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((s) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 13 }}>{s.regNo}</td>
                    <td>
                      <span className={`badge ${attBadge(s.attendancePercent)}`}>
                        {s.attendancePercent}%
                      </span>
                    </td>
                    <td>
                      {s.marks ? (
                        <span style={{ color: "var(--accent3)" }}>
                          {s.marks.percentage.toFixed(1)}%
                        </span>
                      ) : (
                        <span style={{ color: "var(--text3)" }}>No marks yet</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;