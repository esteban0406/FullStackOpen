const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const middleware = require('../utils/middleware')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1 })
  response.json(blogs)
})

blogRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user

  if (!user) {
    return response.status(404).json({ error: 'User not found' })
  }

  const blog = new Blog({
    ...request.body,
    user: user._id,
    author: user.username,
  })

  const savedBlog = await blog.save()
  user.Blogs = user.Blogs.concat(savedBlog._id)
  await user.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const user = request.user
    if (!user) {
      return response.status(404).json({ error: 'User not found' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    if (blog.user.toString() !== user._id.toString()) {
      return response.status(401).json({ error: 'Unauthorized' })
    }

    await blog.deleteOne()
    response.status(204).end()
  }
)

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const updatedData = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, {
    new: true,
    runValidators: true,
  })
  updatedBlog
    ? response.json(updatedBlog)
    : response.status(404).json({ error: 'Blog not found' })
})

module.exports = blogRouter
