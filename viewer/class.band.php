<?php

class Band
{
	public $type;
	public $height;
	public $children;
	public $parent;
	public $skipRender;
	public $heightRemain;
	public $item;

	public function __construct($details)
	{
		$this->height = $details['height'];
		$this->children = $details['children'];
		$this->parent = $details['parent'];
		$this->skipRender = $details['skipRender'];
		$this->heightRemain = $details['heightRemain'];
		$this->item = $details['item'];
	}
}

?>