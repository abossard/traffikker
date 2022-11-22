// import express.js
const express = require('express');

// create express app
const app = express();

// define a simple route
app.get('*', (req, res) => {
    // return hello world
    res.send('Hello World');
    // get original url
    console.log(req.url);
    console.log(req.originalUrl);
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
