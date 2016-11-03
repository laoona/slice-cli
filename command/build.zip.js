/**
 * @author: laoono
 * @date:  2016-08-26
 * @time: 17:45
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const fs = require('fs');
const archiver = require('archiver');
const chalk = require('chalk');
const path = require('path');

module.exports = (projectName) => {
    projectName = projectName || '';
    
    var buildDir = process.cwd() + '/' + projectName + '/';
    buildDir = path.normalize(buildDir);

    require("../lib/gulpfile")(projectName, 'build', function () {

        console.log(buildDir);
        // create a file to stream archive data to.
        var output = fs.createWriteStream(buildDir + 'build.zip');
        var archive = archiver('zip', {
            store: true // Sets the compression method to STORE.
        });

        // listen for all archive data to be written
        output.on('close', function() {
            console.log(chalk.white(' \n ' + archive.pointer() + ' total bytes'));
            console.log(chalk.green(' √ archive build.zip success'));
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            throw err;
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append files from a directory
        archive.directory(buildDir + 'build');

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        archive.finalize();
    });
}; 
 