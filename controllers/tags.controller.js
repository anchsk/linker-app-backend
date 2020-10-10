const Tag = require('../models/tag')

const getAllTags = async (req, res, next) => {
  const allTags = await Tag.find({})
  res.status(200).json(allTags.map((tag) => tag.toJSON()))
}

const getTagById = async (req, res, next) => {
  const foundTag = await Tag.findById(req.params.id).populate({
    path: 'links',
    populate: { path: 'tags' },
  })
  if (foundTag) {
    res.status(200).json(foundTag)
  } else {
    res.status(404).end()
  }
}

const createNewTag = async (req, res, next) => {
  const tag = new Tag({
    tagname: req.body.tagname,
  })
  const tagToReturn = await tag.save()

  res.json(tagToReturn)
}

const deleteTag = async (req, res, next) => {}

module.exports = {
  createNewTag,
  deleteTag,
  getAllTags,
  getTagById,
}
