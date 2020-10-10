const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const tagSchema = new mongoose.Schema({
  links: [
    {
      ref: 'Link',
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  tagname: { type: String, unique: true },
})

tagSchema.plugin(uniqueValidator)

tagSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Tag = mongoose.model('Tag', tagSchema)

module.exports = Tag
