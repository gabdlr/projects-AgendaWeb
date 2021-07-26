<?php



//Creedenciales de la base de datos

//Las constantes en PHP deben escribirse en mayuscula (buenas practicas)

define('DB_USUARIO', 'root');

define('DB_PASSWORD', 'root');

define('DB_HOST', 'localhost');

define('DB_NOMBRE', 'database');



$conn = new mysqli(DB_HOST, DB_USUARIO, DB_PASSWORD, DB_NOMBRE);

/** echo $conn->ping(); Sirve para comprobar si estamos conectados a la BD**/

?>