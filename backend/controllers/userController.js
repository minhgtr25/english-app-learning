const User = require('../models/User');

async function leaderboard(req, res) {
  const users = await User.find()
    .select('fullName totalScore streak role')
    .sort({ totalScore: -1, streak: -1 })
    .limit(20);

  res.json({ users });
}

module.exports = { leaderboard };
