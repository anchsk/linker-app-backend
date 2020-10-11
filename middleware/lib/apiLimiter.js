const rateLimit = require('express-rate-limit')

const apiLimiter = rateLimit({
 windowMs: 60 * 60 * 1000, // 60 minutes
 max: 30, // 30 requests
 message: 'Too many requests, please try later',
}) 

module.exports = apiLimiter