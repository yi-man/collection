var gulp = require('gulp')
var gulpif = require('gulp-if')
var debug = require('gulp-debug')
var tinypng = require('gulp-tinypng-compress')

//一个月只能压缩500张图片
var key = 'HF9WnNu12-YHiOLq4ULAPQYqphDeX3vb'

var base = './'
var md5File = 'imgMd5Map'
var folders = [
  base + '**/images/*.{png,jpg,jpeg}',
  base + '**/images/**/*.{png,jpg,jpeg}'
]
var node_reg = /node_modules\//

var notNodeModules = function (file) {
  //file.path   file.content
  return !node_reg.test(file.path)
}

//图片压缩
gulp.task('tinypng', function () {
  folders.map(function (path) {
    gulp.src(path)
    .pipe(gulpif(notNodeModules, tinypng({
          key: key,
          sigFile: md5File,
          log: true,
          sameDest: true
        })))
      // .pipe(debug())
      .pipe(gulp.dest(base))
  })
})

//拼接头尾

//选择模块
