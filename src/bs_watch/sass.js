/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 19:31
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const del = require('del');
const path = require('path');
const browserSync = require('browser-sync').get('slice-server');

const gulpSass = require('../gulp/gulp_sass');
const utils = require('../utils');

const projectDir = process.cwd();
const src = path.join(projectDir, './assets');

const compile = () => {
  gulp.task('bs_sass', () => gulpSass());
  gulp.parallel('bs_sass')();
}

module.exports = () => {
  // 通过BS监测sass文件执行编译
  browserSync.watch(path.join(projectDir, '/**/*.scss')).on('change', async (dir) => {
    utils.logChanged(dir, projectDir);
    compile();
  }).on('add', (dir) => {
    (arguments.length == 1) && (compile(), utils.logChanged(dir, projectDir));
  }).on('unlink', (dir) => {
    del([path.join(src, '/css/**/*')]).then(() => {
      utils.logChanged(dir, projectDir);
      compile();
    });
  });
}
