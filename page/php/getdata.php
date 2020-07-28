<?php

include("conn.php");
header('content-type:application/json');
//接收到请求为json数据，{"id":"xxx","pwd":"xxx","num":"xxx","page":"xxx"}
//$reqID = $_POST['id'];//id
//$reqPwd = $_POST['pwd'];//password
//$reqNum = $_POST['num'];//单页数据条数（必传）
//$reqPage = $_POST['page'];//请求的页数 （必传）
//$reqTime1 = $_POST['time1'];//起始时间
//$reqTime2 = $_POST['time2'];//结束时间
//$reqValves = $_POST['valve_id'];//阀门id
//$reqLevel = $_POST['level'];//警报等级
$reqNum = 3;//单页数据条数（必传）
$reqPage = 1;//请求的页数 （必传）
//查询数据总数
$sqlCount = "select count(*) from status";
$countRes = mysqli_query($link,$sqlCount);
$countRes = mysqli_fetch_array($countRes);
$counts = $countRes[0];
//根据前台每页条数计算页数
$pages = ceil($counts/$reqNum);
//获取要显示页数查询
$reqPage = ($reqPage-1)*$reqNum;
//查询数据内容
$sqlSer = "select * from status ORDER BY time desc limit $reqPage,$reqNum";
$data = "";//返回数据json
$arrRes = array();//数据库查询结果
$array = array();//返回数据数组变量
class Data{
    public $time;
    public $valve_id;
		public $level;
		public $temp;
		public $mp;
		public $url;
}
$serRes=mysqli_query($link,$sqlSer);
//返回数据
if(mysqli_num_rows($serRes)){
	while($row=mysqli_fetch_array($serRes))
	{

			$getData = new Data();
	  	$getData -> time = $row['time'];  //时间
	    $getData -> valve_id = $row['valve_id'];//设备型号
	    $getData -> level = $row['level'];   //安全级别
	    $getData -> temp = $row['temp'];   //温度
	   	$getData -> mp = $row['mp'];   //压强
	   	$getData -> url = $row['url'];   //视频链接地址
			$arrRes[] = $getData;
	}

$array[] = [
    'resRes' => $arrRes,
    'pages' => $pages,
];

$data = json_encode($array);
echo $data;
}else{
	echo "没有数据";
}
