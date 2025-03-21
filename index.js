const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

let persons = [
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

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  const note = persons.find((note) => note.id === id);

  note ? response.json(note) : response.status(404).end();
});

app.delete("/api/persons/:id", (request, response) => {
  const id = request.params.id;
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = Math.random() * 1000000;
  return String(maxId + 1);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  !body.name || !body.number
    ? response.status(400).json({ error: "content missing" })
    : persons.find((person) => person.name === body.name)
    ? response.status(400).json({ error: "name must be unique" })
    : (persons = persons.concat(person));
  response.json(person);
  app.use(morgan("dev"));
});

app.get("/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
  );
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
