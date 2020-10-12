const express = require('express')
const fs = require('fs');
const path = require('path');
//require the data in order to create a route
const { animals } = require('./data/animals');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');


const PORT = process.env.PORT || 3333;
//instantiates the server so that we can later chain on methods to the Express.js server
const app = express();

// middleware that instructs the server to make certain files readily available and to not gate it behind a server endpoint
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// parse incoming JSON data
app.use(express.json());



// method to make our server listen
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});