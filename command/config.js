'use strict'
const co = require('co');
const prompt = require('co-prompt');
const config = require('../config');
const chalk = require('chalk');
const fs = require('fs');
const log = require('retarded-log');

module.exports = (options) => {

    co(function*() {

        // 分步接收用户输入的参数
        let key = yield prompt('config key: ');
        let value = yield prompt('config value: ');

        value = value.replace(/[\u0000-\u0019]/g, ''); // 过滤unicode字符
        
        try {
            value = JSON.parse(value);
        } catch(e) {
            console.log(chalk.red('[JSON parse Error] ') + chalk.gray(e.toString()));
            process.exit();
        }
        
        config[key] = value;

        console.log(config);
        // 把配置信息写入config.json
        fs.writeFile(__dirname + '/../config.json', JSON.stringify(config), 'utf-8', (err) => {
            if (err) console.log(err);
            console.log(chalk.green('New config has added!\n'));
            console.log(chalk.grey('The last config is: \n'));
            log.g(config);
            console.log('\n');
            process.exit();
        });
    });
};