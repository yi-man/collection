/**
 * Created by xuxin on 16/6/3.
 */
var isMobile = !!navigator.userAgent.match(/AppleWebKit.*Mobile.*/);
var path = '/static/activity/css';
if (isMobile) {
  appendLink(path + '/mobile/mobile.css')
} else {
  appendLink(path + '/pc/pc.css')
}

function appendLink(path) {
  var link = document.createElement('link');
  link.setAttribute("rel","stylesheet");
  link.setAttribute("type","text/css");
  link.setAttribute("href", path);
  document.getElementsByTagName("head")[0].appendChild(link);
}
