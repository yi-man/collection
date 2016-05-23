// RequireJS && SeaJS
//兼容 requirejs  seajs   nodejs

if (typeof define === 'function') {
  define(function() {
    return template;
  });

// NodeJS
} else if (typeof exports !== 'undefined') {
  module.exports = template;
} else {
  this.template = template;
}


define("insert-css",function(e,t,n){
  var s={};
  n.exports=function(e){
    if(!s[e]){
      s[e]=!0;
      var t=document.createElement("style");
      t.setAttribute("type","text/css"),"textContent"in t?t.textContent=e:t.styleSheet.cssText=e;
      var n=document.getElementsByTagName("head")[0];
      n.appendChild(t)
    }
  }
});
;define("cookie",function(o,e,i){var c=o("zepto");i.exports=c.cookie});