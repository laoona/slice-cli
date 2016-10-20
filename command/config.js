'use strict';
const co = require('co');
const prompt = require('co-prompt');
const templates = require('../templates');
const chalk = require('chalk');
const fs = require('fs');
const log = require('retarded-log');
const path = require('path');

module.exports = () => {
    let configPath = templates.config || '';
    
    if (/^\.\./g) {
        configPath = __dirname + "/" + configPath;
    }
    
    configPath = path.normalize(configPath);
    console.log(chalk.green('Config File Path') + ' => ' + chalk.white(configPath));
    process.exit();
};