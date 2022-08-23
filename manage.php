<?php
$item = $_GET['item'];
unlink("./images/sprites.png");
copy("./images/".$item,"./images/sprites.png");
header('Location: ./home.html');
?>