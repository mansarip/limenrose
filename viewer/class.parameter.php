<?php

class Parameter
{
	public $name;
	public $dataType;
	public $maxLength;
	public $default;
	public $value;
	public $type;

	public function __construct($details)
	{
		$this->dataType = $details['dataType'];
		$this->maxLength = $details['maxLength'];
		$this->default = $details['default'];
		$this->type = trim(strtoupper($details['type']));
	}

	public function GetValue()
	{
		switch ($this->type)
		{
			case 'GET': $this->value = $_GET[$this->name]; break;
			case 'POST': $this->value = $_POST[$this->name]; break;
			case 'SESSION': $this->value = $_SESSION[$this->name]; break;
		}
	}
}

?>