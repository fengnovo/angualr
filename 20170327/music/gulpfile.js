var BUILD_DIR = 'web';

// 引入 gulp
var gulp = require('gulp');
 
// 引入组件
var del = require('del'),
  browserSync = require('browser-sync').create(),
  historyApiFallback = require('connect-history-api-fallback'),
  
  minimist = require('minimist'),
  gulpif = require('gulp-if'),
  runSequence = require('run-sequence'),
  rev =  require('gulp-rev'),
  revCollector = require('gulp-rev-collector'),

  header = require('gulp-header'),
  minifyHTML   = require('gulp-minify-html'),
  minifycss = require('gulp-minify-css'),//css压缩
  uglify = require('gulp-uglify'),//js压缩
  concat = require('gulp-concat'),//文件合并
  rename = require('gulp-rename'),//文件更名
  notify = require('gulp-notify');//提示信息

var argv = minimist(process.argv.slice(2), { boolean: true });

console.dir(argv);

gulp.task('browser', function () {
  var proxyMiddleware = require('http-proxy-middleware');
  // var proxyOption = {
  //   target: 'http://10.2.122.58:88',
  //   router: {
  //       '/webinfo' : 'http://10.2.124.210:9771'
  //   }
  // };
  var proxyOption = {
    target: 'http://10.2.124.210:9000',
    router: {
        '/webinfo' : 'http://10.2.124.210:9771'
    }
  };
  var proxy = proxyMiddleware('/pod', proxyOption);
  var proxy1 = proxyMiddleware('/webinfo', {target: 'http://10.2.124.210:9771'});
  // var proxy = proxyMiddleware('/api', {target: 'http://10.2.122.58:88/'});

  browserSync.init({
        server: {
            baseDir: "./" + BUILD_DIR,
            port: 3000,
            middleware: [proxy1, proxy]
            // middleware: [historyApiFallback(), proxy]
        }
  });
});

gulp.task('clean', function () {
    return del([
        BUILD_DIR
    ], { force: true });
});

gulp.task('copy_scjs', function() {   //复制神策统计
  return gulp.src('public/js/vendor/sensorsdata.min.js')
    .pipe(gulpif(argv.dist, uglify()))
    .pipe(gulp.dest('web/js'));
});

gulp.task('copy_audiojs', function() {
  gulp.run("copy_scjs");
  return gulp.src('public/js/component/audio.js')
    .pipe(gulpif(argv.dist, uglify()))
    .pipe(gulp.dest('web/js'));
});
// 复制
gulp.task('copy', function() {
    gulp.run("copy_audiojs");
    gulp.src(['public/img/**/*'], {base: 'public'})
      .pipe(gulp.dest('web/'));
    return gulp.src(['public/partials/*.html', 'public/index.html'], {base: 'public'})
      .pipe(gulpif(argv.dist, minifyHTML({
        empty:true,
        spare:true
      })))
      .pipe(gulp.dest('web/'));
});

var fileTimeStamp = argv.dist ? '/* <%= timeStr %> ---- release */\n' : '/* <%= timeStr %> ---- dev */\n';
 
// 合并、压缩、重命名css
gulp.task('css', function() {
  return gulp.src('public/css/*.css')
    .pipe(concat('main.css'))
    .pipe(header(fileTimeStamp, {timeStr: (new Date()).toLocaleString()}))
    // .pipe(gulpif(argv.dist, rename({ suffix: '.min' })))
    .pipe(gulpif(argv.dist, minifycss()))
    .pipe(gulp.dest('web/css'))  
    .pipe(notify({ message: 'css task ok' }));
});


// 检查js
/*gulp.task('lint', function() {
  return gulp.src('public/js/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(notify({ message: 'lint task ok' }));
});*/

// 合并、压缩js文件
gulp.task('lib_js', function() {
  return gulp.src(['public/js/vendor/zepto.js', 'public/js/vendor/iscroll.js', 
    'public/js/vendor/angular.js', 'public/js/vendor/cookie.min.js', 
    'public/js/vendor/hammer.js'/*,'public/js/vendor/fastclick.js'*/])
    .pipe(concat('lib.js'))
    // .pipe(gulp.dest('web/js'))
    // .pipe(gulpif(argv.dist, rename({ suffix: '.min' })))
    .pipe(gulpif(argv.dist, uglify()))
    .pipe(gulp.dest('web/js/'))
    .pipe(notify({ message: 'js task ok' }));
});

gulp.task('user_js', function() {
  return gulp.src(['public/js/script.js', 'public/js/controllers/*.js'])
    .pipe(concat('main.js'))
    .pipe(header(fileTimeStamp, {timeStr: (new Date()).toLocaleString()}))
    // .pipe(gulpif(argv.dist, rename({ suffix: '.min' })))
    .pipe(gulpif(argv.dist, uglify()))
    .pipe(gulp.dest('web/js'))
    .pipe(notify({ message: 'js task ok' }));
});
gulp.task('rev', function() {
  return gulp.src(['web/js/*.js', 'web/css/*.css'], {base: 'web'})
    .pipe(rev())
    .pipe(gulp.dest('web/'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('web/'))
    // .pipe(del(['web/js/main.js', 'web/js/lib.js', 'web/js/audio.js', 'web/css/main.css']))
    .pipe(notify({ message: 'rev task ok' }));
});
gulp.task('rev_collector', function() {
  del(['web/js/main.js', 'web/js/lib.js', 'web/js/audio.js',  'web/css/main.css'], { force: true });
  return gulp.src(['web/rev-manifest.json', 'public/index.html', 'web/js/main-*.js'], {base: 'web'})
    .pipe(revCollector({
      replaceReved: true
    }))
    .pipe(gulp.dest('web/'))
    .pipe(notify({ message: 'rev collector task ok' }));
});


 
// 默认任务
gulp.task('default', function (cb) {
  runSequence('clean', 'copy', 'css', 'lib_js', 'user_js', 'browser', cb);

  // Watch .html files
    gulp.watch(['public/index.html', 'public/partials/*.html',
      'public/js/component/audio.js', 'public/js/vendor/sensorsdata.min.js', 'public/news/*'
    ], ['copy']);
 
    // Watch .css files
    gulp.watch('public/css/*.css', ['css']);
 
    // Watch .js files
    gulp.watch('public/js/controllers/*.js', ['user_js']);
});

// 发布任务
gulp.task('build', function (cb) {
  runSequence('clean', 'copy', 'css', 'lib_js', 'user_js', 'browser', cb);
});