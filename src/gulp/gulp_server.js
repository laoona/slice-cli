/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 11:51
 * @contact: laoono.com
 * @description: #
 */

const path = require('path');
const browserSync = require('browser-sync').create('slice-server');
const bsSass = require('../bs_watch/sass');
const bsSmarty = require('../bs_watch/smarty');
const bsOthers = require('../bs_watch/others');

const projectDir = process.cwd();

module.exports = (env, options = {}) => {
  // browser-sync的配置
  const bsOptions = {
    server: {
      baseDir: projectDir,
      directory: true,
      routes: {
        '/lib': path.join(projectDir, './../lib')
      }
    },
    watchOptions: {
      ignoreInitial: true,
      ignored: ['**/*.map', '**/*.psd', '**/.maps/', '**/*.*.map']
    },

    notify: false,
    ghostMode: false,
    open: 'external',
/*
    logPrefix: 'SLICE',
    logFileChanges: false,
*/
    // middleware: [...jsonPlaceholderProxy],
  };

  browserSync.init(bsOptions);

  // bs监听sass
  bsSass();

  // bs监听smarty
  bsSmarty();

  // bs监听其它文件
  bsOthers();
}
