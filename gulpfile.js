/**
 * Created by xuxin on 16/10/19.
 */
var gulp = require('gulp')
var concat = require('gulp-concat');
var uglify = require('gulp-uglify')

gulp.task('concat', function() {
  return gulp.src('./test/rollup/common/*.js')
    .pipe(concat('all.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/'));
});