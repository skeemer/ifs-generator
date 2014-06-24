<?php

$filename = 'Collection.dat';

$file = file_get_contents($filename);
$lines = explode("\n",$file);

$data = [];
$current = [];

$names = ['a', 'b', 'c', 'd', 'e', 'f'];

foreach($lines as $line) {
  $line = trim($line);

  if(substr($line, 0, 1) == '{') {
    if(sizeof($current) > 0) {
      $data[] = $current;
      $current = [];
    }
    $current['name'] = substr($line,1,strlen($line) - 2);
    $current['transforms'] = [];
    continue;
  }

  if(empty($line) || strlen($line) < 5) continue;

  $i = 0;
  $numbers = explode(' ', $line);
  $new_numbers = [];
  foreach($numbers as $number) {
    if($number == '') continue;
    $new_numbers[$names[$i]] = floatval($number);
    $i++;
  }
  $current['transforms'][] = $new_numbers;
}

if(sizeof($current) > 0) {
  $data[] = $current;
}


$json = json_encode($data);
//print_r($data);
echo $json;