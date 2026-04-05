const API = "http://localhost:5000/api";

export const getToken = () => localStorage.getItem("token");

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

// ── AUTH ──────────────────────────────────────────────
export const loginAPI = (email, password) =>
  fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

export const registerAPI = (email, password) =>
  fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  }).then((r) => r.json());

export const forgotPasswordAPI = (email) =>
  fetch(`${API}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  }).then((r) => r.json());

// ── STUDENTS ──────────────────────────────────────────
export const getAllStudents = () =>
  fetch(`${API}/students`, { headers: authHeaders() }).then((r) => r.json());

export const getStudent = (id) =>
  fetch(`${API}/students/${id}`, { headers: authHeaders() }).then((r) => r.json());

export const createStudent = (data) =>
  fetch(`${API}/students`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const updateStudent = (id, data) =>
  fetch(`${API}/students/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const deleteStudent = (id) =>
  fetch(`${API}/students/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  }).then((r) => r.json());

export const getRanking = () =>
  fetch(`${API}/students/ranking`, { headers: authHeaders() }).then((r) =>
    r.json()
  );

// ── MARKS ─────────────────────────────────────────────
export const saveMarks = (data) =>
  fetch(`${API}/marks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  }).then((r) => r.json());

export const getMarks = (studentId) =>
  fetch(`${API}/marks/${studentId}`, { headers: authHeaders() }).then((r) =>
    r.json()
  );