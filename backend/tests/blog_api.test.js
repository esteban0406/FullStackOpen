const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')

describe('Blog API tests', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({}) // Clear users before each test

    // Create a test user
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    await user.save()

    // Add initial blogs
    const BlogObjects = helper.blogs.map((blog) => new Blog(blog))
    const promiseArray = BlogObjects.map((blog) => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    const token = await helper.getToken()

    await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test.only('a valid blog can be added with token', async () => {
    const token = await helper.getToken()
    console.log('Generated token:', token)

    const newBlog = {
      title: 'El juan agogo',
      author: 'juan agogo',
      url: 'http://www.juanagogo.com',
      likes: 55,
    }

    const postResponse = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    console.log('POST response:', postResponse.body)

    const getResponse = await api.get('/api/blogs')
    console.log('GET response:', getResponse.body)

    const blogAdded = getResponse.body.some(
      (blog) => blog.title === newBlog.title && blog.author === 'root' // Match the username of the user who created the blog
    )

    assert(blogAdded)
    assert.strictEqual(getResponse.body.length, helper.blogs.length + 1)
  })

  test('can delete a blog with token', async () => {
    const token = await helper.getToken()

    const newBlog = {
      title: 'Blog to delete',
      author: 'Author',
      url: 'http://delete.com',
    }

    const created = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    await api
      .delete(`/api/blogs/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAfter = await helper.notesInDb()
    assert(!blogsAfter.some((b) => b.id === created.body.id))
  })

  test('can update a blog with token', async () => {
    const token = await helper.getToken()

    const newBlog = {
      title: 'Blog to update',
      author: 'Author',
      url: 'http://update.com',
      likes: 5,
    }

    const created = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)

    const updatedBlog = {
      title: 'Updated Title',
      author: 'Updated Author',
      url: 'http://updatedurl.com',
      likes: 99,
    }

    const response = await api
      .put(`/api/blogs/${created.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updatedBlog)
      .expect(200)

    assert.strictEqual(response.body.title, updatedBlog.title)
    assert.strictEqual(response.body.likes, updatedBlog.likes)
  })
})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper status code and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(result.body.error.includes('`username` to be unique'))

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if username is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes('username must be at least 3 characters long')
    )

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is too short', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roberto',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes('password must be at least 3 characters long')
    )

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails if password is missing', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'roberto',
      name: 'Superuser',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert(
      result.body.error.includes('password must be at least 3 characters long')
    )

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})
