/**
 * Created by xuxin on 2018/6/28.
 *
 * node --print-bytecode bytecode.js >> tmp.txt
 * --print-bytecode 可以查看 V8 引擎生成的字节码
 * 在输出结果中查找“[generating bytecode for function: f]”
 */

// https://www.zhihu.com/question/282228797/answer/427739238
function f(a,b){
  return a+b;
}
const d = f(1, 2);
