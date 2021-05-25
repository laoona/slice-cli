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
const gUtil = require('gulp-util');
const ignore = require('gulp-ignore');
const smarty4js = require('gulp-smarty4js-render');
const replace = require('gulp-replace-path');
const toBase64 = require('gulp-img-base64');
const inlineSource = require('gulp-inline-source');
const htmlBeautify = require('gulp-html-beautify');

const utils = require('../utils');

const projectDir = process.cwd();
const buildDir = path.join(projectDir, '/dist');

module.exports = (config) => {
  let isFilterPreName = utils.isFilterPreName;
  let src = path.join(projectDir, '/src/assets');
  let imgPattern = '[\\.\\/]+' + '(' + src + ')?' + (src.length ? '/' : '') + 'images';

  const smarty4jsConf = config.smarty4jsConf || {};

  const toBase64Cfg = {
    maxsize: 1000,
  };
  const inlineSourceConf = {
    compress: false
  };

  const htmlBeautifyConf = {
    "indent_size": 4,
    "indent_char": " ",
    "eol": "\n"
  };

  return gulp.src([path.join(projectDir, '/src/views/**/*.tpl')])
    .pipe(debug({title: 'SLICE-HTML: ' + gUtil.colors.green('✔')}))
    .pipe(ignore.exclude(isFilterPreName))
    .pipe(smarty4js(smarty4jsConf))
    .on('error', function (error) {
      gUtil.log(gUtil.colors.magenta('ERROR: '), error.message);
      this.end();
    })
    .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
      const __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

      return utils.fixedWinPath(__path);
    }))
    // .pipe(gulp.dest(projectDir + '/src/pages'))
    .pipe(gulp.dest(buildDir + '/views'))
    .pipe(toBase64(toBase64Cfg))
    .pipe(inlineSource(inlineSourceConf))
    .pipe(replace(/:\s*url\([\"|\']{1}(.*)[\"|\']{1}\)/gi, ':url($1)'))
    .pipe(replace(/:\s*url\(\.\.\/images/gi, function (match, __absolutePath__) {
      const __path = path.relative(path.dirname(__absolutePath__), buildDir + '/assets' + '/images');

      return ':url(' + utils.fixedWinPath(__path);
    }))
    .pipe(htmlBeautify(htmlBeautifyConf))
    .pipe(gulp.dest(buildDir + '/views'))
}
