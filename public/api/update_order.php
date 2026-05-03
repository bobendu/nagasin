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
    $subject = "Commande Nagasin #" . substr($orderId, -6) . " : " . $newStatus;
    
    $statusMessages = [
        "Payée" => "Votre commande a bien été reçue et est en attente de traitement.",
        "En préparation" => "Bonne nouvelle ! Votre commande est en cours de préparation dans notre studio.",
        "Expédiée" => "Votre commande a été expédiée ! Elle devrait arriver chez vous très prochainement."
    ];
    
    $messageText = $statusMessages[$newStatus] ?? "Le statut de votre commande a été mis à jour : " . $newStatus;
    
    $headers = "MIME-Version: 1.0\n";
    $headers .= "Content-type:text/html;charset=UTF-8\n";
    $headers .= "From: contact@nagasin.fr\n";
    $headers .= "Reply-To: na@dessinateur.net\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $htmlContent = "
    <html>
    <head>
        <title>Suivi de commande Nagasin</title>
        <style>
            body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; padding: 0; margin: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 0; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
            .header { background: #004169; color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 4px; }
            .content { padding: 40px; background: #ffffff; }
            .footer { font-size: 11px; color: #999; text-align: center; padding: 30px; background: #f9f9f9; }
            .status-badge { background: #f0fdf4; color: #22c55e; padding: 8px 20px; border-radius: 30px; font-weight: bold; display: inline-block; border: 1px solid #bbf7d0; text-transform: uppercase; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>NAGASIN.</h1>
            </div>
            <div class='content'>
                <p style='font-size: 16px;'>Bonjour <strong>" . $orderData['customer']['name'] . "</strong>,</p>
                <p style='font-size: 15px; color: #555;'>" . $messageText . "</p>
                <div style='margin: 30px 0;'>
                    <span class='status-badge'>" . $newStatus . "</span>
                </div>
                <hr style='border:none; border-top:1px solid #eee; margin:30px 0;'>
                <p style='font-size: 14px;'>Merci de votre confiance,<br><strong style='color: #004169;'>L'équipe Nagasin</strong></p>
            </div>
            <div class='footer'>
                Ceci est un email automatique concernant la commande #" . $orderId . ".<br>
                Pour toute question : na@dessinateur.net
            </div>
        </div>
    </body>
    </html>
    ";
    
    $sent = @mail($to, $subject, $htmlContent, $headers, "-f contact@nagasin.fr");

    echo json_encode(["status" => "success", "newStatus" => $newStatus, "mailSent" => $sent]);
} else {
    echo json_encode(["error" => "Order not found"]);
}
