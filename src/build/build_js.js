/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 15:53
 * @contact: laoono.com
 * @description: #
 */
const path = require('path');
const gulp = require('gulp');
const debug = require('gulp-debug');
const gUtil = require('gulp-util');

const babel = require('gulp-babel');
const gulpIf = require('gulp-if');
const utils = require('../utils');

const {log} = require('../lib/index');

const src = '/src/assets';
const projectDir = process.cwd();
const dir = path.join(projectDir, src, '/js/**/*.js');
const buildDir = path.join(projectDir, '/dist/', '/assets/js');

function handleError(error) {
  log.error(error.toString());
  this.emit('end');
}

module.exports = (config = {}) => {
  const condition = (file) => {
    return config.babel && !utils.isFilterFileName(file);
  };
  const babelCfg = config.babel || {};

  return gulp.src([dir])
    .pipe(gulpIf(condition, babel({
      ...babelCfg,
    })))
    .on('error', handleError)
    .pipe(debug({title: 'SLICE-JS: ' + gUtil.colors.green('✔')}))
    .pipe(gulp.dest(buildDir));
}
