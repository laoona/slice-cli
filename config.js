/**
 * @author: laoono
 * @date:  2016-10-21
 * @time: 10:06
 * @contact: laoono.com
 * @description: #
 */

'use strict';
const config = {
    autoprefixer: {
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
        maxImageSize: 0 
    },
    spritesmith: {
        // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
        padding: 10,
        // 是否使用 image-set 作为2x图片实现，默认不使用
        useimageset: false,
        // 是否以时间戳为文件名生成新的雪碧图文件，如果启用请注意清理之前生成的文件，默认不生成新文件
        newsprite: true,
        // 给雪碧图追加时间戳，默认不追加
        spritestamp: false
        // 在CSS文件末尾追加时间戳，默认不追加
        // cssstamp: false
    }
};

module.exports = config;