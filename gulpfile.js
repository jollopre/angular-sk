(function(){
	'use strict';
	var gulp = require('gulp');
	var fs = require('fs');
	var runSequence = require('run-sequence');

	function readPackageFile(successCb,errorCb){
		if(typeof successCb !== 'function' || typeof errorCb !== 'function') return ;
		fs.readFile('package.json','utf8',function(err, data) {
			if(err) errorCb('package.json cannot be read');
			else successCb(JSON.parse(data));
		});
	}
	gulp.task('html2js',function(){
		var html2js = require('gulp-html2js');
		return gulp.src('app/partials/*.html')
				.pipe(html2js('partials.js',{
					adapter: 'angular',
					base: 'app/',
					name: 'partials'
				}))
				.pipe(gulp.dest('dist'));
	});
	gulp.task('concat',function(){
		var concat = require('gulp-concat');
		return gulp.src(['app/index.js','app/js/*.js','dist/partials.js'])
				.pipe(concat({
					path: 'index.js'
				}))
				.pipe(gulp.dest('dist'));
	});
	gulp.task('uglify',function(){
		var rename = require('gulp-rename');
		var uglify = require('gulp-uglify');
		return gulp.src('dist/index.js')
				.pipe(rename('index.min.js'))
				.pipe(uglify())
				.pipe(gulp.dest('dist'));
	});
	gulp.task('header',function(){
		var header = require('gulp-header');
		readPackageFile(
			function(data){
				var banner = ['/**',
					'* @licence: '+data.name+' v'+data.version,
					'* (c) 2015-'+new Date().getFullYear()+' '+data.author.name+' - '+data.author.email,
					'* licence: '+data.license,
					'*/',
					''
				].join('\n');
				gulp.src('dist/*.js')
					.pipe(header(banner))
					.pipe(gulp.dest('dist'));
			},
			function(error){
				console.log(error);
			}
		);
	});
	gulp.task('processHtml',function(){
		var processhtml = require('gulp-processhtml');
		return gulp.src('app/index.html')
				.pipe(processhtml({}))
				.pipe(gulp.dest('dist'));
	});
	gulp.task('clean',function(){
		var clean = require('gulp-clean');
		return gulp.src('dist/partials.js', {read:false})
				.pipe(clean());
	});
	gulp.task('unit-test',function(done){
		var Server = require('karma').Server;
		new Server({
			configFile: __dirname + '/spec/unit/unit.conf.js',
			singleRun: true
		},done).start();
	});
	gulp.task('build',function(cb){
		runSequence('html2js','concat','uglify',['header','clean','processHtml'],cb);
	});
})();