/**
 * Created by xuxin on 2017/6/15.
 */
self.onmessage = function(event){
  var num = event.data;

  var T = setInterval(function(){

    self.postMessage(--num);
    if(num <= 0){
      clearInterval(T);
      self.close();
    }

  }, 1000);
}
