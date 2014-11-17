<?php

/*
* Server side script untuk MySQL
* Driver yang digunakan : mysqli
*/

namespace connection\mysql {

	$task = $_POST['task'];

	if ($task == 'testConnection')
	{
		//check driver
		//parameter
		$host = $_POST['host'];
		$port = $_POST['port'] == '' ? null : (int)$_POST['port']; //jika '', maka null
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
		return extension_loaded('mysqli') ? true : die('Unable to connect : "mysqli" extension not found');
	}

	function ConnectionInit($host, $port, $username, $password, $testConnection=false)
	{
		if ($port != '') $host .= ':'.$port;

		$driverLoaded = CheckDriver();
		if ($driverLoaded)
		{
			$conn = mysqli_init();
			if (!$conn) die('mysqli_init failed');
			if (!@mysqli_real_connect($conn, $host, $username, $password, null))
			{
				die('Connect Error (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
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
		$finalResult = array();
		$result = mysqli_query($conn, $query);

		if (!$result)
		{
			die(mysqli_error($conn));
		}

		while ($row = mysqli_fetch_assoc($result)) {
			$finalResult[] = $row;
		}

		return $finalResult;
	}
} //end namespace

?>