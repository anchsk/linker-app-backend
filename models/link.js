const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
/* mongoose.set('useFindAndModify', false)
 */
const linkSchema = new mongoose.Schema({
  collections: [
    {
      ref: 'Collections',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],

  created_at: {
    default: Date.now,
    type: Date,
  },

  description: { maxlength: 500, type: String },

  likes: Number,

  tags: [
    {
      ref: 'Tag',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],

  title: { type: String /* , unique: true  */ },

  updated_at: {
    default: Date.now,
    type: Date,
  },

  url: String,

  user: {
    ref: 'User',
    type: mongoose.Schema.Types.ObjectId,
  },
})

linkSchema.plugin(uniqueValidator)

linkSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})
const Link = mongoose.model('Link', linkSchema)

module.exports = Link
