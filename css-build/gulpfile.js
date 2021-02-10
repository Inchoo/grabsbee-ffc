/* ===============
   PROJECT GRABSBEE
   =============== */

/* --- CSS COMPILER AND WATCHER FOR GRABSBEE PROJECT --- */

const gulp = require('gulp'),
    rename = require('gulp-rename'),
    postcss = require('gulp-postcss'),
    postcssPresetEnv = require('postcss-preset-env'),
    browserSync = require('browser-sync'),
    sourcemaps = require('gulp-sourcemaps'),
    cssFunctions = require('./functions/functions.js'),
    simpleVars = require('postcss-simple-vars'),
    mixins = require('postcss-mixins'),
    functions = require('postcss-functions')({
        functions: cssFunctions,
    }),
    atImport = require("postcss-import"),
    autoprefixer = require('autoprefixer'),
    mqpacker = require('css-mqpacker'),
    cssnano = require('cssnano'),
    gulpStylelint = require('gulp-stylelint'),
    config = require('./config.json'),
    lost = require('lost')

/* === BUILD TASKS === */

/* --- PostCSS processors for dev environment --- */

var processorsDev = [
    atImport({path: [config.css.inputPathParent]}),
    simpleVars({
        silent: true
    }),
    mixins,
    functions,
    postcssPresetEnv(config.css.pluginConfig.postcssPresetEnv),
    lost(),
    autoprefixer(config.browsers),
    mqpacker({
        sort: true
    })
];

/* --- PostCSS processors for production environment --- */

var processorsProd = [
    atImport({path: [config.css.inputPathParent]}),
    simpleVars({
        silent: true
    }),
    mixins,
    functions,
    postcssPresetEnv(config.css.pluginConfig.postcssPresetEnv),
    lost(),
    autoprefixer(config.browsers),
    mqpacker({
        sort: true
    }),
    cssnano(config.css.pluginConfig.cssNano)
];

/* --- DEV COMPILE --- */

gulp.task('css:compile:dev', function (done) {
    return gulp
        .src(config.css.inputPath + 'style.pcss')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.identityMap())
        .pipe(postcss(processorsDev))
        .pipe(rename({extname: ".css"}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.css.destPath))
        .pipe(browserSync.stream());
});

/* --- PRODUCTION COMPILE ( sourcemaps removed, NANO optimizer introduced ) --- */

gulp.task('css:compile:prod', function () {
    return gulp
        .src(config.css.inputPath + 'style.pcss')
        .pipe(postcss(processorsProd))
        .pipe(rename({extname: ".css"}))
        .pipe(gulp.dest(config.css.destPath))
        .pipe(browserSync.stream());
});

/* --- Browser Sync --- */

gulp.task('browser:sync', function () {
    return browserSync.init({
        proxy: config.projectUrl
    });
});

/* --- CSS Linter --- */

gulp.task('lint:css', function () {
    return gulp
        .src(config.css.inputPathAll)
        .pipe(gulpStylelint({
            reporters: [{formatter: 'string', console: true}]
        }));
});

/* --- Watchers --- */

gulp.task('css:watch:dev', function () {
    return gulp
        .watch(config.css.inputPathAll, gulp.series('css:compile:dev'));
});

gulp.task('css:watch:prod', function () {
    return gulp
        .watch(config.css.inputPathAll, gulp.series('css:compile:prod'));
});

/* --- Development/Production chained sets --- */

gulp.task("dev", gulp.series('css:compile:dev', gulp.parallel('css:watch:dev', 'browser:sync')));

gulp.task("prod", gulp.series('lint:css', 'css:compile:prod'));
