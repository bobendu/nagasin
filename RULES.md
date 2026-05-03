# Règles du projet Nagasin

## Identité Visuelle
- **Aesthétique** : Studio na! / Art Gallery (Style dessinateur.net).
- **Palette** : Fond blanc/papier, Accents Bleu Logo (**#004169**), Gris Anthracite.
- **Composants** : **Coins carrés (0px)** obligatoires pour tout élément corporate/admin.
- **Typographie** : "Outfit" pour les titres, sans-serif propre pour le corps.

## Architecture & Data
- **Édition** : Full WYSIWYG (Édition directe sans clic préalable).
- **Validation** : Système obligatoire de **Brouillon (Draft)**. Tout changement doit être validé via le bouton "PUBLIER" pour être live.
- **Persistance** : 
    - **Frontend** : Utilisation du `localStorage` uniquement pour les sessions de brouillon (Draft).
    - **Backend** : API PHP (`/api/`) gérant des fichiers JSON sécurisés dans `/data/`.
    - **Synchronisation** : Les données publiées (catalogue, commandes) doivent impérativement transiter par le serveur pour être identiques sur tous les appareils.

## 🛡️ Sécurité & Emails
- **Sanitization** : Toutes les entrées client (Nom, Adresse, etc.) doivent être nettoyées via `sanitizeString` avant enregistrement.
- **Emails (Délivrabilité)** : L'envoi via PHP `mail()` doit impérativement utiliser une adresse `@nagasin.fr` en expéditeur (`From`) et inclure le paramètre `-f` pour éviter le spam.
- **Accès Admin** : Protégé par `X-Admin-Password` dans les en-têtes API (basé sur `VITE_ADMIN_PASSWORD`).

## 🔐 Accès Techniques
- **GitHub** : `bobendu` / `benoit.baudu@free.fr` / `Z0b1-Hu8`
- **Blog Admin** : `dessinateur.biz/blog` / `i2w!aB%q3KkavEo8`
