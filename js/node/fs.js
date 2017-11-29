/**
 * Created by xuxin on 16/6/21.
 */

function readTraversal (base, cb) {
  fs.readdir(base, function(err, files) {
    if (err) {
      console.log(err);
      return;
    }

    files.forEach(function (filename) {
      filename = base + '/' + filename
      fs.stat(filename, function (err, stats) {
        if (err) {
          console.log(err);
          return;
        }

        if (stats.isFile()) {
          console.log(filename)
          var reg=/\.(?:jpg|png|jpeg)$/
          if (!reg.test(filename)) return;

          cb.call(this, filename)
          //gulp.src(filename)
          //  .pipe(tinypng({
          //    key: key,
          //    sigFile: md5File,
          //    log: true,
          //    sameDest: true
          //  }))
          //  // .pipe(debug())
          //  .pipe(gulp.dest(base))
        }
        else if (stats.isDirectory ()) {
          readTraversal(filename)
        }
      });
    });
  });
}