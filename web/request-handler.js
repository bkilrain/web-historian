var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var httpHelpers = require('./http-helpers.js');
// require more modules/folders here!





exports.handleRequest = function (req, res) {


  if (req.method === 'GET') {
    
    httpHelpers.handleGet(req, res);
  }









};
