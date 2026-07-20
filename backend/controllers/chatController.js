const ChatMessage = require('../models/ChatMessage');

async function getMessages(req, res) {
  const messages = await ChatMessage.find()
    .sort({ createdAt: -1 })
    .limit(50);

  res.json({
    messages: messages.reverse().map(message => ({
      id: String(message._id),
      user: message.user,
      userId: message.userId ? String(message.userId) : null,
      text: message.text,
      time: message.time
    }))
  });
}

async function createMessage(req, res) {
  try {
    const message = await ChatMessage.create({
      user: req.body.user || req.user?.fullName || 'Anonymous',
      text: req.body.text,
      time: req.body.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      userId: req.user?._id
    });

    res.status(201).json({
      message: {
        id: String(message._id),
        user: message.user,
        text: message.text,
        time: message.time
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Create chat message failed', error: error.message });
  }
}

module.exports = { createMessage, getMessages };
