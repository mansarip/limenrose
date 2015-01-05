<?php

class Query
{
	public $name;
	public $mapping;
	public $originalSql;
	public $sql;
	public $result;

	public function __construct($details)
	{
		$this->name = $details['name'];
		$this->mapping = $details['mapping'];
		$this->originalSql = $details['sql'];
		$this->sql = $details['sql'];
	}

	public function ReplaceParam($parameter)
	{
		foreach((array)$parameter as $paramName => $param)
		{
			if ($param->type == 'GET')
			{
				$str = '{GET|'.$paramName.'}';
				$this->sql = str_replace($str, $param->value, $this->sql);
			}
		}
	}

	public function Execute($conn)
	{
		$this->result = $conn->Execute($this->sql);
	}
}

?>