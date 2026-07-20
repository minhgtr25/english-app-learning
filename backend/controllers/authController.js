const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || 'dev_secret_change_me',
    { expiresIn: '7d' }
  );
}

function formatUser(user) {
  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    totalScore: user.totalScore || 0,
    totalQuizzes: user.totalQuizzes || 0,
    totalQuestions: user.totalQuestions || 0,
    correctQuestions: user.correctQuestions || 0
  };
}

async function register(req, res) {
  try {
    const { fullName, email, password, role } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'fullName, email and password are required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashed,
      role: role === 'admin' ? 'admin' : 'student'
    });

    res.status(201).json({
      token: signToken(user),
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Register failed', error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      token: signToken(user),
      user: formatUser(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
}

async function me(req, res) {
  res.json({ user: formatUser(req.user) });
}

module.exports = { register, login, me };
