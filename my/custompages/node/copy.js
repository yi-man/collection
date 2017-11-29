/**
 * Created by xuxin on 16/6/3.
 */
'use strict'

const fs = require('fs')

const file = './activity/html/mobile/index.html'
const fileName = file.substr(file.lastIndexOf('/')+1)

let prjName = process.argv[2]

let html = fs.readFileSync(file, 'utf8')

let reg = /<title>(.+)<\/title>/


let title = '鑫合汇'

html = html.replace(reg, '<title>'+title+'</title>')

//prj下建立相关目录
let dir = './activity/prj/'+prjName
fs.exists(dir, function (exists) {
  if (!exists) {
    fs.mkdir(dir, 0o777, function (err) {
      if (err) throw err;
    })
  }
})

fs.writeFile(dir+'/'+fileName, html)

console.log(fileName)

