#!/usr/bin/env node
// @flow

import fs from 'fs';
import path from 'path';
import commander from 'commander';

import run from './index';

const pkg = path.resolve(__dirname, '../package.json');
const conf = JSON.parse(fs.readFileSync(pkg, 'utf8'));

commander
  .version(conf.version)
  .option('-d, --dir [dir]', 'Directory of files', null)
  .option('-l, --lang [lang]', 'The subtitle language', null)
  .parse(process.argv);

const directory = commander.dir || process.cwd();
const language = commander.lang || 'en';

run(directory, language);
