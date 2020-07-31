/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 10:30
 * @contact: laoono.com
 * @description: #
 */

const path = require('path');
const src = path.join(process.cwd(), './assets');

const jsDir = src + '/js/**/*.js';
const imagesDir = src + '/images/**/*.*';
const fontsDir = src + '/fonts/**/*.*';
const filesDir = src + '/files/**/*.*';
const dirs = [jsDir, imagesDir, fontsDir, filesDir];

const browserSync = require('browser-sync').get('slice-server');

module.exports = () => {
  // 监测其它文件
  dirs.map(v => {
    browserSync.watch(v).on('change', function (dir) {
      browserSync.reload(dir);
    }).on('add', function (dir) {
      (arguments.length == 1) && (browserSync.reload());
    }).on('unlink', function (dir) {
      (browserSync.reload(dir));
    });
  });
}


