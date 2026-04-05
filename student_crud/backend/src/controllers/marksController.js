const prisma = require('../prisma')



exports.addOrUpdateMarks = async (req, res) => {
  const { studentId, subject1, subject2, subject3, subject4, subject5 } = req.body;
  const total      = subject1 + subject2 + subject3 + subject4 + subject5;
  const percentage = (total / 500) * 100;

  try {
    const marks = await prisma.marks.upsert({
      where: { studentId: parseInt(studentId) },
      update: { subject1, subject2, subject3, subject4, subject5, total, percentage },
      create: { studentId: parseInt(studentId), subject1, subject2, subject3, subject4, subject5, total, percentage }
    });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: 'Error saving marks', error: err.message });
  }
};

exports.getMarks = async (req, res) => {
  try {
    const marks = await prisma.marks.findUnique({
      where: { studentId: parseInt(req.params.studentId) }
    });
    if (!marks) return res.status(404).json({ message: 'Marks not found' });
    res.json(marks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching marks', error: err.message });
  }
};