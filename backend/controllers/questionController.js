const Question = require('../models/Question');

function normalizeQuestionPayload(body) {
  const options = Array.isArray(body.options)
    ? body.options.map(option => String(option).trim()).filter(Boolean)
    : [];

  return {
    title: String(body.title || '').trim(),
    category: String(body.category || '').trim(),
    englishText: String(body.englishText || '').trim(),
    correctAnswer: String(body.correctAnswer || '').trim(),
    options,
    level: body.level || 'A2'
  };
}

function validateQuestionPayload(payload) {
  if (!payload.title || !payload.category || !payload.englishText || !payload.correctAnswer) {
    return 'Title, category, question text and correct answer are required';
  }

  if (payload.options.length < 2) {
    return 'At least two answer options are required';
  }

  if (!payload.options.includes(payload.correctAnswer)) {
    return 'Correct answer must match one of the options';
  }

  return null;
}

async function getQuestions(req, res) {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json({ questions });
}

async function createQuestion(req, res) {
  try {
    const payload = normalizeQuestionPayload(req.body);
    const validationError = validateQuestionPayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const question = await Question.create(payload);
    res.status(201).json({ question });
  } catch (error) {
    res.status(400).json({ message: 'Create question failed', error: error.message });
  }
}

async function updateQuestion(req, res) {
  try {
    const payload = normalizeQuestionPayload(req.body);
    const validationError = validateQuestionPayload(payload);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const question = await Question.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true
    });
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json({ question });
  } catch (error) {
    res.status(400).json({ message: 'Update question failed', error: error.message });
  }
}

async function deleteQuestion(req, res) {
  const question = await Question.findByIdAndDelete(req.params.id);
  if (!question) {
    return res.status(404).json({ message: 'Question not found' });
  }
  res.json({ message: 'Question deleted' });
}

module.exports = { getQuestions, createQuestion, updateQuestion, deleteQuestion };
