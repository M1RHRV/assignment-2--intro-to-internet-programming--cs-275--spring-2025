const { src, dest } = require(`gulp`);
const htmlCompressor = require(`gulp-htmlmin`);

let compressHTML = () => {
    return src(`uncompressed-html/*.html`)
        .pipe(htmlCompressor({collapseWhitespace: true}))
        .pipe(dest(`compressed-html/`));
};

exports.compressHTML = compressHTML;
const gulp = require('gulp');
const eslint = require('gulp-eslint');
const stylelint = require('gulp-stylelint');
const babel = require('gulp-babel');
const htmlmin = require('gulp-htmlmin');
const browserSync = require('browser-sync').create();

// compress images
const imagemin = require('gulp-imagemin');
gulp.task('compress-images', () => {
    return gulp.src('src/img/*')
      .pipe(imagemin([
        imagemin.mozjpeg({ quality: 75, progressive: true }),
        imagemin.optipng({ optimizationLevel: 5 }),
      ]))
      .pipe(gulp.dest('dist/img'));
  });

  gulp.task('default', gulp.series('compress-images'));
// Lint 4 JavaScript
gulp.task('lint-js', () => {
  return gulp.src('js/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// Lint 4 CSS
gulp.task('lint-css', () => {
  return gulp.src('styles/*.css')
    .pipe(stylelint({
      reporters: [
        { formatter: 'string', console: true }
      ]
    }));
});

// transpiler
gulp.task('babel', () => {
  return gulp.src('js/*.js')
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(gulp.dest('dist/js'));
});

// minify/uglify HTML
gulp.task('minify-html', () => {
  return gulp.src('*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
});



//browser sync
gulp.task('serve', () => {
  browserSync.init({
    server: './'
  });

  gulp.watch('js/*.js', gulp.series('lint-js', 'babel')).on('change', browserSync.reload);
  gulp.watch('styles/*.css', gulp.series('lint-css')).on('change', browserSync.reload);
  gulp.watch('*.html').on('change', browserSync.reload);
});

// development
gulp.task('default', gulp.series('lint-js', 'lint-css', 'babel', 'serve'));

// production
gulp.task('build', gulp.series('lint-js', 'lint-css', 'babel', 'minify-html'));
