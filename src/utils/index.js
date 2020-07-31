/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 13:35
 * @contact: laoono.com
 * @description: #
 */

const chalk = require('chalk');
const path = require('path');

const Utils = {
  replaceDir (dir = '', projectDir) {
    var temp = projectDir.replace(/\/+$/g, '/');

    return dir.replace(temp, '').replace(/^(\/|\\)/g, '');
  },
  logChanged (dir = '', projectDir) {
    console.log('[' + chalk.green('SLICE') + '] ' + chalk.magenta(this.replaceDir(dir, projectDir)));
  },
  fixedWinPath (pathName) {
    pathName = pathName || '';
    pathName = pathName.replace(/\.\\/g, './');
    pathName = pathName.replace(/\.{2}\\/g, '../');

    return path.normalize(pathName);
  },
  getExtensionByTemplate (tempEngine) {
    tempEngine = tempEngine || '';
    let ext = '';

    switch (tempEngine) {
      case 'smarty' :
        ext = '.tpl';
        break;

      case 'jade' :
      case 'pug' :
        ext = '.pug';
        break;

      default :
        ext = '.html';
        break;
    }

    return ext;
  },

  /**
   * 过滤文件名以_开头的文件
   * @param file
   * @returns {*}
   */
  isFilterPreName (file) {
    var src = file.path;
    var fileName = path.basename(src);
    var flag;

    if (/^_{2}.+/i.test(fileName)) {
      flag = true;
    } else {
      flag = false;
    }

    return flag;
  },

  /**
   * 过滤文类类型是css的文件
   * @param file
   * @returns {*}
   */
  isFilterCss (file) {
    var src = file.path;
    var ext = path.extname(src);
    var flag;

    if (/^\.css/i.test(ext)) {
      flag = false;
    } else {
      flag = true;
    }

    return flag;
  }
};

module.exports = Utils;
