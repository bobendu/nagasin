<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$orderId = $_GET['id'] ?? '';

if (!$orderId) {
    http_response_code(400);
    echo json_encode(["error" => "ID de commande manquant"]);
    exit;
}

$file = '../data/orders.json';
if (!file_exists($file)) {
    http_response_code(404);
    echo json_encode(["error" => "Aucune commande trouvee"]);
    exit;
}

$orders = json_decode(file_get_contents($file), true);
if (!is_array($orders)) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de base de donnees"]);
    exit;
}

$foundOrder = null;
foreach ($orders as $order) {
    if ($order['id'] == $orderId) {
        $foundOrder = [
            "id" => $order['id'],
            "date" => $order['date'],
            "customer" => [
                "name" => $order['customer']['name'],
                "email" => $order['customer']['email'],
                "addr" => $order['customer']['addr'] ?? ''
            ],
            "items" => array_map(function($item) {
                return [
                    "title" => $item['title'],
                    "price" => $item['price'],
                    "image" => $item['image'],
                    "dedication" => $item['dedication'] ?? ''
                ];
            }, $order['items']),
            "total" => $order['total'],
            "status" => $order['status']
        ];
        break;
    }
}

if ($foundOrder) {
    echo json_encode($foundOrder);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Commande non trouvee"]);
}
