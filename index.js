require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Entry = require('./models/entry')

const app = express()


/*  Middleware */
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

app.use(morgan('tiny', {
  skip: (req, res) => req.method === "POST"
}))

morgan.token('postdata', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata', {
  skip: (req, res) => req.method !== "POST"
}))


/* Routes */
app.get('/info', (request, response) => {
  const totalEntries = `<p>Phonebook has info for ${entries.length} people</p>`
  const res = `${totalEntries} ${new Date()}`

  response.status(200).send(res)
})

app.get('/api/persons', (request, response) => {
  Entry.find({}).then(returnedEntries => {
    console.log('entries', returnedEntries)
    response.json(returnedEntries)
  })
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const entry = entries.find(entry => entry.id === id)

  if (entry) {
      response.json(entry)
  } else {
      response.statusMessage = `Entry with id ${id} not found!`
      response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log('body', request.body)

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  entry.save().then(savedEntry => {
    response.json(savedEntry)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  entries = entries.filter(entry => entry.id !== id)

  response.status(204).end()
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


