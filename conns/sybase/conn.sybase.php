<?php

/*
* Server side script untuk Sybase
* Driver yang digunakan : sybase_ct
*/

$task = $_POST['task'];

if ($task == 'testConnection')
{
	//check driver
	//parameter
	$host = $_POST['host'];
	$username = $_POST['username'];
	$password = $_POST['password'];
	$database = null;

	//pastikan tak empty
	if ($host == '' || $username == '')
	{
		die ('Error : empty field');
	}

	ConnectionInit($host, $port, $username, $password, true);
}

function CheckDriver()
{
	return extension_loaded('sybase_ct') ? true : die('Unable to connect : "sybase_ct" extension not found');
}

function ConnectionInit($host, $port=null, $username, $password, $testConnection=false)
{
	$driverLoaded = CheckDriver();
	if ($driverLoaded)
	{
		$conn = @sybase_connect($host, $username, $password);
		if (!$conn)
		{
			die (sybase_get_last_message());
		}
	}

	if ($testConnection)
	{
		echo 'Connection Successful';
		return;
	}
	else
	{
		return $conn;
	}
}

function Execute($query, $conn)
{
	$q      = @sybase_query($query, $conn);
	if (!$q)
	{
		die (sybase_get_last_message());
	}

	$result = array();
	while ($row = @sybase_fetch_assoc($q))
	{
		$result[] = $row;
	}

	return $result;
}

?>