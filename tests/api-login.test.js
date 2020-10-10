const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const helper = require('./test_helper')

const User = require('../models/user')

beforeAll(async () => {
  await User.deleteMany({})
  await helper.createUserInDb('First User', 'firstuser', 'secretword')
})

describe('login', () => {
  test('succeed with correct username and password', async () => {
    const userToLogin = {
      password: 'secretword',
      username: 'firstuser',
    }

    const res = await api.post('/api/login').send(userToLogin).expect(200)
    expect(res.body).toHaveProperty('token', 'username', 'user', 'id')
  })

  test('fails with wrong credentials', async () => {
    const userToLogin = {
      password: 'wrongpassword',
      username: 'firstuser',
    }

    const res = await api.post('/api/login').send(userToLogin).expect(401)
    expect(res.body.error).toContain('Invalid username or password')
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
