// @flow

import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import winston from 'winston';
import Promise from 'bluebird';
import thesubdb from 'thesubdb';

const extensions = ['.avi', '.mkv', '.mp4', '.m4v'];

const walk = dir => new Promise((res, rej) => {
  let files = [];
  fs.readdir(dir, (err, list) => {
    if (err) rej(err);
    let pending = list.length;
    if (!pending) return res(files);
    list.forEach((file) => {
      const fullPath = path.resolve(dir, file);
      fs.stat(fullPath, (err2, stat) => {
        if (stat && stat.isDirectory()) {
          walk(fullPath)
            .then((results) => {
              files = files.concat(results);
              pending -= 1;
              if (!pending) return res(files);
            })
            .catch(err3 => rej(err3));
        } else {
          files.push(fullPath);
          pending -= 1;
          if (!pending) return res(files);
        }
      });
    });
  });
});

export default (dir: string, lang: string) => {
  walk(dir).then((files) => {
    const filterdFiles = files.filter(file => extensions.indexOf(path.extname(file)) > -1);
    Promise.each(filterdFiles, (file) => {
      winston.info(chalk.blue(`Searching for subtitles: ${file}`));
      thesubdb.downSub(`${lang},en`, file)
        .then(() => winston.info(chalk.green(`Found subtitle: ${file}`)))
        .catch(err => winston.error(chalk.red(`${err} for file: ${file}`)));
    });
  });
};
