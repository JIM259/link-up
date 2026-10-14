const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json({ success: true, events });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ success: false, message: 'Event not found' });

    const joined = event.participants.some((id) => id.toString() === req.userId);
    if (joined) event.participants.pull(req.userId);
    else event.participants.push(req.userId);
    await event.save();

    res.json({ success: true, joined: !joined });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;