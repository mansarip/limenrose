<?php

/**
 * PREVIEW ALL (In-App Preview)
 * author : Luqman B Shariffudin (luqman.shariffudin@nc.com.my)
 */

date_default_timezone_set('Asia/Kuala_Lumpur');

// source
$lnr_source = stripslashes($_POST['data']);
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

//generate pdf
include_once('../libs/html2pdf/html2pdf.class.php');
$format       = $lnr_source['reportProperties']['pdf']['format'];
$orientation  = $lnr_source['reportProperties']['pdf']['orientation'];
$marginTop    = $lnr_source['reportProperties']['layout']['marginTop'];
$marginBottom = $lnr_source['reportProperties']['layout']['marginBottom'];
$marginLeft   = $lnr_source['reportProperties']['layout']['marginLeft'];
$marginRight  = $lnr_source['reportProperties']['layout']['marginRight'];

$pdf = new HTML2PDF($orientation, $format, 'en', true, 'UTF-8', array($marginLeft, $marginTop, $marginRight, $marginBottom));

// loop component
$masterCode = '<page backtop="'.$marginTop.'mm" backbottom="'.$marginBottom.'mm" backleft="'. $marginLeft .'mm" backright="'. $marginRight .'mm">';

for ($c=0; $c<count($lnr_source['component']); $c++)
{
	$lnr_prop = $lnr_source['component'][$c];

	ReplaceParameterValue();

	// html decode (2nd attempt)
	foreach ((array)$lnr_prop as $propertyKey => $propertyValue)
	{
		if (substr($propertyKey, 0, 2) != '__') $lnr_prop[$propertyKey] = htmlspecialchars_decode($lnr_prop[$propertyKey]);
	}

	// connection to database jika ada
	$connDetails = $lnr_source['connection'][$lnr_prop['__connection']];
	if ($connDetails)
	{
		$dbType = $connDetails['type'];
		include_once('../conns/'. $dbType .'/conn.'. $dbType .'.php');
		$lnr_conn = connection\mysql\ConnectionInit($connDetails['host'], $connDetails['port'], $connDetails['username'], $connDetails['password']);

		// execute dan simpan result
		$lnr_result = connection\mysql\Execute($lnr_prop['sqlquery'], $lnr_conn);
	}

	ob_start();

	include('../'. $lnr_prop['__folderPath'] .'template.php');

	// page header
	if ($lnr_prop['__pageheader'])
	{
		$masterCode .= '<page_header>';
		$masterCode .= ob_get_contents();
		$masterCode .= '</page_header>';
	}
	// page header
	elseif ($lnr_prop['__pagefooter'])
	{
		$masterCode .= '<page_footer>';
		$masterCode .= ob_get_contents();
		$masterCode .= '</page_footer>';
	}
	else
	{
		$masterCode .= ob_get_contents();
	}

	ob_end_clean();
}

$masterCode .= '</page>';

$pdf->writeHTML($masterCode);

$pdf->Output($lnr_source['reportProperties']['general']['name'].'.pdf');


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
			$lnr_prop[$propertyKey] = str_replace('{LNR|PAGE_NUMBER}', '[[page_cu]]', $lnr_prop[$propertyKey]);
			$lnr_prop[$propertyKey] = str_replace('{LNR|TOTAL_PAGE}', '[[page_nb]]', $lnr_prop[$propertyKey]);
		}
	}
}

?>