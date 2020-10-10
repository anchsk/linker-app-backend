const errorHandler = (error, req, res, next) => {
  //console.log('errorHandler(start):')
  if (process.env.NODE_ENV === 'development') {
    console.error({ error })
  }
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'invalid token' })
  } else if (error.name === 'TypeError') {
    return res.status(400).json({ error: error.message })
  }
  //console.log('errorHandler > next(error)')
  next(error)
}

module.exports = errorHandler
