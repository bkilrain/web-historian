var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var qs = require('querystring');

exports.headers = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'text/html'
};

exports.serveAssets = function(res, asset, statusCode) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)

  var resetHeaderContentType = function() {
    exports.headers['Content-Type'] = 'text/html';
  };
  // Adjust the headers if necessary.  Be sure to reset headers afterwards.
  if (asset.substring(asset.length, asset.length - 3) === 'css') {
    exports.headers['Content-Type'] = 'text/css';
  }
  fs.readFile(asset, function(err, data) {
    if (err) {

      res.writeHead(404, exports.headers);
      resetHeaderContentType();
      res.end('ERROR');
    } else {
      res.writeHead(statusCode, exports.headers);
      resetHeaderContentType();
      res.end(data);
    }
  });

};


// As you progress, keep thinking about what helper functions you can put here!
exports.handleGET = function(req, res) {
  if (req.url === '/') {
    exports.serveAssets(res, archive.paths.siteAssets + '/index.html', 200);
  } else if (req.url === '/styles.css') {
    // serve styles.css
    exports.serveAssets(res, archive.paths.siteAssets + '/styles.css', 200);
  } else {
    // serve the potential asset from archives
    exports.serveAssets(res, archive.paths.archivedSites + req.url, 200);    
  }
};

exports.handlePOST = function(req, res) {
  var requestBody = '';
  req.on('data', function(data) {
    requestBody += data;
  });
  req.on('end', function() {
    var newUrl = qs.parse(requestBody)['url'];
    
    // if the url is not in the list
    archive.isUrlInList(newUrl, function(exists) {
      if (!exists) {
      //addUrlToList
        archive.addUrlToList(newUrl);
        exports.serveAssets(res, archive.paths.siteAssets + '/index.html', 302);

    // else if the url is in the list
      } else {
      //check if it's archived 
        archive.isUrlArchived(newUrl, function(exists) {
          if (exists) {
            exports.serveAssets(res, archive.paths.archivedSites + '/' + newUrl, 200);
          } else {
            exports.serveAssets(res, archive.paths.siteAssets + '/loading.html', 302);
          }
        });
      }
    });

  });









};