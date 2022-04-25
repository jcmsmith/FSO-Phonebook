const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose
  .connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB', error.message)
  })

const numberValidator = (num) => {
  const re1 = /^\d*$/
  const re2 = /^\d{2,3}-\d*$/
  const re3 = /^\d{3}-\d{3}-\d{4}$/

  const result = re1.test(num) || re2.test(num) || re3.test(num)
  console.log('numberValidator test results (test1, test2, test3, result):', re1.test(num), re2.test(num), re3.test(num), result)
  return result
}

const entrySchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 8,
    required: true,
    validate: [numberValidator, 'Please use one of the following formats: 12345678, 12-345678, 123-45678, or 123-456-7890']
  }
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Entry', entrySchema)