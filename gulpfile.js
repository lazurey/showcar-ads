const gulp = require('gulp');
const browserSync = require('browser-sync').create();

var shouldWatch = false;

gulp.task('js', () => {
    const babel = require('gulp-babel');
    const uglify = require('gulp-uglify');

    return gulp.src('src/index.js')
                .pipe(babel({ presets: ['es2015'] }))
                .pipe(uglify())
                .pipe(gulp.dest('dist'));

});

gulp.task('watch', () => {

    shouldWatch = true;

    gulp.watch('src/**/*.js', ['js', 'html']);
    gulp.watch("src/**/*.html", ['html']);
    gulp.watch("dist/**/*").on('change', browserSync.reload);
});

gulp.task('test', function (done) {
    const Xvfb = require('xvfb');
    const xvfb = new Xvfb();
    xvfb.startSync();

    const Server = require('karma').Server;
    new Server({
        configFile: __dirname + '/karma.conf.js',
        singleRun: !shouldWatch
    }, () => {
        xvfb.stopSync();
        done();
    }).start();
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
