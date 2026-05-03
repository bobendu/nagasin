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
