/**
 * Created by xuxin on 16/8/6.
 * 与app交互
 * 与iframe效果
 */
import Conf from 'config'
import Vue from 'vue'
import localStorageCtrl from 'localStorageCtrl'
import titleMap from './titleMap'
import userService from 'userService'
import {addTrack} from '../directive/track'
// 用户信息
var userInfo
// 埋点要用的参数
const TRACK = ['brand', 'model', 'deviceId']
// 要跳到的app页面，正是app嵌套wap页面 k: appRouter v: wapRouter
// 要自动跳到wap页，同时把 Conf.fromAppName 设置为wapRouter
// 这样就可以保证点返回按钮时 Conf.fromAppName 与当前路由相匹配关闭webView
// 原因: 如果直接goToNative, 会新打开一个webview，返回时关闭当前webview，会露出之前操作的webview
// 其时是应该回到app
const appRouterToWapRouter = {
  goRecharge: 'recharge'
}

// 用于保存配制title的时候extra里callback的值
// subTitleCallBack[routerName] = callback
var subTitleCallBack = {}
// 用于保存配制title的时候closeExtra里callback的值，用于close回调
var closeCallBack = {}

// 把json字符串转化为json对象
// 从ios接到我们传过去的数据就直接解析了，我们要的数据就直接被转化为json字符串。ios没法把它转成js 对象
// 如果用ios的方式转化为对象，只能是{a=3, b=3}之类的，js会报错
function strToJson (str) {
  var obj = {}
  if (Object.isObject(str)) {
    obj = str
  } else {
    try {
      obj = JSON.parse(str)
    } catch (err) {}
  }
  return obj
}

// 因为ios接收到的匿名函数在他那里就是一串字符串，没法运行加数据
// 所以需要传给他一个函数名，他在window下运行这个才能把数据传过来
let createWindowFunc = function (fun) {
  xhh.times++
  var funName = 'wapGetAppData' + xhh.times
  window[funName] = function (d) {
    d = strToJson(d)
    fun(d)
    // 删除，防止污染全局
    delete window[funName]
  }
  return funName
}

// 其它平台调我们的,调用方法 window.Wap.go(xx)
let wap = window.WAP = {
  // 跳到鑫利宝介绍页
  goXlbIntro: function () {
    //添加云贷通副标题弹框提示
    //if (this.vm.$route.name == 'xlbYundaitong') {
    //  this.vm.alertIntro()
    //} else {
    //  this.go({
    //    name: 'xlbIntro'
    //  })
    //}
    this.go({
      name: 'xlbIntro'
    })
  },
  // 页面内部跳转
  go: function (obj) {
    if (typeof obj == 'string') {
      obj = {
        name: obj
      }
    }
    this.vm.$router.push(obj)
  },
  // 更新vm数据 k,v  / {k:v}
  pushData: function (k, v) {
    let arg = arguments.length,
      self = this
    if (!arg) return
    if (arg == 1) {
      Object.keys(k).forEach(function (item) {
        self._setData(item, k[item])
      })
    } else {
      self._setData(k, v)
    }
  },
  // 设置单一数据
  _setData: function (k, v) {
    Vue.set(this.vm, k, v)
  },
  // 接收app的事件
  // 现在一共有goBack: 后退, subTitleEvent:点副标题
  trigger: function (type, obj) {
    wap[type](obj)
    if (type == 'subTitleEvent') wap.vm.count ++
    // ios通过return值确定是wap过来的
    // wap跟bbs/活动/旧交互最大的不同是接管了app返回按钮
    // android无法接收return值，所以他会在putData('title')的时候记录
    if (type == 'goBack' && Conf.device == 1) {
      return true
    }
  },
  // app加载完时回调
  loaded: function () {
    if (!Conf.isCanInteraction && Conf.device == 1 && !Conf.iosIsHigh) {
      // ios 且 低级版本加载完才会注入交互
      // 这时才可以启动项目
      Conf.isCanInteraction = true
      Vue.startApp()
    }
  },
  // 点击副标题
  // extra: 配制title的时候传过来的值
  subTitleEvent: function (extra) {
    if (!extra) return
    extra = strToJson(extra)
    // 路由跳转
    if (extra.router) {
      wap.go(extra.router)
    }
    // 回调函数, 把当前vm当作this传过去
    if (extra.callback) {
      subTitleCallBack[extra.callback].call(wap.vm)
    }
    // 跳到app相关页面
    if (extra.goAppRouter) {
      xhh.goToNative.apply(null, extra.goAppRouter)
    }
  },
  // 点击关闭按钮
  closeEvent: function (extra) {
    if (!extra) return
    extra = strToJson(extra)
    // 回调函数, 把当前vm当作this传过去
    if (extra.callback) {
      closeCallBack[extra.callback].call(wap.vm)
    }
    // 路由跳转
    if (extra.router) {
      wap.go(extra.router)
    }
    // 跳到app相关页面
    if (extra.goAppRouter) {
      xhh.goToNative.apply(null, extra.goAppRouter)
    }
  },
  // 点回退按钮
  goBack: function () {
    // 如果是来时的路由则关闭
    if (wap._isBackApp()) {
      addTrack({}, 'click', {}, 'goBack')
      xhh.doAction('close')
    } else {
      let vm = wap.vm
      if (vm.appGoBack && typeof vm.appGoBack == 'function') {
        vm.appGoBack()
      } else {
        window.history.back()
      }
    }
  },
  _isBackApp: function () {
    var vm = wap.vm
    var routeName = vm.$route.name
    var query = vm.$route.query
    // 当前页面为第一次进入webview页面
    return xhh.curRouterName === Conf.fromAppName ||
      // 我的鑫利宝(xlbAccounts)，返回到专享福利页面(鑫利宝账户弹框时修改)
      routeName == 'xlb' ||
      // 开能鑫利宝成功，回退要到帐户页
      routeName == 'xlbSuccess' ||
      // 开通存管，在成功页，如果成功了返回则跳到app帐户页
      routeName == 'depositoryResult' ||
      // 充值页点返回要跳到帐户页
      routeName == 'callBackReturn' ||
      // 风险评估结果页面跳到个人信息页
      routeName == 'riskSurveyResult' ||
      // 加入鑫拍档页面，返回账户页
      routeName == 'xpduser' ||
      // 充值页，在开过户会由wap直接跳到充值
      routeName == 'recharge' ||
      // 转账激活页面返回-账户页
      routeName == 'transferActivation' ||
      // 会员中心强制跳到app
      routeName == 'membercenter'
  }
}

// app相关页面参数, params里的value值统一都是字符串类型，ios对类型敏感
//   goRecommend: 首页-推荐页
//   goFinances: 日益升
//   goFinanceYYS: 月益升投资列表(跳不过去)
//   goFinanceSDT: 速兑通投资列表
//   goProjectDetails: 投资详情页面 params={id: 项目id}
//   goZeroGoodsAddress: 跳转0元购收货地址 params={id: 项目id}
//   goZeroGoodsDetails: 理财详情页面0元购 params={id: 项目id, money: 投资金额}
//   goRecharge: 充值页面
//   goDrawCash: 提现页面({isOpenCg: xxx}是否存管帐户，不是不用写)
//   goRegister: 注册页面
//   goAccount: 账户页面
//   goUserSetting: 账户设置界面实名认证 绑定邮箱 添加银行卡
//   goFinanceRecord: 投资记录
//   goRewards: 我的奖励
//   goLuckDraw: 登陆页面
//   goPartner: 鑫拍档页面
//   goInvite: 邀请好友
//   goActivityZone: 活动专区
//   goFundRecord: 资金记录
//   goAddBank: 绑卡页
//   goBalanceMove: 余额转移页面
//   goQuestions: 常见问题 params={type: xx}
//              不传type则跳到常见问题列表
//              type:2 注册/登录
//              type:3 充值/提现
//              type:4 投资/回款
//              type:6 银行存管

// app 调我们的
let xhh = window.XHH = {
  // 当前title参数的配制, 方便当前页面多次配制
  _curTitle: {},
  // 从app获取数据次数
  times: 0,
  // 如果有子路由这边只记录父路由
  curRouterName: '',
  // 将要进到的路由，这个跟curRouterName的区别是
  // 有子路由时上面记录父路由，这个记录子路由
  toName: '',
  render: function (to) {
    // 重置路由期间不用app操作
    if (Conf.resetRouter) return
    var toName = to.name
    xhh.curRouterName = to.matched[0].name
    xhh.toName = toName
    if (!Conf.fromAppName) {
      // 开始配制app数据
      xhh.appInit()
      // 记录来时的路由名字
      Conf.fromAppName = xhh.curRouterName
      // 记录来时的路由
      Conf.fromAppRouter = {
        name: toName,
        params: to.params,
        query: to.query
      }
    }
    // 保存数据
    if (!userInfo && userService.user.uid) {
      userInfo = userService.user
    }
    // 如果没配制title则关闭webview
    if (!titleMap[toName]) {
      // 解决旧版本红米问题
      // 红米进来时#!/xxx,经前端最终转化为#/xxx
      // 但是回退的时候从app取到的是 #!/xx 会转化为  #/ 即首页
      // 所以当没配制title的话，说明去的位置不对。要统一跳到来时的页面
      xhh.doAction('close')
      return
    }
    xhh.putData('title', titleMap[toName])
    xhh._curTitle = titleMap[toName] || {}
  },
  // 主要用于多次配制title参数, 如果是字符串则为title值
  setTitle: function (opts) {
    if (!opts || !Conf.isApp) return
    if (Object.isString(opts)) {
      opts = {
        title: opts
      }
    }
    opts = Object.assign({}, xhh._curTitle, opts)
    xhh.putData('title', opts)
    xhh._curTitle = opts
  },
  // 向app传递数据
  // ios
  // talkingDataAutonym: 实名认证
  // talkingDataRecharge: 充值
  putData: function (type, params) {
    xhh._unify('putData', type, params)
  },
  // 从app获取参数
  getData: function (type, params, fun) {
    // 纠正数据类型
    if (Object.isFunction(params)) {
      fun = params
      params = null
    }
    fun = createWindowFunc(fun)
    xhh._unify('getData', type, params, fun)
  },
  // 要求app跳到某个页面
  goToNative: function (pageName, params) {
    // 要跳的中由是不是app嵌套的wap的
    var wapRouter = appRouterToWapRouter[pageName]
    if (wapRouter) {
      // 设置从app进来时的wap路由名字
      // 方便点返回时关闭webView
      Conf.fromAppName = wapRouter
      wap.go(wapRouter)
      return
    }
    // 用于goToNative时与传入值对比，如果一致则要close关闭
    // 用于规避a->b(webview)>a ios/android会打开一个新的a
    if (Conf.fromPage && Conf.fromPage == pageName) {
      xhh.doAction('close')
    } else {
      // 跳到提现页，要把是否存管帐户类型传过去
      if (pageName == 'goDrawCash') {
        params = params || {}
        params.isOpenCg = userInfo.is_zs == 1
      }
      xhh._unify('goToNative', pageName, params)
    }
  },
  // 泛类，跳转到app除goToNative定义以外的页面
  // 即没提前定义的，这个要wap来区分ios/app
  // Class: app类名
  // isHandleClose: 要不要关闭当前webView(true/false)
  // 以上两个字段是固定的，大小写敏感,必填
  goToExtraNative: function (params) {
    xhh._unify('goToExtraNative', null, params)
  },
  // 要求app作交互
  // type有以下几种事件
  // 关闭webview: close
  // 配制分享: share (content, imgUrl, webUrl, title)
  // 去积分商城 doAction('duiba', {url: json.data.url})
  // 去打开新窗口 doAction('openWindow', {url: '',backIsRefresh: false})
  // 去银行APP充值 doAction('openApp', {url: ''})
  // copy值 doAction('doCopy', {data: xxxx})
  doAction: function (type, obj) {
    if (type == 'openWindow') {
      // 强制转化类型
      obj.backIsRefresh = !!obj.backIsRefresh
    }
    xhh._unify('doAction', type, obj)
  },
  // 统一平台差别
  _unify: function (postName, activeType, obj, func) {
    // 只有新版本才会有这个且是app才可以运行这个
    if (!Conf.isApp || !Conf.appNewMode) return
    // 如果是微信/朋友圈之类分享出去后点击可以直接跳转的
    // 查是微博之类的没这个功能，所以要在内容里把分享的地址也加进来
    if (activeType == 'share' && obj.content.indexOf(obj.webUrl) == -1) {
      obj.content += ' ' + obj.webUrl
    }
    if (activeType == 'title') {
      // android要通过这个判断是由来控制
      obj.isAppControlBack = false
      // 副标题参数
      var extra = obj.extra || {}
      var cb = extra.callback
      var routerName = xhh.toName
      // 如果有回调函数，则把他加到subTitleCallBack[routerName]
      // 然后再把他的值设置为routerName
      // 这里有个问题，就算是传进来一个titlemap的Object.assign还是会改变原来的值
      // 所有这里要判读cb是不是function,有空再感觉下
      if (cb && !subTitleCallBack[routerName] && typeof cb == 'function') {
        subTitleCallBack[routerName] = cb
        extra.callback = routerName
      }
      // close参数
      var closeExtra = obj.closeExtra || {}
      var closeFunc = closeExtra.callback
      if (closeFunc && !closeCallBack[routerName + 'Close'] && typeof closeFunc == 'function') {
        closeCallBack[routerName + 'Close'] = closeFunc
        closeExtra.callback = routerName + 'Close'
      }
    }
    if (Conf.device == 1) {
      // 高级交互, 8.0以后
      if (Conf.iosIsHigh) {
        window.webkit.messageHandlers[postName].postMessage([activeType, obj, func])
      } else {
        window[postName](activeType, obj, func)
      }
      // 下面是anroid
    } else {
      if (obj) {
        obj = JSON.stringify(obj)
      }
      window.androidApp[postName](activeType, obj, func)
    }
  },
  // 页面加载完，开始配制app相关数据前
  appInit: function () {
    // 新交互url没 brand/model/deviceID 三个字段要加上, 现在主要用于埋点
    // ios低级版本只有页面下载完成才会把相关交互事件加到webView
    // 所以这时在track bind的时候再运行一次就好
    xhh.getData('appData', function (d) {
      TRACK.forEach(function (k) {
        Conf[k] = d[k]
      })
    })
  },
  // 跳到app
  goAppLogin: function () {
    var state = false
    if (Conf.isApp) {
      state = true
      xhh.goToNative('goLuckDraw')
    }
    return state
  }
}

export {xhh, wap}
