require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');
const Question = require('./models/Question');
const User = require('./models/User');

const questions = [
  {
    title: 'Vocabulary Sprint',
    category: 'Vocabulary',
    englishText: 'Choose the word closest in meaning to "rapid".',
    correctAnswer: 'fast',
    options: ['late', 'fast', 'quiet', 'heavy'],
    level: 'A2'
  },
  {
    title: 'Grammar Drill',
    category: 'Grammar',
    englishText: 'She ___ English every evening after dinner.',
    correctAnswer: 'studies',
    options: ['study', 'studies', 'studying', 'studied'],
    level: 'A2'
  },
  {
    title: 'Exam Reading',
    category: 'Reading',
    englishText: 'The train was delayed, so Minh arrived after the meeting started. What happened?',
    correctAnswer: 'He arrived late.',
    options: ['He arrived early.', 'He arrived late.', 'He cancelled.', 'He drove home.'],
    level: 'B1'
  },
  {
    title: 'Speaking Warmup',
    category: 'Speaking',
    englishText: 'Choose the most natural response: "How are you doing?"',
    correctAnswer: 'I am doing well.',
    options: ['I am doing well.', 'It is a book.', 'At 7 PM.', 'Blue'],
    level: 'A2'
  }
];

const users = [
  { fullName: 'Minh Tran', email: 'student@demo.com', role: 'student', totalScore: 1280, streak: 14 },
  { fullName: 'Linh Nguyen', email: 'linh@demo.com', role: 'student', totalScore: 1175, streak: 11 },
  { fullName: 'Bao Pham', email: 'bao@demo.com', role: 'student', totalScore: 1040, streak: 9 },
  { fullName: 'Admin Teacher', email: 'admin@demo.com', role: 'admin', totalScore: 620, streak: 4 }
];

async function seed() {
  await connectDB();

  for (const question of questions) {
    await Question.findOneAndUpdate(
      { title: question.title },
      question,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const password = await bcrypt.hash('123456', 10);
  for (const user of users) {
    await User.findOneAndUpdate(
      { email: user.email },
      { ...user, password, lastActiveDate: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  console.log('Seed data upserted');
  process.exit(0);
}

seed().catch(error => {
  console.error(error);
  process.exit(1);
});
