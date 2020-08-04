/**
 * @author: laoona
 * @date:  2020-08-04
 * @time: 10:27
 * @contact: laoono.com
 * @description: #
 */

const path = require('path');
const fs = require('fs');
const request = require('then-request');
const chalk = require('chalk');

module.exports = (projectName, action) => {
  projectName = projectName || '';

  const __projectDir = path.normalize(process.cwd() + '/' + projectName + "/");
  const projectDir = __projectDir.replace(/\/+$/g, '');

  var config = null;
  var data = null;
  var isHas = false;

  function getFileName(npath) {
    if (typeof npath !== 'string') return npath;
    if (npath.length === 0) return npath;

    var name = path.basename(npath, path.extname(npath));

    return name;
  }

  try {
    config = require(path.resolve(projectDir, 'config.js'));
  } catch (e) {
    config = {};
    return console.log('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue('config.json Not found'));
  }


  try {
    data = config.smarty.dataManifest;
  } catch (e) {
    data = {};
    return console.log('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue('smarty config Not found'));
  }


  var dataPath = path.resolve(projectDir, 'data/');

  try {
    if (!fs.existsSync(dataPath)) {
      fs.mkdirSync(dataPath);
    }
  } catch (e) {
    return console.log('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue('create data path failed'));
  }

  function delFetch(filePath) {
    fs.exists(filePath, function (flag) {

      if (!flag) {
        return console.log(('FETCH-ERROR: ' + chalk.red('✘') + ' No such file ' + chalk.blue(filePath)));
      }

      fs.unlink(filePath, function (err) {
        if (err) {
          return console.log(('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue(err)));
        }

        console.log('FETCH-SUCCESS: ' + chalk.green('✔') + ' deleted ' + chalk.blue(filePath))
      })
    });
  }

  function addFetch(url, filePath, fileName) {

    request('GET', url).done(function (res) {
      var data = (res.getBody().toString());

      fs.writeFile(filePath, data, function (err) {
        if (err) {
          return console.log('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue(filePath));
        }

        console.log('FETCH-SUCCESS: ' + chalk.green('✔') + ' ' + chalk.blue(fileName + '.json'));
      });
    });
  }

  for (var k in data) {
    isHas = true;

    let url = data[k];
    let fileName = k.replace(/[\/\\]/gi, '$');
    fileName = fileName.replace(/^\.+/gi, '');
    fileName = getFileName(fileName);

    if (!/^http(s|):\/\//gi.test(url)) continue;

    var filePath = path.resolve(projectDir, 'data/', fileName + '.json');

    switch (action) {
      case 'del':
        delFetch(filePath);
        break;

      default:
        addFetch(url, filePath, fileName);
        break;
    }
  }

  if (!isHas && action !== 'del') {

    return console.log('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue('smarty config dataManifest key Not found'));
  }
};
