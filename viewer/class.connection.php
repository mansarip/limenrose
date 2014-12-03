<?php

class Connection
{
	public $type;
	public $host;
	public $port;
	public $sid;
	public $serviceName;
	public $username;
	public $password;
	public $dbname;
	public $socket;
	public $conn;

	public function __construct($source)
	{
		$conn = $source['data']['connection'];

		$this->type = $conn['type'];
		$this->host = $conn['host'];
		$this->port = $conn['port'];
		$this->socket = $conn['socket'];
		$this->sid = $conn['sid'];
		$this->serviceName = $conn['serviceName'];
		$this->username = $conn['username'];
		$this->password = $conn['password'];
		$this->dbname = $conn['dbname'];
	}

	public function Init()
	{
		$type = strtolower($this->type);
		$type = trim($type);

		if ($type == 'mysql')
		{
			$conn = mysqli_connect($this->host, $this->username, $this->password, $this->dbname, $this->port, $this->socket);
			if (mysqli_connect_error())
			{
				if (mysqli_connect_errno() == 1045) die( DisplayError(10) );
			}
			else
			{
				$this->conn = $conn;
			}
		}
	}
}

?>