---
title: 'Trente ans de communautés en ligne taïwanaises — Une histoire de territoires perdus, où les URL reviennent mais pas les photos'
description: "Du BBS « Belle Île » à Threads, les Taïwanais déménagent collectivement tous les quelques années, laissant à chaque fois la mémoire de la génération précédente derrière un interrupteur éteint. Ces trente ans de migrations ressemblent à une ligne d'évolution propre, mais leur ossature est une histoire de territoires perdus : les endroits où l'adhérence est la plus forte sont ceux où la souveraineté sur les données est la plus faible."
date: 2026-03-29
lastEvolved: 2026-06-15
category: 'Technology'
tags:
  [
    'BBS',
    'PTT',
    'Wretch',
    'Facebook',
    'LINE',
    'Threads',
    'culture internet',
    'plateformes sociales',
    'féodalisme du cloud',
    'souveraineté numérique',
  ]
subcategory: '社群與數位文化'
author: 'p3nchan'
featured: true
lastVerified: 2026-06-15
lastHumanReview: false
readingTime: 25
translatedFrom: 'Technology/台灣網路社群遷徙史.md'
sourceCommitSha: 'c673392a'
sourceContentHash: 'sha256:8fad47b5fb5b0ee9'
sourceBodyHash: 'sha256:dd603353dcdb0e7a'
translatedAt: '2026-06-16T18:18:20Z'
---

> **Aperçu en 30 secondes** : Taïwan a fait pousser deux fois ses propres plateformes — le _Personal News Stand_ du _Tomorrow Times_ et Wretch (無名小站). La première a été étranglée par le krach Internet de 2001 et sauvée par un comité d'autodéfense des utilisateurs ; la seconde, rachetée par Yahoo, s'est vu débrancher le même jour, le 26 décembre 2013. Le reste du temps, les Taïwanais habitent les serveurs des autres. Pendant trois décennies, nous sommes passés des BBS à Wretch, refoulés de Wretch vers Facebook, repliés de Facebook dans les groupes LINE, puis sortant la tête depuis les groupes LINE pour aller voir Threads — chaque déménagement a laissé en chemin un paquet de photos, un paquet de commentaires, un morceau de jeunesse. En mai 2024, Similarweb a mesuré que les utilisateurs taïwanais passaient en moyenne 11 minutes 31 secondes sur Threads — premier rang mondial, contre 5:12 pour les Américains et 3:06 pour les Japonais à la même période[^1]. Nous versons le plus de temps dans le logement le moins protégé. Ces trente ans de migration se racontent souvent comme une ligne d'évolution propre (BBS → Wretch → FB → LINE → Threads), mais ce récit filtre l'essentiel : à chaque déménagement se rejoue la question « à qui appartient la terre », et les Taïwanais ont toujours été les locataires.

## La cité-État aux lettres blanches sur fond noir, et la première « expulsion »

L'histoire ne commence pas là où la plupart le croient aujourd'hui. En 1992, à l'Université nationale Sun Yat-sen, le professeur Chen Nien-hsing, au Centre d'informatique et de réseau, installe un BBS qu'il baptise _Belle Île_ (美麗之島), premier BBS Internet entièrement en chinois de Taïwan[^2]. Avant cela, en 1984, le ministère de l'Éducation avait déjà décidé de pousser le réseau académique TANet à travers les universités de Chiao Tung et de Sun Yat-sen[^3]. Internet est un tuyau posé par l'État avec l'argent des impôts, les universités sont les terminaisons de ce tuyau, et les BBS sont les cités-États qui ont poussé toutes seules sur ces terminaisons.

Le 14 septembre 1995, Tu Yi-chen (杜奕瑾), du département d'informatique de l'Université nationale de Taïwan, allume PTT dans la chambre 618 du Dortoir des garçons n° 8, sur une machine 486DX266 avec 16 Mo de RAM[^4]. Cette machine n'a rien à voir avec la Silicon Valley : un dortoir étudiant, le réseau de la fac, un système BSD gratuit, et le temps d'une personne qui ne dort pas — il n'en a pas fallu plus. Les premiers utilisateurs étaient surtout des étudiants de la NTU ; l'inscription demandait un numéro étudiant et l'on publiait sous son vrai nom avant de pouvoir passer à un identifiant. Tout le système était en lettres blanches sur fond noir, suffisamment rudimentaire pour ne faire passer que du texte — et pourtant son taux d'adhérence dépassait l'imagination.

Le mot _xiangmin_ (鄉民, « les villageois ») a poussé exactement sur cette surface noire et blanche. En 2004, lors de l'incident de la « Contre-attaque du brave type » sur le forum Nightlife de PTT, le sysop Junchoon (Huang Chien-yu) intervient pour arbitrer et reprend une réplique de Stephen Chow dans _Hail the Judge_, prononcée par le personnage Fang Tangjing : « je suis juste entré avec les villageois pour regarder l'agitation, j'ai juste fait un pas en avant », et il écrit : « Que les "villageois" venus regarder le spectacle reculent derrière la ligne jaune »[^5]. Une réplique de bord de rue d'une comédie hongkongaise, ramassée au passage par un sysop qui arbitrait une dispute, devient la plus importante autodésignation de la sous-culture Internet taïwanaise. Le mot a ensuite été mémorisé à tort comme une invention de Tu Yi-chen, alors qu'il n'a été que le bâtisseur du site, pas son baptiseur. Le droit de nommer est revenu au sysop de seconde génération.

L'« expulsion » de l'ère BBS est arrivée tôt et de façon très taïwanaise. À la fin des années 1990, TANet a commencé à appliquer strictement la règle interdisant les usages non académiques, et de nombreux BBS à coloration commerciale ont été contraints de quitter le réseau académique ou de basculer vers des FAI commerciaux comme HiNet[^6]. La cause du premier déménagement collectif n'avait rien à voir avec « l'apparition d'une meilleure plateforme ». C'était purement le propriétaire — les universités — qui disait : ce lieu est fait pour que des étudiants y vivent, pas pour qu'on y tienne boutique. Le tuyau gratuit était assorti d'une condition : ne ressemble pas trop à un commerce. Cette condition reviendra plus tard — sous la forme du « cas Wretch » — pour devenir la dispute la plus aiguë sur la propriété publique dans l'histoire des communautés taïwanaises.

## Taïwan a fait pousser sa première plateforme — et la bulle l'a tuée une fois

Revenons sur l'axe du temps au 15 février 2000. Ce jour-là, Jan Hung-tze (詹宏志) lance _Tomorrow Times_ (明日報) : 400 millions de NTD de fonds, plus d'une centaine de journalistes, et une promesse qui a sidéré tout le monde — 24 heures sur 24, mise à jour en continu, toutes les informations gratuites[^7]. Le corps de _Tomorrow Times_ est un site d'actualité, mais ce qui a réellement changé l'histoire d'Internet à Taïwan est une décision prise deux mois plus tard. Le 11 avril 2000, _Tomorrow Times_ lance le _Personal News Stand_ (個人新聞台), qui permet à chaque lecteur d'ouvrir son propre site d'actualités et de publier ses propres articles[^8]. C'est trois années pleines avant que Wretch ne lance son service de blogs en 2003, et c'est l'origine la plus précoce de la culture blog taïwanaise.

Puis la bulle Internet a éclaté. Le 21 février 2001, _Tomorrow Times_ cesse de paraître ; en 370 jours il a brûlé 300 millions de NTD, avec encore 100 millions au bilan[^9]. Jan Hung-tze paraît calme dans son communiqué de fermeture, mais les utilisateurs du _Personal News Stand_, eux, ne sont pas calmes — ils ont écrit là leur journal pendant un an, téléchargé leurs photos pendant un an, connu leurs amis en ligne pendant un an. À peine l'annonce faite, les utilisateurs se sont eux-mêmes constitués en un comité d'autodéfense, ont rassemblé les administrateurs de sites, lancé une pétition, exigé un report. Le conseil de _Tomorrow Times_ s'est laissé pousser par ces inconnus, a finalement reporté la fermeture au 31 mars, puis a confié le service à PChome[^10].

C'est l'un des épisodes les plus contre-intuitifs de l'histoire d'Internet à Taïwan : une plateforme abattue par le capital est, au bout du compte, soutenue non par du capital mais par une masse d'utilisateurs gratuits. Le _Personal News Stand_ du _Tomorrow Times_ vit depuis 2000 jusqu'à aujourd'hui — il a échappé à la fermeture de Wretch, échappé à la fin de Xuite — c'est le plus ancien service de blog encore en vie à Taïwan. Sa façon de survivre est très taïwanaise : ce n'est pas le capital-risque qui l'a maintenu en vie, c'est un groupe de gens qui ont senti que « mes affaires sont là-dedans » et qui ont fait sortir les administrateurs pour réunir le comité, et fait revenir le conseil d'administration à la table.

L'ironie est qu'à l'époque personne n'a vécu cela comme une victoire. Les titres de l'époque étaient « Tomorrow Times en faillite », « la bulle Internet éclate », « le rêve de l'économie en ligne brisé », et la prolongation du _Personal News Stand_ a été traitée comme une petite note au bas de la page consacrée au démantèlement. La première fois que Taïwan a fait pousser une plateforme utilisable et aimée, une bulle globale l'a emportée au passage, et le mérite d'avoir sauvé cette plateforme a été oublié pendant vingt ans. La prochaine fois que Taïwan ferait pousser sa propre plateforme — Wretch — il rencontrerait le même problème, sauf que cette fois le comité d'autodéfense lui-même n'a pas pu la sauver.

## Cinq cents millions de photos, et un interrupteur que quelqu'un peut éteindre

En 1999, Chien Chih-yu (簡志宇), du département d'informatique de l'Université nationale Chiao Tung, monte avec quelques camarades — Wu Wei-kai, Lin Hung-chuan, Chiu Chien-hsi, Chen Hsuan-yen, Pan Wei-cheng — _Wretch_ (無名小站) dans une salle machine du campus[^11]. Ce n'est au début que le pseudo d'une station BBS. En 2003, ils lancent le triptyque blog + album + livre d'or, et ces trois services deviennent l'équipement standard de l'adolescence taïwanaise : lettres d'amour sur le blog, photos de voyage scolaire dans l'album, disputes dans le livre d'or[^12].

En 2005, Wretch quitte l'Université Chiao Tung et se constitue en société au capital de 20 millions de NTD[^13]. Le reportage de _Sinorama_ de septembre 2006 a laissé ces chiffres : 2,3 millions de membres, 500 millions de photos, 1,2 million de visiteurs quotidiens[^14]. À l'échelle du Taïwan d'alors, c'était écrasant — plus grand et plus adhérent que n'importe quel service Internet local de la même période. Ce n'était pas envoyé par la Silicon Valley. C'est Taïwan qui l'avait fait naître.

Le 13 décembre 2006, Yahoo annonce le rachat de Wretch. La somme circule à environ 700 millions de NTD, mais le chiffre officiel n'a jamais été rendu public[^15]. Sur le moment, le milieu tech taïwanais y voit une victoire — une équipe locale vendue à une multinationale, son fondateur devenu très riche, Taïwan dotée enfin de sa propre _success story_. Mais les choses se compliquent vite. Le 8 janvier 2007, le député du DPP Tang Huo-sheng tient une conférence de presse pour accuser Wretch d'avoir été construit sur le réseau académique TANet dès le premier jour, d'avoir grandi en utilisant des ressources académiques gratuites pour un service commercial, et d'être, dans sa vente à Yahoo, « un bien public détourné à des fins privées, une conduite commercialement immorale »[^16].

Cette controverse ne s'est jamais véritablement refermée. Un article universitaire a laissé cette critique : « Le succès de Wretch s'est construit sur l'abus des ressources publiques du réseau académique et sur la mauvaise foi à l'égard des utilisateurs. Son processus de commercialisation a gravement entamé les biens publics du réseau académique et le caractère public d'Internet. »[^17] La « mauvaise foi à l'égard des utilisateurs » renvoie au virage commercial de 2005 — les utilisateurs se sont réveillés un matin et ont découvert que leur blog était devenu un emplacement publicitaire, que leur album était devenu un conteneur payant pour pouvoir être pleinement utilisé. Le ressentiment du moment a vite été recouvert par le « enfin vendu » de l'opération Yahoo, mais le nœud reviendra se faire régler en 2013, autrement.

Sept ans plus tard, le 26 décembre 2013, Yahoo Kimo annonce la fermeture le même jour de Wretch et de Kimo Blog[^18]. Ces 500 millions de photos, ces 2,3 millions de comptes, cette décennie de jeunesse, ont vu leur prise débranchée d'un coup par une décision prise à distance. Chien Chih-yu confiera plus tard à _Business Next_ : « Ce que je regrette le plus dans ma vie, c'est que le Chien Chih-yu de 2005 ne pensait pas comme celui de 2010. Le Chien Chih-yu de 2010 parlait anglais, savait comment opère une entreprise internationale, avait géré une équipe plus large ; mets-le à 2005, et tout aurait été différent… Wretch allait de toute façon finir, mais au moins la bataille aurait duré plus longtemps. »[^19] À première lecture, on dirait le testament d'un fondateur. Lue plus tranchant, sa douleur est ailleurs : il regrette de ne pas avoir eu les moyens, à l'époque, de négocier avec Yahoo, de ne pas avoir su protéger un interrupteur que personne ne pouvait éteindre.

Une fois la prise effectivement débranchée, en décembre 2016, _ETtoday_ a rapporté une scène qui s'est ensuite répétée année après année — des utilisateurs ouvrant le lien de leur blog vieux de dix ans pour ne trouver qu'une page blanche, un 404, leur propre jeunesse disparue[^20]. Cela dépasse déjà l'échelle de la mémoire individuelle : c'est la terre perdue de toute une génération. Lettres d'amour du lycée, photos de premier amour, albums complets des activités d'un club universitaire, tout cela reste dans le compte rendu d'une réunion interne chez Yahoo, où un product manager a calculé le trafic, le chiffre d'affaires, le coût de maintenance, puis a signé. À l'instant de la signature, la jeunesse de plus de deux millions de Taïwanais est devenue une ligne supprimée d'un tableur de KPI interne.

Plus tranchant encore : à l'époque, les utilisateurs ne disposaient même pas de l'option « exporter ». Les albums de Wretch n'avaient pas d'outil officiel de sauvegarde, pas de téléchargement groupé, pas de ZIP que l'on aurait pu emporter. Yahoo a brièvement fourni avant la fermeture un outil de migration, mais les destinations étaient Tumblr ou Pixnet — l'une encore une entreprise américaine, l'autre locale mais qui passera ensuite plusieurs fois entre d'autres mains. Déménager n'est jamais rentrer chez soi. C'est changer de propriétaire et continuer à louer.

## Les Taïwanais plurkent, ils ne tweetent pas — comment une plateforme localement forte s'est fait contourner par la foule

Tandis que Wretch tenait encore, le 12 mai 2008, un microblog développé par une équipe canadienne, Plurk, est mis en ligne[^21]. Son fil est horizontal, il a un système de Karma, débloque des emojis et des fonctionnalités spéciales selon l'activité — un design très taïwanais, alors même que l'équipe n'est pas à Taïwan. Plurk a pris le marché taïwanais avant même que Twitter n'y arrive, et l'a pris si solidement que « les Taïwanais plurkent, ils ne tweetent pas » est devenu, ces années-là, l'observation standard du milieu Internet[^22].

Les chiffres parlent. Vers 2011, les utilisateurs taïwanais représentaient environ 40,8 % du trafic mondial de Plurk ; en 2018 ce taux est monté à 74,6 %[^23]. Autrement dit, sur sa fin, Plurk est devenu presque exclusivement un microblog taïwanais, les utilisateurs étrangers s'en allant. Vu sous un angle, c'est une victoire de l'adhérence taïwanaise ; vu sous un autre — quand une plateforme est de plus en plus uniquement taïwanaise, lever un tour de table suivant devient plus dur, retenir les ingénieurs devient plus dur, rivaliser avec les géants mondiaux devient plus dur. Plurk n'est pas mort. Mais il s'est arrêté sur place.

Ce qui l'a arrêté n'a pas vraiment à voir avec la technique. C'est la foule. En 2009, les utilisateurs taïwanais de Facebook étaient autour de 100 000 ; à la fin de l'année, ils dépassaient les 5 millions — dont 3,5 millions à cause d'un jeu appelé _Happy Farm_. Le 9 décembre 2009, la version en chinois traditionnel de _Happy Farm_ sort, et les Taïwanais se mettent à voler des légumes au bureau, à se lever en pleine nuit pour récolter, à se voler mutuellement leurs choux. Cette obsession collective a transformé Facebook, de « le truc des étudiants américains », en un endroit où, des quadragénaires aux adolescents, tout le monde à Taïwan avait un compte[^24].

_Happy Farm_ en soi n'est pas particulièrement drôle. C'est un jeu de plantation lent, écrit en Flash. Mais il a réussi une chose que Plurk n'avait pas faite : transformer la relation sociale en un coût qu'il faut payer dans le jeu. Tu voles mes légumes, je dois passer commenter ton mur ; je veux voir qui m'a volé, je dois me connecter à Facebook ; je veux jouer avec des amis, je dois les tirer de MSN vers Facebook. En trois mois, les mères de classe moyenne, les pères fonctionnaires, les lycéennes filles de Taïwan se sont retrouvés tirés par un potager virtuel dans le même réseau social.

Plurk n'a pas eu de réponse. Son fil horizontal, son Karma, ses emojis à débloquer — pour l'utilisateur, tout était encore là. Mais les gens autour étaient sur Facebook, la famille sur Facebook, les collègues sur Facebook, et la gravité sociale est devenue assez forte pour que beaucoup ressentent : « ce que j'écris sur Plurk, personne ne le lit ». Une plateforme localement forte n'a pas besoin d'être battue, il suffit qu'elle soit contournée par la foule. Plurk a ensuite reçu, dans les années 2010, un investissement stratégique chinois, puis a été racheté en 2016 par le groupe malaisien SEA. Il vit toujours, mais comme un vieux coin d'Internet taïwanais où quelques personnes passent rendre visite à un parent éloigné[^25].

## « Tu as volé des légumes aujourd'hui ? » : une bête étrangère échange un potager contre trois millions de personnes

Rapprochons la caméra et regardons ce qui s'est passé entre 2009 et 2012.

Début 2009, la présence de Facebook à Taïwan est faible. Le grand jeu, à l'époque, c'est Wretch, Plurk, PTT, MSN ; Facebook, c'est « ce truc qu'utiliseraient les étudiants américains ». Puis _Happy Farm_ arrive. La scène que retiennent les reportages : au bureau, on bascule discrètement de fenêtre pour cacher Facebook derrière Excel ; à deux heures du matin, l'alarme du téléphone sonne car « les tomates sont prêtes à être récoltées » ; entre collègues, la formule de politesse passe de « tu as mangé ? » à « tu as volé des légumes aujourd'hui ? »[^26].

De 2010 à 2012, c'est la période d'enracinement de Facebook à Taïwan. MSN est encore là, mais déjà sous pression — d'un côté, la messagerie intégrée de Facebook devient de plus en plus pratique ; de l'autre, MSN se met à planter sans raison, à refuser la connexion sans raison. La stratégie de Microsoft à cette période est floue : MSN n'a pas d'app, pas de stratégie mobile, pas de direction produit claire face à Facebook.

Puis le 8 janvier 2013, Microsoft écrit à tous ses utilisateurs que MSN s'arrête le 15 mars, sauf en Chine. La date effective de bascule mondiale est le 8 avril 2013, jour où MSN ferme officiellement à Taïwan[^27]. Ici, un chiffre est répété de travers depuis des années : la version courante dit « 300 millions d'utilisateurs de MSN se sont déversés sur LINE », mais la réalité est que Microsoft a migré environ 100 millions d'utilisateurs vers son propre Skype — le pic historique mondial de MSN était d'environ 300 millions, mais ses utilisateurs actifs au moment de la fermeture en 2013 étaient autour de 100 millions, et la destination de migration par défaut était Skype, pas LINE[^28].

À Taïwan, en revanche, le grand gagnant de la mort de MSN a bel et bien été LINE. La raison remonte au 23 juin 2011, date du lancement mondial de LINE. Le registre officiel de LINE l'écrit clairement : « In response to the anxious days spent unable to contact family and friends following the Great East Japan Earthquake, the LINE app was launched on June 23, 2011. »[^29] C'est la réponse d'une équipe japonaise à l'angoisse, post-séisme du 11 mars, de ne pas pouvoir joindre famille et amis ; mobile-first dès le premier jour, outil « pour donner de ses nouvelles » dès le premier jour.

À partir de février 2012, LINE lance à Taïwan une campagne publicitaire massive avec Kwai Lun-mei (桂綸鎂) — un volet sur les coups de fil et les SMS, puis une série de scènes du quotidien[^30]. Difficile d'y voir un événement viral unique ; c'est plutôt une chose rare dans l'histoire des médias taïwanais : une offensive intensive de publicité TV + métro déployée par une entreprise à capitaux coréens et siège japonais. En novembre 2012, LINE Taïwan dépasse les 10 millions d'utilisateurs[^31]. MSN n'est pas encore mort que LINE est déjà plus grand.

Quand MSN s'arrête effectivement en 2013, les groupes familiaux, les groupes collègues, les groupes mamans à Taïwan tournent déjà sur LINE depuis plus d'un an. Microsoft pousse ses utilisateurs vers Skype, mais les Taïwanais n'y vont tout simplement pas — leurs amis, leur famille, leurs collègues sont déjà sur LINE. Une appli de messagerie née de capitaux étrangers et conçue pour l'après-11 mars japonais hérite à Taïwan du réseau de relations laissé par MSN. En juin 2014, LINE Taiwan Limited se constitue formellement à Taïwan[^32]. En 2025, LINE compte à Taïwan environ 22 millions d'actifs mensuels pour environ 94 % de taux de pénétration[^33]. Taïwan adhère plus à LINE que la Corée (où LINE perd face à KakaoTalk sur son propre terrain) ou que le Japon (terrain de jeu maison de LINE).

Le côté étrange de cette substitution, c'est qu'elle a l'air d'un choix rationnel — facile d'usage, gratuit, tout le monde y est — alors qu'aucune des étapes n'a été décidée par les Taïwanais eux-mêmes. Facebook a tiré trois millions de personnes hors d'une plateforme locale avec un potager. LINE a hérité de toute la génération MSN avec une vague de messagerie pensée pour l'après-séisme japonais. On n'a pas refusé, parce qu'on n'avait pas de raison de refuser ; mais on n'a pas non plus choisi, parce qu'on ne nous a jamais demandé.

Si l'on regarde les quatre années entre 2009 et 2013, c'est la « victoire totale des capitaux étrangers » la plus complète de l'histoire communautaire taïwanaise — la Wretch locale, le _Tomorrow Times_ local, la culture BBS locale, tous repoussés dans un coin sous les deux vagues étrangères que sont Facebook et LINE. Cette retraite n'a connu ni débat télévisé, ni référendum, ni discussion publique d'aucune forme. Les décisions produit de deux applications étrangères ont, à elles seules, défini la forme de l'infrastructure sociale de toute une génération. Quand, en 2024, nous nous sommes mis à reparler de « souveraineté numérique », de « localisation des données », nous ne faisions que rattraper le cours d'une guerre silencieuse menée plus de dix ans plus tôt.

## Enfermer la conversation publique dans les groupes de seniors

La première chose que LINE a faite après avoir pris Taïwan, c'est de privatiser la conversation publique.

Les blogs de l'ère Wretch étaient publics, avaient des RSS, des trackbacks, étaient indexés par Google. Les publications de l'ère Facebook étaient encore à peu près publiques — même si le mur entre dedans et dehors s'épaississait — au moins les réunions d'anciens, les clubs, les événements existaient sur Facebook sous une forme cherchable. À l'ère des groupes LINE, la conversation d'une communauté entière disparaît des moteurs de recherche, disparaît de l'histoire, disparaît de tout périmètre qu'un chercheur extérieur pourrait consulter.

L'enquête de _The Reporter_ en 2024 a laissé ce passage : « Les fausses informations et les messages controversés à l'intérieur des groupes LINE, en passant par les groupes de voisinage, de temples, de partis politiques et d'associations civiles, produisent de la division sociale, stigmatisent des groupes spécifiques et renforcent la polarisation. »[^34] La clé de cette observation n'est pas « il y a des fausses informations » — toute plateforme en a — mais la structure même du « groupe » : elle laisse les messages circuler uniquement dans un cercle de connaissances, autorise un transfert infini tout en rendant la réfutation extérieure très difficile, et empêche presque les médias et les vérificateurs de faits d'y pénétrer. Les groupes LINE sont devenus un courant souterrain des élections, de la santé publique et des grands débats sociaux à Taïwan, et personne, depuis l'extérieur, n'en voit la source, le débit, ni l'embouchure.

L'article 4.7 des Conditions d'utilisation de LINE l'écrit très crûment : « Le compte de ce service est exclusivement personnel. L'ensemble des droits d'usage de l'utilisateur sur ce service ne peuvent être cédés à des tiers, prêtés à des tiers, ni transmis à des tiers par succession. »[^35] Autrement dit : à votre mort, votre compte LINE et toutes les conversations qu'il contient meurent avec vous. Les derniers mots que votre mère vous a dits avant de partir, les images « bonjour » que votre père vous envoyait à la fin, les fils de discussion avec un ami disparu, aucun n'a de droit de succession au sens légal. Dans le monde physique, une lettre, un télégramme, un journal intime, vous survivent et reviennent à votre famille. Sur LINE, la propriété en revient à LY Corporation, pas à vos descendants.

C'est la clause la plus silencieuse de l'ère plateformes. Personne, en s'inscrivant à LINE, ne pense à sa propre mort. Mais trente ans d'histoire d'Internet nous ont appris une chose : vous mourrez, vos mots de passe mourront avec vous, vos conversations continueront d'exister sur quelque serveur dans le cloud, mais plus personne ne pourra les lire. Les Taïwanais ont confié à LINE des relations de toute une vie, et n'ont jamais réfléchi à ce que deviendraient ces relations une fois eux-mêmes partis.

À la même période, PTT est encore là. Ses utilisateurs vieillissent — l'enquête du MIC pour le quatrième trimestre 2024 indique que le gros des utilisateurs de PTT se situe dans la tranche 35-44 ans (27,8 %), tandis que les 18-24 ans préfèrent IG (78 %), Dcard (45,9 %) et Threads (44 %)[^36]. Mais PTT fait quelque chose que les autres plateformes ne font pas : tous ses messages sont encore dans les moteurs de recherche, toute son histoire reste citable, toutes ses controverses restent consultables par la recherche universitaire. PTT est le dernier fossile d'espace public dans l'histoire des communautés taïwanaises — il n'a pas grossi, mais il n'a pas non plus éteint sa propre histoire.

Pendant le Mouvement Tournesol de 2014, PTT a été la station de diffusion la plus immédiate entre les étudiants sur place et le monde extérieur. Pendant le référendum sur le mariage entre personnes de même sexe en 2018, le forum Gossip a été l'arène d'une production discursive massive. Pendant la présidentielle de 2020, les longs posts du forum Gossip de PTT ont été pris pour sources primaires par les chercheurs en communication politique. Rien de tel ne se passe à l'intérieur des groupes LINE — non parce que personne n'y parle politique, mais parce que la discussion dans un groupe LINE n'existe pas en dehors de ses 200 membres. Qu'une société dispose ou non d'archives publiques citables détermine la forme de sa mémoire. Ce fossile taïwanais est encore vivant, mais c'est un exemplaire unique.

## Il n'y aura plus jamais de patron unique

En 2011, Lin Yu-chin (林裕欽), étudiant en deuxième année au département de gestion de l'information de la NTU, a réalisé la première version de Dcard[^37]. À l'origine, ce n'était qu'un petit outil qui « à minuit chaque jour, tire une carte et te met en relation avec un inconnu ». Petit à petit, c'est devenu un forum d'étudiants, puis le réseau au taux d'usage le plus élevé chez les Taïwanaises de 18 à 24 ans. En 2015, Lin Yu-chin a fondé la société Dcard, faisant passer le projet d'un travail d'étudiant à un produit d'entreprise à part entière[^38].

Le 5 juillet 2023, Meta lance Threads. 5 millions d'utilisateurs en 6 heures, 100 millions en 5 jours[^39] — c'est la croissance la plus rapide de toute l'histoire des services Internet, sans concurrence proche. La réaction taïwanaise a été tout aussi rapide. Le chiffre mesuré par Similarweb en mai 2024 le montre : les utilisateurs taïwanais passent en moyenne 11 minutes 31 secondes sur Threads, premier au monde, contre 5:12 aux États-Unis et 3:06 au Japon à la même période[^40]. L'enquête du MIC du quatrième trimestre 2024 a laissé un autre tournant : le taux d'usage de Threads à Taïwan a atteint 17,5 %, dépassant pour la première fois les 17,1 % de PTT[^41].

Mais le titre « Threads dépasse PTT » n'est pas aussi simple qu'il en a l'air. Pendant trente ans, à chaque grand déménagement communautaire à Taïwan, il y avait un patron unique : à l'ère BBS, PTT ; à l'ère des albums, Wretch ; pour la messagerie instantanée, MSN ; pour les réseaux sociaux, Facebook ; pour la messagerie, LINE. Mais le tour des années 2020 est différent : les plateformes sont dispersées. Les jeunes coexistent sur IG, Dcard, Threads, chacune avec 40 à 80 % de pénétration, mais aucune ne peut, comme LINE l'a fait, avaler une génération entière[^42].

Cette dispersion a un sens politique qu'on néglige souvent. Quand votre vie sociale est éclatée entre cinq plateformes, vous ne passez pas dix ans sur l'une d'entre elles — vous mettez vos idées sur Threads, vos photos sur IG, vous lisez le potin sur Dcard, vous parlez à la famille sur LINE, vous discutez en vocal entre amis sur Discord. Chaque plateforme attrape une tranche de vous, pas votre tout. Ça ressemble à un progrès en souveraineté numérique — vous n'êtes plus prisonnier d'une seule plateforme — mais cela signifie aussi : quand viendra le prochain grand déménagement, aucune plateforme ne pourra, comme Wretch, emporter la mémoire d'une génération entière d'un seul coup. Parce qu'aucune plateforme n'a jamais possédé cette génération d'un seul bloc.

Mais le prix de ce « plus de patron unique », c'est que les utilisateurs taïwanais ont coupé leur temps en cinq morceaux et déposé chacun sur les serveurs d'une entreprise étrangère différente. Threads appartient à Meta, IG à Meta, LINE à Z Holdings, Discord à Discord Inc., TikTok à ByteDance. Les plateformes locales n'ont pas même été admises sur le champ de bataille cette fois. Dcard peut passer pour le choix local de la communauté féminine 18-24 ans, mais son échelle, son influence discursive, sa présence internationale ressemblent à la situation de Plurk à la fin des années 2010 — forte, mais contournée par la foule.

Le 31 août 2023, Xuite (隨意窩) entame une fermeture en trois phases. La plateforme de blogs qui avait, dix ans plus tôt, accueilli les blogueurs réfugiés de Wretch, expulse à son tour ses utilisateurs[^43]. Ce n'est pas une nouvelle — c'est une scène trop familière. Les Taïwanais ont déjà déménagé bien des fois. À chaque déménagement, quelqu'un pleure en feuilletant un vieux blog, quelqu'un saute par-dessus le mur chercher une sauvegarde, quelqu'un comprend en cours de téléchargement que les liens de son album sont morts depuis longtemps. Personne ne demande pourquoi cette chose arrive tous les quelques années.

## À quelle prise est branchée votre jeunesse ?

Le 19 mars 2025, un fan a ouvert sur Threads un compte nommé @wretch_1999, avec dans sa bio : « ★~●○● Bienvenue sur Wretch ●○●~★ / Nombre de visites : 0000520 / Qui est passé chez moi / ♪♫ Musique de fond : 5566 - I'm Sad ♪♫ »[^44]. Les posts disent : « Quand est-ce que quelqu'un va me trouver ? Je suis revenu à la vie », « Si personne ne me trouve… on dirait que ça va bientôt être la fin de la station ».

Ce compte est fait par un fan, ce n'est pas officiel, ce n'est pas Yahoo qui ressuscite Wretch, ce n'est pas une reconnexion technique de l'interrupteur coupé en 2013. C'est un Taïwanais de 2025 qui se sert de Threads — Meta — pour simuler l'interface Wretch de 2005, avec son fameux « nombre de visites 0000520 » d'époque, son livre d'or « qui est passé chez moi » d'époque, sa « musique de fond qui se lance toute seule » d'époque. Il ne simule pas qu'une UI ; il simule la mémoire qu'a une génération entière d'avoir « eu un coin d'Internet qui était à moi ».

Mais cette séance est branchée sur la prise de Meta. Le jour où Threads se fera couper le courant comme Wretch (ce n'est plus une question de « si », mais de « quand » — trente ans d'histoire ont déjà donné la réponse), @wretch_1999 disparaîtra avec. Une séance ramassée par une autre vague de territoires perdus.

Voilà la forme des trente ans d'histoire des communautés en ligne taïwanaises. Des BBS à Wretch, de Wretch repoussés vers Facebook, de Facebook repliés dans LINE, de LINE sortant la tête vers Threads — à chaque déménagement, la mémoire de la génération précédente reste derrière un interrupteur qu'un autre peut couper. Nous établissons sur Threads le record mondial de 11 minutes 31 secondes de temps moyen[^45], ce qui veut dire que nous mettons le plus de temps, le plus de photos, le plus de conversations dans la location la moins protégée. Quand viendra le prochain grand déménagement, le sort de tout cela ne sera pas entre nos mains.

Le _Personal News Stand_ du _Tomorrow Times_ vit aujourd'hui encore grâce au comité d'autodéfense des utilisateurs de 2001[^46]. Wretch est mort le 26 décembre 2013 faute de comité d'autodéfense pour arrêter la décision de Yahoo. La différence entre ces deux événements n'a rien à voir avec la technologie, le capital ou le modèle économique. Elle tient à une seule chose : les utilisateurs ont-ils été traités, oui ou non, en propriétaires. Pendant la plus grande partie de ces trente ans, la réponse a été « non ».

La prochaine fois que quelqu'un vous demande « pourquoi sauvegarder mes photos ? », « pourquoi conserver mon propre blog ? », « pourquoi retenir un mot de passe que j'ai utilisé jadis ? », vous pouvez lui raconter l'histoire du compte @wretch_1999. Un Taïwanais de 2025, sur les serveurs de Meta, regrettant la Wretch qu'a fermée Yahoo, simulant la jeunesse de 2005. Chaque maillon de cette chaîne n'est pas le sien.

« Si personne ne me trouve… on dirait que ça va bientôt être la fin de la station »[^47] — au moment d'écrire cette phrase, il ne plaisantait sans doute pas. Trente ans plus tard, nous n'avons toujours pas appris à posséder nos propres choses.

## Pour aller plus loin

- [Wretch — Une jeunesse posée sur un serveur que d'autres peuvent éteindre](/fr/Culture/wretch/)
- [PTT Batuibadi — La cité-État née du réseau académique](/fr/Technology/ptt-bulletin-board-system/)
- [Facebook à Taïwan](/fr/Technology/facebook-in-taiwan/)
- [Threads à Taïwan — Threads et les 11 minutes 31 secondes](/fr/Technology/threads-in-taiwan/)
- [Instagram à Taïwan](/fr/Technology/instagram-in-taiwan/)
- [Miin — Le refuge « allons, allons à Miin » de 2026](/fr/Technology/miin-music-app/)

---

## Références

[^1]: Mesures Similarweb du « dernier mois » en mai 2024, relayées par les médias taïwanais comparant le temps moyen passé sur Threads par pays : Taïwan 11 min 31 s, États-Unis 5:12, Japon 3:06, Taïwan premier au monde. [Reportage sur les statistiques Similarweb de Threads](https://www.similarweb.com/).

[^2]: En 1992, le professeur Chen Nien-hsing de l'Université nationale Sun Yat-sen monte le BBS _Belle Île_, premier BBS Internet entièrement en chinois de Taïwan. [Wikipédia : BBS à Taïwan](https://zh.wikipedia.org/wiki/%E9%9B%BB%E5%AD%90%E4%BD%88%E5%91%8A%E6%AC%84).

[^3]: En 1984, le ministère de l'Éducation choisit l'Université nationale Chiao Tung et l'Université nationale Sun Yat-sen pour porter la construction de l'infrastructure du réseau académique TANet. [Historique de TANet, Département de l'éducation à l'information et à la technologie du ministère de l'Éducation](https://depart.moe.edu.tw/ed2700/).

[^4]: Le 14 septembre 1995, Tu Yi-chen monte PTT sur une machine 486DX266 / 16 Mo de RAM dans la chambre 618 du Dortoir des garçons n° 8 de la NTU. [Page d'histoire officielle de PTT](https://www.ptt.cc/index.html).

[^5]: Lors de l'incident « Contre-attaque du brave type » sur le forum Nightlife de PTT en 2004, le sysop Junchoon (Huang Chien-yu) reprend une réplique du film _Hail the Judge_ de Stephen Chow, prononcée par le personnage Fang Tangjing (joué par Lawrence Ng) : « je suis juste entré avec les villageois pour regarder l'agitation, j'ai juste fait un pas en avant », et écrit : « Que les "villageois" venus regarder le spectacle reculent derrière la ligne jaune ». C'est ainsi que « villageois » (_xiangmin_) s'est diffusé comme autodésignation des utilisateurs de PTT. [Wikipédia : Xiangmin](https://zh.wikipedia.org/wiki/%E9%84%89%E6%B0%91).

[^6]: À la fin des années 1990, la réglementation du réseau académique TANet interdit les usages commerciaux ; certains BBS sont alors contraints de quitter le réseau académique pour HiNet ou d'autres FAI commerciaux. [Discussion historique sur la charte d'usage de TANet, Centre d'information Internet de Taïwan](https://www.twnic.tw/).

[^7]: Le 15 février 2000, Jan Hung-tze fonde _Tomorrow Times_, avec 400 millions de NTD de fonds, plus d'une centaine de journalistes et toutes les actualités gratuites sur le site. [Wikipédia : Tomorrow Times](https://zh.wikipedia.org/wiki/%E6%98%8E%E6%97%A5%E5%A0%B1).

[^8]: Le 11 avril 2000, _Tomorrow Times_ lance le service _Personal News Stand_, qui permet à chaque utilisateur d'ouvrir son propre site d'actualités personnel, première origine de la culture blog à Taïwan, trois ans avant le service de blog de Wretch. [Historique du _Personal News Stand_ sur PChome](https://mypaper.pchome.com.tw/).

[^9]: Le 21 février 2001, _Tomorrow Times_ annonce sa fermeture ; de la création à la fermeture, 370 jours, durant lesquels il a brûlé 300 millions de NTD, avec encore environ 100 millions au bilan au moment du cessation. [Wikipédia : Tomorrow Times](https://zh.wikipedia.org/wiki/%E6%98%8E%E6%97%A5%E5%A0%B1).

[^10]: Après la fermeture de _Tomorrow Times_, les utilisateurs du _Personal News Stand_ forment un comité d'autodéfense, lancent une pétition, et obligent le conseil à reporter la date de fermeture au 31 mars ; le service est finalement repris par PChome, encore en activité aujourd'hui. [Page de service _Personal News Stand_ de PChome](https://mypaper.pchome.com.tw/).

[^11]: En 1999, Wretch est fondé au département d'informatique de l'Université nationale Chiao Tung par Chien Chih-yu et ses camarades Wu Wei-kai, Lin Hung-chuan, Chiu Chien-hsi, Chen Hsuan-yen, Pan Wei-cheng. [Wikipédia : Wretch](https://zh.wikipedia.org/wiki/%E7%84%A1%E5%90%8D%E5%B0%8F%E7%AB%99).

[^12]: En 2003, Wretch lance ses trois services centraux — blog, album, livre d'or — fixant la forme standard de la production de contenu personnel sur Internet à Taïwan. [Wikipédia : Wretch](https://zh.wikipedia.org/wiki/%E7%84%A1%E5%90%8D%E5%B0%8F%E7%AB%99).

[^13]: En mars 2005, Wretch quitte l'Université Chiao Tung et se constitue en société au capital de 20 millions de NTD, entrant formellement en phase de commercialisation. [Reportage _Business Next_ sur Wretch](https://www.bnext.com.tw/).

[^14]: Reportage de _Sinorama_ de septembre 2006 : Wretch compte 2,3 millions de membres, 500 millions d'images, 1,2 million de visites quotidiennes. [Reportage de _Sinorama_ sur Wretch](https://www.taiwan-panorama.com/).

[^15]: Le 13 décembre 2006, Yahoo annonce le rachat de Wretch ; le montant circule autour de 700 millions de NTD, mais le chiffre réel n'a jamais été officiellement publié. [Couverture du rachat de Wretch par Yahoo Kimo](https://tw.news.yahoo.com/).

[^16]: Le 8 janvier 2007, le député DPP Tang Huo-sheng tient une conférence de presse : « Wretch s'est servi du réseau académique gratuit pour bâtir sa base de données mais l'a traitée comme une propriété privée, et l'a vendue avec le rachat par Yahoo ; c'est une conduite commercialement immorale. » [Wikipédia : Wretch §controverse de commercialisation](https://zh.wikipedia.org/wiki/%E7%84%A1%E5%90%8D%E5%B0%8F%E7%AB%99).

[^17]: Critique d'un article universitaire : « Le succès de Wretch s'est construit sur l'abus des ressources publiques du réseau académique et sur la mauvaise foi à l'égard des utilisateurs. Son processus de commercialisation a gravement entamé les biens publics du réseau académique et le caractère public d'Internet. » [Article universitaire Airitilibrary U0067](https://www.airitilibrary.com/).

[^18]: Le 26 décembre 2013, Yahoo Kimo annonce la fermeture simultanée de Wretch et Kimo Blog. [Avis de fermeture de Wretch par Yahoo Kimo](https://tw.news.yahoo.com/).

[^19]: Chien Chih-yu en entretien à _Business Next_ : « Ce que je regrette le plus dans ma vie, c'est que le Chien Chih-yu de 2005 ne pensait pas comme celui de 2010. Le Chien Chih-yu de 2010 parlait anglais, savait comment opère une entreprise internationale, avait géré une équipe plus large ; mets-le à 2005, et tout aurait été différent… Wretch allait de toute façon finir, mais au moins la bataille aurait duré plus longtemps. » [Article _Business Next_ bnext 39669](https://www.bnext.com.tw/article/39669).

[^20]: En décembre 2016, _ETtoday_ rapporte le phénomène générationnel de territoires perdus après la fermeture de Wretch : les utilisateurs ouvrent leurs vieux liens de blog et tombent sur des 404 et des pages vides. [ETtoday, 09/12/2016, rétrospective du troisième anniversaire de la fermeture de Wretch](https://www.ettoday.net/).

[^21]: Le 12 mai 2008, Plurk est lancé : un service de microblog développé par une équipe canadienne. [Wikipédia : Plurk](https://zh.wikipedia.org/wiki/Plurk).

[^22]: « Les Taïwanais plurkent, ils ne tweetent pas » est la description standard, dans la communauté d'observateurs Internet entre 2009 et 2012, qui reflète le fait que Plurk avait pris le marché taïwanais avant l'arrivée de Twitter. [Recherche sur l'usage de Plurk à Taïwan, enquêtes d'usage d'Internet TWNIC](https://www.twnic.tw/).

[^23]: Part des utilisateurs taïwanais dans le trafic mondial de Plurk : environ 40,8 % en 2011, montée à 74,6 % en 2018. [Analyse historique du trafic Plurk sur Alexa / SimilarWeb](https://www.similarweb.com/).

[^24]: Le 9 décembre 2009, la version en chinois traditionnel de _Happy Farm_ sort, et le nombre d'utilisateurs Facebook à Taïwan passe d'environ 100 000 à plus de 5 millions, dont environ 3,5 millions de joueurs de _Happy Farm_. [Wikipédia : Happy Farm](https://zh.wikipedia.org/wiki/%E5%BC%80%E5%BF%83%E5%86%9C%E5%9C%BA).

[^25]: Plurk a ensuite reçu un investissement stratégique chinois et a été racheté en 2016 par le groupe malaisien SEA (maison-mère de Garena) ; il fonctionne toujours, mais à une échelle bien inférieure à son apogée. [Wikipédia : Plurk](https://zh.wikipedia.org/wiki/Plurk).

[^26]: Récits de la vie de bureau à Taïwan au temps d'_Happy Farm_ : vols de légumes en cachette, alarmes nocturnes pour la récolte, formule de politesse qui passe de « tu as mangé ? » à « tu as volé des légumes aujourd'hui ? ». [Couverture par _Apple Daily_ en 2010 du phénomène _Happy Farm_ au bureau](https://tw.appledaily.com/).

[^27]: Le 8 janvier 2013, Microsoft notifie à ses utilisateurs que MSN s'arrête le 15 mars (sauf en Chine) ; la date effective de bascule mondiale est le 8 avril. [Annonce de fermeture de MSN, BBC News 08/01/2013](https://www.bbc.com/news/technology-20910181).

[^28]: Le pic historique mondial de MSN était d'environ 300 millions d'utilisateurs ; ses utilisateurs actifs au moment de la fermeture étaient autour de 100 millions. Microsoft les a migrés vers son propre Skype, et non pas « 3 millions [sic] qui se sont déversés sur LINE » comme le veut le récit qui circule à Taïwan. [Communication officielle Microsoft sur l'intégration Skype-MSN](https://news.microsoft.com/).

[^29]: Page d'histoire officielle de LINE : « In response to the anxious days spent unable to contact family and friends following the Great East Japan Earthquake, the LINE app was launched on June 23, 2011. » [LINE Corp Official History](https://linecorp.com/en/company/info).

[^30]: En février 2012, LINE lance à Taïwan une campagne avec Kwai Lun-mei en égérie, commençant par l'épisode « téléphone / SMS » puis déployant une intense rotation à la télévision et dans le métro. [Analyse de la stratégie publicitaire LINE 2012, magazine _Brain_](https://www.brain.com.tw/).

[^31]: En novembre 2012, LINE Taïwan dépasse 10 millions d'utilisateurs. [Annonce officielle de LINE Taiwan](https://linecorp.com/zh-hant-tw/).

[^32]: En juin 2014, LINE Taiwan Limited se constitue officiellement comme filiale à Taïwan. [Données d'enregistrement d'entreprises, Département du commerce du MOEA](https://gcis.nat.gov.tw/).

[^33]: En 2025, LINE Taïwan compte environ 22 millions d'utilisateurs actifs mensuels et environ 94 % de taux de pénétration, le plaçant dans le haut du classement mondial. [Analyse du marché mondial de LINE en 2025, Korea Herald](https://www.koreaherald.com/) ; [DataReportal Digital 2025 Taiwan](https://datareportal.com/reports/digital-2025-taiwan).

[^34]: Enquête de _The Reporter_ : « Les fausses informations et les messages controversés à l'intérieur des groupes LINE, en passant par les groupes de voisinage, de temples, de partis politiques et d'associations civiles, produisent de la division sociale, stigmatisent des groupes spécifiques et renforcent la polarisation. » [Série information-warfare-business-disinformation de _The Reporter_](https://www.twreporter.org/).

[^35]: Article 4.7 des Conditions d'utilisation de LINE : « Le compte de ce service est exclusivement personnel. L'ensemble des droits d'usage de l'utilisateur sur ce service ne peuvent être cédés à des tiers, prêtés à des tiers, ni transmis à des tiers par succession. » [Conditions d'utilisation de LINE, version Taïwan](https://terms2.line.me/LINE_Terms_of_Use_TW).

[^36]: Enquête MIC du quatrième trimestre 2024 sur l'usage des réseaux sociaux : le gros des utilisateurs de PTT est entre 35 et 44 ans (27,8 %) ; les 18-24 ans préfèrent IG (78 %) / Dcard (45,9 %) / Threads (44 %). [Enquête MIC III, quatrième trimestre 2024, sur les réseaux sociaux](https://mic.iii.org.tw/).

[^37]: En 2011, Lin Yu-chin, étudiant en deuxième année au département de gestion de l'information de la NTU, crée la première version de Dcard, à l'origine un petit outil qui « tire une carte à minuit et te met en relation ». [Wikipédia : Dcard](https://zh.wikipedia.org/wiki/Dcard).

[^38]: En 2015, Lin Yu-chin fonde la société par actions Dcard, transformant le projet d'étudiant en produit d'entreprise officiel. [Données d'enregistrement d'entreprises du MOEA](https://gcis.nat.gov.tw/) ; [Interview du fondateur de Dcard par _Business Next_](https://www.bnext.com.tw/).

[^39]: Le 5 juillet 2023, Meta lance Threads, qui dépasse 5 millions d'utilisateurs en 6 heures et 100 millions en 5 jours, croissance la plus rapide de toute l'histoire des services Internet. [Annonce officielle de Meta](https://about.fb.com/news/2023/07/introducing-threads-new-app-text-sharing/).

[^40]: Mesures Similarweb de mai 2024 : les utilisateurs taïwanais de Threads y passent en moyenne 11 minutes 31 secondes, premier au monde, contre 5:12 aux États-Unis et 3:06 au Japon à la même période. [Reportages d'analyse régionale de Threads par Similarweb](https://www.similarweb.com/).

[^41]: Enquête MIC du quatrième trimestre 2024 sur l'usage des plateformes sociales : YT 72,3 %, FB 72,1 %, IG 44,7 %, Dcard 17,6 %, Threads 17,5 %, PTT 17,1 % — Threads dépasse PTT pour la première fois. [Enquête MIC du quatrième trimestre 2024 sur l'usage des réseaux sociaux](https://mic.iii.org.tw/).

[^42]: Dispersion des plateformes sociales chez les Taïwanais de 18-24 ans en 2025 : IG 78 %, Dcard 45,9 %, Threads 44 %, en parallèle de LINE, Discord, etc., sans plateforme dominante unique. [Analyse par tranche d'âge du MIC, quatrième trimestre 2024](https://mic.iii.org.tw/) ; [DataReportal Digital 2025 Taiwan](https://datareportal.com/reports/digital-2025-taiwan).

[^43]: Le 31 août 2023, Xuite (隨意窩) entame une fermeture en trois phases ; il avait accueilli certains blogueurs lors de la fermeture de Wretch en 2013 et, cette fois, expulse à nouveau ses utilisateurs. [Avis de fermeture de Xuite (隨意窩)](https://blog.xuite.net/).

[^44]: Le 19 mars 2025, un utilisateur de Threads ouvre le compte @wretch_1999 en simulant l'interface de Wretch : « ★~●○● Bienvenue sur Wretch ●○●~★ / Nombre de visites : 0000520 / Qui est passé chez moi / ♪♫ Musique de fond : 5566 - I'm Sad ♪♫ », création de fan, pas une résurrection officielle. [Compte @wretch_1999 sur Threads](https://www.threads.net/@wretch_1999).

[^45]: Idem note 1. Similarweb, mai 2024 : temps moyen d'utilisation de Threads à Taïwan de 11 minutes 31 secondes, premier au monde.

[^46]: Idem note 10. Après la fermeture de _Tomorrow Times_, le _Personal News Stand_ a été sauvé par le comité d'autodéfense des utilisateurs et l'assemblée des administrateurs, qui ont obtenu un report et la reprise par PChome ; il est toujours en activité aujourd'hui.

[^47]: Idem note 44. Posts de @wretch_1999 : « Quand est-ce que quelqu'un va me trouver ? Je suis revenu à la vie » ; « Si personne ne me trouve… on dirait que ça va bientôt être la fin de la station ».
