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

const gulpScript = require('../gulp/gulp_script');
const utils = require('../utils');

const projectDir = process.cwd();
const src = path.join(projectDir, './dist/assets');

const compile = () => {
  gulp.task('bs_script', () => gulpScript());
  gulp.parallel('bs_script')();
}

const dirs = [path.join(projectDir, '/src/assets/**/*.js'), path.join(projectDir, '/src/views/**/*.js')];

module.exports = () => {
  // 通过BS监测sass文件执行编译
  dirs.map(v => {
    browserSync.watch(v).on('change', async (dir) => {
      utils.logChanged(dir, projectDir);
      compile();
    }).on('add', (dir) => {
      (arguments.length == 1) && (compile(), utils.logChanged(dir, projectDir));
    }).on('unlink', (dir) => {
      del([path.join(src, '/js/**/*')]).then(() => {
        utils.logChanged(dir, projectDir);
        compile();
      });
    });
  });
}
