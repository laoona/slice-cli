/**
 * @author: laoono
 * @date:  2016-08-23
 * @time: 14:14
 * @contact: laoono.com
 * @description: #
 */

'use strict';

const co = require('co');
const browserSync = require('browser-sync').create();
const del = require('del');
const fs = require('fs');
const chalk = require('chalk');
const templates = require('../templates');
const path = require('path');
const Utils = require("./Utils");

const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const clean = require('gulp-dest-clean');
const tpl = require('gulp-file-include');
const gutil = require('gulp-util');
const autoprefixer = require('gulp-autoprefixer');
const base64 = require('gulp-base64');
const ignore = require('gulp-ignore');
const debug = require('gulp-debug');
const replace = require('gulp-replace-path');
const spritesmith = require('gulp-css-spritesmith');
const sequence = require('gulp-sequence');
const zip = require('gulp-zip');
const smarty4js = require('gulp-smarty4js-render');
const htmlBeautify = require('gulp-html-beautify');
const pug = require('gulp-pug');
const tobase64 = require('gulp-img-base64');
const imagemin = require('gulp-imagemin');
const gulpif = require('gulp-if');
const minifyCss = require('gulp-minify-css');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const uglify = require('gulp-uglify');
const tplmin = require('gulp-htmlmin');
const inlinesource = require('gulp-inline-source');

module.exports = (prDir, action, callback, opts) => {
    action = action || 'run';
    callback = callback || function () { };
    opts = opts || {};

    co(function *() {
        const pwd = process.cwd();
        const __projectDir = path.join(pwd, prDir);
        const projectDir = path.normalize(__projectDir).replace(/\/+$/g, '');

        let configDir = templates.config;
        let config = {};
        let projectConf = null;
        let sliceConf = null;

        let outputStyle = opts.outputStyle || 'compact';
        let optsSpritesmith = opts.spritesmith || {};

        //是否在浏览器地址栏显示IP
        let isIP = opts.IP;
        let openType = isIP ? 'external' : 'local';

        // 是否构建发布
        let isDeploy = action === 'deploy' ? true : false;

        let spriteDir = optsSpritesmith.imagepath;

        let projectConfDir = path.join(projectDir, '/config.json');

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

        let assetsRoot = config.assetsRoot || '/assets';

        let src = config.assetsRoot === false ? '' : (assetsRoot.length ? (path.normalize('/' + assetsRoot)) : '/assets');

        const sassDir = projectDir + src + '/sass/**/*.scss';

        const jsDir = projectDir + src + '/js/**/*.js';
        const imagesDir = projectDir + src + '/images/**/*.*';
        const fontsDir = projectDir + src + '/fonts/**/*.*';
        const filesDir = projectDir + src + '/files/**/*.*';
        const arr = [jsDir, imagesDir, fontsDir, filesDir];

        let prBasename = prDir.length ? path.basename(prDir) : path.basename(projectDir);

        let buildDir = isDeploy ? [projectDir, './', '../../', './prod/', '.' + prBasename, '/'] : [projectDir, './', 'build', '/'];
        // buildDir.unshift(projectDir);

        buildDir = path.join.apply(null, buildDir);
        let deployDir = path.join.apply(null, [projectDir, './', '../../', './prod/', prBasename, '/']);

        let revDir = path.join(projectDir, './');

        let imgPattern = '[\\.\\/]+' + '(' + src + ')?' + (src.length ? '/': '') + 'images';

        // 引用autoprefixer、base64、spritesmith的配置文件
        let autoprefixerCfg = config.autoprefixer || {};
        let base64Cfg = config.base64 || {};
        let spritesmithCfg = config.spritesmith || {};
        let tobase64Cfg = {
            maxsize: 100
        };


        // 模板引擎
        let templateEngine = opts.template || config.template || 'smarty';
        let templateExt = Utils.getExtensionByTemplate(templateEngine);

        const tplDirRoot = projectDir + '/templates/**/';
        const tplDir = tplDirRoot + '*' + templateExt;
        let taskTplType = "tpl-" + templateEngine;
        let taskHtmlType = "html-" + templateEngine;

        let smartyConf = config.smarty || {};

        let smartyRootDir = smartyConf.rootDir || '';

        let smarty4jsConf = {
            baseDir: smartyConf.baseDir,
            templateDataDir: smartyConf.templateDataDir || projectDir,
            dataManifest: smartyConf.dataManifest || {},
            constPath: smartyConf.constPath,
            rootDir: smartyRootDir ? path.resolve(projectDir, smartyRootDir) : path.join(projectDir, '/templates/../../')
        };

        let isFilterPreName = Utils.isFilterPreName;
        let isFilterCss = Utils.isFilterCss;

        // spritesmith 默认配置项目依赖命令行输入
        let spritesmithCfgDefault = {
            // sprite背景图源文件夹，只有匹配此路径才会处理，默认 images
            imagepath: spriteDir || path.join(prDir, './', src, '/images/slice'),
            // 映射CSS中背景路径，支持函数和数组，默认为 null
            imagepath_map: null,
            // 雪碧图输出目录，注意，会覆盖之前文件！默认 images/
            spritedest: path.normalize('./' + src + '/images/'),
            // 替换后的背景路径，默认 ../images/
            spritepath: path.normalize('../' + '' + '/images/')
        };

        // console.log(spritesmithCfgDefault, prDir);

        let spritesmithConf = {};

        //合并config.js中的spritesmith配置项和spritesmithCfgDefault
        Object.assign(spritesmithConf, spritesmithCfg, spritesmithCfgDefault);

        if (!fs.existsSync(projectDir)) {
            console.log(chalk.red(`ERROR: \n The Project ${projectDir} is not exists!`));
            process.exit();
        }

        let imageminConf = {
            optimizationLevel: 6,
            progressive: true,
            interlaced: true
        };

        let minifyCssConf = {
            skip_improt:true,
            processImprot: true,
            keepSpecialComments: 0
        };

        let tplminConf = {
            collapseWhitespace: true,
            includeAutoGeneratedTags: false,
            minifyCSS: true,
            minifyJS: true,
            maxLineLength: 210,
            customAttrSurround: [
                    [/\{\{.+/, /\}\}/],
                    [/\{%.+/, /%\}/]
            ]
        };

        let inlinesourceConf = {
            compress: false
        };

        // Static Server + watching sass/html files
        gulp.task('serve', ['sass', taskTplType], function () {

            browserSync.init({
                server: {
                    baseDir: projectDir,
                    directory: true,
                    routes: {
                        '/lib': path.join(projectDir, './../lib')
                    }
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
                Utils.logChanged(dir, projectDir);
                gulp.start(['tpl-watch']);
            }).on('add', function (dir) {
                (arguments.length == 1) && (gulp.start(['tpl-watch']), Utils.logChanged(dir, projectDir));
            });

            browserSync.watch(tplDir).on('unlink', function (dir) {

                del([projectDir + src + '/pages/**/*']).then(function () {
                    Utils.logChanged(dir, projectDir);
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
                Utils.logChanged(dir, projectDir);
                gulp.start(['sass-watch']);
            }).on('add', function (dir) {
                (arguments.length == 1) && (gulp.start(['sass-watch']), Utils.logChanged(dir, projectDir));
            });

            browserSync.watch(sassDir).on('unlink', function (dir) {

                del([projectDir + src + '/css/**/*']).then(function () {
                    Utils.logChanged(dir, projectDir);
                    gulp.start(['sass-watch']);
                });
            });

            // 通过BS监测tplDir下的scss文件 执行scss编译
            browserSync.watch(tplDirRoot + '*.scss').on('change', function (dir) {
                Utils.logChanged(dir, projectDir);
                gulp.start(['sass-watch']);
            }).on('add', function (dir) {
                (arguments.length == 1) && (gulp.start(['sass-watch']), Utils.logChanged(dir, projectDir));
            });

            browserSync.watch(tplDirRoot + '*.scss').on('unlink', function (dir) {

                del([projectDir + src + '/css/**/*']).then(function () {
                    Utils.logChanged(dir, projectDir);
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
        gulp.task('tpl-watch', [taskTplType], function (done) {
            done();
            return browserSync.reload();
        });

        // Compile sass into CSS & auto-inject into browsers
        gulp.task('sass', function () {
            return gulp.src([sassDir, tplDirRoot + '*.scss'])
                .pipe(sourcemaps.init())
                .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
                .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(sourcemaps.write('./.maps'))
                .pipe(gulp.dest(projectDir + src + '/css'))
                .pipe(browserSync.stream({match: '**/*.css'}));
        });

        // render file-include to html
        gulp.task('tpl-file-include', function () {
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
                .pipe(gulp.dest(projectDir + '/pages'));
            // .pipe(browserSync.stream());
        });

        // render smarty to html
        gulp.task('tpl-smarty', function () {
            return gulp.src(tplDir)
                .pipe(smarty4js(smarty4jsConf))
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(gulp.dest(projectDir + '/pages'));
        });

        // render pug to html
        gulp.task('tpl-pug', function () {
            return gulp.src(tplDir)
                .pipe(pug())
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(gulp.dest(projectDir + '/pages'));
        });

        // clean
        gulp.task('clean', function () {
            return gulp.src(buildDir, {read: false})
                .pipe(gulpif(!isDeploy, clean(buildDir)));
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

            return gulp.src([sassDir, tplDirRoot + '*.scss'])
                .pipe(debug({title: 'SLICE-CSS: ' + gutil.colors.green('✔')}))
                .pipe(sass({outputStyle: outputStyle}).on('error', sass.logError))
                .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(autoprefixer(autoprefixerCfg))
                .pipe(gulp.dest(projectDir + src + '/css'))
                .pipe(gulp.dest(buildDir + src + '/css'))
                .pipe(base64(base64Cfg))
                .pipe(gulpif(isDeploy, minifyCss(minifyCssConf)))
                .pipe(gulp.dest(buildDir + src + '/css'))
            cb();
        });

        // 编译file-include 输出 html文件
        gulp.task('html-file-include', ['clean-tpl'], function (cb) {

            gulp.src(tplDir)
                .pipe(debug({title: 'SLICE-HTML: ' + gutil.colors.green('✔')}))
                .pipe(ignore.exclude(isFilterPreName))
                .pipe(tpl({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(gulp.dest(projectDir + '/pages'))
                .pipe(gulp.dest(buildDir + '/pages'))
                .pipe(tobase64(tobase64Cfg))
                .pipe(gulp.dest(buildDir + '/pages'))

            cb();
        });

        // 编译smarty输出html文件
        gulp.task('html-smarty', ['clean-tpl'], function (cb) {

            gulp.src(tplDir)
                .pipe(debug({title: 'SLICE-HTML: ' + gutil.colors.green('✔')}))
                .pipe(ignore.exclude(isFilterPreName))
                .pipe(smarty4js(smarty4jsConf))
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(htmlBeautify())
                .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(gulp.dest(projectDir + '/pages'))
                .pipe(gulp.dest(buildDir + '/pages'))
                .pipe(tobase64(tobase64Cfg))
                .pipe(inlinesource(inlinesourceConf))
                .pipe(replace(/:\s*url\(\.\.\/images/gi, function (match, __absolutePath__) {

                    var __path = path.relative(path.dirname(__absolutePath__), buildDir + src + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return ':url(' + __path;
                }))
                .pipe(gulp.dest(buildDir + '/pages'))

            cb();
        });

        // 编译smarty输出html文件
        gulp.task('html-pug', ['clean-tpl'], function (cb) {

            gulp.src(tplDir)
                .pipe(debug({title: 'SLICE-HTML: ' + gutil.colors.green('✔')}))
                .pipe(ignore.exclude(isFilterPreName))
                .pipe(pug())
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(htmlBeautify())
                .pipe(replace(new RegExp(imgPattern, 'g'), function (match, __absolutePath__) {
                    var __path = path.relative(path.dirname(__absolutePath__), projectDir + src + '/images');

                    __path = Utils.fixedWinPath(__path);

                    return __path;
                }))
                .pipe(gulp.dest(projectDir + '/pages'))
                .pipe(gulp.dest(buildDir + '/pages'))
                .pipe(tobase64(tobase64Cfg))
                .pipe(gulp.dest(buildDir + '/pages'))

            cb();
        });

        gulp.task('fonts', function () {
            return gulp.src(projectDir + src + '/fonts/**/*')
                .pipe(debug({title: 'SLICE-FONTS: ' + gutil.colors.green('✔')}))
                .pipe(gulp.dest(buildDir + src + '/fonts'));
        });

        gulp.task('js', function () {
            return gulp.src(projectDir + src + '/js/**/*')
                .pipe(debug({title: 'SLICE-JS: ' + gutil.colors.green('✔')}))
                .pipe(gulpif(isDeploy, uglify()))
/*                .pipe(gulpif(isDeploy, requirejsOptimize({
                    mainConfigFile: projectDir + '/./../lib/' + src + '/js/config.js'
                })))*/
                .pipe(gulp.dest(buildDir + src + '/js'));
        });

        // files
        gulp.task('files', function () {
            return gulp.src(projectDir + src + '/files/**/*')
                .pipe(debug({title: 'SLICE-FILES: ' + gutil.colors.green('✔')}))
                .pipe(gulp.dest(buildDir + src + '/files'));
        });

        gulp.task('images', function () {
            return gulp.src(projectDir + src + '/images/**/*')
                .pipe(debug({title: 'SLICE-IMAGES: ' + gutil.colors.green('✔')}))
                .pipe(gulpif((opts.isIm || isDeploy), imagemin(imageminConf)))
                .pipe(ignore.exclude(isFilterPreName))
                .pipe(gulp.dest(buildDir + src + '/images'))

        });

        // 自动合并雪碧图
        gulp.task('sprite', ['css'], function () {

            return gulp.src(projectDir + src + '/css/**/*.css')
                .pipe(spritesmith(spritesmithConf))
                .pipe(debug({title: 'SLICE-SPRITE-CSS-IMAGES: ' + gutil.colors.green('✔')}))
                .pipe(gulpif((opts.isIm || isDeploy), imagemin(imageminConf)))
                .pipe(gulp.dest(buildDir))
                .pipe(ignore.exclude(isFilterCss))
                .pipe(gulpif(isDeploy, minifyCss(minifyCssConf)))
                .pipe(gulp.dest(buildDir))

        });

        // 自动合并雪碧图-修正产出项目目录任务
        gulp.task('sprite-fixed-main', ['sprite'], function () {

            let pathFixed = path.normalize(buildDir + './' + prDir + src +'/css/**/*.css');

            return gulp.src(pathFixed)
                .pipe(gulp.dest(buildDir + src + '/css'))
        });

        //删除多余产出的项目目录
        gulp.task('sprite-fixed', ['sprite-fixed-main'], function () {
            return del([buildDir + prDir], {force: true});
        });

        // 移植templates目录
        gulp.task('build-templates', function () {
            return gulp.src(tplDir)
                .pipe(gulp.dest(buildDir + "/templates/"));
        });

        // build-zip 任务
        gulp.task('build-zip', function () {
            return gulp.src(buildDir + '/**/*')
                .pipe(zip('build.zip'))
                .pipe(gulp.dest(projectDir));
        });

        // deploy:assets
        gulp.task('deploy:assets', function () {
            return gulp.src(buildDir + './' + src + '/**/*')
                .pipe(rev())
                .pipe(gulp.dest(deployDir + './' + src + '/'))
                .pipe(rev.manifest('assets-map.json'))
                .pipe(gulp.dest(revDir))
        });


        // rev:html
        gulp.task('rev:html', function () {
             var dir = [path.join(revDir, 'assets-map.json'), path.join(revDir, './*-css.json'), buildDir + '/pages/**/*.html'];

            return gulp.src(dir)
                .pipe(revCollector())
                .pipe(tplmin(tplminConf))
                .pipe(gulp.dest(deployDir + '/pages/'))
        });

        // rev:tpl
        gulp.task('rev:tpl', function () {
            var dir = [path.join(revDir, 'assets-map.json'), path.join(revDir, './*-css.json'), buildDir + '/templates/**/*.tpl'];

            return gulp.src(dir)
                .pipe(revCollector())
                .pipe(tplmin(tplminConf))
                .pipe(gulp.dest(deployDir + '/templates/'))
        });

        // rev:css
        gulp.task('rev:css', function () {
            var dir = [path.join(revDir, 'assets-map.json'), deployDir + './' + src + '/**/*.css'];

            return gulp.src(dir)
                .pipe(revCollector())
                .pipe(gulp.dest(deployDir + './' + src + '/'))
        });

        // rev:js
        gulp.task('rev:js', function () {
            var dir = [path.join(revDir, 'assets-map.json'), deployDir + './' + src + '/**/*.js'];

            return gulp.src(dir)
                .pipe(revCollector())
                .pipe(gulp.dest(deployDir + './' + src + '/'))
        });

        // deploy:del
        gulp.task('deploy:del', function () {
            return del([buildDir], {force: true});
        });

        // build 任务列表
        let builds = ['images', 'build-templates', 'css', 'fonts', 'js', 'files', taskHtmlType];

        // 有-s参数且有prDir目录，追加sprite-fixed任务
        if ((spriteDir || isDeploy) && prDir) {
            builds.push('sprite-fixed');
        } else if (spriteDir || isDeploy) { // 有-s参数 追加sprite任务
            builds.push('sprite');
        }

        opts.zip && builds.push('build-zip');

        if (isDeploy) {
            builds.push('deploy:assets', 'rev:tpl', 'rev:html', 'rev:css', 'deploy:del');
        }

        // build 任务
        gulp.task('build', ['clean'], function (cb) {
            sequence.apply(this, builds)(cb);
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
