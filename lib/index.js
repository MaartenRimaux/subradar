'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _thesubdb = require('thesubdb');

var _thesubdb2 = _interopRequireDefault(_thesubdb);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var extensions = ['.avi', '.mkv', '.mp4', '.m4v'];

var walk = function walk(dir) {
  return new _bluebird2.default(function (res, rej) {
    var files = [];
    _fs2.default.readdir(dir, function (err, list) {
      if (err) rej(err);
      var pending = list.length;
      if (!pending) return res(files);
      list.forEach(function (file) {
        var fullPath = _path2.default.resolve(dir, file);
        _fs2.default.stat(fullPath, function (err2, stat) {
          if (stat && stat.isDirectory()) {
            walk(fullPath).then(function (results) {
              files = files.concat(results);
              pending -= 1;
              if (!pending) return res(files);
            }).catch(function (err3) {
              return rej(err3);
            });
          } else {
            files.push(fullPath);
            pending -= 1;
            if (!pending) return res(files);
          }
        });
      });
    });
  });
};

exports.default = function (dir, lang) {
  walk(dir).then(function (files) {
    var filterdFiles = files.filter(function (file) {
      return extensions.indexOf(_path2.default.extname(file)) > -1;
    });
    console.log(filterdFiles);
    _bluebird2.default.map(filterdFiles, function (file) {
      _winston2.default.info(_chalk2.default.blue('Searching for subtitles: ' + file));
      _thesubdb2.default.downSub(lang + ',en', file).then(function () {
        return _winston2.default.info(_chalk2.default.green('Found subtitle: ' + file));
      }).catch(function (err) {
        return _winston2.default.error(_chalk2.default.red(err + ' for file: ' + file));
      });
    }, { concurrency: 1 });
  });
};