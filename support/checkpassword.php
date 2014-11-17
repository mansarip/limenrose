<?php

sleep(1);

$password = hash('sha256', $_POST['password']);
$content  = file_get_contents('pass');
$passlist = explode("\n", $content);

echo (in_array($password, $passlist)) ? 1 : 0;

?>