const express = require('express');
const { createMessage, getMessages } = require('../controllers/chatController');

const router = express.Router();

router.get('/messages', getMessages);
router.post('/messages', createMessage);

module.exports = router;
