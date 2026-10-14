const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const { requireAuth } = require('../middleware/auth');

router.post('/', requireAuth, async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: 'Missing fields' });
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [req.userId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.userId, receiverId],
      });
    }

    const message = await Message.create({
      conversation: conversation._id,
      sender: req.userId,
      receiver: receiverId,
      content,
    });

    conversation.lastMessage = message._id;
    await conversation.save();

    res.status(201).json({
      success: true,
      message,
      conversationId: conversation._id,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;