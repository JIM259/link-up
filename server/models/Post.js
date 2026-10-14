const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    category: { type: String, default: 'General' },
    location: { type: String, default: '' },
    images: { type: [String], default: [] },
    tags: { type: [String], default: [] },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    commentsCount: { type: Number, default: 0 },
    aiAnalysis: {
      intent: String,
      urgency: String,
      extractedNeed: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);