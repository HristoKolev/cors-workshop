const express = require('express');
const bodyParser = require('body-parser');

const PORT = 5152;
const RESPONSE_DELAY = 2000;

let petIdState = 42;
// eslint-disable-next-line no-plusplus
const generateId = () => petIdState++;

const delay = (timeout) =>
  new Promise((resolve) => {
    setTimeout(resolve, timeout);
  });

const petList = [
  {
    petId: generateId(),
    petName: 'Gosho',
    age: 2,
    notes: 'White fur, very soft.',
    kind: 1,
    healthProblems: false,
    addedDate: '2022-10-31',
  },
  {
    petId: generateId(),
    petName: 'Pesho',
    age: 5,
    notes: undefined,
    kind: 2,
    healthProblems: false,
    addedDate: '2022-10-25',
  },
  {
    petId: generateId(),
    petName: 'Kenny',
    age: 1,
    notes: "Doesn't speak. Has the sniffles.",
    kind: 3,
    healthProblems: true,
    addedDate: '2022-10-27',
  },
];

const petKinds = [
  {
    displayName: 'Cat',
    value: 1,
  },
  {
    displayName: 'Dog',
    value: 2,
  },
  {
    displayName: 'Parrot',
    value: 3,
  },
];

const app = express();

app.use((req, res, next) => {
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.header('Origin'));
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE');

    res.header(
      'Access-Control-Allow-Headers',
      req.headers['access-control-request-headers']
    );

    res.status(204);
    res.end();
  } else {
    next();
  }
});

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/auth', (req, res) => {
  const { username, password } = req.body;
  if (username !== 'kotka' || password !== 'kotka') {
    res.status(400);
    res.end();
  } else {
    res.cookie('auth', '9231hu3f92hf4hfff');
    res.send('Successful login');
  }
});

app.get('/pet/kinds', async (req, res) => {
  await delay(RESPONSE_DELAY);

  res.json(petKinds);
});

app.get('/pet/all', async (req, res) => {
  await delay(RESPONSE_DELAY);

  res.json(
    petList.map((pet) => ({
      petId: pet.petId,
      petName: pet.petName,
      addedDate: pet.addedDate,
      kind: pet.kind,
    }))
  );
});

app.get('/pet/:petId', async (req, res) => {
  await delay(RESPONSE_DELAY);

  const petId = Number(req.params.petId);
  const pet = petList.find((petItem) => petItem.petId === petId);

  if (pet) {
    res.json(pet);
  } else {
    res.sendStatus(404);
  }
});

app.post('/pet', async (req, res) => {
  await delay(RESPONSE_DELAY);

  // TODO: Implement some validation.
  const pet = {
    ...req.body,
    petId: generateId(),
  };

  petList.push(pet);

  res.json(pet);
});

app.put('/pet/:petId', async (req, res) => {
  await delay(RESPONSE_DELAY);

  const petId = Number(req.params.petId);

  const petIndex = petList.findIndex((pet) => pet.petId === petId);

  if (petIndex === -1) {
    res.sendStatus(404);
    return;
  }

  // TODO: Implement some validation.
  const newPet = { ...req.body, petId };

  petList[petIndex] = newPet;

  res.json(newPet);
});

app.delete('/pet/:petId', async (req, res) => {
  await delay(RESPONSE_DELAY);

  const petId = Number(req.params.petId);

  const petIndex = petList.findIndex((pet) => pet.petId === petId);

  if (petIndex === -1) {
    res.sendStatus(404);
    return;
  }

  const pet = petList[petIndex];

  petList.splice(petIndex, 1);

  res.json(pet);
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${PORT}.`);
});
