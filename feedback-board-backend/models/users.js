const db = require('../db/index')
const { v4: uuidv4 } = require('uuid')
const { hashPassword } = require('../utils/hash')

async function createUser(username, password, role){
  try{
    const id = uuidv4()
    const password_hash = await hashPassword(password)
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (id, username, password_hash, role) VALUES (?, ?, ?, ?)`,
        [id, username, password_hash, role],
        function(err){
          if(err) reject(err)
            else resolve({id, username, role})
        }
      )
    })
  }catch(err){
    throw err
  }
}

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      (err, row) => {
        if (err) reject(err);
        else resolve(row); 
      }
    );
  });
}

module.exports = { createUser, getUserByUsername }