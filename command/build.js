/**
 * @author: laoono
 * @date:  2016-08-26
 * @time: 17:45
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const co = require('co');
// const prompt = require('co-prompt');

module.exports = (projectName, opts) => {
    projectName = projectName || '';
    opts = opts || {};
    
    require("../lib/gulpfile")(projectName, 'build', null, opts);
};
 