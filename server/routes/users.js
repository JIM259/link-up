const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { requireAuth } = require('../middleware/auth');

// GET all users — optional auth (public directory)
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Block a user — requires auth
router.post('/block', requireAuth, async (req, res) => {
  try {
    const { targetUserId } = req.body;
    if (!targetUserId) {
      return res.status(400).json({ success: false, message: 'Missing targetUserId' });
    }

    const me = await User.findById(req.userId);
    if (!me) return res.status(404).json({ success: false, message: 'User not found' });

    const isBlocked = me.blockedUserIds.some((id) => id.toString() === targetUserId);

    if (isBlocked) {
      me.blockedUserIds.pull(targetUserId);
    } else {
      me.blockedUserIds.push(targetUserId);
    }

    await me.save();

    res.json({
      success: true,
      isBlocked: !isBlocked,
      blockedUserIds: me.blockedUserIds.map((id) => id.toString()),
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;