<form method="post" action="laba4.php">
    <textarea name="text" rows="10" cols="270" wrap="virtual" required></textarea>
    <input type="submit">
</form>

<?php

    function parsing($text){
        $length = 0;
        $arrayWords = array();
        $text = $text . ' ';
        for ($i = 0; $i < strlen($text) - 1; $i++) {
            if ($text[$i] != ' ') {
                $arrayWords[$length] = $arrayWords[$length] . $text[$i];
            } else {
                if (strlen($arrayWords[$length]) > 0) {
                    $length++;
                }
            }
        }
        return $arrayWords;
    }

    $text=$_POST['text'];
    $text=str_replace(  "ё",  "е",  $text  );
    $tokens = parsing($text);
    $dates = array();
    $position=0;

    preg_match_all("/\b(\d{1,2})\.(\d{1,2})\.(\d{4}|\d{2})\b/", $text,$arr, PREG_SET_ORDER);
    foreach ($arr as $key => $date){
        if(checkdate($date[2],$date[1],$date[3])){
            $dates[$position]=$arr[$key][0];
            $position++;
        }
    }
    preg_match_all("/\b(\d{1,2})\/(\d{1,2})\/(\d{4}|\d{2})\b/", $text,$arr, PREG_SET_ORDER);
    foreach ($arr as $key => $date){
        if(checkdate($date[1],$date[2],$date[3])){
            $dates[$position]=$arr[$key][0];
            $position++;
        }
    }

    for($i=0;$i<count($tokens);$i++){
        if(in_array($tokens[$i],$dates)){
            for($j=strlen($tokens[$i]);$i>0;$j--){
                if ($tokens[$i][$j] == '.' || $tokens[$i][$j] == '/'){
                    $year = substr($tokens[$i],$j+1);
                    $year++;
                    $tokens[$i] = substr($tokens[$i],0,-(strlen($tokens[$i])-$j-1));
                    $tokens[$i] = $tokens[$i] . $year;
                    break;
                }
            }
            echo '<font size="5" color="red" face="Arial">' . $tokens[$i] . '</font>' . " ";
        }else echo '<font size="5" face="Arial">' . $tokens[$i] . '</font>' . " ";
    }

