const express  = require('express');
const router   = express.Router();
const auth     = require('../middleware/authMiddleware');
const ctrl     = require('../controllers/studentController');

router.use(auth); // All student routes are protected

router.get('/',           ctrl.getAllStudents);
router.get('/ranking',    ctrl.getRanking);
router.get('/:id',        ctrl.getStudent);
router.post('/',          ctrl.createStudent);
router.put('/:id',        ctrl.updateStudent);
router.delete('/:id',     ctrl.deleteStudent);

module.exports = router;