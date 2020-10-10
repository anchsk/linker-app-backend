const linksRouter = require('express').Router()
const middleware = require('../../middleware/index')

// Require controller modules
const linksController = require('../../controllers/links.controller')


//LINKS
// routes for /api/links
// if req.method !== GET
linksRouter.use(middleware.auth)

linksRouter.get('/', linksController.getAllLinks)
linksRouter.get('/:id', linksController.getLinkById)
linksRouter.post('/', linksController.createNewLink)
linksRouter.put('/:id', linksController.updateLink)
linksRouter.delete('/:id', linksController.deleteLink)




module.exports = linksRouter
