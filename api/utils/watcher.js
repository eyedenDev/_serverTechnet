'use strict';
const fs = require('fs');

function watch(dir, config) {
  fs.watch(dir, {
    persistent: true,
    recursive: true
  }, function(event, filename) {
    if (filename) {
      console.log('filename changed: ' + filename); //to stdout
    }
  });
}

watch('./batchUploads/');  //<- watching the ./batchUploads/ directory
