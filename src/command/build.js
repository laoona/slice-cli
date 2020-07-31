/**
 * @author: laoona
 * @date:  2020-07-31
 * @time: 15:01
 * @contact: laoono.com
 * @description: #
 */

module.exports = function (options) {
  const zip = options.zip;
  const cos = options.cssOutputStyle || 'compact';
  const sprDir = options.spriteDir || '';
  const isIm = options.imagemini;

  const opts = {
    outputStyle: cos,
    spritesmith: {
      imagepath: sprDir
    },
    zip: zip ? true : false,
    isIm: isIm ? true : false,
  };

  require('../gulpfile')('build', opts);
};
