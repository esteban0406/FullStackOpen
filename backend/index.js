require('dotenv').config()
const express = require('express')
const Person = require('./models/person')

const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/people', (request, response) => {
  Person.find({}).then((people) => {
    response.json(people)
  })
})

app.get('/api/people/:id', (request, response) => {
  const id = request.params.id
  Person.findById(id).then((person) => {
    person ? response.json(person) : response.status(404).end()
  })
})

app.delete('/api/people/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/people', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then((savedPerson) => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
})

app.put('/api/people/:id', (request, response) => {
  const id = request.params.id
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  }

  Person.findByIdAndUpdate
    ? Person.findByIdAndUpdate(id, person, { new: true }).then((updatedPerson) => {
      response.json(updatedPerson)
    })
    : response.status(404).end()
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
