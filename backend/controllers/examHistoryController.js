const UserProgress = require('../models/UserProgress');
const User = require('../models/User');

/**
 * GET /api/exam-history
 * Lấy toàn bộ lịch sử bài thi của user đang đăng nhập
 * Query params:
 *   - page (default: 1)
 *   - limit (default: 10)
 *   - lessonId (optional filter)
 */
async function getExamHistory(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Login required' });
    }

    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;

    const filter = { user: userId };
    if (req.query.lessonId) {
      filter.lessonId = req.query.lessonId;
    }

    const [history, total] = await Promise.all([
      UserProgress.find(filter)
        .sort({ completedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      UserProgress.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: history,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page * limit < total,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.error('getExamHistory error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * GET /api/exam-history/:id
 * Lấy chi tiết 1 bài thi theo ID
 */
async function getExamDetail(req, res) {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const record = await UserProgress.findOne({ _id: id, user: userId }).lean();
    if (!record) {
      return res.status(404).json({ success: false, message: 'Exam record not found' });
    }

    return res.status(200).json({ success: true, data: record });
  } catch (error) {
    console.error('getExamDetail error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * GET /api/exam-history/summary
 * Trả về thống kê tổng hợp lịch sử bài thi:
 * tổng số bài, điểm trung bình, điểm cao nhất, streak hiện tại
 */
async function getExamSummary(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Login required' });
    }

    const records = await UserProgress.find({ user: userId, completed: true })
      .sort({ completedAt: -1 })
      .lean();

    if (records.length === 0) {
      return res.status(200).json({
        success: true,
        data: {
          totalExams: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
          currentStreak: 0,
        },
      });
    }

    const scores = records.map((r) => r.score || 0);
    const totalExams = records.length;
    const averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalExams);
    const highestScore = Math.max(...scores);
    const lowestScore = Math.min(...scores);

    // Calculate current daily streak
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const uniqueDays = [
      ...new Set(
        records.map((r) => {
          const d = new Date(r.completedAt || r.createdAt);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = today.getTime() - i * 86400000;
      if (uniqueDays[i] === expected) {
        currentStreak++;
      } else {
        break;
      }
    }

    return res.status(200).json({
      success: true,
      data: { totalExams, averageScore, highestScore, lowestScore, currentStreak },
    });
  } catch (error) {
    console.error('getExamSummary error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * DELETE /api/exam-history/:id
 * Xóa 1 bản ghi lịch sử bài thi
 */
async function deleteExamRecord(req, res) {
  try {
    const userId = req.user?._id;
    const { id } = req.params;

    const record = await UserProgress.findOneAndDelete({ _id: id, user: userId });
    if (!record) {
      return res.status(404).json({ success: false, message: 'Exam record not found' });
    }

    return res.status(200).json({ success: true, message: 'Đã xóa bản ghi bài thi.' });
  } catch (error) {
    console.error('deleteExamRecord error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = { getExamHistory, getExamDetail, getExamSummary, deleteExamRecord };
