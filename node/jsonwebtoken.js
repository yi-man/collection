/**
 * Created by xuxin on 2017/6/27.
 */
// sign with default (HMAC SHA256)
var jwt = require('jsonwebtoken');
const secret = '5dbe0241d4dbe6ccd7271c76f1d68ce2',
  secret1 = '5dbe0241d4'

const obj = {"boolen":"1","message":"登陆成功","data":{"uid":"383337","email":"xxwade2010@163.com","uname":"xxwade","real_name":"许鑫","mi_id":"2","vip_group_id":",,","sex":"0","mobile":"18601762076","person_id":"320683198703155055","is_email_auth":"1","is_mobile_auth":"1","is_id_auth":"1","is_active":"1","before_logintime":"1498221172","is_paypwd_edit":"1","is_change_uname":"0","is_set_uname":"1","is_paypwd_mobile_set":"1","is_passwd_recharge":"0","uid_type":"1","safe_level":100,"safe_level_label":"c","is_set_photo":1,"org_name":"","corp_status":"","legal_name":"","ava":{"url":"http:\/\/img.yrz.cn\/data\/uploads\/img\/2017\/03\/15\/58c8e99a64468.jpg","url_s700":"http:\/\/img.yrz.cn\/data\/uploads\/img\/2017\/03\/15\/s700_58c8e99a64468.jpg","url_s300":"http:\/\/img.yrz.cn\/data\/uploads\/img\/2017\/03\/15\/s300_58c8e99a64468.jpg","url_s100":"http:\/\/img.yrz.cn\/data\/uploads\/img\/2017\/03\/15\/s100_58c8e99a64468.jpg","url_s50":"http:\/\/img.yrz.cn\/data\/uploads\/img\/2017\/03\/15\/s50_58c8e99a64468.jpg"},"identity_no":"","is_newbie":"0","remindList":[],"is_binding_bank":"1","is_could_invest":"1","is_set_sqa":"1","is_all":"1","is_recharged":"1","user_is_qfx":true,"isbankck":1}}
const str = 'a'

var token = jwt.sign(str, secret),
  token1 = jwt.sign(str, secret1)


console.log(token.length + '--------' + token1.length)
