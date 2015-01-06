<?php

function Encrypt($string, $key)
{
	return mcrypt_encrypt(MCRYPT_BLOWFISH, $key, $string, MCRYPT_MODE_ECB);
}

function Decrypt($string, $key)
{
	return rtrim( mcrypt_decrypt(MCRYPT_BLOWFISH, $key, $string, MCRYPT_MODE_ECB) );
}


?>