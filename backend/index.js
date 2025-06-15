const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
require('dotenv').config()

const Book = require('./models/Book')
const Author = require('./models/Author')
const jwt = require('jsonwebtoken')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

/*let authors = [
  {
    name: 'Robert Martin',
    id: 'afa51ab0-344d-11e9-a414-719c6709cf3e',
    born: 1952,
  },
  {
    name: 'Martin Fowler',
    id: 'afa5b6f0-344d-11e9-a414-719c6709cf3e',
    born: 1963,
  },
  {
    name: 'Fyodor Dostoevsky',
    id: 'afa5b6f1-344d-11e9-a414-719c6709cf3e',
    born: 1821,
  },
  {
    name: 'Joshua Kerievsky', // birthyear not known
    id: 'afa5b6f2-344d-11e9-a414-719c6709cf3e',
  },
  {
    name: 'Sandi Metz', // birthyear not known
    id: 'afa5b6f3-344d-11e9-a414-719c6709cf3e',
  },
]

let books = [
  {
    title: 'Clean Code',
    published: 2008,
    author: 'Robert Martin',
    id: 'afa5b6f4-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Agile software development',
    published: 2002,
    author: 'Robert Martin',
    id: 'afa5b6f5-344d-11e9-a414-719c6709cf3e',
    genres: ['agile', 'patterns', 'design'],
  },
  {
    title: 'Refactoring, edition 2',
    published: 2018,
    author: 'Martin Fowler',
    id: 'afa5de00-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring'],
  },
  {
    title: 'Refactoring to patterns',
    published: 2008,
    author: 'Joshua Kerievsky',
    id: 'afa5de01-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'patterns'],
  },
  {
    title: 'Practical Object-Oriented Design, An Agile Primer Using Ruby',
    published: 2012,
    author: 'Sandi Metz',
    id: 'afa5de02-344d-11e9-a414-719c6709cf3e',
    genres: ['refactoring', 'design'],
  },
  {
    title: 'Crime and punishment',
    published: 1866,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de03-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'crime'],
  },
  {
    title: 'Demons',
    published: 1872,
    author: 'Fyodor Dostoevsky',
    id: 'afa5de04-344d-11e9-a414-719c6709cf3e',
    genres: ['classic', 'revolution'],
  },
]
  */

const typeDefs = `

  type Book {
     title: String!
     published: Int!
     author: Author!
     id: String!
     genres: [String!]!
  }
  
  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    bookCount:Int!
    authorCount:Int!
    allBooks(author:String,genre:String):[Book!]!
    allAuthors:[Author!]!
  }

  type Mutation {
  addBook(
    title: String!
     published: Int!
     author: String!
     genres: [String!]!
  ): Book

  editAuthor(
    name: String!
    setBornTo: Int!
  ): Author

  }
`

const resolvers = {
  Query: {
    bookCount: () => async () => {
      const count = await Book.countDocuments()
      return count
    },
    authorCount: () => async () => {
      const count = await Author.countDocuments()
      return count
    },
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        return await Book.find({
          author: args.author,
          genres: args.genre,
        }).populate('author')
      }
      if (args.author) {
        return await Book.find({ author: args.author }).populate('author')
      }
      if (args.genre) {
        return await Book.find({ genres: args.genre }).populate('author')
      }
      return await Book.find({}).populate('author')
    },
    allAuthors: async () => {
      return await Author.find({}).populate('Books')
    },
  },
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({ author: root._id })
    },
  },
  Mutation: {
    addBook: async (root, args) => {
      // 1. Find or create the author
      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author, Books: [] })
        await author.save()
      }

      // 2. Validate title length
      if (args.title.length < 5) {
        throw new Error('Title must be at least 5 characters long')
      }

      // 3. Create the book with the author's ObjectId
      const book = new Book({ ...args, author: author._id })
      await book.save()

      // 4. Add the book to the author's Books array and save
      author.Books = author.Books.concat(book._id)
      await author.save()

      // 5. Populate author for the return value
      return book.populate('author')
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name })
      if (!author) {
        throw new Error('Author not found')
      }
      author.born = args.setBornTo
      await author.save()
      return author
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
