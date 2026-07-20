const Question = require('../models/Question');
const User = require('../models/User');
const UserProgress = require('../models/UserProgress');

async function getAnalytics(req, res) {
  const [questionCount, learnerCount, completedLessons, topUsers] = await Promise.all([
    Question.countDocuments(),
    User.countDocuments({ role: 'student' }),
    UserProgress.countDocuments({ completed: true }),
    User.find().select('fullName totalScore streak').sort({ totalScore: -1 }).limit(5)
  ]);

  const averageScoreAgg = await User.aggregate([
    { $group: { _id: null, averageScore: { $avg: '$totalScore' } } }
  ]);

  res.json({
    metrics: {
      questionCount,
      learnerCount,
      completedLessons,
      averageScore: Math.round(averageScoreAgg[0]?.averageScore || 0)
    },
    weeklyScores: [18, 36, 42, 64, 81],
    topUsers
  });
}

module.exports = { getAnalytics };
