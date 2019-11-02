'use strict';
const Mercury = require('@postlight/mercury-parser');
const express = require('express');
var bodyParser = require('body-parser')

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({
  extended: true
})); // to support URL-encoded bodies


app.get('/', (req, res) => {
  console.log('hello');
  res.send('Hello new world\n');
});

app.post('/api/mercury', function (req, res) {
  var url = req.body.url;
  console.log("hit");
  console.log(req.body);
  console.log(url);
  res.send(url);
  // res.send(req.body)
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
