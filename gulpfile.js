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
    },
    jstest: {
        type: 'js',
        entry: 'test/index.spec.js',
        out: 'dist/index.spec.js',
        watch: ['src/**/*.js', 'test/**/*.js'],
        rollupConfig: {
            moduleName: 'showcarads',
            format: 'iife'
        }
    },
    karma: {
        dependencies: ['jstest'],
        files: ['dist/index.spec.js']
    }
});

// // scgulp.
// gulp.task('name', ['dep1', 'dep2'], () => {
//     // task
// });
//
// gulp.task('set-dev', () => scgulp.config.devmode = true);
// gulp.task('js', ['eslint'], scgulp.tasks.js({
//     entry: 'src/js/index.js',
//     out: 'dist/index.js',
//     // watch: 'src/**/*.js',
// }));
//
// gulp.task('js:watch', ['js'], () => {
//     gulp.watch('**/*.js', ['js']);
//     gulp.watch('**/*.scss', ['scss', 'scss:docs']);
// });


const plugins = require('gulp-load-plugins')();
const loadTask = name => {
    const task = require(`./gulptasks/${name}`);
    return () => task(gulp, plugins, options);
};

gulp.task('set-dev', () => {
    scgulp.config.devmode = true;
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

gulp.task('html:watch', ['html'], () => {
    gulp.watch("src/**/*.html", ['html']);
});

gulp.task('build', ['js', 'karma', 'html']);
gulp.task('dev', ['set-dev', 'js:watch', 'jstest:watch', 'karma', 'html', 'serve']);
gulp.task('default', ['dev']);
gulp.task('test', ['karma']);
