const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../index')
const api = supertest(app)
const User = require('../models/user')
const bcrypt = require('bcryptjs')

beforeEach(async () => {
  await User.deleteMany({})
  const passwordHash = await bcrypt.hash('securepass', 10)
  const user = new User({ username: 'root', passwordHash })
  await user.save()
}, 10000)

test('fails with short username', async () => {
  const newUser = {
    username: 'ab',
    name: 'Shorty',
    password: 'validpass'
  }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('Username must be at least 3 characters')
}, 10000)

test('fails with short password', async () => {
  const newUser = {
    username: 'validuser',
    name: 'Evans',
    password: 'pw'
  }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('Password must be at least 3 characters')
}, 10000)

test('fails with duplicate username', async () => {
  const newUser = {
    username: 'root',
    name: 'Evans',
    password: 'securepass'
  }

  const result = await api.post('/api/users').send(newUser).expect(400)
  expect(result.body.error).toContain('Username must be unique')
}, 10000)

afterAll(async () => {
  await mongoose.connection.close()
})