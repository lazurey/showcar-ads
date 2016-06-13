const gulp = require('gulp');
const browserSync = require('browser-sync').create();

gulp.task('js', () => {
    const babel = require('gulp-babel');
    const uglify = require('gulp-uglify');

    gulp.watch('src/index.js', ['js', 'html']);

    gulp.watch("dist/**/*.js").on('change', browserSync.reload);

    return gulp.src('src/index.js')
    .pipe(babel({ presets: ['es2015'] }))
    .pipe(uglify())
    .pipe(gulp.dest('dist'));

});

gulp.task('test', function (done) {
    const Server = require('karma').Server;
    new Server({
        configFile: __dirname + '/karma.conf.js',
        //singleRun: true
    }, done).start();
});

gulp.task('html', ['js'], () => {
    const smoosher = require('gulp-smoosher');
    const foreach = require('gulp-foreach');

    gulp.watch("src/**/*.{html,js}", ['html']);
    gulp.watch("dist/**/*.html").on('change', browserSync.reload);

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

gulp.task('default', ['serve'])
