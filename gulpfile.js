var browserify = require('browserify');
var gulp = require('gulp');
var util = require('util');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var watch = require('gulp-watch');
var run = require('gulp-run');
var notify = require("gulp-notify");
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var shell = require('gulp-shell');
var electron = require('gulp-electron');
var packageJson = require('./package.json');

var getBundleName = function () {
    var version = require('./package.json').version;
    var name = require('./package.json').name;
    return name + '.' + version + '.' + 'min';
};

var baseFile = './src/languages/index.js';

gulp.task('watch', function () {
    watch(['./{bin,src/languages}/*.js', './{src/languages,lib}/**/*.{js,swig}'], function () {
        gulp.start('build:js');
    });
});

gulp.task('watch:dist', function () {
    watch(['./dist/*.js', './test/*.html', './test/**/*.{raml,schema}'], function () {
        browserSync.reload();
    });
});

gulp.task('watch:build-fixtures', function () {
    watch(['./{bin,src/languages}/*.js', './{src/languages,lib}/**/*.{js,swig}', './test/**/*.{raml,schema}'], function () {

        var fixtureName = process.env.GENERATOR_FIXTURE || 'movies';
        var outputDir = process.env.GENERATOR_OUTPUT || __dirname + '/test/output/' + fixtureName;
        var command = util.format('node %s/bin/raml-to-webservice.js %s/test/fixtures/%s/api.raml -l phpSilex -o %s', __dirname, __dirname, fixtureName, outputDir);

        run(command).exec();
    });
});

gulp.task('lint', function () {
    return gulp.src(['./{bin,src/languages}/*.js', './{src/languages,lib}/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('build:js', ['lint'], function () {

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


gulp.task('build:all', ['build:js', 'build:apps']);

gulp.task('build:apps', function () {

    gulp.src("")
        .pipe(electron({
            src: './src',
            packageJson: packageJson,
            release: './release',
            cache: './cache',
            version: packageJson.version,
            packaging: true,
            platforms: ['darwin-x64'],
            //platforms: ['win32-ia32', 'darwin-x64', 'linux-ia32'],
            platformResources: {
                darwin: {
                    CFBundleDisplayName: packageJson.name,
                    CFBundleIdentifier: packageJson.name,
                    CFBundleName: packageJson.name,
                    CFBundleVersion: packageJson.version,
                    icon: 'ui/generator/favicon.icns'
                },
                win: {
                    "version-string": packageJson.version,
                    "file-version": packageJson.version,
                    "product-version": packageJson.version,
                    "icon": 'ui/generator/favicon.ico'
                }
            }
        }))
        .pipe(gulp.dest(""));
});

gulp.task('default', ['build:js', 'watch', 'serve'], function () {

});

gulp.task('fixtures', ['lint', 'watch:build-fixtures'], function () {

});