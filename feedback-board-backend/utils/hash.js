const argon2 = require('argon2')

async function hashPassword(password){
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,  // 64 MB
    timeCost: 3,          // number of iterations
    parallelism: 1        // number of threads
  })
}

async function verifyPassword(password, hash){
  return await argon2.verify(hash, password)
}

module.exports = { hashPassword, verifyPassword }