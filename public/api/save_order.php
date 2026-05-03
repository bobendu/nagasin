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
    
    // ENVOI DE L'EMAIL DE CONFIRMATION AU CLIENT
    $to = $data['customer']['email'];
    $orderId = $data['id'];
    $customerName = $data['customer']['name'];
    $total = $data['total'];
    
    $subject = "Confirmation de votre commande Nagasin #" . substr($orderId, -6);
    
    $headers = "MIME-Version: 1.0\n";
    $headers .= "Content-type:text/html;charset=UTF-8\n";
    $headers .= "From: contact@nagasin.fr\n";
    $headers .= "Reply-To: na@dessinateur.net\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    $htmlContent = "
    <html>
    <head>
        <title>Confirmation de commande Nagasin</title>
        <style>
            body { font-family: 'Helvetica', sans-serif; color: #333; padding: 0; margin: 0; }
            .container { max-width: 600px; margin: 20px auto; padding: 0; border: 1px solid #eee; border-radius: 12px; overflow: hidden; }
            .header { background: #004169; color: white; padding: 40px 20px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; letter-spacing: 4px; }
            .content { padding: 40px; background: #ffffff; }
            .footer { font-size: 11px; color: #999; text-align: center; padding: 30px; background: #f9f9f9; }
            .order-summary { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>NAGASIN.</h1>
            </div>
            <div class='content'>
                <p style='font-size: 16px;'>Bonjour <strong>" . $customerName . "</strong>,</p>
                <p style='font-size: 15px; color: #555;'>Merci pour votre commande sur notre boutique ! Votre paiement a été validé et nous allons commencer à traiter votre demande très prochainement.</p>
                
                <div class='order-summary'>
                    <h3 style='margin-top: 0; font-size: 14px; color: #004169;'>RÉSUMÉ DE LA COMMANDE #" . substr($orderId, -6) . "</h3>
                    <p style='margin-bottom: 0; font-size: 18px; font-weight: bold;'>" . number_format($total, 2, '.', '') . " €</p>
                    <p style='font-size: 12px; color: #666;'>Vous recevrez un nouvel email dès que votre commande passera en préparation.</p>
                </div>

                <hr style='border:none; border-top:1px solid #eee; margin:30px 0;'>
                <p style='font-size: 14px;'>Merci de votre confiance,<br><strong style='color: #004169;'>L'équipe Nagasin</strong></p>
            </div>
            <div class='footer'>
                Ceci est un email automatique de confirmation.<br>
                Nagasin Studio - na@dessinateur.net
            </div>
        </div>
    </body>
    </html>
    ";
    
    @mail($to, $subject, $htmlContent, $headers, "-f contact@nagasin.fr");

    echo json_encode(["status" => "success", "id" => $orderId]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to save order"]);
}
