<?php

include('../libs/php/func.encrypt.php');

$a = file_get_contents('../publish/sample/surat.lnr');
$a = Encrypt($a, 'L&R');

file_put_contents('../publish/sample/surat.lnre', $a);


?>