const gulpfile = require('gulp')
const fs = require('fs')
const through2 = require('through2')
const iconfont = require('gulp-iconfont')
const iconfontCss = require('gulp-iconfont-css')

const svg = ['./src/icons/*.svg']

gulpfile.task('iconfont', function() {
  const fontName = 'iconfont-st'
  return gulpfile.src(svg).pipe(iconfontCss({
    cssClass: 'st-icon',
    fontName: fontName,
    targetPath: 'font.css', // 生成的css样式的路径
    fontPath: '' // 生成的iconfont的路径
  })).pipe(iconfont({
    fontName: fontName, // required
    prependUnicode: true, // recommended option
    formats: ['ttf', 'eot', 'woff', 'svg', 'woff2'], // default, 'woff2' and 'svg' are available
    timestamp: new Date().getTime(),
    normalize: true,
    fontHeight: 1001
  })).pipe(gulpfile.dest('./src/styles/font-st'))
})

const iconList = []
gulpfile.task('iconfont-map', function() {
  return gulpfile.src(svg).pipe(through2.obj(function(file, enc, cb) {
    const pa = file.relative.split('\\')
    const name = pa[pa.length - 1]
    iconList.push(`st-icon-${name.replace('.svg', '')}`)
    cb()
  }))
})

gulpfile.task('default', gulpfile.series('iconfont', 'iconfont-map', function() {
  const jsStr = JSON.stringify(iconList)
  fs.writeFile('./src/views/doc/icon/iconList.js', `export default ${jsStr}`, function(err) {
    if (err) {
      return console.log(err)
    }
    console.log(`成功生成图标索引文件!（${iconList.length}个图标）`)
  })
}))
