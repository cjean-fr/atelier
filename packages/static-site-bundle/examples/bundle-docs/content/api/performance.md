---
title: "Données et performances"
---

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
