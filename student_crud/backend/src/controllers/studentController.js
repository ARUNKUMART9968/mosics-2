const prisma = require('../prisma')


// CREATE
exports.createStudent = async (req, res) => {
  const { name, regNo, attendancePercent } = req.body;
  try {
    const student = await prisma.student.create({
      data: { name, regNo, attendancePercent: attendancePercent || 0 }
    });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error creating student', error: err.message });
  }
};

// READ ALL
exports.getAllStudents = async (req, res) => {
  try {
    const students = await prisma.student.findMany({ include: { marks: true } });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching students', error: err.message });
  }
};

// READ ONE
exports.getStudent = async (req, res) => {
  try {
    const student = await prisma.student.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { marks: true }
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching student', error: err.message });
  }
};

// UPDATE
exports.updateStudent = async (req, res) => {
  const { name, regNo, attendancePercent } = req.body;
  try {
    const student = await prisma.student.update({
      where: { id: parseInt(req.params.id) },
      data: { name, regNo, attendancePercent }
    });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Error updating student', error: err.message });
  }
};

// DELETE
exports.deleteStudent = async (req, res) => {
  try {
    await prisma.student.delete({ where: { id: parseInt(req.params.id) } });
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting student', error: err.message });
  }
};

// RANKING
exports.getRanking = async (req, res) => {
  try {
    const students = await prisma.student.findMany({
      include: { marks: true }
    });

    const ranked = students
      .filter(s => s.marks)
      .sort((a, b) => b.marks.total - a.marks.total)
      .map((s, index) => ({ rank: index + 1, ...s }));

    res.json(ranked);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rankings', error: err.message });
  }
};