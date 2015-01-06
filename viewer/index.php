<?php

//error_reporting(0);

// includes
include('config.php');
include('../libs/php/func.encrypt.php');
include('../libs/php/func.error.php');

// proses dapatkan nama report
if (!isset($_GET['file'])) DisplayError(0);
$filename = $_GET['file'];
if ($filename == '') DisplayError(1);

// jika file not found
$source = file_get_contents(PUBLISH_PATH . $filename . '.lnre');
if (!$source) DisplayError(2);

// decrypt dan jadikan array
$source = Decrypt($source, KEY);
$source = json_decode($source, true);
if (!is_array($source)) DisplayError(3);

// report name init
$reportName = $source['general']['reportName'];

// post variables bawa ke iframe
$_POST['token'] = 'ABC';
$postVariablesInJSON = json_encode($_POST);

// remove output variable get
$queryStringReBuild = '';
foreach ((array)$_GET as $getName => $getValue)
{
	if ($getName != 'output') $queryStringReBuild .= '&' . $getName . '=' . $getValue;
}

// output type
$output = $_GET['output']; //html, pdf, csv

// url content
if     ($output == 'html') { $url = 'output.html.php?' . $_SERVER['QUERY_STRING']; }
elseif ($output == 'pdf')  { $url = 'output.pdf.php?' . $_SERVER['QUERY_STRING']; }
else   { $url = 'output.html.php?' . $_SERVER['QUERY_STRING']; }

?>
<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Lime & Rose Report Viewer : <?php echo $reportName ?></title>
	<link rel="icon" type="image/ico" href="../favicon.ico">
	<link rel="stylesheet" href="../libs/dhtmlx/dhtmlx.css">
	<script type="text/javascript" src="../libs/dhtmlx/dhtmlx.js"></script>
	<style type="text/css">
	body{
		margin: 0;
	}
	#viewer{
		position: absolute;
		top: 0; left: 0; right: 0; bottom: 0;
	}
	</style>
</head>
<body>
	<div id="viewer"></div>
	<script type="text/javascript">
	(function(){
		var layout = new dhtmlXLayoutObject('viewer','1C');
		
		var cell = layout.cells('a');
		cell.setText('<?php echo $reportName ?>');
		cell.attachURL('<?php echo $url ?>', null, <?php echo $postVariablesInJSON ?>);

		var opts = [
			['btnHTML', 'obj', 'HTML', 'blue-document-code.png'],
			['btnPDF', 'obj', 'PDF', 'document-pdf-text.png'],
			['btnCSV', 'obj', 'CSV', 'document-excel-csv.png']
		];
		var toolbar = cell.attachToolbar();
		toolbar.setIconsPath('../libs/dhtmlx/imgs/dhxtoolbar_skyblue/');
		toolbar.addButtonSelect(1, 1, 'Output Format', opts, 'report-paper.png');
		toolbar.addSeparator(4,2);
		toolbar.addButton(5,3,'Print','printer.png');
		toolbar.addSeparator(6,4);
		toolbar.addButton(7,5,'Download','drive-download.png');

		toolbar.attachEvent('onClick', function(buttonId){
			if (buttonId === 'btnHTML') window.location.href = '?<?php echo $queryStringReBuild . "&output=html"?>';
			if (buttonId === 'btnPDF') window.location.href = '?<?php echo $queryStringReBuild . "&output=pdf"?>';
		});

		var status = cell.attachStatusBar();
		status.setText('Ready');
	})();
	</script>
</body>
</html>