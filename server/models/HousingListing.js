const mongoose = require('mongoose');

const housingSchema = new mongoose.Schema(
  {
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    rentRmbPerMonth: { type: Number, required: true },
    roomType: { type: String, default: 'Roommate Needed' },
    city: { type: String, default: '' },
    location: { type: String, default: '' },
    universityProximity: { type: String, default: '' },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HousingListing', housingSchema);