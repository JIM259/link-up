const express = require('express');
const router = express.Router();
const Guide = require('../models/Guide');

router.get('/', async (req, res) => {
  try {
    const guides = await Guide.find().sort({ createdAt: -1 });
    res.json({ success: true, guides });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;