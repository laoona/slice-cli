/**
 * @author: laoono
 * @date:  2017-03-28
 * @time: 13:57
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const path = require('path');
const fs = require('fs');
const request = require('then-request');
const chalk = require('chalk');

module.exports = (projectName) => {
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
        config = require(path.resolve(projectDir, 'config.json'));
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

    for (var k in data) {
        isHas = true;
        let url = data[k];
        let fileName = k.replace(/[\/\\]/gi, '-');

        fileName = getFileName(fileName);

        if (!/^http(s|):\/\//gi.test(url)) continue;

        request('GET', url).done(function (res) {

            var data = (res.getBody().toString());

            var filePath = path.resolve(projectDir, 'data/', fileName + '.json');

            fs.writeFile(filePath, data, function (err) {
                if (err) {
                    return console.log('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue(filePath));
                }

                console.log('FETCH-SUCCESS: ' + chalk.green('✔') + ' ' + chalk.blue(fileName + '.json'));
            });
        });
    }

    if (!isHas) {

        return console.log('FETCH-ERROR: ' + chalk.red('✘') + ' ' + chalk.blue('smarty config dataManifest key Not found'));
    }
};

