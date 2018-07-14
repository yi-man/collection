/**
 * Created by xuxin on 16/10/17.
 * 用以规范页面写法
 *
 * 每个页面 new Page(options), 如果页面很大可分块写,多new几个Page
 * options 将 events, requests, methods 分类展现
 *
 * 一块 变量定义区
 * events 配置页面中的事件,回调函数挂载在 methods 下
 * methods 配置页面中的请求, 回调函数挂载在 methods 下
 *
 * 一块代码书写区
 *
 * 代码模块化
 */
// !function ($) {
  var util = {}

  var arr = ['Object', 'Function']

var type = function (o) {
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};
  arr.forEach(function (t) {
    util['is' + t] = function (o) {
      return type(o) === t.toLowerCase();
    };
  });

  var noop = function () {
    console.log('空函数')
  }
  var Page = function (options) {
    if (!util.isObject(options) || !options) {
      options = {}
    }

    this.events = options.events || {}
    this.requests = options.requests || {} //都会被挂载到methods下
    this.methods = options.methods || {}
    this.eles = options.eles || {}
    // this.before = options.before || {}
    // this.after = options.after || {}

    this.initialization()
  }

  Page.prototype = {
    construct: Page,
    initialization: function () {
      this._initializeElements()
      this._bindMethods()
      this._bindEvents()
      this._bindRequest()
    },
    _initializeElements() {
      const eles = this.eles
      for (var name in eles) {
        if (eles.hasOwnProperty(name)) {
          this[name] = $(eles[name]);
        }
      }
    },
    _bindMethods: function () {
      for (var key in this.methods) {
        this[key] = this.methods[key]
      }
    },
    _bindEvents () {
      var events = this.events

      if (util.isObject(events)) {
        for (var key in events) {
          if (events.hasOwnProperty(key)) {
            var eventReg = /^(\S+)\s*(.*)$/
            var func = this[events[key]],
              arr = key.match(eventReg),
              event = arr[1],
              elem = arr[2]

            $(document).on(event, elem, func.bind(this, this))
          }
        }
      }
    },
    _bindRequest () {
      var requests = this.requests

      if (util.isObject(requests)) {
        for (var key in requests) {
          if (requests.hasOwnProperty(key)) {
            var opt = requests[key],
              method = opt['method'] || 'get',
              url = opt['url'],
              params = opt['params'] || {},
              func = this[opt['cb']],
              isInit = opt['isInit']

            this._mountRequests({
              key: key,
              method: opt['method'] || 'get',
              url: opt['url'],
              params: opt['params'] || {},
              func: this[opt['cb']] || noop,
              isInit: opt[isInit]
            })
          }
        }
      }
    },

    _mountRequests: function (options) {
      this[options.key] = function () {
        $[method](options.url, options.params, function (data) {
          options.func.call(this, data)
        }, "json")
      }

      if (options.isInit) {
        this[key].call(this)
      }
    }


  }

// }($)
