export const demoQuestions = [
  {
    _id: 'q1',
    title: 'Vocabulary Sprint',
    category: 'Vocabulary',
    englishText: 'Choose the word closest in meaning to "rapid".',
    correctAnswer: 'fast',
    options: ['late', 'fast', 'quiet', 'heavy'],
    level: 'A2'
  },
  {
    _id: 'q2',
    title: 'Grammar Drill',
    category: 'Grammar',
    englishText: 'She ___ English every evening after dinner.',
    correctAnswer: 'studies',
    options: ['study', 'studies', 'studying', 'studied'],
    level: 'A2'
  },
  {
    _id: 'q3',
    title: 'Exam Reading',
    category: 'Reading',
    englishText: 'The train was delayed, so Minh arrived after the meeting started. What happened?',
    correctAnswer: 'He arrived late.',
    options: ['He arrived early.', 'He arrived late.', 'He cancelled.', 'He drove home.'],
    level: 'B1'
  }
];

export const demoUsers = [
  { _id: 'u1', fullName: 'Minh Tran', totalScore: 1280, streak: 14 },
  { _id: 'u2', fullName: 'Linh Nguyen', totalScore: 1175, streak: 11 },
  { _id: 'u3', fullName: 'Bao Pham', totalScore: 1040, streak: 9 },
  { _id: 'u4', fullName: 'An Hoang', totalScore: 890, streak: 7 }
];

export const demoMessages = [
  { id: 'm1', user: 'Coach', text: 'Today topic: describe your favorite place in 2 sentences.', time: '09:12' },
  { id: 'm2', user: 'Minh', text: 'My favorite place is the city library because it is quiet and bright.', time: '09:13' }
];
