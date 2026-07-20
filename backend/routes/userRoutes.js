const express = require('express');
const { leaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/leaderboard', protect, leaderboard);

module.exports = router;
