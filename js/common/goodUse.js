/*
* forEach用法
* */
var type = function (o){
    var s = Object.prototype.toString.call(o);
        return s.match(/\[object (.*?)\]/)[1].toLowerCase();
};
['Null',
 'Undefined',
 'Object',
 'Array',
 'String',
 'Number',
 'Boolean',
 'Function',
 'RegExp',
 'Element',
 'NaN',
 'Infinite'
].forEach(function (t) {
    type['is' + t] = function (o) {
        return type(o) === t.toLowerCase();
    };
});
type.isObject({}); // true
type.isNumber(NaN); // false  `
type.isElement(document.createElement('div')); // true
type.isRegExp(/abc/); // true


/*
* 是将类似数组的对象转为真正的数组
* */
Array.prototype.slice.call({ 0: 'a', 1: 'b', length: 2 })
Array.prototype.slice.call(document.querySelectorAll("div"));
Array.prototype.slice.call(arguments);

/*
* 利用reduce方法，可以写一个数组求和的sum方法。
* */
Array.prototype.sum = function (){
    return this.reduce(function (partial, value){
        return partial + value;
    })
};
[3,4,5,6,10].sum(); //28

/*
* 正则分隔符
* */
"aaa*a*".split(/a*/)
// [ '', '*', '*' ]
"aaa*a*".split(/(a*)/)
// [ '', 'aaa', '*', 'a', '*' ]

/*
* apply的用法
* */
var a = [10, 2, 4, 15, 9];
Math.max.apply(null, a)
// 15


