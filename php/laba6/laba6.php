<?php
function filingInfo($parse,$question,$inp1,$inp2,$inp3,$inp4){
    $parse->set_tpl('{QUESTION}',$question);
    $parse->set_tpl('{INP1}',$inp1);
    $parse->set_tpl('{INP2}',$inp2);
    $parse->set_tpl('{INP3}',$inp3);
    $parse->set_tpl('{INP4}',$inp4);
    $parse->tpl_parse(); //Парсим
    print $parse->template; //Выводим нашу страничку
}
if (!$_COOKIE[numberOfQuestion]) $numberOfQuestion  =  1;
    else {
        if($_COOKIE['numberOfQuestion'] < 4) $numberOfQuestion  =  ++$_COOKIE['numberOfQuestion'];
            else unset($_COOKIE['numberOfQuestion']);
        if($numberOfQuestion == 2){
            $language = $_POST['choice'];
            setcookie("language", $language, time() + 60);
        }else $language = $_COOKIE['language'];
    }
setcookie("numberOfQuestion", $numberOfQuestion, time() + 60);

$language;
$questions = array("Какой ЯП вы предпочитаете?","Как долго вы программируете на $language","Нравится ли вам $language","Оцените свой уровень знания $language");
require('template.php'); // Подключаем файл с классом
$parse->get_tpl('template.tpl'); //Файл который мы будем парсить


if ($numberOfQuestion == 1){
    filingInfo($parse,$questions[--$numberOfQuestion],"Java","C","C++","PHP");
}else
    if ($numberOfQuestion == 2){
        filingInfo($parse,$questions[--$numberOfQuestion],"Меньше года","1-2 года","2-5 лет","Больше 5 лет");
    }else
        if ($numberOfQuestion == 3){
            filingInfo($parse,$questions[--$numberOfQuestion],"Очень нравится","Нравится","Равнодушен","Не нравится");
        }else
            if ($numberOfQuestion == 4){
                filingInfo($parse,$questions[--$numberOfQuestion],"Только начал изучать","Junior","Middle","Senior");
            }else {
                    echo "Спасибо, что прошли наш опрос";
                  }

