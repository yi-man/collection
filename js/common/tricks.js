/**
 * Created by xuxin on 14-12-25.
 */

/*
*   <input type="text" id="my-ok">
*   输入小写自动转大写
*
*   用户在输入框输入文本，keypress事件会在浏览器接收文本之前触发,会将前面的转化为大写
*   setTimeout(function(){},0)   使得它在浏览器接收到文本之后触发
*
*   setTimeout(f,0)实际上意味着，将任务放到浏览器最早可得的空闲时段执行
* */
document.getElementById('my-ok').onkeypress = function() {
    var self = this;
    setTimeout(function() {
        self.value = self.value.toUpperCase();
    }, 0);
}


/*
* IE domready的检测
* */
function IEContentLoaded (w, fn) {
  var d = w.document, done = false,
  // 只执行一次用户的回调函数init()
    init = function () {
      if (!done) {
        done = true;
        fn();
      }
    };
  (function () {
    try {
      // DOM树未创建完之前调用doScroll会抛出错误
      d.documentElement.doScroll('left');
    } catch (e) {
      //延迟再试一次~
      setTimeout(arguments.callee, 50);
      return;
    }
    // 没有错误就表示DOM树创建完毕，然后立马执行用户回调
    init();
  })();
  //监听document的加载状态
  d.onreadystatechange = function() {
    // 如果用户是在domReady之后绑定的函数，就立马执行
    if (d.readyState == 'complete') {
      d.onreadystatechange = null;
      init();
    }
  };
}
