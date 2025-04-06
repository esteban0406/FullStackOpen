const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs)
})

blogRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.save()
  response.status(201).json(savedBlog)
})

blogRouter.delete('/:id', async (request, response) => {
  const blog = new Blog(request.body)
  const savedBlog = await blog.deleteOne()
  response.json(savedBlog)
})

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params
  const updatedData = request.body

  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedData, { new: true, runValidators: true })
  updatedBlog?   response.json(updatedBlog)   :    response.status(404).json({ error: 'Blog not found' })

})


module.exports = blogRouter
