#介绍
http://www.jianshu.com/p/a6261263767f

#html用法
` <!DOCTYPE HTML>
<html manifest="demo.appcache">
...
</html> `

#注意事项
* manifest 中文件不能使用正则
 * MineType 文件需要配置正确的 MIME-type，即 "text/cache-manifest"。必须在 web 服务器上进行配置
 * 单个文件大小，Application Cache的尺寸限制统一在5M，单个文件不要超出这个上限。
 * 浏览器对缓存数据的容量限制可能不太一样（某些浏览器设置的限制是每个站点 5MB）。
 * 如果manifest文件，或者内部列举的某一个文件不能正常下载，整个更新过程都将失败，浏览器继续全部使用老的缓存。
 * 引用manifest的html必须与manifest文件同源，在同一个域下。
 * FALLBACK中的资源必须和manifest文件同源。
 * 当一个资源被缓存后，该浏览器直接请求这个绝对路径也会访问缓存中的资源。
 * 站点中的其他页面即使没有设置manifest属性，请求的资源如果在缓存中也从缓存中访问。
 * 当manifest文件发生改变时，资源请求本身也会触发更新。
 

#三部分
* CACHE MANIFEST - 在此标题下列出的文件将在首次下载后进行缓存
* NETWORK - 在此标题下列出的文件需要与服务器的连接，且不会被缓存
* FALLBACK - 在此标题下列出的文件规定当页面无法访问时的回退页面（比如 404 页面）

#格式
 
 重要的提示：以 "#" 开头的是注释行，但也可满足其他用途。应用的缓存会在其 manifest 文件更改时被更新。如果您编辑了一幅图片，或者修改了一个 JavaScript 函数，这些改变都不会被重新缓存。更新注释行中的日期和版本号是一种使浏览器重新缓存文件的办法。
 完整的 Manifest 文件
 
# 更新
 
 一旦应用被缓存，它就会保持缓存直到发生下列情况：
 用户清空浏览器缓存
 manifest 文件被修改（参阅下面的提示）
 由程序来更新应用缓存
 
# 更新机制的问题
 
 更新机制来说，首次更新manifest时，因为页面加载已经开始甚至已经完成，缓存更新尚未完成，浏览器仍然会使用过期的资源；浏览器是当Application Cache有更新时，该次不会使用新资源，第二次才会使用。这个时候update事件中执行window.reload事件。
 
 window.applicationCache.addEventListener("updateready", function(){
   window.location.reload();
 });
 由上例可以知道，缓存的不只是显示定义的文件，比如上例中的applicationcache/时便会默认保存index.html为映射的数据，并且包含demo.appcache文件，很多时候会遇到一次文件更新线上老是不更新，这个时候随便在manifest配置文件中做一点修改即可更新。
 
 手动更新缓存
 
 window.applicationCache.update();
 
# 强制更新
 
 window.applicationCache.swapCache()
 
 VM8486:2 Uncaught DOMException: Failed to execute 'swapCache' on 'ApplicationCache': there is no newer application cache to swap to.(…)
 
 需要有可以更新到的版本
 
 更新缓存流程和事件
 
 
 更新缓存流程和事件
 
 