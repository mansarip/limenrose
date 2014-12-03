<?php

session_start();
if (!$_SESSION['logged']) header('Location: ../../');

?>
<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Lime & Rose : Grid Report Designer</title>
	<link rel="icon" type="image/ico" href="../../favicon.ico">
	<link rel="stylesheet" href="../../libs/dhtmlx/dhtmlx.css">
	<link rel="stylesheet" href="../../libs/jqueryui/jquery-ui.min.css">
	<link rel="stylesheet" href="css/style.css">
	<script type="text/javascript" src="../../libs/dhtmlx/dhtmlx.js"></script>
	<script type="text/javascript" src="../../libs/jquery/jquery.min.js"></script>
	<script type="text/javascript" src="../../libs/jqueryui/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/app.js"></script>
	<script type="text/javascript" src="js/report.js"></script>
	<script type="text/javascript" src="js/band.js"></script>
</head>
<body>
	<div id="app"></div>
</body>
</html>