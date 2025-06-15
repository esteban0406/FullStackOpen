const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const mongoose = require('mongoose')
const { GraphQLError } = require('graphql')
mongoose.set('strictQuery', false)
require('dotenv').config()

const Book = require('./models/Book')
const Author = require('./models/Author')
const User = require('./models/User')
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

  type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

type Query {
  // ..
  me: User
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

  createUser(
    username: String!
    favoriteGenre: String!
  ): User
  login(
    username: String!
    password: String!
  ): Token

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
    addBook: async (root, args, context) => {
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
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }

      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError('Creating the book failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
            error,
          },
        })
      }

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

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError('Updating the author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      }
      
      return author
    },
    createUser: async (root, args) => {
      const user = new User({ username: args.username })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.username,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

startStandaloneServer(server, {
  listen: { port: 4000 },

  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(auth.substring(7), process.env.JWT_SECRET)
      const currentUser = await User.findById(decodedToken.id).populate(
        'friends'
      )
      return { currentUser }
    }
  },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
