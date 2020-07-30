/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 11:51
 * @contact: laoono.com
 * @description: #
 */

const path = require('path');
const browserSync = require('browser-sync').create('slice-server');
const gulp = require('gulp');
const del = require('del');

const gulpSass = require('./gulp_sass');
const gulpSmarty = require('./gulp_smarty');

const utils = require("../utils");

const projectDir = process.cwd();
const src = path.join(projectDir, './assets');
const tplDir = path.join(projectDir, './templates');

const jsDir = projectDir + src + '/js/**/*.js';
const imagesDir = projectDir + src + '/images/**/*.*';
const fontsDir = projectDir + src + '/fonts/**/*.*';
const filesDir = projectDir + src + '/files/**/*.*';
const arr = [jsDir, imagesDir, fontsDir, filesDir];

module.exports = (env, options = {}) => {
  // browser-sync的配置
  const bsOptions = {
    server: {
      baseDir: projectDir,
      directory: true,
      routes: {
        '/lib': path.join(projectDir, './../lib')
      }
    },
    watchOptions: {
      ignoreInitial: true,
      ignored: ['**/*.map', '**/*.psd', '**/.maps/', '**/*.*.map']
    },

    notify: false,
    ghostMode: false,
    open: 'external',
    logPrefix: 'SLICE',
    logFileChanges: false,
    // middleware: [...jsonPlaceholderProxy],
  };

  browserSync.init(bsOptions);

  gulp.task('bs_sass', () => gulpSass());
  const compile = gulp.parallel('bs_sass');

  gulp.task('bs_smarty', async () => {
    await gulpSmarty();

    browserSync.reload();
  });

  const compileSmarty = gulp.parallel('bs_smarty');

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

  // 通过BS监测smarty编译
  browserSync.watch(path.join(tplDir, '/**/*.tpl')).on('change', dir => {
    utils.logChanged(dir, projectDir);
    compileSmarty();

  }).on('add', dir => {
    (arguments.length == 1) && (compileSmarty(), utils.logChanged(dir, projectDir));
  }).on('unlink', dir => {

    del([src + '/pages/**/*']).then(function () {
      utils.logChanged(dir, projectDir);
      compileSmarty();
    });
  });

  arr.map(v => {
    browserSync.watch(v).on('change', function (dir) {
      browserSync.reload(dir);
    }).on('add', function (dir) {
      (arguments.length == 1) && (browserSync.reload(dir));
    }).on('unlink', function (dir) {
      (browserSync.reload(dir));
    });
  });

  // 通过BS监测const.json
  browserSync.watch(path.join(tplDir, '/**/*.json')).on('change', function (dir) {
    utils.logChanged(dir, projectDir);
    compileSmarty();
  });
}
