/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 10:30
 * @contact: laoono.com
 * @description: #
 */

const path = require('path');
const src = path.join(process.cwd(), './src/assets');
const gulpOthers = require('../gulp/gulp_clone_others');

const jsDir = src + '/js/**/*.js';
const imagesDir = src + '/images/**/*.*';
const fontsDir = src + '/fonts/**/*.*';
const filesDir = src + '/files/**/*.*';
const dirs = [jsDir, imagesDir, fontsDir, filesDir];

dirs.shift();

const browserSync = require('browser-sync').get('slice-server');
const gulp = require('gulp');
const utils = require('../utils');

const projectDir = process.cwd();

const compile = () => {
  gulp.task('bs_clone_others', async () => {
    await gulpOthers()

    browserSync.reload();
  });

  gulp.parallel('bs_clone_others')();
}

module.exports = () => {
  // 监测其它文件
  dirs.map(v => {
    browserSync.watch(v).on('change', function (dir) {
      utils.logChanged(dir, projectDir);
      compile();

    }).on('add', function (dir) {
      (arguments.length == 1) && (compile(), utils.logChanged(dir, projectDir));

    }).on('unlink', function (dir) {
      utils.logChanged(dir, projectDir);
      compile();
    });
  });
}


