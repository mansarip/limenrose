<?php

echo '<table border="'. ($lnr_prop['enableborder'] ? 1 : 0) .'" style="margin-top:'. $lnr_prop['marginTop'] .'px; margin-bottom:'. $lnr_prop['marginBottom'] .'px; border-collapse:collapse; font-size:12px; width:100%">';

// column sizing
if ($lnr_prop['columnSizing'] != '')
{
	$colsize = explode(',', $lnr_prop['columnSizing']);
	for ($c=0; $c<count($colsize); $c++)
	{
		echo '<col style="width:'. (float)$colsize[$c] . '%;">';
	}
}

echo '<thead>';
echo '<tr>';
echo '<th style="'. (isset($colsize) ? 'width:'. $colsize[0] .'%;' : '') .'padding:3px; text-align:'. $lnr_prop['numberingAlign'] .'">#</th>';

// column names (table header)
foreach ((array)$lnr_result[0] as $key => $value)
{
	echo '<th style="padding:3px; text-align:left">' . $key . '</th>';
}
echo '</tr>';
echo '</thead>';

// data
echo '<tbody>';
for ($d=0; $d<count($lnr_result); $d++)
{
	echo '<tr>';
	echo '<td style="padding:3px; text-align:'. $lnr_prop['numberingAlign'] .'">'. ($d+1) .'</td>';

	foreach ($lnr_result[$d] as $key => $value)
	{
		echo '<td>' . $value . '</td>';
	}

	echo '</tr>';
}
echo '</tbody>';

echo '</table>';

?>