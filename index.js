/* global module, require, console */
/* jshint globalstrict: true */
'use strict';

var fs = require('fs');
var JSPARSONS = function() {};

JSPARSONS.getLibCode = function(libs) {
  var libCode = '';
  for (var i = 0; i < libs.length; i++) {
    libCode += '<script src="/static/jsparsons/js-parsons/lib/' + libs[i] + '"></script>\n';
  }
  return libCode;
};

JSPARSONS.addToHead = function(params) {
  var libs = ['prettify.js', 'jquery.min.js', 'jquery-ui.min.js', 'underscore-min.js', 'lis.js', 'skulpt.js', 'skulpt-stdlib.js', 'ace.js', 'mode-python.js', 'python.js', 'theme-xcode.js'];
  return JSPARSONS.getLibCode(libs) +
    '<script src="/static/jsparsons/acos-jsparsons.js" type="text/javascript"></script>\n' +
    '<link href="/static/jsparsons/js-parsons/lib/prettify.css" rel="stylesheet">\n' +
    '<link href="/static/jsparsons/js-parsons/parsons.css" rel="stylesheet">\n' +
    '<link href="/static/jsparsons/js-parsons/lib/jquery-ui.css" rel="stylesheet">\n' +
    '<link href="/static/jsparsons/js-parsons/lib/materialize.min.css" rel="stylesheet">\n' +
    '<script src="/static/jsparsons/js-parsons/parsons.js" type="text/javascript"></script>\n';
  };

JSPARSONS.handleEvent = function(event, payload, req, res, protocolPayload, responseObj, cb) {
    var dir = JSPARSONS.logDirectory + req.params.contentPackage;
    /* req.params e.g.:
      { protocol: 'aplus',
        contentType: 'jsparsons',
        contentPackage: 'jsparsons-python',
        name: 'ps_hello' }
    */
    if (event == 'log') {
        fs.mkdir(dir, '0775¨', function(err) {
            var data = new Date().toISOString() + '\t' + JSON.stringify(payload.log) + '\t' + JSON.stringify(protocolPayload || {}) + '\n';
            var logName = payload.problemName.replace(/\.|\/|\\|~/g, "-") + '.log';
            fs.writeFile(dir + '/' + logName, data, {flag: 'a'}, function(err) {
              cb(event, payload, req, res, protocolPayload, responseObj);
            });
        });
    } else {
      cb(event, payload, req, res, protocolPayload, responseObj);
    }
};


JSPARSONS.addToBody = function(params) {

        return '<input type="hidden" id="js-parsons-id" value="' + params.name + '">' +
        '<div id="sortableTrash" class="sortable-code"></div>' +
        '<div id="sortable" class="sortable-code">' +
        '</div>' +
        '<div style="clear:both;"></div>' +
        '<div id="button-div">' + 
        '    <div>' +
          '    <a href="#" id="newInstanceLink" class="waves-effect waves-light btn btn-sm">Reset</a>' +
          '    <a href="#" id="feedbackLink" class="waves-effect waves-light btn btn-sm">Check</a>' +
        '    </div>' +
        '</div>';
};

JSPARSONS.initialize = function(req, params, handlers, cb) {
  // Initialize the content type
  params.headContent += JSPARSONS.addToHead(params);

  // Initialize the content package
  handlers.contentPackages[req.params.contentPackage].initialize(req, params, handlers, function() {
    params.bodyContent += JSPARSONS.addToBody(params);
    params.bodyContent += params.footer
    cb();
  });

};

JSPARSONS.register = function(handlers, app, conf) {
    handlers.contentTypes.jsparsons = JSPARSONS;
    JSPARSONS.logDirectory = conf.logDirectory + '/jsparsons/';
    try {
      fs.mkdir(JSPARSONS.logDirectory, '0775', function(err) {});
    } catch(e) {
      console.log('Couldn\'t create direcotry ' + JSPARSONS.logDirectory);
    }
};

JSPARSONS.namespace = 'jsparsons';
JSPARSONS.installedContentPackages = [];
JSPARSONS.packageType = 'content-type';
JSPARSONS.meta = {
    'name': 'jsparsons',
    'shortDescription': 'Content type for Parson\'s exercises.',
    'description': '',
    'author': 'Lassi Haaranen',
    'license': 'MIT',
    'version': '0.2.0',
    'url': ''
};

module.exports = JSPARSONS;
