/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 17:00
 * @contact: laoono.com
 * @description: #
 */
const gulp = require('gulp');
const path = require('path');
const debug = require('gulp-debug');
const gUtil = require('gulp-util');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const replace = require('gulp-replace-path');
const base64 = require('gulp-base64');

const utils = require('../utils');

const projectDir = process.cwd();

module.exports = (opts, config) => {
  const src = '/src/assets';
  const sassDir = projectDir + src + '/sass/**/*.scss';
  const buildDir = path.join(projectDir, '/dist');

  const tplDirRoot = projectDir + '/views/**/';
  const outputStyle = opts.outputStyle || 'compact';

  const autoprefixerCfg = config.autoprefixer || {};
  const base64Cfg = config.base64 || {};
  const imgPattern = '[\\.\\/]+' + '(' + src + ')?' + (src.length ? '/' : '') + 'images';

  return gulp.src([sassDir, tplDirRoot + '*.scss'])
    .pipe(debug({title: 'SLICE-CSS: ' + gUtil.colors.green('✔')}))
    .pipe(sass({outputStyle: outputStyle}).on('error', sass.logError))
    .pipe(autoprefixer(autoprefixerCfg))
    .pipe(gulp.dest(buildDir + '/assets' + '/css'))
    .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
      const __path = path.relative(path.dirname(__absolutePath__), buildDir + '/assets' + '/images');

      return utils.fixedWinPath(__path);
    }))
    .pipe(base64(base64Cfg))
    .pipe(gulp.dest(projectDir + src + '/css'))
    // .pipe(gulp.dest(buildDir + '/assets' + '/css'))
    // .pipe(gulp.dest(projectDir + src + '/css'))
}
