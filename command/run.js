/**
 * @author: laoono
 * @date:  2016-08-26
 * @time: 17:45
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const co = require('co');

module.exports = (projectName, opts) => {
    projectName = projectName || '';
    opts = opts || {};

    co(function *() {
        require("../lib/gulpfile")(projectName, null, null, opts);
    });
}; 
 