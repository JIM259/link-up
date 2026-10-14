const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Meetup' },
    city: { type: String, default: '' },
    location: { type: String, default: '' },
    date: { type: String, default: '' },
    time: { type: String, default: '' },
    image: { type: String, default: '' },
    maxParticipants: { type: Number, default: 50 },
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Event', eventSchema);