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
const src = path.join(projectDir, './src');
const dist = path.join(projectDir, './dist');

const compile = (config = {}) => {
  gulp.task('bs_script', () => gulpScript(config));
  gulp.parallel('bs_script')();
}

const dirs = [path.join(projectDir, '/src/assets/**/*.js'), path.join(projectDir, '/src/views/**/*.js')];

module.exports = (config) => {
  // 通过BS监测sass文件执行编译
  dirs.map(v => {
    browserSync.watch(v).on('change', async (dir) => {
      utils.logChanged(dir, projectDir);
      compile(config);
    }).on('add', function (dir) {
      (arguments.length === 1) && (compile(config), utils.logChanged(dir, projectDir));
    }).on('unlink', (dir) => {
      const delPath = path.join(dist, dir.replace(src, ''));

      del([delPath]).then(() => {
        utils.logChanged(dir, projectDir);
        compile(config);
      });
    });
  });
}
