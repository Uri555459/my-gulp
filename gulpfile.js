const { src, dest, watch, parallel, series } = require('gulp')
const scss = require('gulp-sass')(require('sass'))
const concat = require('gulp-concat')
const uglify = require('gulp-uglify-es').default
const browserSync = require('browser-sync').create()
const autoprefixer = require('gulp-autoprefixer')
const clean = require('gulp-clean')

// Constants
const srcPath = 'src'
const distPath = 'dist'

// Styles
function styles() {
	return src(`${srcPath}/scss/style.scss`)
		.pipe(scss({ outputStyle: 'compressed' }))
		.pipe(concat('style.min.css'))
		.pipe(autoprefixer(['last 10 versions']))
		.pipe(dest(`${srcPath}/assets/css`))
		.pipe(browserSync.stream())
}

// Scripts
function scripts() {
	return src([
		/*'node_modules/swiper/swiper-bundle.js',*/ `${srcPath}/assets/js/main.js`,
	])
		.pipe(concat('main.min.js'))
		.pipe(uglify())
		.pipe(dest(`${srcPath}/assets/js`))
		.pipe(browserSync.stream())
}

// Watching
function watching() {
	watch([`${srcPath}/scss/style.scss`], styles)
	watch([`${srcPath}/assets/js/main.js`], scripts)
	watch([`${srcPath}/*.html`]).on('change', browserSync.reload)
}

// BrowserSync
function browserSyncWatch() {
	browserSync.init({
		server: {
			baseDir: srcPath,
		},
	})
}

// Clear
function cleanDist() {
	return src(distPath).pipe(clean())
}

// Build function
function building() {
	return src(
		[
			`${srcPath}/assets/css/style.min.css`,
			`${srcPath}/assets/js/main.min.js`,
			`${srcPath}/**/*.html`,
		],
		{
			base: srcPath,
		}
	).pipe(dest(distPath))
}

// Exports
exports.styles = styles
exports.scripts = scripts
exports.watching = watching
exports.browserSyncWatch = browserSyncWatch

// Build
exports.build = series(cleanDist, building)

// Parallel
exports.default = parallel(styles, scripts, browserSyncWatch, watching)
