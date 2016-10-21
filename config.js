/**
 * @author: laoono
 * @date:  2016-10-21
 * @time: 10:06
 * @contact: laoono.com
 * @description: #
 */

'use strict';
const config = {
    auto: {
        browsers: [
            "> 1%",
            "last 2 versions",
            "Android >= 2.0",
            "ie > 8",
            "Firefox > 20",
            "iOS 7"
        ]
    },
    base64: {
        extensions: [/\?base64$/i],
        maxImageSize: 8 * 1024
    }
};

module.exports = config;