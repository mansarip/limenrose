<?php session_start(); ?>

<!doctype html>
	<head>
		<meta charset="utf-8">
		<title>Lime & Rose Report Generator</title>
		<link rel="shortcut icon" href="support/favicon.ico">
		<link rel="stylesheet" type="text/css" href="libs/dhtmlx/dhtmlx.css">
		<link rel="stylesheet" type="text/css" href="support/app.css">
		<script src="libs/jquery/jquery.min.js"></script>
		<script src="libs/jquery/jquery.ui.core.min.js"></script>
		<script src="libs/jquery/jquery.ui.widget.min.js"></script>
		<script src="libs/jquery/jquery.ui.mouse.min.js"></script>
		<script src="libs/jquery/jquery.ui.draggable.min.js"></script>
		<script src="libs/jquery/jquery.ui.droppable.min.js"></script>
		<script src="libs/jquery/jquery.ui.sortable.min.js"></script>
		<script src="libs/dhtmlx/dhtmlx.js"></script>
		<script src="support/app.js"></script>
		<script src="support/app.comp.js"></script>
		<script src="support/app.conn.js"></script>
	</head>
	<body>
		<?php if (!$_SESSION['logged']) { ?>
			<div id="applocker"></div>
		<?php } ?>
		<div id="logo"></div>
		<div id="apptopbar"></div>
		<div id="applayout"></div>
	</body>
</html>