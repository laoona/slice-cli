'use strict'
const co = require('co');
const templates = require('../templates');
const chalk = require('chalk');
const fs = require('fs');
const log = require('retarded-log');

module.exports = () => {
    
    let configPath = templates.config || '';
    // 打印配置文件信息 
    try {
        require(configPath); 
    } catch (e) {
        console.log(chalk.red('Error! No Such Config File'));
        process.exit();
    }
    
    let config = require(configPath);
    console.log(chalk.grey('The Last Config Is:'));
    log.g(config);
    process.exit();
};