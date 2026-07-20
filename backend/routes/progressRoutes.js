const express = require('express');
const { addScore, completeLesson, getMyProgress } = require('../controllers/progressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/me', protect, getMyProgress);
router.post('/score', protect, addScore);
router.post('/complete', protect, completeLesson);

module.exports = router;
