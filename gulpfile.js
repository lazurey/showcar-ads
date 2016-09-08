const gulp = require('gulp');
const browserSync = require('browser-sync').create();

var shouldWatch = false;

gulp.task('js', () => {
    const gulpRollup = require('gulp-rollup');
    const buble = require('rollup-plugin-buble');
    const uglify = require('rollup-plugin-uglify');
    const rollupConfig = {
        entry: './src/js/start.js',
        format: 'iife',
        plugins: [
            buble(),
            uglify()
        ]
    };

    return gulp.src('src/**/*.js')
        .pipe(gulpRollup(rollupConfig))
        .pipe(gulp.dest('dist'));
});

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
gulp.task('dev', ['watch', 'js', 'html', 'test', 'serve']);
gulp.task('default', ['serve']);
