require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Entry = require('./models/entry')

const app = express()


//  Middleware
app.use(cors())
app.use(express.json())
app.use(express.static('build'))

app.use(morgan('tiny', {
  skip: (req, res) => req.method === "POST"
}))

morgan.token('postdata', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata', {
  skip: (req, res) => req.method !== "POST"
}))


// Routes 
app.get('/info', (request, response) => {
  const totalEntries = `<p>Phonebook has info for ${entries.length} people</p>`
  const res = `${totalEntries} ${new Date()}`

  response.status(200).send(res)
})

app.get('/api/persons', (request, response, next) => {
  Entry
    .find({})
    .then(returnedEntries => {
    console.log('entries', returnedEntries)
    response.json(returnedEntries)
  })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Entry
    .findById(id)
    .then(returnedEntry => {
      if (returnedEntry) {
        response.json(returnedEntry)
      } else {
        response.status(404).end()
      }
  })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log('body', request.body)

  if (!body.name || !body.number) {
    return response.status(400).send({ error: 'name or number missing' })
  }

  const entry = new Entry({
    name: body.name,
    number: body.number
  })

  entry
    .save()
    .then(savedEntry => {
    response.json(savedEntry)
  })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Entry
    .findByIdAndRemove(id)
    .then(result => {
      response.status(204).end()
  })
    .catch(error => next(error))
})


//Middleware - handle requests with unknown endpoint
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

//Middleware - Log/handle error messages
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformed id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
