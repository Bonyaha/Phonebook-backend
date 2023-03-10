const express = require('express');
const morgan = require('morgan');
const app = express();
app.use(express.json());

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(morgan(':url :method :body'));

const cors = require('cors');
app.use(cors());

app.use(express.static('build'));

const generateId = () => {
  const id = Math.floor(Math.random() * 9999);
  return id;
};
let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456',
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello, pussy!</h1>');
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(404).json({
      error: 'fill in all info(name and number) please',
    });
  }
  if (persons.find((p) => p.name === body.name)) {
    return response.status(404).json({ error: 'name must be unique' });
  }
  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };
  persons = persons.concat(person);
  response.json(person);
});

app.get('/api/persons/', (request, response) => response.json(persons));

app.get('/api/persons/:id', (request, response) => {
  let id = Number(request.params.id);
  const note = persons.find((note) => note.id === id);
  if (note) {
    response.json(note);
  } else {
    response.status(404);
    response.send('<h1>Not found</h1>');
  }
});

app.get('/api/info', (request, response) => {
  response.send(`<h1>Phonebook has info for ${persons.length} people
  </h1>
  <p>${new Date()}</p>`);
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((note) => note.id !== id);

  response.status(204).end();
});
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
