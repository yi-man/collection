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
