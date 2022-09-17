/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 11:15
 * @contact: laoono.com
 * @description: #
 */

const inquirer = require('inquirer');
const fs = require('fs');
const promptList = [];
const init = require('../main/init');
const templates = require('../templates');

const askProjectName = function (conf = {}, prompts) {
  if (typeof conf.projectName !== 'string') {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: '请输入项目名称！',
      validate(input) {
        if (!input.trim()) {
          return '项目名不能为空！'
        }
        if (fs.existsSync(input)) {
          return '当前目录已经存在同名项目，请换一个项目名！'
        }
        return true
      }
    })
  } else if (fs.existsSync(conf.projectName)) {
    prompts.push({
      type: 'input',
      name: 'projectName',
      message: '当前目录已经存在同名项目，请换一个项目名！',
      validate(input) {
        if (!input.trim()) {
          return '项目名不能为空！'
        }
        if (fs.existsSync(input)) {
          return '项目名依然重复！'
        }
        return true
      }
    })
  }
}

const askTemplate = function (conf, prompts, list = []) {
  const choices = [...list.map(({desc: name, name: value}) => ({name, value}))]

  if (typeof conf.template !== 'string') {
    prompts.push({
      type: 'list',
      name: 'template',
      message: '请选择项目模板',
      choices
    })
  }
}

const askGitRemote = function (conf, prompts) {
  const choices = [
    {name: 'GitHub', value: 1},
    {name: 'Gitee', value: 2}
  ];

  if (typeof conf.template !== 'string') {
    prompts.push({
      type: 'list',
      name: 'remote',
      message: '请选择模板源',
      choices
    })
  }
}

module.exports = function () {

  const config = {};

  askProjectName(config, promptList)
  askTemplate(config, promptList, templates)
  askGitRemote(config, promptList)

  inquirer
    .prompt(promptList)
    .then(answers => {
      return init(answers);
    }).catch(() => {
    console.log('err');
  });
};
