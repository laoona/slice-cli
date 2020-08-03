/**
 * @author: laoona
 * @date:  2020-08-03
 * @time: 16:47
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const path = require('path');

const projectDir = process.cwd();
const src = '/assets';
const buildDir = path.join(projectDir, '/dist');

module.exports = () => {

  const pathFixed = path.normalize(buildDir + './' + '' + src + '/css/**/*.css');

  return gulp.src(pathFixed)
    .pipe(gulp.dest(buildDir + src + '/css'))
}
