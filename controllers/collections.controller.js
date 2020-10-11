const Collection = require('../models/collection')
const User = require('../models/user')
const Link = require('../models/link')
const ObjectId = require('mongoose').Types.ObjectId

const getAllCollections = async (req, res, next) => {
  const collections = await Collection.find({}).populate('user', {
    name: 1,
    username: 1,
  })
  res.status(200).json(collections.map((collection) => collection.toJSON()))
}

const getCollectionById = async (req, res, next) => {
  const collection = await Collection.findById(req.params.id)
    .populate({
      path: 'links',
      populate: [
        { path: 'tags', select: 'tagname' },
        { path: 'user', select: 'username' },
      ],
    })
    .populate('user', { name: 1, username: 1 })

  res.status(200).json(collection)

}

const createNewCollection = async (req, res, next) => {
  if (!req.body.name) {
    return res.status(400).send('missing title')
  }

  const user = await User.findById(req.user.id)

  const collection = new Collection({
    created_at: new Date(),
    description: req.body.description || '',
    links: req.body.links,
    name: req.body.name,
    updated_at: new Date(),
    user: user._id,
  })

  const newCollection = await collection.save()

  user.collections = user.collections.concat(newCollection._id)
  await user.save()

  const collectionToReturn = await newCollection
    .populate('user', { name: 1, username: 1 })
    .populate('links')
    .execPopulate()

  res.status(201).json(collectionToReturn)
}

const updateCollection = async (req, res, next) => {
  const collectionToUpdate = await Collection.findById(req.params.id)

  if (collectionToUpdate.user.toString() !== req.user.id) {
    return res.status(401).send("User can't modify other users collections")
  }

  const updatedCollection = await Collection.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date() },
    {
      new: true,
    }
  )
  res.status(200).json(updatedCollection)
}

const deleteCollection = async (req, res, next) => {
  const user = await User.findById(req.user.id)
  const collectionToDelete = await Collection.findById(req.params.id)

  if (collectionToDelete.user.toString() !== req.user.id) {
    return res.status(401).send("Can't delete other users' collections")
  }

  await Collection.findByIdAndRemove(req.params.id)

  user.collections = user.collections.filter(
    (c) => c.toString() !== req.params.id.toString()
  )
  await user.save()

  // Remove reference to collection from Link documents
  await Link.updateMany(
    {
      collections: {
        $in: req.params.id,
      },
    },
    {
      $pull: {
        collections: collectionToDelete._id,
      },
    }
  )

  res.status(204).end()
}

// /collections/:id/links PUT
const updateLinksInCollection = async (req, res, next) => {
  const collectionToUpdate = await Collection.findById(req.params.id).exec()

  if (collectionToUpdate.user.toString() !== req.user.id) {
    res.status(401).send("Can't edit other users' collections")
  }

  const collectionId = req.params.id

  // req.body.links - [array of ids] - final links that should be in collection

  // links refs in database [array of ObjectIds]
  const currentLinksRefs = collectionToUpdate.links

  // in current links refs find links that are not present in new links refs
  let linksToRemove = currentLinksRefs.filter(
    (ref) => !req.body.links.includes(ref.toString())
  )

  // in new links refs find links that are not present in old links refs
  let linksToAdd = req.body.links.filter(
    (ref) => !currentLinksRefs.includes(new ObjectId(ref))
  )

  //console.log({ linksToAdd })
  //console.log({ linksToRemove })

  // Add reference to collection in Link documents:
  if (linksToAdd.length !== 0) {
    await Link.updateMany(
      {
        _id: {
          $in: linksToAdd,
        },
      },
      {
        $addToSet: {
          collections: new ObjectId(collectionId),
        },
      }
    )
  }

  // Remove reference to collection in Link documents:
  if (linksToRemove.length !== 0) {
    await Link.updateMany(
      {
        _id: {
          $in: linksToRemove,
        },
      },
      {
        $pull: {
          collections: new ObjectId(collectionId),
        },
      }
    )
  }

  const updatedCollection = await Collection.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updated_at: new Date() },
    { new: true }
  )
  res.status(200).json(updatedCollection)
}

module.exports = {
  createNewCollection,
  deleteCollection,
  getAllCollections,
  getCollectionById,
  updateCollection,
  updateLinksInCollection,
}
