<?php
// Previeni qualsiasi output di WordPress
define('WP_USE_THEMES', false);

// Contenuto del tuo index.html
$html = file_get_contents('index.html');
echo $html;
?> 