const express = require("express");
const morgan = require("morgan");

const app = express();
app.use(express.static('dist'))
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
  response.json(people);
});

app.get("/api/people/:id", (request, response) => {
  const id = request.params.id;
  const note = people.find((note) => note.id === id);

  note ? response.json(note) : response.status(404).end();
});

app.delete("/api/people/:id", (request, response) => {
  const id = request.params.id;
  people = people.filter((note) => note.id !== id);

  response.status(204).end();
});

const generateId = () => {
  const maxId = Math.random() * 1000000;
  return String(maxId + 1);
};

app.post("/api/people", (request, response) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  !body.name || !body.number
    ? response.status(400).json({ error: "content missing" })
    : people.find((person) => person.name === body.name)
    ? response.status(400).json({ error: "name must be unique" })
    : (people = people.concat(person));
  response.json(person);
  app.use(morgan("dev"));
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

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
