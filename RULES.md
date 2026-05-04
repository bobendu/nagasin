# Règles du projet Nagasin

## Identité Visuelle
- **Aesthétique** : Studio na! / Art Gallery (Style dessinateur.net).
- **Palette** : Fond blanc/papier, Accents Bleu Logo (**#004169**), Gris Anthracite.
- **Composants** : **Coins carrés (0px)** obligatoires pour tout élément corporate/admin.
- **Typographie** : "Outfit" pour les titres, sans-serif propre pour le corps.

## 🏗️ Architecture Logicielle
- **Modularité** : Aucun fichier React ne doit dépasser 500 lignes. Les composants complexes (Formulaires, Sommaires) doivent être extraits dans `src/components/`.
- **Typage** : Tous les types partagés doivent être définis dans `src/types/index.ts`. Utiliser impérativement `import type` pour les imports de types.
- **Sécurité des APIs** :
    - `/api/save_order.php` : Enregistrement et email de confirmation automatique.
    - `/api/update_order.php` : Mise à jour de statut et email de suivi.
    - `/api/catalog.php` : Source de vérité pour le catalogue public.

## 🛡️ Sécurité & Emails
- **Sanitization** : Utilisation systématique de la fonction `sanitize()` avant toute persistance ou envoi.
- **Emails (Délivrabilité)** : Utilisation exclusive de l'adresse `contact@nagasin.fr` (ou toute adresse valide créée sur le Manager OVH) avec le paramètre `-f` obligatoire.
- **Accès Admin** : Authentification via header `X-Admin-Password`.

## 🔐 Accès Techniques
- **GitHub** : `bobendu` / `benoit.baudu@free.fr` / `Z0b1-Hu8`
- **Blog Admin** : `dessinateur.biz/blog` / `i2w!aB%q3KkavEo8`

## 💎 Préceptes de Développement (Crucial)
- **Non-Régression Absolue** : Pour chaque nouvel ajustement ou correctif, il est impératif de veiller à ne JAMAIS détruire ce qui est déjà en place et fonctionnel. Toute modification doit respecter l'intégrité technique et visuelle des fonctionnalités existantes.
