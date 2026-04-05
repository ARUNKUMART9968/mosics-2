const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/authMiddleware');
const ctrl    = require('../controllers/marksController');

router.use(auth);

router.post('/',                  ctrl.addOrUpdateMarks);
router.get('/:studentId',         ctrl.getMarks);

module.exports = router;