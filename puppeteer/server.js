'use strict';
const express = require('express');
var bodyParser = require('body-parser')

// Constants
const PORT = 4000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
})); // to support URL-encoded bodies


app.get('/', (req, res) => {
  res.send('Hello new world\n');
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
