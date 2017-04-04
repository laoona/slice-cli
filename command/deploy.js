/**
 * @author: laoono
 * @date:  2017-03-07
 * @time: 09:56
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const co = require('co');

module.exports = (projectName, opts) => {
    projectName = projectName || '';
    opts = opts || {};

    require("../lib/gulpfile")(projectName, 'deploy', null, opts);
};
