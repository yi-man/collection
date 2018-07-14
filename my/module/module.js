/**
 * Created by xuxin on 2018/3/22.
 */

let modules = {}
let installModules = {}

function require (mod) {
  if (installModules[mod]) {
    return installModules[mod].exports
  }

  let module = installModules[mod] = {
    mod: mod,
    exports: {}
  }

  modules[mod].call(module.exports, require, module, module.exports )

  return module.exports
}

function define (mod, cb) {
  modules[mod] = cb
}

function use (mod) {
  require(mod)
}



define('m1', function (require, module, exports) {
  let a = 'm1'
  module.exports = a 
})

define('m2', function (require, module, exports) {
  let a = 'm2'
  module.exports = a
})

define('m3', function (require, module, exports) {
  let m1 = require('m1')
  let m2 = require('m2')
  console.log(m1 + m2)
  module.exports = m1 + m2
})


use('m3')