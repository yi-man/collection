/**
 * Created by xuxin on 2017/6/27.
 * 生成系统和系统间的 jwt secret
 */

/*
*
* 七桥小贷->业务后台
 七桥小贷->鑫资产
 七桥小贷->鑫合汇
 七桥小贷->消息系统

 qqxd   admin   xzc  yrzif   message
 */

const nameA = 'qqxd',
  nameB = 'message',
  timeStamp = Math.floor(Date.now() / 1000)

const secret = 'magic'

const crypto = require('crypto');
const hash = crypto.createHash('md5', secret);


function compare (a, b) {
  return a > b ? [a, b] : [b, a]
}

const compareArr = compare(nameA, nameB)

// 可任意多次调用update():
const jwtSecret = hash.update(compareArr[0]+compareArr[1]+timeStamp).digest('hex');
console.log(jwtSecret);

