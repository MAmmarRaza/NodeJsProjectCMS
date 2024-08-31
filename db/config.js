const mongoose = require('mongoose');
require('dotenv').config();
const connectWithRetry = () => {
  console.log('Attempting to connect to MongoDB...');

  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    console.log('Retrying in 5 seconds...');
    setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
  });
};

connectWithRetry();

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
