---
title: "Contrat des pages et du déploiement"
---

# Contrat des pages et du déploiement

- Les sorties exportées doivent accepter GET et répondre HTTP 200 avec le type MIME attendu par leur format.
- `/` devient `index.html`, `/article` et `/article/` deviennent `article/index.html`,
  et `/about.html` reste `about.html`. Une collision entre deux sorties, une sortie et
  un asset public, ou avec `sitemap.xml` fait échouer le build.
- Redirections, réponses streamées/binaires, cookies, sessions, queries et routes
  sur une autre origine sont refusés. Les routes non sélectionnées restent SSR.
- Les chemins avec traversée, segments cachés ou encodages ambigus sont refusés.
  Les scripts publics et les liens symboliques ne sont pas copiés.
- La requête principale possède l’attribut `_ssg=true`. Les modules Symfony
  resettable sont réinitialisés après chaque rendu ; les modules applicatifs qui
  gardent un état doivent implémenter `ResetInterface`. Le reset et la
  restauration du contexte sont tentés indépendamment. Si rendu et nettoyage
  échouent, l’erreur de rendu reste prioritaire ; un échec de nettoyage seul
  fait aussi échouer le build.
- Les pages doivent être publiques et indépendantes d’un utilisateur. Le bundle
  ne peut pas détecter une personnalisation applicative qui n’utilise ni cookie
  ni session. `kernel.terminate` n’est pas exécuté : les traitements différés
  (e-mails, messages Messenger…) ne partent pas pendant un build.
- `sitemap.xml` est réservé et généré quand au moins une page y est listée.
  Au-delà de 50 000 URL ou 50 Mio de XML non compressé, il devient un index
  pointant vers `sitemap-1.xml`, `sitemap-2.xml`, etc. Le build incrémental reste hors périmètre.

Déployer uniquement le contenu de `var/static` sur l’hébergement statique.
Configurer celui-ci pour servir les fichiers `index.html` dans les répertoires (et les URL sans slash final). Les
formulaires POST, l’authentification et les
fonctionnalités dynamiques nécessitent un backend accessible séparément.
Les en-têtes HTTP du SSR ne sont pas reproduits dans les fichiers : configurer
cache, CSP et autres en-têtes sur l’hébergeur. Pour les assets hashés, utiliser
un cache long immutable ; pour le HTML, un cache court ou une revalidation.

## Servir le site statique

Chaque page HTML est écrite en `<chemin>/index.html` ; les autres formats et les
URL avec extension restent des fichiers simples. Pour une page d’erreur, exporter
une route `/404.html` qui répond 200 avec le contenu de l’erreur, hors sitemap :

```php
#[Route('/404.html', name: 'not_found', methods: ['GET'])]
#[StaticPage(sitemap: false)]
public function notFound(): Response { /* ... */ }
```

Caddy :

```caddyfile
mon-site.fr {
    root * /var/www/site
    encode zstd gzip
    file_server
    handle_errors {
        rewrite * /404.html
        file_server
    }
}
```

nginx :

```nginx
server {
    server_name mon-site.fr;
    root /var/www/site;
    location / {
        try_files $uri $uri/ =404;
    }
    error_page 404 /404.html;
}
```

Apache (`.htaccess` à la racine) :

```apache
DirectoryIndex index.html
ErrorDocument 404 /404.html
```

GitHub Pages et Cloudflare Pages servent `index.html` dans les répertoires et
`404.html` pour les pages absentes, sans configuration. Avec GitHub Pages,
déployer par un workflow : l’artefact est servi tel quel, sans Jekyll.

```yaml
# .github/workflows/deploy.yml (permissions pages: write et id-token: write)
- run: npm run build
- run: php bin/console ssg:build
  env: { APP_ENV: prod, APP_DEBUG: '0' }
- uses: actions/upload-pages-artifact@v5
  with: { path: var/static }
- uses: actions/deploy-pages@v5
```

Cloudflare Pages déploie le répertoire avec `npx wrangler pages deploy var/static`.
Pour un site publié sous un chemin de base, adapter `root` ou l’emplacement
de publication à ce chemin.
