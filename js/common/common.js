/*
* js获取xxx.com?a=1&b=1中的参数值
* */
function getQuerystring(name){
    var    reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)"),r=window.location.search.substr(1).match(reg);
    if(r!=null)
        return decodeURI(r[2]);
    return null;
}

/*
* debounce（防抖动）方法
* 实时交互，设定delay时间最多交互一次
*
* */
function debounce(fn, delay){
    var timer = null; // 声明计时器
    return function(){
        var context = this, args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function(){
            fn.apply(context, args);
        }, delay);
    };
}

/*
* 仿 switch 方法
* switch...case不使用大括号，不利于代码形式的统一。
* 此外，这种结构类似于goto语句，容易造成程序流程的混乱，使得代码结构混乱不堪，不符合面向对象编程的原则。
* */
function doAction(action) {
  var actions = {
    'hack': function () {
      return 'hack';
    },

    'slash': function () {
      return 'slash';
    },

    'run': function () {
      return 'run';
    }
  };
 
  if (typeof actions[action] !== 'function') {
    throw new Error('Invalid action.');
  }

  return actions[action]();
}

/*
* 仿 typeof 方法
* type({}); // "object"
* type([]); // "array"
* type(5); // "number"
* type(null); // "null"
* type(); // "undefined"
* type(/abcd/); // "regex"
* type(new Date()); // "date"
* */
function  newTypeOf(o){
    var s = Object.prototype.toString.call(o);
        return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};

