const gulp = require('gulp');
const gulpClean = require('gulp-clean');
const gulpHtmlMin = require('gulp-htmlmin');
const replace = require('gulp-replace');
const rev = require('gulp-rev');
const revCollector = require('gulp-rev-collector');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const mincss = require('gulp-clean-css');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
var browserSync = require('browser-sync').create();

/**
 * 思路：
 * 0、注册gulp事件、绑定default执行事件
 * 1、清除目的文件夹
 * 2、处理每种类型文件
 * 2.1、js
 * 2.2、image
 * 2.3、css
 * 2.4、html
 *    压缩
 * 3、打包压缩至目的文件夹
 */

const srcPath = '../src';
const destPath = 'dest';

gulp.task('cleanFile', function(){
    return gulp.src(destPath, {read: false, allowEmpty: true}).pipe(gulpClean());
});

gulp.task('minJs', function () {
    //压缩js文件，且将es6语法转换为es5
    return gulp.src(`${srcPath}/**/*.js`)
        // .pipe(babel({"presets": ["@babel/preset-env"]})) // TODO：es6语法转换为es5 有误，待处理；可能是babel版本问题或配置不标准
        .pipe(uglify())
        .pipe(rev()) // md5
        .pipe(gulp.dest(`${destPath}`))
        .pipe(rev.manifest({
            path: `${destPath}/rev-manifest.json`,  // 需要配合merge使用
            merge: true
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('images', function () {
    return gulp.src(`${srcPath}/imgs/**`)
        .pipe(gulp.dest(`${destPath}/imgs`))
});

gulp.task('minCss', function () {
    //合并文件
    return gulp.src(`${srcPath}/css/*.css`)
        .pipe(postcss([autoprefixer()])) // 配合package.json的 browserslist
        .pipe(mincss())
        .pipe(rev())
        .pipe(gulp.dest(`${destPath}/css`))
        .pipe(rev.manifest({
            path: `${destPath}/rev-manifest.json`,
            merge: true
        }))
        .pipe(gulp.dest('./'))
});

gulp.task('minHtmlFile', function(){
    return gulp.src([`${destPath}/*.json`, `${srcPath}/html/*.html`]).pipe(gulpHtmlMin({
        collapseWhitespace: true,    //删除空格  
        removeComments: true,    //删除注释
    }))
    .pipe(replace(`${srcPath}/`, './')) // 打包后对应的目录
    .pipe(revCollector({
        replaceReved: true,  //替换html中对应的记录
    }))    
    .pipe(gulp.dest(`${destPath}/html/`))
});

gulp.task('minHtml', function(){
    return gulp.src([`${destPath}/*.json`, `${srcPath}/*.html`]).pipe(gulpHtmlMin({
        collapseWhitespace: true,    //删除空格  
        removeComments: true,    //删除注释
    }))
    .pipe(replace(`${srcPath}/`, './')) // 打包后对应的目录
    .pipe(revCollector({
        replaceReved: true,  //替换html中对应的记录
        // dirReplacements: {
        //     './html/': './'
        // }
    }))    
    .pipe(gulp.dest(destPath))
});

gulp.task("reload", function () {
    return gulp.src(`${destPath}/**/*`).pipe(browserSync.reload()); //页面重新加载
});

gulp.task('watch', function() {
    gulp.watch(`${srcPath}/*.html`, gulp.series('minHtml'));
    gulp.watch(`${srcPath}/html/*.html`, gulp.series('minHtmlFile'));
    gulp.watch(`${srcPath}/css/**/*.css`, gulp.series('minCss'));
    gulp.watch(`${srcPath}/js/**/*.js`, gulp.series('minJs'));
    gulp.watch(`${srcPath}/imgs/**/*`, gulp.series('images'));
    gulp.watch(`${destPath}/**/*`, gulp.series('reload'));
    // gulp.watch(`${destPath}/**/*`, gulp.series('reload')).on('change', function(e){
    //     // console.log('e ---> ', e); // 所有监听到的文件地址
    //     browserSync.reload();
    // });
});

gulp.task('browser', function(){
    browserSync.init({
        server: './dest',    // 访问目录
        port: 3000,
        // proxy: "你的域名或IP"    // 设置代理
    });
 });

gulp.task('default', gulp.series('cleanFile',
    gulp.parallel('minJs', 'minCss', 'images'),
    gulp.parallel('minHtmlFile', 'minHtml'),
    gulp.parallel('browser', 'watch'))
);