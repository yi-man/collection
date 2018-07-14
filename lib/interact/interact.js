/**
 * Created by xuxin on 2018/4/18.
 */


let wap = window.WAP = {
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
