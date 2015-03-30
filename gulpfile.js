var browserify = require('browserify');
var gulp = require('gulp');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var notify = require("gulp-notify");
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return name + '.' + version + '.' + 'min';
};

var baseFile = './languages/index.js';

gulp.task('watch', function () {
    watch(['./{bin,languages}/*.js', './{languages,lib}/**/*.{js,swig}'], function () {
        notify({message: 'building'});
        gulp.start('build');
    });
});

gulp.task('watch:dist', function () {
    watch(['./dist/*.js', './test/*.html', './test/**/*.{raml,schema}'], function () {
        notify({message: 'reloading'});
        browserSync.reload();
    });
});

gulp.task('lint', function () {
    return gulp.src(['./{bin,languages}/*.js', './{languages,lib}/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build', ['lint'], function () {

    var bundler = browserify([baseFile], {
        debug: true,
        detectGlobals: true,
        standalone: 'RAML.Generator.WebService',
        extensions: ['js', 'json', 'swig']
    });

    //bundler.require(baseFile, {expose: 'raml-schema-generators'});
    bundler.transform('folderify');

    var bundle = function () {
        return bundler
            .bundle()
            .pipe(source(getBundleName() + '.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(uglify())
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./dist/'));
    };

    return bundle();
});

gulp.task('serve', ['watch:dist'], function () {

    browserSync({
        host: process.env.IP || 'localhost',
        port: process.env.PORT || 3000,
        server: {
            baseDir: './',
            index: 'test/parser.html'
        }
    });

});

gulp.task('default', ['build', 'watch', 'serve'], function () {

});