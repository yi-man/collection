/**
 * Created by xuxin on 2016/12/27.
 */



//js 调用 app
var jsBridge = {
  /*
   * H5 从 Native 获取数据
   * dataType:  数据类型
   * callback： 获取数据后的回调函数
   * data： Object   传给app的数据对象（非必填）
  */
  getData (dataType, callback, data) {
  },

  /*
  *   H5告诉Native APP一些数据
  *   dataType:  数据类型
  *   data： Object   传给app的数据对象（非必填）
  * */
  putData (dataType, data) {},

  /*
  *   page: Native 页面名
  *   data: 携带的数据
  * */
  go2Native (page, data) {},

  /*
  * 调用app的功能
  *
  * action: 操作功能类型
  * data：   额外的参数
  * */
  doAction (action, data) {},

  /*
  *   app 调用该方法 触发 H5 变化
  *   event   事件
  *   data    app带过来的数据
  * */
  trigger (event, data) {
    jsEvents[event] || jsEvents[event].call(this, data)
  }
}

// 子标题 不同文字对应不同方法    方法分原生方法，如分享   和 js 方法，如跳转到对应的页面
// 可否定义一个 type ？
jsBridge.putData('configHeader', {
  title: '活动',
  subTitle: {
    text: '分享',
    callback: function(){}
  }
})

//哪些action
//share


// app调用js
jsBridge.trigger('goBack', {})

var jsEvents = {
  'goBack': function() {
    window.history.go(-1)
  }
}
