(function(){
	'use strict';
	var gulp = require('gulp');
	gulp.task('html2js',function(){
		var html2js = require('gulp-html2js');
		return gulp.src('app/partials/*.html')
				.pipe(html2js('partials.js',{
					adapter: 'angular',
					base: 'app/',
					name: 'partials'
				}))
				.pipe(gulp.dest('app/js/'));
	});
	gulp.task('concat',['html2js'],function(){
		var concat = require('gulp-concat');
		return gulp.src(['app/index.js','app/js/*.js'])
				.pipe(concat({
					path: 'index.js'
				}))
				.pipe(gulp.dest('dist'));
	});
	gulp.task('uglify',['concat'],function(){
		var uglify = require('gulp-uglify');
		return gulp.src('dist/index.js')
				.pipe(uglify())
				.pipe(gulp.dest('dist'));
	});
	gulp.task('processHtml',function(){
		var processhtml = require('gulp-processhtml');
		return gulp.src('app/index.html')
				.pipe(processhtml({}))
				.pipe(gulp.dest('dist'));
	});
	gulp.task('unit-test',function(done){
		var Server = require('karma').Server;
		new Server({
			configFile: __dirname + '/spec/unit/unit.conf.js',
			singleRun: true
		},done).start();
	});
	gulp.task('build',['uglify','processHtml']);
})();
/*
TODO
	-Change name of file after uglify to name.min.js
	-Load template directly on the unit test
*/