<?php

/**
 * PREVIEW ALL (In-App Preview)
 * author : Luqman B Shariffudin (luqman.shariffudin@nc.com.my)
 */

date_default_timezone_set('Asia/Kuala_Lumpur');

// source
$lnr_source = stripslashes($_POST['__details']);
$lnr_source = json_decode($lnr_source, true);

// report parameter (*berbeza dengan preview single)
if ($lnr_source['parameter'])
{
	foreach ((array)$lnr_source['parameter'] as $param)
	{
		if     ($param['type'] == 'get') { $_GET[$param['name']] = $param['value']; }
		elseif ($param['type'] == 'post') { $_POST[$param['name']] = $param['value']; }
		elseif ($param['type'] == 'session') { $_SESSION[$param['name']] = $param['value']; }
	}
}

// html header
echo '<!doctype html><head><title>Report Viewer</title></head><body style="margin:0; font-family:sans-serif; font-size:12px;">';
echo '<div style="margin:0 auto; width:'. $lnr_source['reportProperties']['layout']['canvasWidth'] .'px;">';

// loop component
for ($c=0; $c<count($lnr_source['component']); $c++)
{
	$lnr_prop = $lnr_source['component'][$c];

	// parameter : loop property untuk replace value dengan parameter value
	ReplaceParameterValue();

	// html decode (2nd attempt)
	foreach ((array)$lnr_prop as $propertyKey => $propertyValue)
	{
		if (substr($propertyKey, 0, 2) != '__') $lnr_prop[$propertyKey] = htmlspecialchars_decode($lnr_prop[$propertyKey]);
	}

	// enable preview atau tidak
	if ($lnr_prop['__enablePreview'])
	{
		// connection to database jika ada
		$connDetails = $lnr_source['connection'][$lnr_prop['__connection']];
		if ($connDetails)
		{
			$dbType = $connDetails['type'];
			include_once('../conns/'. $dbType .'/conn.'. $dbType .'.php');
			$lnr_conn = connection\mysql\ConnectionInit($connDetails['host'], $connDetails['port'], $connDetails['username'], $connDetails['password']);

			// execute dan simpan result
			$lnr_result = connection\mysql\Execute($lnr_prop['sqlquery'], $lnr_conn);

			include('../'. $lnr_prop['__folderPath'] .'template.php');
		}

		// jika tiada connection details
		else
		{
			include('../'. $lnr_prop['__folderPath'] .'template.php');
		}
	}
}

// html footer
echo '</div></body></html>';


/**
 * Loop property key dan cari yang berkenaan
 * untuk diganti dengan parameter value
 * POST, GET, SESSION
 */
function ReplaceParameterValue()
{
	global $lnr_prop, $lnr_source;

	foreach ((array)$lnr_prop as $propertyKey => $propertyValue)
	{
		if (substr($propertyKey, 0, 2) != '__')
		{
			if (strpos($lnr_prop[$propertyKey], '{GET|') !== false)
			{
				foreach ($_GET as $key => $value)
				{
					$lnr_prop[$propertyKey] = str_replace('{GET|'. $key .'}', $_GET[$key], $lnr_prop[$propertyKey]);
				}
			}
			
			if (strpos($lnr_prop[$propertyKey], '{POST|') !== false)
			{
				foreach ($_POST as $key => $value)
				{
					$lnr_prop[$propertyKey] = str_replace('{POST|'. $key .'}', $_POST[$key], $lnr_prop[$propertyKey]);
				}
			}
			
			if (strpos($lnr_prop[$propertyKey], '{SESSION|') !== false)
			{
				foreach ($_SESSION as $key => $value)
				{
					$lnr_prop[$propertyKey] = str_replace('{SESSION|'. $key .'}', $_SESSION[$key], $lnr_prop[$propertyKey]);
				}
			}

			// html decode
			$lnr_prop[$propertyKey] = htmlspecialchars_decode($lnr_prop[$propertyKey]);

			// system variable
			$lnr_prop[$propertyKey] = str_replace('{LNR|REPORT_NAME}', $lnr_source['reportProperties']['general']['name'], $lnr_prop[$propertyKey]);
			$lnr_prop[$propertyKey] = str_replace('{LNR|REPORT_AUTHOR}', $lnr_source['reportProperties']['general']['author'], $lnr_prop[$propertyKey]);
			$lnr_prop[$propertyKey] = str_replace('{LNR|REPORT_DESCRIPTION}', $lnr_source['reportProperties']['general']['description'], $lnr_prop[$propertyKey]);
			$lnr_prop[$propertyKey] = str_replace('{LNR|DATE}', date($lnr_prop['dateFormat']), $lnr_prop[$propertyKey]);
		}
	}
}

?>