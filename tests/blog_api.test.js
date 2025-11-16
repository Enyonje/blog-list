const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../index')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

let token = ''

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('securepass', 10)
  const user = new User({ username: 'evans', name: 'Evans Nyonje', passwordHash })
  await user.save()

  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'evans', password: 'securepass' })

  token = loginResponse.body.token
}, 10000) // ✅ Extend timeout for beforeEach

test('a valid blog can be added with token', async () => {
  const newBlog = {
    title: 'Token Auth Blog',
    author: 'Evans',
    url: 'https://evans.dev/auth',
    likes: 5
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogs = await api.get('/api/blogs')
  expect(blogs.body).toHaveLength(1)
  expect(blogs.body[0].title).toBe('Token Auth Blog')
}, 10000) // ✅ Extend timeout for test

test('blog creation fails with 401 if token is missing', async () => {
  const newBlog = {
    title: 'Unauthorized Blog',
    author: 'Evans',
    url: 'https://evans.dev/noauth',
    likes: 3
  }

  const result = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(401)

  expect(result.body.error).toContain('Token missing or invalid')

  const blogs = await api.get('/api/blogs')
  expect(blogs.body).toHaveLength(0)
}, 10000)

afterAll(async () => {
  await mongoose.connection.close()
})