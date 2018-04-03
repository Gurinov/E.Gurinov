<table border="1" width="100%" cellpadding="5">
    <tr>
        <th>Студент</th>
        <th>Физика</th>
        <th>Программирование</th>
        <th>Английский</th>
        <th>Математика</th>
        <th>физкультура</th>
    </tr>
<?php
    function getSubjectList($mark,$row){
        $result = '';
        foreach ($row as $key => $value ){
            if($value == $mark){
                $result .= $key.'; ';
            }
        }
        return $result;
    }

    $mysqli = new mysqli("localhost","e.gurinov","314159","Test");
    if ($mysqli->connect_errno) { die('Ошибка соединения: ' . $mysqli->connect_error); }else{/*echo 'Connect true';*/}
    mysqli_query($mysqli, "SET NAMES utf8");
    $result = $mysqli->query("SELECT * FROM `studentsAndMarks`");

if (isset($_GET['red_id'])) { //Проверяем, передана ли переменная на редактирования
    if(mysqli_query($mysqli,'UPDATE `studentsandmarks` SET 
                                    `Physics` =  \''.$_POST['Physics'].'\', 
                                    `Programming` =  \''.$_POST['Programming'].'\', 
                                    `English` =  \''.$_POST['English'].'\', 
                                    `Maths` =  \''.$_POST['Maths'].'\', 
                                    `Workout` =  \''.$_POST['Workout'].'\'
                                WHERE `ID` = \''.$_GET['red_id'].'\'')){
        echo "<meta http-equiv=\"refresh\" content=\"0; URL=laba5.php\">";
    }

}

    $table1 = "";
    $table2 = "";
    while ($row = $result->fetch_assoc()) {
        $maxMark = max($row['Physics'],$row['Programming'],$row['English'],$row['Maths'],$row['Workout']);
        $minMark = min($row['Physics'],$row['Programming'],$row['English'],$row['Maths'],$row['Workout']);
        $table1 .=
            '<tr>'.
                '<td>'.$row['Students'].'</td>'.
                '<td>'.$row['Physics'].'</td>'.
                '<td>'.$row['Programming'].'</td>'.
                '<td>'.$row['English'].'</td>'.
                '<td>'.$row['Maths'].'</td>'.
                '<td>'.$row['Workout'].'</td>'.
            '</tr>';
        $table2 .=
            '<tr>'.
                '<td>'.$row['Students'].'</td>'.
                '<td>'.(($row['Physics']+$row['Programming']+$row['English']+$row['Maths']+$row['Workout'])/5).'</td>'.
                '<td>'.$maxMark.'<br>'.getSubjectList($maxMark,$row).'</td>'.
                '<td>'.$minMark.'<br>'.getSubjectList($minMark,$row).'</td>'.
                '<td><a href="?red_id='.$row['ID'].'">Редактировать</a></td></tr>'.
            '</tr>';
    }
    echo $table1.'</table> <br> <hr> <br> 
            <table  border="1" width="100%" cellpadding="5">
               <tr>
                    <th>Студент</th>
                    <th>Средний балл</th>
                    <th>Максимальный балл</th>
                    <th>Минимальный балл</th>
                    <th>Действие</th>
               </tr>'.
        $table2 . '</table>';



    if (isset($_GET['red_id'])) { //Если передана переменная на редактирование
//Достаем запсись из БД
$sql = $mysqli->query("SELECT * FROM `studentsAndMarks` WHERE `ID`=" . $_GET['red_id']); //запрос к БД
$string = mysqli_fetch_array($sql);
print_r($string);
?>

    <table>
        <form action="" method="post">
            <tr>
                <td>Физика:</td>
                <td><input type="number" name="Physics" min="0" max="10" value="<?php echo($string['Physics']); ?>"></td>
            </tr>
            <tr>
                <td>Программирование:</td>
                <td><input type="number" name="Programming" min="0" max="10" value="<?php echo($string['Programming']); ?>"></td>
            </tr>
            <tr>
                <td>Английский:</td>
                <td><input type="number" name="English" min="0" max="10" value="<?php echo($string['English']); ?>"></td>
            </tr>
            <tr>
                <td>Математика:</td>
                <td><input type="number" name="Maths" min="0" max="10" value="<?php echo($string['Maths']); ?>"></td>
            </tr>
            <tr>
                <td>физкультура:</td>
                <td><input type="number" name="Workout" min="0" max="10" value="<?php echo($string['Workout']); ?>"></td>
            </tr>
            <tr>
                <td colspan="2"><input type="submit" value="OK"></td>
            </tr>
        </form>
    </table>
<?php
}
    $mysqli -> close();