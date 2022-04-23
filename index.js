const { request } = require('express');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


const app = express()

let entries = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


const generateId = () => {
  const min = 10
  const max = 999999

  const randomId = Math.floor(Math.random() * (max - min) + min)

  return randomId
}

/*  Middleware */
app.use(cors())
app.use(express.json())

app.use(morgan('tiny', {
  skip: (req, res) => req.method === "POST"
}))

morgan.token('postdata', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postdata', {
  skip: (req, res) => req.method !== "POST"
}))


/* Routes */
app.get('/', (request, response) => {
  response.send('<h1>Hello world!</h1>')
})

app.get('/info', (request, response) => {
  const totalEntries = `<p>Phonebook has info for ${entries.length} people</p>`
  const res = `${totalEntries} ${new Date()}`

  response.status(200).send(res)
})

app.get('/api/persons', (request, response) => {
  response.json(entries)
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

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  if (entries.find((entry) => entry.name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  if (entries.find((entry) => entry.number === body.number))
  {
    return response.status(400).json({
      error: 'number must be unique'
    })
  }

  const entry = {
    "id": generateId(),
    name: body.name,
    number: body.number
  }

  entries = entries.concat(entry)
  
  response.json(entry)
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


