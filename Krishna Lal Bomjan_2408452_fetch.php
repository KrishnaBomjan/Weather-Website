<?php

function fetch_current_data($city){
    try{
        $url ='https://api.openweathermap.org/data/2.5/weather?units=metric&q='.$city.'&appid=ecf01d76f7d67f9bb59747f19fa009a6';
        $datastring = file_get_contents($url);
        $data= json_decode($datastring,true);
        return $data;
    }
    catch (Exception) {
        return null;
    }
}