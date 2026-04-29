<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['photo'])) {
    $uploadDir = '../items/'; // Dossier où seront stockées les photos
    
    // Créer le dossier s'il n'existe pas
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0755, true);
    }

    $file = $_FILES['photo'];
    $fileName = time() . '_' . basename($file['name']);
    $targetPath = $uploadDir . $fileName;

    if (move_uploaded_file($file['tmp_name'], $targetPath)) {
        echo json_encode([
            "success" => true,
            "url" => "https://www.nagasin.fr/items/" . $fileName
        ]);
    } else {
        echo json_encode(["success" => false, "error" => "Erreur lors du transfert"]);
    }
} else {
    echo json_encode(["success" => false, "error" => "Requête invalide"]);
}
?>
