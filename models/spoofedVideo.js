const mongoose = require('mongoose');
const spoofedVideoSchema = new mongoose.Schema({
  originalFileId: String,
  userId: Number,
  processingParams: {
    resolution: String,
    crop: String,
    metadata: Object
  },
  processedAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('spoofedVideo', spoofedVideoSchema);