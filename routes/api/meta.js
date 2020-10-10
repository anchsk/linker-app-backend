const metaRouter = require('express').Router()

// Require validation modules
const middleware = require('../../middleware/index')

// Require controller modules
const metaController = require('../../controllers/meta.controller')


//META
// routes for /meta
metaRouter.use(middleware.auth)

metaRouter.post('/', metaController.getMetaData)


module.exports = metaRouter
