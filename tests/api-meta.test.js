const mongoose = require('mongoose')
const helper = require('./test_helper')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const validUrl = 'https://github.com'
const invalidUrl = 'https://www'

let loggedUser = {}

beforeAll(async () => {
  // Reset database
  await api.post('/api/testing/reset')

  // Add user
  await helper.createUserInDb('First User', 'firstuser', 'secretword')

  // Login user
  const res = await api.post('/api/login').send({
    password: 'secretword',
    username: 'firstuser',
  })

  // Set user credentials
  loggedUser.id = res.body.id
  loggedUser.token = res.body.token
  loggedUser.username = res.body.username
  loggedUser.name = res.body.name
})

test('getMeta returns metadata for a valid url', async () => {
  const result = await api
    .post('/api/meta')
    .set({ Authorization: `bearer ${loggedUser.token}` })
    .send({ url: validUrl })
    .expect(200)

  expect(result.body).toHaveProperty('description', 'title', 'url')
  expect(result.body.title).not.toBe('')
})

test('getMeta fails with invalid url', async () => {
  const result = await api
    .post('/api/meta')
    .set({ Authorization: `bearer ${loggedUser.token}` })
    .send({ url: invalidUrl })
    .expect(400)
  expect(result).not.toHaveProperty('title')
  expect(result).toHaveProperty('error')
})

afterAll(async () => {
  await mongoose.connection.close()
})
