/**
 * Created by xuxin on 2018/3/27.
 */

function assert (msg) {
  console.log(msg)
}

const OP = Object.prototype;


function observe (obj) {
  if (typeof obj !== 'object') {
    assert('必须是对象')
  }

  this.observe(obj)
}

observe.prototype.observe = function (obj) {

  Object.keys(obj).forEach(function (key) {
    var oldValue = obj[key]

    Object.defineProperty(obj, key, {
      get () {
        return oldValue
      },
      set: (function (newValue) {
        if (oldValue !== newValue) {
          if(OP.toString.call(obj[key]) === '[object Object]' || OP.toString.call(obj[key]) === '[object Array]'){
            this.observe(obj[key]);
          } else {
            obj[key] = newValue
          }
        }
      }).bind(this)
    })

    if(OP.toString.call(obj[key]) === '[object Object]' || OP.toString.call(obj[key]) === '[object Array]'){
      this.observe(obj[key]);
    }
  }, this)
}
