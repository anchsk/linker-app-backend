const logger = require('../../utils/logger')
const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {
  if (req.method !== 'GET') {
    logger.info('authenticating user...')
    const decodedToken = jwt.verify(req.token, process.env.SECRET)
    if (!req.token || !decodedToken.id) {
      return res.status(401).json({ error: 'token missing or invalid' })
    } else {
      req.user = decodedToken
      logger.info('authUser(req.user):', req.user)
    }
  }
  if (req.method === 'GET') {
    logger.info('No need for authentication')
  }
  next()
}

module.exports = auth
