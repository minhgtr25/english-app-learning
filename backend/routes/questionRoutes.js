const express = require('express');
const {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion
} = require('../controllers/questionController');

const router = express.Router();

router.get('/', getQuestions);
router.post('/', createQuestion);
router.put('/:id', updateQuestion);
router.delete('/:id', deleteQuestion);

module.exports = router;
