'use strict';

var gulp = require('gulp');
var isparta = require('isparta');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');

function test() {
  return gulp.src(['es6/test/**/*.js']).pipe(mocha());
}

gulp.task('coverage', ['lint-es6', 'lint-es6-test'], function(done) {
  require('babel/register')({ modules: 'common' });
  gulp
    .src(['es6/**/*.js', '!es6/test/**'])
    .pipe(istanbul({ instrumenter: isparta.Instrumenter }))
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      return test()
        .pipe(istanbul.writeReports())
        .on('end', done);
    });
});

gulp.task('test', ['lint-es6', 'lint-es6-test'], function() {
  require('babel/register')({ modules: 'common' });
  return test();
});
