/**
 * Created by xuxin on 15-1-29.
 */

/*
* jquery 的实现
* */
$('#toggle-5days-btn').click(function(){
  var $downicon = $(this).find('.downIcon');
  var $upicon = $(this).find('.upIcon');
  if($upicon.length===0){
    $('#toggle-5days-data').animate({'height':'230px'},200,
      function(){
        $downicon.removeClass('downIcon').addClass('upIcon');
      });
  }
  else{
    $('#toggle-5days-data').animate({'height':'70px'},200,
      function(){
        $upicon.removeClass('upIcon').addClass('downIcon');
      });
  }
});