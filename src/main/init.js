/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 11:21
 * @contact: laoono.com
 * @description: #
 */
const exec = require('child_process').exec;
const ora = require('ora');
const spinner = ora('Loading unicorns');
const os = require('os');
const platform = os.platform();
const chalk = require('chalk');
const templates = require('../templates');

module.exports = function({projectName, template}) {
  let tpl = templates.filter(item => item.name === template) || [];

  tpl = tpl[0];

  if (!(tpl && tpl.url)) {
    return console.log(chalk.red('\n x 未找到项目模板')) ;
  }

  const gitUrl = tpl.url;
  const branch = tpl.branch;

  spinner.start();
  spinner.color = 'yellow';
  spinner.text = '正在下载模板...';


  return new Promise((resolve, reject) => {
    // git命令 远程拉取项目并自定义项目名
    let cmdStr;
    if (/^win/g.test(platform)) {
      cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch} && rd /s/q .git`;

    } else {
      cmdStr = `git clone ${gitUrl} ${projectName} && cd ${projectName} && git checkout ${branch} && rm -rf ./.git`;
    }

    exec(cmdStr, (error, stdout, stderr) => {
      if (error)  {
        console.log(chalk.red(error));
        reject();
        process.exit();
      }

      spinner.succeed('创建项目成功');
      console.log(chalk.green(`请进入项目目录 ${chalk.green.bold(projectName)} 开始工作吧！😝`))
      resolve();
    });
  });
}

