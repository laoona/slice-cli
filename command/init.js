/**
 * @author: laoono
 * @date:  2016-08-23
 * @time: 13:53
 * @contact: laoono.com
 * @description: #
 */
 

'use strict';

const exec = require('child_process').exec;
const co = require('co');
const prompt = require('co-prompt');
const config = require('../templates');
const chalk = require('chalk');
const fs = require('fs');

module.exports = () => {
    co(function * () {
        //处理用户输入  
        let tplName = yield prompt('Template name: ');
        let projectName = yield prompt(' Project name: ');
        let gitUrl;
        let branch;
        
        if (!config.tpl[tplName]) {
            console.log(chalk.red('\n x Template doese not exit!')) ;
            process.exit();
        }
        
        gitUrl = config.tpl[tplName].url;
        branch = config.tpl[tplName].branch;

        let projectDir = process.cwd() + "/" + projectName;
        
        if (fs.existsSync(projectDir)) {
            console.log(chalk.red(`\n The Project ${projectDir} has exists!`));
            process.exit();
        }
        
        // git命令 远程拉取项目并自定义项目名
        let cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch}`;
        
        console.log(chalk.white('\n Start generating...'));
        exec(cmdStr, (error, stdout, stderr) => {
            if (error)  {
                console.log(error);
                process.exit();
            } 
            
            console.log(chalk.green('\n √ Generation completed!'));
            console.log(`\n please input: cd ${projectName} && slice run \n`);
            process.exit();
        });
    });   
};
 