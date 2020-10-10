const User = require('../models/user')

const generatePasswordHash = require('../services/generate-password-hash')

const getAllUsers = async (req, res, next) => {
  //console.log(req.query)
  if (Object.keys(req.query).length) {
    return getUserByUsername(req, res, next)
  }
  const users = await User.find({}).populate('links', { author: 1, title: 1 })
  res.status(200).json(users.map((user) => user.toJSON()))
}

const getUserByUsername = async (req, res, next) => {
  const foundUser = await User.findOne({ username: req.query.username })
    .populate({
      options: { sort: { created_at: -1 } },
      path: 'links',
      populate: { path: 'tags' },
    })
    .populate('collections')
  if (foundUser) {
    res.status(200).json(foundUser)
  } else {
    res.status(404).end()
  }
}

const getUserById = async (req, res, next) => {
  const foundUser = await User.findById(req.params.id)
    .populate({
      options: { sort: { created_at: -1 } },
      path: 'links',
      populate: { path: 'tags' },
    })
    .populate('collections')
  if (!foundUser) {
    res.status(404).send('Not Found')
  } else {
    res.status(200).json(foundUser)
  }
}

const createNewUser = async (req, res, next) => {
  const passwordHash = await generatePasswordHash(req.body.password, 10)

  const user = new User({
    name: req.body.name,
    passwordHash,
    username: req.body.username,
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
}

module.exports = {
  createNewUser,
  getAllUsers,
  getUserById,
}
