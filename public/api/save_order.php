<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["error" => "No data provided"]);
    exit;
}

$file = '../data/orders.json';

// Création du fichier s'il n'existe pas
if (!file_exists($file)) {
    file_put_contents($file, json_encode([]));
}

$orders = json_decode(file_get_contents($file), true);
if (!is_array($orders)) $orders = [];

// Ajout de la nouvelle commande en haut de liste
array_unshift($orders, $data);

if (file_put_contents($file, json_encode($orders, JSON_PRETTY_PRINT))) {
    echo json_encode(["status" => "success", "id" => $data['id']]);
} else {
    echo json_encode(["error" => "Failed to save order"]);
}
