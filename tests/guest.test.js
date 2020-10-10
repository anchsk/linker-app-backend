const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Link = require('../models/link')

const api = supertest(app)

let linkId = null

beforeAll(async () => {
  // Reset database
  await api.post('/api/testing/reset')

  const link = new Link({
    likes: 5,
    title: 'Webpack for Static Sites',
    url: 'https://medium.com/riow/webpack-for-static-sites-9cbfd8363abb',
  })
  const savedLink = await link.save()
  linkId = savedLink._id.toString()
})

describe('user is not logged in and', () => {
  test('can get all links', async () => {
    const res = await api
      .get('/api/links')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res.body).toHaveLength(1)
  })
  test('fails to add new link', async () => {
    const newLink = {
      author: 'Someone wrote it',
      title: 'Jest is awesome',
      url: 'https://jestjs.io/',
    }
    const res = await api.post('/api/links').send(newLink).expect(401)
    const allLinks = await Link.find({})
    expect(res.body.error).toContain('invalid token')
    expect(allLinks).toHaveLength(1)
  })

  test('fails to delete blog', async () => {
    const res = await api.delete(`/api/links/${linkId}`).expect(401)

    expect(res.body.error).toContain('invalid token')

    const links = await Link.find({})
    expect(links).toHaveLength(1)
  })

  test('fails to add like', async () => {
    const res = await api.put(`/api/links/${linkId}`).send({}).expect(401)
    expect(res.body.error).toContain('invalid token')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
