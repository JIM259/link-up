const express = require('express');
const router = express.Router();
const Housing = require('../models/HousingListing');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, async (req, res) => {
  try {
    const listings = await Housing.find()
      .populate('host', 'fullName avatar')
      .sort({ createdAt: -1 });
    res.json({ success: true, listings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const listing = await Housing.create({ ...req.body, host: req.userId });
    const populated = await listing.populate('host', 'fullName avatar');
    res.status(201).json({ success: true, listing: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;