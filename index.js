require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login') // ✅ Make sure this filename is correct
const middleware = require('./utils/middleware')

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor) // ✅ Must come after app is defined

// Routes
app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// MongoDB connection
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/bloglist'
mongoose.connect(mongoUrl, { family: 4 })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error))

module.exports = app