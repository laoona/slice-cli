/**
 * @author: laoono
 * @date:  2016-08-23
 * @time: 14:14
 * @contact: laoono.com
 * @description: #
 */
 
'use strict';
var log = require('retarded-log');
const config = require('../templates');

module.exports = () => {
    log.g((config.tpl));   
    process.exit();
};
 