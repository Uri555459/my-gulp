const { src, dest, watch, parallel } = require('gulp')
const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()

// Styles
function styles() {
	return src('app/scss/style.scss')
		.pipe(concat('style.min.css'))
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(dest('app/css'))
		.pipe(browserSync.stream())
}

// Scripts
function scripts() {
	return src('app/js/main.js')
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest('app/js'))
		.pipe(browserSync.stream())
}

// Watching
function watching() {
	watch(['app/scss/style.scss'], styles)
	watch(['app/js/main.js'], scripts)
	watch(['app/*.html']).on('change', browserSync.reload)
}

// BrowserSync
function browserSyncWatch() {
	browserSync.init({
		server: {
			baseDir: 'app/',
		},
	})
}

// Exports
exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.browserSyncWatch = browserSyncWatch

// Parallel
exports.default = parallel(styles, scripts, browserSyncWatch, watching)
