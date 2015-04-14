var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var sequence = require('run-sequence');
var uglify = require('gulp-uglify');
var header = require('gulp-header');
var ngmin = require('gulp-ngmin');
var stripDebug = require('gulp-strip-debug');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var manifest = require('gulp-manifest');
var pkg = require('./package.json');

var banner = [
  '/**',
  ' ** <%= pkg.name %> - <%= pkg.description %>',
  ' ** @author <%= pkg.author %>',
  ' ** @version v<%= pkg.version %>',
  ' **/',
  ''
].join('\n');

var paths = {
  sass: ['./www/scss/**/*.scss'],
  js: ['./www/js/**/*.js'],
  mockjs: [
    './www/js/mockData.js',
    './www/lib/mockjs/dist/mock-min.js',
    './www/lib/mock.angular.js',
    './www/lib/ng-file-upload/angular-file-upload.min.js'
  ],
  ngjs: [
    './www/lib/angular-notify/dist/angular-notify.min.js',
    './www/js/util.js',
    './www/js/component.js',
    './www/js/services/service.js',
    './www/js/filters/filter.js',
    './www/js/directives/directive.js',
    './www/js/app.js',
    './www/js/config.js',
    './www/js/config.api.js',
    './www/js/config.permission.js',

    // routers
    './www/js/routers/router.js',
    './www/js/routers/account.js',
    './www/js/routers/financing.js',
    './www/js/routers/money.js',
    './www/js/routers/seopages.js',
    
    //controllers
    './www/js/controllers/app.js',
    './www/js/controllers/account.js',
    './www/js/controllers/financing.js',
    './www/js/controllers/money.js',
    './www/js/controllers/seopages.js'
  ],
  libcss: [
    './www/lib/ionic/css/ionic.min.css',
    './www/lib/angular-notify/dist/angular-notify.min.css'
  ]
};

// 项目构建
gulp.task('build', function(){
  sh.exec('gulp compass'); // 编译scss文件
  sh.exec('gulp jshint'); // 检测js文件是否符合规范
});

// 项目发布
gulp.task('release', function(done){
  sh.exec('gulp jshint'); // 检测js文件是否符合规范
  sh.exec('gulp clean'); // 清理dist目录
  sh.exec('gulp compass'); // 编译scss文件
  sh.exec('gulp uglify'); // 压缩常规js
  sh.exec('gulp ngmin'); // 压缩angular的js
  //sh.exec('gulp imagemin'); // 压缩图片(测试机器glibc版本太低了 暂不支持 先去掉)
  sh.exec('gulp copy'); // 拷贝任务
  sh.exec('gulp cssmin'); // 压缩dist里面的css文件并生成sourcemap 这样可以不管compass用什么模式 确保dist中的css是最小的
  sh.exec('gulp htmlmin'); // 压缩html文件到dist目录
  sh.exec('gulp manifest'); // 动态生成manifest文件
});

// 编译scss文件，依赖ruby及compass环境
gulp.task('compass', function() {
  sh.cd('www');
  sh.exec('compass compile --force');
});

//拷贝src
gulp.task('copy', function() {
  // copy css
  gulp.src(['./www/css/**/*.css', './www/lib/angular-notify/dist/angular-notify.min.css'])
    .pipe(gulp.dest('./www/dist/css/'));

  // copy images
  gulp.src(['./www/images/*.png', './www/images/*.jpg', './www/images/*.jpeg'])
    .pipe(gulp.dest('./www/dist/images/'));

  // copy fonts of ionic
  gulp.src('./www/lib/ionic/fonts/**/*')
    .pipe(gulp.dest('./www/dist/fonts/'));

  // 将index.min.html拷贝到dist目录
  gulp.src('./www/index.min.html')
    .pipe(gulp.dest('./www/dist/'));

  // 将ionic的js库copy到dist目录
  gulp.src('./www/lib/ionic/js/ionic.bundle.min.js')
    .pipe(gulp.dest('./www/dist/js'));
});

// 压缩angular代码
gulp.task('ngmin', function() {
  return gulp.src(paths['ngjs'])
    .pipe(ngmin({ dynamic: false}))
    .pipe(stripDebug())
    .pipe(uglify({ outSourceMap: false, mangle: false}))
    .pipe(concat('ng.min.js'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./www/dist/js/'))
});

// 压缩普通js代码
gulp.task('uglify', function(){
  return gulp.src(paths['mockjs'])
    .pipe(uglify({ outSourceMap: false}))
    .pipe(concat('mock.min.js'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./www/dist/js/'))
});

// 压缩css
gulp.task('cssmin', function() {
  // 自己的css文件
  gulp.src('./www/dist/css/*.css')
    .pipe(minifyCss())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./www/dist/css/'));

  // 第三方库的css文件
  gulp.src(paths['libcss'])
    .pipe(minifyCss())
    .pipe(concat('libcss.min.css'))
    .pipe(header(banner, {pkg: pkg}))
    .pipe(gulp.dest('./www/dist/css/'));
});

gulp.task('htmlmin', function(){
  gulp.src(['./www/templates/**/*.html', '!./www/templates/static/*.html'])
    .pipe(htmlmin({collapseWhitespace: true, ignorePath: '/static'}))
    .pipe(gulp.dest('./www/dist/templates/'))
});

// 压缩图片
gulp.task('imagemin', function () {
  return gulp.src('./www/images/*.png')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./www/dist/images'))
});

// jslint检测js代码
gulp.task('jshint', function() { 
  return gulp.src(paths['js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .on('error', function(error) {
      console.error(String(error))
    })
});

gulp.task('manifest', function(){
  return gulp.src(['./www/dist/**/*'])
    .pipe(manifest({
      hash: true,
      timestamp: true,
      preferOnline: true,
      network: ['*'],
      filename: 'cache.manifest'
     }))
    .pipe(gulp.dest('./www/dist/'));
});

// 清理文件
gulp.task('clean', function () {
  // read false 不读取文件 加快速度
  return gulp.src('./www/dist/', {read: false})
    .pipe(clean())
});

// Static server
gulp.task('serve', function() {
  browserSync({
    server: { 
      baseDir: "./www/"
    }
  });
  gulp.watch(["./www/**/*.html", "./www/**/*.css", "./www/**/*.js"]).on('change', reload);
});

// 监听文件变化
gulp.task('watch', function() {
  gulp.watch(paths.sass, ['compass']); // scss文件变化 重新编译
  gulp.watch(paths.js, ['jshint']); // js文件变化 执行jshint
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

// git stash、git pull、git stash pop、git add -A
gulp.task('git-add', function(done){
  if(sh.which('git')){
    sh.exec('git status');
    sh.exec('git stash');
    sh.exec('git pull');
    sh.exec('git stash pop');
    sh.exec('git add -A');
  }
});
