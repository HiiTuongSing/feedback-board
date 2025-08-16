// controllers/feedbackController.js
const { addFeedback, getAllFeedback, editFeedback, deleteFeedback } = require('../models/feedback');

exports.createFeedback = async (req, res) => {
  const { title, message } = req.body;
  if (!title || !message) {
    return res.status(400).json({ error: 'Title & message are required!' });
  }

  try {
    const saved = await addFeedback(title, message);
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save feedback.' });
  }
};

exports.getFeedbackList = async (req, res) => {
  try {
    const list = await getAllFeedback();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch feedback.' });
  }
};

exports.updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { title, message } = req.body;

  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are both required!' });
  }

  try {
    const edited = await editFeedback(id, title, message);
    if (!edited.updated) {
      return res.status(404).json({ error: 'ID Not Found' });
    }
    res.status(200).json(edited);
  } catch (err) {
    res.status(500).json({ error: 'Failed to edit feedback.' });
  }
};

exports.removeFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await deleteFeedback(id);
    if (!deleted.deleted) {
      return res.status(404).json({ error: 'ID Not Found' });
    }
    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete feedback.' });
  }
};
