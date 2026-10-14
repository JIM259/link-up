const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    category: { type: String, default: 'General' },
    image: { type: String, default: '' },
    authorName: { type: String, default: 'Link Up Team' },
    readTimeMinutes: { type: Number, default: 5 },
    upvotes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Guide', guideSchema);