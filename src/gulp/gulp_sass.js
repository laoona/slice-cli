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

const src = '/src/assets';
const sassDir = path.join(projectDir, src, '/sass/**/*.scss');
const distCssDir = path.join(projectDir, '/dist/assets', '/css');

let imgPattern = '[\\.\\/]+' + '(' + src + ')?' + (src.length ? '/' : '') + 'images';

module.exports = function () {
  return gulp.src([sassDir])
    .pipe(sourcemaps.init())
    .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('./.maps'))
    .pipe(gulp.dest(distCssDir))

    .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
      // const __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');
      const __path = path.relative(path.dirname(__absolutePath__), projectDir + '/dist/assets' + '/images');

      return utils.fixedWinPath(__path);
    }))
    .pipe(gulp.dest(distCssDir))
    .pipe(browserSync.stream({match: '**/*.css'}));
};
