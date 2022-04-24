const mongoose = require('mongoose')


if (process.argv.length < 3) {
    console.log('Please provide password as an argument: node mongo.js <password>')
    process.exit(1)
}

if (process.argv.length === 4 || process.argv.length >= 6) {
    console.log('Invalid number of arguments, please provide only password to view all entries or both name and number for new entry')
    process.exit(1)
}


const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)


const generateId = () => {
    const min = 10
    const max = 999999
  
    const randomId = Math.floor(Math.random() * (max - min) + min)
  
    return randomId
}

const generateNewNote = () => {
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        id: generateId(),
        name: name,
        number: number
    })

    person.save().then(result => {
        console.log('New entry added to phonebook', result)
        mongoose.connection.close()
    })
}

const returnAllNotes = () => {
    Person.find({}).then(result => {
        console.log('phonebook:')

        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}


const password = process.argv[2]

const url =
    `mongodb+srv://FSO:${password}@cluster0.t8dgj.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

if (process.argv.length === 3) {
    returnAllNotes()
} else {
    generateNewNote()
}
