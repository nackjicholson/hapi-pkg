'use strict';

var gulp = require('gulp');
var plumber = require('gulp-plumber');
var jshint = require('gulp-jshint');

function createLintTask(taskName, files) {
  gulp.task(taskName, function() {
    return gulp.src(files)
      .pipe(plumber())
      .pipe(jshint())
      .pipe(jshint.reporter('jshint-stylish'))
      .pipe(jshint.reporter('fail'));
  });
}

// Lint our source code
createLintTask('lint-es6', ['es6/**/*.js']);

// Lint our test code
createLintTask('lint-es6-test', ['es6/test/**/*.js']);

gulp.task('lint', function() {
  gulp.watch(['es6/**/*', 'es6/test/**/*.js'], ['lint-es6', 'lint-es6-test']);
});
