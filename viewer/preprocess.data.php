<?php

// tutup error
//error_reporting(0);

// file berkenaan
include('config.php');
include('class.connection.php');
include('class.parameter.php');
include('class.query.php');
include('../libs/php/func.encrypt.php');
include('../libs/php/func.error.php');

# ============================ #
# PROSES VALIDATE FILE         #
# ============================ #

if (!isset($_GET['file'])) DisplayError(0);

// get filename
$filename = $_GET['file'];

// jika tidak nyatakan filename
if ($filename == '') DisplayError(1);

// baca file dan decrypt
$source = file_get_contents(PUBLISH_PATH . $filename . '.lnre');
if (!$source) DisplayError(2);


# ============================ #
# SOURCE PROCESSING            #
# ============================ #

// source processing
$source = Decrypt($source, KEY);
$source = json_decode($source, true);

// valid tak source?
if (!is_array($source)) DisplayError(3);

# ============================ #
# FETCH DATA                   #
# ============================ #

// parameter objects
$parameter = array();
foreach ((array)$source['data']['parameter'] as $paramName => $paramDetails)
{
	$parameter[$paramName] = new Parameter($paramDetails);
	$parameter[$paramName]->name = $paramName;
	$parameter[$paramName]->GetValue();
}

// connection object
$conn = new Connection($source);
$conn->Init();

// query objects
$query = array();
foreach ((array)$source['data']['query'] as $queryName => $queryDetails)
{	
	$q = new Query($queryDetails);
	$q->name = $queryName;
	$q->ReplaceParam($parameter);
	$q->Execute($conn);
	$query[$queryName] = $q;
}

// close connection
$conn->Close();

?>