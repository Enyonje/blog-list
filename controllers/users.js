const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

// GET: List all users with their blogs
usersRouter.get('/', async (req, res) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1
  })
  res.json(users)
})

// POST: Create a new user
usersRouter.post('/', async (req, res) => {
  const { username, name, password } = req.body

  // Validate username and password
  if (!username || username.length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long' })
  }

  if (!password || password.length < 3) {
    return res.status(400).json({ error: 'Password must be at least 3 characters long' })
  }

  // Check for uniqueness
  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return res.status(400).json({ error: 'Username must be unique' })
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()
  res.status(201).json(savedUser)
})

module.exports = usersRouter