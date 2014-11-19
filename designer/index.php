<?php

session_start();

// check Auth
if (!$_SESSION['logged']) header('Location: ../');

// designer type
$designerType = $_GET['type'];

?>

<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Lime & Rose : Report Designer</title>
	<link rel="stylesheet" type="text/css" href="css/style.css">
	<script type="text/javascript" src="../libs/jquery/jquery.min.js"></script>
	<link rel="icon" type="image/ico" href="../favicon.ico"/>
</head>
<body>
	<div class="chooseType">
		<img class="logo" src="images/logo2.png">
		<h1>Choose designer type :</h1>
		<a class="icon a" href="?type=component"><img src="images/new-component.png"/><br/>Component Based</a>
		<a class="icon b" href="./grid"><img src="images/new-word.png"/><br/>Word Processor</a>
		<a class="icon c" href="?type=banded"><img src="images/new-band.png"/><br/>Banded Report</a>

		<div class="description a">
			<h3>Component Based</h3>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
		</div>
		<div class="description b">
			<h3>Word Processor</h3>
			<p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
		<div class="description c">
			<h3>Banded Report</h3>
			<p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
		</div>
	</div>
	<p class="footer"><a href="../manager/">&#171; Back to Report Manager</a></p>

	<script type="text/javascript">
	$(function(){
		$('.icon').on('mouseover', function(){
			$('.description').hide();
			if      ($(this).hasClass('a')) { $('.description.a').show(); }
			else if ($(this).hasClass('b')) { $('.description.b').show(); }
			else if ($(this).hasClass('c')) { $('.description.c').show(); }
		});
	});
	</script>
</body>
</html>