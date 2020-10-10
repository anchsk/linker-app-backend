const bcrypt = require('bcrypt')

const generatePasswordHash = async (password, saltRounds) => {
  const passwordHash = await bcrypt.hash(password, saltRounds)
  return passwordHash
}

module.exports = generatePasswordHash
