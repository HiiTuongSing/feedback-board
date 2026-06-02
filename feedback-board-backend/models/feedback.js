const db = require('../db/index');
const { v4: uuidv4 } = require('uuid');

// function to insert new feedback
async function addFeedback(title, message) {
  const id = uuidv4();

  await db.query(
    `INSERT INTO feedback (id, title, message)
     VALUES ($1, $2, $3)`,
    [id, title, message]
  );

  return { id, title, message };
}

// function to get all feedback
async function getAllFeedback() {
  const result = await db.query(
    `SELECT * FROM feedback
     ORDER BY created_at DESC`
  );

  return result.rows;
}

// function to edit feedback
async function editFeedback(id, title, message) {
  const result = await db.query(
    `UPDATE feedback
     SET title = $1,
         message = $2
     WHERE id = $3`,
    [title, message, id]
  );

  return {
    updated: result.rowCount > 0,
    id,
    title,
    message,
  };
}

// function to delete feedback
async function deleteFeedback(id) {
  const result = await db.query(
    `DELETE FROM feedback
     WHERE id = $1`,
    [id]
  );

  return {
    deleted: result.rowCount > 0,
    id,
  };
}

module.exports = {
  addFeedback,
  getAllFeedback,
  editFeedback,
  deleteFeedback,
};