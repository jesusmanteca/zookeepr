const express = require('express')
const fs = require('fs');
const path = require('path');
//require the data in order to create a route
const { animals } = require('./data/animals');


const PORT = process.env.PORT || 3001;
//instantiates the server so that we can later chain on methods to the Express.js server
const app = express();
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// instead of handling the filter functionality inside the .get() callback, we're going to break it out into its own function
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    // Note that we save the animalsArray as filteredResults here:
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
      // Save personalityTraits as a dedicated array.
      // If personalityTraits is a string, place it into a new array and save.
      if (typeof query.personalityTraits === 'string') {
        personalityTraitsArray = [query.personalityTraits];
      } else {
        personalityTraitsArray = query.personalityTraits;
      }
      // Loop through each trait in the personalityTraits array:
      personalityTraitsArray.forEach(trait => {
        // Check the trait against each animal in the filteredResults array.
        // Remember, it is initially a copy of the animalsArray, but here we're updating it for each trait in the .forEach() loop.
        // For each trait being targeted by the filter, the filteredResults array will then contain only the entries that contain the trait, so at the end we'll have an array of animals that have every one of the traits when the .forEach() loop is finished.
        filteredResults = filteredResults.filter(
          animal => animal.personalityTraits.indexOf(trait) !== -1
        );
      });
    }
    if (query.diet) {
      filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
      filteredResults = filteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
      filteredResults = filteredResults.filter(animal => animal.name === query.name);
    }
    // return the filtered results:
    return filteredResults;
  }
// this function called findById() takes in the id and array of animals and returns a single animal object
function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
}
//a function that accepts the POST route's req.body value and the array we want to add the data to
function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    // this to write to the animals.json file using fs
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
      );
  
    return animal;
}

// take our new animal data from req.body and check if each key not only exists, but that it is also the right type of data
function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== 'string') {
      return false;
    }
    if (!animal.species || typeof animal.species !== 'string') {
      return false;
    }
    if (!animal.diet || typeof animal.diet !== 'string') {
      return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
      return false;
    }
    return true;
  }


// GET ROUTES
app.get('/api/animals', (req, res) => {
    // res.send('<h1>Hello!</h1>');
    // res.json(animals);
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});

// POST ROUTES
app.post('/api/animals', (req, res) => {
    // req.body is where our incoming content will be but first we give it an id and validate it to make sure it fits our style

    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // add animal to json file and animals array in this function
    // if any data in req.body is incorrect, send 400 error back - This indicates to the user that our server doesn't have any problems and we can understand their request, but they incorrectly made the request and we can't allow it to work.
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal is not properly formatted. You gotta feed the right info, friend.');
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

// method to make our server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});