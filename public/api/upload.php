<?php
// Neutralisation définitive du script d'upload orphelin
@unlink(__FILE__);
http_response_code(410);
header('Content-Type: application/json');
echo json_encode([
    "status" => "disabled",
    "error" => "Ce script d'upload non sécurisé a été définitivement neutralisé et supprimé."
]);
exit;
