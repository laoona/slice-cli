/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 15:15
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const smarty4js = require('gulp-smarty4js-render');
const path = require('path');
const {log} = require('../lib/index');

const baseDir = path.join(process.cwd(), './src/templates');

const smarty4jsConf = {
  baseDir,
  templateDataDir: baseDir,
};

module.exports = () => {
    return gulp.src('src/templates/**/*.tpl')
      .pipe(smarty4js(smarty4jsConf))
      .on('error', function (error) {
        log.error(error.message);
        this.end();
      })
      .pipe(gulp.dest('dist/pages'));

}
