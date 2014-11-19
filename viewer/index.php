<?php

// tutup segala error reporting
error_reporting(0);

// file berkenaan
include('config.php');
include('../libs/php/func.encrypt.php');
include('../libs/php/func.error.php');

# ============================ #
# PROSES VALIDATE FILE         #
# ============================ #

if (!isset($_GET['file'])) DisplayError(0);

// get filename
$filename = $_GET['file'];

// jika tidak nyatakan filename
if ($filename == '') DisplayError(1);

// baca file dan decrypt
$source = file_get_contents(PUBLISH_PATH . $filename . '.lnre');
if (!$source) DisplayError(2);

# ============================ #
# SOURCE PROCESSING            #
# ============================ #

// source processing
$source = Decrypt($source, KEY);
$source = json_decode($source, true);

// valid tak source?
if (!is_array($source)) DisplayError(3);

exit;

?>

<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Lime & Rose : Report Viewer</title>
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
		cell.setText('Report Viewer');

		var toolbar = cell.attachToolbar();
		var status = cell.attachStatusBar();
		status.setText('Ready');
	})();
	</script>
</body>
</html>