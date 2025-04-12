const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { required: [true, 'username` to be unique'], type: String, unique: true, minLenght: 3 },
  name: String,
  passwordHash: { required: [true, 'password is need it'], type: String },
  Blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
    },
  ],
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
    // the passwordHash should not be revealed
    delete returnedObject.passwordHash
  },
})

const User = mongoose.model('User', userSchema)

module.exports = User
