const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    chineseName: { type: String, default: '' },
    badgeCode: { type: String, default: '' },
    city: { type: String, default: '' },
    description: { type: String, default: '' },
    bannerImage: { type: String, default: '' },
    topics: { type: [String], default: [] },
    isOfficialPartner: { type: Boolean, default: false },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('UniversityChannel', channelSchema);