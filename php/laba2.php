<form method="post" action="laba2.php">
    <input type="text" name="a1" value=""><br>
    <input type="submit">
</form>
<?php
function test($a){
    $res = 1;
    for($i=0;$i<strlen($a);$i++){
        if($a[$i]=='0' || $a[$i]=='1' || $a[$i]=='2' || $a[$i]=='3'
            || $a[$i]=='4' || $a[$i]=='5' || $a[$i]=='6' || $a[$i]=='7'
            || $a[$i]=='8' || $a[$i]=='9'){}
            else $res = 0;
    }
    if(strlen($a)==0){$res = 0;}
    return $res;
}

$a=$_POST['a1'];
if(test($a) == 1){
    $n=(int)$a;
    $sum = 0;
    while ($n > 0) {
        $r = $n % 10;
        $sum += $r;
        $n = (int)$n/10;
    }
    echo $sum;
}else if(strlen($a)!=0){echo "Не является числом";}
