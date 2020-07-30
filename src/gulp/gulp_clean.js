/**
 * @author: laoono
 * @date:  2019-08-15
 * @time: 17:18
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const through = require('through2');
const path = require('path');
const del = require('del');
const {log} = require('../lib');

const fs = require('fs');
const pwd = process.cwd();
const chalk = require('chalk');

/**
 * 删除样式表里经过base64的图片资源
 */
const delImageByBase64 = () => {
  return through.obj(function (file, enc, cb) {

    if (file.isNull()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      this.emit('error', 'Streaming not supported');
    }

    // 匹配文件内容中含有. ?base64的路径
    const matches = file.contents.toString().match(/\..*\?base64/g);
  
    if (matches && matches.length) {
      matches.forEach(img => {
        let loc = path.join(path.dirname(file.path), img);

        // 替换路径中的src为dist
        loc = loc.replace(/\?base64$/g, '').replace(`${pwd}/src/`, `${pwd}/dist/`);

        if (!fs.existsSync(loc)) return;

        // 删除掉
        del(loc);
        log.info(`删除base64的源文件：${loc.replace(`${pwd}/dist/`, '')}`);
      });
    }

    return cb();
  });
}

module.exports = function (env, command, date) {

  return gulp.src(['src/**/*.wxss', 'src/**/*.scss'])
    .pipe(delImageByBase64())
    .on('end', () => {
      const start = +date;
      const end = +new Date();
      // 打印成功耗时信息
      console.log(`${chalk.green('[构建成功]')} 共计耗时：${(end - start) / 1000}s`);
    });
};
