/**
 * Created by xuxin on 2017/6/15.
 */
// 策略对象
var VerifiPolicy = {
  // 判断是否为空
  isNoEmpty : function(value, errorMsg){
    if(value == ''){
      return errorMsg;
    }
  },
  // 判断最小长度
  minLength : function(value, length, errorMsg){
    if(value.length < length){
      return errorMsg;
    }
  },
  // 判断是否为手机号
  isMobile : function(value, errorMsg){
    if(!/(^1[3|5|8][0-9]{9}$)/.test(value)){
      return errorMsg;
    }
  }
  // 其他
}

// 构造函数
var Formvalidation = function(VerifiPolicy){
  // 保存策略对象
  this.strategies = VerifiPolicy;
  // 验证缓存
  this.validationFns = [];
}

// add 方法
Formvalidation.prototype.add = function(dom, rule, errorMsg){

  var ary = rule.split(':');
  var arg = [];
  var self = this;
  this.validationFns.push(function(){
    arg = [];	// 重置参数
    var ruleName = ary[0];	// 策略对象方法名

    // 组装参数
    arg.push(dom.value);
    if(ary[1]){
      arg.push(ary[1]);
    }
    arg.push(errorMsg);

    // 调用策略函数
    return self.strategies[ruleName].apply(dom, arg);
  });
}

// 开始验证
Formvalidation.prototype.start = function(){
  for(var i = 0; ; i++){
    var msg = this.validationFns[i]();
    if(msg){
      return msg;
    }
  }
}