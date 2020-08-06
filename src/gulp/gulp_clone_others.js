/**
 * @author: laoona
 * @date:  2020-08-06
 * @time: 14:41
 * @contact: laoono.com
 * @description: #
 */

const path = require('path');
const gulp = require('gulp');
const debug = require('gulp-debug');
const filter = require('gulp-filter');
const cached = require('gulp-cached');

const src = path.join(process.cwd(), './src/assets');

module.exports = () => {
  return new Promise(resolve => {
    const filterFiles = filter(['src/**/*.*', '!**/*.css', '!**/*.scss', '!**/*.map'], {restore: true});
    gulp.src(path.join(src, './**/*.*'))
      .pipe(filterFiles)
      .pipe(cached('#bs_clone'))
      .pipe(debug({title: 'clone'}))
      .pipe(gulp.dest('./dist/assets'))
      .on('end', resolve);
  })
}
