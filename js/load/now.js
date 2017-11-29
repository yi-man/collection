/**
 * Created by xuxin on 16/7/7.
 */
var css = document.querySelector("[data-css]").getAttribute("data-css").split(",");
for (var i = 0; i < css.length; i++) {
  var url = fileMap(css[i]);
  if (window.localStorage[url]) {
    loadCss(window.localStorage[url])
  } else {
    var arr = url.split(".");
    var reg = new RegExp("^(" + arr[0] + "\\.)\\w+(\\." + arr[2] + ")$");
    var result = findLocalItems(reg);
    if (result) {
      window.localStorage.removeItem(result)
    }
    ajax(css[i])
  }
}

function ajax(url) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        window.localStorage.setItem(fileMap(url), xhr.responseText)
        loadCss(xhr.responseText)
      }
    }
  }
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

function loadCss(content) {
  var style = document.createElement("style");
  style.setAttribute("type", "text/css");
  var str = window.localStorage[fileMap(url)];
  var cssText = document.createTextNode(content);
  style.appendChild(cssText);
  var heads = document.getElementsByTagName("head");
  heads[0].appendChild(style)
}


var scripts = document.querySelector("[data-scripts]").getAttribute("data-scripts").split(",");
var scriptObj = {};
var jsCount = scripts.length;
var loaded = 0;
scripts.forEach(function (val, index) {
  scriptObj[index] = {name: val}
})
for (var i = 0; i < jsCount; i++) {
  var script = fileMap(scripts[i]);
  if (window.localStorage[script]) {
    scriptObj[i]['content'] = window.localStorage[script];
    loaded++;
    if (loaded === jsCount) {
      for (var j=0; j<jsCount; j++) {
        loadScript(scriptObj[j]);
        delete scriptObj[j];
      }
    }
  } else {
    var arr = script.split(".");
    var reg = new RegExp("^(" + arr[0] + "\\.)\\w+(\\." + arr[2] + ")$");
    var result = findLocalItems(reg);
    if (result) {
      window.localStorage.removeItem(result)
    }

    jAjax(i)
  }
}

function jAjax(i) {
  var url = scriptObj[i]['name'];
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        window.localStorage.setItem(fileMap(url), xhr.responseText);
        scriptObj[i]['content'] = xhr.responseText;
        loaded++;
        if (loaded === jsCount) {
          for (var j=0; j<jsCount; j++) {
            loadScript(scriptObj[j]);
            delete scriptObj[j];
          }
        }
      }
    }
  };
  xhr.open("GET", url, true);
  xhr.send(null);
}

function loadScript(obj) {
  var script = document.createElement("script");
  script.type = "text/javascript";
  script.async = false;
  script.innerHTML = obj['content'];
  document.body.appendChild(script);
}