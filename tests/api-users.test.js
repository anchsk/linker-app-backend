const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')

const api = supertest(app)

const User = require('../models/user')

beforeAll(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('secretword', 10)
  const user = new User({
    name: 'First User',
    passwordHash,
    username: 'firstuser',
  })

  await user.save()
})

describe('when there is one user in db', () => {
  test('another user can be created', async () => {
    const usersAtStart = await User.find({})

    const newUser = {
      name: 'Second User',
      password: 'seconduser',
      username: 'seconduser',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    expect(result.body).toHaveProperty(
      'links',
      'collections',
      'username',
      'name',
      'id'
    )
    expect(typeof result.body.id).toBe('string')
    expect(result.body).not.toHaveProperty('password', 'passwordHash')

    const usersAtEnd = await User.find({})
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)
  })

  test("new user's username should be unique", async () => {
    const newUser = {
      name: '',
      password: 'whatever',
      username: 'firstuser',
    }

    const result = await api.post('/api/users').send(newUser).expect(400)

    expect(result.body.error).toContain('expected `username` to be unique')
  })

  test('users.get returns an array of users with populated fields', async () => {
    const res = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
    expect(res.body).toHaveLength(2)
    res.body.forEach((user) => {
      expect(user).toHaveProperty(
        'name',
        'username',
        'id',
        'links',
        'collections',
        'liked'
      )
      expect(user).not.toHaveProperty('password', 'passwordHash')
      expect(typeof user.id).toBe('string')
    })
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
