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


module.exports = (prDir, action) => {
    action = action || 'run';
    
    co(function *() {
        const projectDir = process.cwd() + '/' + prDir + "/";
        const scssDir = projectDir + 'src/scss/**/*.scss';
        const tplDir =  projectDir + 'src/source_pages/**/*.html';
        
        const buildDir = projectDir + 'build';

        if (!fs.existsSync(projectDir)) {
            console.log(chalk.red(`ERROR: \n The Project ${projectDir} is not exists!`));
            process.exit();
        }
        
        // Static Server + watching scss/html files
        gulp.task('serve', ['sass', 'tpl'], function () {

            browserSync.init({
                server: {
                    baseDir: projectDir + 'src'
                    ,index: projectDir + 'view/index.html' 
                    , directory: true
                },
                watchOptions: {
                    ignoreInitial: true,
                    ignored: ['**/*.map', '**/*.psd', '**/.maps/', '**/*.*.map']
                }
            });

            browserSync.watch(tplDir).on('change', function (dir) {
                console.log(dir);
                gulp.start(['tpl-watch']);
            });

            browserSync.watch(tplDir).on('unlink', function (dir) {

                console.log(dir);
                del([projectDir + 'src/**/view/**/*']).then(function () {
                    gulp.start(['tpl-watch']);
                });
            });

            browserSync.watch(scssDir).on('change', function () {
                gulp.start(['sass-watch']);
            });

            browserSync.watch(scssDir).on('unlink', function () {

                del([projectDir + 'src/**/css/**/*']).then(function () {
                    gulp.start(['sass-watch']);
                });
            });
        });

        gulp.task('sass-watch', ['sass'], function (done) {
            browserSync.reload();
            done();
        });

        gulp.task('tpl-watch', ['tpl'], function (done) {
            browserSync.reload();
            done();
        });


        // Compile sass into CSS & auto-inject into browsers
        gulp.task('sass', function () {
            return gulp.src(scssDir)
                .pipe(sourcemaps.init())
                .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
                .pipe(sourcemaps.write('./.maps'))
                .pipe(gulp.dest(projectDir + 'src/css'))
                .pipe(browserSync.stream());
        });

        //compile tpl to html
        gulp.task('tpl', function () {
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

        gulp.task('css', ['sass'], function () {
            return gulp.src(projectDir + 'src/css/**/*.css')
                .pipe(gulp.dest(buildDir + '/css'));
        });

        gulp.task('fonts', function () {
            return gulp.src(projectDir + 'src/fonts/**/*')
                .pipe(gulp.dest(buildDir + '/fonts'));
        });

        gulp.task('js', function () {
            return gulp.src(projectDir + 'src/js/**/*')
                .pipe(gulp.dest(buildDir + '/js'));
        });

        gulp.task('images', function () {
            gulp.src(projectDir + 'src/images/**/*')
                .pipe(gulp.dest(buildDir + '/images'));
        });

        // clean
        gulp.task('clean', function () {
            return gulp.src(buildDir, {read: false})
                .pipe(clean(buildDir));
        });

        // build 
        gulp.task('build', ['clean'], function () {
            gulp.start(['tpl', 'css', 'fonts', 'js', 'images']);
            return gulp.src(projectDir + 'src/view/*.html', ['tpl'])
                .pipe(gulp.dest(buildDir + '/pages'));
        });

        if (action == 'run') {
            gulp.task('default', ['serve']);
        } else {
            gulp.task('default', ['build'], function() {
                console.log(chalk.green('\n √ build success'));
                process.exit();
            });
        }

        gulp.start('default');
    });
};
