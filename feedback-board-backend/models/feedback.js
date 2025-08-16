const db = require('../db/index')
const { v4: uuidv4 } = require('uuid')

// function to insert new feedback
function addFeedback(title, message) {
  return new Promise((resolve, reject) => {
    const id = uuidv4()
    db.run(
      `INSERT INTO feedback (id, title, message) VALUES (?, ?, ?)`,
      [id, title, message],
      function(err){
        if(err) reject(err)
          else resolve({ id, title, message })
      }
    )
  })
}

// function to get all feedback
function getAllFeedback(){
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM feedback ORDER BY created_at DESC`, [], (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

// function to edit feedback
function editFeedback(id, title, message){
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE feedback SET title = ?, message = ? WHERE id = ?`,
      [title, message, id],
      function (err){
        if(err) reject(err)
          else resolve({ updated: this.changes > 0, id, title, message })
      }
    )
  })
}

// function to delete feedback
function deleteFeedback(id){
  return new Promise((resolve, reject) => {
    db.run(
      'DELETE FROM feedback WHERE id = ?',
      [id], 
      function(err){
        if(err) reject(err)
          else resolve({ deleted: this.changes > 0, id })
      }
    )
  })
}

module.exports = {addFeedback, getAllFeedback, editFeedback, deleteFeedback}