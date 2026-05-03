<?php
header("Content-Type: text/plain");

$to = "na@dessinateur.net"; // On teste vers votre adresse
$subject = "Test Email Nagasin";
$message = "Si vous recevez ce message, c'est que la fonction mail() de votre serveur OVH fonctionne.";

$headers = "From: Nagasin Studio <no-reply@nagasin.fr>\n";
$headers .= "Reply-To: na@dessinateur.net\n";
$headers .= "Content-Type: text/plain; charset=UTF-8";

echo "Tentative d'envoi vers $to...\n";

if (mail($to, $subject, $message, $headers, "-f no-reply@nagasin.fr")) {
    echo "RÉSULTAT : SUCCÈS (Le serveur a accepté l'email)\n";
} else {
    echo "RÉSULTAT : ÉCHEC (Le serveur a refusé l'envoi)\n";
    echo "Conseil : Vérifiez que l'adresse no-reply@nagasin.fr existe bien dans votre manager OVH.";
}
