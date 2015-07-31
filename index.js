/*jslint node: true */
'use strict';
var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var PluginError = gutil.PluginError;

var PLUGIN_NAME = 'gulp-couchapp';

module.exports = function() {
  var app = {};

  function transform(file, enc, cb) {
    gutil.log("processing file", file.relative, "dir", file.dirname, "base", file.basename, 'ext ', file.extname);

    if (file.isNull()) {
      return cb(null);
    }
    if (file.isStream()) {
      throw new PluginError(PLUGIN_NAME, 'Streams not supported');
    }

    var contents;
    if (file.isBuffer()) {
      contents = file.contents.toString();
    }

    app[file.relative] = contents;
    cb();
  }

  function flush(callback) {
    gutil.log("Flushing...", arguments);
    var file = new gutil.File({
      base: path.join(__dirname, './'),
      cwd: __dirname,
      path: path.join(__dirname, './test.txt'),
      contents: new Buffer(JSON.stringify(app, null, "  "))
    });
    /*jshint validthis:true */
    this.push(file);
    callback();
  }

  return through.obj(transform, flush);
};
