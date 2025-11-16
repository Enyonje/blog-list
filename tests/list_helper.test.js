const listHelper = require('../utils/list_helper')

describe('dummy', () => {
  test('returns one', () => {
    const result = listHelper.dummy([])
    expect(result).toBe(1)
  })
})

describe('favorite blog', () => {
  const blogs = [
    { title: 'A', author: 'Evans', likes: 5 },
    { title: 'B', author: 'Evans', likes: 10 },
  ]

  test('returns blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toEqual({ title: 'B', author: 'Evans', likes: 10 })
  })
})