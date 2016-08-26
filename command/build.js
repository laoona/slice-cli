/**
 * @author: laoono
 * @date:  2016-08-26
 * @time: 17:45
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const co = require('co');
const prompt = require('co-prompt');

module.exports = () => {
    co(function *() {
        //处理用户输入  
        let projectName = (yield prompt(' Project name: '));

        require("../lib/gulpfile")(projectName, 'build');
    });
}; 
 