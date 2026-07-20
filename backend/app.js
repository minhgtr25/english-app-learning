const cors = require('cors');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const ChatMessage = require('./models/ChatMessage');
const analyticsRoutes = require('./routes/analyticsRoutes');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const progressRoutes = require('./routes/progressRoutes');
const questionRoutes = require('./routes/questionRoutes');
const userRoutes = require('./routes/userRoutes');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to English Learning API' });
  });

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'english-learning-api' });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/chat', chatRoutes);
  app.use('/api/questions', questionRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api/users', userRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
  });

  app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  });

  return app;
}

function createHttpServer(app) {
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', socket => {
    socket.on('chat:message', async message => {
      const payload = {
        user: message.user || 'Anonymous',
        text: message.text,
        time: message.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      try {
        await ChatMessage.create(payload);
      } catch (error) {
        console.error('Chat save failed:', error.message);
      }

      socket.broadcast.emit('chat:message', {
        id: message.id || String(Date.now()),
        ...payload
      });
    });
  });

  return { server, io };
}

module.exports = { createApp, createHttpServer };
