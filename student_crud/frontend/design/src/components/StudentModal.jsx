import { useState } from "react";
import Icon, { Icons } from "./Icon";
import { createStudent, updateStudent } from "../api/api";

// Modal for Adding or Editing a student
// Props:
//   student  - if editing, pass existing student object; for new student pass null
//   onClose  - called when modal is dismissed
//   onSave   - called after successful save to refresh the list
//   toast    - function(msg, type) to show notifications

function StudentModal({ student, onClose, onSave, toast }) {
  const isEdit = !!student?.id;

  const [form, setForm] = useState({
    name:              student?.name              || "",
    regNo:             student?.regNo             || "",
    attendancePercent: student?.attendancePercent || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const save = async () => {
    if (!form.name || !form.regNo) {
      toast("Name and Reg No are required", "error");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...form,
        attendancePercent: parseFloat(form.attendancePercent) || 0,
      };
      const res = isEdit
        ? await updateStudent(student.id, payload)
        : await createStudent(payload);

      if (res.message && !res.id) throw new Error(res.message);
      toast(isEdit ? "Student updated!" : "Student added!", "success");
      onSave();
    } catch (e) {
      toast(e.message || "Something went wrong", "error");
    }
    setLoading(false);
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="modal">
        <div className="modal-title">
          {isEdit ? "Edit Student" : "Add New Student"}
        </div>
        <div className="modal-sub">
          {isEdit ? "Update student information" : "Enter student details below"}
        </div>

        {/* Name */}
        <div className="field">
          <label>Full Name</label>
          <div className="input-wrap">
            <Icon d={Icons.user} size={16} />
            <input
              placeholder="e.g. Arun Kumar"
              value={form.name}
              onChange={handleChange("name")}
            />
          </div>
        </div>

        {/* Reg No + Attendance side by side */}
        <div className="grid2">
          <div className="field">
            <label>Register No.</label>
            <div className="input-wrap">
              <Icon d={Icons.book} size={16} />
              <input
                placeholder="e.g. 2021CS001"
                value={form.regNo}
                onChange={handleChange("regNo")}
              />
            </div>
          </div>
          <div className="field">
            <label>Attendance %</label>
            <div className="input-wrap">
              <Icon d={Icons.check} size={16} />
              <input
                type="number" min="0" max="100"
                placeholder="e.g. 85"
                value={form.attendancePercent}
                onChange={handleChange("attendancePercent")}
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="modal-actions">
          <button className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn" onClick={save} disabled={loading}>
            {loading ? <span className="spinner" /> : isEdit ? "Save Changes" : "Add Student"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StudentModal;