<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Password");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

// Vérification du mot de passe admin via header
$adminPassword = $_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? '';

// Dans un vrai projet, on utiliserait un hash stocké dans un fichier séparé
// Ici on simule ou on utilise une constante (doit correspondre à .env)
$expectedPassword = getenv('VITE_ADMIN_PASSWORD') ?: 'nagasin2026';

if ($adminPassword !== $expectedPassword) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized access"]);
    exit;
}

$file = '../data/orders.json';

if (!file_exists($file)) {
    echo json_encode([]);
    exit;
}

echo file_get_contents($file);
