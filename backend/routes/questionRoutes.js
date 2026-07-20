const express = require('express');
const {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion
} = require('../controllers/questionController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', protect, getQuestions);
router.post('/', protect, adminOnly, createQuestion);
router.put('/:id', protect, adminOnly, updateQuestion);
router.delete('/:id', protect, adminOnly, deleteQuestion);

module.exports = router;
