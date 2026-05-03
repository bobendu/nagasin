# Journal du projet Nagasin
> [!IMPORTANT]
> **RÈGLE D'INTÉGRITÉ :** Ne jamais supprimer d'informations techniques ou de notes existantes dans ce journal. Les nouveaux ajouts se font à la suite.

## 2026-04-29 : Initialisation du projet
- Création du projet avec Vite + React + TypeScript.
- Installation des dépendances : `lucide-react`, `framer-motion`.
- Mise en place du design system (thème sombre, glassmorphism).
- Création de la Landing Page avec :
  - Navbar fixée avec effet flou.
  - Section Hero immersive avec image de fond générée par IA.
  - Grille de produits préliminaire avec animations d'entrée.
- Configuration de la typographie (Police "Outfit").

## 2026-04-29 : Mise en place du déploiement continu
- Initialisation de Git localement.
- Création du workflow GitHub Actions (`.github/workflows/deploy.yml`).
- Préparation de la structure pour déploiement automatique sur OVH Mutualisé (Pro).

## 2026-04-29 : Mode Travaux & Direction Artistique
- Mise en place de la direction artistique "Studio na!" (Style dessinateur.net).
- Création de la version "Boutique en travaux" sur `App.tsx` pour le site public.
- Sauvegarde du code de la boutique réelle dans `StoreApp.tsx` pour le développement local.
- Déploiement du panneau de travaux sur `nagasin.fr`.

## 2026-04-29 : Itération Design "Sketchy Studio"
- Implémentation du logo officiel "na!" (Blanc sur Bleu).
- Création de bordures irrégulières via filtres SVG pour un aspect dessiné main.
- Ajout d'une texture de papier au fond du site.
- Structuration du catalogue de livres avec des éléments de notation et des badges.
- Basculement de `App.tsx` vers la boutique pour le développement local.
## 2026-04-30 : L'Idée de Ouf - Le "Browser" de Tirages (Finalisé)
- Création du composant `CustomPrintCard.tsx` avec navigateur intégré.
- Implémentation du **"Magic Click"** : Sélection instantanée par clic sur le blog.
- Ajout d'une barre de recherche thématique intégrée.
- Refonte complète du **Backoffice (Admin)** : 
    - Onglet **Commandes** avec détails clients et historique.
    - Fonction **"Imprimer le dessin"** : Préparation automatique de l'image isolée pour impression.
- Intégration du formulaire de livraison dans le tunnel d'achat.
## 2026-05-03 : Architecture Admin Modulaire & WYSIWYG
- **Révolution de l'Admin** : Passage d'un backoffice séparé à une expérience intégrée "Live Editor".
- **Composants Modulaires** :
    - `AdminToolbar` : Barre de commande flottante pour l'accès rapide.
    - `AdminDashboard` : Overlay de pilotage avec KPIs (CA, Commandes, Clients).
    - `EditableProductCard` : Système WYSIWYG pour éditer les produits directement sur la grille publique.
- **Correctifs Responsivité** :
    - Refonte complète de la page Maintenance pour mobile (Media Queries, layout adaptatif).
    - Optimisation de la barre admin pour les petits écrans.
- **Nettoyage** : Migration des styles inline vers `index.css` pour une meilleure maintenance.
- **Identité Visuelle** : Standardisation sur le bleu logo exact `#004169` et suppression des arrondis (Coins carrés `0px`).

## 2026-05-03 : Version 1.2 - Full WYSIWYG & Sécurité de Publication
- **Édition Directe (Full WYSIWYG)** : Suppression de l'étape intermédiaire "Éditer". Les produits sont désormais des formulaires de saisie directe dès que le mode admin est actif.
- **Système de Brouillon (Draft)** :
    - Les modifications sont sauvegardées en local (`catalog_draft`).
    - Ajout d'un bouton **PUBLIER** dans la toolbar pour valider les changements et les rendre visibles aux clients.
- **Optimisation Panier** : Déplacement de l'accès panier vers un bandeau fixe (Sticky) en bas de page pour améliorer le taux de conversion.
- **Passage Secret** : Ajout d'un lien discret sur le point final du copyright pour accéder à l'administration sans URL visible.
- **Responsivité Avancée** : Refonte du `CustomPrintCard` pour un affichage parfait sur mobile (empilement vertical et zones de texte extensibles).
- **Passage Secret (Amélioration)** : Implémentation d'un déclencheur sur le logo (5 clics) pour accéder à la boutique sans lever le mode maintenance public.

## 2026-05-03 : Version 0.2.0 - Parcours Client Optimisé
- **Fluidité d'Achat** : Ajout d'une notification visuelle sur le bandeau panier lors de l'ajout d'un article, permettant au client de continuer ses achats sans interruption (le panier ne s'ouvre plus automatiquement).
- **Tunnel de Commande en 2 Étapes** : 
    - **Étape 1 (Panier)** : Revue des articles et gestion des dédicaces avec bouton "Continuer mes achats" explicite.
    - **Étape 2 (Confirmation)** : Séparation du formulaire de livraison et du récapitulatif final pour une meilleure clarté avant validation.
- **Micro-animations** : Ajout d'animations Framer Motion sur le bandeau panier pour confirmer visuellement l'ajout d'un produit (changement de couleur et pulsation).

## 2026-05-03 : Version 0.3.0 - Intégration Paiement & Dash Admin
- **Tunnel d'Achat Complet** : 
    - Implémentation du passage de la livraison au paiement.
    - Intégration de **Stripe** via `@stripe/react-stripe-js` pour une expérience de paiement sécurisée et professionnelle.
- **Gestion des Commandes** :
    - Dispatch automatique des commandes payées vers le dashboard administrateur.
    - Ajout du suivi des **IDs de transaction Stripe** pour chaque commande.
- **Dashboard Admin (V2)** : 
    - Refonte visuelle de la liste des commandes pour inclure les statuts de paiement (Payée/En attente).
    - Amélioration des fiches d'expédition avec icônes et typographie soignée.
    - Support de l'impression des tirages personnalisés avec un nouveau bouton d'accès rapide.

## 2026-05-03 : Version 0.4.0 - Persistance Serveur (Backend PHP)
- **Migration Data** : Passage du stockage local (`localStorage`) vers un stockage serveur sécurisé pour garantir l'intégrité des commandes.
- **API PHP Intégrée** : 
    - Création de `save_order.php` pour la réception sécurisée des commandes.
    - Création de `get_orders.php` avec authentification par en-tête pour l'administration.
- **Sécurité Serveur** : 
    - Isolation des données dans un dossier protégé par `.htaccess`.
    - Authentification croisée entre le frontend et le backend PHP via le token admin.
- **Hybride Dev/Prod** : Implémentation d'un système de "Fallback" intelligent permettant de continuer le développement en local (localStorage) tout en utilisant l'API réelle en production.
