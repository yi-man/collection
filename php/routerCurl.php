<?php
// if(file_exists("/etc/bread.id")){
// 	$file_handle = fopen("/etc/bread.id", "r");
// 	if(!feof($file_handle)) {
// 		$bread_id = fgets($file_handle);
// 	}
// 	fclose($file_handle);
// }
// else
// 	exit();

if( isset($_POST['url']) && isset($_POST['id']) ){
    $url=$_POST['url'];
    $post_data =array(
        'id'=>$_POST['id']
    );
}
else
    return '请求地址无效！';

$ch = curl_init();
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HEADER, 0);
curl_setopt($ch, CURLOPT_URL,$url);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
$result = curl_exec($ch);

curl_close($ch);
print_r($result);