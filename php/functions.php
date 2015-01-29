<?php
/**
 * Created by PhpStorm.
 * User: xuxin
 * Date: 15-1-28
 * Time: 上午10:17
 */

/**
 * 系统加密方法
 * @param string $data 要加密的字符串
 * @param string $key  加密密钥
 * @param int $expire  过期时间 单位 秒
 * @return string
 * @author 麦当苗儿 <zuojiazi@vip.qq.com>
 */
function think_encrypt($data, $key = '') {
    $key    = md5(empty($key) ? C('DATA_AUTH_KEY') : $key);
    import("ORG.Crypt.Crypt");
    $crypt = new Crypt();
    $str = $crypt->encrypt($data, $key,true);
    $result = str_replace('=', '',$str);
    return rawurlencode($result);
}


/**
 * 系统解密方法
 * @param  string $data 要解密的字符串 （必须是think_encrypt方法加密的字符串）
 * @param  string $key  加密密钥
 * @return string
 * @author 麦当苗儿 <zuojiazi@vip.qq.com>
 */
function think_decrypt($data, $key = ''){
    $key    = md5(empty($key) ? C('DATA_AUTH_KEY') : $key);
    $data = rawurldecode($data);
    import("ORG.Crypt.Crypt");
    $crypt = new Crypt();
    $str = $crypt->decrypt($data, $key,true);
    return $str;
}

//凯撒加密
function caesar_encode($s, $k='') {
    $k = $k ? $k : C('DATA_AUTH_KEY');
    for($i=0; $i<strlen($k); $i++) {
        $d = base_convert($k{$i}, 36, 10);
        $t = '';
        for($j=0; $j<strlen($s); $j++){
            $t .= base_convert((base_convert($s{$j}, 36, 10)+$d)%36, 10, 36);
        }
        $s = $t;
    }
    return $t;
}

//凯撒解密
function caesar_decode($s,$k=''){
    $k = $k ? $k : C('DATA_AUTH_KEY');
    for($i=0; $i<strlen($k); $i++) {
        $d = 36 - base_convert($k{$i}, 36, 10);
        $t = '';
        for($j=0; $j<strlen($s); $j++){
            $t .= base_convert((base_convert($s{$j}, 36, 10)+$d)%36, 10, 36);
        }
        $s = $t;
    }
    return $t;
}


/**
 * 中文转拼音
 * @param unknown $uname
 * @return Ambigous <string, boolean, unknown>
 */
function pinyin($uname){
    import_addon("libs.Pinyin");
    $pinyin = new Pinyin();
    return $pinyin->output($uname);
}

function jsonReturn($data='',$info='',$status=1) {
    $result  =  array();
    $result['boolen']  =  is_numeric($status) ? "".$status."" : $status;
    $result['message'] =  is_numeric($info) ? "".$info."":$info;
    $result['data'] = is_numeric($data) ? "".$data."":$data;
    header("Content-Type:text/html; charset=utf-8");
    tag('exit_end');
    if(phpversion() >= '5.4') exit(json_encode($result,JSON_UNESCAPED_UNICODE));
    else exit(json_encode($result));
}


function ajaxReturn($data='',$info='',$status=1,$isJs=0) {
    $result  =  array();
    $result['boolen']  =  $status;
    $result['message'] =  $info;
    $result['data'] = $data;
    if($isJs){
        header("Content-Type:text/js; charset=utf-8");
    }else{
        header("Content-Type:text/html; charset=utf-8");
    }
    tag('exit_end');
    if(phpversion() >= '5.4') exit(json_encode($result,JSON_UNESCAPED_UNICODE));
    else exit(json_encode($result));
}


function errorReturn ($info=''){
    if(IS_CLI){
        throw_exception($info);
    }
    MyError::add($info);
    return false;
}

/**
 * json 格式解析
 * @param array $arr
 */
function jsonencode($arr){
    $na = array();
    if($arr){
        if(is_array($arr)){
            foreach ($arr as $k => $value) {
                $na[$k] = $value ? url_encode($value):$value;
            }
        }else{
            $na = urlencode($arr);
        }
    }
    return addcslashes(urldecode(json_encode($na)),"\r\n");
}

/**
 * urlencode解析
 * @param array $elem
 * @return mixed
 */
function url_encode($elem){
    if(!$elem) return "";
    if(is_array($elem)){
        foreach($elem as $k=>$v){
            $na[url_encode($k)] = url_encode($v);
        }
        return $na;
    }
    return urlencode($elem);
}

/**
 * 身份证显示
 * @param unknown $personId
 */
function person_id_view($personId){
    return substr($personId,0,3)."****".substr($personId, 7,(strlen($personId)-11))."****";
}

function person_id_view_prefix($personId){
    if(empty($personId)){
        return '';
    }
    return substr($personId,0,6)."***********";
}

/**
 * 银行卡显示
 * @param unknown $personId
 */
function bank_no_view($bank_no){
    $bank_no = preg_replace("/^( )+|( )+$/",'',$bank_no);
    $bank_no = preg_replace("/^(　)+|(　)+$/",'',$bank_no);
    return substr($bank_no,0,4)." **** **** ".substr($bank_no,-4,4);
}


/**
 * 工商执照显示
 * @param $licence_no
 * @return string
 */
function licence_no_view($licence_no){
    $licence_no = preg_replace("/^( )+|( )+$/",'',$licence_no);
    $licence_no = preg_replace("/^(　)+|(　)+$/",'',$licence_no);
    return substr($licence_no,0,4)."********".substr($licence_no,-4,3);
}

/**
 * 车牌号显示
 * @param $plateId
 * @param $right_length
 * @return string
 */
function car_plate_view($plateId,$right_length){
    $s = mbLength($plateId);
    $left_length=$s-$right_length;
    $left = msubstr($plateId, 0, $left_length, 'utf-8', FALSE);
    return $left.str_repeat('*',$right_length);

}
/**
 * 获取字典项显示名
 *
 * @param $code_key         字典码
 * @param $code_no          字典项值
 * @param string $lang_type 语言
 * @param bool $refresh     是否刷新字典码列表缓存数据
 * @return string
 */
function getCodeName($code_key, $code_no, $lang_type='zh_CN', $refresh=false) {
    $code_list = getCodeItemList($code_key, $refresh, TRUE);
    if(!$code_list)
        return '';
    $return = null;
    foreach ($code_list as $code) {
        if($code['code_no'] == $code_no && $code['lang_type'] == $lang_type)
        {
            if ($code['mi_no'] == BaseModel::getApiKey('api_key'))
                return $code['code_name'];
            else
                $return = $code['code_name'];
        }
    }
    if ($return===null)
        return '';
    else
        return $return;
}

/**
 * 字典项数据
 */
function getCodeItem($code_key, $code_no){
    $where = array(
        'code_key' => $code_key,
        'code_no' => $code_no,
        'mi_no' => BaseModel::getApiKey('api_key')
    );
    $code = M('code_item')->where($where)->find();
    if($code) return $code;
    $where['mi_no'] = '';
    $code = M('code_item')->where($where)->find();
    if($code) return $code;
    return false;
}

// 检测输入值属否大于0
function gtZero($value='') {
    return $value + 0 > 0;
}

function gteZero($value='') {
    return $value + 0 >= 0;
}

/**
 * 用户输入金额处理
 *
 * @param int $number   输入金额
 * @param string $unit  输入单位：W->万，Y->亿
 * @param bool $abs     默认强制转换成正数
 * @return int          最终入库默认乘100
 */
function fMoney($number=0, $unit='W', $abs=TRUE) {
    $number += 0;

    if($unit == 'Y') {
        $number *= 100000000;
    } elseif ($unit == 'W') {
        $number *= 10000;
    }
    return abs($number * 100);
}


// 去掉小数点后面的0，并可加上单位
function floatParse($float,$float_unit){
    if($float === '' || is_null($float)){
        return '';
    }else{
        return floatval($float).strval($float_unit);
    }
}
/**
 * 金额输出转换
 *
 * @param int $number           金额
 * @param int $demical          小数精度
 * @param bool $is_unit         是否转换成万、亿单位
 * @param string $unit_space    数字和单位之间的空格字符
 * @param bool $isShowUnit
 * @param string $thousands_sep
 * @param string $dec_point
 * @return string
 */
function humanMoney($number=0, $demical=2, $is_unit=TRUE, $unit_space=' ',$isShowUnit=TRUE, $thousands_sep = ',', $dec_point = '.' ) {
    $number += 0;
    $number /= 100;
    $unit = '';

    if(!$is_unit) {
        return number_format($number, $demical, $dec_point, $thousands_sep);
    }

    /*if ($number >= 100000000) {
        $number = round($number/100000000, $demical);
        $unit = '亿';
    }else*/if($number >= 10000) {
        $demical = max(2, (int)strpos(strrev($number/10000), '.')) ; // 万小数点位数
        $number = round($number/10000, $demical);
        $unit = '万';
    }else{
//     	$demical = 2;
        $unit = '元';
    }
    if(!$isShowUnit) $unit='';
    return number_format($number, $demical, $dec_point, $thousands_sep) . ($unit ? $unit_space : '') . $unit;
}

/**
 * 检查手机号码
 * @param unknown $mobile
 * @return boolean
 */
function checkMobile($mobile){
    return preg_match("/^(0|86|17951)?(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9])[0-9]{8}$/",$mobile) ? true:false;

    // 现有账户格式类似  xinhehui_13988777321 下面验证会漏过
    //return preg_match("/^13[0-9]{1}[0-9]{8}$|14[0-9]{1}[0-9]{8}$|15[0-9]{1}[0-9]{8}$|18[0-9]{1}[0-9]{8}$/",$mobile) ? true:false;
}

/**
 * 检查邮箱
 * @param unknown $email
 * @return boolean
 */
function checkEmail($email){
    return preg_match("/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/",$email) ? true:false;
}


function postData($url, $data='') {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);

    $response = curl_exec($ch);
    curl_close($ch);
    return $response;
}

//获取请求类型
function getRequestType(){
    $accept = $_SERVER['HTTP_ACCEPT'];
    $types = explode(',', $accept);
    if(in_array("text/html", $types)){
        return "html";
    }elseif(in_array("application/json", $types)){
        return "json";
    }elseif(in_array("application/xml", $types)){
        return "xml";
    }else{
        return "unknow";
    }
}


/**
 * 计算Unicode字符串长度
 *
 * @param $str
 * @param string $charset
 * @return int
 */
function mbLength($str, $charset = "utf-8")
{
    if (empty($str)) {
        return 0;
    }
    if (function_exists('mb_strlen')) {
        return mb_strlen($str, 'utf-8');
    } else {
        $re['utf-8'] = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
        $re['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
        $re['gbk'] = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
        $re['big5'] = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
        preg_match_all($re[$charset], $str, $ar);
        return count($ar[0]);
    }
}


/**
 * Unicode截取
 * 继承自extend.php中的msubstr函数，
 * 修复根据长度决定是否加suffix
 *
 * @param $str
 * @param int $start
 * @param $length
 * @param string $charset
 * @return string
 */
function mbSubstr($str, $start = 0, $length, $charset = "utf-8")
{
    $suffix = mbLength($str) > $length;
    return msubstr($str, $start, $length, $charset, $suffix);
}

//获取顶级域名
function parseHost($httpurl){
    $host = strtolower ($httpurl);
    if (strpos ( $host, '/' ) !== false) {
        $parse = @parse_url ( $host );
        $host = $parse ['host'];
    }
    $topleveldomaindb = array ('com', 'edu', 'dev', 'gov', 'int', 'mil', 'net', 'org', 'biz', 'info', 'pro', 'name', 'museum', 'coop', 'aero', 'xxx', 'idv', 'mobi', 'cc', 'me' );
    $str = '';
    foreach ( $topleveldomaindb as $v ) {
        $str .= ($str ? '|' : '') . $v;
    }

    $matchstr = "[^\.]+\.(?:(" . $str . ")|\w{2}|((" . $str . ")\.\w{2}))$";
    if (preg_match ( "/" . $matchstr . "/ies", $host, $matchs )) {
        $domain = $matchs ['0'];
    } else {
        $domain = $host;
    }
    return $domain;
}

function msubstr($str, $start=0, $length, $charset="utf-8", $suffix=true) {
    if(function_exists("mb_substr"))
        $slice = mb_substr($str, $start, $length, $charset);
    elseif(function_exists('iconv_substr')) {
        $slice = iconv_substr($str,$start,$length,$charset);
        if(false === $slice) {
            $slice = '';
        }
    }else{
        $re['utf-8']   = "/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|[\xe0-\xef][\x80-\xbf]{2}|[\xf0-\xff][\x80-\xbf]{3}/";
        $re['gb2312'] = "/[\x01-\x7f]|[\xb0-\xf7][\xa0-\xfe]/";
        $re['gbk']    = "/[\x01-\x7f]|[\x81-\xfe][\x40-\xfe]/";
        $re['big5']   = "/[\x01-\x7f]|[\x81-\xfe]([\x40-\x7e]|\xa1-\xfe])/";
        preg_match_all($re[$charset], $str, $match);
        $slice = join("",array_slice($match[0], $start, $length));
    }
    return $suffix ? $slice.'...' : $slice;
}/**
 * 字符串中间打星号
 *
 * @param $str
 * @param int $left_length  左边保留长度
 * @param int $right_length 右边保留长度
 * @return string
 */
function maskName($str, $left_length=1, $right_length=1) {
    $s = mbLength($str);
    if($s < $left_length + $right_length) {
        return $str;
    }
    $left = msubstr($str, 0, $left_length, 'utf-8', FALSE);
    if($s == $left_length + $right_length) {
        return $left . str_repeat('*', $right_length);
    }
    $right = msubstr($str, $s - $right_length, $right_length, 'utf-8', FALSE);
    return $left . str_repeat('*', $s - $left_length - $right_length) . $right;
}


/**
 * 传入url，转换成带时间戳的url
 * @param  [type] $url [description]
 * @return [type]      [description]
 */
function baseUrl2VersionUrl($url){
    $filePath = SITE_PATH.$url;
    if(is_file($filePath)){
        $lastModified = date('YmdHis', filemtime($filePath));
        echo $url."?v=".$lastModified;
    } else {
        echo $url;
    }
}

function qtime($time){
    if(is_string($time)) $time = strtotime($time);
    $limit = time() - $time;
    if($limit<3600*24){
        $time="今天".date('H:i',$time);
    }
    if($limit>=(3600*24) && $limit<(3600*24*30)){
        $d = floor($limit/(3600*24));
        $time= "{$d}天前";
    }
    if($limit>=(3600*24*30)){
        $time=gmdate('m-d H:i', $time);
    }
    return $time;
}

function curlGetContents($durl,$data=array(),$isPost=0,$timeOut=10){
    if(!$durl) return false;
    $ch = curl_init();
    if($isPost){
        curl_setopt($ch, CURLOPT_POST, 1);//设置为POST方式
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    }else{
        if($data) $durl = $durl ."?".http_build_query($data);
    }
    // echo urldecode($durl);
    curl_setopt($ch, CURLOPT_URL, $durl);
    curl_setopt($ch, CURLOPT_TIMEOUT, $timeOut);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.116 Safari/537.36");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION,1);
    $r = curl_exec($ch);
    $url_info = curl_getinfo($ch);
    if($url_info['http_code'] != '200'){
        return false;
    }
    $curlErrno = curl_errno($ch);
    $curlError = curl_error($ch);
    return $r;
}

function findNum($str=''){
    $str=trim($str);
    if(empty($str)){return '';}
    $temp=array('1','2','3','4','5','6','7','8','9','0');
    $result='';
    for($i=0;$i<strlen($str);$i++){
        if(in_array($str[$i],$temp)){
            $result.=$str[$i];
        }
    }
    return $result;
}

/**
 * 原样输出数组，便于调试
 * @param array $arr
 */
function p($arr){
    echo '<pre>';
    print_r($arr);
    echo '</pre>';
}

/**
 * 对象转换为数组，支持多维
 * @param object $d
 */
function objectToArray($d){
    if(is_object($d)){
        $d = get_object_vars($d);
    }
    if(is_array($d)){
        return array_map(__FUNCTION__, $d);
    }else{
        return $d;
    }
}

/**
 * 获取HTTP请求中的头信息
 * @param string $header_key
 * @return array|null
 */
function getHttpRequestHeader($header_key='')
{
    $headers = array();
    foreach ($_SERVER as $key => $value) {
        if ('HTTP_' == substr($key, 0, 5)) {
            $headers[str_replace('_', '-', substr($key, 5))] = $value;
        }
    }
    if(empty($header_key)){
        return $headers;
    }
    $header_key = strtoupper($header_key);
    if(array_key_exists($header_key,$headers)){
        return $headers[$header_key];
    }
    return null;
}

/**
 * 比较两个时间戳中间相隔的天数
 * day2默认是当前时间
 * 2014-06-25 06:13:20 到 2014-08-25 08:43:05 间隔61天
 * day_diff(1403648000,1408927385) //61
 * 返回负值表示后面时间在前边时间之前
 * @param $day1_timestamp
 * @param string $day2_timestamp
 * @return int
 */
function day_diff($day1_timestamp,$day2_timestamp='')
{
    if(empty($day2_timestamp)){
        $day2_timestamp = strtotime(date('Y-m-d', time()));
    }
    $day1 = new DateTime();
    $day1->setTimestamp(strtotime(date('Y-m-d', $day1_timestamp)));

    $day2 = new DateTime();
    $day2->setTimestamp($day2_timestamp);

    $diff = $day1->diff($day2);
    return intval($diff->format('%R%a'));
}

function month_diff($start_time_stamp,$end_time_stamp)
{
    import_addon('libs.Carbon.Carbon');
    $start_time = new \Carbon\Carbon();
    $start_time->setTimestamp($start_time_stamp);

    $end_time = new \Carbon\Carbon();
    $end_time->setTimestamp($end_time_stamp);

    $months = $start_time->diffInMonths($end_time);
    $month_time = $start_time->addMonths($months);
    $days = $month_time->diffInDays($end_time);
    return array($months,$days);
}
function year_diff($start_time_stamp,$end_time_stamp)
{
    import_addon('libs.Carbon.Carbon');
    $start_time = new \Carbon\Carbon();
    $start_time->setTimestamp($start_time_stamp);

    $end_time = new \Carbon\Carbon();
    $end_time->setTimestamp($end_time_stamp);

    $years = $start_time->diffInYears($end_time);
    $year_time = $start_time->addYears($years);
    $months = $year_time->diffInMonths($end_time);
    $month_time = $year_time->addMonths($months);
    $days = $month_time->diffInDays($end_time);
    return array($years,$months,$days);
}

/**
 * 格式化数字,舍弃发或者进一法
 * @param $number 需要格式化的数字
 * @param int $decimals 保留几位小数
 * @param int $is_floor 是否舍弃
 * @return float
 */
function numberFormat($number,$decimals=2,$is_floor=1)
{
    $digi = pow(10,$decimals);
    $number = (int)bcmul($number, (string)$digi, 0);
    if($is_floor){
        return (floor($number)/$digi);
    }
    return (ceil($number)/$digi);

}

/**
 * 字符串第一个字保留，后面打*号
 *
 * @param $str
 * @param int $left_length  左边保留长度
 * @param int $right_length 右边保留长度
 * @return string
 */
function  remainFirst($str, $left_length=1, $right_length=0) {
    $s = mbLength($str);
    if($s < $left_length + $right_length) {
        return $str;
    }
    $left = msubstr($str, 0, $left_length, 'utf-8', FALSE);
    return $left .'**';
}
