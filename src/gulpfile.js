/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 11:36
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const merge = require('lodash/merge');
const path = require('path');

const gulpServer = require('./gulp/gulp_server');
const gulpSass = require('./gulp/gulp_sass');
const gulpClone = require('./gulp/gulp_clone');
const gulpSmarty = require('./gulp/gulp_smarty');
const gulpCleanImages = require('./gulp/gulp_clean_images');

const buildSmarty = require('./build/build_smarty');
const buildZip = require('./build/build_zip');

const del = require('del');
const sliceConf = require('../config');

const {series} = gulp;
const projectDir = process.cwd();

module.exports = function (command = 'run', opts = {}) {
  const date = new Date();

  let projectConf;
  // 引用项目下的配置文件
  try {
    projectConf = require(path.join(projectDir, '/config.js'));
  } catch (e) {
    projectConf = {};
  }

  // 合并slice、项目的配置文件
  const config = merge({}, sliceConf ,projectConf)

  const smartyConf = config.smarty || {};

  // smarty模板编译配置
  config.smarty4jsConf = {
    baseDir: smartyConf.baseDir,
    templateDataDir: smartyConf.templateDataDir || projectDir,
    dataManifest: smartyConf.dataManifest || {},
    constPath: smartyConf.constPath,
    rootDir: smartyConf.rootDir ? path.resolve(projectDir, smartyConf.rootDir) : path.join(projectDir, '/templates/../../')
  };

  // server
  gulp.task('server', () => gulpServer({...config, command}));

  // 复制文件
  gulp.task('clone', () => gulpClone());

  // 编译sass文件
  gulp.task('compile:sass', () => gulpSass());

  // 编译smarty文件
  gulp.task('compile:smarty', () => gulpSmarty(config));

  // 构建smarty文件
  gulp.task('build:smarty', () => buildSmarty(config));

  // copy templates目录
  gulp.task('build:templates', () => {
    return gulp.src(path.join(projectDir, '/templates/**/*'), {cwdbase: true})
      .pipe(gulp.dest(path.join(projectDir, "/dist")));
  });

  // 清理目录
  gulp.task('clean', async () => {
    await del(['./dist/**']);
  });

  // 清理样式引用的图片
  gulp.task('clean:image', () => gulpCleanImages('', command, date));

  // build-zip 任务
  gulp.task('build:zip', () => buildZip());

  // task列表
  const tasks = ['clean', 'clone'];

  if (command === 'run') {
    tasks.push(...['compile:sass', 'compile:smarty', 'server']);
  }

  if(command === 'build') {
    tasks.push(...['build:templates', 'build:smarty', 'clean:image']);
    opts.zip && tasks.push('build:zip');
  }

  // 默认任务
  const build = series.apply(this, tasks);

  return build();
}

