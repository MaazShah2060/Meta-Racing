<?php
if(isset($_GET['item'])){
    $item = $_GET['item'];
    unlink("./images/sprites.png");
    copy("./images/".$item,"./images/sprites.png");
    header('Location: ./home.html');
} else {
    unlink("./images/sprites.png");
    copy("./images/sprites_backup.png","./images/sprites.png");
    header('Location: ./home.html');
}
?>