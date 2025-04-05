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
      .post('/api/Blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/Blogs')

    const blogs = response.body

    const blogAdded = blogs.some(
      (blog) => blog.title === newBlog.title && blog.author === newBlog.author
    )

    assert(blogAdded)
    assert.strictEqual(response.body.length, helper.blogs.length + 1)
  })

  test('Id IS named ID', async () => {
    const response = await api.get('/api/Blogs')

    assert.ok(response.body[0].id, 'there is nnot __ID')
  })

  test('like property dont exist', async () => {
    const newBlog = {
      title: 'El juan agogo2',
      author: 'juan agogo2',
      url: 'http://www.juanagogo2.com',
    }

    await api
      .post('/api/Blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/Blogs')

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
      .post('/api/Blogs')
      .send(newBlogWithoutUrl)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    await api
      .post('/api/Blogs')
      .send(newBlogWithoutTitle)
      .expect(400)
      .expect('Content-Type', /application\/json/)
  })
})
