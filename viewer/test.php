<?php

$result[] = array(
		'NAMA' => 'Muhammad Luqman',
		'NOKP' => '911201105755',
		'NEGERI' => 'Selangor'
	);

$result = json_encode($result);

echo '<pre>';
print_r(md5($result));
echo '</pre>';

?>