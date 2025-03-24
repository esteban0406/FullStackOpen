require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("dist"));
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/api/people", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/people/:id", (request, response) => {
  const id = request.params.id;
  Person.findById(id).then((person) => {
    person ? response.json(person) : response.status(404).end();
  });
});

app.delete("/api/people/:id", (request, response) => {
  Person.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
});

app.post("/api/people", (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({ error: "name or number missing" });
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.put("/api/people/:id", (request, response) => {
  const id = request.params.id;
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
    id: id,
  };

  Person.findByIdAndUpdate
    ? Person.findByIdAndUpdate(id, person, { new: true }).then((updatedPerson) => {
        response.json(updatedPerson);
      })
    : response.status(404).end();
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${people.length} people</p><p>${new Date()}</p>`
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

// this has to be the last loaded middleware, also all the routes should be registered before this!
app.use(errorHandler)