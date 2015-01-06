<?php

/**
 * Paparkan error mesej
 * Aplikasi akan berhenti serta merta
 * (c) Luqman B. Shariffudin  luqman.shariffudin@nc.com.my
 */

function DisplayError($code)
{
	switch ($code)
	{
		case  0: $msg = 'Report not specified'; break;
		case  1: $msg = 'Empty report name'; break;
		case  2: $msg = 'Report not found'; break;
		case  3: $msg = 'Invalid report file (corrupted source)'; break;
		case 10: $msg = 'MySQL Connect Error (1045) Access denied';
	}

	echo '<b>LNR-ERR' . str_pad($code, 3, '0', STR_PAD_LEFT) . '</b> : ' . $msg;
	exit;
}

?>