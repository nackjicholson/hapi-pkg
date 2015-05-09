'use strict';

var gulp = require('gulp');
var babel = require('gulp-babel');

gulp.task('transpile', ['lint-es6'], function() {
  return gulp.src(['es6/**/*.js', '!es6/test/**'])
    .pipe(babel({optional: 'runtime'}))
    .pipe(gulp.dest('es5/'));
});
