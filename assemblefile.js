'use strict';
var assemble = require('assemble');
var babel = require('gulp-babel');
var extname = require('gulp-extname');
var htmlmin = require('gulp-htmlmin');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var watch = require( 'base-watch' );
var webserver = require('gulp-webserver');
var data = require('./src/data/data-object.js');

var app = assemble();
app.use(watch());

app.task('templates', function() {
  app.pages('src/templates/*.hbs');
  return app.toStream('pages')
    .pipe(app.renderFile(data))
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
    .pipe(app.dest('dist/styles'));
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

  app.src('./dist')
    .pipe(webserver({
      livereload: true,
      fallback: 'index.html',
      open: true
    }))
});

app.task('build', ['templates', 'assets', 'styles', 'scripts']);

module.exports = app;
