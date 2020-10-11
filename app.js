/* - - - SETUP - - - */
// utils
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./middleware/index')
const path = require('path')

const express = require('express')
require('express-async-errors')
const app = express()
const rateLimit = require('express-rate-limit')
//app.set('trust proxy', 1)

const cors = require('cors')
const helmet = require('helmet')

// controllers (route handlers)
const metaRouter = require('./routes/api/meta')

const collectionsRouter = require('./routes/api/collections')
const linksRouter = require('./routes/api/links')
const loginRouter = require('./routes/api/login')
const tagsRouter = require('./routes/api/tags')
const usersRouter = require('./routes/api/users')
const frontendRouter = require('./routes/frontend')

// database
const mongoose = require('mongoose')

//api limiter

 const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10, // 10 requests
  message: 'Too many requests, please try later',
}) 

/* - - - APP - - - */

// connect to database
mongoose
  .connect(config.MONGODB_URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info('connected to mongodb')
  })
  .catch((err) => {
    logger.error('error connecting to mongodb', err)
  })

const origin = {
  origin:
    process.env.NODE_ENV === 'production'
      ? 'https://linkerbeta.herokuapp.com'
      : '*',
}
app.use(cors(origin))

app.use(express.json())
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        fontSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
      },
    },
  })
)

app.use(express.static(path.join(__dirname, 'build')))

app.use(middleware.requestLogger)
app.use(middleware.tokenExtractor)

// limit requests to all routes starting with /api/
app.use('/api/', apiLimiter)
// routes
app.use('/api/meta', metaRouter)

app.use('/api/links', linksRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/tags', tagsRouter)
app.use('/api/collections', collectionsRouter)

app.use('*', frontendRouter)

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development') {
  const testingRouter = require('./routes/testing')
  app.use('/api/testing', testingRouter)
}

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

/* - - - EXPORT - - - */
module.exports = app
