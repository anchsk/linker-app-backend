const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
  collections: [{ ref: 'Collection', type: mongoose.Schema.Types.ObjectId }],
  liked: [
    {
      ref: 'Link',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  links: [{ ref: 'Link', type: mongoose.Schema.Types.ObjectId }],
  name: String,
  passwordHash: String,
  username: { minlength: 3, required: true, type: String, unique: true },
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v

    delete returnedObject.passwordHash
  },
})

userSchema.plugin(uniqueValidator)

const User = mongoose.model('User', userSchema)

module.exports = User
