<?php

if ($_POST['task'] == 'checkFile')
{
	//check boleh write tak folder
	if (!is_writable('../publish/'))
	{
		die('Publish failed. Folder is unwritable.');
	}

	//check ada tak nama sama dalam folder
	if (file_exists('../publish/' . $_POST['filename'] . '.lnr'))
	{
		die('Publish failed. A file with the name "'. $_POST['filename'] .'" is already exists.');
	}

	$handler = fopen('../publish/' . $_POST['filename'] . '.lnr', "w");

	$data = $_POST['data'];
	fwrite($handler, $data);
	fclose($handler);

	echo 'OK';
}

function GeneratePHPCode()
{

$data = $_POST['data'];
$data = stripslashes($data);
$data = json_decode($data, true);

$master = <<< EOD
<?php

# Periksa permission
# Jika tidak padan key dan value, user akan terus ditendang

EOD;

//buat statement permission
foreach ((array)$data['permission'] as $permission)
{
	$master .= "if (\$_". strtoupper($permission['type']) ."['". $permission['key'] ."'] != '". $permission['value'] ."') die('Access forbidden.');\n";	
}

$master .= "\n";

//generate include component dulu
/*$master .= "# Dapatkan include file untuk component\n";
foreach ((array)$data['component'] as $component)
{
	$master .= "include_once('../comps/". $component['folder'] ."/class.php');\n";
}

$master .= "\n";*/

foreach ((array)$data['component'] as $component)
{
	include_once('../comps/'. $component['folder'] .'/class.php');
}

//print pdf
$master .= "# Print PDF\n";
$master .= "if (\$_GET['output'] == 'pdf')\n";
$master .= "{\n";
$master .= "}\n";

$master .= "\n";

//print html
$master .= "# Print HTML\n";
$master .= "else\n";
$master .= "{\n";

foreach ((array)$data['component'] as $component)
{
	$comp = new $component['type']($component);
	$master .= "\t";
	$master .= $comp->Code();
	$master .= "\n<?php\n";
}

$master .= "}\n";

$master .= "\n\n?>";

return $master;

}

?>