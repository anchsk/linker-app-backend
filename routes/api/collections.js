const collectionsRouter = require('express').Router()
const middleware = require('../../middleware/index')

// Require controller modules
const collectionsController = require('../../controllers/collections.controller')


//COLLECTIONS
// routes for /api/collections

// if req.method !== GET
collectionsRouter.use(middleware.auth)

collectionsRouter.get('/', collectionsController.getAllCollections)
collectionsRouter.get('/:id', collectionsController.getCollectionById)
collectionsRouter.post('/', collectionsController.createNewCollection)
collectionsRouter.put('/:id', collectionsController.updateCollection)
collectionsRouter.delete('/:id', collectionsController.deleteCollection)

collectionsRouter.put('/:id/links', collectionsController.updateLinksInCollection)


module.exports = collectionsRouter