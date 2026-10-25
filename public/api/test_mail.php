<?php
// Neutralisation définitive du script de test
@unlink(__FILE__);
http_response_code(410);
header('Content-Type: application/json');
echo json_encode([
    "status" => "disabled",
    "message" => "Ce script de test a été neutralisé et supprimé."
]);
exit;
