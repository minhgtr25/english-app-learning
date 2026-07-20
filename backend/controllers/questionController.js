const Question = require('../models/Question');

async function getQuestions(req, res) {
  const questions = await Question.find().sort({ createdAt: -1 });
  res.json({ questions });
}

async function createQuestion(req, res) {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ question });
  } catch (error) {
    res.status(400).json({ message: 'Create question failed', error: error.message });
  }
}

async function updateQuestion(req, res) {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
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
