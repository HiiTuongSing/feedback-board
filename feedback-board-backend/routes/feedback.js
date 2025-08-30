const express = require('express');
const authenticateToken = require('../middleware/jwt');
const router = express.Router();
const {
  createFeedback,
  getFeedbackList,
  updateFeedback,
  removeFeedback,
} = require('../controllers/feedback');

router.use(authenticateToken);

router.post('/', createFeedback);
router.get('/', getFeedbackList);
router.put('/:id', updateFeedback);
router.delete('/:id', removeFeedback);

module.exports = router;
