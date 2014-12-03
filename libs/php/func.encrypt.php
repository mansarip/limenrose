<?php

function Encrypt($string, $key)
{
	return mcrypt_encrypt(MCRYPT_RIJNDAEL_256, $key, $string, MCRYPT_MODE_ECB);
}

function Decrypt($string, $key)
{
	return rtrim( mcrypt_decrypt(MCRYPT_RIJNDAEL_256, $key, $string, MCRYPT_MODE_ECB) );
}


?>