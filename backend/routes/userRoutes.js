const express = require('express');
const { leaderboard, updateProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/leaderboard', protect, leaderboard);
router.put('/profile', protect, updateProfile);

module.exports = router;
