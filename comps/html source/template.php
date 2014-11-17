<?php

// loop berdasarkan record
if ($lnr_prop['recordBased'])
{
	foreach ((array)$lnr_result as $result)
	{
		$html = $lnr_prop['html'];

		foreach ((array)$result as $columnName => $columnValue)
		{
			$html = str_replace('{COLUMN|'.$columnName.'}', $columnValue, $html);
		}

		if ($lnr_prop['pageBreakNewRecord']) echo '<div>';
		echo $html;
		if ($lnr_prop['pageBreakNewRecord']) echo '</div>';
	}
}

// tidak perlu query, print terus
else
{
	if ($lnr_prop['pageBreakNewRecord']) echo '<div>';
	echo $lnr_prop['html'];
	if ($lnr_prop['pageBreakNewRecord']) echo '</div>';
}

?>