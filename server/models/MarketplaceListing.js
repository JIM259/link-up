const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, default: 'Other' },
    priceRmb: { type: Number, required: true },
    condition: { type: String, default: 'Good' },
    location: { type: String, default: '' },
    university: { type: String, default: '' },
    images: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketplaceListing', listingSchema);