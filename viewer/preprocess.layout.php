<?php

// layout classes
include('class.report.php');
include('class.band.php');
include('class.label.php');

// report instance
$report = new Report($source);
$report->outputFormat = ($_GET['output'] == '' ? 'html' : $_GET['output']);

// bands
foreach ((array)$source['layout']['band']['report'] as $bandName => $bandDetails)
{
	$band = new Band($bandDetails);
	$band->type = $bandName;

	// ITEMS vs CHILDREN
	// Items adalah koleksi element yang ada dalam sesuatu band (label, image, barcode, etc.)
	// Children adalah koleksi band yang ada dalam sesuatu band (dalam band ada band - nested)

	// process items
	

	// register ke dalam report
	$report->band[$bandName] = $band;
}

?>