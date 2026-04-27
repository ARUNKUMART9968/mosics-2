import { useState, useEffect, useCallback } from "react";
import Icon, { Icons } from "../components/Icon";
import StudentModal from "../components/StudentModal";
import MarksModal from "../components/MarksModal";
import { getAllStudents, deleteStudent } from "../api/api";

// Students page — full CRUD for students + marks entry
// Props:
//   toast    - function(msg, type) to show notifications
//   isActive - boolean: whether current teacher can write

function StudentsPage({ toast, isActive }) {
  const [students, setStudents]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [showAdd, setShowAdd]           = useState(false);
  const [editStudent, setEditStudent]   = useState(null);
  const [marksStudent, setMarksStudent] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch {
      toast("Failed to load students", "error");
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id, name) => {
    if (!isActive) {
      toast("You are inactive. Activate your account to delete students.", "error");
      return;
    }
    if (!window.confirm(`Delete student "${name}"?`)) return;
    try {
      await deleteStudent(id);
      toast("Student deleted", "success");
      load();
    } catch {
      toast("Failed to delete", "error");
    }
  };

  const handleAddClick = () => {
    if (!isActive) {
      toast("You are inactive. Activate your account to add students.", "error");
      return;
    }
    setShowAdd(true);
  };

  const handleEditClick = (student) => {
    if (!isActive) {
      toast("You are inactive. Activate your account to edit students.", "error");
      return;
    }
    setEditStudent(student);
  };

  const handleMarksClick = (student) => {
    if (!isActive) {
      toast("You are inactive. Activate your account to enter marks.", "error");
      return;
    }
    setMarksStudent(student);
  };

  const attBadge = (pct) =>
    pct >= 75 ? "green" : pct >= 50 ? "yellow" : "red";

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.regNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <div className="page-title">Students</div>
        <div className="page-sub">Manage all student records</div>
      </div>

      {/* Search + Add button */}
      <div className="topbar">
        <div className="search-wrap" style={{ width: 300 }}>
          <span className="search-icon">
            <Icon d={Icons.search} size={16} />
          </span>
          <input
            placeholder="Search by name or reg no..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          className="btn sm"
          onClick={handleAddClick}
          disabled={!isActive}
          title={!isActive ? "Activate your account to add students" : ""}
          style={{ opacity: isActive ? 1 : 0.45, cursor: isActive ? "pointer" : "not-allowed" }}
        >
          <Icon d={Icons.plus} size={14} /> Add Student
        </button>
      </div>

      {/* Table card */}
      <div className="card">
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <span className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">👨‍🎓</div>
            <p>{search ? "No students match your search" : "No students yet. Click Add Student!"}</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Reg No.</th>
                  <th>Attendance</th>
                  <th>Total Marks</th>
                  <th>Percentage</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr key={s.id}>
                    <td style={{ color: "var(--text3)" }}>{i + 1}</td>
                    <td style={{ color: "var(--text)", fontWeight: 500 }}>{s.name}</td>
                    <td style={{ fontFamily: "monospace", fontSize: 13 }}>{s.regNo}</td>
                    <td>
                      <span className={`badge ${attBadge(s.attendancePercent)}`}>
                        {s.attendancePercent}%
                      </span>
                    </td>
                    <td>
                      {s.marks
                        ? <span style={{ color: "var(--accent)", fontWeight: 600 }}>{s.marks.total}</span>
                        : <span style={{ color: "var(--text3)" }}>—</span>}
                    </td>
                    <td>
                      {s.marks
                        ? <span style={{ color: "var(--accent3)" }}>{s.marks.percentage.toFixed(1)}%</span>
                        : <span style={{ color: "var(--text3)" }}>—</span>}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        {/* Marks button */}
                        <button
                          className="btn sm secondary"
                          style={{
                            padding: "6px 12px",
                            opacity: isActive ? 1 : 0.4,
                            cursor: isActive ? "pointer" : "not-allowed",
                          }}
                          onClick={() => handleMarksClick(s)}
                          title={isActive ? "Enter Marks" : "Inactive — cannot edit"}
                        >
                          <Icon d={Icons.book} size={13} />
                        </button>
                        {/* Edit button */}
                        <button
                          className="btn sm secondary"
                          style={{
                            padding: "6px 12px",
                            opacity: isActive ? 1 : 0.4,
                            cursor: isActive ? "pointer" : "not-allowed",
                          }}
                          onClick={() => handleEditClick(s)}
                          title={isActive ? "Edit" : "Inactive — cannot edit"}
                        >
                          <Icon d={Icons.edit} size={13} />
                        </button>
                        {/* Delete button */}
                        <button
                          className="btn sm danger"
                          style={{
                            padding: "6px 12px",
                            opacity: isActive ? 1 : 0.4,
                            cursor: isActive ? "pointer" : "not-allowed",
                          }}
                          onClick={() => handleDelete(s.id, s.name)}
                          title={isActive ? "Delete" : "Inactive — cannot delete"}
                        >
                          <Icon d={Icons.trash} size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      {(showAdd || editStudent) && (
        <StudentModal
          student={editStudent}
          onClose={() => { setShowAdd(false); setEditStudent(null); }}
          onSave={() => { setShowAdd(false); setEditStudent(null); load(); }}
          toast={toast}
        />
      )}

      {/* Marks Modal */}
      {marksStudent && (
        <MarksModal
          student={marksStudent}
          onClose={() => setMarksStudent(null)}
          onSave={() => { setMarksStudent(null); load(); }}
          toast={toast}
        />
      )}
    </div>
  );
}

export default StudentsPage;