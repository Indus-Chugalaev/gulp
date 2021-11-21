// Подключаем модули галпа
const gulp = require('gulp')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const uglify = require('gulp-uglify')
const del = require('del')
const browserSync = require('browser-sync').create()

// Подключаем файлы CSS в необходимом порядке
const cssFiles = [
    './src/css/main.css',
    './src/css/media.css'
]

// Подключаем файлы js в необходимом порядке
const jsFiles = [
    './src/js/lib.js',
    './src/js/main.js'
]


// Таск на стили CSS
function styles() {
    // Шаблон для поиска файлов CSS
    // Все файлы по шаблону'./src/css/**/*.css'
    return gulp.src(cssFiles)
        // Объединяем файлы в один
        .pipe(concat('style.css'))
        // Добавить префиксы
        .pipe(autoprefixer({
            overrideBrowserslist: ['last 2 versions'],
            cascade: false
        }))
        // Минификация CSS
        .pipe(cleanCSS({
            level: 2
        }))
        // Выходная папка для стилей
        .pipe(gulp.dest('./build/css'))
        // Синхронизация при изменении CSS файлов
        .pipe(browserSync.stream())
    }
    
    // Таск на скрипты
    function scripts() {
        // Шаблон для поиска файлов js
        // Все файлы по шаблону'./src/js/**/*.js'
        return gulp.src(jsFiles)
        // Объединяем файлы в один
        .pipe(concat('script.js'))
        // Минификация js
        .pipe(uglify({
            toplevel: true // Максимальная
        }))
        // Выходная папка для скриптов
        .pipe(gulp.dest('./build/js'))
        // Синхронизация при изменении js файлов
        .pipe(browserSync.stream())
}

// Удалить все в указанной папке
function clean() {
    return del(['build/*'])
}

// Просматривать (отслеживать изменения) файлы
function watch() {
    browserSync.init({
        server: {
            baseDir: "./"
        }, // Инициализация сервера
    })
    // Следить за CSS файлами
    gulp.watch('./src/css/**/*.css', styles)
    // Следить за js файлами
    gulp.watch('./src/js/**/*.js', scripts)
    // При изменении HTML запустить синхронизацию
    gulp.watch("./*.html").on('change', browserSync.reload)
}


// Таск вызывающий функции styles
gulp.task('stylesTask', styles)


// Таск вызывающий функции scripts
gulp.task('scriptsTask', scripts)

// Таск вызывающий функции clean
gulp.task('del', clean)

// Таск вызывающий функции watch (отслеживание изменений)
gulp.task('watch', watch)

// Таск выполняет постройку, через последовательное выполнение серии функций
gulp.task('build', gulp.series(clean, gulp.parallel(styles, scripts)))

// Таск запускает build и watch последовательно
gulp.task('dev', gulp.series('build','watch'))