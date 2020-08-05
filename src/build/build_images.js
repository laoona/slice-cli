/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 17:54
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const filter = require('gulp-filter');
const path = require('path');
const debug = require('gulp-debug');
const gutil = require('gulp-util');
const gulpif = require('gulp-if');
const ignore = require('gulp-ignore');
const imagemin = require('gulp-imagemin');
const tinypng = require('gulp-tinypng-nokey-plus');

const utils = require('../utils');

const projectDir = process.cwd();
const src = '/src/assets';

module.exports = (opts, config = {}) => {
  const imagesFilter = filter(['**/*.png', '**/*.jpg', '**/*.jpeg', '!**/__*.png', '!**/demo/*.*'], {restore: true});
  const isFilterPreName = utils.isFilterPreName;
  const useTinypng = config.tinypng || false;

  const buildDir = path.join(projectDir, '/dist');

  function handleError(error) {
    console.log(error.toString());
    this.emit('end');
  }

  return gulp.src(projectDir + src + '/images/**')
    .pipe(debug({title: 'SLICE-IMAGES: ' + gutil.colors.green('✔')}))
    .pipe(imagesFilter)
    .pipe(gulpif(((opts.isIm) && !useTinypng), imagemin()))
    .on('error', handleError)
    .pipe(gulpif(((opts.isIm) && useTinypng), tinypng()))
    .pipe(imagesFilter.restore)
    .pipe(ignore.exclude(isFilterPreName))
    .pipe(gulp.dest(buildDir + '/assets' + '/images'))
}
