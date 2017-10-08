#!/usr/bin/env node
'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _commander = require('commander');

var _commander2 = _interopRequireDefault(_commander);

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var pkg = _path2.default.resolve(__dirname, '../package.json');
var conf = JSON.parse(_fs2.default.readFileSync(pkg, 'utf8'));

_commander2.default.version(conf.version).option('-d, --dir [dir]', 'Directory of files', null).option('-l, --lang [lang]', 'The subtitle language', null).parse(process.argv);

var directory = _commander2.default.dir || process.cwd();
var language = _commander2.default.lang || 'en';

(0, _index2.default)(directory, language);