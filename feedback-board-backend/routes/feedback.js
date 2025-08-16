// routes/feedbackRoutes.js
const express = require('express');
const router = express.Router();
const {
  createFeedback,
  getFeedbackList,
  updateFeedback,
  removeFeedback,
} = require('../controllers/feedbackController');

router.post('/', createFeedback);
router.get('/', getFeedbackList);
router.put('/:id', updateFeedback);
router.delete('/:id', removeFeedback);

module.exports = router;
