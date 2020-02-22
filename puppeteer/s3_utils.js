const AWS = require('aws-sdk');
const fs = require('fs');
require('dotenv').config()
const filePath = './data/downloaded.json';
const key = 'data/data.json';

var s3 = new AWS.S3();

const downloadFile = function(filePath, bucketName, key) {
  const params = {
    Bucket: bucketName,
    Key: key
  }
  return new Promise(function(success, reject) {
    s3.getObject(params, function(error, data) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        fs.writeFileSync(filePath, data.Body.toString());
        success(data);
      }
    });
  });
}

const uploadFile = function(fileName, bucketName, key) {
  const fileContent = fs.readFileSync(fileName);
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: fileContent,
    contentType : 'application/pdf'
  }
  return new Promise(function(success, reject) {
    s3.upload(params, function(error, data) {
      if (error) {
        console.log(error);
        reject(error);
      } else {
        success(data)
      }
    });
  });
}

module.exports = {
  downloadFile,
  uploadFile
};
