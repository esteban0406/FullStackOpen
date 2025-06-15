const mongoose = require('mongoose')
const Book = require('./models/Book')
const Author = require('./models/Author')
require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

async function migrateAuthors() {
  await mongoose.connect(MONGODB_URI)

  const books = await Book.find({})
  for (const book of books) {
    if (typeof book.author === 'string') {
      const author = await Author.findOne({ name: book.author })
      if (author) {
        book.author = author._id
        await book.save()
        console.log(`Updated book "${book.title}" with author ObjectId`)
      }
    }
  }
  mongoose.disconnect()
}

migrateAuthors()