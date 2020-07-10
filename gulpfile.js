// 打包配置文件
// 导入第三方配置文件,
// 第三方需要下载
const gulp=require("gulp");
const cssmin=require("gulp-cssmin");
const autoprefixer=require("gulp-autoprefixer");
const sass=require("gulp-sass");
const uglify=require("gulp-uglify")
const babel=require("gulp-babel");
const htmlmin=require("gulp-htmlmin")
const del=require("del")
const webserver=require('gulp-webserver')
const fileInclude=require("gulp-file-include")

// 打包配置
const cssHandler=function(){
    return gulp.src('./src/css/*.css').pipe(cssmin()).pipe(autoprefixer({
        browsers:['last 2 version']
    })).pipe(gulp.dest('./dist/css'))
}
// 导出打包配置
const jsHandler=function(){
    return gulp
    .src('./src/js/*.js')
    .pipe(babel({
        presets:['@babel/env']
    }))
    .pipe(uglify())
    .pipe(
        gulp.dest('./dist/js')
    )
}
const htmlHandler=function(){
    return gulp
    .src('./src/views/*.html')
    .pipe(fileInclude({
        prefix:'!!',
        basepath:'./src/components'

    }))
    .pipe(htmlmin({
        collapseWhitespace:true,
        collapseBooleanAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        removeAttributeQuotes:true,
        minifyCSS:true,
        minifyJS:true,
    }))
    .pipe(gulp.dest('./dist/views'))
}

const sassHandler=function(){
    return gulp
    .src('./src/sass/*.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cssmin())
    .pipe(gulp.dest('./dist/sass'))
}
const delHandler=function(){
    return del(['./dist'])
}
const browsersHandler=function(){
    return gulp
    .src('./dist')
    .pipe(webserver({
        host:'www.wangyue.com',
        port:8080,
        open:'views/index.html',
        livereload:true,
        proxies:[
            {
                source:'/wy',
                target:'https://www.duitang.com/napi/blog/list/by_filter_id/'
            },{
                source:'php',
                target:'http://localhost:80/test.php'
            }
        ]
    }))
}

const watchHandler=function(){
    gulp.watch('./src/css/*.css',cssHandler)
    gulp.watch('./src/js/*.js',jsHandler)
    gulp.watch('./src/sass/*.scss',sassHandler)
    gulp.watch('./src/components/*.html',htmlHandler)
}

module.exports.default=gulp.series(
    delHandler,
    gulp.parallel(cssHandler,sassHandler,jsHandler,htmlHandler),
    browsersHandler,watchHandler
)
