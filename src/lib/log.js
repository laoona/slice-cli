/**
 * @author: laoono
 * @date:  2019-08-06
 * @time: 14:19
 * @contact: laoono.com
 * @description: #
 */

module.exports = {
  chalk: require('chalk'),

  /**
   * 打印日志
   *
   * @return {this}
   */
  log: function () {
    if (process.env.NODE_ENV !== 'test') {
      console.log.apply(null, arguments);
    }
    return this;
  },

  /**
   * 打印消息
   *
   * @return {this}
   */
  info: function () {
    const args = [this.chalk.cyan('INFO')].concat(Array.from(arguments));
    return this.log.apply(this, args);
  },

  /**
   * 打印警告
   *
   * @return {this}
   */
  warn: function () {
    const args = [this.chalk.yellow('WARN')].concat(Array.from(arguments));
    return this.log.apply(this, args);
  },

  /**
   * 打印错误
   *
   * @return {this}
   */
  error: function () {
    const args = [this.chalk.red('ERROR')].concat(Array.from(arguments));
    return this.log.apply(this, args);
  }
};