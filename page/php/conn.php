<?php
/**
 * Created by MySQL.
 * User: 67463
 * Date: 2017/9/27
 * Time: 15:27
 */

header('Content-Type: text/html; charset=utf8');
$db_host="218.28.188.135";
$db_user="root";
$db_pass="ZDvalve2017!";
$db_name="waring_log";       

//使用mysql_connect()函数对服务器进行连接，如果出错返回相应信息
$link=mysqli_connect($db_host,$db_user,$db_pass)or die("不能连接到服务器".mysql_error());
mysqli_select_db($link,$db_name);
mysqli_set_charset($link,'utf8');

 
