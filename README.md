# ComiYa — Del mercado a tu puerta

MVP de un « mercado à domicile » pour les condominios de Lima : produits frais du mercado (poulet, viande,
poisson, légumes, herbes, fruits), **25 % moins chers que le supermarché (Tottus)**, livrés au jour et à
l'heure choisis par le client — y compris en commande fixe hebdomadaire (« tous les mardis à 8h15 »).

L'interface client est en espagnol (Pérou).

## Ce que fait l'application

| Pour le client | Pour l'équipe (`/admin`) |
| --- | --- |
| Catalogue avec prix supermarché barré et prix ComiYa | Paiements à vérifier (numéro d'opération Yape/Plin) en un clic |
| Panier, choix du jour + de l'heure de livraison | Tournée du jour par condominio, triée par heure |
| Commande fixe hebdomadaire (pause / suppression) | **Liste de courses** agrégée pour le marché |
| Paiement Yape ou Plin (QR + numéro d'opération) | Modifier les prix supermarché / marquer « agotado » |
| Achat groupé par condominio + lien d'invitation WhatsApp | Créer des condominios et leurs liens d'invitation |
| Crédit (« saldo a favor ») automatique | Rendre du crédit (produit manquant ou abîmé) |
| Fiche produit : photo, prix, valeurs nutritionnelles, conservation, allergènes | |
| Recherche sans accents et avec synonymes (aguacate, cilantro, maíz…) | |
| Choix « si un produit manque » (remplacer / ne pas l'apporter / WhatsApp) | |
| « Volver a pedir » en un clic | |
| Installable sur l'écran d'accueil du téléphone + aperçu WhatsApp | |

### Règles métier (modifiables dans `src/config.ts`)

- **Prix** : prix Tottus − 25 %, arrondi à 10 céntimos vers le bas. Prix de référence relevés sur tottus.com.pe le
  10/10/2026 (Plaza Vea / Metro si Tottus n'avait pas le produit) dans `src/data/products.ts`, et modifiables
  ensuite depuis `/admin/precios` sans toucher au code.
- **Achat groupé** : plus il y a de foyers du même condominio qui commandent pour le même jour, plus la remise
  monte : 1+ → −25 %, 5+ → −27 %, 10+ → −29 %, 20+ → −30 %.
  Si des voisins s'ajoutent après ta commande, la différence est rendue en **saldo a favor** à la clôture
  (seulement sur les commandes payées) et déduite automatiquement de la commande suivante.
- **Livraison** : du lundi au samedi, de 7h00 à 20h00 par tranches de 15 min, clôture la veille à 20h00
  (heure de Lima), livraison gratuite, commande minimum S/ 30.
- **Commandes fixes** : générées automatiquement 3 jours avant la livraison (cron Vercel quotidien à 8h00
  Lima + à chaque visite de `/pedidos` ou `/admin`).
- **Admin** : les numéros listés dans `ADMIN_PHONES`, ou à défaut le **premier compte créé**.

## Déployer sur Vercel

1. Sur [vercel.com/new](https://vercel.com/new), importer le dépôt GitHub `wil-pe/ComiYa` → **Deploy**
   (aucun réglage à changer : Next.js est détecté tout seul).
2. Dans le projet Vercel : **Storage → Create Database → Neon (Postgres)** → la connecter au projet.
   `DATABASE_URL` est ajoutée automatiquement.
3. (Recommandé) **Settings → Environment Variables** : ajouter `AUTH_SECRET` (texte aléatoire long) et
   `ADMIN_PHONES` (ton numéro), plus les numéros Yape/Plin et WhatsApp (voir `.env.example`).
4. **Deployments → Redeploy**. Les tables se créent toutes seules à la première visite.
5. Créer ton compte sur le site : tu es admin → `/admin`.

## Intégrer les vrais QR Yape / Plin

Remplacer `public/qr/yape.svg` et `public/qr/plin.svg` par les QR de ton compte (ou changer le chemin dans
`PAYMENT_METHODS` de `src/config.ts` pour pointer vers un `.png`), puis définir `NEXT_PUBLIC_YAPE_PHONE`,
`NEXT_PUBLIC_PLIN_PHONE` et `NEXT_PUBLIC_PAYMENT_HOLDER`.

Le flux actuel : le client paie, saisit son numéro d'opération → statut « Pago en revisión » → tu vérifies
dans ton appli Yape/Plin et confirmes dans `/admin`.

## Photos et fiches produit

- Les photos sont dans `public/fotos` (WebP, 100 Ko max chacune) ; leurs auteurs et licences sont listés sur
  `/creditos` (`src/data/photo-credits.ts`). Les 4 photos Wikimedia (CC BY-SA) exigent ce crédit.
- Pour ajouter ou remplacer une photo : déposer le JPEG dans un dossier sous le nom du produit
  (ex. `palta.jpg`) puis `python3 scripts/fotos.py ce-dossier`. Un produit sans photo affiche son emoji.
- Valeurs nutritionnelles (`src/data/nutrition.ts`) : pour 100 g crus, tirées des *Tablas Peruanas de
  Composición de Alimentos* (INS-CENAN 2017) et, à défaut, de l'USDA FoodData Central.
- Conservation, allergènes et synonymes de recherche : `src/data/product-info.ts`.

## Développement local

```bash
npm install
cp .env.example .env.local   # mettre une DATABASE_URL Postgres
npm run dev
```

Stack : Next.js 16 (App Router, Server Actions), Tailwind CSS 4, Postgres via `postgres`, sessions JWT
(`jose`) en cookie httpOnly, mots de passe `bcryptjs`.
