/**
 * Created by xuxin on 15-7-8.
 */
function downloadFile(fileName, contentOrPath){
  var aLink = document.createElement("a"),
    evt = document.createEvent("HTMLEvents"),
    isData = contentOrPath.slice(0, 5) === "data:",
    isPath = contentOrPath.lastIndexOf(".") > -1;

  // 初始化点击事件
  // 注：initEvent 不加后两个参数在FF下会报错
  evt.initEvent("click",false,false);

  // 添加文件下载名
  aLink.download = fileName;

  // 如果是 path 或者 dataURL 直接赋值
  // 如果是 file 或者其他内容，使用 Blob 转换
  aLink.href = isPath || isData ? contentOrPath
    : URL.createObjectURL(new Blob([contentOrPath]));

  aLink.dispatchEvent(evt);
}


function convertCanvasToImage(canvas) {
  var image = new Image();
  var content = canvas.toDataURL("image/png");
  content = content.replace(/^data:image\/[^;]/, 'data:application/octet-stream');

  image.src = content

  // document.body.appendChild(image);

  var a = document.createElement('a');
  a.href = image.src
  a.download = "output.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  return image;
}
