const Link = require('../models/link')
const User = require('../models/user')
const Collection = require('../models/collection')

const validator = require('validator')

const getAllLinks = async (req, res, next) => {
  const fetchedLinks = await Link.find({})
    .limit(5)
    .sort({ created_at: -1 })
    .populate('user', {
      name: 1,
      username: 1,
    })
    .populate('tags', { id: 1, tagname: 1 })
  res.status(200).json(
    fetchedLinks.map((link) => link.toJSON())
    /*  fetchedLinks.sort((a, b) => b.likes - a.likes).map((link) => link.toJSON()) */
  )
}

const getLinkById = async (req, res, next) => {
  const link = await Link.findById(req.params.id)
    .populate('tags')
    .populate('user')
  res.status(200).json(link.toJSON())

}

const createNewLink = async (req, res, next) => {
  /* VALIDATION */
  if (
    !validator.isURL(req.body.url, {
      protocols: ['http', 'https'],
      require_protocol: true,
    })
  ) {
    return res.status(400).json({ error: 'url is not valid' })
  }

  if (!req.body.title || !req.body.url) {
    return res.status(400).send({ error: 'missing fields' })
  }
  /* END - VALIDATION */

  const user = await User.findById(req.user.id)

  const link = new Link({
    created_at: new Date(),
    description: req.body.description || '',
    likes: req.body.likes || 0,
    tags: req.body.tags,
    title: req.body.title,
    updated_at: new Date(),
    url: req.body.url,
    user: user._id,
  })

  const newLink = await link.save()

  user.links = user.links.concat(newLink._id)
  await user.save()

  const linkToReturn = await newLink
    .populate('user', { name: 1, username: 1 })
    .populate('tags', { tagname: 1 })
    .execPopulate()

  res.status(201).json(linkToReturn)
}

/* {
        $inc: { likes: 1 },
      },
      { new: true } */

const updateLink = async (req, res, next) => {
  const linkToUpdate = await Link.findById(req.params.id)

  if (linkToUpdate.user.toString() === req.user.id) {
    const updatedLink = await Link.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_at: new Date() },
      {
        new: true,
      }
    )
    res.json(updatedLink)
  } else {
    res.status(401).send("User can't modify other users links")
  }
}

const deleteLink = async (req, res, next) => {
  const link = await Link.findById(req.params.id)

  if (link.user.toString() === req.user.id) {
    // Remove link
    await Link.findByIdAndRemove(req.params.id)

    // Remove references from Collections
    await Collection.updateMany(
      {
        links: {
          $in: req.params.id,
        },
      },
      {
        $pull: {
          links: req.params.id,
        },
      }
    )

    // Remove references from User
    await User.findByIdAndUpdate(req.user.id, {
      $pull: {
        links: req.params.id,
      },
    })

    res.status(204).end()
  } else {
    res.status(401).send("User can't delete other users links")
  }
}

module.exports = {
  createNewLink,
  deleteLink,
  getAllLinks,
  getLinkById,
  updateLink,
}
