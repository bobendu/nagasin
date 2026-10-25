<?php
// Neutralisation définitive du script de sauvegarde orphelin
@unlink(__FILE__);
http_response_code(410);
header('Content-Type: application/json');
echo json_encode([
    "status" => "disabled",
    "error" => "Ce script de sauvegarde obsolète a été définitivement neutralisé et supprimé."
]);
exit;
