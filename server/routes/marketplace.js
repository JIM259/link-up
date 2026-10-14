const express = require('express');
const router = express.Router();
const Listing = require('../models/MarketplaceListing');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const listings = await Listing.find()
      .populate('seller', 'fullName avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const listing = await Listing.create({ ...req.body, seller: req.userId });
    const populated = await listing.populate('seller', 'fullName avatar');
    res.status(201).json({ success: true, listing: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;