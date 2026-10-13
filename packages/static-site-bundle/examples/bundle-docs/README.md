# Documentation du bundle

Exemple autonome dans ce dépôt, avec le design Vincle adapté à Twig et du Markdown PHP.
Sources dans `content/`, navigation précédente/suivante selon `navigation.json`.

Depuis la racine du dépôt :

```bash
composer install
npm ci --prefix examples/bundle-docs
npm run build --prefix examples/bundle-docs
APP_ENV=prod APP_DEBUG=0 APP_SECRET=local-docs-secret php examples/bundle-docs/bin/console cache:clear
APP_ENV=prod APP_DEBUG=0 APP_SECRET=local-docs-secret php examples/bundle-docs/bin/console ssg:build
APP_ENV=prod APP_SECRET=local-docs-secret php examples/bundle-docs/tools/verify.php
```

En dev, lancer Vite et le serveur PHP dans deux terminaux :

```bash
npm run dev --prefix examples/bundle-docs -- --host 127.0.0.1 --port 5180 --strictPort
APP_ENV=dev APP_SECRET=local-docs-secret php -S 127.0.0.1:8089 -t examples/bundle-docs/public examples/bundle-docs/public/index.php
```

Le contenu Markdown et les templates sont lus à la requête suivante. Les sources
Markdown sont locales et fiables ; le convertisseur autorise leur HTML.
L’export se trouve dans `examples/bundle-docs/var/static/`. Remplacer le domaine
réservé `https://static-site.example` avant tout déploiement réel.

Les styles proviennent de Vincle sous licence MIT : voir `VINCLE-LICENSE`.

La coloration syntaxique est fournie par Highlight.js, avec uniquement les
langages utiles. Le thème clair est inclus dans l’entrée CSS chargée dans le
head ; le script de coloration est une entrée Vite séparée. Les blocs restent
lisibles sans JavaScript et les sorties Markdown conservent leurs bytes.
