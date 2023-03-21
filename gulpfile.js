const { src, dest, watch, parallel } = require('gulp')
const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')

// Styles
function styles() {
	return src('src/scss/style.scss')
		.pipe(autoprefixer({ overrideBrowserslist: ['last 10 version'] }))
		.pipe(concat('style.min.css'))
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(dest('src/css'))
		.pipe(browserSync.stream())
}

// Scripts
function scripts() {
	return src([/*'node_modules/swiper/swiper-bundle.js',*/ 'src/js/main.js'])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('src/js'))
		.pipe(browserSync.stream())
}

// Watching
function watching() {
	watch(['src/scss/style.scss'], styles)
	watch(['src/js/main.js'], scripts)
	watch(['src/*.html']).on('change', browserSync.reload)
}

// BrowserSync
function browserSyncWatch() {
	browserSync.init({
		server: {
			baseDir: 'src/',
		},
	})
}

// Build
function build() {
	return src(['src/css/style.min.css', 'src/js/main.min.js', 'src/**/*.html'], {
		base: 'src',
	}).pipe(dest('dist'))
}

// Exports
exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.browserSyncWatch = browserSyncWatch
exports.build = build

// Parallel
exports.default = parallel(styles, scripts, browserSyncWatch, watching)
