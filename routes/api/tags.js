const tagsRouter = require('express').Router()
const tagsController = require('../../controllers/tags.controller')
const middleware = require('../../middleware/index')


// TAGS
tagsRouter.use(middleware.auth)

// routes for /api/tags

tagsRouter.get('/', tagsController.getAllTags)
tagsRouter.get('/:id', tagsController.getTagById)
tagsRouter.post('/', tagsController.createNewTag)
tagsRouter.delete('/:id', tagsController.deleteTag)

module.exports = tagsRouter