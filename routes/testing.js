const router = require('express').Router()
const mongoose = require('mongoose')
const Link = require('../models/link')
const User = require('../models/user')
const Collection = require('../models/collection')
const Tag = require('../models/tag')
const testHelper = require('../tests/test_helper')
const { signToken } = require('../services/sign-token')

// /api/testing/
router.post('/reset', async (req, res) => {
  await Link.deleteMany({})
  await User.deleteMany({})
  await Collection.deleteMany({})
  await Tag.deleteMany({})

  res.status(204).end()
})

/* eslint-disable no-unused-vars */
router.post('/populate', async (req, res) => {
  const user01 = await testHelper.createUserInDb(
    'First User',
    'firstuser',
    'firstuser'
  )
  const user02 = await testHelper.createUserInDb(
    'Second User',
    'seconduser',
    'seconduser'
  )
  const user03 = await testHelper.createUserInDb('Tester', 'tester', 'tester')

  const token01 = signToken({ id: user01.id, username: user01.username })
  const token02 = signToken({ id: user02.id, username: user02.username })

  const newCollection = new Collection({
    description: 'Things I like to read',
    name: 'Recommended articles',
    user: mongoose.Types.ObjectId(user01.id),
  })
  await newCollection.save()

  const newLink = new Link({
    title: 'Make software together',
    url: 'https://github.com',
    user: mongoose.Types.ObjectId(user01.id),
  })
  await newLink.save()
})

/* eslint-enable no-unused-vars */

module.exports = router
