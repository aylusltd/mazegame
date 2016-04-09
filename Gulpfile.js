var gulp = require('gulp');
var sass = require('gulp-sass');
var webpack = require('gulp-webpack');


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

gulp.task('watch', function() {
  return gulp
    // Watch the input folder for change,
    // and run `sass` task when something happens
    .watch(scssInput, ['sass'])
    // When there is a change,
    // log a message in the console
    .on('change', function(event) {
      console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});

gulp.task('default', ['sass', 'watch']);