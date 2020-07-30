/**
 * @author: laoona
 * @date:  2020-07-30
 * @time: 10:53
 * @contact: laoono.com
 * @description: #
 */

const program = require('commander');
let cmdValue;

program
  .version(require('../../package').version);

program
  .usage('<command> [options]');

program
  .command('init')
  .description('初始化一个新项目')
  .action(function(cmd) {
    cmdValue = cmd;
    require('../command/init')();
  });

program
  .command('run')
  .alias('r')
  .description('开始运行项目')
  .action(function(cmd) {
    cmdValue = cmd;
    require('../command/run')();
  });

program.parse(process.argv);

// 没有参数时显示帮助信息
if (!program.args.length) {
  program.help();
}

// 异常提示
if (typeof cmdValue === 'undefined') {
  console.error('no command given!');
  process.exit(1);
}
