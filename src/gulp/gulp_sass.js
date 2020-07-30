/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 13:27
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const replace = require('gulp-replace-path');
const sourcemaps = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const path = require('path');
const browserSync = require("browser-sync").get('slice-server');

const projectDir = process.cwd();
const utils = require('../utils');

const src = path.join(projectDir, './src')
let imgPattern = '[\\.\\/]+' + '(' + src + ')?' + (src.length ? '/' : '') + 'images';

module.exports = function () {
  console.log('compile scss');
  return gulp.src(['src/**/*.scss'])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('dist/.maps'))
    .pipe(gulp.dest('dist'))
    .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
      var __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

      __path = utils.fixedWinPath(__path);

      return __path;
    }))
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream({match: '**/*.css'}));
};
