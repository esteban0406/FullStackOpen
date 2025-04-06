const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')

describe('Blog API tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    const BlogObjects = helper.blogs.map((blog) => new Blog(blog))
    const promiseArray = BlogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test.only('a valid blog can be added', async () => {
    const newBlog = {
      title: 'El juan agogo',
      author: 'juan agogo',
      url: 'http://www.juan agogo.com',
      likes: 55,
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const blogs = response.body

    const blogAdded = blogs.some(
      (blog) => blog.title === newBlog.title && blog.author === newBlog.author
    )

    assert(blogAdded)
    assert.strictEqual(response.body.length, helper.blogs.length + 1)
  })

  test('Id IS named ID', async () => {
    const response = await api.get('/api/blogs')

    assert.ok(response.body[0].id, 'there is nnot __ID')
  })

  test('like property dont exist', async () => {
    const newBlog = {
      title: 'El juan agogo2',
      author: 'juan agogo2',
      url: 'http://www.juanagogo2.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const addedBlog = response.body.find(
      (b) => b.title === newBlog.title && b.author === newBlog.author
    )

    assert.ok(addedBlog, 'Blog was not found in the response')
    assert.strictEqual(addedBlog.likes, 0)
  })

  after(async () => {
    await mongoose.connection.close()
  })

  test('cant add blog without url or title', async () => {
    const newBlogWithoutUrl = {
      title: 'El juan agogo2',
      author: 'juan agogo2',
    }

    const newBlogWithoutTitle = {
      author: 'juan agogo2',
      url: 'http://www.juanagogo2.com',
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })

  test('can delete a blog', async () => {
    const newBlogWithoutUrl = {
      title: 'El juan agogo3',
      author: 'juan agogo3',
      url: 'http://www.juanagogo3.com',
      id:'123456'
    }

    await api
      .post('/api/blogs')
      .send(newBlogWithoutUrl)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    await api
      .delete('/api/blogs/123456')
      .send(newBlogWithoutUrl)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('can update a blog', async () => {
    // Create a new blog
    const newBlog = {
      title: 'El juan agogo4',
      author: 'juan agogo4',
      url: 'http://www.juanagogo4.com',
    }

    // Add the blog to the database
    const response = await api
      .post('/api/blogs') // Use lowercase 'blogs' to match the route
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    // Extract the ID of the newly created blog
    const blogToUpdate = response.body

    // Prepare updated data
    const updatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://www.updatedurl.com',
    }

    // Update the blog
    const updateResponse = await api
      .put(`/api/blogs/${blogToUpdate.id}`) // Use the correct ID
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    // Verify the update
    assert.strictEqual(updateResponse.body.title, updatedBlog.title)
    assert.strictEqual(updateResponse.body.author, updatedBlog.author)
    assert.strictEqual(updateResponse.body.url, updatedBlog.url)
  })

})
