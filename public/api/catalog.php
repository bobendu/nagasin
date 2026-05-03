<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Password");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // SAUVEGARDE DU CATALOGUE
    $adminPassword = $_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? '';
    $expectedPassword = getenv('VITE_ADMIN_PASSWORD') ?: 'nagasin2026';

    if ($adminPassword !== $expectedPassword) {
        http_response_code(403);
        echo json_encode(["error" => "Unauthorized"]);
        exit;
    }

    $data = file_get_contents("php://input");
    if (file_put_contents('../data/catalog.json', $data)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["error" => "Failed to save catalog"]);
    }
} else {
    // LECTURE DU CATALOGUE
    $file = '../data/catalog.json';
    if (file_exists($file)) {
        echo file_get_contents($file);
    } else {
        // Fallback sur le fichier par défaut si le catalog.json n'existe pas encore
        $default = 'products.json';
        if (file_exists($default)) {
            echo file_get_contents($default);
        } else {
            echo json_encode([]);
        }
    }
}
