var printer = require("./printer.js");
var s3_utils = require("./s3_utils.js");
'use strict';
const express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
const pdfjsLib = require('pdfjs-dist');
const path = require('path');


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
  res.send('Hello from printer\n');
});

app.post('/api/print', function(req, res) {
  let html_id = req.param('html_id');
  console.log(html_id);
  let htmlFileName = path.join('dump', html_id + '.html');
  let pdfFileName = path.join('dump', html_id + '.pdf');
  let htmlKey = html_id + '.html';
  let pdfKey = html_id + '.pdf'
  let page_count;

  // AWS methods are async so they are done synchronously using callbacks
  // Download HTML
  s3_utils.downloadFile(htmlFileName, process.env.AWS_HTML_BUCKET, htmlKey).then(
    function(data) {
      // Convert HTML into PDF
      printer.printFile(html_id, function() {

        // Upload PDF to S3
        s3_utils.uploadFile(pdfFileName, process.env.AWS_PDF_BUCKET, pdfKey);

        // Count number of pages
        let countPages = pdfjsLib.getDocument(pdfFileName);
        countPages.promise.then(function(doc) {
          page_count = doc.numPages;

          // Delete PDF
          // fs.unlink(pdfFileName, (err) => {
          //   if (err) throw err;
          // });

          // Delete HTML
          // fs.unlink(htmlFileName, (err) => {
          //   if (err) throw err;
          // });

          // Jsonize Result
          let result = {
            pages: page_count,
            html_id: html_id,
          };
          res.send(result)
        });

      })
    },
    function(err) {
      console.log("err");
    }
  );
});

app.post('/api/print_magazine', function(req, res) {
  let html_id = req.param('html_id');
  console.log(html_id);
  let htmlFileName = path.join('dump', html_id + '.html');
  let pdfFileName = path.join('dump', html_id + '.pdf');
  let htmlKey = html_id + '.html';
  let pdfKey = html_id + '.pdf'
  let page_count;

  // AWS methods are async so they are done synchronously using callbacks
  // Download HTML
  s3_utils.downloadFile(htmlFileName, 'pulpmagazine', htmlKey).then(
    function(data) {
      // Convert HTML into PDF
      printer.printFile(html_id, function() {

        // Upload PDF to S3
        s3_utils.uploadFile(pdfFileName, 'pulpmagazine', pdfKey);

        // Count number of pages
        let countPages = pdfjsLib.getDocument(pdfFileName);
        countPages.promise.then(function(doc) {
          page_count = doc.numPages;

          // Delete PDF
          // fs.unlink(pdfFileName, (err) => {
          //   if (err) throw err;
          // });

          // Delete HTML
          // fs.unlink(htmlFileName, (err) => {
          //   if (err) throw err;
          // });

          // Jsonize Result
          let result = {
            pages: page_count,
            html_id: html_id,
          };
          res.send(result)
        });

      })
    },
    function(err) {
      console.log("err");
    }
  );
});


app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);
