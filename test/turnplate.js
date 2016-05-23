var turnplateSetting = {
  url: '/index.php/Index/Act/runLottery'
};
function turnplate($target){
  this.$target = $('#lot-btn');
  this.isTurning = false;
  this.url = turnplateSetting.url;


  this.turn = function(){
    this.$target.css('cursor', 'default');
    $.get(this.url, function(d){
      if(d.boolen == 1){

      }
    })
  }
}

$(document).on('click', '.lot-btn', function(){
  var $this = $(this);
  if(!isTurning){
    $this.css('cursor', 'default');
    $.get('/index.php/Index/Act/runLottery',{'activity_name':'zxs'}, function(d){
      if(d.boolen == 1){
        var $turnplate = $("#turnplate");
        var type=d.data.type;
        var angle = 0;
        if(type==1 || type==3){
          angle = praise[type];
        }
        else{
          angle=praise[type][d.data.money];
        }
        var restCount = d.data.remain_lottery_cnt;

        $turnplate.rotate({
          animateTo: angle + 360*ring,
          duration: 10000,
          callback: function(){
            isTurning = false;
            $this.css('cursor', 'pointer');
            $praiseCount.html(restCount);
            if(d.data.money){
              $praiseMoney.html(d.data.money + '元');
            }
            // if(restCount == 0){
            //   $('.lot').hover(function(){
            //     $(this).css({'top':'110px','cursor':'normal'})
            //   });
            //   // $('#goOnPraise').addClass('disableWp').attr('data-disabled', '1')
            //   //   .find('img').attr('src', '/public/image/worldCup/disCupTU_03.png');
            // }else{
            //   // $('#goOnPraise').removeClass('disableWp').attr('data-disabled', '0')
            //   //   .find('img').attr('src', '/public/image/worldCup/huojiangBut_11.png');
            //    $('.lot').hover(function(){
            //     $(this).css({'top':'108px','cursor':'cursor'})
            //   },function(){
            //     $(this).css({'top':'110px','cursor':'normal'})
            //   });
            // }
            if(type==1){
              $.colorbox({
                href: '#award-interest-free',
                inline: true,
                onLoad:function(){
                  $('#colorboxClose').remove();
                }
              });
            }else if(type==3){
              $.colorbox({
                href: '#award-none',
                inline: true,
                onLoad:function(){
                  $('#colorboxClose').remove();
                }
              });
            }else if(type==2){
              $.colorbox({
                href: '#award-money',
                inline: true,
                onLoad:function(){
                  $('#colorboxClose').remove();
                }
              });
            }else{
              $.colorbox({
                href: '#award-iphone6',
                inline: true,
                onLoad:function(){
                  $('#colorboxClose').remove();
                }
              });
            }

            $.colorbox.resize();
          }
        });
      }else{
        $this.css('cursor', 'pointer');
        isTurning = false;
        if(d.data.to_invest!=undefined){
          if(d.data.to_invest){
            $.colorbox({
              href: '#award-invest',
              inline: true,
              onLoad:function(){
                $('#colorboxClose').remove();
              }
            });
          }
        }else{
          popBox.error(d.message);
        }

      }
    }, 'json');
  }
  isTurning = true;
});