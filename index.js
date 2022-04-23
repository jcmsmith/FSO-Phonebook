const express = require('express');
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
  const maxId = 
  ( entries.length > 0 )
  ? Math.max(...entries.map(e => e.id)) 
  : 0

  return maxId + 1
}


/* json-parser, express middleware that takes the JSON data of request and transforms it into JS object before attaching it to request.body */
app.use(express.json())

app.get('/', (request, response) => {
  console.log(request.headers)

  response.send('<h1>Hello world!</h1>')
})

app.get('/api/persons', (request, response) => {
  console.log(request.headers)

  response.json(entries)
})

app.get('/api/persons/:id', (request, response) => {
  console.log(request.headers)

  const id = Number(request.params.id)
  const entry = entries.find(entry => entry.id === id)
  console.log('Requesting entry', id, entry)

  if (entry) {
      response.json(entry)
  } else {
      response.statusMessage = `Entry with id ${id} not found!`
      response.status(404).end()
  }
})

app.post('/api/persons', (request, response) => {
  console.log(request.headers)

  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }

  console.log("adding new entry", body)

  const entry = {
    "id": generateId(),
    name: body.name,
    number: body.number
  }

  entries = entries.concat(entry)
  
  response.json(entry)
})

app.delete('/api/persons/:id', (request, response) => {
  console.log(request.headers)

  const id = Number(request.params.id)
  console.log('deleting entry', id)
  
  entries = entries.filter(entry => entry.id !== id)

  response.status(204).end()
})

const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)

