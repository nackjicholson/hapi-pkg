var gulp = require('gulp');
var jscs = require('gulp-jscs');
var plumber = require('gulp-plumber');

gulp.task('jscs', function() {
  return gulp.src(['es6/**/*.js', 'es6/test/**/*.js'])
    .pipe(plumber())
    .pipe(jscs());
});
