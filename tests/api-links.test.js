const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const helper = require('./test_helper')

//jest.setTimeout(3 * 60 * 1000)

let loggedUser = {}
let testLink = {}
let testCollection = {}

beforeAll(async () => {
  // Reset database
  await api.post('/api/testing/reset')

  // Add users
  await helper.createUserInDb('First User', 'firstuser', 'secretword')
  await helper.createUserInDb('Second User', 'seconduser', 'secret')

  // Login first user
  const firstUser = await api.post('/api/login').send({
    password: 'secretword',
    username: 'firstuser',
  })

  // Set user credentials
  loggedUser = { ...firstUser.body }

  // Add test collection
  const newCollection = await api
    .post('/api/collections')
    .set({ Authorization: `bearer ${loggedUser.token}` })
    .send({ name: 'Test collection' })

  // Set testCollection
  testCollection = { ...newCollection.body, user: newCollection.body.user.id }

  /* const linkObjects = helper.initialBlogs.map((link) => new Link(link))
  const promiseArray = linkObjects.map((link) => link.save())
  await Promise.all(promiseArray) */
})

describe('user is logged in and', () => {
  test('can add new link', async () => {
    const newLink = {
      description:
        'Jest is a delightful JavaScript Testing Framework with a focus on simplicity.',
      title: 'Testing with jest',
      url: 'https://jestjs.io/',
    }
    const result = await api
      .post('/api/links')
      .set({ Authorization: `bearer ${loggedUser.token}` })
      .send(newLink)
      .expect(201)

    async function setTestLink(testlink) {
      let newLink = await { ...testlink }
      return newLink
    }
    testLink = await setTestLink({ ...result.body, user: result.body.user.id })

    expect(result.body).toHaveProperty(
      'title',
      'url',
      'description',
      'tags',
      'collections',
      'user',
      'created_at',
      'updated_at'
    )
    expect(result.body.tags).toHaveLength(0)
    expect(result.body.collections).toHaveLength(0)
    expect(result.body.user).toHaveProperty('name', 'username', 'id')
    expect(result.body.user.id).toBe(loggedUser.id)
  })

  test('can add link to collection', async () => {
    const updatedCollection = await api
      .put(`/api/collections/${testCollection.id}/links`)
      .set({ Authorization: `bearer ${loggedUser.token}` })
      .send({
        ...testCollection,
        links: [testLink.id],
      })
      .expect(200)

    expect(updatedCollection.body.links).toContain(testLink.id)
    expect(updatedCollection.body.updated_at).not.toBe(testCollection.updated_at)

    const updatedLink = await api.get(`/api/links/${testLink.id}`)
    expect(updatedLink.body.collections).toContain(testCollection.id)
  })

  test('can remove link from collection', async () => {
    const updatedCollection = await api
      .put(`/api/collections/${testCollection.id}/links`)
      .set({ Authorization: `bearer ${loggedUser.token}` })
      .send({
        ...testCollection,
        links: [],
      })
    expect(updatedCollection.body.links).not.toContain(testLink.id)
    expect(updatedCollection.body.updated_at).not.toBe(testCollection.updated_at)

    const updatedLink = await api.get(`/api/links/${testLink.id}`)
    expect(updatedLink.body.collections).not.toContain(testCollection.id)

  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
