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
		
	}
}

?>