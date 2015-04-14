/**
 * Created by xuxin on 15-4-13.
 */

//zepto或者jquery
  // 滚动的时候hide，设置延时执行函数，若延时执行函数不为null，则清空，所以只有最后一次scroll的时候才执行
  //纯js  可用display属性赋值   注意setTimeout里面是匿名函数或者函数名，不要直接执行函数
var scrollTimer = null;
$(window).scroll(function(){
  $('#haha').hide();
  if (scrollTimer != null)
    clearTimeout(scrollTimer);

  scrollTimer = setTimeout(function(){
    $('#haha').show()
  }, 500);

})
