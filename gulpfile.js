var gulp = require('gulp');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var browserSync = require('browser-sync').create();

// ==============================================
// Directory path variables
// ==============================================
const config = {
	appDirectory: 'src/',
	tempDirectory: 'temp/',
    distributionDirectory: 'dist/',
    examplesDirectory: 'examples/'
};

gulp.task('css', function(done) {
    gulp.src('./src/fullpage.css')
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./dist'))
        .pipe(minifyCss({
            compatibility: 'ie8',
            advanced: false,
            keepSpecialComments: '1'
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
        done();
});

gulp.task('js', function(done) {
    gulp.src('./src/fullpage.js')
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./dist'))
        .pipe(uglify({
            output: {
                comments: 'some'
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./dist'));
        done();
});

gulp.task('vendors', function(done) {
    gulp.src([
        './vendors/scrolloverflow.js',
        './vendors/easings.js'
        ])
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./vendors'))
        .pipe(uglify({
            output: {
                comments: 'some'
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./vendors'));
        done();
});

//private file
gulp.task('extensions', function(done) {
    gulp.src('./src/fullpage.extensions.js')
        .pipe(uglify({
            output: {
                comments: 'some'
            }
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./dist'));
        done();
});

gulp.task('default', gulp.parallel('css', 'js'));


const startServer =function(){
    browserSync.init({
		server: {
			baseDir: ['./examples','./'],
			port: 3000,
			directory: true
		}
	});

	gulp.watch([config.appDirectory + '**/*.html', config.examplesDirectory + '**/*.html', config.examplesDirectory + 'imgs/**/*.*']).on('change', browserSync.reload);

	gulp.watch(config.appDirectory + '*.css', gulp.parallel('css'));

	gulp.watch(config.appDirectory + '*.js', gulp.parallel('js'));

	// protip: stop old version of gulp watch from running when you modify the gulpfile
	gulp.watch('gulpfile.js').on('change', () => process.exit(0));
};


gulp.task('serve', gulp.series('css', 'js', startServer));