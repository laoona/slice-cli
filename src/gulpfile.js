/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 11:36
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const {parallel, series, watch: gulpWatch} = gulp;

const gulpServer = require('./gulp/gulp_server');
const gulpSass = require('./gulp/gulp_sass');
const gulpClone = require('./gulp/gulp_clone');
const gulpSmarty = require('./gulp/gulp_smarty');

const del = require('del');

module.exports = function (command = 'run', opts = {}) {

  // server
  gulp.task('server', () => gulpServer());

  // 复制文件
  gulp.task('clone', () => gulpClone());

  // 编译sass文件
  gulp.task('build:sass', () => gulpSass());

  // 编译smarty文件
  gulp.task('build:smarty', () => gulpSmarty());

  // 清理目录
  gulp.task('clean', async () => {
    await del(['./dist/**']);
  });

  // task列表
  const tasks = ['clean', 'clone', 'build:sass', 'build:smarty'];

  if (command === 'run') {
    tasks.push('server');
  }

  // 默认任务
  const build = series.apply(this, tasks);

  return build();
}

