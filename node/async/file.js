/**
 * Created by xuxin on 2018/4/12.
 */
'@std/esm'
const fs = require('fs')
const path = require('path')
const url = path.resolve(__dirname + '/../..')


function getDirs (url) {
  return new Promise(function (resolve, reject) {
    fs.readdir(url, function (err, files) {
      if (err) {
        reject(err)
      }

      resolve(files)
    })
  })
  // return await fs.readdir(url)
}

(async () => {
  const dirs = await getDirs(url)
  console.log(dirs)
})()
//
// getDirs(url).then(function (dirs) {
//   console.log(dirs)
// })


