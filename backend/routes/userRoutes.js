const express = require('express');
const { leaderboard } = require('../controllers/userController');

const router = express.Router();

router.get('/leaderboard', leaderboard);

module.exports = router;
