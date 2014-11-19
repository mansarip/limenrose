<?php

session_start();

// login auth
if (isset($_POST['task']) && $_POST['task'] == 'checkAuth')
{
	$success = false;

	$user = md5($_POST['lnrusername']);
	$pass = md5($_POST['lnrpassword']);
	
	$list = file_get_contents('auth');
	$list = explode("\n", $list);

	foreach ($list as $line)
	{
		$line = explode(" : ", $line);

		if ($user == $line[0] && $pass == $line[1])
		{
			$success = true;
			break;
		}
	}

	if ($success)
	{
		// set session
		$_SESSION['username'] = $_POST['lnrusername'];
		$_SESSION['logged'] = true;

		// hantar code OK
		echo 'OK';
		exit;
	}
}

// jika logged in, pergi ke manager
if ($_SESSION['logged'])
{
	header("Location: manager/");
}

?>

<!doctype html>
<head>
	<meta charset="utf-8">
	<title>Lime & Rose Reporting</title>
	<link rel="icon" type="image/ico" href="favicon.ico"/>
	<style type="text/css">
	body{
		margin: 0;
		background: url('images/bg.png');
		font-family: Arial, sans-serif;
		font-size: 12px;
		color: #4a4a4a;
	}
	.wrapper{
		width: 600px;
		margin: 30px auto;
		background: #fff;
		-webkit-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.3);
		-moz-box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.3);
		box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.3);
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
		text-align: center;
		padding: 30px;
	}
	.wrapper table{
		margin: 20px auto;
	}
	.wrapper table input.text{
		font-size: 14px;
		font-family: inherit;
		padding: 7px;
		border: 1px solid #b4b4b4;
		width: 200px;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
		margin: 3px 0;
		outline: none;
		-webkit-box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.1);
		-moz-box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.1);
		box-shadow: inset 0px 0px 5px 0px rgba(0,0,0,0.1);
	}
	.wrapper table input.login{
		-moz-box-shadow:inset 0px 1px 0px 0px #9acc85;
		-webkit-box-shadow:inset 0px 1px 0px 0px #9acc85;
		box-shadow:inset 0px 1px 0px 0px #9acc85;
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #74ad5a), color-stop(1, #68a54b));
		background:-moz-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
		background:-webkit-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
		background:-o-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
		background:-ms-linear-gradient(top, #74ad5a 5%, #68a54b 100%);
		background:linear-gradient(to bottom, #74ad5a 5%, #68a54b 100%);
		filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#74ad5a', endColorstr='#68a54b',GradientType=0);
		background-color:#74ad5a;
		border:1px solid #3b6e22;
		display:inline-block;
		cursor:pointer;
		color:#ffffff;
		font-family:arial;
		font-size:13px;
		font-weight:bold;
		padding:6px 12px;
		text-decoration:none;
		-moz-border-radius:6px;
		-webkit-border-radius:6px;
		border-radius:6px;
		outline: none;
		width: 100%;
	}
	.wrapper table input.login:hover{
		background:-webkit-gradient(linear, left top, left bottom, color-stop(0.05, #68a54b), color-stop(1, #74ad5a));
			background:-moz-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
			background:-webkit-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
			background:-o-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
			background:-ms-linear-gradient(top, #68a54b 5%, #74ad5a 100%);
			background:linear-gradient(to bottom, #68a54b 5%, #74ad5a 100%);
			filter:progid:DXImageTransform.Microsoft.gradient(startColorstr='#68a54b', endColorstr='#74ad5a',GradientType=0);
			background-color:#68a54b;
	}
	.wrapper table input.login:active {
		position:relative;
		top:1px;
	}
	</style>
	<script type="text/javascript" src="libs/jquery/jquery.min.js"></script>
	<script type="text/javascript">
	function CheckAuth()
	{
		var username = $('#user').val();
		var password = $('#pass').val();

		$('p#message').text('Loggging in...');

		$.ajax({
			url:'./',
			type:'post',
			data:{task:'checkAuth',lnrusername:username,lnrpassword:password}
		})
		.done(function(code){
			if (code === 'OK') {
				window.location = 'manager';
			} else {
				$('p#message').html('<span style="color:red">Login failed!</span>');
			}
		});
	}

	$(function(){
		$('#user, #pass').on('keypress', function(event){
			if (event.keyCode === 13) CheckAuth();
		});
	});
	</script>
</head>
<body>
	<div class="wrapper">
		<img class="logo" src="images/logo2.png">
		<table>
			<tr>
				<td><input id="user" class="text" type="text" autofocus="autofocus" name="lnrusername" value="" placeholder="Username"/></td>
			</tr>
			<tr>
				<td><input id="pass" class="text" type="password" name="lnrpassword" value="" placeholder="Password"/></td>
			</tr>
			<tr>
				<td><input class="login" type="button" onclick="CheckAuth()" value="LOGIN" name="login"/></td>
			</tr>
		</table>
		<p id="message"></p>
	</div>
</body>
</html>