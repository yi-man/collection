/**
 * Created by xuxin on 16/7/7.
 */
<!DOCTYPE html>
<html>
<head>
<meta charset=utf-8><title><%= htmlWebpackPlugin.options.title %></title>
  <meta name=viewport content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,minimal-ui">
  <meta content=yes name=apple-mobile-web-app-capable>
  <meta name=apple-mobile-web-app-status-bar-style content=black-translucent>
  <meta content=black name=apple-mobile-web-app-status-bar-style>
  <script async=async src=//res.wx.qq.com/open/js/jweixin-1.0.0.js></script>
<% htmlWebpackPlugin.files.css.forEach(function(item){ %>
  <link rel="stylesheet" type="text/css" href="<%= item %>">
    <% }) %>
</head>
<body>
<div id=app></div>
  <% htmlWebpackPlugin.files.js.forEach(function(item){ %>
    <% if(!/icons/.test(item)) { %>
    <script src="<%= item %>"></script>
        <% } %>
    <% }) %>
  </body>
  </html>



  <!DOCTYPE html>
<html>
<head>
<meta charset=utf-8>
<title><%= htmlWebpackPlugin.options.title %></title>
  <meta name=viewport
content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,minimal-ui">
  <meta content=yes name=apple-mobile-web-app-capable>
  <meta name=apple-mobile-web-app-status-bar-style content=black-translucent>
  <meta content=black name=apple-mobile-web-app-status-bar-style>
  <script async=async src=//res.wx.qq.com/open/js/jweixin-1.0.0.js></script>
<%  var cssArr = []
htmlWebpackPlugin.files.css.forEach(function(item){
  cssArr.push(item)
})
var cssStr = cssArr.join(',')
  %>
  <meta data-css=<%= cssStr %>>
  <script>
  function ajax(url) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          window.localStorage.setItem(fileMap(url), xhr.responseText)
        }
      }
    };
    xhr.open("GET", url, true);
    xhr.send(null)
  }
function fileMap(file) {
  return file.substr(file.lastIndexOf("/") + 1)
}
function findLocalItems(query) {
  var i;
  for (i in localStorage) {
    if (localStorage.hasOwnProperty(i)) {
      if (i.match(query)) {
        return i
      }
    }
  }
  return false
}
var css = document.querySelector("[data-css]").getAttribute("data-css").split(",");
for (var i = 0; i < css.length; i++) {
  var url = fileMap(css[i]);
  if (window.localStorage[url]) {
    loadCss(url, true)
  } else {
    var arr = url.split(".");
    var reg = new RegExp("^(" + arr[0] + "\\.)\\w+(\\." + arr[2] + ")$");
    var result = findLocalItems(reg);
    if (result) {
      window.localStorage.removeItem(result)
    }
    loadCss(css[i])
  }
}
function loadCss(url, isLocal) {
  if (isLocal) {
    var style = document.createElement("style");
    style.setAttribute("type", "text/css");
    var str = window.localStorage[url.substr(url.lastIndexOf("/") + 1)];
    var cssText = document.createTextNode(str);
    style.appendChild(cssText);
    var heads = document.getElementsByTagName("head");
    heads[0].appendChild(style)
  } else {
    var link = document.createElement("link");
    link.setAttribute("rel", "stylesheet");
    link.setAttribute("type", "text/css");
    link.setAttribute("href", url);
    ajax(url);
    var heads = document.getElementsByTagName("head");
    heads[0].appendChild(link)
  }
};
</script>
</head>
<body>
<div id=app></div>

  <% var scripts = []
htmlWebpackPlugin.files.js.forEach(function(item){
  if(!/icons/.test(item)) {
    scripts.push(item)
  }
})
var scriptsStr = scripts.join(',')
  %>
  <div data-scripts=<%= scriptsStr %>></div>
  <script>
var scripts = document.querySelector("[data-scripts]").getAttribute("data-scripts").split(",");
for (var i = 0; i < scripts.length; i++) {
  var script = fileMap(scripts[i]);
  if (window.localStorage[script]) {
    loadScript(script, true)
  } else {
    var arr = script.split(".");
    var reg = new RegExp("^(" + arr[0] + "\\.)\\w+(\\." + arr[2] + ")$");
    var result = findLocalItems(reg);
    if (result) {
      window.localStorage.removeItem(result)
    }
    loadScript(scripts[i])
  }
}
function loadScript(url, isLocal) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.async = false;
  if (isLocal) {
    str = window.localStorage[url];
    script.innerHTML = str
  } else {
    script.src = url;
    script.onload = function() {
      ajax(url)
    }
  }
  document.body.appendChild(script)
};
</script>
</body>
</html>