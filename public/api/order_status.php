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
            "status" => $order['status'],
            "invoiceSettings" => $order['invoiceSettings'] ?? null
        ];
        break;
    }
}

if ($foundOrder) {
    if (empty($foundOrder['invoiceSettings'])) {
        $catalogFile = '../data/catalog.json';
        $invoiceSettings = [
            "sellerName" => "Benoît Baudu (na!)",
            "sellerDetails" => "Artiste-Auteur / NA! Studio",
            "sellerEmail" => "contact@nagasin.fr",
            "sellerWebsite" => "www.nagasin.fr",
            "legalNotice" => "TVA non applicable - article 293 B du CGI",
            "footerText" => "Facture acquittée. Mode de règlement : Carte Bancaire via Stripe.\nNagasin Studio par na! - Tous droits réservés."
        ];

        if (file_exists($catalogFile)) {
            $catalog = json_decode(file_get_contents($catalogFile), true);
            if (is_array($catalog) && isset($catalog['invoiceSettings'])) {
                $invoiceSettings = array_merge($invoiceSettings, $catalog['invoiceSettings']);
            }
        }
        $foundOrder['invoiceSettings'] = $invoiceSettings;
    }

    echo json_encode($foundOrder);
} else {
    http_response_code(404);
    echo json_encode(["error" => "Commande non trouvee"]);
}
