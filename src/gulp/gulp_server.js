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
const gulpSass = require('./gulp_sass');
const utils = require("../utils");

const projectDir = process.cwd();

module.exports = ( env, options = {}) => {
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
    // middleware: [...jsonPlaceholderProxy],
  };

  browserSync.init(bsOptions);

  gulp.task('bs_sass', () => gulpSass());

  // 通过BS监测sassDir
  browserSync.watch(path.join(projectDir, './src/**/*.scss')).on('change', function (dir) {
    utils.logChanged(dir, projectDir);
    gulp.parallel('bs_sass')();
  }).on('add', function (dir) {
    (arguments.length == 1) && (gulp.series(['sass-watch']), utils.logChanged(dir, projectDir));
  });

  return



  browserSync.watch(sassDir).on('unlink', function (dir) {

    del([projectDir + src + '/css/**/*']).then(function () {
      Utils.logChanged(dir, projectDir);
      gulp.start(['sass-watch']);
    });
  });

  // 通过BS监测tplDir
  browserSync.watch(tplDir).on('change', function (dir) {
    Utils.logChanged(dir, projectDir);
    gulp.start(['tpl-watch']);
  }).on('add', function (dir) {
    (arguments.length == 1) && (gulp.start(['tpl-watch']), Utils.logChanged(dir, projectDir));
  });

  browserSync.watch(tplDir).on('unlink', function (dir) {

    del([projectDir + src + '/pages/**/*']).then(function () {
      Utils.logChanged(dir, projectDir);
      gulp.start(['tpl-watch']);
    });
  });

  // 通过BS监测const.json
  browserSync.watch(smartyConf.constPath).on('change', function (dir) {
    Utils.logChanged(dir, projectDir);
    gulp.start(['tpl-watch']);
  });

  arr.map(function (v) {
    browserSync.watch(v).on('change', function (dir) {
      browserSync.reload(dir);
    }).on('add', function (dir) {
      (arguments.length == 1) && (browserSync.reload(dir));
    }).on('unlink', function (dir) {
      (browserSync.reload(dir));
    });
  });



  // 通过BS监测tplDir下的scss文件 执行scss编译
  browserSync.watch(tplDirRoot + '*.scss').on('change', function (dir) {
    Utils.logChanged(dir, projectDir);
    gulp.start(['sass-watch']);
  }).on('add', function (dir) {
    (arguments.length == 1) && (gulp.start(['sass-watch']), Utils.logChanged(dir, projectDir));
  });

  browserSync.watch(tplDirRoot + '*.scss').on('unlink', function (dir) {

    del([projectDir + src + '/css/**/*']).then(function () {
      Utils.logChanged(dir, projectDir);
      gulp.start(['sass-watch']);
    });
  });
}
