<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$to = isset($_GET['email']) ? $_GET['email'] : "benoit.baudu@free.fr";
$subject = "Test de messagerie Nagasin - " . date('Y-m-d H:i:s');
$message = "Ceci est un test d'envoi d'e-mail de diagnostic depuis le serveur de production de Nagasin.\nSi vous recevez ce message, le service mail de base fonctionne.";

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-type: text/plain; charset=UTF-8\r\n";
$headers .= "From: Nagasin <contact@nagasin.fr>\r\n";
$headers .= "Reply-To: na@dessinateur.net\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $message, $headers, "-f contact@nagasin.fr");

echo json_encode([
    "sent" => $sent,
    "to" => $to,
    "last_error" => error_get_last()
]);
