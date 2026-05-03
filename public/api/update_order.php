<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, X-Admin-Password");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$adminPassword = $_SERVER['HTTP_X_ADMIN_PASSWORD'] ?? '';
$expectedPassword = getenv('VITE_ADMIN_PASSWORD') ?: 'nagasin2026';

if ($adminPassword !== $expectedPassword) {
    http_response_code(403);
    echo json_encode(["error" => "Unauthorized"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$orderId = $data['id'] ?? null;
$newStatus = $data['status'] ?? null;

if (!$orderId || !$newStatus) {
    echo json_encode(["error" => "Missing data"]);
    exit;
}

$file = '../data/orders.json';
if (!file_exists($file)) {
    echo json_encode(["error" => "No orders found"]);
    exit;
}

$orders = json_decode(file_get_contents($file), true);
$found = false;
$orderData = null;

foreach ($orders as &$order) {
    if ($order['id'] == $orderId) {
        $order['status'] = $newStatus;
        $orderData = $order;
        $found = true;
        break;
    }
}

if ($found) {
    file_put_contents($file, json_encode($orders, JSON_PRETTY_PRINT));
    
    // ENVOI DE L'EMAIL AU CLIENT
    $to = $orderData['customer']['email'];
    $subject = "Commande Nagasin #" . substr($orderId, -6) . " - " . $newStatus;
    
    $statusMessages = [
        "Payée" => "Votre commande a bien été reçue.",
        "En préparation" => "Votre commande est en cours de préparation.",
        "Expédiée" => "Votre commande a été expédiée !"
    ];
    
    $messageText = $statusMessages[$newStatus] ?? "Statut : " . $newStatus;
    
    $plainContent = "Bonjour " . $orderData['customer']['name'] . ",\n\n";
    $plainContent .= $messageText . "\n\n";
    $plainContent .= "Suivi de votre commande #" . $orderId . "\n";
    $plainContent .= "Merci de votre confiance,\nna!";

    $headers = "From: Nagasin Studio <no-reply@nagasin.fr>\n";
    $headers .= "Reply-To: na@dessinateur.net\n";
    $headers .= "X-Mailer: PHP/" . phpversion();
    
    $sent = @mail($to, $subject, $plainContent, $headers, "-f no-reply@nagasin.fr");

    echo json_encode(["status" => "success", "newStatus" => $newStatus, "mailSent" => $sent]);
} else {
    echo json_encode(["error" => "Order not found"]);
}
