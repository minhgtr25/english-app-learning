const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

async function addScore(req, res) {
  try {
    const score = Number(req.body.score || 0);
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Login required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalScore: score }, lastActiveDate: new Date() },
      { new: true }
    ).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Score update failed', error: error.message });
  }
}

async function completeLesson(req, res) {
  try {
    const { lessonId = 'daily-exam', score = 0 } = req.body;
    const progress = await UserProgress.create({
      user: req.user._id,
      lessonId,
      score,
      completed: true,
      completedAt: new Date()
    });

    res.status(201).json({ progress });
  } catch (error) {
    res.status(500).json({ message: 'Lesson completion failed', error: error.message });
  }
}

async function getMyProgress(req, res) {
  const progress = await UserProgress.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ progress });
}

module.exports = { addScore, completeLesson, getMyProgress };
