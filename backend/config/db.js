const mongoose = require('mongoose');

const FALLBACK_URI = 'mongodb+srv://minhdq25:minhdq25123@cluster0.mongodb.net/english_learning_app?retryWrites=true&w=majority';

async function connectDB() {
  const uri = process.env.MONGODB_URI || FALLBACK_URI;

  await mongoose.connect(uri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
