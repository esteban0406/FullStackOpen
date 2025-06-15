const mongoose = require('mongoose')
const Book = require('./Book')


const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 4
  },
  born: {
    type: Number,
  },
  Books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book'
    }
  ]
})


module.exports = mongoose.model('Author', schema)