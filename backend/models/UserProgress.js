const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lessonId: { type: String, required: true },
    score: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('UserProgress', userProgressSchema);
