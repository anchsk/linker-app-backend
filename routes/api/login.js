const loginRouter = require('express').Router()

// Require controller modules
const loginController = require('../../controllers/login.controller')


//LOGIN
// routes for /api/login
loginRouter.post('/', loginController.loginUserToDb)


module.exports = loginRouter
