const apiLimiter = require('./lib/apiLimiter')
const auth = require('./lib/auth')
const errorHandler = require('./lib/errorHandler')
const requestLogger = require('./lib/requestLogger')
const tokenExtractor = require('./lib/tokenExtractor')
const unknownEndpoint = require('./lib/unknownEndpoint')

module.exports = {
  apiLimiter,
  auth,
  errorHandler,
  requestLogger,
  tokenExtractor,
  unknownEndpoint,
}
