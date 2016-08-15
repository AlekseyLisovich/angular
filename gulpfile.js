var gulp = require('gulp');
var mergeStream = require('merge-stream');
var gutil = require('gulp-util');
var del = require('del');
var runSequence = require("run-sequence");

var g = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'gulp.*', 'main-bower-files'],
    replaceString: /\bgulp[\-.]/
});

gulp.task('bower:scripts', function() {
    var targetDir = './frontend/js';
    return gulp.src(g.mainBowerFiles({
            env: 'development',
            filter: /.*\.js$/i
        }))
        .pipe(g.plumber())
        .pipe(g.size({
            title: 'Components js total',
            showFiles: true
        }))
        .pipe(g.sourcemaps.init())
        .pipe(g.concat('lib.js'))
        .pipe(g.sourcemaps.write('.'))
        .pipe(g.size({
            title: 'Components js total minified',
            gzip: true
        }))
        .pipe(gulp.dest(targetDir));
});

gulp.task('assets:images', function() {
    var targetDir = './frontend/img';

    return gulp.src(['./assets/img/**'])
        .pipe(g.plumber())
        .pipe(gulp.dest(targetDir));
});

gulp.task('assets:styles', function() {
    var targetDir = './frontend/css';

    return gulp.src('./assets/styles/*.css')
        .pipe(g.plumber())
        .pipe(g.sourcemaps.init())
        .pipe(g.size({
            title: 'App styles total minified',
            gzip: true,
            showFiles: true
        }))
        .pipe(gulp.dest(targetDir));
});

gulp.task('app:scripts', function(cb) {
    var targetDir = './frontend/js';
    var templates = gulp.src(['./app/**/*.html'])
        .pipe(g.plumber())
        .pipe(g.size({
            title: 'App templates total',
            showFiles: false
        }))
        .pipe(g.angularTemplatecache({
            module: 'templates',
            standalone: true,
            root: '/static/views'
        }))
        .pipe(g.rename('templates.js'))
        .pipe(g.size({
            title: 'App templates total minified',
            showFiles: true
        }));

    var js = gulp.src(['./app/**/*.js', '!./app/**/*.spec.js'])
        .pipe(g.plumber())
        .pipe(g.size({
            title: 'App js total',
            showFiles: true
        }));

    return mergeStream(templates, js)
        .pipe(g.sourcemaps.init())
        .pipe(g.concat('app.js'))
        .pipe(g.sourcemaps.write('.'))
        .pipe(g.size({
            title: 'App js total minified',
            gzip: true
        }))
        .pipe(gulp.dest(targetDir));
});

gulp.task('app:partials', function(cb) {
    return gulp.src('./app/**/*.html').pipe(gulp.dest('./frontend/partials'));
});

gulp.task('assets:data', function(cb) {
    return gulp.src('./assets/data/**/*.json').pipe(gulp.dest('./frontend/data'));
});

gulp.task('clean', function(cb) {
    var targetDir = './frontend';

    return del('*', {
        cwd: targetDir,
        force: true
    }, cb || gutil.noop);
});

gulp.task('app:index', function(cb) {
    return gulp.src('index.html').pipe(gulp.dest('./frontend'));
});

gulp.task('app:build', ['bower:scripts', 'assets:images', 'assets:styles', 'assets:data', 'app:scripts', 'app:index', 'app:partials']);

gulp.task('build', function() {
    runSequence('clean', 'app:build');
});

gulp.task('watch', function() {
    gulp.watch('./app/**/*.js', ['build']);
});
