'use strict';
const config = require('../config');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const log = require('retarded-log');
const templates = require('../templates');

module.exports = (dir) => {
    let pwd = process.cwd(); 
    if (!/^\//g.test(dir)) {
        dir = pwd + '/' + dir;
    }
    
    dir = path.normalize(dir);
    if (!fs.existsSync(dir)) {
        console.log(chalk.red('ERROR! No Such Config File') + ' => ' + chalk.white(dir));
        process.exit();
    }
    
    try {
        require(dir);
    } catch(e) {
        console.log('[' + chalk.red('Config File Parse Error') + '] ' + chalk.gray(e.toString()));
        process.exit();
    }
    
    templates.config = dir;
    // 把配置文件信息写入templates.json
    fs.writeFile(__dirname + '/../templates.json', JSON.stringify(templates), 'utf-8', (err) => {
        if (err) console.log(err);
        console.log(chalk.green('SUCCESS! Config File') + ' => ' + chalk.white(dir));
        process.exit();
    });
};