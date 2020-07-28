<?php
  include("conn.php");
  $sql="select * from data1";
$result = mysqli_query($link,$sql);
$data="";
$array= array();
class User{
    public $day;
    public $num;
}
while($row = mysqli_fetch_array($result)){
	
    $user=new User();
    $user->day = $row['day'];
    $user->num = $row['num'];
    $array[]=$user;

    
}

$data=json_encode($array);
// echo "{".'"user"'.":".$data."}";
echo $data;

  
  
?>