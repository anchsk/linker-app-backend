const jwt = require('jsonwebtoken')

const signToken = ({ username, id }) => {
  const token = jwt.sign({ id, username }, process.env.SECRET)
  return token
}

module.exports = { signToken }
