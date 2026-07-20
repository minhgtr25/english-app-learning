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
    title: 'Advanced Synonyms',
    category: 'Vocabulary',
    englishText: 'Select the antonym for the word "expand".',
    correctAnswer: 'shrink',
    options: ['grow', 'shrink', 'extend', 'broaden'],
    level: 'B1'
  },
  {
    _id: 'q3',
    title: 'Vocabulary Mastery',
    category: 'Vocabulary',
    englishText: 'Which word means "able to recover quickly from difficult conditions"?',
    correctAnswer: 'resilient',
    options: ['fragile', 'resilient', 'stubborn', 'hesitant'],
    level: 'B2'
  },
  {
    _id: 'q4',
    title: 'Grammar Drill',
    category: 'Grammar',
    englishText: 'She ___ English every evening after dinner.',
    correctAnswer: 'studies',
    options: ['study', 'studies', 'studying', 'studied'],
    level: 'A2'
  },
  {
    _id: 'q5',
    title: 'Conditionals Test',
    category: 'Grammar',
    englishText: 'If I ___ known about the weather, I would have brought an umbrella.',
    correctAnswer: 'had',
    options: ['have', 'had', 'was', 'would'],
    level: 'B1'
  },
  {
    _id: 'q6',
    title: 'Future Perfect Tense',
    category: 'Grammar',
    englishText: 'By the time we arrive at the cinema, the movie ___ already.',
    correctAnswer: 'will have started',
    options: ['starts', 'will start', 'will have started', 'started'],
    level: 'B2'
  },
  {
    _id: 'q7',
    title: 'Exam Reading 1',
    category: 'Reading',
    englishText: 'The train was delayed, so Minh arrived after the meeting started. What happened?',
    correctAnswer: 'He arrived late.',
    options: ['He arrived early.', 'He arrived late.', 'He cancelled.', 'He drove home.'],
    level: 'B1'
  },
  {
    _id: 'q8',
    title: 'Exam Reading 2',
    category: 'Reading',
    englishText: 'Despite the heavy rain, the football match continued until the final whistle. What can be inferred?',
    correctAnswer: 'Weather did not stop the match.',
    options: ['The match was cancelled.', 'Weather did not stop the match.', 'The players went home.', 'It rained inside.'],
    level: 'B1'
  },
  {
    _id: 'q9',
    title: 'Speaking Warmup',
    category: 'Speaking',
    englishText: 'Choose the most natural response: "How are you doing?"',
    correctAnswer: 'I am doing well.',
    options: ['I am doing well.', 'It is a book.', 'At 7 PM.', 'Blue'],
    level: 'A2'
  },
  {
    _id: 'q10',
    title: 'Polite Refusal',
    category: 'Speaking',
    englishText: 'How would you politely decline a dinner invitation?',
    correctAnswer: 'I would love to, but I have plans tonight.',
    options: ['No, I hate food.', 'I would love to, but I have plans tonight.', 'Go away.', 'Yes, whatever.'],
    level: 'B1'
  }
];

export const demoUsers = [
  { _id: 'u1', fullName: 'Minh Tran', totalScore: 1280, totalQuizzes: 15, totalQuestions: 150, correctQuestions: 125 },
  { _id: 'u2', fullName: 'Linh Nguyen', totalScore: 1175, totalQuizzes: 12, totalQuestions: 130, correctQuestions: 104 },
  { _id: 'u3', fullName: 'Bao Pham', totalScore: 1040, totalQuizzes: 10, totalQuestions: 110, correctQuestions: 88 },
  { _id: 'u4', fullName: 'An Hoang', totalScore: 890, totalQuizzes: 8, totalQuestions: 80, correctQuestions: 64 }
];

export const demoMessages = [
  { id: 'm1', user: 'Coach', text: 'Today topic: describe your favorite place in 2 sentences.', time: '09:12' },
  { id: 'm2', user: 'Minh', text: 'My favorite place is the city library because it is quiet and bright.', time: '09:13' }
];
