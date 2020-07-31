/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 14:38
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const path = require('path');
const debug = require('gulp-debug');
const gutil = require('gulp-util');
const ignore = require('gulp-ignore');
const smarty4js = require('gulp-smarty4js-render');
const replace = require('gulp-replace-path');
const tobase64 = require('gulp-img-base64');
const inlinesource = require('gulp-inline-source');
const htmlBeautify = require('gulp-html-beautify');

const utils = require('../utils');

const projectDir = process.cwd();
const buildDir = path.join(projectDir, '/dist');

module.exports = (config) => {
  let isFilterPreName = utils.isFilterPreName;
  let src = path.join(projectDir, '/assets');
  let imgPattern = '[\\.\\/]+' + '(' + src + ')?' + (src.length ? '/' : '') + 'images';

  const smarty4jsConf = config.smarty4jsConf || {};

  const tobase64Cfg = {
    maxsize: 100,
  };
  const inlinesourceConf = {
    compress: false
  };

  const htmlBeautifyConf = {
    "indent_size": 4,
    "indent_char": " ",
    "eol": "\n"
  };

  return gulp.src([path.join(projectDir, '/templates/**/*.tpl')])
    .pipe(debug({title: 'SLICE-HTML: ' + gutil.colors.green('✔')}))
    .pipe(ignore.exclude(isFilterPreName))
    .pipe(smarty4js(smarty4jsConf))
    .on('error', function (error) {
      gutil.log(gutil.colors.magenta('ERROR: '), error.message);
      this.end();
    })
    .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
      const __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

      return utils.fixedWinPath(__path);
    }))
    .pipe(gulp.dest(projectDir + '/pages'))
    .pipe(gulp.dest(buildDir + '/pages'))
    .pipe(tobase64(tobase64Cfg))
    .pipe(inlinesource(inlinesourceConf))
    .pipe(replace(/:\s*url\([\"|\']{1}(.*)[\"|\']{1}\)/gi, ':url($1)'))
    .pipe(replace(/:\s*url\(\.\.\/images/gi, function (match, __absolutePath__) {
      const __path = path.relative(path.dirname(__absolutePath__), buildDir + src + '/images');

      return ':url(' + utils.fixedWinPath(__path);
    }))
    .pipe(htmlBeautify(htmlBeautifyConf))
    .pipe(gulp.dest(buildDir + '/pages'))
}
