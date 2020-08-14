const PORT = 3000;
const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(bodyParser.json());

const morgan = require('morgan');
server.use(morgan('dev'));

server.use((req, res, next) => {
    console.log("<___Body Logger Start___>");
    console.log(req.body);
    console.log("<___Body Logger End___>");

    next();
});

// const apiRouter = require('./api/index');
// server.use('/api', apiRouter);

const client = require('./db/client');
client.connect();

server.listen(PORT, () => {
    console.log('The server is up on port', PORT)
});