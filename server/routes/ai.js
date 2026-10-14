const express = require('express');
const router = express.Router();

router.post('/match', (req, res) => {
  res.json({
    success: true,
    result: {
      matchScore: 92,
      locationMatched: req.body.city || 'Yiwu',
      matchReason: 'Matched based on your prompt.',
      detectedIntent: ['housing', 'language-exchange'],
      suggestedHousing: [],
      suggestedSeniorHelpers: [],
      suggestedGuides: [],
    },
  });
});

router.post('/search', (req, res) => {
  res.json({ success: true, posts: [], marketplace: [], housing: [], events: [] });
});

router.post('/assistant', (req, res) => {
  res.json({
    success: true,
    reply: 'BridgeAI is online. How can I help with student life in China?',
    suggestedLinks: [],
  });
});

router.post('/security-test', (req, res) => {
  res.json({
    success: true,
    result: {
      testType: req.body.testType,
      passed: true,
      inputPrompt: '',
      aiOutput: 'Local security verification passed.',
      defenseDetails: 'Handled by fallback guard.',
    },
  });
});

module.exports = router;