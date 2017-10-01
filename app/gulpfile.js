// Load all plugins
var gulp = require("gulp")
var watch = require("gulp-watch")
var autoprefix = require("gulp-autoprefixer")
var sass = require("gulp-sass")
var minifyCss = require("gulp-clean-css")
var rename = require("gulp-rename")
var concat = require("gulp-concat")
var uglify = require("gulp-uglify")
var rigger = require("gulp-rigger")
var ignore = require("gulp-ignore")
var rimraf = require("gulp-rimraf")
var changed = require("gulp-changed")
var htmlmin = require("gulp-htmlmin")
var sourcemaps = require("gulp-sourcemaps")
var babel = require("gulp-babel")
var gutil = require("gulp-util")
var runSequence = require("run-sequence")

// Central place to store paths
var path = {
	// Folders containing the source files
	src: {
		html: "src/html/**/*.*",
		img: "src/assets/img/**/*.*",
		css: "src/assets/css/**/*.scss",
		fonts: "src/assets/fonts/**/*.*",
		js: "src/assets/js/**/*.*"
	},
	// Folders to put the finished products in
	build: {
		html: "build/",
		img: "build/static/img/",
		css: "build/static/css",
		fonts: "build/static/fonts/",
		js: "build/static/js/"
	},
	// Folders to watch for changes
	watch: {
        html: "src/html/**/*.*",
		img: "src/assets/img/**/*.*",
		css: "src/assets/css/**/*.scss",
		fonts: "src/assets/fonts/**/*.*",
		js: "src/assets/js/**/*.*"
	},
	// Folders to remove when cleaning up
	clean: ["build"]
}

// Print an error to console and stop executing pipe
function printError(error) {
	console.error(error.toString())
	this.emit("end")
}

// Print an error to console and stop executing pipe
function riggerError(error) {
	console.log("RIGGER ERROR: CHECK INCLUDED FILE PATHS")
	console.error(error.toString())
	this.emit("end")
}

// Build the html files
gulp.task("html:build", function () {
	return gulp.src(path.src.html)
		.pipe(rigger())
		.on("error", riggerError)
		.pipe(ignore.exclude(["components/*"]))
		.pipe(gulp.dest(path.build.html))
})

// Build the javascript files
gulp.task("js:build", function () {
	return gulp.src(path.src.js)
		.pipe(ignore.exclude(["*.min.js"]))
		.pipe(sourcemaps.init())
		.pipe(rigger())
		.on("error", riggerError)
		.pipe(babel({
			presets: ['es2015']
		}))
		.on("error", printError)
		// Minify the files
		.pipe(uglify())
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(path.build.js))		
})

// Build the css
gulp.task("css:build", function () {
	return gulp.src(path.src.css)
		.pipe(sourcemaps.init())
		// Procces the sass
		.pipe(sass({outputStyle: "expanded", indentWidth: 4}))
		.on("error", printError)
		// Add prefixes for browsers that need them
		.pipe(autoprefix({
			browsers: ["last 30 versions", "> 1%", "ie 9"],
			cascade: true
		}))
		.on("error", printError)
		// Minify the files
		.pipe(minifyCss())
		.on("error", printError)
		// Write source maps
		.pipe(sourcemaps.write())
		// Write them to file
		.pipe(gulp.dest(path.build.css))
})

// Build all font files
gulp.task("fonts:build", function() {
	return gulp.src(path.src.fonts)
		.pipe(changed(path.build.fonts))
		.pipe(gulp.dest(path.build.fonts))
})

// Build image files
gulp.task("img:build", function (cb) {
	setTimeout(function () {
		gulp.src(path.src.img)
			.pipe(gulp.dest(path.build.img))
			.on("end", cb)
	}, 1000)
})


// What tasks to run on the build command
gulp.task("build", [
	"html:build",
	"img:build",
	"css:build",
	"fonts:build",
	"js:build"
])

// Watch for file changes
gulp.task("watch", function(){
	watch([path.watch.html], function(event, cb) {
		gulp.start("html:build")
	})
	watch([path.watch.img], function(event, cb) {
		gulp.start("img:build")
	})
	watch([path.watch.css], function(event, cb) {
		gulp.start("css:build")
	})
	watch([path.watch.js], function(event, cb) {
		gulp.start("js:build")
	})
})

// Clean the build directory
gulp.task("clean", function () {
	return gulp.src(path.clean)
		.pipe(rimraf())
})

// Run when called without arguments
gulp.task("default", function() {
	runSequence("build", "watch")
})
