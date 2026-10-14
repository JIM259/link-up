const express = require('express');
const router = express.Router();
const Channel = require('../models/UniversityChannel');
const CampusPost = require('../models/CampusPost');
const { requireAuth } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const channels = await Channel.find();
    const channelsWithPosts = await Promise.all(
      channels.map(async (c) => {
        const posts = await CampusPost.find({ channel: c._id })
          .populate('author', 'fullName avatar university isVerified');
        return { ...c.toObject(), posts };
      })
    );
    res.json({ success: true, channels: channelsWithPosts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/join', requireAuth, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ success: false });
    const joined = channel.members.some((id) => id.toString() === req.userId);
    if (joined) channel.members.pull(req.userId);
    else channel.members.push(req.userId);
    await channel.save();
    res.json({ success: true, isJoined: !joined, memberCount: channel.members.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/:id/posts', requireAuth, async (req, res) => {
  try {
    const { content, type } = req.body;
    const post = await CampusPost.create({
      channel: req.params.id,
      author: req.userId,
      content,
      type,
    });
    const populated = await post.populate('author', 'fullName avatar university isVerified');
    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;