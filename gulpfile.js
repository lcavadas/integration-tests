/*global require:true, process:true, exports:true */
const gulp = require('gulp');
const cucumber = require('gulp-cucumber');

function functional() {
  let file;
  process.argv.forEach(function (val) {
    if (val.indexOf('--file') === 0) {
      file = val.substring(7);
    }
  });

  return gulp.src([file || 'functional/**/*.feature'])
    .pipe(
      cucumber({
        'steps': 'functional/step_definitions/**/*.js',
        'format': './node_modules/cucumber-pretty'
      })
    );
}

exports.functional = functional;
