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
!function ($) {
  var util = {}

  ['Object', 'Function'].forEach(function (t) {
    util['is' + t] = function (o) {
      return type(o) === t.toLowerCase();
    };
  });

  function Page (options) {
    if (!util.isObject(options) || !options) {
      options = {}
    }

    this.events = options.events || {}
    this.requests = options.requests || {} //都会被挂载到methods下
    this.methods = options.methods || {}
    this.before = options.before || {}
    this.after = options.after || {}

    util.isFunction(this.before) ? this.before() : ''

    bindEvents(this.events, this.methods)
    bindRequest(this.requests, this.methods)

    util.isFunction(this.after) ? this.after() : ''

    function bindEvents (events, methods) {
      if (util.isObject(events)) {
        for (var key in events) {
          if (events.hasOwnProperty(key)) {
            var func = methods[events[key]],
              arr = key.split(' '),
              event = arr[0],
              elem = arr[1]

            $(document).on(event, elem, func.bind(this, methods))
          }
        }
      }
    }

    function bindRequest (requests, methods) {
      if (util.isObject(requests)) {
        for (var key in requests) {
          if (requests.hasOwnProperty(key)) {
            var opt = requests[key],
              method = opt['method'] || 'get',
              url = opt['url'],
              params = opt['params'] || {},
              func = methods[opt['cb']],
              isInit = opt['isInit']

            initRequest(methods, key, method, url, params, func, isInit)
          }
        }
      }

      function initRequest (ctx, key, method, url, params, func, isInit) {
        methods[key] = function () {
          $[method](url, params, function (data) {
            func.call(ctx, data)
          }, "json")
        }

        if (isInit) {
          methods[key].call(this)
        }
      }
    }

    // this.ajaxAfter = options.ajaxAfter || {}
    // bindAjaxAfter(this.ajaxAfter, this.methods)
    // function bindAjaxAfter (ajaxAfter, methods) {
    //   if (util.isObject(ajaxAfter)) {
    //     for (var key in ajaxAfter) {
    //       if (ajaxAfter.hasOwnProperty(key)) {
    //         window[key] = methods[ajaxAfter[key]]
    //       }
    //     }
    //   }
    // }
  }
}($)
