<?php

$filename = $_FILES['file']['name'];
$ext      = substr($filename, -4);
$error    = $_FILES['file']['error'];
$tempName = $_FILES['file']['tmp_name'];

if (!$_FILES)
{
	header('location:../');
}

if ($ext == '.lnr')
{
	$content = file_get_contents($tempName);
	echo '<div id="data">'. $content .'</div>';
}
else
{
	echo '<div id="data">Invalid source file!</div>';
}

?>