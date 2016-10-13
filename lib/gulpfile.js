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
const config = require('../config');


module.exports = (prDir, action) => {
    action = action || 'run';

    co(function *() {
        const projectDir = process.cwd() + '/' + prDir + "/";
        const sassDir = projectDir + 'src/sass/**/*.scss';
        
        const jsDir = projectDir + 'src/js/**/*.js';
        const imagesDir = projectDir + 'src/images/**/*.*';
        const fontsDir = projectDir + 'src/fonts/**/*.*';
        const arr = [jsDir, imagesDir, fontsDir];
        
        const tplDir = projectDir + 'src/source_pages/**/*.html';

        const buildDir = projectDir + 'build/';
        
        const apBrowsers = config.browsers || [];

        if (!fs.existsSync(projectDir)) {
            console.log(chalk.red(`ERROR: \n The Project ${projectDir} is not exists!`));
            process.exit();
        }

        // Static Server + watching sass/html files
        gulp.task('serve', ['sass', 'tpl'], function () {

            browserSync.init({
                server: {
                    baseDir: projectDir + 'src'
                    , index: projectDir + 'view/index.html'
                    , directory: true
                },
                watchOptions: {
                    ignoreInitial: true,
                    ignored: ['**/*.map', '**/*.psd', '**/.maps/', '**/*.*.map']
                },

                notify: false
            });

            browserSync.watch(tplDir).on('change', function (dir) {
                gulp.start(['tpl-watch']);
            }).on('add', function () {
                (arguments.length == 1) && (gulp.start(['tpl-watch']));
            });

            browserSync.watch(tplDir).on('unlink', function () {

                del([projectDir + 'src/**/view/**/*']).then(function () {
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


            browserSync.watch(sassDir).on('change', function () {
                gulp.start(['sass-watch']);
            }).on('add', function () {
                (arguments.length == 1) && (gulp.start(['sass-watch']));
            });

            browserSync.watch(sassDir).on('unlink', function () {

                del([projectDir + 'src/**/css/**/*']).then(function () {
                    gulp.start(['sass-watch']);
                });
            });
        });

        gulp.task('sass-watch', ['sass'], function (done) {
            done();
            return browserSync.reload();
        });

        gulp.task('tpl-watch', ['tpl'], function (done) {
            done();
            return browserSync.reload();
        });

        // Compile sass into CSS & auto-inject into browsers
        gulp.task('sass', function (cb) {
            return gulp.src(sassDir)
                .pipe(sourcemaps.init())
                .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
                .pipe(autoprefixer({
                    browsers: apBrowsers
                }))
                .pipe(sourcemaps.write('./.maps'))
                .pipe(gulp.dest(projectDir + 'src/css'))
                .pipe(browserSync.stream());
            
        });

        //compile tpl to html
        gulp.task('tpl', function (cb) {
            return gulp.src(tplDir)
                .pipe(tpl({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(gulp.dest(projectDir + 'src/view'))
                .pipe(browserSync.stream());
            
        });
        
        // clean
        gulp.task('clean', function () {
            return gulp.src(buildDir, {read: false})
                .pipe(clean(buildDir));
        });
    
        gulp.task('clean-css', function (cb) {
            gulp.src(projectDir + 'src/css/', {read: false})
                .pipe(clean(projectDir + 'src/css'));
            cb(); 
        });
        
        gulp.task('clean-tpl', function (cb) {
            gulp.src(projectDir + 'src/view/', {read: false})
                .pipe(clean(projectDir + 'src/view'));
            cb();
        });
        
        gulp.task('css', ['clean-css'], function (cb) {

            gulp.src(sassDir)
                // .pipe(sourcemaps.init())
                .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
                // .pipe(sourcemaps.write('./.maps'))
                .pipe(autoprefixer({
                    browsers: apBrowsers
                }))
                .pipe(gulp.dest(projectDir + 'src/css'))
                .pipe(gulp.dest(buildDir + 'css'));

            cb();
        });
        
        gulp.task('html', ['clean-tpl'], function (cb) {
            
            gulp.src(tplDir)
                .pipe(tpl({
                    prefix: '@@',
                    basepath: '@file'
                }))
                .on('error', function (error) {
                    gutil.log(gutil.colors.magenta('ERROR: '), error.message);
                    this.end();
                })
                .pipe(gulp.dest(projectDir + 'src/view'))
                .pipe(gulp.dest(buildDir+ 'pages'));

            cb();
        });

        gulp.task('fonts', function () {
            return gulp.src(projectDir + 'src/fonts/**/*')
                .pipe(gulp.dest(buildDir + 'fonts'));
        });

        gulp.task('js', function () {
            return gulp.src(projectDir + 'src/js/**/*')
                .pipe(gulp.dest(buildDir + 'js'));
        });

        gulp.task('images', function () {
            return gulp.src(projectDir + 'src/images/**/*')
                .pipe(gulp.dest(buildDir + 'images'));
        });

        // build
        gulp.task('build', ['clean'] , function (cb) {
            return gulp.start('build-dep');
            cb();
        });
        
        gulp.task('build-dep', ['css', 'fonts', 'js', 'images', 'html'], function () {
            console.log(chalk.green('\n √ build success'));
        });

        if (action == 'run') {
            gulp.task('default', ['serve']);
        } else {
            gulp.task('default', ['build'], function () {
                process.exit();
            });
        }

        gulp.start('default');
    });
};
