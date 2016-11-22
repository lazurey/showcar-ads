'use strict';

const gulp = require('gulp');
const scgulp = require('showcar-gulp')(gulp);

scgulp.registerTasks({
    clean: {
        files: ['dist/**/*']
    },
    eslint: {
        files: 'src/**/*.js'
    },
    js: {
        dependencies: ['eslint'],
        entry: 'src/js/index.js',
        out: 'dist/index.js',
        watch: 'src/**/*.js',
        sourceMappingURLPrefix: process.env.CI_BUILD_REF_NAME ? `/assets/external/showcar-ads/${process.env.CI_BUILD_REF_NAME}/${process.env.CI_BUILD_REF}` : ''
    },
    serve: {
        dir: 'dist'
    }
});


const plugins = require('gulp-load-plugins')();

var shouldWatch = false;

const loadTask = name => {
    const task = require(`./gulptasks/${name}`);
    return () => task(gulp, plugins, options);
};

gulp.task('set-dev', () => {
    scgulp.config.devmode = true;
});

gulp.task('watch', () => {
    shouldWatch = true;
    gulp.watch("src/**/*.html", ['html']);
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

gulp.task('build', ['js', 'html']);
gulp.task('dev', ['set-dev', 'watch', 'js:watch', 'html', 'test', 'serve']);
gulp.task('default', ['serve']);
