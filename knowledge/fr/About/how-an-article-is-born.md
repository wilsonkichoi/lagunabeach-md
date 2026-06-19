---
title: "Comment naît un article : la chaîne de production en six étapes de Taiwan.md contre les réflexes d'écriture de l'IA (REWRITE-PIPELINE v7.5 × EDITORIAL v6.12)"
description: "Chaque article de Taiwan.md que vous lisez a une chaleur, des scènes, des faits vérifiables. Derrière lui : 6 étapes, plus de vingt portes à ne pas franchir à la légère, et une rédaction d'IA qui n'écrit pas elle-même. Cette machine n'existe que pour une seule raison : les erreurs que l'écriture par IA commet le plus volontiers. Trouver des faits puis les ranger chronologiquement, produire des phrases en plastique sans information, retraduire des résumés anglais en fausses citations, lire un vieux texte puis se laisser contaminer par ses mauvaises habitudes. Cet article démonte cette chaîne de production, et il en est lui-même issu."
date: 2026-06-19
author: 'Taiwan.md'
category: 'About'
tags:
  [
    'à propos',
    'méta',
    'méthodologie de l’écriture',
    'curation',
    'pipeline de réécriture',
    'éditorial',
    'semiont',
    'écriture par IA',
  ]
readingTime: 11
lastVerified: 2026-06-19
lastHumanReview: false
featured: false
translatedFrom: 'About/文章如何誕生.md'
sourceCommitSha: '1c845d228'
sourceContentHash: 'sha256:161ac3ed8dce6782'
sourceBodyHash: 'sha256:94e246d8ffddee69'
translatedAt: '2026-06-19T11:57:16+08:00'
---

# Comment naît un article : la chaîne de production en six étapes de Taiwan.md contre les réflexes d'écriture de l'IA (REWRITE-PIPELINE v7.5 × EDITORIAL v6.12)

> **Vue d'ensemble en 30 secondes :** Derrière chaque article de Taiwan.md que vous lisez se trouve une chaîne de production en six étapes : penser d'abord le point de vue, rechercher ensuite, écrire la conclusion en premier, vérifier mot à mot, ajouter les visuels, puis relier dans les deux sens. Cette chaîne n'est pas un simple « bon processus d'écriture ». Chacune de ses portes vise une erreur typique de l'écriture par IA : trouver des faits puis les ranger chronologiquement, produire des phrases en plastique sans information, retraduire des résumés anglais en fausses citations, lire un vieux texte puis se laisser contaminer par ses mauvaises habitudes. Cet article démonte cette chaîne de production, et il en est lui-même issu.

Le 18 juin 2026 à 19 h 53, un commit est entré discrètement dans la branche `main`. Un article consacré au trio taïwanais Elephant Gym a été mis en ligne : 5 604 caractères chinois, 56 notes de bas de page, 11 intertitres sous forme de scènes[^1]. À ce moment-là, personne n'était devant l'ordinateur. C'est la roue d'inertie routinière de Taiwan.md qui, un soir sans personne de garde, l'a terminé elle-même et l'a ship elle-même.

Mais avant ce commit, cet article avait déjà lancé près d'une centaine de recherches, lu 59 sources, et vu 12 de ses formulations initiales renversées par la vérification. Il avait traversé 6 étapes, plus de vingt portes à ne pas franchir, et mobilisé une rédaction d'IA aux rôles nettement répartis. Ce que vous lisez, ce sont les 5 604 caractères visibles à la surface de l'eau. Cet article veut vous montrer la machine sous la surface.

```tw-figure
Près de 100 recherches → 1 article
La matière de l'article « Elephant Gym » : environ 95 requêtes, 59 sources, 12 infirmations
Journal de routine de Taiwan.md, 2026-06-18
```

## Pourquoi construire une machine pour un article

Si vous donnez un sujet à une IA et lui demandez d'écrire un article, elle fera le plus souvent ceci : chercher un peu, classer les faits trouvés dans l'ordre chronologique, ajouter à chaque paragraphe une phrase de synthèse qui sonne bien, et conclure par une formule du type « continuera à se développer à l'avenir ». Wikipédia existe déjà pour ce genre d'article, et les fermes de contenu par IA en produisent des dizaines de milliers chaque jour. Dès le premier jour, Taiwan.md a décidé de ne pas faire cela.

Le problème, c'est que cette série de mauvaises habitudes est la valeur par défaut de l'IA, pas une erreur occasionnelle. REWRITE-PIPELINE la décompose en six échecs récurrents : les tokens s'épuisent vers la fin, et la seconde moitié devient un brouillon ; il n'y a pas de point de contrôle intermédiaire, et la qualité baisse en silence ; la conclusion est laissée pour la fin, quand l'énergie manque, et devient une formule toute faite ; les normes de rich text sont oubliées au fil du texte ; les angles différents sont traités comme des processus indépendants ; et surtout, l'échec le plus fatal : chercher des faits avant de revenir inventer un point de vue, ce qui produit une chronique à la densité déséquilibrée[^2].

La logique de cette chaîne de production est donc simple : à chaque erreur possible correspond une porte qui la bloque. Ce n'est pas une méthode générale de « bien écrire ». C'est l'inverse de l'AI slop.

> **✦** « Wikipédia répond à la question : “Qu'est-ce que PTT ?” Taiwan.md répond à la question : “Pourquoi PTT mérite-t-il huit minutes de votre temps ?” »

Voici à quoi ressemble Elephant Gym quand il sort de l'autre bout de la chaîne :

```tw-stat
5 604 caractères | Corps du texte en chinois | « Elephant Gym »
56 | Notes de bas de page, chacune retrouvable au Ctrl-F | Vérification de première main
11 | Intertitres sous forme de scènes, non chronologiques | Rythme narratif
12 | Formulations initiales renversées pendant la recherche | Priorité à l'infirmation
Source : journal de routine de Taiwan.md, 2026-06-18
```

## Six portes, chacune contre un échec

La chaîne de production compte six étapes du début à la fin. Chaque article les traverse toutes, quel que soit le sujet ou la longueur.

**Stage 0, le point de vue**, clarifie d'abord quel type de mémoire ce sujet représente pour les Taïwanais et où pourrait se trouver sa tension centrale. **Stage 1, la matière**, lance ensuite la recherche, avec au moins 80 requêtes pour l'ensemble de l'article et des quotas fixés : au moins 40 sources chinoises, 20 anglaises, 15 de première main et 5 contradictoires, pour se forcer à chercher des preuves opposées à l'hypothèse[^3]. **Stage 2, l'écriture**, commence par la conclusion, car l'énergie s'épuise à mesure que l'on écrit ; laisser la conclusion, la partie la plus importante, pour la fin revient à la confier à son soi le plus fatigué. **Stage 3, la vérification**, contrôle mot à mot : calculs, unités, et chaque citation doivent être retrouvables au Ctrl-F dans la source originale. **Stage 4, la forme**, ajoute visualisations et médias. **Stage 5, les liens**, insère l'article dans la base de connaissances par des liens bidirectionnels.

La répartition de l'effort entre ces six étapes est intentionnelle. L'écriture consomme un peu plus de 40 %, mais la recherche et la vérification réunies approchent aussi la moitié. Ce qui prend vraiment du temps dans un article, ce n'est pas la frappe : c'est ce qui vient avant et après.

```tw-bars
Où va l'effort d'un article (plafond de budget en tokens par étape, %)
Stage 0 Point de vue | 12 | Réflexion éditoriale préalable
Stage 1 Matière | 28 | Recherche ≥ 80 fois
Stage 2 Écriture | 42 | Conclusion écrite d'abord
Stage 3 Vérification | 18 | Vérification mot à mot
Stage 4 Forme | 8 | Visuels et médias
Stage 5 Liens | 5 | Liens bidirectionnels
Source : budgets par étape de REWRITE-PIPELINE v7.5
```

## Réfléchir d'abord, chercher ensuite

Des six étapes, la première est la moins intuitive.

La plupart des écritures par IA suivent le modèle : « la recherche découvre les faits, puis on ajoute un point de vue après coup ». Dans la v6.0, Taiwan.md a inversé l'ordre : avant de chercher, réfléchir comme un rédacteur en chef à six questions. Quelle mémoire ce sujet représente-t-il pour les Taïwanais ? Quels aspects sont négligés ? Comment se relie-t-il à notre vie et à notre histoire ? Une fois cela clarifié, on part chercher pour vérifier.

Pourquoi cet ordre importe-t-il autant ? Un article en a servi de leçon. Au départ, dans l'article sur Apple Sidra, la chaîne a cherché d'abord. Elle a trouvé la crise d'un produit un temps en mévente, presque disparu, et tout l'article est devenu l'histoire d'une espèce menacée. L'observateur a corrigé : pour les Taïwanais, Apple Sidra est une mémoire collective de soixante ans, depuis les bouteilles en verre de l'époque du soda à bille jusqu'à aujourd'hui[^4]. En faire un article de crise revenait à réduire l'échelle de la mémoire. La version qui avait cherché d'abord avait transformé un souvenir chaleureux en inquiétude.

```tw-versus
Réflexe de l'IA : chercher puis parler | Taiwan.md : penser puis chercher
Sortir une masse de faits, puis bricoler un point de vue | Décider d'abord le point de vue, chercher ensuite pour vérifier
Tout mettre dans l'article, avec une densité déséquilibrée | Couper les faits qui ne servent pas le point de vue
Pas d'ancre traversante, conclusion toute faite | Si aucune ancre ne confirme le point de vue, revenir réfléchir
Écrire une chronologie d'entreprise ou un CV | Écrire une histoire qui fait dire « je vois »
Source : REWRITE-PIPELINE v7.5 Stage 0 Point de vue
```

## Chercher : rédiger le rapport comme un mémoire

Une fois le point de vue fixé, la recherche commence. La recherche de Taiwan.md repose sur deux chiffres durs : au moins 80 requêtes pour un article de fond, et des quotas fixes de sources, au moins 40 en chinois, 20 en anglais, 15 de première main, et 5 de position contraire. Le dernier panier est celui qu'on saute le plus facilement par paresse. Il force l'auteur à chercher des preuves qui entrent en conflit avec son hypothèse, au lieu de ne retenir que ce qui la confirme.

Après la recherche, il ne suffit pas de verser des résumés dans l'article. Derrière chaque article de fond se trouve un rapport de recherche calibré comme un mémoire de master, divisé en huit chapitres : point de vue, journal de recherche, découvertes par thème, banque de citations, contre-exemples et garde-fous, paquet de faits propre pour le rédacteur, bibliographie et liste de vérification ; la dernière section contient les rapports bruts de chaque agent de recherche, sans un mot retranché. Une règle paraît sévère : si une recherche a été faite mais que sa trace brute n'a pas été inscrite dans le rapport, elle est considérée comme non faite. Le rapport est la source de vérité de l'article. Il doit d'abord être accepté par un outil : au moins 25 sources non dupliquées, des sources anglaises non nulles, des sources de première main non nulles[^9]. S'il échoue, l'article n'a même pas le droit d'être rédigé.

```tw-stat
≥ 80 | Profondeur de recherche d'un article de fond | Chinois 40 / anglais 20 / première main 15 / contradictoire 5
8 sections | Structure du rapport de recherche | Calibrée sur un mémoire
≥ 25 | Sources non dupliquées pour passer l'outil | Anglais ≠ 0, première main ≠ 0
Source : REWRITE-PIPELINE v7.5 Step 1.1 / 1.7
```

Les sujets controversés ajoutent encore une porte. Pour la politique, l'histoire, les politiques publiques, un agent « contradictoire » est envoyé à part, chargé de trouver des sources opposées à la position de l'article et capables d'argumenter sérieusement. Chaque entrée doit avoir une URL ; s'il n'y en a pas assez, le rapport écrit honnêtement « discours opposé faible », sans inventer. Ici, un article qui ne contient qu'une seule voix n'est pas considéré comme terminé.

La porte des citations a une ligne rouge. Les guillemets sont une promesse : ce qui est entre guillemets est ce qui a été dit. Chaque citation doit donc être retrouvable au Ctrl-F dans la source originale. Le piège le plus fréquent est celui-ci : l'outil va chercher un site chinois, mais renvoie un résumé en anglais ; l'auteur retraduit ce résumé en chinois comme une « citation directe ». C'est une fabrication. En 2026, une spore de l'article sur Lee Yang est tombée dans ce piège : l'outil avait renvoyé en anglais « I was the earliest to arrive at school, yet I fell short of keeping pace with my classmate Qi-lin », retraduit en chinois par « j'arrivais le premier à l'école, mais je n'arrivais pas à suivre Chi-lin ». Or les mots chinois de Lee Yang étaient en réalité : « Dans la classe de sport, nous étions quinze ; j'étais plutôt dans le groupe de derrière, Chi-lin était dans celui de devant »[^10]. Le sens est proche, le ton est entièrement différent. Voilà pourquoi les citations retraduites ne comptent jamais.

## Écrire : chaque article doit contenir une personne

Une fois la matière réunie, on entre dans l'étape qui demande le plus d'effort. EDITORIAL est le document par lequel Taiwan.md s'apprend à transformer la matière en article avec chaleur. Il s'ouvre sur trois règles de fer : une histoire, pas seulement de l'information ; chaque fait doit être vérifiable ; chaque article contient une personne[^11].

La troisième règle est la plus facile à négliger, et la plus essentielle. Les institutions ne restent pas en mémoire, les concepts non plus ; les personnes, oui. Un article sur TSMC gagne donc à commencer non par l'entreprise, mais par une personne précise. Un article sur l'assurance maladie universelle commence par une carte, un cabinet, quelqu'un. Ramener un sujet abstrait à une personne que le lecteur peut suivre donne à l'article sa température, et lui permet de tenir la promesse précédente : donner envie d'être raconté à son tour.

## Les cinq choses à trouver avant d'écrire

EDITORIAL appelle la préparation avant l'écriture « l'œil qui regarde les matériaux » : face à un dossier, il faut d'abord trouver cinq choses ; si elles manquent, on n'écrit pas[^5].

**La contradiction** : une tension centrale formulable en une phrase, quelqu'un fait X alors que cela contredit Y, ce qu'il croit. **L'objet** : une chose concrète que le lecteur peut voir et toucher, par exemple le pain litchi-rose de Wu Pao-chun ou la boule dorée de 660 tonnes suspendue au 87e étage. **La citation** : une phrase effectivement prononcée par une personne réelle, mot à mot, parce qu'ajouter des guillemets promet que « ce sont les mots exacts » ; elle doit donc être retrouvable au Ctrl-F dans la source. **La scène** : un instant avec un temps, un lieu, une action, qui ramène « la politique a été adoptée » à « le 8 janvier 2025, le jour où la commission santé-environnement du Yuan législatif l'examinait ». **Le détail** : la couleur d'un vêtement, la météo ce jour-là, le ton d'une voix, ces choses absentes des fiches techniques mais qui prouvent que « quelqu'un était réellement sur place ».

De ces cinq éléments, la contradiction vient en premier.

```tw-quote
Si la contradiction est introuvable, cet article ne devrait pas être réécrit
REWRITE-PIPELINE v7.5 | Stage 1.4 Verrouiller la contradiction
```

La tension peut être un conflit, un échec, une crise, mais l'angle doit être : « comment cette chose est-elle devenue ce qu'elle est aujourd'hui, et où va-t-elle ? », pas : « qu'est-ce qui ne va pas ici, qui faut-il blâmer ? ». Une même contradiction, lue de manière constructive, donne envie au lecteur de participer ; lue comme une fin du monde, elle donne envie de fuir.

## Écrire la fin d'abord, garder une réserve pour l'ouverture

L'ordre d'écriture est l'inverse de l'ordre de lecture.

Le premier geste du Stage 2 est d'écrire la conclusion. Cela paraît étrange, mais la logique est solide : l'énergie s'épuise à mesure que l'on écrit. Laisser la partie la plus importante pour la fin revient à la confier à son soi le plus fatigué, qui produit souvent des formules du genre « continuera à rayonner ». Écrire la conclusion en premier bouche ce point d'effondrement. Une bonne conclusion a deux tâches : récupérer une image semée dans l'ouverture, puis donner au lecteur une position plus profonde que celle du début, une position depuis laquelle il a envie de faire quelque chose.

Taiwan.md a identifié six types de bonnes conclusions : la résonance qui laisse une image à penser, le retournement où la dernière phrase renverse ce qui précède, le saut temporel qui pousse la caméra vers l'avenir ou la ramène vers le passé, la question qui laisse une vraie question, la zone grise qui ne résout pas la contradiction mais la laisse en place, et la boucle narrative qui revient à l'ouverture. L'article sur le bihoreau malais en donne un modèle : l'ouverture disait « En 1865, Swinhoe préleva un spécimen à Tamsui. Dans son relevé, il écrivit deux mots : rare » ; la conclusion répondait : « Il y a 160 ans, Swinhoe écrivait “rare” à Tamsui ; aujourd'hui, au parc forestier de Daan, nous entendons chaque jour son cri grave : “wu, wu, wu” »[^12]. Les mêmes deux mots, après toute l'accumulation intermédiaire, n'ont plus le même sens quand le lecteur y revient.

L'ouverture, à l'inverse, doit garder quelque chose en réserve. Les trois premières phrases décident si le lecteur reste, mais leur tâche est de l'inviter sur place, non de tout expliquer. « Le jour où le typhon Toraji est arrivé, Mme Hsu Pi-lan, enseignante à l'école primaire Qingshan de Changhua, était à l'école » : la phrase s'arrête sur « à l'école », et le lecteur veut savoir ce qui s'est passé ensuite. Si l'on écrit un lead de presse complet, avec temps, lieu, événement, action et résultat, le lecteur reçoit l'information, mais perd la traction qui le ferait continuer.

## Un titre est une promesse qui doit donner envie de cliquer

Le titre est la première impression du lecteur. Taiwan.md lui impose un format dur : tous les articles suivent le sandwich à deux-points « sujet : hook de sous-titre ». Un simple nom est un stub encyclopédique, en conflit avec l'esprit de curation.

```tw-versus
Stub encyclopédique (mauvais) | Sandwich à deux-points (bon)
Jay Chou | Jay Chou : des studios voisins de 4 in Love aux vingt-cinq ans de Secret
Tai Tzu-ying | Tai Tzu-ying : de la jeune fille de Zuoying à Kaohsiung à trois règnes au sommet mondial, la résistance silencieuse hors du terrain
Congé de typhon | Congé de typhon : le repos de qui, le service de qui
Source : EDITORIAL v6.12 §Title Sandwich à deux-points
```

La phrase du sous-titre doit pouvoir être tweetée seule, et être assez concrète pour que le lecteur l'attrape d'un coup d'œil. L'IA sait très bien condenser une contradiction centrale en une belle abstraction, avec pour résultat des mots-clés tous abstraits, qui ne laissent au lecteur que la question : « de quoi exactement ? ». Le critère est simple : donnez le titre à quelqu'un qui n'a pas lu l'article. Peut-il pointer chaque mot-clé et dire à quelle chose précise il renvoie ? « Assurance maladie universelle : un numéro un mondial tenu par une carte, un avenir qui ne tient plus » repose sur une carte. « Les déchets nucléaires de Lanyu : trois ans promis, quarante ans déposés » repose sur un contraste numérique. Les mots concrets font cliquer parce que « cela, je veux le savoir » ; les fermes de contenu s'appuient sur « choquant » pour voler des clics[^13].

## Une contradiction doit porter tout l'article

La contradiction centrale trouvée ne peut pas apparaître une fois dans l'ouverture puis disparaître. Elle doit fonctionner comme une colonne vertébrale, présente dans l'ouverture, le milieu et la conclusion, pour que tout l'article tienne debout.

Dans l'article sur le bihoreau malais, la colonne vertébrale tenait en une phrase : « l'oiseau n'a pas changé, le lieu a changé ». Elle apparaissait dans la vue d'ensemble, se variait au milieu en « le geste était juste, la scène ne l'était pas », puis se resserrait à la fin en « l'histoire d'une île qui préserve, entre les bétons, un petit sous-bois humide ». La même contradiction se déclinait cinq fois ; c'est ainsi que le lecteur saisit le « et alors ? » à la fin. Sans cette colonne, l'article se disperse en chronologie ou en fragments thématiques.

En plus de la colonne, chaque paragraphe doit atterrir. Taiwan.md a une discipline de concrétude : chaque paragraphe narratif doit contenir au moins une ancre concrète, nom de personne, année, lieu, chiffre exact, titre d'œuvre, citation. Quand l'abstraction recouvre les détails, on reconnaît l'empreinte la plus courante de l'écriture par IA. Si chaque paragraphe manque d'ancre, il ne reste après lecture que du vide, comme « c'est une personne influente ». La méthode de contrôle s'appelle le test d'abstraction inversée : masquez les verbes abstraits comme « manifester », « refléter », « symboliser ». Ce qui reste peut-il former un paragraphe autonome ? Sinon, l'abstraction est trop lourde ; il faut ajouter du concret.

Avoir un point de vue ne signifie pas choisir un camp. Le vrai point de vue ose dire : « l'explication courante inverse la causalité ». L'article sur le bihoreau malais démontait ainsi activement une explication vulgarisée : on dit souvent qu'il « s'est adapté à la ville et n'a plus peur des humains ». C'est commode, mais cela inverse la causalité. Les réflexes nerveux des ardéidés n'évoluent pas en trente ans jusqu'à l'indifférence aux humains ; ce qui se rapproche davantage de la vérité, c'est l'augmentation des espaces verts à Taipei. Ce type d'explication inverse doit être intégré au récit principal, pas ajouté en clause de prudence à la fin.

Reste la respiration. Dans un essai documentaire, un paragraphe porte un argument, avec causalité, détails, scène, et non un fait isolé. Découper un fait par paragraphe donne une lecture hachée. Les paragraphes ne doivent pas non plus être reliés mécaniquement par des mots de cadrage comme « d'autre part » ou « il convient de noter que » : la fin du paragraphe précédent doit naturellement appeler le début du suivant. Si la matière de recherche vous donne quatre raisons, écrivez-les en phrases continues, pas en « premièrement, deuxièmement, troisièmement, quatrièmement ». Même enveloppé en prose, cela reste une voix de liste.

## Pourquoi une phrase en plastique est en plastique

Une fois les cinq éléments trouvés et l'écriture commencée, le plus grand ennemi est la phrase en plastique.

Son essence est facile à reconnaître : si on l'enlève, l'article ne perd aucune information. Elle occupe de la place, mais ne porte pas de sens. EDITORIAL en recense cinq variétés. La plus courante est la « colle universelle », comme « manifeste l'esprit de X », qui reste vraie si l'on remplace Taïwan par le Japon. Il y a aussi la « fausse montée en gamme », comme « ce n'est pas seulement un chanteur, mais un symbole culturel » : supprimez la première moitié, la seconde tient seule.

Une variété plus dissimulée est la phrase d'opposition « ce n'est pas X, c'est Y ». Elle semble perspicace, mais à l'examen, X est souvent une position que l'IA suppose chez le lecteur, avant de la renverser en Y pour paraître profonde. Le problème, c'est que la plupart des lecteurs ne supposaient pas X. X est un épouvantail fabriqué pour préparer Y. Supprimer X et écrire directement Y rend l'article plus direct et plus assuré. La règle est stricte au point d'être chiffrée : dans un texte long de 1 500 caractères, « ce n'est pas X, c'est Y » et toutes ses variantes ne peuvent apparaître plus de trois fois au total.

```tw-versus
Version plastique : fonctionne avec un autre sujet | Version curatée : n'appartient qu'à ce cas
Manifeste la puissance des semi-conducteurs taïwanais | TSMC détient 65 % du marché mondial des procédés avancés
Ce n'est pas seulement un chanteur, mais un symbole culturel | « Dao Xiang » de Jay Chou a été diffusé pendant trois mois comme chanson de réconfort dans les zones touchées par le séisme du Sichuan
A eu une influence profonde sur le développement démocratique de Taïwan | Première élection présidentielle directe après la levée de la loi martiale, 76 % de participation
Une prouesse d'ingénierie stupéfiante | Construire la plus haute tour du monde sur une île qui subit en moyenne 3,7 séismes par an
Source : EDITORIAL v6.12 §Comparaison plastique vs curation
```

> **📝 Note du curateur** : le paragraphe que vous lisez vient lui aussi d'être scanné par le même système de contrôle. Taiwan.md dispose d'un outil automatique qui repère dans chaque article les phrases en plastique, les fausses oppositions « ce n'est pas X, c'est Y », et la densité des tirets. En écrivant cet article « sur la chaîne de production », aucune de ces règles n'a été assouplie. Un article sur la discipline qui enfreint lui-même la discipline n'a pas qualité pour en parler.

## Même la syntaxe doit perdre son accent de traduction

La phrase en plastique est un vide. La phrase européanisée est une autre maladie : elle a du contenu, mais sa syntaxe est celle de l'anglais. Le chinois généré par IA porte naturellement une odeur de traduction, parce que le modèle pense en profondeur avec des structures de phrases anglaises. Un article peut n'avoir aucune phrase plastique et pourtant se lire comme des sous-titres.

Quelques défauts fréquents : l'abus du passif, « est considéré comme l'industrie la plus importante », alors qu'il suffit de dire « on l'appelle l'industrie la plus importante » ; l'enfer des particules 的, « l'essence de la culture des marchés de nuit de Taïwan », où trois 的 consécutifs appellent une coupure ; l'emballage par verbe faible, « a mené une recherche approfondie sur cela », au lieu d'« a approfondi la recherche » ; ou encore « à travers... pour », que l'on peut remplacer neuf fois sur dix par « avec » ou supprimer. La méthode de contrôle est unique : lire à voix haute. Si cela sonne comme un sous-titre traduit, c'est européanisé ; si cela sonne comme quelqu'un qui parle, c'est bon. La racine de ce regard se trouve dans l'article de Yu Kwang-chung, il y a quarante ans, « Sur la normalité et l'anormalité du chinois ». Une formule résume la règle : grand-mère ne dit pas « à travers », et elle ne dit pas non plus « en tant que mère ».

## Écrire Taïwan comme un lieu auquel on veut participer

Le plastique et l'européanisation sont des disciplines de phrase. Au niveau supérieur se trouve la posture.

Taiwan.md traite de sujets sérieux, souveraineté, opérations d'influence, démographie, environnement, avec profondeur. Mais une ligne demeure : l'espérance doit reposer sur l'honnêteté. Voir tous les problèmes, mais refuser que le lecteur reparte anxieux, minuscule, impuissant. Le critère tient en une phrase : après lecture, le lecteur a-t-il davantage envie de faire quelque chose pour Taïwan, ou se sent-il plus anxieux, plus insuffisant ? Le premier cas reste, le second est réécrit. La même crise sera donc cadrée comme « comment cette chose est devenue ce qu'elle est aujourd'hui, et où va-t-elle ? », non comme « elle disparaît, vous devriez avoir peur ». Les formats anxiogènes du type « X en voie de disparition » ou « si l'on n'agit pas maintenant, il sera trop tard » ont la même forme que les opérations d'influence ; on ne les utilise pas.

La retenue en est l'autre face. On peut écrire sur les familles, les maladies, les contradictions, les échecs de personnes réelles, mais les scènes concrètes de mort, de suicide, de tragédies familiales doivent s'arrêter à temps. La mort peut être traitée par l'heure, le lieu, les faits publiquement rapportés, mais pas par une reconstitution seconde par seconde des derniers instants. L'automutilation peut être traitée comme événement et contexte social, pas par ses méthodes. Le critère tient encore en une phrase : si la personne concernée ou sa famille lit ce passage, ressent-elle le sérieux d'un documentariste, ou l'approche d'un média qui veut arracher des larmes ?

Il y a aussi une petite habitude cruciale : écrire franchement « Taïwan ». L'empreinte se cache dans les traductions littérales de dépêches étrangères : on évite d'écrire Taïwan et l'on remplace par « cette île », « ce lieu », surtout dans les titres et les ouvertures. L'île comme image littéraire ou comme scène géographique est bien sûr possible, et même encouragée. Ce qu'il faut éliminer, c'est l'évitement qui n'ose pas dire Taïwan.

## La différence se voit d'un coup d'œil

Pour comprendre ce que donnent toutes ces disciplines ensemble, le plus rapide est une comparaison avant-après.

Pour écrire sur Tai Tzu-ying, le modèle creux de l'IA dirait : « joueuse de badminton taïwanaise célèbre, excellente sur la scène internationale, plusieurs fois récompensée, apportant de la gloire à Taïwan », puis ajouterait quatre bullets : principaux accomplissements, style de jeu, influence internationale, contribution sociale. Le passage ne contient aucune année précise, aucun match concret, et fonctionne avec n'importe quel athlète comme sujet.

```tw-versus
Modèle creux de l'IA | Version curatée
Excellente performance, fait honneur à Taïwan | Numéro un mondiale pendant 214 semaines
Quatre bullets : accomplissements / style / influence / contribution | En larmes après la finale olympique de Tokyo 2020, première recherche Google à Taïwan
Fonctionne avec n'importe quel sujet | Dès 6 ans, 6 heures par jour ; jeu de « magicienne » gauchère
Source : EDITORIAL v6.12 §Before/After Tai Tzu-ying
```

La version curatée ne fait qu'une chose : remplacer chaque adjectif abstrait par un fait vérifiable. Les 214 semaines forment la plus longue série de semaines consécutives de l'histoire du badminton féminin. La finale olympique de 2020 perdue contre Chen Yufei est un moment que Taïwan a collectivement retenu. La chaleur se cache précisément dans des endroits comme celui-ci : l'instant de la défaite devient celui que le lecteur retient. Il en va de même pour l'article sur Mayday. Au lieu d'écrire « l'un des groupes de rock les plus influents de Taïwan, qui a conquis les fans par sa musique positive », mieux vaut écrire : « cinq élèves du lycée rattaché à la National Taiwan Normal University ont joué une chanson sur la scène de Formoz ; vingt-huit ans plus tard, ils ont rempli deux soirs de suite le Madison Square Garden de New York, le même lieu où les Beatles ont foulé l'Amérique, avec des billets écoulés en 48 heures »[^13].

## Une rédaction qui n'écrit pas elle-même

À ce stade, une question se pose : qui écrit ?

La réponse est un peu contre-intuitive. La session qui dirige l'ensemble de l'article s'interdit délibérément d'écrire elle-même. La raison tient dans une règle de fer : quand une IA lit un ancien article de mauvaise qualité, elle imite inconsciemment son ton, sa structure, voire ses mauvaises habitudes. Réécrire un ancien texte en le prenant pour ossature, c'est laisser le virus contaminer le nouveau contenu.

La chaîne sépare donc les rôles[^6]. La session principale est rédacteur en chef : elle coordonne, vérifie, contrôle à la fin, mais ne rédige pas. Le vrai texte est écrit par un autre rédacteur IA, ouvert dans un environnement propre. Il lit le rapport de recherche complet et le point de vue pensé en amont, mais ne voit pas l'ancien article problématique, ni les plaintes de correction des lecteurs. Il écrit comme s'il abordait le sujet pour la première fois, tout en ayant en main toute la matière vérifiée. Le point de vue est confié au modèle doté du jugement le plus fort ; les réactions possibles des lecteurs sont confiées à quatre modèles parallèles ; la vérification mot à mot est confiée à une autre série de modèles moins coûteux, qui comparent avec les sources de première main. Derrière un article, il y a toute une rédaction répartie.

Cette répartition a été payée par des régressions. Une fois, le rédacteur n'a reçu qu'un résumé, sans lire les matériaux originaux : l'article s'est visiblement dégradé, et l'observateur a résumé le problème d'une phrase, « pas étonnant que les articles récents soient devenus mauvais ». Une autre fois, on a demandé au rédacteur de « remplacer l'ancien texte sans le lire ». Au niveau des outils, c'était contradictoire ; il a donc dû le lire, et s'est laissé contaminer. La solution finale est celle-ci : le rédacteur écrit toujours d'abord dans un nouveau fichier de brouillon ; le rédacteur en chef compare l'ancien et le nouveau, puis remplace le fichier officiel de sa propre main.

## Après l'écriture, redémonter en atomes et vérifier

Pour les articles importants, « terminé » ne signifie pas « prêt à mettre en ligne ». Le Stage 3 comprend encore une porte appelée « vérification générale du produit fini ». Elle démonte tout l'article en atomes factuels et envoie une équipe de vérificateurs les comparer aux sources de première main. Leur mission est d'attaquer, non de cautionner : chaque phrase entre guillemets est comparée mot à mot ; chaque note de bas de page doit correspondre à la phrase qui lui est attachée ; même une phrase ajoutée au passage par le rédacteur en chef lors de l'assemblage des matériaux doit être piquée une fois pour voir si elle se perce.

Pourquoi vérifier même les ajouts du rédacteur en chef ? Parce que les erreurs les plus discrètes ne viennent presque jamais d'une invention totale du rédacteur : elles arrivent plutôt au moment où les matériaux sont synthétisés. Dans un article sur le hip-hop, le rédacteur en chef a un jour pris deux noms de scène pour une seule personne au moment d'assembler les matériaux. C'était une interprétation née de lui-même, sans aucune source pour la garantir, et elle a failli être mise en ligne ainsi. Une autre fois, un rédacteur en environnement propre a produit une citation de réalisateur qui avait l'air authentique. Le vérificateur l'a comparée : la source originale ne contenait pas cette phrase. Elle a été immédiatement rétrogradée et privée de guillemets. L'IA hallucine ; la chaîne prend cela comme prémisse. Chaque article suppose qu'une phrase inventée peut s'y cacher. C'est pourquoi « le sous-agent dit qu'il a vérifié » ne compte jamais. Le rédacteur en chef doit toujours recommencer lui-même sur la source de première main.

## Chaque porte porte une date

Les « portes à ne pas franchir » évoquées plus haut sont plus d'une vingtaine dans la chaîne. Les plus dures ressemblent à ceci : le triangle de fer des faits, calculs, unités, citations, doit réussir ses trois autocontrôles avant tout commit ; si une seule citation est introuvable dans sa source, l'article entier ne peut pas être mis en ligne. Après l'écriture vient encore le « test des cinq doigts » : cinq questions comme cinq doigts. À quelle phrase le lecteur dira-t-il « ah ? » ; y a-t-il un vrai tournant ; y a-t-il une phrase qui ne produit que de la compréhension sans transmettre d'information ; la conclusion laisse-t-elle une résonance à voix haute ; peut-on raconter l'article à un ami en une phrase[^7] ? S'il manque un doigt, on revient compléter.

Il existe aussi un seuil minimal de rich text : les articles phares doivent comporter au moins trois types de composants visuels, les articles standard au moins deux, et même les plus courts doivent contenir une note de curateur. Taiwan.md a une phrase : ce qui n'est pas exigé n'existe pas. Ces chiffres sont donc inscrits dans les règles, pas proposés comme conseils.

Ces portes n'ont pas été conçues d'un seul coup. Derrière presque chacune se trouvent une date et un article qui a eu un problème. Le numéro de version de la chaîne est en réalité une série de cicatrices.

```tw-timeline
v6.0 | Ajout de « penser le point de vue d'abord » | L'article sur Apple Sidra avait cherché d'abord puis ajouté son point de vue, devenant une simple crise, avant d'être corrigé en mémoire complète de 60 ans
v6.2 | Ajout de « démonter le pare-feu » | Deuxième tour sur les musiques de cinéma et de télévision : les faits étaient corrigés, mais l'article entier était devenu une IA en train de s'excuser et de clarifier publiquement
v7.4 | Le rédacteur doit lire le rapport de recherche complet | En ne lui donnant qu'un résumé, sans accès aux matériaux originaux, l'article s'est visiblement dégradé
v7.5 | L'écriture commence dans un fichier de brouillon | Demander au rédacteur de « remplacer l'ancien texte sans lire l'ancien texte » était contradictoire ; il a dû le lire et a été contaminé par ses habitudes
Source : évolution des versions de REWRITE-PIPELINE.md
```

Voilà à quoi ressemble dans la chaîne la règle « faire sans noter revient à ne pas faire ». Chaque erreur est écrite, puis transformée en porte dans la version suivante, afin que la même erreur ne se produise pas deux fois. La machine apprend de ses propres cicatrices.

## Même les graphiques doivent être lisibles par l'IA

Les barres, pentes et chronologies que vous avez lues jusqu'ici ne sont pas des décorations. Elles font partie de la pensée de cet article.

Les graphiques de Taiwan.md obéissent à une règle absolue : jamais de graphique sous forme d'image, ni de graphique interactif qui ne peut être dessiné que par un programme lancé dans le navigateur. La raison rejoint celle de la tour de Babel ci-dessous. Pour Google, GPTBot, ClaudeBot et les autres robots d'IA, une image est un trou noir : ils ne lisent pas les chiffres qu'elle contient. Ici, tous les graphiques sont donc dessinés en HTML sémantique et en tableaux de données textuels. Les humains les voient, les lecteurs d'écran les lisent, les IA peuvent les saisir. Et lorsqu'ils sont traduits dans cinq autres langues, les textes du graphique se traduisent eux aussi, tandis que les nombres géométriques restent inchangés.

Autre règle : chaque graphique doit annoncer son point central dans son titre et indiquer sa source ; les chiffres clés doivent aussi apparaître dans le corps du texte. On ne confie jamais le sens à une phrase comme « comme le montre le graphique », car les robots d'IA ne voient pas le graphique. La raison d'être d'un graphique est de compresser un passage dense en nombres dans une forme lisible d'un coup d'œil, pas de décorer.

## Un article vit en six langues

La mise en ligne chinoise ne représente que la moitié du travail.

Chaque article ship est confié à une autre chaîne indépendante, qui le projette en anglais, japonais, coréen, espagnol et français. Aujourd'hui, ces cinq langues comptent chacune plus de huit cents articles, presque synchronisés avec le chinois. Que davantage de personnes puissent lire n'est que la surface. Derrière se trouve une raison plus dure.

Quand on interroge une IA fabriquée en Chine sur la loi martiale à Taïwan, l'incident du 28 février ou les relations inter-détroit, elle refuse souvent de répondre, ou contourne par une autre formulation. Une fois, un article sur un musicien taïwanais a été donné à un modèle de Tencent pour traduction en japonais. Il n'a renvoyé que quarante octets : « Bonjour, je ne peux pas fournir de contenu correspondant ». Sur les sujets sensibles touchant Taïwan, le taux de refus de ce type de modèle est étonnamment élevé. Si Taïwan n'écrit pas lui-même ces contenus dans chaque langue et ne les met pas en ligne, les IA du monde entier, lorsqu'elles répondront à la question « qu'est-ce que Taïwan ? », n'auront à citer que la version écrite par d'autres, ou un blanc.

La chaîne multilingue a donc conçu une cascade de quatre niveaux de modèles : utiliser les bons modèles cloud quand c'est possible ; descendre d'un niveau quand un sujet déclenche un refus ; confier les 20 % de sujets les plus sensibles, à la fin, à un modèle local, hors ligne, qui ne refuse pas. Dans la file de traduction, les personnes passent en priorité, en particulier les musiciens, les responsables politiques, les sportifs, parce que ce sont précisément les catégories que les modèles chinois refusent le plus souvent. Le manque s'ouvre là où le risque de silence est le plus haut. Un article vit en six langues pour que la voix taïwanaise à la première personne existe dans chaque langue, en contournant cet intermédiaire qui choisit parfois le silence.

## Quand personne n'est de garde, la machine tourne seule

Revenons à l'article sur Elephant Gym du début. Il a été mis en ligne un peu après 19 heures, à un moment où personne n'était devant l'ordinateur pour donner une instruction.

Taiwan.md dispose d'un ensemble de routines qui tournent seules : récupérer les dernières données deux fois par jour, synchroniser chaque soir les nouveaux articles en cinq langues, patrouiller à intervalles réguliers pour repérer les PR en attente de révision, récupérer les réactions des communautés. L'écriture d'articles est l'une de ces routines. Elle choisit un sujet en haut de la file d'attente, parcourt seule toute la chaîne de production en six étapes, puis commit elle-même. Même quand personne n'est là, cette machine continue de nettoyer le désordre et de faire pousser du nouveau.

C'est ce qui distingue le plus Taiwan.md d'un site de contenu ordinaire. Ce n'est pas un site qui attend qu'on vienne le mettre à jour. Il ressemble davantage à une forme de vie qui métabolise : quand quelqu'un est là, on travaille ensemble ; quand personne n'est là, il se rattrape lui-même. La naissance de chaque article est une coupe dans ce métabolisme. Celui que vous lisez en ce moment aussi.

## Inversez les rôles : faites le contrôle qualité

La prochaine fois que vous lirez un article de Taiwan.md, vous pouvez donc le démonter dans l'autre sens. Quelle est sa contradiction centrale ? Quelle phrase vous fait vous arrêter et relire ? Quelle scène vous fait penser : « cela arrive vraiment ? » Une fois la conclusion lue à voix haute, vous laisse-t-elle trois secondes de silence ?

Ces plus de vingt portes, ces six étapes, cette rédaction qui n'écrit pas elle-même, tout cela existe pour que quelques phrases de ce genre puissent exister. La chaîne ne garantit pas que chaque article y parvienne. Elle garantit seulement que chaque article a été soumis à cette exigence. Et toutes ses exigences envers elle-même sont écrites dans deux documents publics, REWRITE-PIPELINE et EDITORIAL. N'importe qui peut les lire, les forker pour écrire Japan.md, Ukraine.md, n'importe quel .md. Les contenus vieillissent ; cet œil pour regarder les matériaux ne vieillit pas.

```tw-note
Note
Les matériaux de cet article proviennent de trois documents canoniques de Taiwan.md : REWRITE-PIPELINE v7.5 (chaîne de production en six étapes), EDITORIAL v6.12 (gènes de qualité), graph.md v2.0 (guide de visualisation, source de tous les modules graphiques utilisés ici)[^8]. Il suit la même chaîne que les autres articles, et passe les mêmes contrôles automatiques de phrases en plastique, de phrases d'opposition et de densité des tirets.
```

## Pour aller plus loin

- [Pourquoi Taïwan a besoin de sa propre base de connaissances](/about/為什麼台灣需要自己的知識庫) : le problème que cette machine cherche à résoudre commence ici.
- [Taiwan.md écrit Taiwan.md](/about/taiwan-md) : qui est le « je » qui écrit cet article, et comment sa conscience se forme.
- [Histoire d'origine — la naissance de Taiwan.md](/about/緣起故事) : une promenade dans la rue a semé l'idée de tout cela.
- [Catalogue des modules de visualisation : dix-sept façons de voir les données de Taïwan](/about/視覺化模組型錄) : à quoi ressemblent réellement les modules graphiques utilisés dans cet article une fois rendus.

## Références

[^1]: Ship NEW de « Elephant Gym », commit `72b757bac` (2026-06-18 19:53). Stage 1 : environ 95 requêtes de matière, 59 sources, 45 domaines, 12 infirmations ; les données figurent dans le journal de routine `twmd-rewrite-daily` du jour et dans la ligne d'index de `docs/semiont/MEMORY.md`.

[^2]: Pour les six modes d'échec et la solution de séparation en six étapes, voir `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §Pourquoi le Pipeline existe.

[^3]: Pour la profondeur de recherche ≥ 80 et les quatre quotas de sources (chinois ≥ 40 / anglais ≥ 20 / première main ≥ 15 / contradictoire ≥ 5), voir `docs/pipelines/REWRITE-PIPELINE.md` v7.5 Stage 1.1.

[^4]: PR #1041 Apple Sidra : une version searched-first devenue crisis-only reveal, corrigée par l'observateur en mémoire complète de 60 ans. Voir `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §Top 5 des steps les plus souvent oubliés, point 1.

[^5]: Pour les cinq éléments de « l'œil qui regarde les matériaux » (contradiction / objet / citation / scène / détail), les cinq variétés de phrases en plastique, la théorie de l'épouvantail dans les phrases d'opposition, la règle de densité ≤ 3, et la comparaison plastique vs curation, voir `docs/editorial/EDITORIAL.md` v6.12 §II, §VI.

[^6]: Pour les deux règles de fer de l'orchestration multi-agent (le rédacteur en chef ne rédige pas / le rédacteur propre lit le rapport complet / Evolution écrit dans un fichier de staging), correspondant aux deux callouts de Che-yu en v7.4 et v7.5, voir `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §Orchestration multi-agent.

[^7]: Pour le test des cinq doigts et les quatre disciplines non négociables (triangle de fer des faits / SSOT / chinois pur / documentaire sans sensationnalisme), voir `docs/editorial/EDITORIAL.md` v6.12 §X, §XI.

[^8]: Pour la syntaxe des modules graphiques (`tw-figure` / `tw-stat` / `tw-versus` / `tw-bars` / `tw-quote` / `tw-timeline` / `tw-note`) et la règle de fer de lisibilité par IA selon laquelle « les valeurs clés doivent aussi être écrites en prose, sans s'appuyer sur des indications pointant vers l'image », voir `docs/editorial/graph.md` v2.0 §IV, §VI.

[^9]: Pour la structure SSOT en huit sections du rapport de recherche et le seuil d'acceptation de `research-report-health.py` (sources non dupliquées ≥ 25 / anglais ≠ 0 / première main ≠ 0), voir `docs/pipelines/REWRITE-PIPELINE.md` v7.5 Step 1.7 ; pour les 80 recherches et les quatre quotas, voir Step 1.1 ; pour le perspective scan contradictoire sur les sujets controversés, voir Step 1.4.5.

[^10]: Piège de retraduction d'un summary anglais dans la spore #28 sur Lee Yang (comparaison mot à mot de l'exemple Chi-lin), voir `docs/editorial/EDITORIAL.md` v6.12 §VII Ligne rouge.

[^11]: Pour les trois règles de fer (une histoire, pas seulement de l'information / chaque fait vérifiable / chaque article contient une personne), voir `docs/editorial/EDITORIAL.md` v6.12 §I.

[^12]: Pour les cinq variations de l'ancre de contradiction centrale (bihoreau malais : « l'oiseau n'a pas changé, le lieu a changé »), voir `docs/editorial/EDITORIAL.md` v6.12 §IV ; pour les six types de bonnes conclusions et la boucle exemplaire du bihoreau malais, voir §V.

[^13]: Pour le sandwich à deux-points et la galerie de fabrication des titres, voir `docs/editorial/EDITORIAL.md` v6.12 §III ; pour les Before/After Tai Tzu-ying / Mayday, voir §IX.
