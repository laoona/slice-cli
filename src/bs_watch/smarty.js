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

const gulpSmarty = require('../gulp/gulp_smarty');
const utils = require('../utils');

const projectDir = process.cwd();
const tplDir = path.join(projectDir, './templates');
const src = path.join(projectDir);

const compile = (config) => {
  gulp.task('bs_smarty', async () => {
    await gulpSmarty(config);

    browserSync.reload();
  });

  gulp.parallel('bs_smarty')();
}

module.exports = (config) => {
  // 通过BS监测smarty编译
  browserSync.watch(path.join(tplDir, '/**/*.tpl')).on('change', dir => {
    utils.logChanged(dir, projectDir);
    compile(config);
  }).on('add', dir => {
    (arguments.length == 1) && (compile(config), utils.logChanged(dir, projectDir));
  }).on('unlink', dir => {

    del([src + '/pages/**/*']).then(function () {
      utils.logChanged(dir, projectDir);
      compile(config);
    });
  });

  let constPath;

  try {
    constPath = path.join(src, config.smarty.constPath);
  } catch (e) {

  }

  browserSync.watch(path.join(projectDir, '/data/**/*.json')).on('change', function (dir) {
    utils.logChanged(dir, projectDir);
    compile(config);
  });

  // 通过BS监测const.json
  if (!constPath) return;
  browserSync.watch(constPath).on('change', function (dir) {
    utils.logChanged(dir, projectDir);
    compile(config);
  });
}
