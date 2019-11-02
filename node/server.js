'use strict';
const Mercury = require('@postlight/mercury-parser');
const express = require('express');

// Constants
const PORT = 3000;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/', (req, res) => {
  res.send('Hello worl1d\n');
});

app.post('api/mercury', (req, res) => {
  console.log("hit api mercury");
  // var url = req.body.url;
  // console.log(url);
  res.send('Hello worwaddsddsald tes3223432t23ing1\n');
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
