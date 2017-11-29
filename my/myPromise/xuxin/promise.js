/**
 * Created by xuxin on 16/7/26.
 */
//resolver是promise的回调函数, 会有两个参数,resolve表明成功时执行,reject表示失败时执行
function Promise (resolver) {
  this.status = "pending"
  this.value = ''
  this.handlers = []

  this._doPromise.call(this, resolver)
}

Promise.prototype = {
  constructor: Promise,

  _doPromise: function (resolver) {
    var self = this
    //传入resolve, reject
    resolver(function (value) {
      self._resolve(value)
    }, function (value) {
      self._reject(value)
    })
  },

  _resolve: function (value) {
    //value不为空 且为 Promise  则执行_doPromise
    value && value.then && this._doPromise.call(value.then)

    this.status = "fulfilled"
    this.value = value
    this._dequeue()
  },

  _reject: function value() {
    this.status = "reject"
    this.value = value
  },

  _dequeue: function () {
    var handler
    while (this.handlers.length) {
      handler = this.handlers.shift()
      this._handle(handler.thenPromise, handler.onFulfilled, handler.onRejected)
    }
  },

  _handle: function (thenPromise, onFulfilled, onRejected) {
    var self = this

    var callback = self.status === "fulfilled" ? onFulfilled :  onRejected

    self.status == "fulfilled" ? self._resolve.call(thenPromise, self.value)
      : self._reject.call(thenPromise, self.value);
  },

  then: function (onFulfilled, onRejected) {
    var thenPromise = new Promise(function () {})

    if (this.status == "pending") {
      this.handlers.push({
        thenPromise: thenPromise,
        onFulfilled: onFulfilled,
        onRejected: onRejected
      })
    } else {
      this._handle(thenPromise, onFulfilled, onRejected)
    }

    return thenPromise
  }
}