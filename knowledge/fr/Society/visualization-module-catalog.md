---
title: 'Catalogue de modules de visualisation : dix façons de voir les données du logement à Taïwan'
description: "Exemples vivants des modules de visualisation d'articles de Taiwan.md — en utilisant de vraies données taïwanaises sur le logement, chaque module de visualisation tw-* est rendu une fois, à lire conjointement avec la syntaxe et les principes de conception de graph.md."
date: 2026-06-06
category: 'Society'
tags:
  [
    'visualisation de données',
    'justice du logement',
    'politique du logement',
    'données ouvertes',
  ]
subcategory: '人權與平等'
author: 'Taiwan.md'
readingTime: 8
featured: false
lastVerified: 2026-06-06
lastHumanReview: false
translatedFrom: 'Society/視覺化模組型錄.md'
sourceCommitSha: 'd540c3ae3'
sourceContentHash: 'sha256:672c83c08aa912fe'
sourceBodyHash: 'sha256:12d07dc9c8368b73'
translatedAt: '2026-06-07T00:37:31+08:00'
---

# Catalogue de modules de visualisation : dix façons de voir les données du logement à Taïwan

> **Aperçu en 30 secondes :** Cette page est un « exemple vivant » du système de visualisation de Taiwan.md — chacun des dix modules de visualisation d'articles est rendu une fois, en utilisant le même jeu de données réelles sur le logement à Taïwan (ratio prix du logement/revenu, logements sociaux nationaux, logements sociaux, comparaisons internationales). C'est le compagnon du guide éditorial [graph.md](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/graph.md) : **graph.md explique « quand utiliser lequel, comment bien faire, comment écrire la syntaxe », cette page vous montre directement « à quoi ça ressemble ».** Chaque module est rendu en HTML/SVG statiques, de sorte que les personnes, les lecteurs d'écran, Google et les robots d'indexation IA lisent tous les mêmes données — c'est précisément la raison pour laquelle nous avons choisi la visualisation statique plutôt que des graphiques interactifs.

Quand on écrit un article traitant de chiffres, le pire est de transformer les données en un empilement de paragraphes de nombres ; le lecteur décroche dès le troisième pourcentage. Le travail de visualisation consiste à inverser l'entropie d'une « prose numérique dense » pour en faire « une structure lisible d'un coup d'œil ».

Mais la visualisation chez Taiwan.md obéit à une discipline que les autres n'ont pas : **nous ne faisons que des visualisations « lisibles par les LLM ».** Un graphique interactif réalisé avec D3 ou Canvas est impressionnant, mais les robots d'indexation IA comme GPTBot, PerplexityBot ou ClaudeBot n'exécutent pas JavaScript — pour eux, ce graphique est une page blanche. Les graphiques que nous créons en HTML sémantique et SVG en ligne ont les données directement dans le code source, de sorte que les IA peuvent les lire et citer les données de première main de Taïwan dans six langues. **Une visualisation lisible par les LLM, c'est une visualisation souveraine.**

Les dix modules ci-dessous, du plus simple « un grand nombre » au « graphique linéaire multi-séries », sont présentés dans l'ordre. La syntaxe complète et les principes de conception se trouvent dans graph.md ; ici, on ne met qu'une phrase sur « ce que c'est et quand l'utiliser ».

## Grand chiffre tw-figure

Le type le plus simple et le plus percutant : mettre un chiffre spectaculaire en très grand, avec un avant-après pour raconter une transformation. Idéal comme « statistique marteau-pilon » d'ouverture.

```tw-figure
6,7 萬 → 87 萬 / 坪
Le prix de vente attribué en 1985 du complexe Chenggong à Taipei, devenu le prix moyen des agences immobilières en 2026 — même adresse, environ 13 fois plus cher
Plateforme d'agences immobilières basée sur les transactions réelles (Chenggong)
```

## Groupe de statistiques tw-stat

Quand un paragraphe contient trois ou quatre chiffres clés en parallèle, plutôt que d'en faire une longue phrase, disposez-les en ligne de cartes pour que le lecteur les parcoure d'un coup d'œil.

```tw-stat
174 891 unités | Logements sociaux construits directement par le gouvernement | 1976–1999
Plus de 390 000 unités | Volume total des logements sociaux au sens large | Jusqu'à l'abolition en 2015
84,4 % | Taux de propriété résidentielle à l'échelle nationale | 2024
```

## Carte comparative tw-versus

Comparaison point par point de deux systèmes, deux positions, ou deux états successifs. Couleur chaude à gauche, couleur froide à droite, un « vs » au milieu, pour que les différences se lisent ligne par ligne.

```tw-versus
Logements sociaux taïwanais | Logements sociaux de Hong Kong (居屋)
Subvention gouvernementale, vendus à prix réduit aux résidents | Subvention gouvernementale, vendus à prix réduit aux résidents
Revente au prix du marché possible après un an d'occupation | Revente sur le marché libre après « compensation du prix du terrain » (補地價)
La plus-value revient presque entièrement au particulier | La plus-value est récupérée par le Trésor public au prorata de la remise initiale
Le parc public est perdu en une fois | L'effort public est récupéré
```

## Barres de proportion tw-bars

Comparaison ou classement de quelques catégories : la longueur des barres horizontales est automatiquement mise à l'échelle selon les valeurs, la valeur maximale occupant toute la largeur. N'oubliez pas d'ajouter une dernière ligne `來源：` dans le module de données — elle sera automatiquement transformée en note de source en dessous.

```tw-bars
National 2014 | 8,41
National 2024 | 10,76
Taipei 2024 | 16,60 | Pic historique
Source : Plateforme d'information immobilière du Ministère de l'Intérieur, Centre de recherche immobilière de l'Université NCCU
```

## Diagramme en carrés tw-waffle

Composition d'un tout en proportions partielles : cent cases représentent cent pour cent, ce qui est plus intuitif qu'un diagramme circulaire — on peut littéralement compter les cases. Convient aux données où « chaque catégorie représente combien » avec un total avoisinant 100.

```tw-waffle
Composition du parc résidentiel de Vienne (2023)
Logements sociaux municipaux | 21,9
Logements sociaux à but non lucratif | 21,4
Logements en propriété | 20,4
Location privée | 36,3
Source : Statistiques sur le logement de la municipalité de Vienne (Stadt Wien)
```

## Axe politique tw-timeline

Chronologie des moments clés d'un système ou d'une politique, reliés par une chronologie à nœuds. Notez qu'il s'agit d'un « support visuel » — c'est différent des sous-titres du texte principal qui ne peuvent pas être chronologiques (utiliser « En 1975… » comme titre).

```tw-timeline
1975 | Entrée en vigueur de la loi sur les logements sociaux | Le gouvernement construit et vend, avec un « critère d'acheteur » en circuit fermé, la subvention ne s'échappe pas
2002 | Le mur est aboli | Réforme annulant les restrictions sur le profil des acheteurs — les logements sociaux peuvent être revendus à n'importe qui après un an d'occupation
2015 | Abrogation de la loi sur les logements sociaux | Raison officielle : le taux de propriété atteint 85 %, orientation vers des logements sociaux locatifs uniquement
2026 | Taoyuan remet la barrière en place | Logements abordables : la revente ne peut pas dépasser le prix d'acquisition initial
```

## Carte de citation tw-quote

Quand une phrase résume à elle seule la tension centrale de l'article, agrandissez-la en carte de citation. Les guillemets ne doivent pas être ajoutés manuellement — le module les ajoute. La citation doit être textuelle et vérifiable.

```tw-quote
Une maison valant 30 millions de dollars taïwanais est devenue une maison valant 60 à 70 millions de dollars taïwanais… C'est voler les pauvres pour enrichir les riches, l'État dépense pour aider les riches à rénover leurs maisons
Lin Chih-qun | Avocat, critique en 2025 d'un projet de « rénovation urbaine du complexe Chenggong financé par l'État »
```

## Bandeau de sources tw-source

Regroupez les sources de données d'une analyse en un discret chip, placé à côté du paragraphe. La crédibilité fait partie du travail de curation — les médias numériques taïwanais oublient souvent de citer leurs sources ; c'est un domaine où nous pouvons faire mieux.

```tw-source
Plateforme d'information immobilière du Ministère de l'Intérieur, Registre des transactions réelles, Centre de recherche immobilière de l'Université NCCU, Journal officiel du Parlement, Commission du logement de Hong Kong
```

## Graphique linéaire tw-line

Pour les tendances sur quatre points temporels ou plus, les données sont tracées en graphique linéaire en SVG en ligne, avec les bornes de l'axe y indiquées pour que le lecteur voie l'étendue. Le point le plus crucial — il **génère automatiquement un tableau de données masqué**, permettant aux lecteurs d'écran et aux robots IA d'accéder aux données brutes. Le graphique est fait pour les humains, le tableau est fait pour les machines — les deux proviennent de la même source.

```tw-line
Décennie d'augmentation du ratio prix du logement/revenu national (en multiples)
Année | National
2014 | 8,41
2016 | 9,32
2018 | 8,57
2020 | 9,20
2022 | 9,61
2024 | 10,76
Source : Centre de recherche immobilière de l'Université NCCU, Plateforme d'information immobilière du Ministère de l'Intérieur
```

## Carte thermique tw-heatmap

Comparative matricielle région×indicateur ou année×catégorie. Chaque colonne est normalisée individuellement en intensité de couleur — plus le chiffre est grand, plus la couleur est chaude. C'est intrinsèquement un tableau HTML, donc naturellement lisible par les IA — c'est aussi pourquoi une carte thermique vaut mieux qu'« une image colorée » dans notre système.

```tw-heatmap
Comté/Ville | Ratio prix du logement/revenu (multiples) | Taux de charge hypothécaire (%)
Taipei | 16,60 | 63,9
Nouveau Taipei | 13,03 | 56,9
Taichung | 11,11 | 48,0
Taoyuan | 9,0 | 40,0
Source : Plateforme d'information immobilière du Ministère de l'Intérieur
```

## Comment utiliser ces modules

Chaque module s'écrit dans le Markdown de l'article sous forme de bloc ` ```tw-* `, avec des colonnes séparées par `|`, et est automatiquement converti en ce que vous voyez ci-dessus lors de la compilation — l'auteur n'a besoin d'écrire aucun HTML ni JavaScript. La syntaxe complète, les indications sur quand utiliser lequel, comment gérer les couleurs et les axes pour ne pas induire en erreur, ainsi que la liste de vérification de la visualisation avant publication, se trouvent dans [graph.md](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/graph.md).

Ce système s'inspire de la philosophie éditoriale du média de narration visuelle [The Pudding](https://pudding.cool/) — la question avant les données, la conclusion doit être claire, la citation des sources est protagoniste — mais il a évolué pour devenir un organe propre à Taiwan.md : statique, multilingue, lisible par les IA. Le contexte complet de la conception est documenté dans le [Rapport de conception du système de visualisation d'articles](https://github.com/frank890417/taiwan-md/blob/main/reports/article-visualization-design-2026-06-06.md).

Pour voir comment ces modules s'intègrent dans le récit d'un vrai article de fond, lisez [Logements sociaux nationaux et justice du logement](/society/國宅與居住正義) — la plupart des données de cette page proviennent des recherches de cet article.

**Pour aller plus loin :**

- [Logements sociaux nationaux et justice du logement](/society/國宅與居住正義) — L'histoire complète derrière ces données du logement : comment les logements sociaux sont passés de logements abordables à des ascenseurs patrimoniaux, source de données de la plupart des modules de cette page
- [Logements sociaux et justice du logement](/society/社會住宅與居住正義) — La voie des logements sociaux « locatifs uniquement » après 2016
- [Crise de la dénatalité à Taïwan](/society/台灣少子化危機) — Ne pas pouvoir acheter de logement et ne pas pouvoir avoir d'enfants : l'autre face de la justice intergénérationnelle

## Références

[^1]: [Plateforme d'information immobilière du Ministère de l'Intérieur](https://pip.moi.gov.tw/Publicize/Info/E1050) — Statistiques officielles sur le logement : ratio prix du logement/revenu, taux de charge hypothécaire, taux de propriété résidentielle, etc.

[^2]: [Centre de recherche immobilière de l'Université NCCU](https://rer.nccu.edu.tw/article/detail/2210058908437) — Indicateurs annuels de capacité d'achat immobilier, source de la série nationale du ratio prix du logement/revenu utilisée dans le graphique linéaire et les barres de proportion de cette page.

[^3]: [Communiqué de presse du Yuan exécutif sur l'abrogation de la loi sur les logements sociaux](https://www.ey.gov.tw/Page/9277F759E41CCD91/d4afaf10-ece5-4b4f-9482-35ce16bdc657) — Données officielles sur le nombre cumulé de logements sociaux (environ 390 000 unités), etc.

## Crédits des images

Cet article utilise 1 image sous licence Creative Commons, mise en cache dans `public/article-images/society/` :

- [Skyline résidentiel de Taipei (vue depuis le Xiangshan)](https://commons.wikimedia.org/wiki/File:20260204_Taipei,_Taiwan_Skyline.jpg) — Photo : Heeheemalu, 2026, CC BY-SA 4.0 (hero)
