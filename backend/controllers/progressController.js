const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

function formatUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    totalScore: user.totalScore || 0,
    totalQuizzes: user.totalQuizzes || 0,
    totalQuestions: user.totalQuestions || 0,
    correctQuestions: user.correctQuestions || 0
  };
}

async function addScore(req, res) {
  try {
    const score = Number(req.body.score || 0);
    const isCorrect = Boolean(req.body.isCorrect);
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: 'Login required' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $inc: {
          totalScore: score,
          totalQuestions: 1,
          correctQuestions: isCorrect ? 1 : 0
        }
      },
      { new: true }
    ).select('-password');

    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Score update failed', error: error.message });
  }
}

async function completeLesson(req, res) {
  try {
    const { lessonId = 'daily-exam', score = 0 } = req.body;
    const userId = req.user?._id;

    const progress = await UserProgress.create({
      user: userId,
      lessonId,
      score,
      completed: true,
      completedAt: new Date()
    });

    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { totalQuizzes: 1 } },
      { new: true }
    ).select('-password');

    res.status(201).json({ progress, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: 'Lesson completion failed', error: error.message });
  }
}

async function getMyProgress(req, res) {
  const progress = await UserProgress.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ progress });
}

module.exports = { addScore, completeLesson, getMyProgress };
