# Données et performances d’un build

Le build exécute de nombreuses requêtes Symfony dans le même processus. Une
opération peu coûteuse en SSR peut devenir dominante lorsqu’elle se répète pour
chaque page : lecture de fichiers, parsing de frontmatter, tri de navigation,
construction d’un convertisseur ou chargement d’un catalogue complet.

## Construire un instantané pour le build

Charger et trier les données communes une seule fois, puis partager un instantané
immuable entre le provider et les contrôleurs. Indexer les pages par URL ou par
identifiant pour éviter de parcourir toute la collection à chaque consultation.
Réutiliser les outils coûteux qui supportent cette utilisation, comme le
convertisseur CommonMark du POC. Éviter de recharger le catalogue depuis une
méthode `page()` appelée pour chaque réponse.

Le catalogue de la documentation du bundle est construit à l’instanciation. `pages()`
retourne la liste déjà triée ; `page(url)` consulte son index. Pendant un build,
les sources représentent un instantané cohérent : leurs modifications ne sont
prises en compte qu’au prochain build. En SSR PHP classique, le nouveau kernel
et ses dépendances sont recréés à chaque requête ; les changements restent donc
visibles au rafraîchissement. Un worker HTTP persistant demande une stratégie
explicite de renouvellement de cet instantané.

Préparer aussi les listes par section et la position de chaque page dans cette
section. `navigation(url)` retrouve les voisines avec `indice - 1` et
`indice + 1`, puis donne à Twig uniquement les pages de la section active.
Le contrôleur ne refiltre pas le catalogue, et la sidebar desktop et mobile
ne reparcourent pas les sources des autres sections.

Les providers sont entièrement consommés avant le premier rendu. Ils doivent
éviter les requêtes répétées par élément : sélectionner les données nécessaires
en groupe et retourner les paramètres attendus par Symfony. La planification
reste une liste en mémoire ; tester aussi la consommation mémoire sur les gros
sites, particulièrement si le catalogue conserve le contenu complet des pages.

## Distinguer données communes et état de requête

Le moteur réinitialise les modules Symfony resettable après chaque page.
Implémenter `ResetInterface` pour les données liées à une requête : utilisateur,
locale mutable, buffers ou autres états qui pourraient contaminer la suivante.
Un instantané immuable commun au build n’a pas à être vidé après chaque page ;
un tel reset annulerait le bénéfice du chargement unique. Ne pas utiliser cette
exception pour conserver un état utilisateur ou une autre donnée mutable de requête.

## Mesurer le travail complet

Préciser le nombre de pages, leur taille, les formats exportés et les opérations
incluses : rendu, assets, sitemap et publication. Mesurer plusieurs builds et
rapporter la médiane. Séparer la compilation Vite du build PHP.

Pour mesurer le cache Symfony froid, supprimer uniquement le cache prod du
projet de test avant chaque mesure. Chaque commande CLI démarre déjà un nouveau
processus PHP. Cette mesure ne vide pas le cache disque du système et ne simule
pas un serveur totalement neuf. Comparer aussi des builds avec cache chaud.

Le POC Vincle utilise 350 pages, dont 315 pages Lorem ipsum d’environ 1 700 mots,
et exporte 701 réponses HTML, Markdown et TXT. Avant le chargement unique du
catalogue, les médianes locales étaient 15,97 s avec cache Symfony supprimé et
16,05 s avec cache chaud. Ce résultat mesure l’application d’exemple entière ;
il ne constitue pas un benchmark isolé du moteur SSG.

Après le chargement unique du catalogue, son index par URL et la réutilisation
du convertisseur, trois builds dans les mêmes conditions donnent une médiane
de **1,07 s à froid** et **0,95 s à chaud**, soit environ 17 fois plus rapide
à chaud. Les 350 pages ont été vérifiées après export. Ces chiffres sont locaux
et ne prédisent pas les performances d’autres applications.

## Essai de charge : 10 000 pages supplémentaires

Le 12 octobre 2026, le POC Vincle a été testé avec 10 000 pages Lorem ipsum
d’environ 1 700 mots, en plus des 35 pages originales. Le build PHP avec cache
Symfony froid a publié **20 071 réponses en 233,04 s** : 10 035 HTML,
10 035 Markdown et `llms.txt`, auxquels s’ajoutent les assets et le sitemap.
La compilation Vite est exclue du chronométrage ; le cache disque du système
n’a pas été vidé. C’est une mesure unique, pas une médiane.

Le pic de mémoire résidente du processus PHP est **198,58 Mio** ; le pic de
mémoire allouée mesuré par PHP est **172 Mio**. La RAM résidente atteint environ
197 Mio au début du rendu puis reste presque stable jusqu’à la publication.
Le catalogue conserve toutes les sources en mémoire : cette mesure ne permet
pas de conclure à une consommation constante lorsque le nombre de pages augmente.
La configuration locale `memory_limit=-1` n’a pas été modifiée.

Les nombres de fichiers et d’entrées du sitemap ont été vérifiés, avec contrôle
du HTML et du Markdown des pages 1, 5 000 et 10 000. Les résultats sont conservés
dans [le relevé JSON](benchmarks/10000-pages.json) et
[les mesures RSS, échantillonnées toutes les 250 ms](benchmarks/10000-pages-rss.csv).
Ces mesures historiques proviennent du POC Vincle, retiré des exemples du bundle.

Le premier essai conservait un filtrage et une recherche des voisines par page,
ainsi que deux parcours de tout le catalogue dans Twig pour la navigation.
Un échantillon de 200 pages, avec le catalogue complet, a mesuré 0,74 s pour les
voisines et 4,46 s dans Twig, sur 6,10 s au total.

Après indexation des sections et des positions, le même build complet avec cache
Symfony froid publie les **20 071 réponses en 12,27 s**, soit **19 fois plus vite**.
Son pic RSS est **201 Mio**, et le pic alloué PHP **176 Mio**. Les liens voisins
ont été vérifiés pour les 10 035 entrées du catalogue, puis dans plusieurs HTML
exportés, y compris les extrémités de la section Lorem ipsum. La compilation
Vite reste exclue et le cache disque reste chaud ; chaque résultat est une seule
mesure locale. Voir [le résultat après indexation](benchmarks/10000-pages-indexed.json)
et [son relevé RSS](benchmarks/10000-pages-indexed-rss.csv).

## Comparaison avec la documentation Vincle : Vite inclus

Le comparatif local du 12 octobre 2026 inclut désormais **Vite et le build SSG**,
depuis le lancement des commandes jusqu’à la publication. Les temps Vite sont
ceux de la commande entière, et pas seulement le temps de compilation affiché
dans son log. Chaque pipeline a été mesuré une fois, successivement, sur le même
AMD Ryzen 7 PRO 8840HS, avec Bun 1.4.3, Node 24.21.0 et PHP 8.5.4.

| Phase | POC Symfony | Documentation Vincle originale |
| --- | ---: | ---: |
| Vite | 6,63 s | 6,54 s |
| SSG, traitements annexes et publication | 11,75 s | 50,89 s |
| **Build complet** | **18,38 s** | **57,44 s** |
| Pic RSS de tout le pipeline | 677,61 Mio | 5 576,80 Mio |
| Pic RSS pendant le SSG | 200,23 Mio | 5 576,80 Mio |

La mémoire est ici la somme du RSS de la commande et de ses descendants,
échantillonnée toutes les 100 ms. C’est un pic observé ; les anciennes mesures
du seul processus PHP ne couvrent pas la compilation Vite.

La copie isolée de Vincle utilise son moteur original et les 35 pages originales,
auxquelles s’ajoutent les 10 000 Lorem ipsum, byte pour byte identiques aux sources
du POC. Seule leur extension devient `.mdx`, attendue par le handler existant.
Le dépôt Vincle original n’a pas été modifié. Les 10 000 sorties HTML et Markdown
ont été contrôlées ; les deux sitemaps contiennent 10 035 entrées.

Cette comparaison mesure deux applications, avec des fonctions différentes.
Vincle compile du MDX, colore le code, construit une table des matières, un index
de recherche et `llms-full.txt`, entre autres fichiers supplémentaires. Son SSG
passe environ 7,29 s dans la découverte/compilation, 6,17 s dans le rendu,
15,19 s dans les traitements annexes et 21,53 s dans la publication. Son rendu
seul est donc rapide ; le total ne permet pas de classer les moteurs de rendu.

Les processus sont neufs, le cache Symfony prod est supprimé, et le moteur
Vincle nettoie son cache MDX compilé. Le cache disque système n’est pas vidé.
La copie Vincle n’a pas d’historique Git : les appels de date de dernière
modification retournent donc `null`. Les chemins HTML diffèrent également :
fichiers `.html` pour Vincle, répertoires `index.html` pour Symfony.

Les [résultats et conditions du comparatif](benchmarks/10000-pages-full-comparison.json)
et les relevés RSS [Symfony](benchmarks/10000-pages-full-symfony-rss.csv) et
[Vincle](benchmarks/10000-pages-full-vincle-rss.csv) sont conservés dans le dépôt.

## Charger les styles en développement

Une feuille CSS importée uniquement depuis un module JavaScript peut arriver
après le premier affichage du HTML. Pour un site de documentation sans code
JavaScript applicatif, déclarer la feuille CSS comme entrée Vite et utiliser
`reprise_entry_link_tags` dans le `<head>`. Les exemples de documentation utilisent
ce chargement direct ; `reprise_entry_script_tags` conserve le client HMR en dev.
