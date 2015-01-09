<?php

// development : show all error, tapi bukan notice
error_reporting(E_ALL & ~E_NOTICE);

// preprocess untuk source dan data
include('preprocess.data.php');

// preprocess untuk layout
include('preprocess.layout.php');

// tcpdf
include('../libs/tcpdf/tcpdf.php');

$reportName = ($source['general']['reportName'] == '' ? 'Untitled Report' : $source['general']['reportName']);

// extend tcpdf
class LNRREPORT extends TCPDF
{
	public function Header(){}
	public function Footer(){}
}

$pdf = new LNRREPORT($orientation=$report->orientation, $unit='mm', $format=$report->format, $unicode=true, $encoding='UTF-8', $diskcache=false, $pdfa=false);

echo '<pre>';
print_r($source);
echo '</pre>';

$pdf->Output($reportName.'.pdf', 'I');

?>