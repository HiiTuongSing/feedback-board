// function used by db

const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const { v4: uuidv4 } = require('uuid')

// create or open database file
const db = new sqlite3.Database(path.resolve(__dirname, 'feedback.db'));

// create table if it doesnt exist
db.serialize(() => {
    db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

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