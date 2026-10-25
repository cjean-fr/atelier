---
title: "Essayer l’exemple"
---

# Essayer l’exemple

Depuis la racine du dépôt :

```bash
composer install
npm ci --prefix examples
export APP_SECRET="une-cle-locale-pour-la-demo"
npm run build --prefix examples
APP_ENV=prod APP_DEBUG=0 php examples/bin/console cache:clear
APP_ENV=prod APP_DEBUG=0 php examples/bin/console ssg:generate --dry-run
APP_ENV=prod APP_DEBUG=0 php examples/bin/console ssg:generate
```

Le résultat se trouve dans `examples/var/static/` : accueil, deux articles, JSON, texte, Markdown,
assets hashés et `sitemap.xml`. Le domaine de l’exemple est `https://example.com` ;
modifier `examples/config/packages/static_site.yaml` avant de déployer.

Pour le développement, ouvrir deux terminaux avec `APP_SECRET` défini :

```bash
APP_ENV=dev APP_DEBUG=1 php -S 127.0.0.1:8000 -t examples/public
```

```bash
npm run dev --prefix examples
```

Ouvrir `http://127.0.0.1:8000`. Les routes sont rendues par Symfony ; Vite fournit
le HMR. Arrêter Vite et relancer `npm run build` avant un export, puis vider le
cache prod si les métadonnées Vite ont changé.
