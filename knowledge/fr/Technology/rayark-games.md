---
title: "Rayark Games : l'empire musical fondé sur l'esthétique, et ses fissures de quatorze ans"
description: "En 2012, six jeunes diplômés de la faculté d'électrotechnique et d'informatique de NTU ont réuni 30 millions de TWD pour créer Cytus, qui a atteint la première place des classements dans 14 pays en un mois. Quatorze ans plus tard, ils ont eu l'animation Deemo, l'animation Implosion non livrée depuis onze ans, Sdorica entré en mode maintenance en février 2026, et le choix de sacrifier un employé après l'incident du code Morse ICE en 2020 pour préserver le marché chinois. L'esthétique a permis au monde de voir Rayark, mais elle l'a aussi fait trébucher dans chaque domaine qui n'était pas musical."
date: 2026-04-25
author: 'zaious'
category: 'Technology'
subcategory: '社群與數位文化'
tags:
  [
    'Rayark Games',
    'Rayark',
    'Cytus',
    'Deemo',
    'Sdorica',
    'jeu musical',
    'jeu taïwanais',
    'You Mingyang',
    'Zhong Zhiyuan',
    'ICE',
    'code Morse',
    'Implosion',
  ]
readingTime: 16
lastVerified: 2026-05-25
lastHumanReview: false
featured: false
translatedFrom: 'Technology/雷亞遊戲.md'
sourceCommitSha: 'cf392a846'
sourceContentHash: 'sha256:3a0d54cbb0e498bb'
sourceBodyHash: 'sha256:55b72a98b6a433ac'
translatedAt: '2026-05-26T05:10:58+08:00'
---

> **Aperçu en 30 secondes :** En septembre 2011, six jeunes diplômés de la faculté d'électrotechnique et d'informatique de l'Université nationale de Taïwan (NTU) ont fondé Rayark Games au nord de Jinshan à Taipei, avec un capital de 30 millions de TWD et une équipe de 16 personnes. En janvier 2012, Cytus a été publié sur iOS et a atteint la première place des classements dans 4 pays en un mois. Puis Deemo a atteint le classement japonais Oricon, Implosion a remporté le titre de meilleur jeu iOS de l'année 2015, et VOEZ est devenu un jeu de lancement pour la Nintendo Switch. Quatorze ans plus tard, Rayark a lancé plus de dix jeux et dépassé 130 millions de téléchargements dans le monde, mais les mots-clés qui l'entourent sont passés de « génie » à « dommage ». Après huit ans de lutte, Sdorica est officiellement entré en mode maintenance en février 2026, l'animation Implosion n'a toujours pas été livrée depuis le financement Kickstarter de 2015, et après l'incident du code Morse ICE en 2020, Rayark a modifié ses jeux pour se conformer au marché chinois. L'esthétique leur a permis d'être vus par le monde, mais elle les a aussi fait trébucher dans chaque domaine qui n'était pas musical.

---

## Ce qu'une borne d'arcade leur a appris

![Logo officiel de Rayark Inc., identité visuelle utilisée depuis 2012, lettre R blanc sur fond rouge](/article-images/technology/rayark-logo-2012.png)
_Logo officiel de Rayark Inc. Source : [English Wikipedia File:Logo of Rayark Inc.png](https://en.wikipedia.org/wiki/File:Logo_of_Rayark_Inc.png). Usage loyal à des fins éditoriales._

L'histoire de Rayark commence par un échec.

En 2008, You Mingyang était encore en première année de master à l'Institut des médias numériques de NTU. Avec deux amis, il a fondé « Hypaa Studio » à l'université et développé THEIA, un jeu musical sur écran tactile pour borne d'arcade[^kopu]. La même année, le coréen PENTAVISION a lancé DJ Max Technika sur bornes d'arcade, un jeu au gameplay similaire à THEIA, mais qui l'a largement surpassé en qualité musicale, design d'interface et finition globale[^pentavision-wiki].

« On pensait que si le gameplay était amusant, ça se vendrait, mais la réaction du marché nous a appris que les graphismes et la musique étaient importants. » a raconté You Mingyang a posteriori[^kopu].

Cette phrase est devenue la logique fondamentale de tous les produits ultérieurs de Rayark : la jouabilité n'est que la base, l'esthétique est le fossé défensif.

Trois ans plus tard, en septembre 2011, l'équipe a fondé Rayark Games au nord de Jinshan à Taipei, avec un capital de 30 millions de TWD, une équipe de 16 personnes, et a complètement déplacé son focus des bornes d'arcade vers les plateformes mobiles[^rayark-wiki]. Les six cofondateurs étaient Zhong Zhiyuan, You Mingyang, Zhang Shiqun, Xie Changyan, Yang Shanyong et Li Yongting. Cinq venaient du département d'informatique de NTU (Yang Shanyong B91, You Mingyang et Xie Changyan B92), et un venait de l'Institut de génie des télécommunications de NTU (Zhong Zhiyuan)[^csiecomm-2013][^rayark-wiki].

> **💡 Le saviez-vous ?**
> You Mingyang est le seul des six à ne pas avoir fait ses études de premier cycle à la faculté d'électrotechnique et d'informatique. Il a étudié à la département de foresterie de NTU en B92. « Je voulais à l'origine étudier en génie informatique, mais comme je n'ai pas bien réussi l'examen, j'ai fini par étudier la foresterie, » a-t-il déclaré dans une interview de 2012[^csiecomm-2013]. Du passage de la foresterie au master en médias numériques de NTU, puis à la fondation d'une société de jeux musicaux mobiles à 26 ans, ce parcours interdisciplinaire est devenu la source du sens esthétique de Rayark, et l'a désigné de facto comme le porte-parole de l'entreprise.

Zhong Zhiyuan était le directeur technique et a mené l'équipe dans une migration complète du PaaS vers une architecture conteneurisée Kubernetes. Rayark opère près de cinquante clusters K8s sur Google Cloud : « trois personnes peuvent maintenir un jeu pour un million de joueurs »[^ithome-rayark]. Xie Changyan est devenu le producteur de Sdorica[^sdorica-wiki]. Li Yongting était directeur de jeu et l'un des premiers porte-parole de Rayark[^bnext-rayark].

Le lien commun de ces six personnes, issues de la même promotion de la faculté d'électrotechnique et d'informatique de NTU, est devenu le socle technique de la formule esthétique de Rayark : la capacité à affiner la précision des jugements dans les jeux musicaux, à créer un moteur multi-plateforme, à maintenir les serveurs stables le jour du lancement de la Nintendo Switch. Mais ce socle se heurtait à des problèmes radicalement différents dans les domaines de l'exploitation de RPG en ligne, de la production d'animation et des relations publiques politiques.

---

## Cytus et Deemo : les deux piliers de l'empire musical

Le 12 janvier 2012, Cytus a été publié sur iOS[^cytus-wiki].

![Capture d'écran de gameplay de Cytus II, mécanique de jugement par ligne de balayage dynamique — gameplay signature de la série Cytus](/article-images/technology/cytus-ii-gameplay.png)
_Version Cytus II du gameplay signature « ligne de balayage dynamique » de la série Cytus. Source : [English Wikipedia File:Cytus II gameplay.png](https://en.wikipedia.org/wiki/File:Cytus_II_gameplay.png). Usage loyal à des fins éditoriales._

Le gameplay consiste à suivre une ligne de balayage dynamique pour taper sur les notes, simple et intuitif. Mais ce qui l'a vraiment distingué, c'est la qualité de l'art et de la musique : un design visuel de science-fiction combiné à une musique électronique originale de haut niveau, donnant à Cytus un point mémorisable dans un marché des jeux musicaux mobiles très homogénéisé. Un mois après son lancement, il a atteint la première place des classements App Store dans 14 pays, a dominé le classement des jeux musicaux au Japon pendant 29 jours consécutifs, et a atteint un million de téléchargements payants en avril 2015[^cytus-wiki].

Le 13 novembre 2013, Deemo a été publié[^deemo-wiki]. Si Cytus était de la musique électronique de science-fiction, Deemo était du piano classique. Le joueur joue du piano dans un monde en noir et blanc empreint de contes de fées, la musique passe de l'électronique au classique et au lyrique, et le style visuel passe de la science-fiction frote à l'illustration chaleureuse faite main.

![Couverture de DEEMO Last Recital version PS Vita, image signature d'une petite fille jouant du piano dans une salle de piano de conte de fées en noir et blanc](/article-images/technology/deemo-cover.jpg)
_Couverture de DEEMO Last Recital version PS Vita. Le style de conte de fées en noir et blanc est la signature visuelle de la série Deemo. Source : [English Wikipedia File:DeemoLastRecitalVita.jpg](https://en.wikipedia.org/wiki/File:DeemoLastRecitalVita.jpg). Usage loyal à des fins éditoriales._

Deemo est devenu l'un des plus grands succès commerciaux de Rayark. En octobre 2014, il avait déjà cumulé 7 millions de téléchargements, et lors de l'annonce de l'animation en 2021, il atteignait 28 millions de téléchargements[^deemo-wiki]. La bande originale s'est très bien vendue sur le marché japonais, et le jeu a reçu le prix du meilleur développeur indépendant de l'année 2013 de l'App Store Taiwan et le prix de la meilleure musique de jeu de Google Play Taiwan 2014. La version Nintendo Switch a obtenu un score Metacritic de 88[^deemo-wiki]. La suite, DEEMO II, a été lancée le 13 janvier 2022, avec un million de pré-inscriptions dans le monde et un million de téléchargements la première semaine, en tant qu'œuvre commémorative du dixième anniversaire de Rayark[^deemo2-gnn].

> **📝 Note du commissaire**
> Cytus et Deemo ont établi la formule de la marque Rayark : jeu musical × qualité artistique élevée × mise en scène narrative. Cette formule a donné à Rayark un positionnement unique sur le marché mondial du jeu mobile, mais a aussi encadré toutes leurs tentatives ultérieures. Quatorze ans plus tard, en regardant en arrière, tous les plus grands succès de Rayark sont des jeux musicaux, et tous leurs échecs sont des tentatives d'appliquer cette formule à des domaines non musicaux.

---

![Stand Rayark en 2018, on peut voir au loin les dos de joueurs cosplayant Pipimi et Popuko de POP TEAM EPIC](/article-images/technology/rayark-booth-cosplayers-2018.jpg)
_Stand Rayark en 2018, dos de joueurs en cosplay. Source : [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Cosplayers_of_Pipimi_and_Popuko_seen_from_behind_at_Rayark_booth_(40764217870).jpg). Photo : instantané de cosplay lors d'un événement ACG, CC BY-SA 2.0.\_

## L'année du lancement de la Switch, ils faisaient cinq choses à la fois

Entre 2015 et 2018, Rayark a simultanément avancé cinq lignes de produits.

Implosion a été publié sur iOS et Android le 8 avril 2015, puis sur Nintendo Switch le 6 juillet 2017[^implosion-wiki]. C'était un jeu d'action 3D dont la qualité graphique approchait le niveau console pour un jeu mobile de l'époque. Distribution payante sur l'App Store, sans achat in-app, score Metacritic de 93, il est entré dans le Top Grossing de l'App Store dès la première semaine à la 7e place avec 91,9 % d'évaluations cinq étoiles[^implosion-wiki]. Il a reçu le titre de meilleur jeu iOS d'Asie 2015, le prix de la création ACG de Bahamut 2015 et le Golden Cube des Unity Awards 2014[^implosion-wiki].

En juin 2016, VOEZ a été publié sur mobile. L'année suivante, le 3 mars 2017, VOEZ est devenu l'un des jeux de lancement de la Nintendo Switch, Rayark étant l'un des rares développeurs de jeux musicaux non first-party Nintendo dans la liste de lancement[^voez-4gamers]. Début 2017, le nombre de téléchargements mondiaux a dépassé les 10 millions[^voez-4gamers]. Nintendo Life lui a attribué la note de 8/10 en le qualifiant d'« arme secrète de la Switch »[^voez-nintendo-life].

![Couverture de VOEZ version Nintendo Switch, composition en miroir à deux personnages, visuel signature aquarelle](/article-images/technology/voez-switch-cover.jpg)
_Couverture de VOEZ version Nintendo Switch (édité par Flyhigh Works) — jeu de lancement de la Switch le 3 mars 2017. Source : [English Wikipedia File:SwitchVOEZ.jpg](https://en.wikipedia.org/wiki/File:SwitchVOEZ.jpg). Usage loyal à des fins éditoriales._

Le 18 janvier 2018, Cytus II a été publié, six ans après le premier opus[^cytus2-gematsu]. Le nouveau système a poussé les capacités de jugement des joueurs de jeux musicaux à leurs limites, et le jeu a cumulé plus de 18 millions de téléchargements dans le monde. En mai 2026, Rayark a annoncé que Cytus II sortirait en 2027 sur Nintendo Switch 2 / Switch, avec plus de 500 morceaux[^cytus2-gematsu][^cytus2-qooapp].

Implosion a prouvé que la capacité technique de Rayark permettait de changer de genre. Mais les modèles économiques des jeux d'action et des jeux musicaux sont complètement différents. Les jeux musicaux génèrent des revenus grâce à des mises à jour continues de packs de morceaux, tandis que les jeux d'action sont des achats uniques.

Puis est venu Sdorica, le 19 avril 2018[^sdorica-wiki].

---

## Sortir de la zone de confort : les huit ans de Sdorica

![Logo du jeu Sdorica, version avec sous-titre « aurora » et illustration de personnage sur le thème des aurores boréales](/article-images/technology/sdorica-logo.png)
_Logo du jeu Sdorica (version avec sous-titre « aurora »). Source : [English Wikipedia File:Sdorica logo.png](https://en.wikipedia.org/wiki/File:Sdorica_logo.png). Usage loyal à des fins éditoriales._

Sdorica est la tentative la plus audacieuse de Rayark.

Le projet a commencé en 2013, le développement a débuté en 2014, la sortie initialement prévue pour 2016 a été reportée à 2017, puis au 19 avril 2018 pour la bêta ouverte officielle. Cinq ans de développement, plus de 1,5 million de pré-inscriptions, 2,5 millions de téléchargements le 30 avril, 5 millions le 11 mai[^sdorica-wiki]. Après le lancement, les utilisateurs actifs quotidiens dépassaient le million.

C'était un RPG mobile racontant l'histoire des héros et de l'infusion d'âmes dans le monde de Sdorica, avec Xie Changyan comme producteur[^sdorica-wiki][^moegirl-sdorica]. Rayark a utilisé le budget artistique de ses jeux musicaux pour les illustrations de personnages de RPG, et a appliqué ses compétences en narration à un système de développement de personnages, mais ils ont rapidement découvert que le rythme de mise à jour du contenu des jeux musicaux et celui des RPG exigeaient des compétences complètement différentes.

Après le lancement, les problèmes se sont enchaînés. Les serveurs ont sous-estimé le nombre de joueurs, les événements de gacha n'ont pas été ouverts à temps, la version de la fête des bateaux-dragons a affiché des caractères chinois corrompus, la poudre de lumière résiduelle n'a pas été distribuée, etc.[^sdorica-udn]. Entre juin et juillet 2018, les décisions opérationnelles de Rayark ont fait l'objet d'une forte réaction de la part des joueurs, incluant des ajustements non annoncés des statistiques des personnages et des controverses sur les packs à prix élevés. En quatre mois, le jeu est passé du sommet au déclin, marquant un tournant dans la réputation de Rayark[^sdorica-bahamut-policy].

> **💡 Le saviez-vous ?**
> Rayark n'a pratiquement jamais échoué dans les jeux musicaux et les jeux d'action, mais a trébuché dans le domaine des RPG nécessitant une exploitation à long terme. La compétence centrale des jeux musicaux et des jeux à achat unique est « faire un bon produit », tandis que la compétence centrale de l'exploitation d'un RPG est « servir continuellement une communauté ». Ce sont des compétences complètement différentes.

Huit ans plus tard, le 11 février 2026, Rayark a officiellement annoncé que Sdorica entrait en mode maintenance[^sdorica-gachago][^sdorica-bahamut-policy] :

> Les nouveaux chapitres de l'histoire principale, les événements spéciaux et les packs à durée limitée sont entièrement arrêtés. Les deux derniers personnages, Valdrir DR, sont envoyés à tous les joueurs via la boîte aux lettres du jeu, et Chiyuki DR est obtenu via la relecture de l'événement « Ivresse de l'eau printanière ». Les relectures d'événements d'infusion spéciaux continueront jusqu'en juillet 2026, après quoi aucune nouvelle relecture ne sera ouverte. Les serveurs continueront de fonctionner dans un avenir prévisible.

« Le cycle de vie de développement actif de Sdorica est terminé » — c'est le moment où Rayark lui-même a déclaré la fin sur le champ de bataille du RPG[^sdorica-gachago]. Pour les joueurs fidèles restés pendant des années, cette annonce était plus cruelle qu'une fermeture soudaine des serveurs — les serveurs restent ouverts, les anciens personnages peuvent encore être entraînés, mais les nouvelles histoires ne viendront jamais. Rayark était aussi conscient du coût de cette décision : huit ans d'histoire, huit ans de design de personnages, huit ans de construction d'un univers, désormais gelés, laissant aux joueurs le soin de décider combien de temps ils souhaitent y rester.

Pour Rayark début 2026, le mode maintenance de Sdorica était un arrêt des pertes nécessaire. Sdorica a continuellement consommé les ressources de développement de Rayark pendant huit ans, brouillant la clarté du positionnement de la marque. Une entreprise fondée sur « faire les plus beaux jeux musicaux » était liée à un RPG qu'elle ne pouvait pas soutenir, et chaque année de retard dans l'arrêt des pertes rendait le récit global de l'entreprise plus difficile à expliquer. L'effet secondaire de l'annonce du mode maintenance a peut-être été de permettre aux séries Cytus et DEEMO de redevenir les axes clairs de la marque Rayark.

---

## Code Morse 1344 7609 2575

En mars 2020, ICE, directeur musical de Rayark (de son vrai nom Wilson Lam, musicien hongkongais, ayant rejoint Rayark en 2014), a publié à titre personnel un album intitulé Consciousness, incluant le morceau Telegraph : 1344 7609 2575 sur ses comptes SoundCloud et YouTube personnels[^silentblue-wilson-lam][^itechpost-cytus2]. Le titre « 1344 7609 2575 » est un code Morse en caractères chinois.

Le 17 juillet 2020, des internautes chinois ont identifié la chanson et découvert qu'après décodage du code Morse, il disait : **« Hongkongais, courage, Libérez Hong Kong, révolution de notre temps »**[^udn-ice][^newtalk-ice].

Le lendemain, le 18 juillet, ICE a annoncé sa démission de Rayark via une déclaration personnelle. Citation intégrale :

> Concernant la soulevée par la composition que j'ai sortie en mars 2020, qui a suscité de nombreuses discussions parmi les internautes. Comme il s'agit d'une activité personnelle en dehors de mon travail et sans rapport avec Rayark Games, j'ai décidé de démissionner de mon propre chef et de quitter Rayark Games à compter de ce jour[^newtalk-ice].

Le même jour, l'agent chinois Longyuan Network et Rayark Games ont publié une annonce conjointe indiquant que Cytus II était retiré du marché chinois en attente de rectification[^gnn-ice]. Des joueurs taïwanais ont exprimé leur mécontentement sur la page Facebook de Rayark, mettant en doute une censure idéologique de la part de l'entreprise. Au 20 juillet, Rayark n'avait toujours pas publié d'explication officielle sur ses plateformes taïwanaises[^techorange-ice]. L'année suivante, en mai 2021, Longyuan et Rayark ont annoncé la suppression des 6 morceaux créés ICE après rectification, avec une promesse de compensation pour les joueurs ayant déjà payé, et le retour de Cytus II sur les serveurs chinois[^4gamers-cytus2-ice-removal].

La trajectoire créative personnelle ICE après sa démission s'arrête aux résultats de recherche de juillet 2020 (non vérifié au-delà).

C'était l'équivalent pour Rayark d'un « champ de mines politique ». L'année précédente, en 2019, le jeu Devotion de Red Candle Games avait été entièrement retiré du marché chinois à cause de l'incantation talismanique, et Red Candle avait choisi de se retirer du marché chinois et de maintenir sa position taïwanaise. La gestion de l'incident ICE par Rayark en 2020 a été l'inverse : laisser la personne concernée partir, modifier le jeu pour se conformer, préserver le marché chinois.

> **⚠️ Point de vue controversé**
> Voici deux choix radicalement différents face à la même pression du marché chinois, faits par deux équipes indies emblématiques de Taïwan. Le média anglophone PocketGamer.biz a titré « China pulls Cytus II from the App Store for secret pro-democracy Morse code message »[^pocketgamer-cytus2], tandis que les discussions dans le monde sinophone se sont concentrées sur « Rayark s'est prosterné / était-il correct de sacrifier ICE ». Deux lectures d'un même événement.

---

## Implosion : onze ans depuis le Jour Zéro

![Affiche du jeu Implosion: Never Lose Hope, scène d'action méca avec informations de disponibilité App Store / Google Play](/article-images/technology/implosion-cover.png)
_Affiche promotionnelle de Implosion: Never Lose Hope — jeu d'action méca 3D, lauréat du titre de meilleur jeu iOS d'Asie 2015. Source : [English Wikipedia File:Implosion- Never Lose Hope - cover.png](https://en.wikipedia.org/wiki/File:Implosion-_Never_Lose_Hope_-_cover.png). Usage loyal à des fins éditoriales._

Certaines promesses sont plus difficiles à regarder que le silence.

Le 5 décembre 2015, Rayark a lancé une campagne de financement Kickstarter pour le film d'animation Implosion: Zero Day, un film de 90 minutes avec un objectif de 400 000 USD[^inside-zero-day]. En 48 heures, 18 % de l'objectif de financement a été atteint, et en 10 jours, plus de 5 millions de TWD ont été collectés[^implosion-zero-day-wiki]. La date de livraison initiale était fixée à août 2018.

2018 est passé sans livraison.

Le 24 janvier 2019, une annonce de troisième report a reconnu que « le film d'animation IZD ne pourrait pas être achevé comme prévu en 2018 », en proposant une option de remboursement : les contributeurs pouvaient choisir le remboursement tout en conservant les cadeaux correspondant à leur niveau de soutien[^disp-bbs-implosion]. Les remboursements ont été comptabilisés en février 2019, et les premiers produits (casquettes, T-shirts, scénario de film en édition collector, bande originale originale, chapitres de manga, fonds d'écran de film) ont été expédiés en mars. Les produits complets ne seraient envoyés qu'après l'achèvement du film.

De 2020 à 2026, cinq ans de silence. La page officielle de Implosion sur le site de Rayark et l'article Wikipédia anglais sur Implosion indiquent toujours que l'animation est « en cours », sans date de sortie[^implosion-wiki]. Les contributeurs du monde entier sur Kickstarter ont payé onze ans d'attente et n'ont toujours pas vu le film en 2026.

« Ils n'osent même pas parler de l'avancement du film, ils ne peuvent pas donner ne serait-ce qu'un demi-calendrier. » a écrit un contributeur sous l'annonce du report de 2019[^disp-bbs-implosion].

C'est le seul projet de Rayark qui n'a véritablement « pas été livré ». Plus grave que les fissures opérationnelles de Sdorica, c'est le silence prolongé envers les contributeurs Kickstarter du monde entier. Mais l'attention médiatique dans le monde sinophone pour cette affaire a été bien inférieure à celle portée à l'incident ICE, au mode maintenance de Sdorica ou à la controverse sur l'art généré par IA. C'est peut-être parce que l'industrie du jeu indépendant sinophone est plus tolérante envers ce type de report, ou peut-être parce que les conséquences du report ont finalement été supportées de manière dispersée par tous les contributeurs de cette campagne Kickstarter de 2015.

---

## Ceux qui sont encore là

Rayark Games Inc., situation en mai 2026 : environ 270 employés, capital de 64 millions de TWD, siège au 47 Xingdong Road, district de Xinyi, Taipei. Depuis 2012, plus de dix jeux lancés et plus de 130 millions de téléchargements cumulés dans le monde[^rayark-104]. Rayark Japan a une filiale à Tokyo, l'entreprise n'est pas cotée en bourse.

Chronologie des trois dernières années :

- Mai 2023, controverse sur l'art généré par IA chez Rayark. Des rumeurs en ligne évoquant « création entièrement par IA + licenciements d'artistes ». Le 27 mai, Rayark a publié un communiqué sur Twitter clarifiant qu'il « n'a pas utilisé l'IA pour créer de grandes quantités d'images nécessaires aux jeux, et n'a pas pour autant licencié l'équipe artistique »[^rayark-twitter-ai][^gnn-rayark-ai]
- 30 novembre 2023, fermeture du café Rayark
- 14 octobre 2024, fin des opérations de la boutique en ligne Rayark Concept[^rayark-concept-fb]
- 11 février 2026, Sdorica entre en mode maintenance
- 22 mai 2026, annonce de la sortie de Cytus II sur Nintendo Switch 2 / Switch en 2027[^cytus2-gematsu]

En comparaison avec les entreprises de jeux musicaux de la même époque, PENTAVISION, qui avait écrasé Hypaa Studio en 2008, a suivi un chemin complètement différent. En 2012, il a été liquidé en raison de difficultés financières et entièrement absorbé par sa société mère Neowiz[^pentavision-wiki]. En 2017, Neowiz a ressuscité la série avec DJMax Respect, et en décembre 2024, DJMax Respect V a dépassé 6 millions de téléchargements. En 2025, Neowiz a réalisé un chiffre d'affaires record[^digitaltoday-neowiz].

PENTAVISION a survécu en étant « absorbé par un grand groupe, puis ressuscité ». Rayark a choisi le chemin inverse : rester indépendant, élargir les catégories de produits, absorber soi-même le coût de chaque erreur.

La situation de Rayark Games est le dilemme le plus typique du succès dans l'industrie du jeu indépendant taïwanais : le premier produit explose grâce à la passion et au talent, les produits suivants nécessitent des compétences organisationnelles et une discipline opérationnelle. Le plafond du marché des jeux musicaux a déterminé que Rayark devait élargir ses catégories, mais chaque expansion diluait la reconnaissance de la marque d'origine. Les joueurs de Cytus et les joueurs de Sdorica sont des publics complètement différents, et servir les deux groupes sous le même nom de marque peut amener les deux groupes à penser que « Rayark a changé ».

Mais Rayark reste l'une des rares marques de l'industrie du jeu taïwanais à être reconnue sur le marché mondial. Les 18 millions de téléchargements de Cytus II, les 28 millions de téléchargements de la série Deemo, Implosion remportant le titre de meilleur jeu iOS de l'année, VOEZ en tant que jeu de lancement de la Switch, et le film d'animation DEEMO produit par Production I.G et Signal.MD avec un thème principal de Yuki Kajiura — ces réalisations restent inégalées par aucune autre entreprise sur le marché du jeu mobile taïwanais en 2026[^deemo-movie-rayark].

En 2008, You Mingyang a appris d'une borne d'arcade qui ne se vendait pas que « l'esthétique est importante ». Dix-huit ans plus tard, cette phrase reste le plus grand atout de Rayark, et peut-être aussi son plus lourd carcan : quand on se définit comme « celui qui fait les plus beaux jeux », la tolérance du marché à l'erreur tombe à zéro.

✦ L'esthétique a permis au monde de voir Rayark, mais elle l'a aussi fait trébucher dans chaque domaine qui n'était pas musical.

Les fissures opérationnelles de huit ans de Sdorica proviennent du conflit fondamental entre la formule « art × musique × histoire » et la nature du service à long terme d'un RPG. Chaque mise à jour d'événement nécessitait de nouvelles illustrations de personnages de haute qualité, chaque expansion narrative devait être accompagnée de musique originale. C'était réalisable à l'échelle d'une équipe de 16 personnes avec un capital de 30 millions de TWD, mais dans le rythme d'un gacha avec des centaines de milliers d'utilisateurs actifs quotidiens, c'est devenu un trou noir temporel systémique. Le standard de qualité de Rayark, forgé dans les jeux musicaux — « polir jusqu'à ce que le joueur reconnaisse au premier coup d'œil » — se heurtait à la vitesse de consommation du contenu des RPG mobiles — « les joueurs consomment en moyenne une mise à jour majeure en trois jours ». Les deux sont en conflit fondamental.

Le problème central de l'absence de livraison de l'animation Implosion depuis onze ans est la confrontation entre le standard « faire la plus belle animation » et les limites d'exécution d'une société indépendante. La production d'animation de niveau Production I.G nécessite une pipeline de production organisée et une équipe de scénaristes stable à long terme. Lorsque Rayark a promis de produire un film de 90 minutes sur Kickstarter, c'est avec les compétences du jeu vidéo qu'il a fait une promesse relevant de l'industrie de l'animation. Le seuil technique de l'animation Implosion était à la portée de Rayark, mais la difficulté résidait dans le coût total de « le produire, puis le maintenir jusqu'à ce qu'il puisse sortir en salles », un fardeau qu'une société indépendante de cette échelle ne pouvait pas supporter.

L'incidence ICE a montré le résultat inévitable de l'extension de la logique de « pureté de la marque » aux employés. L'ensemble de la marque Rayark repose sur le récit « esthétique dominante, neutralité politique, marchés transnationaux accessibles ». Lorsqu'un employé a sorti une chanson pro-Hong Kong en dehors du travail, la cohérence interne de tout ce récit de marque a été mise à l'épreuve. Le choix de Rayark a été de laisser l'employé démissionner de son propre chef, de modifier le jeu pour se conformer au marché chinois et de préserver les canaux de distribution chinois — la solution optimale interne à cette logique de marque, et aussi le groupe témoin d'une autre voie indie (celle de Red Candle).

À quoi ressemblera le prochain Rayark ? Peut-être qu'il n'y en aura plus, peut-être que cela nécessitera des compétences différentes. Quand l'esthétique est tout, chaque choix non-esthétique devient une fissure, y compris la politique, y compris les opérations, y compris le temps. Mais la trajectoire de quatorze ans de Rayark montre aussi une chose : les équipes de jeux indépendantes taïwanaises ont la capacité de tenir une position de marque rare sur le marché mondial des jeux musicaux, une chose que seuls le système japonais BEMANI et la série coréenne DJ Max ont réussi en Asie. L'histoire de Rayark n'est pas terminée. Le jour où Cytus II sortira sur Nintendo Switch 2 en 2027, ce sera le prochain jalon pour tester si « l'empire esthétique peut continuer à définir le made-by-Taiwan à l'ère de l'IA ».

---

## Pour aller plus loin

- [Industrie du jeu taïwanais et divertissement numérique](/technology/台灣遊戲產業與數位娛樂) — Panorama complet du jeu taïwanais, de l'agence à la création originale
- [Red Candle Games](/technology/赤燭遊戲) — Une autre voie pour le jeu indépendant taïwanais : raconter l'histoire à travers l'histoire, choisir de se retirer du marché chinois
- [Da Yu et les Deux Épées](/technology/大宇雙劍) — Le point de départ du jeu taïwanais racontant des histoires en chinois
- [Xianji Network et l'expansion internationale du jeu en ligne taïwanais](/technology/傳奇網路與台灣線上遊戲出海) — Une autre histoire de l'expansion internationale du jeu taïwanais

---

## Sources des images

Cet article utilise 8 images sous licence, toutes mises en cache dans `public/article-images/technology/` pour éviter les liens directs vers les serveurs sources :

- **rayark-cafe-2021.jpg** (hero) — [Wikimedia Commons File:Rayark Café 20211016.jpg](https://commons.wikimedia.org/wiki/File:Rayark_Café_20211016.jpg) — Photo : Solomon203, 2021-10-16, CC BY-SA 4.0
- **rayark-logo-2012.png** (inline, § Ce qu'une borne d'arcade leur a appris) — [English Wikipedia File:Logo of Rayark Inc.png](https://en.wikipedia.org/wiki/File:Logo_of_Rayark_Inc.png) — Usage loyal à des fins éditoriales sur l'identité de marque de Rayark Inc.
- **cytus-ii-gameplay.png** (inline, § Cytus et Deemo) — [English Wikipedia File:Cytus II gameplay.png](https://en.wikipedia.org/wiki/File:Cytus_II_gameplay.png) — Usage loyal à des fins éditoriales sur le gameplay signature de la série Cytus
- **deemo-cover.jpg** (inline, § Cytus et Deemo) — [English Wikipedia File:DeemoLastRecitalVita.jpg](https://en.wikipedia.org/wiki/File:DeemoLastRecitalVita.jpg) — Usage loyal à des fins éditoriales sur l'art de la série DEEMO
- **rayark-booth-cosplayers-2018.jpg** (inline, § L'année du lancement de la Switch) — [Wikimedia Commons](<https://commons.wikimedia.org/wiki/File:Cosplayers_of_Pipimi_and_Popuko_seen_from_behind_at_Rayark_booth_(40764217870).jpg>) — Photo : instantané de cosplay lors d'un événement ACG 2018, CC BY-SA 2.0
- **voez-switch-cover.jpg** (inline, § L'année du lancement de la Switch) — [English Wikipedia File:SwitchVOEZ.jpg](https://en.wikipedia.org/wiki/File:SwitchVOEZ.jpg) — Usage loyal à des fins éditoriales sur le lancement de VOEZ sur NS
- **sdorica-logo.png** (inline, § Sortir de la zone de confort : les huit ans de Sdorica) — [English Wikipedia File:Sdorica logo.png](https://en.wikipedia.org/wiki/File:Sdorica_logo.png) — Usage loyal à des fins éditoriales sur l'identité de marque de Sdorica
- **implosion-cover.png** (inline, § Implosion : onze ans depuis le Jour Zéro) — [English Wikipedia File:Implosion- Never Lose Hope - cover.png](https://en.wikipedia.org/wiki/File:Implosion-_Never_Lose_Hope_-_cover.png) — Usage loyal à des fins éditoriales sur l'identité du jeu Implosion

---

## Références

[^rayark-wiki]: [Rayark Games — Wikipédia](https://zh.wikipedia.org/zh-tw/%E9%9B%B7%E4%BA%9E%E9%81%8A%E6%88%B2) — Six cofondateurs (Zhong Zhiyuan, You Mingyang, Zhang Shiqun, Xie Changyan, Yang Shanyong, Li Yongting), fondation en septembre 2011, Jinshan North Road, équipe de 16 personnes, capital de 30 millions, chronologie des produits

[^kopu]: [Rayark : l'un des rares développeurs mobiles taïwanais à créer ses propres jeux avec un style unique — Kopu](https://kopu.chat/rayark/) — Histoire de Hypaa Studio et THEIA, citation directe de You Mingyang « les graphismes et la musique sont importants », contexte de la création de l'entreprise

[^csiecomm-2013]: [B92 You Mingyang B91 Yang Shanyong B92 Xie Changyan (Rayark Games) — Blog csiecomm](http://csiecomm.blogspot.com/2013/07/b92-b91-b92.html) — Interview du 07-12-2012 ; You Mingyang de foresterie aux médias numériques, Yang Shanyong B91, Xie Changyan B92 ; citation directe de You Mingyang « Je voulais à l'origine étudier en génie informatique, mais comme je n'ai pas bien réussi l'examen, j'ai finé par étudier la foresterie »

[^ithome-rayark]: [Rayark passe du PaaS aux conteneurs, 3 personnes peuvent maintenir un jeu pour un million de joueurs — iThome](https://www.ithome.com.tw/people/109212) — Le directeur technique Zhong Zhiyuan a mené la transition vers la conteneurisation, 50 clusters K8s de Rayark sur GCP

[^sdorica-wiki]: [Sdorica — Wikipédia](https://zh.wikipedia.org/zh-hant/Sdorica_%E8%90%AC%E8%B1%A1%E7%89%A9%E8%AA%9E) — Planification 2013 / développement 2014 / bêta ouverte 2018-04-19 ; 1,5 million de pré-inscriptions ; 2,5 millions de téléchargements le 30 avril ; 5 millions le 11 mai ; producteur Xie Changyan

[^bnext-rayark]: [Rayark Games : les artisans derrière Cytus, jeu noté 5 étoiles par milliers d'utilisateurs iOS — BNext](https://www.bnext.com.tw/article/22202/BN-ARTICLE-22202) — Li Yongting réalisateur et porte-parole de l'entreprise, You Mingyang cofondateur, Zhang Shiqun cofondateur

[^cytus-wiki]: [Cytus — Wikipedia](https://en.wikipedia.org/wiki/Cytus) — Lancement iOS 2012-01-12 / Android 4-13 ; 1 million de téléchargements payants en avril 2015 ; première place dans 14 pays ; 29 jours conséctifs en tête du classement des jeux musicaux au Japon

[^deemo-wiki]: [Deemo — Wikipedia](https://en.wikipedia.org/wiki/Deemo) — iOS 2013-11-13 / Android 12-27 ; Vita 2015-06-24 ; 7 millions de téléchargements cumulés en octobre 2014 ; 28 millions de téléchargements lors de l'annonce de l'animation en 2021 ; prix ; DEEMO -Reborn- ; DEEMO II ; animation Memorial Keys ; score Metacritic de la version Nintendo Switch : 88

[^deemo2-gnn]: [DEEMO II, œuvre commémorative du 10e anniversaire de Rayark Games, est officiellement lancé dans le monde entier — GNN Bahamut](https://gnn.gamer.com.tw/detail.php?sn=226618) — DEEMO II lancé le 2022-01-13 ; million de téléchargements la première semaine ; 1 million de pré-inscriptions dans le monde

[^implosion-wiki]: [Implosion: Never Lose Hope — Wikipedia](https://en.wikipedia.org/wiki/Implosion:_Never_Lose_Hope) — iOS/Android 2015-04-08, Switch 2017-07-06 ; prix ; Metacritic 93 ; 91,9 % d'évaluations cinq étoiles la première semaine ; meilleur jeu iOS d'Asie 2015 + prix de création ACG Bahamut 2015 + Golden Cube des Unity Awards 2014 ; animation Zero Day de 90 minutes en cours

[^voez-4gamers]: [VOEZ de Rayark va être lancé sur Nintendo Switch — 4Gamers](https://www.4gamers.com.tw/news/detail/31551/voze-achieved-10-million-download-and-will-be-launch-in-nintendo-switch) — VOEZ a dépassé 10 millions de téléchargements début 2017 ; jeu de lancement NS le 2017-03-03

[^voez-nintendo-life]: [VOEZ (2017) — Nintendo Life](https://www.nintendolife.com/games/switch-eshop/voez) — Nintendo Life note 8/10 « arme secrète de la Switch »

[^cytus2-gematsu]: [Cytus II coming to Switch 2, Switch in 2027 — Gematsu](https://www.gematsu.com/2026/05/cytus-ii-coming-to-switch-2-switch-in-2027) — Annonce du 2026-05-22 pour NS / NS2 en 2027 ; 18 millions de téléchargements cumulés dans le monde ; plus de 500 morceaux

[^cytus2-qooapp]: [Le jeu musical populaire Cytus II de Rayark confirmé pour Switch 2 / Switch — QooApp](https://news.qoo-app.com/post/436892/cytus-ii-switch) — Confirmation en chinois ; sortie en 2027

[^moegirl-sdorica]: [Sdorica — Moegirl Wiki](https://zh.moegirl.tw/%E4%B8%87%E8%B1%A1%E7%89%A9%E8%AF%AD) — Développé et publié par Rayark Games ; lancé le 2018-04-19 ; producteur Xie Changyan

[^sdorica-udn]: [Événements de Sdorica fréquemment défaillants — udn Game Corner](https://game.udn.com/game/story/10453/3209024) — Serveurs saturés après le lancement de Sdorica en juin 2018, gacha non ouvert à temps, caractères corrompus pour la fête des bateaux-dragons, poudre de lumière résiduelle non distribuée, série de controverses opérationnelles

[^sdorica-bahamut-policy]: [Ajustement de la politique opérationnelle de Sdorica — Forum Bahamut](https://forum.gamer.com.tw/C.php?bsn=29560&snA=11124) — Annonce en chinois du mode maintenance le 2026-02-11 ; plus de nouvelles relectures après juillet 2026 ; discussions de la communauté de joueurs

[^sdorica-gachago]: [Sdorica Enters Maintenance Mode After Final Character Releases — Gacha Go!](https://gachago.com/en/news/sdorica-enters-maintenance-mode-after-final-character-releases) — Mode maintenance le 2026-02-11 ; Valdrir DR et Chiyuki DR, les deux derniers personnages ; les serveurs restent opérationnels ; relectures d'Infuse jusqu'en juillet 2026 ; « Le cycle de vie de développement actif de Sdorica est terminé »

[^silentblue-wilson-lam]: [Wilson Lam — SilentBlue.RemyWiki](https://silentblue.remywiki.com/Wilson_Lam) — ICE de son vrai nom Wilson Lam ; a rejoint Rayark en 2014 comme directeur musical ; chronologie de l'incident de démission de 2020

[^itechpost-cytus2]: ['Cytus II' Taken Down in China Due to a Composer's Song Containing Hidden Pro-Hong Kong Morse Code Message — iTechPost](https://www.itechpost.com/articles/103452/20200722/cytus-ii-taken-down-in-china-due-to-a-composers-song-containing-hidden-pro-hong-kong-morse-code-message.htm) — Couverture de l'incident ICE du point de vue des médias anglophones

[^udn-ice]: [Morse code « Libérez Hong Kong » caché dans une œuvre dénoncée, le directeur musical de Rayark annonce sa démission — udn Game Corner](https://game.udn.com/game/story/10453/4711560) — Internautes chinois ayant identifié la chanson le 2020-07-17 ; décodage du code Morse « Hongkongais, courage, Libérez Hong Kong, révolution de notre temps » ; chronologie complète de l'incident ICE

[^newtalk-ice]: [Musique contenant des slogans pro-démocratie dénoncée, le directeur musical ICE de Rayark démissionne de son propre chef — Newtalk](https://newtalk.tw/news/view/2020-07-18/437743) — Déclaration intégrale d'ICE du 2020-07-18 ; points clés de l'annonce de Longyuan

[^gnn-ice]: [Le directeur musical ICE de Rayark Games annonce sa démission suite à une controverse musicale — GNN Bahamut](https://gnn.gamer.com.tw/detail.php?sn=200246) — Couverture officielle de Bahamut ; annonce conjointe de Rayark et Longyuan

[^techorange-ice]: [Création personnelle du directeur musical soutenant Hong Kong, la méthode de Rayark sur Weibo était-elle correcte ? — TechOrange](https://techorange.com/2020/07/20/rayark-ice-support-hk-resign/) — Au 2020-07-20, Rayark n'avait toujours pas publié d'explication officielle sur ses plateformes taïwanaises ; mise en doute par la communauté de joueurs

[^4gamers-cytus2-ice-removal]: [Cytus II retiré du marché chinois pour rectification, les morceaux créés ICE seront tous supprimés — 4Gamers](https://www.4gamers.com.tw/news/detail/44034/cytus-ii-ban-songs-by-ice-in-china) — 6 morceaux ICE supprimés en mai 2021 ; compensation pour les joueurs ayant déjà payé

[^pocketgamer-cytus2]: [China pulls Cytus II from the App Store for secret pro-democracy Morse code message — PocketGamer.biz](https://www.pocketgamer.biz/asia/news/73974/china-pulls-cytus-ii-from-app-store/) — Cadrage des médias de l'industrie anglophones ; point de vue des médias internationaux

[^inside-zero-day]: [Le film d'animation Implosion: Zero Day adapté du jeu de Rayark va être financé sur Kickstarter — INSIDE](https://www.inside.com.tw/article/5271-implosion-zero) — Lancement Kickstarter le 2015-12-05 ; 18 % de l'objectif atteint en 48 heures

[^implosion-zero-day-wiki]: [Implosion: Zero Day — Wikipédia](https://zh.wikipedia.org/zh-tw/%E8%81%9A%E7%88%86%EF%BC%9A%E7%AC%AC%E9%9B%B6%E6%97%A5) — Plus de 5 millions de TWD en 10 jours ; achèvement initialement prévu pour août 2018 ; plus de nouvelles annonces après 2020

[^disp-bbs-implosion]: [Troisième report du film Implosion Zero de Rayark — Disp BBS ACG](https://disp.cc/b/ACG/b7Iw) — Annonce du troisième report le 2019-01-24 ; options de remboursement ; citation directe de la critique d'un joueur

[^rayark-104]: [Rayark Games Inc. — recrutement — 104 Job Bank](https://www.104.com.tw/company/1a2x6bj6qc) — 270 employés ; capital de 64 millions de TWD ; 130 millions de téléchargements cumulés ; liste des produits

[^rayark-twitter-ai]: [Annonce officielle de Rayark sur Twitter clarifiant la controverse sur l'art IA](https://twitter.com/RayarkOfficial/status/1662466448709816331) — « N'a pas utilisé l'IA pour créer de grandes quantités d'images nécessaires aux jeux, et n'a pas pour autant licencié l'équipe artistique »

[^gnn-rayark-ai]: [Rayark Games clarifie n'avoir pas licencié massivement son personnel artistique suite à l'introduction de la technologie IA — GNN Bahamut](https://gnn.gamer.com.tw/detail.php?sn=250502) — Annonce officielle complète de clarification en chinois

[^rayark-concept-fb]: [Rayark Concept Facebook](https://www.facebook.com/RayarkConcept/) — Annonce de fin des opérations de la boutique en ligne le 2024-10-14

[^pentavision-wiki]: [Pentavision — Wikipédia](https://zh.wikipedia.org/zh-hans/Pentavision) — Acquis par Neowiz en avril 2006 ; DJ Max Technika en 2008 ; liquidation en 2012 ; entièrement absorbé par Neowiz

[^digitaltoday-neowiz]: [Neowiz posts 60 billion won 2025 operating profit, up 82.2 percent — DigitalToday](https://www.digitaltoday.co.kr/en/view/3459/neowiz-2025-operating-profit-60-billion-won-up-822-percent) — DJMax Respect V : 6 millions de téléchargements en décembre 2024 ; chiffre d'affaires record de Neowiz en 2025

[^deemo-movie-rayark]: [Le jeu musical DEEMO de Rayark adapté en film d'animation « DEEMO THE MOVIE » — Rayark officiel](https://rayark.com/zh/news/20201113_deemomovie/) — Sociétés de production DEEMO THE MOVIE : Production I.G + Signal.MD, directeur général Jun'ichi Fujisaki, directeur Shuhei Matsushita, thème principal Yuki Kajiura
