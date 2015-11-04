var _ = require('lodash'),
    path = require('path'),
    del = require('del'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    include = require('gulp-include'),
    concat = require('gulp-concat'),
    bower = require('gulp-bower'),
    watch = require('gulp-watch');

var config = {
    // Source Config
    loc_bower: './bower_components/',
    loc_stylesheets: './src/stylesheets/',               // Source Styles Sheets Directory
    loc_javascripts: './src/javascripts/',
    // Vendor Sources
    vend_main_css: 'vendor.css',
    // Destination Config
    dist_javascripts: './dist/javascripts/',                      // Destination Javascripts Directory
    dist_stylesheets: './dist/stylesheets/',                              // Destination Styles Sheets Directory
    // Auto Prefixer
    autoprefix: 'last 3 version',                      // Number of version Auto Prefixer to use
};

var files = {
    vend_stylesheets: [
        config.loc_bower + '/normalize-css/normalize.css'
    ],
};

// Bower
gulp.task('bower', function () {
    return bower()
        .pipe(gulp.dest(config.loc_bower))
});

// Vendor
gulp.task('vendor', function () {
    return gulp.src(files.vend_stylesheets)
        .pipe(concat(config.vend_main_css))
        .pipe(minify())
        .pipe(gulp.dest(config.dist_stylesheets))
});

// Styles
gulp.task('styles', function () {
    return gulp.src(path.join(config.loc_stylesheets, '/*.scss'))
        .pipe(sourcemaps.init())
        .pipe(sass({
            outputStyle: 'expanded',
            precision: 10,
            includePaths: [config.loc_bower],
            errLogToConsole: true
        }).on('error', sass.logError))
        .pipe(autoprefixer(config.autoprefix))
        .pipe(minify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dist_stylesheets))
});

// Scripts
gulp.task('scripts', function () {
    return gulp.src(path.join(config.loc_javascripts, '/[^_]*.js'))
        .pipe(include())
        .pipe(uglify())
        .pipe(gulp.dest(config.dist_javascripts))
});

// Clean
gulp.task('clean', function (done) {
    del([config.dist_javascripts, config.dist_stylesheets], done);
});

// Watch
gulp.task('watch', function () {
    gulp.watch(path.join(config.loc_javascripts, '/**/*.js'), gulp.series('scripts'));
    gulp.watch(path.join(config.loc_stylesheets, '/**/*.scss'), gulp.series('styles'));
});

// Build
gulp.task('build', gulp.series(
    'bower',
    'clean',
    gulp.parallel('vendor', 'styles', 'scripts')
));

gulp.task('default', gulp.series(
    'build',
    'watch'
));
