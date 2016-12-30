/**
 * @author: laoono
 * @date:  2016-08-23
 * @time: 14:14
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const co = require('co');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-dest-clean');
const tpl = require('gulp-file-include');
const gutil = require('gulp-util');
const del = require('del');
const fs = require('fs');
const chalk = require('chalk');
const autoprefixer = require('gulp-autoprefixer');
const templates = require('../templates');
const path = require('path');
const base64 = require('gulp-base64');
const ignore = require('gulp-ignore');
const debug = require('gulp-debug');
const replace = require('gulp-replace-path');
const spritesmith = require('gulp-css-spritesmith');


module.exports = (prDir, action, callback, opts) => {
    action = action || 'run';
    callback = callback || function(){};
    opts = opts || {};

    co(function *() {
        const src = '';
        const __projectDir = path.normalize(process.cwd() + '/' + prDir + "/");
        const projectDir = __projectDir.replace(/\/+$/g, '');
        const sassDir = projectDir + src + '/sass/**/*.scss';

        const jsDir = projectDir + src + '/js/**/*.js';
        const imagesDir = projectDir + src + '/images/**/*.*';
        const fontsDir = projectDir + src + '/fonts/**/*.*';
        const filesDir = projectDir + src + '/files/**/*.*';
        const arr = [jsDir, imagesDir, fontsDir, filesDir];

        const tplDir = projectDir + src + '/html/**/*.html';

        const buildDir = projectDir + '/build/';

        let configDir = templates.config;
        let config = {};
        let projectConf = null;
        let sliceConf = null;

        let outputStyle = opts.outputStyle || 'compact';
        let optsSpritesmith = opts.spritesmith || {};

        let isIP = opts.IP;
        let openType = isIP ? 'external' : 'local';

        let spriteDir = optsSpritesmith.imagepath;

        let projectConfDir = projectDir + '/config.json';

        // 引用项目下的配置文件
        try {
            projectConf = require(projectConfDir);
        } catch (e) {
            projectConf = {};
        }

        // 引用slice的配置文件
        try {
            sliceConf = require(configDir);
        } catch (e) {
            sliceConf = {};
        }

        // 合并项目和slice的配置文件
        Object.assign(config, sliceConf, projectConf);

        // 引用autoprefixer、base64、spritesmith的配置文件
        let autoprefixerCfg = config.autoprefixer || {};
        let base64Cfg = config.base64 || {};
        let spritesmithCfg = config.spritesmith || {};

        const Utils = {
            replaceDir: function(dir) {
                var temp = projectDir.replace(/\/+$/g, '/');
                return  dir.replace(temp, '');
            }
            , logChanged: function (dir) {
                console.log('[' + chalk.green('SLICE') + '] ' + chalk.magenta(Utils.replaceDir(dir)));
            },
            fixedWinPath (pathName) {
                pathName = pathName || '';
                pathName = pathName.replace(/\.\\/g, './');
                pathName = pathName.replace(/\.{2}\\/g, '../');

                return pathName;
            }
        };

        /**
         * 过滤文件名以_开头的文件
         * @param file
         * @returns {*}
         */
        let isFilterPreName = function (file) {
            var src = file.path;
            var fileName = path.basename(src);
            var flag;

            if (/^_.+/i.test(fileName)) {
                flag = true;
            } else {
                flag = false;
            }

            return flag;
        };

        /**
         * 过滤文类类型是css的文件
         * @param file
         * @returns {*}
         */
        let isFilterCss = function (file) {
            var src = file.path;
            var ext = path.extname(src);
            var flag;

            if (/^\.css/i.test(ext)) {
                flag = false;
            } else {
                flag = true;
            }

            return flag;
        };

        // spritesmith 默认配置项目依赖命令行输入
        let spritesmithCfgDefault = {
            // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images/slice/
            imagepath: spriteDir,
            // 映射CSS中背景路径，支持函数和数组，默认为 null
            imagepath_map: null,
            // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
            spritedest: './images/',
            // 替换后的背景路径，默认 ../images/
            spritepath: '../images/'
        };

        let spritesmithConf = {};

        //合并config.js中的spritesmith配置项和spritesmithCfgDefault
        Object.assign(spritesmithConf, spritesmithCfg, spritesmithCfgDefault);

        if (!fs.existsSync(projectDir)) {
            console.log(chalk.red(`ERROR: \n The Project ${projectDir} is not exists!`));
            process.exit();
        }

        // Static Server + watching sass/html files
        gulp.task('serve', ['sass', 'tpl'], function () {

            browserSync.init({
                server: {
                    baseDir: projectDir + src
                    , directory: true
                },
                watchOptions: {
                    ignoreInitial: true,
                    ignored: ['**/*.map', '**/*.psd', '**/.maps/', '**/*.*.map']
                },

                notify: false,
                ghostMode: false,
                open: openType
            });

            // 通过BS监测tplDir
            browserSync.watch(tplDir).on('change', function (dir) {
                Utils.logChanged(dir);
                gulp.start(['tpl-watch']);
            }).on('add', function (dir) {
                (arguments.length == 1) && (gulp.start(['tpl-watch']), Utils.logChanged(dir));
            });

            browserSync.watch(tplDir).on('unlink', function (dir) {

                del([projectDir + src + '/pages/**/*']).then(function () {
                    Utils.logChanged(dir);
                    gulp.start(['tpl-watch']);
                });
            });

            arr.map(function (v) {
                browserSync.watch(v).on('change', function (dir) {
                    browserSync.reload(dir);
                }).on('add', function (dir) {
                    (arguments.length == 1) && (browserSync.reload(dir));
                }).on('unlink', function (dir) {
                    (browserSync.reload(dir));
                });
            });


            // 通过BS监测sassDir
            browserSync.watch(sassDir).on('change', function (dir) {
                Utils.logChanged(dir);
                gulp.start(['sass-watch']);
            }).on('add', function (dir) {
                (arguments.length == 1) && (gulp.start(['sass-watch']), Utils.logChanged(dir));
            });

            browserSync.watch(sassDir).on('unlink', function (dir) {

                del([projectDir + src + '/css/**/*']).then(function () {
                    Utils.logChanged(dir);
                    gulp.start(['sass-watch']);
                });
            });
        });

        // sass-watch任务
        gulp.task('sass-watch', ['sass'], function (done) {
            done();
            // return browserSync.reload();
        });

        // tpl-watch任务
        gulp.task('tpl-watch', ['tpl'], function (done) {
            done();
            return browserSync.reload();
        });

        // Compile sass into CSS & auto-inject into browsers
        gulp.task('sass', function () {
            return gulp.src(sassDir)
                .pipe(sourcemaps.init())
                .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
                .pipe(sourcemaps.write('./.maps'))
                .pipe(gulp.dest(projectDir + src + '/css'))
                .pipe(browserSync.stream({match: '**/*.css'}));
        });

        //compile tpl to html
        gulp.task('tpl', function () {
            return gulp.src(tplDir)
                .pipe(ignore.exclude(isFilterPreName))
                .pipe(tpl({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(gulp.dest(projectDir + src + '/pages'));
                // .pipe(browserSync.stream());
        });

        // clean
        gulp.task('clean', function () {
            return gulp.src(buildDir, {read: false})
                .pipe(clean(buildDir));
        });

        gulp.task('clean-css', function (cb) {
            gulp.src(projectDir + src + '/css/', {read: false})
                .pipe(clean(projectDir + src + '/css'));
            cb();
        });

        gulp.task('clean-tpl', function (cb) {
            gulp.src(projectDir + src + '/pages/', {read: false})
                .pipe(clean(projectDir + src + '/pages'));
            cb();
        });

        // 编译处理scss文件
        gulp.task('css', ['clean-css'], function (cb) {

            return gulp.src(sassDir)
                .pipe(debug({title: 'SLICE-CSS:'}))
                .pipe(sass({outputStyle: outputStyle}).on('error', sass.logError))
                .pipe(replace(/[\.\/]+images/g, function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), projectDir + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(autoprefixer(autoprefixerCfg))
                .pipe(base64(base64Cfg))
                .pipe(gulp.dest(projectDir + src + '/css'))
                .pipe(gulp.dest(buildDir + 'css'));

            cb();
        });

        // 编译处理html文件
        gulp.task('html', ['clean-tpl'], function (cb) {

            gulp.src(tplDir)
                .pipe(debug({title: 'SLICE-HTML:'}))
                .pipe(ignore.exclude(isFilterPreName))
                .pipe(tpl({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(replace(/[\.\/]+images/g, function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), projectDir + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(gulp.dest(projectDir + src + '/pages'))
                .pipe(gulp.dest(buildDir+ 'pages'));

            cb();
        });

        gulp.task('fonts', function () {
            return gulp.src(projectDir + src + '/fonts/**/*')
                .pipe(debug({title: 'SLICE-FONTS:'}))
                .pipe(gulp.dest(buildDir + 'fonts'));
        });

        gulp.task('js', function () {
            return gulp.src(projectDir + src + '/js/**/*')
                .pipe(debug({title: 'SLICE-JS:'}))
                .pipe(gulp.dest(buildDir + 'js'));
        });

        // files
        gulp.task('files', function () {
            return gulp.src(projectDir + src + '/files/**/*')
                .pipe(debug({title: 'SLICE-FILES:'}))
                .pipe(gulp.dest(buildDir + 'files'));
        });

        gulp.task('images', function () {
            return gulp.src(projectDir + src + '/images/**/*')
                .pipe(debug({title: 'SLICE-IMAGES:'}))
                .pipe(ignore.exclude(isFilterPreName))
                .pipe(gulp.dest(buildDir + 'images'));
        });

        // 自动合并雪碧图
        gulp.task('sprite', ['css'], function () {
            return gulp.src(projectDir + src + '/css/**/*.css')
                .pipe(spritesmith(spritesmithConf))
                .pipe(debug({title: 'SLICE-SPRITE-CSS-IMAGES:'}))
                .pipe(gulp.dest(buildDir))
                .pipe(ignore.exclude(isFilterCss))
                .pipe(replace(/[\.\/]+images/g, function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), buildDir + 'images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(gulp.dest(buildDir));
        });

        // 自动合并雪碧图-修正产出项目目录任务
        gulp.task('sprite-fixed', ['sprite'], function () {

            let pathFixed = path.normalize(buildDir + '/' + prDir + '/css/**/*.css');
            return gulp.src(pathFixed)
                .pipe(gulp.dest(buildDir + 'css'))
                .pipe(replace(/[\.\/]+images/g, function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), buildDir + 'images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(gulp.dest(buildDir + 'css'))
                .on('end', function () {
                    del([buildDir + prDir]);
                });
        });

        // build 任务
        gulp.task('build', ['clean'] , function (cb) {
            return gulp.start('build-dep');
            cb();
        });

        // build 任务列表
        let builds = ['css', 'fonts', 'js', 'images', 'html', 'files'];

        // 有-s参数且有prDir目录，追加sprite-fixed任务
        if (spriteDir && prDir) {
            builds.push('sprite-fixed');
        } else if (spriteDir) { // 有-s参数 追加sprite任务
            builds.push('sprite');
        }

        // build 依赖回调任务
        gulp.task('build-dep', builds, function () {
            console.log(chalk.green('\n √ Build Success'));
            return callback();
        });

        // run 运行开发预览环境
        if (action == 'run') {
            gulp.task('default', ['serve']);
        } else { // 执行build任务
            gulp.task('default', ['build'], function () {
                process.exit();
            });
        }

        gulp.start('default');
    });
};
