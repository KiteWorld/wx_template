// gulp 配置文件
var gulp = require('gulp');

var postcss = require('gulp-postcss');

var pxtorem = require('postcss-pxtransform');

gulp.task('css', function () {

  var processors = [

    pxtorem({

      platform: 'weapp',

      designWidth: 750,

    })

  ];


  //根据自己的 vant 构建路径来
  return gulp.src(['miniprogram_npm/@vant/weapp/**/*.wxss'])
    .pipe(postcss(processors))
    .pipe(gulp.dest('miniprogram_npm/@vant/weapp/'));
});