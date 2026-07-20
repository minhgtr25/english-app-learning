const express = require('express');
const { createMessage, getMessages } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/messages', protect, getMessages);
router.post('/messages', protect, createMessage);

module.exports = router;
