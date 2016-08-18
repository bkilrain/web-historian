// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var request = require('request');
var fs = require('fs');
var archive = require('../helpers/archive-helpers.js');


exports.fetcher = function() {
  archive.readListOfUrls(function(urlsList) {
    var downloadUs = [];
    urlsList.forEach(function(url, ind, collection) {
      archive.isUrlArchived(url, function(exists) {
        if (!exists) {
          downloadUs.push(url);
        }
        if (ind === collection.length - 1) {
          archive.downloadUrls(downloadUs);
        }
      });
    });
  });

};

// read url list and compare to archived files
// if there is no archived file, download and archive new si