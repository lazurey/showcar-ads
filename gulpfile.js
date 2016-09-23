'use strict';

const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();
const browserSync = require('browser-sync').create();

var shouldWatch = false;

const options = {
    js: {
        entry: 'src/js/index.js',
        out: `dist/index.js`
    },
    env: {
        production: true
    }
};

const loadTask = name => {
    const task = require(`./gulptasks/${name}`);
    return () => task(gulp, plugins, options);
};

gulp.task('set-dev', () => options.env.production = false);
gulp.task('js', loadTask('rollup'));

gulp.task('watch', () => {

    shouldWatch = true;

    gulp.watch('src/**/*.js', ['js', 'html']);
    gulp.watch("src/**/*.html", ['html']);
    gulp.watch("dist/**/*").on('change', browserSync.reload);
});

gulp.task('test', function (done) {
    const Server = require('karma').Server;
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !shouldWatch
    }, done).start();
});

gulp.task('html', ['js'], () => {
    const smoosher = require('gulp-smoosher');
    const foreach = require('gulp-foreach');

    return gulp.src('src/*.html')
    .pipe(foreach((stream, file) => {
        return stream.pipe(smoosher({ base: 'dist' }));
    }))
    .pipe(gulp.dest('dist'));
});

gulp.task('serve', ['html', 'js'], () => {
    browserSync.init({
        open: false,
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('build', ['js', 'html']);
gulp.task('dev', ['set-dev', 'watch', 'js', 'html', 'test', 'serve']);
gulp.task('default', ['serve']);
