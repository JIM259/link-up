const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { requireAuth, optionalAuth } = require('../middleware/auth');

// GET — public (anyone can view posts)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'fullName avatar university city isVerified')
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST — requires auth
router.post('/', requireAuth, async (req, res) => {
  try {
    const { content, category, location, images } = req.body;

    const post = await Post.create({
      author: req.userId,           // ← from middleware
      content,
      category,
      location,
      images: images || [],
    });

    const populated = await post.populate('author', 'fullName avatar university city isVerified');
    res.status(201).json({ success: true, post: populated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST like — requires auth
router.post('/:id/like', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    const userId = req.userId;
    const hasLiked = post.likes.some((id) => id.toString() === userId);

    if (hasLiked) {
      post.likes.pull(userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ success: true, isLiked: !hasLiked, likesCount: post.likes.length });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE own post — requires auth + ownership
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

    if (post.author.toString() !== req.userId) {
      return res.status(403).json({ success: false, message: 'Not your post' });
    }

    await post.deleteOne();
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;