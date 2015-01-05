<?php

class Report
{
	public $outputFormat;
	public $format;
	public $orientation;
	public $marginTop;
	public $marginLeft;
	public $marginRight;
	public $marginBottom;
	public $band = array();

	public function __construct($source)
	{
		$this->format = $source['layout']['format'];
		$this->orientation = $source['layout']['orientation'];
		$this->marginTop = $source['layout']['margin']['top'];
		$this->marginLeft = $source['layout']['margin']['left'];
		$this->marginRight = $source['layout']['margin']['right'];
		$this->marginBottom = $source['layout']['margin']['bottom'];
	}
}

?>