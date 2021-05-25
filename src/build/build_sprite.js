/**
 * @author: laoona
 * @date:  2020-08-03
 * @time: 16:27
 * @contact: laoono.com
 * @description: #
 */

const gulp = require('gulp');
const gulpIf = require('gulp-if');
const ignore = require('gulp-ignore');

const debug = require('gulp-debug');
const spritesmith = require('gulp-slice-sprite');
const tinypng = require('gulp-tinypng-nokey-plus');
const imagemin = require('gulp-imagemin');
const filter = require('gulp-filter');
const path = require('path');
const gutil = require('gulp-util');
const merge = require('lodash/merge');


const utils = require('../utils');

const projectDir = process.cwd();
const src = '/src/assets';

module.exports = (opts, config = {}) => {
  const useTinypng = config.tinypng || false;
  const imagesFilter = filter(['**/*.png', '**/*.jpg', '**/*.jpeg', '!**/__*.png', '!**/demo/*.*'], {restore: true});

  const buildDir = path.join(projectDir, '/dist');
  const isFilterCss = utils.isFilterCss;
  const spritesmithCfg = config.spritesmith;

  const optsSpritesmith = opts.spritesmith || {};
  const spriteDir = optsSpritesmith.imagepath;

  const spritesmithCfgDefault = {
    // 各图片间间距，如果设置为奇数，会强制+1以保证生成的2x图片为偶数宽高，默认 0
    padding: 20,
    // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images
    imagepath: spriteDir || path.join('./', src, '/images/slice'),
    // 映射CSS中背景路径，支持函数和数组，默认为 null
    imagepath_map: null,
    // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
    spritedest: path.normalize('../images'),
    // 替换后的背景路径，默认 ../images/
    spritepath: path.normalize('../' + '' + '/images/')
  };

  const spritesmithConf = merge({}, spritesmithCfgDefault, spritesmithCfg);

  function handleError (error) {
    console.log(error.toString());
    this.emit('end');
  }

  return gulp.src(projectDir + src + '/css/**/*.css')
    .pipe(spritesmith(spritesmithConf))
    .pipe(debug({title: 'SLICE-SPRITE-CSS-IMAGES: ' + gutil.colors.green('✔')}))
    .pipe(imagesFilter)
    .pipe(gulpIf(((opts.isIm) && !useTinypng), imagemin()))
    .on('error', handleError)

    .pipe(gulpIf(((opts.isIm) && useTinypng), tinypng()))
    .pipe(imagesFilter.restore)
    .pipe(gulp.dest(path.join(buildDir, './assets/css')))
    .pipe(ignore.exclude(isFilterCss))
    .pipe(gulp.dest(path.join(buildDir, './assets/css')))
}
