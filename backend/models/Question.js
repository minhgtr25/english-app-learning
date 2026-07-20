const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    englishText: { type: String, required: true, trim: true },
    correctAnswer: { type: String, required: true, trim: true },
    options: [{ type: String, required: true, trim: true }],
    level: { type: String, enum: ['A1', 'A2', 'B1', 'B2', 'C1'], default: 'A2' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Question', questionSchema);
