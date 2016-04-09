var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('gulp-webpack');
var jade = require('gulp-jade');

var jsInput = './src/app/**'
var viewsInput = './src/views/**/*.jade';
var scssInput = './src/scss/**/*.scss';
var output = './dist';

gulp.task('sass', function () {
	
	return gulp
		// Find all `.scss` files from the `stylesheets/` folder
		.src(scssInput)
		// Run Sass on those files
		.pipe(sass())
		// Write the resulting CSS in the output folder
		.pipe(gulp.dest(output));
});

gulp.task('scripts', function() {
  return gulp.src(jsInput)
    // .pipe(webpack())
    .pipe(gulp.dest(output));
});

gulp.task('views', function() {
  // var YOUR_LOCALS = {};
  gulp.src(viewsInput)
    .pipe(jade())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function() {
  return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
    gulp.watch(scssInput, ['sass']);
    gulp.watch(jsInput, ['scripts']);
    gulp.watch(viewsInput, ['views']);
    // When there is a change,
    // log a message in the console
    gulp.on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['sass', 'scripts', 'views', 'watch']);