<?php

class Parameter
{
	public $name;
	public $dataType;
	public $maxLength;
	public $default;
	public $value;

	public function __construct($details)
	{
		$this->dataType = $details['dataType'];
		$this->maxLength = $details['maxLength'];
		$this->default = $details['default'];
	}
}

?>