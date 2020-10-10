const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')

//jest.setTimeout(3 * 60 * 1000)

let loggedUser = {}
let testCollection = {}

beforeAll(async () => {
  // Reset database
  await api.post('/api/testing/reset')

  // Add users
  await helper.createUserInDb('First User', 'firstuser', 'secretword')
  await helper.createUserInDb('Second User', 'seconduser', 'secret')

  // Login first user
  const res = await api.post('/api/login').send({
    password: 'secretword',
    username: 'firstuser',
  })

  // Set user credentials
  loggedUser.id = res.body.id
  loggedUser.token = res.body.token
  loggedUser.username = res.body.username
  loggedUser.name = res.body.name

  /* const linkObjects = helper.initialBlogs.map((link) => new Link(link))
  const promiseArray = linkObjects.map((link) => link.save())
  await Promise.all(promiseArray) */
})

describe('user is logged in and', () => {
  test('can add new collection', async () => {
    const newCollection = {
      name: 'Tests',
    }
    const result = await api
      .post('/api/collections')
      .set({ Authorization: `bearer ${loggedUser.token}` })
      .send(newCollection)
      .expect(201)

    testCollection = { ...result.body }

    expect(result.body).toHaveProperty('name', 'description', 'links', 'user')
    expect(result.body.links).toHaveLength(0)
    expect(result.body.description).toBe('')
    expect(result.body.user).toHaveProperty('name', 'username', 'id')
    expect(result.body.user.id).toBe(loggedUser.id)
  })

  test('can update the description', async () => {
    const updatedCollection = {
      ...testCollection,
      description: 'New description',
      user: loggedUser.id,
    }

    const result = await api
      .put(`/api/collections/${testCollection.id}`)
      .set({ Authorization: `bearer ${loggedUser.token}` })
      .send(updatedCollection)
      .expect(200)

    expect(result.body.created_at).toBe(testCollection.created_at)
    expect(result.body.updated_at).not.toBe(testCollection.updated_at)
  })

  test('can delete the collection', async () => {
    await api
      .delete(`/api/collections/${testCollection.id}`)
      .set({ Authorization: `bearer ${loggedUser.token}` })
      .send()
      .expect(204)
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
