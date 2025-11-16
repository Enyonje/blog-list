const jwt = require('jsonwebtoken')

const tokenExtractor = (req, res, next) => {
  const auth = req.get('authorization')
  if (auth && auth.startsWith('Bearer ')) {
    req.token = auth.replace('Bearer ', '')
  }
  next()
}

module.exports = { tokenExtractor }
