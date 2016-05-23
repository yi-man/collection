/**
 *  var opt = {
    shareTitle: '双十一活动',
    shareMessage: '嗨翻全场，尽在鑫合汇',
    shareImg: 'wo.jpg',
    shareUrl: 'http://www.baidu.com',
    device: 1
  };
 var act = new Activity(opt);
 window['After_Form'] = function(json){
    if(json.boolean===1){

    }else{

    }
  }
 act.add('form:form');
 *
 */

var type = function (o){
  var s = Object.prototype.toString.call(o);
  return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};
['Null',
  'Undefined',
  'Object',
  'Array',
  'String',
  'Number',
  'Boolean',
  'Function',
  'RegExp',
  'Element',
  'NaN',
  'Infinite'
].forEach(function (t) {
    type['is' + t] = function (o) {
      return type(o) === t.toLowerCase();
    };
  });

function noop(){}

//var defaultOptions = {
//  plugins: ['app', 'box']
//}

var appConfig = {
  //充值
  goRecharge: {
    'android': 'goRecharge',
    'ios': '/index.php/Financing/Invest/chongzhi'
  },
  //登陆
  goLoginRefresh: {
    'android': 'goLoginRefresh',
    'ios': '/index.php/Mobile/Act/goLuckDraw'
  },
  //分享
  goShare: {
    'android': 'toNewShare',
    'ios': '/index.php/Financing/Invest/toNewShare'
  },
  //新客
  goNewGuest: {
    'android': 'goNewGuest',
    'ios': '/index.php/Mobile/Act/goNewGuest'
  },
  //注册
  goRegister: {
    'android': 'goRegister',
    'ios': '/index.php/Mobile/Act/goRegister'
  },
  //账户设置界面 实名认证 绑定邮箱 添加银行卡
  goUserSetting: {
    'android': 'goUserSetting',
    'ios': '/index.php/Mobile/Act/goUserSetting'
  },
  //投资列表 日益升
  goPlist: {
    'android': 'goFinanceRYS',
    'ios': '/index.php/Financing/Invest/plist'
  },
  //投资列表 月益升
  goPlistMonth: {
    'android': 'goFinanceJYB',
    'ios': '/index.php/Mobile/Act/goFinanceJYB'
  },
  //投资列表 年益升
  goPlistYear: {
    'android': 'goFinanceQYR',
    'ios': '/index.php/Mobile/Act/goFinanceQYR'
  },
  //转让市场
  goTransfer: {
    'android': 'goTransfer',
    'ios': '/index.php/Mobile/Act/goTransfer'
  },
  //财富中心
  goAccount: {
    'android': 'goAccount',
    'ios': '/index.php/Mobile/Act/goAccount'
  },
  //投资记录
  goFinanceRecord: {
    'android': 'goFinanceRecord',
    'ios': '/index.php/Mobile/Act/goFinanceRecord'
  },
  //好友推荐
  goRecommend: {
    'android': 'goInvite',
    'ios': '/index.php/Mobile/Act/goRecommend'
  }

};

function app(opt) {
  opt = opt || {};

  var retObj = {
    device: opt.device || 4,
    share: {
      shareTitle: opt.shareTitle||'',
      shareMessage: opt.shareMessage||'',
      shareImg: opt.shareImg||'',
      shareUrl: opt.shareUrl||''
    },
    _goto: function (config, content) {
      if(this.device == 2){
        var api = config['android'];
        if(window.mainweb && typeof window['mainweb'][api] === 'function'){
          if(content){
            window['mainweb'][api](content);
          }
          window['mainweb'][api]();
        }
      }else if(this.device == 1){
        var url = config['ios'];
        if(content){
          url = url + '?content=' + content;
        }
        url = encodeURIComponent(url);
        window.location.href = url;
      }
    },
    goShare: function(share){
      alert(this.share.shareMessage)
      if(this.device == 2){
        var api = appConfig.goShare.android;
        if(window.mainweb && typeof window['mainweb'][api] === 'function'){
          window['mainweb'][api]( this.share.shareMessage, this.share.shareImg, this.share.shareUrl, this.share.shareTitle);
          return;
        }
      } else{
        var url=appConfig.goShare.ios;
        url = url + '?content='+this.share.shareTitle+'&content=' + this.share.shareMessage+'  ' + this.share.shareUrl+'&content=' + this.share.shareUrl+'&content=' + this.share.shareImg;
        url = encodeURIComponent(url);
        window.location.href = url;
      }
    },
    isLatest: function(current, required){
      var required_arr = required.split('.');
      var current_arr = current.split('.');
      for(var i=0; i<3; i++){
        if(current_arr[i]<required_arr[i]){
          return false;
        }else if(current_arr[i]>required_arr[i]){
          return true;
        }
      }
      return true;
    }
  };
  for(var config in appConfig){
    if(config!=='goShare'){
      (function(config){
        retObj[config] = function(content){
          this._goto(appConfig[config], content);
        }
      })(config);
    }
  }

  return retObj;

};

function box(opt){
  opt = opt || {};
  return {
    $mask: opt.$mask || $('.mask'),
    $box: opt.$box || $('.box'),
    hide: function(){
      this.$mask.hide();
      this.$box.hide();
    },
    show: function(id){
      this.hide();
      this.$mask.show();
      $('#'+id).show();
      this._setCenter($('#'+id));
    },
    _setCenter: function($obj){
      $obj = $($obj).show();
      var top = $(window).scrollTop() + $(window).height()/2;
      var width = $obj.width();
      var height = $obj.height();
      $obj.css({
        "position": "absolute",
        "left": '50%',
        "top": top + 'px',
        'marginLeft': '-' + width / 2 + 'px',
        'marginTop': '-' + height / 2 + 'px',
        'zIndex': 99999
      });
    }
  }
};


function weixin(opt){
  //var sdk = 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js';
  var SIGNATURE_URL = '/index.php/Weixin/Index/getsingpack';
  //document.write('<script src="'+sdk+'"></script>');
  opt = opt || {};
  var shareData = {
    title: opt.shareTitle||'',
    desc: opt.shareMessage||'',
    imgUrl: opt.shareImg||'',
    link: opt.shareUrl||''
  };
  function getWxCfg(){
    $.get(SIGNATURE_URL, {url: window.location.href}, function(d){
      if(d.boolen == 1){
        doCfgWx(d.data);
      }else{
        alert('获取失败');
      }
    }, 'json');
  }

  getWxCfg();
  function doCfgWx(conf) {
    wx.config({
      debug: false,
      appId: conf.appId,
      timestamp: conf.timestamp,
      nonceStr: conf.nonceStr,
      signature: conf.signature,
      jsApiList: [
        'onMenuShareTimeline',
        'onMenuShareAppMessage',
        'onMenuShareQQ',
        'onMenuShareWeibo'
      ]
    });

    wx.ready(function () {
      var shareData = {
        title: title,
        desc: desc,
        link: shareUrl,
        imgUrl: imgUrl
      };
      wx.onMenuShareAppMessage(shareData);//监听"分享给朋友"
      wx.onMenuShareTimeline(shareData);//监听"分享到朋友圈"
      wx.onMenuShareQQ(shareData);//监听"分享到QQ"
      wx.onMenuShareWeibo(shareData);//监听"分享到微博"
    });
  }
}

function form(args){
  var self = this;
  var $form = args[0] ? $('#'+args[0]) : $('form').eq(0);
  var $err = $form.find('.form-error');
  var cb = args[1] ? (typeof window[args[1]]==="function"?window[args[1]]:noop) : noop;

  if($form.length === 0){
    return false;
  }

  $form.find('input[type=text]').focus(function(){
    $err.hide();
  })
  $form.find('input[type=hidden]').focus(function(){
    $err.hide();
  })
  $form.find('textarea').focus(function(){
    $err.hide();
  })


  $form.submit(function(e){
    var method = $form.attr('method') || 'get';
    var url = $form.attr('action');
    var $inputs = $form.find('input[type=text]');
    var $hidden = $form.find('input[type=hidden');
    var $textareas = $form.find('textarea');
    var $elems = [];
    $elems = $elems.concat($inputs, $hidden, $textareas);

    var len = $elems.length;

    for(var i=0; i<len; i++){
      var elem = $elems[i];
      var $elem = $(elem);
      if(!self.valid($elem, $err)){
        return false;
      }
    }

    $[method](url, $form.serialize(), function(json){
      cb();
      if(json.boolean===1){
      }else{
        $err.show().html(json.message);
      }
    }, 'json')
    return false;
  })
}

form.prototype.valid = function($elem, $err){
  var valid = $elem.attr('valid-type').split(','),
    chinese = $elem.attr('data-chinese'),
    val = $elem.val().trim(),
    len = valid.length;

  if(valid.length > 0){
    for(var i=0; i<len; i++){
      var type = valid[i];
      if(type === 'required'){
        if(val === ''){
          $err.show().html(chinese+'不能为空');
          return false;
        }
      }else if(type === 'mobile'){
        if(!/^[\u0391-\uFFE5A-Za-z]+$/.test(val)){
          $err.show().html('请输入汉字或英文字母');
          return false;
        }
      }else if(type === 'name'){
        if(!/^[\u0391-\uFFE5A-Za-z]+$/.test(val)){
          $err.show().html('请输入汉字或英文字母');
          return false;
        }
      }else if(type.indexOf('length')!==-1){
        var max = parseInt(type.substr(type.indexOf(':')+1));
        if(val.length>120){
          $err.show().html('不能超过'+max+'字符');
          return false;
        }
      }
    }
  }

  return true;
}

function Activity(opt){
  var self = this;
  opt = type.isObject(opt)?opt:{};

  this.device = parseInt(opt.device||4);   //device==1 ios,2 android, 4 默认
  this.$mask = opt.$mask || $('.mask');
  this.$box = opt.$box || $('.box');

  var plugins = ['app', 'box'];
  if(opt.plugins && type.isArray(opt.plugins)){
    this.plugins = opt.plugins.concat(plugins);
  }else{
    this.plugins = plugins;
  }

  function _initPlugin(arr){
    if(!type.isArray(arr) || arr.length === 0) return;
    var len = arr.length;
    for(var i=0; i<len; i++){
      var plugin = arr[i];
      var p_arr = plugin.split(':');

      var fn = window[p_arr[0]];
      p_arr.splice(0, 1);

      if(typeof fn === "function"){
        if(p_arr.length>0){
          self[plugin] = new fn(p_arr);
        }else{
          self[plugin] = new fn(opt);
        }
      }
    }
  }

  this.add = function(plugin){
    var arr = [];
    if(type.isString(plugin)){
      arr.push(plugin);
    }else{
      arr = arr.concat(plugin);
    }
    _initPlugin(arr);
  }


  if(type.isArray(this.plugins) && this.plugins.length > 0){
    this.add(this.plugins);
  }

}




function Act(opt){
  var self = this;
  opt = type.isObject(opt)?opt:{};

  this.device = parseInt(opt.device||4);   //device==1 ios,2 android, 4 默认
  this.$mask = opt.$mask || $('.mask');
  this.$box = opt.$box || $('.box');

  var plugins = ['app', 'box'];
  if(opt.plugins && type.isArray(opt.plugins)){
    this.plugins = opt.plugins.concat(plugins);
  }else{
    this.plugins = plugins;
  }

  if(type.isArray(this.plugins) && this.plugins.length > 0){
    self.add(this.plugins);
  }

}

Act.prototype.initPlugin = function(arr){
  if(!type.isArray(arr) || arr.length === 0) return;
  var len = arr.length;
  for(var i=0; i<len; i++){
    var plugin = arr[i];
    var p_arr = plugin.split(':');

    var fn = window[p_arr[0]];
    p_arr.splice(0, 1);

    if(typeof fn === "function"){
      if(p_arr.length>0){
        this[plugin] = new fn(p_arr);
      }else{
        this[plugin] = new fn(opt);
      }
    }
  }
}


Act.prototype.add = function(plugin){
  var arr = [];
  if(type.isString(plugin)){
    arr.push(plugin);
  }else{
    arr = arr.concat(plugin);
  }
  this.initPlugin(arr);
}









