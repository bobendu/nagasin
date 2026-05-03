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
    $subject = "Mise à jour de votre commande Nagasin #" . substr($orderId, -6);
    
    $statusMessages = [
        "Payée" => "Votre commande a bien été reçue et est en attente de traitement.",
        "En préparation" => "Bonne nouvelle ! Votre commande est en cours de préparation dans notre studio.",
        "Expédiée" => "Votre commande a été expédiée ! Elle devrait arriver chez vous très prochainement."
    ];
    
    $messageText = $statusMessages[$newStatus] ?? "Le statut de votre commande a été mis à jour : " . $newStatus;
    
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Nagasin Studio <na@dessinateur.net>" . "\r\n";
    
    $htmlContent = "
    <html>
    <head>
        <title>Suivi de commande Nagasin</title>
        <style>
            body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; }
            .header { background: #004169; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; }
            .footer { font-size: 12px; color: #999; text-align: center; padding: 20px; }
            .status-badge { background: #f0fdf4; color: #22c55e; padding: 5px 15px; borderRadius: 20px; fontWeight: bold; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>NAGASIN.</h1>
            </div>
            <div class='content'>
                <p>Bonjour " . $orderData['customer']['name'] . ",</p>
                <p>" . $messageText . "</p>
                <p><strong>Statut actuel :</strong> " . $newStatus . "</p>
                <hr>
                <p>Merci de votre confiance,<br>na!</p>
            </div>
            <div class='footer'>
                Ceci est un email automatique pour la commande #" . $orderId . ".<br>
                Nagasin Studio - na@dessinateur.net
            </div>
        </div>
    </body>
    </html>
    ";
    
    // Note: mail() peut échouer selon la config OVH, mais c'est la base.
    @mail($to, $subject, $htmlContent, $headers);

    echo json_encode(["status" => "success", "newStatus" => $newStatus]);
} else {
    echo json_encode(["error" => "Order not found"]);
}
