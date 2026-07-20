const bcrypt = require('bcryptjs');
const User = require('../models/User');

async function leaderboard(req, res) {
  const users = await User.find()
    .select('fullName totalScore streak role')
    .sort({ totalScore: -1, streak: -1 })
    .limit(20);

  res.json({ users });
}

async function updateProfile(req, res) {
  try {
    const { fullName, password, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (fullName) {
      user.fullName = fullName.trim();
    }

    if (password && newPassword) {
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(400).json({ message: 'Current password is incorrect' });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.json({
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        streak: user.streak,
        totalScore: user.totalScore
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Update profile failed', error: error.message });
  }
}

module.exports = { leaderboard, updateProfile };
