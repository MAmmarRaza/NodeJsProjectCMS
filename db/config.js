const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://20ntucs1120:WU6TAoQiyFljPJxO@blog-cluster.bvblv9k.mongodb.net/blog", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
