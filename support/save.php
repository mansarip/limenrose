<?php

$data = $_POST['__details'];
$data = stripslashes($data);
$data = htmlspecialchars_decode($data);

$details = json_decode($data, true);
$filename = $details['reportProperties']['general']['name'];

if ($data)
{
	header('Content-disposition: attachment; filename='. $filename .'.lnr');
	header('Content-type: application/json');
	echo $data;
}
else
{
	header('location:../');
}

?>