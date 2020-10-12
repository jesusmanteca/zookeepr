const router = require('express').Router();
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');
// GET ROUTES
router.get('/animals', (req, res) => {

    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    }
    res.json(results);
});
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.send(404);
    }
});
// POST ROUTES
router.post('/animals', (req, res) => {
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

module.exports  = router;