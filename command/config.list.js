'use strict'
const co = require('co');
const config = require('../config');
const chalk = require('chalk');
const fs = require('fs');
const log = require('retarded-log');

module.exports = () => {
    
    co(function*() {

        // 打印配置文件信息 
        console.log(chalk.grey('The last config is: \n'));
        log.g(config);
        process.exit();
    });
};