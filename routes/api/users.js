const usersRouter = require('express').Router()
const usersController = require('../../controllers/users.controller')

// USERS
// routes for /api/users

usersRouter.get('/', usersController.getAllUsers)
usersRouter.get('/:id', usersController.getUserById)
usersRouter.post('/', usersController.createNewUser)

module.exports = usersRouter