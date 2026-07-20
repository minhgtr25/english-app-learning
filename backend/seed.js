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
    title: 'Advanced Synonyms',
    category: 'Vocabulary',
    englishText: 'Select the antonym for the word "expand".',
    correctAnswer: 'shrink',
    options: ['grow', 'shrink', 'extend', 'broaden'],
    level: 'B1'
  },
  {
    title: 'Vocabulary Mastery',
    category: 'Vocabulary',
    englishText: 'Which word means "able to recover quickly from difficult conditions"?',
    correctAnswer: 'resilient',
    options: ['fragile', 'resilient', 'stubborn', 'hesitant'],
    level: 'B2'
  },
  {
    title: 'Contextual Vocabulary',
    category: 'Vocabulary',
    englishText: 'Choose the word that fits: "She has a very ____ appetite, eating only small portions."',
    correctAnswer: 'slight',
    options: ['massive', 'slight', 'enormous', 'intense'],
    level: 'B1'
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
    title: 'Conditionals Test',
    category: 'Grammar',
    englishText: 'If I ___ known about the weather, I would have brought an umbrella.',
    correctAnswer: 'had',
    options: ['have', 'had', 'was', 'would'],
    level: 'B1'
  },
  {
    title: 'Future Perfect Tense',
    category: 'Grammar',
    englishText: 'By the time we arrive at the cinema, the movie ___ already.',
    correctAnswer: 'will have started',
    options: ['starts', 'will start', 'will have started', 'started'],
    level: 'B2'
  },
  {
    title: 'Question Tags',
    category: 'Grammar',
    englishText: 'He speaks English fluently, ___ he?',
    correctAnswer: "doesn't",
    options: ["isn't", "doesn't", "hasn't", "didn't"],
    level: 'A2'
  },
  {
    title: 'Exam Reading 1',
    category: 'Reading',
    englishText: 'The train was delayed, so Minh arrived after the meeting started. What happened?',
    correctAnswer: 'He arrived late.',
    options: ['He arrived early.', 'He arrived late.', 'He cancelled.', 'He drove home.'],
    level: 'B1'
  },
  {
    title: 'Exam Reading 2',
    category: 'Reading',
    englishText: 'Despite the heavy rain, the football match continued until the final whistle. What can be inferred?',
    correctAnswer: 'Weather did not stop the match.',
    options: ['The match was cancelled.', 'Weather did not stop the match.', 'The players went home.', 'It rained inside.'],
    level: 'B1'
  },
  {
    title: 'Exam Reading 3',
    category: 'Reading',
    englishText: 'The new policy requires all employees to wear badges for security reasons. Why was the policy introduced?',
    correctAnswer: 'To improve workplace security.',
    options: ['To look stylish.', 'To improve workplace security.', 'To check attendance.', 'To save money.'],
    level: 'A2'
  },
  {
    title: 'Exam Reading 4',
    category: 'Reading',
    englishText: 'Although the company lost money in the first quarter, their annual revenue doubled. How was their overall year?',
    correctAnswer: 'Profitable overall.',
    options: ['Bankrupt.', 'Profitable overall.', 'No change.', 'Closed down.'],
    level: 'B2'
  },
  {
    title: 'Speaking Warmup',
    category: 'Speaking',
    englishText: 'Choose the most natural response: "How are you doing?"',
    correctAnswer: 'I am doing well.',
    options: ['I am doing well.', 'It is a book.', 'At 7 PM.', 'Blue'],
    level: 'A2'
  },
  {
    title: 'Polite Refusal',
    category: 'Speaking',
    englishText: 'How would you politely decline a dinner invitation?',
    correctAnswer: 'I would love to, but I have plans tonight.',
    options: ['No, I hate food.', 'I would love to, but I have plans tonight.', 'Go away.', 'Yes, whatever.'],
    level: 'B1'
  },
  {
    title: 'Offering Help',
    category: 'Speaking',
    englishText: 'Choose the best response: "Could you give me a hand with this box?"',
    correctAnswer: 'Sure, let me help you.',
    options: ['No way.', 'Sure, let me help you.', 'That is a heavy box.', 'Goodbye.'],
    level: 'A2'
  },
  {
    title: 'Asking Clarification',
    category: 'Speaking',
    englishText: 'How do you ask for clarification during a presentation?',
    correctAnswer: 'Could you please elaborate on that point?',
    options: ['What?', 'Could you please elaborate on that point?', 'Stop talking.', 'I am bored.'],
    level: 'B2'
  }
];

const users = [
  { fullName: 'Minh Tran', email: 'student@demo.com', role: 'student', totalScore: 1280, totalQuizzes: 15, totalQuestions: 150, correctQuestions: 125 },
  { fullName: 'Linh Nguyen', email: 'linh@demo.com', role: 'student', totalScore: 1175, totalQuizzes: 12, totalQuestions: 130, correctQuestions: 104 },
  { fullName: 'Bao Pham', email: 'bao@demo.com', role: 'student', totalScore: 1040, totalQuizzes: 10, totalQuestions: 110, correctQuestions: 88 },
  { fullName: 'Admin Teacher', email: 'admin@demo.com', role: 'admin', totalScore: 620, totalQuizzes: 6, totalQuestions: 60, correctQuestions: 54 }
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
