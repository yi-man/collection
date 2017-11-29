/**
 * Created by xuxin on 2017/7/4.
 */
function Mp (resolver) {
  this.status = "pending"
  this.value = ""
  this.handlers = []

  this._doPromise.call(this, resolver)
}

Mp.prototype = {
  constructor: Mp,
  _doPromise (resolver) {
    resolver(function (val) {
      this._resolve(val)
    }, function (val) {
      this._reject(val)
    })
  },
  _resolve (value) {
    value && value.then && this._doPromise.call(value.then)
    this.status = "fulfilled"
    this.value = value
  },
  _reject (value) {
    this.status = "reject"
    this.value = value
  },
  _dequeue () {
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