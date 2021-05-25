/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 13:27
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const path = require('path');
const browserSync = require("browser-sync").get('slice-server');
const babel = require('gulp-babel');
const cached = require('gulp-cached');
const gulpIf = require('gulp-if');

const {log} = require('../lib/index');

const projectDir = process.cwd();

const src = '/src/assets';
const dir = path.join(projectDir, src, '/js/**/*.js');
const distDir = path.join(projectDir, '/dist/assets', '/js');

function handleError(error) {
  log.error(error.toString());
  this.emit('end');
}

module.exports = function (config = {}) {
  return gulp.src([dir])
    .pipe(sourcemaps.init())
    .pipe(gulpIf(config.babel, babel({
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              browsers: [
                'last 3 versions',
                'Android >= 4.1',
                'ios >= 8',
                'ie 9',
              ],
            },
          }
        ]
      ],
      plugins: [
        ['@babel/plugin-proposal-optional-chaining',],
        ['@babel/plugin-proposal-nullish-coalescing-operator'],
        ['transform-es2015-modules-amd'],
        ['@babel/transform-runtime', {
          helpers: false,
          regenerator:true,
        }]
      ],
    })))
    .on('error', handleError)
    .pipe(cached('#script'))
    .pipe(sourcemaps.write('./.maps'))
    .pipe(gulp.dest(distDir))
    .pipe(browserSync.stream());
};
