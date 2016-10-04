'use strict';
var assemble = require('assemble');
var htmlmin = require('gulp-htmlmin');
var extname = require('gulp-extname');

var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');

const babel = require('gulp-babel');

var watch = require( 'base-watch' );

var app = assemble();
app.use(watch());

app.task('templates', function() {
  app.pages('src/templates/*.hbs');
  return app.toStream('pages')
    .pipe(app.renderFile())
    .pipe(htmlmin())
    .pipe(extname())
    .pipe(app.dest('dist'));
});

app.task('assets', function() {
  return app.copy('src/assets/**', 'dist/assets');
});

app.task('styles', function() {
  return app.src('src/styles/**/*.css')
    .pipe(sourcemaps.init())
    .pipe(postcss([ require('postcss-cssnext'), require('precss') ]))
    .pipe(sourcemaps.write('.'))
    .pipe(app.dest('dist/css'));
});

app.task('scripts', function() {
  return app.src('src/scripts/**')
    .pipe(babel({presets: ['es2015']}))
    .pipe(app.dest('dist/scripts'));
});

app.task('watch', function() {
  app.watch('src/templates/*.hbs', ['templates']);
  app.watch('src/assets/**', ['assets']);
  app.watch('src/styles/**/*.css', ['styles']);
  app.watch('src/scripts/**', ['scripts']);
});

app.task('build', ['templates', 'assets', 'styles', 'scripts']);

module.exports = app;
