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

exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...),
  // css, or anything that doesn't change often.)
};



// As you progress, keep thinking about what helper functions you can put here!
exports.handleGET = function(req, res) {
  if (req.url === '/') {
    fs.readFile('./web/public/index.html', function(err, data) {
       //console.log('handleRequest');
      //console.log(JSON.stringify(exports.headers));
      res.writeHead(200, exports.headers);
      res.end(data);
    });
  } else {
    fs.readFile(archive.paths.archivedSites + req.url, function(err, data) {
      if (err) {
        res.writeHead(404, exports.headers);
        res.end('ERROR');
      }
      res.writeHead(200, exports.headers);
      res.end(data);
    });

  }
};

exports.handlePOST = function(req, res) {
  var requestBody = '';
  req.on('data', function(data) {
    requestBody += data;
  });
  req.on('end', function() {
    var newUrl = qs.parse(requestBody);
    fs.appendFile(archive.paths.list, newUrl['url'] + '\n', function() {
      res.writeHead(302, exports.headers);
      res.end();
    });
  });









};