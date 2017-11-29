/**
 * Created by xuxin on 16/7/18.
 */
// 企业级人脉访客统计

var Ad7NS = new Object();
Ad7NS.register = function(path) {
  var arr = path.split(".");
  var ns = "";
  for (var i = 0; i < arr.length; i++) {
    if (i > 0) {
      ns += "."
    }
    ns += arr[i];
    eval("if(typeof(" + ns + ") == 'undefined') " + ns + " = new Object();")
  }
};
Ad7NS.register("_Ad7NT");
_Ad7NT.init = function() {
  var B = "kvko";
  var A = "a.ad7.com/js/iV2.js";
  this.use = function(F, C) {
    var G = (("https:" === document.location.protocol) ? "https://": "http://") + A + "?Uid=" + B + "&Tag=" + encodeURIComponent(F) + "&Untag=" + encodeURIComponent(C);
    var E = document.getElementById("_mutmzc");
    if (E) {
      E.src = G;
      if (typeof ad7System === "object") {
        ad7System.show()
      }
    } else {
      var H = document.createElement("script");
      H.id = "_mutmzc";
      H.type = "text/javascript";
      H.src = G;
      var D = document.getElementsByTagName("script")[0];
      D.parentNode.insertBefore(H, D)
    }
    return true
  };
  this.start = function(D, C) {
    if (D == undefined) {
      var D = ""
    }
    if (C == undefined) {
      var C = ""
    }
    return this.use(D, C)
  };
  this.add = function(C) {
    return this.use(C, "")
  };
  this.del = function(C) {
    return this.use("", C)
  };
  this.addAndDel = function(D, C) {
    return this.use(D, C)
  }
};
var Ad7NT = new _Ad7NT.init();
Ad7NT.start();
