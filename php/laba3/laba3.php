<form method="post" action="laba3.php">
    <select name="rank">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
    </select>
    <input type="text" name="text" required><br>
    <input type="submit">
</form>

<?php
    $rank=$_POST['rank'];
    $text=$_POST['text'];
    $text=str_replace(  "ё",  "е",  $text  );
    $text=mb_strtolower($text);
    $result = 0;
    $arrayWords = array();

    $firstOrFourthRank = array(
                                array(0,"ноль","ноля","нолю","нолем","ноле"),
                                array(1,"один","одного","одному","одним","одном","одна","одной","одну","одною"),
                                array(2,"два","двух","двум","двумя","две"),
                                array(3,"три","трех","трем","тремя"),
                                array(4,"четыре","четырех","четырем","четырьмя"),
                                array(5,"пять","пяти","пятью"),
                                array(6,"шесть","шести","шестью"),
                                array(7,"семь","семи","семью"),
                                array(8,"восемь","восьми","восьмью"),
                                array(9,"девять","девяти","девятью"));
    $secondOrFifthRank = array(
                                array(20,"двадцать","двадцати","двадцатью"),
                                array(30,"тридцать","тридцати","тридцатью"),
                                array(40,"сорок","сорока"),
                                array(50,"пятьдесят","пятидесяти","пятьюдесятью"),
                                array(60,"шестьдесят","шестидесяти","шестьюдесятью"),
                                array(70,"семьдесят","семидесяти","семьюдесятью"),
                                array(80,"восемьдесят","восьмидесяти","восьмьюдесятью"),
                                array(90,"девяносто","девяноста"));
    $thirdRank = array(
                                array(100,"сто","ста"),
                                array(200,"двести","двухсот","двумстам","двумястами","двухстах"),
                                array(300,"триста","трехсот","тремстам","тремястами","трехстах"),
                                array(400,"четыреста","четырехсот","четыремстам","четырьмястами","четырехстах"),
                                array(500,"пятьсот","пятисот","пятистам","пятьюстами","пятистах"),
                                array(600,"шестьсот","шестисот","шестистам","шестьюстами","шестистах"),
                                array(700,"семьсот","семисот","семистам","семьюстами","семистах"),
                                array(800,"восемьсот","восьмисот","восьмистам","восемьюстами","восьмистах"),
                                array(900,"девятьсот","девятисот","девятистам","девятьюстами","девятистах"));
    $doubleRank = array(
                                array(10,"десять","десяти","десятью"),
                                array(11,"одиннадцать","одиннадцати","одиннадцатью"),
                                array(12,"двенадцать","двенадцати","двенадцатью"),
                                array(13,"тринадцать","тринадцати","тринадцатью"),
                                array(14,"четырнадцать","четырнадцати","четырнадцатью"),
                                array(15,"пятнадцать","пятнадцати","пятнадцатью"),
                                array(16,"шестнадцать","шестнадцати","шестнадцатью"),
                                array(17,"семнадцать","семнадцати","семнадцатью"),
                                array(18,"восемнадцать","восемнадцати","восемнадцатью"),
                                array(19,"девятнадцать","девятнадцати","девятнадцатью"),);
    $thousand = array("тысяч","тысяча","тысяче","тысячи","тысячу","тысячей","тысячами");

function parsing($text){
    $length = 0;
    $arrayWords = array();
    $text = $text . ' ';
    for($i=0;$i<strlen($text)-1;$i++){
        if($text[$i] != ' '){
            $arrayWords[$length] = $arrayWords[$length] . $text[$i];
        }else{
            if(strlen($arrayWords[$length]) > 0) {
                $length++;
            }
        }
    }
    return $arrayWords;
}

function searchWords($array,$words){
    for($i=0;$i<count($array);$i++){
        for($j=1;$j<count($array[$i]);$j++){
            if(strcmp($words,$array[$i][$j]) == 0){
                return $array[$i][0];
            }
        }
    }
}

    $arrayWords = parsing($text);


        switch ($rank) {
            case((int)1):
                {
                    $text = str_replace(" ", "", $text);
                    $result += searchWords($firstOrFourthRank, $text);
                    echo $result;
                }
                break;
            case((int)2):
                {
                    $result += searchWords($doubleRank, $arrayWords[0]);
                    $result += searchWords($secondOrFifthRank, $arrayWords[0]);
                    $result += searchWords($firstOrFourthRank, $arrayWords[1]);
                    echo $result;
                }
                break;
            case((int)3):
                {
                    $result += searchWords($thirdRank, $arrayWords[0]);
                    $result += searchWords($secondOrFifthRank, $arrayWords[1]);
                    $result += searchWords($firstOrFourthRank, $arrayWords[2]);
                    $result += searchWords($firstOrFourthRank, $arrayWords[1]);
                    echo $result;
                }
                break;
            case((int)4):
                {
                    foreach ($thousand as $numeral){
                        if(strcmp($word,$numeral) == 0){
                            unset($word);
                        }
                    }
                    $result += searchWords($firstOrFourthRank, $arrayWords[0]) * 1000;
                    $result += searchWords($thirdRank, $arrayWords[1]);
                    $result += searchWords($firstOrFourthRank, $arrayWords[1]);
                    $result += searchWords($secondOrFifthRank, $arrayWords[1]);
                    $result += searchWords($doubleRank, $arrayWords[1]);
                    $result += searchWords($firstOrFourthRank, $arrayWords[2]);
                    $result += searchWords($secondOrFifthRank, $arrayWords[2]);
                    $result += searchWords($doubleRank, $arrayWords[2]);
                    $result += searchWords($firstOrFourthRank, $arrayWords[3]);
                    echo $result;
                }
                break;
            case((int)5):
                {
                    $result += searchWords($secondOrFifthRank, $arrayWords[0]) * 1000;
                    $result += searchWords($doubleRank, $arrayWords[0]) * 1000;
                    if(in_array($arrayWords[1],$thousand)){
                        $result += searchWords($thirdRank, $arrayWords[2]);
                        $result += searchWords($firstOrFourthRank, $arrayWords[2]);
                        $result += searchWords($secondOrFifthRank, $arrayWords[2]);
                        $result += searchWords($doubleRank, $arrayWords[2]);
                        $result += searchWords($firstOrFourthRank, $arrayWords[3]);
                        $result += searchWords($secondOrFifthRank, $arrayWords[3]);
                        $result += searchWords($doubleRank, $arrayWords[3]);
                        $result += searchWords($firstOrFourthRank, $arrayWords[4]);
                    }else
                        if(in_array($arrayWords[2],$thousand)){
                            $result += searchWords($firstOrFourthRank, $arrayWords[1]) * 1000;
                            $result += searchWords($thirdRank, $arrayWords[3]);
                            $result += searchWords($firstOrFourthRank, $arrayWords[3]);
                            $result += searchWords($secondOrFifthRank, $arrayWords[3]);
                            $result += searchWords($doubleRank, $arrayWords[3]);
                            $result += searchWords($firstOrFourthRank, $arrayWords[4]);
                            $result += searchWords($secondOrFifthRank, $arrayWords[4]);
                            $result += searchWords($doubleRank, $arrayWords[4]);
                            $result += searchWords($firstOrFourthRank, $arrayWords[5]);
                        }
                    echo $result;
                }
                break;
        }
