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
  .alias('i')
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

program
  .command('build [project-dir]')
  .alias('b')
  .option('-z, --zip', '将build目录打包成build.zip')
  .option('-c, --cssOutputStyle <type>', 'sass的编译风格，取值范围：nested,expanded,compact,compressed, 默认:compact')
  .option('-s, --spriteDir <DIR>', '通过指定目录，自动生成css sprite')
  .option('-i, --imagemini', '是否开启图片压缩')
  .description('输出项目页面')
  .action((proDir, options) => {
    cmdValue = options;

    require('../command/build')(options);
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
