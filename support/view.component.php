<?php

/**
 * PREVIEW SINGLE (In-App Preview)
 * author : Luqman B Shariffudin (luqman.shariffudin@nc.com.my)
 */

date_default_timezone_set('Asia/Kuala_Lumpur');

// source
$lnr_prop = stripslashes($_POST['__details']);
$lnr_prop = json_decode($lnr_prop, true);

// dapatkan template component
$folderPath = $lnr_prop['__folderPath'];
$template   = '../' . $folderPath . 'template.php';

// report parameter
if ($lnr_prop['__reportParameter'])
{
	foreach ((array)$lnr_prop['__reportParameter'] as $param)
	{
		if     ($param['type'] == 'get') { $_GET[$param['name']] = $param['value']; }
		elseif ($param['type'] == 'post') { $_POST[$param['name']] = $param['value']; }
		elseif ($param['type'] == 'session') { $_SESSION[$param['name']] = $param['value']; }

		// replace component 'property' dengan value parameter jika ada
		// hanya jika property key tidak bermula dengan '__'
		// sebab yang ada '__' tu adalah sistem punya, tak payah usik
		foreach ((array)$lnr_prop as $propertyKey => $propertyValue)
		{
			if (substr($propertyKey, 0, 2) != '__')
			{
				$lnr_prop[$propertyKey] = str_replace('{'. strtoupper($param['type']) .'|'. $param['name'] .'}', $param['value'], $lnr_prop[$propertyKey]);
			}
		}
	}
}

if (file_exists($template))
{
	// html decode
	foreach ((array)$lnr_prop as $propertyKey => $propertyValue)
	{
		if (substr($propertyKey, 0, 2) != '__') $lnr_prop[$propertyKey] = htmlspecialchars_decode($lnr_prop[$propertyKey]);
	}

	// connection to database jika ada
	$connDetails = $lnr_prop['__connectionDetails'];
	if (is_array($connDetails) && !empty($connDetails))
	{
		$dbType = $connDetails['type'];
		if ($dbType == 'mysql')
		{
			include_once('../conns/'. $dbType .'/conn.'. $dbType .'.php');
			$lnr_conn = connection\mysql\ConnectionInit($connDetails['host'], $connDetails['port'], $connDetails['username'], $connDetails['password']);

			// execute dan simpan result
			$lnr_result = connection\mysql\Execute($lnr_prop['sqlquery'], $lnr_conn);
		}
	}	

	// echo html
	echo '<!doctype html><head><title>Report Viewer</title></head><body style="margin:0; font-family:sans-serif; font-size:12px; "">';
	include_once($template);
	echo '</body></html>';
}

?>