<?php

// hide all error, notice, etc
error_reporting(0);

session_start();

// logout
if (isset($_POST['logout']))
{
	session_destroy();
	header('Location: ../');
}

// check auth
if (!$_SESSION['logged'])
{
	header('Location: ../');	
}

// page type
$page = $_GET['page'];

?>
<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Lime & Rose : Report Manager</title>
	<link rel="icon" type="image/ico" href="../favicon.ico"/>
	<style type="text/css">
	body{
		margin: 0;
		background: url('../images/bg.png');
		font-family: Arial, sans-serif;
		font-size: 12px;
		color: #4a4a4a;
	}
	a img{
		border: none;
	}
	#wrapper{
		width: 900px;
		margin: 15px auto;
	}
	#topbar{
		float: left;
		width: 100%;
		clear: both;
		margin-bottom: 10px;
	}
	#logo{
		float: left;
	}
	#userDetails{
		float: right;
		margin: 15px 0;
		text-shadow: 1px 1px 1px #fff;
	}
	#userDetails span.sep{
		color: #b3b3b3;
	}
	#userDetails a{
		color: #CB2020;
		text-decoration: none;
	}
	#userDetails a:hover{
		text-decoration: underline;
	}
	#sideMenu{
		float: left;
		background-color: #fff;
		width: 180px;
		padding: 10px;
		-webkit-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.23);
		-moz-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.23);
		box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.23);
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
	}
	#sideMenu h1{
		margin: 0;
		font-size: 11px;
		padding: 3px;
		background-color: #95a5a6;
		color: #fff;
		font-weight: normal;
		text-align: center;
	}
	#sideMenu h3{
		margin: 10px 0;
		font-size: 11px;
		color: #B72E2E;
	}
	#sideMenu ul{
		padding: 0;
		margin: 0;
		list-style: none;
	}
	#sideMenu ul li{
		margin: 2px 0;
	}
	#sideMenu ul li a{
		padding: 3px;
		display: block;
		text-decoration: none;
		color: inherit;
	}
	#sideMenu ul li a:hover{
		text-decoration: underline;
	}
	#sideMenu ul li img.icon{
		display: inline-block;
		float: left;
		margin-right: 8px;
	}
	#content{
		float: right;
		background-color: #fff;
		width: 660px;
		padding: 10px;
		-webkit-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.23);
		-moz-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.23);
		box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.23);
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
	}
	#content h1.title{
		font-size: 15px;
		margin: 0;
	}
	</style>
	<script type="text/javascript" src="../libs/jquery/jquery.min.js"></script>
	<script type="text/javascript">
	function Logout()
	{
		var form = $('<form style="display:none" action="./" method="post">');
		var button = $('<input type="submit" name="logout" value=""/>');
		form.append(button);
		$('body').append(form);
		button.click();
	}
	</script>
</head>
<body>
	<div id="wrapper">
		<div id="topbar">
			<div id="logo"><a href="./"><img src="images/logo3.png"/></a></div>
			<div id="userDetails">
				<span>Logged in as <?php echo $_SESSION['username'] ?></span><span class="sep"> | </span><a onclick="Logout()" href="javascript:void(0);">Logout</a>
			</div>
		</div>

		<div id="sideMenu">
			<h1>MENU</h1>
			<h3>General</h3>
			<ul>
				<li><a href="./"><img class="icon" src="images/application-monitor.png"/>Overview</a></li>
				<li><a href="./?page=newapp"><img class="icon" src="images/application--plus.png"/>New App</a></li>
				<li><a href="../designer/"><img class="icon" src="images/pencil-button.png"/>Report Designer</a></li>
			</ul>
			<h3>Settings</h3>
			<ul>
				<li><a href="#"><img class="icon" src="images/gear.png"/>Preferences</a></li>
				<li><a href="#"><img class="icon" src="images/users.png"/>User Management</a></li>
			</ul>
			<h3>Others</h3>
			<ul>
				<li><a href="#"><img class="icon" src="images/book-open.png"/>Documentation</a></li>
				<li><a href="#"><img class="icon" src="images/telephone-handset.png"/>Contact</a></li>
			</ul>
		</div>

		<div id="content">

			<?php if ($page == '') { ?>
			<h1 class="title">General</h1>
			<?php } elseif ($page == 'newapp') { ?>
			<h1 class="title">New Application</h1>
			<?php } ?>
		</div>
	</div>
</body>
</html>