/**
 * Created by xuxin on 15-6-10.
 */
function Game(){
  var self = this;
  this.$score = $('#score');
  this.$gameTime = $('#gameTime');
  this.$countDown = $('#countDown');
  this.$gamePanel = $('#gamePanel');
  this.$lis = this.$gamePanel.find('li');
  this.$lis.on('click', function(){
    var $this = $(this);
    if($this.hasClass('cur')){
      $this.addClass('hit');
      self.score += 1;
      self.$score.val(self.score);
      setTimeout(function () {
        $this.removeClass('hit');
      }, 500);
    }
  });

  this.reset();
}
Game.prototype.reset = function(){
  this.isPlaying = false;
  this.score = 0;
  this.gameTime = 20;
  this.countDownTime = 3;
  this.data = [];
  this.numPersecond = 10;
  this.$gameTime.val(this.gameTime);
  this.$score.val(this.score);
  this.$countDown.html(this.countDownTime);
};
Game.prototype.init = function(){
  var self = this,
    timer = null;
  this.reset();
  self.$countDown.fadeIn(200);
  timer = setInterval(function(){
    self.countDownTime -= 1;
    if(self.countDownTime < 0){
      clearInterval(timer);
      self.$countDown.empty().fadeOut(200);
      self.start();
    }else{
      self.$countDown.html(self.countDownTime);
    }
  }, 1000);
};
Game.prototype.start = function(){
  var self = this,
    gameTimer = null;
  this.isPlaying = true;
  gameTimer = setInterval(function(){
    self.gameTime -= 1;
    if(self.gameTime < 0){
      clearInterval(gameTimer);
      self.over();
    }else{
      self.$gameTime.val(self.gameTime);
    }
  }, 1000);
  self.showGold();
};
Game.prototype.over = function(){
  this.isPlaying = false;
  this.$countDown.html('<p><strong>游戏结束</strong><br>您共获得了 ' + this.score + 'g 金条!</p>').fadeIn(200);
};
Game.prototype.showGold = function(){
  var self = this,
    t = null,
    random;
  t = setInterval(function(){
    random = randomFactory.createRandomArr(1, 16);
    self.itemShow(random);
    if(self.gameTime == 0){
      clearInterval(t);
    }
  }, 1000 / self.numPersecond);
};
Game.prototype.itemShow = function(num){
  var $this = this.$lis.eq(num);
  $this.addClass('cur');
  setTimeout(function(){
    $this.removeClass('cur');
  }, 1000);
};

var randomFactory = {
  lastData: [],
  createRandomArr: function(count, range){
    var data = [],
      i = 0,
      r;
    for(; i < count; i++){
      r = this.createRandom(range);
      while(data.indexOf(r) > -1 || this.lastData.indexOf(r) > -1){
        r = this.createRandom(range);
      }
      data.push(r);
    }
    this.lastData = data;
    return data;
  },
  createRandom: function(range){
    return Math.floor(Math.random() * range);
  }
};

$(function(){
  var game = new Game();
  $('#start').on('click', function(){
    game.init();
  });
});
