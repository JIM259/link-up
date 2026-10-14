const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/ser');

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password, username, university, city, role, bio, nativeLanguages, learningLanguages } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Please fill all required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'An account with that email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      fullName, email, password: hashedPassword, username: username || email.split('@')[0],
      university, city, role, bio,
      nativeLanguages: nativeLanguages || [],
      learningLanguages: learningLanguages || [],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username || email)}`,
    });

    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      user: {
        id: user._id, fullName: user.fullName, email: user.email, username: user.username,
        university: user.university, city: user.city, role: user.role, bio: user.bio,
        avatar: user.avatar, nativeLanguages: user.nativeLanguages,
        learningLanguages: user.learningLanguages, reputationScore: user.reputationScore,
        interests: user.interests, isVerified: user.isVerified, blockedUserIds: [],
      },
      token,
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ message: 'No account found with that email' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.json({
      user: {
        id: user._id, fullName: user.fullName, email: user.email, username: user.username,
        university: user.university, city: user.city, role: user.role, bio: user.bio,
        avatar: user.avatar, nativeLanguages: user.nativeLanguages,
        learningLanguages: user.learningLanguages, reputationScore: user.reputationScore,
        interests: user.interests, isVerified: user.isVerified, blockedUserIds: [],
      },
      token,
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;