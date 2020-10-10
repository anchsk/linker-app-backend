const mongoose = require('mongoose')

const collectionSchema = new mongoose.Schema({
  created_at: {
    default: new Date(),
    type: Date,
  },
  description: {
    type: String
  },
  links: [
    {
      ref: 'Link',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  name: {
    minlength: 3,
    required: true,
    type: String,
  },
  updated_at: {
    default: new Date(),
    type: Date,
  },
  user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
})

collectionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Collection', collectionSchema)
