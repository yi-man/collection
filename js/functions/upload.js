/**
 * Created by xuxin on 15-3-24.
 */


/*
* <span id="upload_cover">
 <span class="glyphicon glyphicon-upload">上传</span>
 <input type="file" name="cover" id="cover"></span>
*
*
* 用图标遮挡file
* */



/*
* formdata上传file
* */
 function upload(){
  var formdata=new FormData(),
      file=$('#cover')[0].files[0],
      url='../BreadAPI/common/upload';

  if(file.type!="image/jpeg"&&file.type!="image/png"&&file.type!="image/gif"&&file.type!="image/bmp"){
    $('#state').html('支持jpg,png,gif和bmp').show(500).delay(2000).hide(500);
    return false;
  }
  formdata.append('file',file);
  formdata.append('type','tmp');

  $.ajax({
    url: url,
    type: "POST",
    data: formdata,
    processData: false,
    contentType: false,
    beforeSend:function(){$('#state').html('正在上传。。。').show();}
  })
    .done(function(data){
      var file=prefix+data.response.file;
      $('#state').html('上传成功。。。').show(500).delay(2000).hide(500);
      $('#cover_preview>.img_preview>img').attr('src',file);
      $('.cover_pre>img').attr('src',file);
    })
}

/*
* 不上传预览
* */
function showThumbnail(files,thumbnail){
  for(var i=0;i<files.length;i++){
    var file = files[i];
    var imageType = /image.*/;
    if(!file.type.match(imageType)){
      console.log("Not an Image");
      continue;
    }
    var imgdiv=document.createElement('div'),image = document.createElement("img");
    imgdiv.className='img';
    // image.classList.add("")
    // var thumbnail = document.getElementById("thumbnail");
    image.file = file;
    imgdiv.appendChild(image);
    thumbnail.append(imgdiv);

    var reader = new FileReader();
    reader.onload = (function(aImg){
      return function(e){
        aImg.src = e.target.result;
      };
    }(image));
    var ret = reader.readAsDataURL(file);
    var canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
    image.onload= function(){
      ctx.drawImage(image,0,0);
    };
  }
}

function canvasPreview(file,pre){
  file.change(function(e){
    pre.find('.img').remove();
    var files = this.files,thumbnail=pre;
    showThumbnail(files,thumbnail);
  });
}
