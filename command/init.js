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
const os = require('os');
const platform = os.platform();

module.exports = () => {
    co(function * () {
        //处理用户输入  
        let tplName = yield prompt('Template Name: ');
        let projectName = yield prompt(' Project Name: ');
        let gitUrl;
        let branch;
        
        if (!config.tpl[tplName]) {
            console.log(chalk.red('\n x Template Doese Not exit!')) ;
            process.exit();
        }
        
        gitUrl = config.tpl[tplName].url;
        branch = config.tpl[tplName].branch;

        let projectDir = process.cwd() + "/" + projectName;
        
        if (fs.existsSync(projectDir)) {
            console.log(chalk.red(`\n The Project ${projectDir} Has Exists!`));
            process.exit();
        }
        
        // git命令 远程拉取项目并自定义项目名
        let cmdStr;
        if (/^win/g.test(platform)) {
            cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch} && rd /s/q .git`;
            
        } else {
            cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch} && rm -rf ./.git`;
        }
        
        console.log(chalk.white('\n Start Generating...'));
        exec(cmdStr, (error, stdout, stderr) => {
            if (error)  {
                console.log(error);
                process.exit();
            } 
            
            console.log(chalk.green('\n √ Generation Completed!'));
            console.log(`\n Please Input: cd ${projectName} && slice run \n`);
            process.exit();
        });
    });   
};
 