require('dotenv').config();

const { createApp, createHttpServer } = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;
const app = createApp();
const { server } = createHttpServer(app);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  });
