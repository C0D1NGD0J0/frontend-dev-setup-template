'use strict';
const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
sass.compiler = require('node-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const imageminPngquant = require('imagemin-pngquant');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');

// File path
const SCRIPTS_SRC_PATH = 'public/scripts/**/*.js';
const SCSS_SRC_PATH = 'public/scss/**/*.scss';
const IMAGES_PATH = 'public/images/**/*.{jpg,jpeg,svg,png,gif}';

// STATIC SERVER
gulp.task('server', function() {
  browserSync.init({
    server: {
    	baseDir: "./"
    }
  });

	gulp.watch(SCSS_SRC_PATH, gulp.series('sass'));
  gulp.watch(SCRIPTS_SRC_PATH, gulp.series('scripts'));
	gulp.watch('./*.html').on('change', browserSync.reload);
});

// SCSS processing
gulp.task('sass', function(){
	console.log('starting styles task');

	return gulp.src('public/scss/style.scss')
		.pipe(plumber()) //error display
		.pipe(sourcemaps.init())
		.pipe(autoprefixer()) //auto prefixer 
		.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/css/'))
		.pipe(browserSync.stream());
});

// JAVASCRIPT processing
gulp.task('scripts', function(){
	console.log('starting scripts task');

	return gulp.src(SCRIPTS_SRC_PATH)
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['@babel/env']
		}))
		.pipe(uglify())
		.pipe(concat("main.js"))
    .pipe(sourcemaps.write())
		.pipe(gulp.dest('dist/js/'))
		.pipe(browserSync.stream());
});

// IMAGE processing
gulp.task('images', function(done){
	console.log('starting image processing task');
	
	return gulp.src(IMAGES_PATH)
		.pipe(imagemin([
			imagemin.gifsicle(),
			imagemin.jpegtran(),
			imagemin.optipng(),
			imagemin.svgo(),
			imageminPngquant(),
			imageminJpegRecompress()
		]))
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default', gulp.parallel('server', 'sass', 'scripts', 'images'));