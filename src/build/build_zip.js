/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 15:53
 * @contact: laoono.com
 * @description: #
 */
const path = require('path');
const gulp = require('gulp');
const zip = require('gulp-zip');

module.exports = () => {
  const projectDir = process.cwd();
  const buildDir = path.join(projectDir, '/dist/**/*')
  return gulp.src(buildDir, {cwdbase: true})
    .pipe(zip('dist.zip'))
    .pipe(gulp.dest(projectDir));
}
