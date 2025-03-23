require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();
app.use(express.static("dist"));
app.use(morgan("dev"));

let people = [
  {
    id: "1",
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: "2",
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: "3",
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: "4",
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

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
  
  Person.findById(request.params.id).then((person) => {
    person.delete().then((result) => {
      response.status(204).end();
    });
  });
});

app.post("/api/people", (request, response) => {
  const body = request.body;
  const person = new Person({ 
    name: body.name,
    number:body.number,
  });

  !body.name || !body.number
    ? response.status(400).json({ error: "content missing" })
    : people.find((person) => person.name === body.name)
    ? response.status(400).json({ error: "name must be unique" })
    : person.save().then((savedPerson) => {
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

  people = people.map((person) => (person.id !== id ? person : person));
  response.json(person);
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
