const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  platform: String,
  videoUrl: String,
  description: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Video', videoSchema);
