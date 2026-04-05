import { useState } from "react";
import Icon, { Icons } from "./Icon";
import { saveMarks } from "../api/api";

// Modal for entering/updating marks for a student
// Props:
//   student  - the student object (must have id, name, regNo, marks)
//   onClose  - called when modal is dismissed
//   onSave   - called after successful save
//   toast    - function(msg, type) to show notifications

const SUBJECTS = ["Subject 1", "Subject 2", "Subject 3", "Subject 4", "Subject 5"];
const KEYS     = ["subject1", "subject2", "subject3", "subject4", "subject5"];

function MarksModal({ student, onClose, onSave, toast }) {
  const existing = student?.marks;

  const [form, setForm] = useState({
    subject1: existing?.subject1 || "",
    subject2: existing?.subject2 || "",
    subject3: existing?.subject3 || "",
    subject4: existing?.subject4 || "",
    subject5: existing?.subject5 || "",
  });
  const [loading, setLoading] = useState(false);

  // Live total + percentage calculation
  const total = KEYS.reduce((sum, k) => sum + (parseFloat(form[k]) || 0), 0);
  const percentage = ((total / 500) * 100).toFixed(1);

  const handleChange = (key) => (e) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const save = async () => {
    setLoading(true);
    try {
      const payload = {
        studentId: student.id,
        ...Object.fromEntries(KEYS.map((k) => [k, parseFloat(form[k]) || 0])),
      };
      const res = await saveMarks(payload);
      if (res.message && !res.id) throw new Error(res.message);
      toast("Marks saved!", "success");
      onSave();
    } catch (e) {
      toast(e.message || "Failed to save marks", "error");
    }
    setLoading(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal" style={{ maxWidth: 520 }}>
        <div className="modal-title">Enter Marks</div>
        <div className="modal-sub">
          Student:{" "}
          <strong style={{ color: "var(--text)" }}>{student.name}</strong>{" "}
          ({student.regNo})
        </div>

        {/* 5 subject inputs in 2-column grid */}
        <div className="grid2">
          {SUBJECTS.map((label, i) => (
            <div className="field" key={i}>
              <label>{label}</label>
              <div className="input-wrap">
                <Icon d={Icons.book} size={16} />
                <input
                  type="number" min="0" max="100"
                  placeholder="0 – 100"
                  value={form[KEYS[i]]}
                  onChange={handleChange(KEYS[i])}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Live total + percentage display */}
        <div
          style={{
            background: "var(--bg3)", borderRadius: 10,
            padding: "14px 16px", marginTop: 4,
            display: "flex", justifyContent: "space-between",
          }}
        >
          <div>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>TOTAL</div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, color: "var(--accent)" }}>
              {total}
              <span style={{ fontSize: 13, color: "var(--text3)" }}>/500</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, color: "var(--text3)", marginBottom: 2 }}>PERCENTAGE</div>
            <div style={{ fontFamily: "Syne", fontWeight: 700, fontSize: 20, color: "var(--accent3)" }}>
              {percentage}%
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="btn secondary" onClick={onClose}>Cancel</button>
          <button className="btn success" onClick={save} disabled={loading}>
            {loading ? <span className="spinner" /> : "Save Marks"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MarksModal;