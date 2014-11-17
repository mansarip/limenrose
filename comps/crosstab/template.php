<?php

$xAxisField  = $lnr_prop['xField'];
$yAxisField  = $lnr_prop['yField'];
$detailField = $lnr_prop['detailField'];
$aggregation = $lnr_prop['aggregation'];
$grandTotal = 0;

$uniqueXAxisValue = array();
$uniqueYAxisValue = array();

$totalCountRow = count($lnr_result);
//#1
for ($r=0; $r<$totalCountRow; $r++)
{
	if (!in_array($lnr_result[$r][$xAxisField], $uniqueXAxisValue))
	{
		//$uniqueXAxisValue[] = $lnr_result[$r][$xAxisField];
		$uniqueXAxisValue[$lnr_result[$r][$xAxisField]] = 0;
	}

	if (!in_array($lnr_result[$r][$yAxisField], $uniqueYAxisValue))
	{
		//$uniqueYAxisValue[] = $lnr_result[$r][$yAxisField];
		$uniqueYAxisValue[$lnr_result[$r][$yAxisField]] = 0;
	}
}

//#2
foreach ($uniqueXAxisValue as $xKey => $xValue)
{
	$uniqueXAxisValue[$xKey] = $uniqueYAxisValue;
}

//#3
if ($aggregation === 'sum')
{
	for ($r=0; $r<$totalCountRow; $r++)
	{
		$x = $lnr_result[$r][$xAxisField];
		$y = $lnr_result[$r][$yAxisField];
		$uniqueXAxisValue[$x][$y] += (float)$lnr_result[$r][$detailField];
	}
}
elseif ($aggregation === 'count')
{
	for ($r=0; $r<$totalCountRow; $r++)
	{
		$x = $lnr_result[$r][$xAxisField];
		$y = $lnr_result[$r][$yAxisField];
		$uniqueXAxisValue[$x][$y] += 1;
	}
}
/*elseif ($aggregation === 'min')
{
	$tempStore = array();
	for ($r=0; $r<$totalCountRow; $r++)
	{
		$x = $lnr_result[$r][$xAxisField];
		$y = $lnr_result[$r][$yAxisField];
		$tempStore[] = (float)$lnr_result[$r][$detailField];
	}

	echo '<pre>';
	print_r($tempStore);
	echo '</pre>';

	$uniqueXAxisValue[$x][$y] = min($tempStore);
}
elseif ($aggregation === 'max')
{
	$tempStore = array();
	for ($r=0; $r<$totalCountRow; $r++)
	{
		$x = $lnr_result[$r][$xAxisField];
		$y = $lnr_result[$r][$yAxisField];
		$uniqueXAxisValue[$x][$y] += (float)$lnr_result[$r][$detailField];
	}

	$uniqueXAxisValue[$x][$y] = max($uniqueXAxisValue[$x]);
}
*/

//#table
echo '<table border="1" style="width:100%; border-collapse:collapse;" cellpadding="3">';

//x column
echo '<tr>';
echo '<td style="background-color:#d9d9d9"></td>';
foreach ($uniqueXAxisValue as $xKey => $xValue)
{
	echo '<td style="font-weight:bold; background-color:#d9d9d9">'. $xKey .'</td>';
}
echo '<td style="font-weight:bold; background-color:#d9d9d9">JUMLAH</td>';
echo '</tr>';

// assoc to numberic
$indexedUniqueXAxisValue = array_values($uniqueXAxisValue);

//y column
foreach ($xValue as $yKey => $yValue)
{
	echo '<tr>';
	echo '<td style="font-weight:bold; background-color:#d9d9d9">'. $yKey .'</td>';

	// crossing
	$total = 0;
	for ($z=0; $z<count($indexedUniqueXAxisValue); $z++)
	{
		echo '<td>'. $indexedUniqueXAxisValue[$z][$yKey] . '</td>';
		$total += (float)$indexedUniqueXAxisValue[$z][$yKey];
	}

	$grandTotal += $total;

	echo '<td style="font-weight:bold">'. $total .'</td>';

	echo '</tr>';
}

//
echo '<tr>';
echo '<td style="font-weight:bold; background-color:#d9d9d9">JUMLAH</td>';
for ($z=0; $z<count($indexedUniqueXAxisValue); $z++)
{
	echo '<td style="font-weight:bold">'. array_sum($indexedUniqueXAxisValue[$z]) .'</td>';
}
echo '<td style="font-weight:bold">'. $grandTotal .'</td>';
echo '</tr>';

echo '</table>';

?>