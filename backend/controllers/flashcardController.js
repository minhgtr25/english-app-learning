/**
 * Flashcard Review Controller (Quizlet-style)
 *
 * Cho phép user tạo và ôn tập flashcard theo phương pháp
 * Spaced Repetition (lặp lại ngắt quãng) — tương tự Quizlet.
 *
 * Mỗi flashcard có trạng thái học:
 *   - new       : chưa học
 *   - learning  : đang học (đúng < 2 lần liên tiếp)
 *   - review    : thuộc, cần ôn định kỳ
 *   - mastered  : đã thành thạo
 *
 * Thuật toán nhắc lại dựa trên SM-2 (SuperMemo 2):
 *   - Đúng → tăng interval, tăng easeFactor
 *   - Sai   → reset interval, giảm easeFactor
 */

const mongoose = require('mongoose');

// ─── Flashcard Schema (inline — có thể tách thành models/Flashcard.js) ────────

const flashcardSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    setId: {
      // Group flashcards into a "study set"
      type: String,
      required: true,
      trim: true,
    },
    front: { type: String, required: true, trim: true }, // English word / phrase
    back: { type: String, required: true, trim: true },  // Vietnamese meaning
    example: { type: String, trim: true },               // Example sentence (optional)
    imageUrl: { type: String, trim: true },              // Optional image

    // SM-2 spaced repetition fields
    status: {
      type: String,
      enum: ['new', 'learning', 'review', 'mastered'],
      default: 'new',
    },
    easeFactor: { type: Number, default: 2.5 },          // SM-2 EF (min 1.3)
    interval: { type: Number, default: 1 },              // Days until next review
    repetitions: { type: Number, default: 0 },           // Consecutive correct answers
    nextReviewAt: { type: Date, default: Date.now },     // Next due date
    lastReviewedAt: { type: Date },
  },
  { timestamps: true }
);

const Flashcard =
  mongoose.models.Flashcard || mongoose.model('Flashcard', flashcardSchema);

// ─── SM-2 Algorithm ───────────────────────────────────────────────────────────

/**
 * Apply SM-2 algorithm based on user's self-rating (0–5)
 * rating: 0 = complete blackout, 3 = correct with effort, 5 = perfect
 * @param {object} card - Flashcard document
 * @param {number} rating - 0 to 5
 * @returns {object} updated fields
 */
function applySM2(card, rating) {
  let { easeFactor, interval, repetitions } = card;

  if (rating >= 3) {
    // Correct answer
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * easeFactor);

    repetitions += 1;
  } else {
    // Incorrect — reset
    repetitions = 0;
    interval = 1;
  }

  // Adjust ease factor
  easeFactor = easeFactor + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02));
  if (easeFactor < 1.3) easeFactor = 1.3;

  // Determine status
  let status;
  if (repetitions === 0) status = 'learning';
  else if (repetitions < 3) status = 'learning';
  else if (interval >= 21) status = 'mastered';
  else status = 'review';

  const nextReviewAt = new Date();
  nextReviewAt.setDate(nextReviewAt.getDate() + interval);

  return {
    easeFactor: parseFloat(easeFactor.toFixed(2)),
    interval,
    repetitions,
    status,
    nextReviewAt,
    lastReviewedAt: new Date(),
  };
}

// ─── Study Set CRUD ───────────────────────────────────────────────────────────

/**
 * GET /api/flashcards/sets
 * Lấy danh sách các bộ flashcard của user
 */
async function getStudySets(req, res) {
  try {
    const owner = req.user?._id;
    if (!owner) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const sets = await Flashcard.aggregate([
      { $match: { owner: new mongoose.Types.ObjectId(owner) } },
      {
        $group: {
          _id: '$setId',
          total: { $sum: 1 },
          mastered: { $sum: { $cond: [{ $eq: ['$status', 'mastered'] }, 1, 0] } },
          learning: { $sum: { $cond: [{ $eq: ['$status', 'learning'] }, 1, 0] } },
          newCount: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } },
          dueCount: { $sum: { $cond: [{ $lte: ['$nextReviewAt', new Date()] }, 1, 0] } },
          updatedAt: { $max: '$updatedAt' },
        },
      },
      { $sort: { updatedAt: -1 } },
    ]);

    return res.status(200).json({ success: true, data: sets });
  } catch (err) {
    console.error('getStudySets error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * GET /api/flashcards?setId=xxx
 * Lấy tất cả flashcard trong một bộ
 */
async function getFlashcards(req, res) {
  try {
    const owner = req.user?._id;
    const { setId } = req.query;

    if (!setId) {
      return res.status(400).json({ success: false, message: 'setId is required' });
    }

    const cards = await Flashcard.find({ owner, setId }).sort({ createdAt: 1 }).lean();
    return res.status(200).json({ success: true, data: cards });
  } catch (err) {
    console.error('getFlashcards error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * POST /api/flashcards
 * Tạo một flashcard mới
 * Body: { setId, front, back, example?, imageUrl? }
 */
async function createFlashcard(req, res) {
  try {
    const owner = req.user?._id;
    if (!owner) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { setId, front, back, example, imageUrl } = req.body;
    if (!setId || !front || !back) {
      return res.status(400).json({
        success: false,
        message: 'setId, front, and back are required',
      });
    }

    const card = await Flashcard.create({ owner, setId, front, back, example, imageUrl });
    return res.status(201).json({ success: true, data: card });
  } catch (err) {
    console.error('createFlashcard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * POST /api/flashcards/bulk
 * Tạo nhiều flashcard cùng lúc (import cả bộ)
 * Body: { setId, cards: [{ front, back, example?, imageUrl? }] }
 */
async function bulkCreateFlashcards(req, res) {
  try {
    const owner = req.user?._id;
    if (!owner) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const { setId, cards } = req.body;
    if (!setId || !Array.isArray(cards) || cards.length === 0) {
      return res.status(400).json({ success: false, message: 'setId and cards[] are required' });
    }

    const docs = cards.map(({ front, back, example, imageUrl }) => ({
      owner,
      setId,
      front,
      back,
      example,
      imageUrl,
    }));

    const created = await Flashcard.insertMany(docs);
    return res.status(201).json({
      success: true,
      message: `Đã thêm ${created.length} flashcard.`,
      data: created,
    });
  } catch (err) {
    console.error('bulkCreateFlashcards error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * PATCH /api/flashcards/:id
 * Cập nhật nội dung flashcard (front, back, example, imageUrl)
 */
async function updateFlashcard(req, res) {
  try {
    const owner = req.user?._id;
    const { id } = req.params;
    const { front, back, example, imageUrl } = req.body;

    const card = await Flashcard.findOneAndUpdate(
      { _id: id, owner },
      { front, back, example, imageUrl },
      { new: true, runValidators: true }
    );

    if (!card) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    return res.status(200).json({ success: true, data: card });
  } catch (err) {
    console.error('updateFlashcard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * DELETE /api/flashcards/:id
 * Xóa một flashcard
 */
async function deleteFlashcard(req, res) {
  try {
    const owner = req.user?._id;
    const card = await Flashcard.findOneAndDelete({ _id: req.params.id, owner });
    if (!card) return res.status(404).json({ success: false, message: 'Flashcard not found' });
    return res.status(200).json({ success: true, message: 'Đã xóa flashcard.' });
  } catch (err) {
    console.error('deleteFlashcard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

// ─── Study / Review Session ───────────────────────────────────────────────────

/**
 * GET /api/flashcards/due?setId=xxx&limit=20
 * Lấy danh sách flashcard đến hạn ôn tập hôm nay
 */
async function getDueCards(req, res) {
  try {
    const owner = req.user?._id;
    const { setId } = req.query;
    const limit = Math.min(100, parseInt(req.query.limit) || 20);

    const filter = { owner, nextReviewAt: { $lte: new Date() } };
    if (setId) filter.setId = setId;

    const cards = await Flashcard.find(filter)
      .sort({ nextReviewAt: 1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      data: cards,
      count: cards.length,
    });
  } catch (err) {
    console.error('getDueCards error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * POST /api/flashcards/:id/review
 * Ghi lại kết quả ôn tập và cập nhật lịch nhắc theo SM-2
 * Body: { rating: 0-5 }
 *   0 = Không nhớ gì, 3 = Nhớ ra được, 5 = Nhớ ngay lập tức
 */
async function reviewCard(req, res) {
  try {
    const owner = req.user?._id;
    const { id } = req.params;
    const rating = parseInt(req.body.rating);

    if (isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ success: false, message: 'rating must be 0–5' });
    }

    const card = await Flashcard.findOne({ _id: id, owner });
    if (!card) return res.status(404).json({ success: false, message: 'Flashcard not found' });

    const updates = applySM2(card, rating);
    Object.assign(card, updates);
    await card.save();

    return res.status(200).json({
      success: true,
      message: `Đã cập nhật. Ôn lại sau ${updates.interval} ngày.`,
      data: {
        status: card.status,
        interval: card.interval,
        nextReviewAt: card.nextReviewAt,
        easeFactor: card.easeFactor,
      },
    });
  } catch (err) {
    console.error('reviewCard error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

/**
 * POST /api/flashcards/sets/:setId/reset
 * Reset toàn bộ tiến độ của một bộ flashcard về trạng thái "new"
 */
async function resetSetProgress(req, res) {
  try {
    const owner = req.user?._id;
    const { setId } = req.params;

    const result = await Flashcard.updateMany(
      { owner, setId },
      {
        status: 'new',
        easeFactor: 2.5,
        interval: 1,
        repetitions: 0,
        nextReviewAt: new Date(),
        lastReviewedAt: null,
      }
    );

    return res.status(200).json({
      success: true,
      message: `Đã reset ${result.modifiedCount} flashcard về trạng thái ban đầu.`,
    });
  } catch (err) {
    console.error('resetSetProgress error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
}

module.exports = {
  getStudySets,
  getFlashcards,
  createFlashcard,
  bulkCreateFlashcards,
  updateFlashcard,
  deleteFlashcard,
  getDueCards,
  reviewCard,
  resetSetProgress,
};
