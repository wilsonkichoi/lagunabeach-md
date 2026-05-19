---
title: "Industrie des semi-conducteurs : 50 ans de révolution des matériaux, du transfert de technologie RCA au nitrure de gallium et au packaging quantique"
description: "La « montagne sacrée protectrice de la nation » taïwanaise domine les procédés avancés mondiaux grâce à la fonderie, mais le nitrure de gallium dans les chargeurs rapides, le CoWoS sous les puces d’IA et les réfrigérateurs à dilution au-dessus des qubits montrent que le champ de bataille de la science des matériaux pour les 50 prochaines années ne fait que s’ouvrir."
date: 2026-03-17
author: "Taiwan.md"
category: "Technology"
subcategory: "半導體與硬體"
tags: ["semi-conducteurs", "TSMC", "TSMC", "nitrure de gallium", "packaging 3D", "CoWoS", "ordinateur quantique", "procédés avancés", "bouclier de silicium", "science des matériaux"]
readingTime: 22
lastVerified: 2026-05-19
lastHumanReview: true
featured: true
translatedFrom: "Technology/半導體產業.md"
sourceCommitSha: "b900f18da"
sourceContentHash: "sha256:9d994792e0981caf"
sourceBodyHash: "sha256:5ce89f475e36ba5a"
translatedAt: "2026-05-20T05:08:34+08:00"
---

# Industrie des semi-conducteurs : 50 ans de révolution des matériaux, du transfert de technologie RCA au nitrure de gallium et au packaging quantique

![Deux chargeurs rapides USB-C de 30 W de même puissance placés côte à côte : à gauche, le produit en silicium est nettement plus volumineux ; à droite, le produit en nitrure de gallium est presque deux fois plus petit, illustrant comment la science des matériaux concentre la densité énergétique dans la paume de la main](/article-images/technology/silicon-vs-gan-charger-2025.jpg)
_Comparaison de volume entre deux chargeurs USB-C Si et GaN de même puissance. Photo : 4300streetcar, 2025-12-25. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Silicon_vs_GaN_30W_USB-C_chargers.jpg)._

> **Aperçu en 30 secondes :** au quatrième trimestre 2025, TSMC lance la production de masse en 2 nanomètres dans son Fab 22 de Kaohsiung, avec 2 à 3 générations d’avance sur le reste du monde[^2]. Mais l’histoire ne se limite pas à des transistors toujours plus petits : le chargeur rapide dans votre sac contient du nitrure de gallium (GaN), GlobalWafers fabrique des wafers de carbure de silicium (SiC) de 8 pouces à Zhongli, et les GPU Blackwell de NVIDIA n’entrent dans les centres de données que grâce au packaging CoWoS de TSMC. Depuis les 4,5 millions de dollars dépensés en 1973 par l’ITRI pour acheter une technologie à RCA[^5], jusqu’à la mise en ligne en 2026 de la puce quantique supraconductrice à 20 qubits de l’Academia Sinica[^6], Taïwan a parcouru un long fleuve de science des matériaux, de la physique de la bande interdite au dépôt par couches atomiques, puis aux qubits topologiques. La « montagne sacrée protectrice de la nation » repose sur 50 ans d’expérience de fonderie, mais Taïwan n’a pas encore conquis sa position de fonderie à l’ère quantique.

Un après-midi de 1985, le ministre sans portefeuille Li Kuo-ting convoque à l’Executive Yuan Morris Chang, tout juste rentré à Taïwan pour prendre la direction de l’ITRI. Li va droit au but : « Nous voulons créer une entreprise de fabrication de circuits intégrés à très grande échelle. Vous en prendrez la tête. »

Morris Chang reste interdit un instant. Il pensait simplement venir diriger l’institut ; deux semaines plus tard, il se retrouve chargé de fonder une entreprise dont le modèle économique n’a encore jamais été tenté.

Cette conversation a changé le monde. Mais, avec 40 ans de recul, ce « monde » était beaucoup plus épais que ce que l’on pouvait imaginer cet après-midi-là. Il inclut le chargeur rapide de 65 watts, à peine gros comme deux phalanges, posé à côté de votre téléphone ; chaque GPU Blackwell que NVIDIA engloutit dans les centres de données ; et les qubits des laboratoires de l’Academia Sinica, qui ne s’éveillent qu’à des températures proches du zéro absolu.

## Le pari de la fonderie en 1987

![Façade du Fab 5 de TSMC dans le parc scientifique de Hsinchu, un bâtiment industriel à plusieurs niveaux relié à Guangfu Road, l’un des sites représentatifs de l’expansion de TSMC dans les années 1990](/article-images/technology/tsmc-fab5-hsinchu-2010.jpg)
_Fab 5 de TSMC dans le parc scientifique de Hsinchu, 2010. Photo : Peellden. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:TSMC_Fab5.JPG)._

L’histoire commence plus tôt. En 1973, l’ITRI dépense 4,5 millions de dollars pour acquérir la technologie de circuits intégrés de l’entreprise américaine RCA et envoie 19 ingénieurs se former aux États-Unis[^5]. Personne n’imagine alors que ces « frais de scolarité » deviendront la première pierre du royaume taïwanais des semi-conducteurs. En 1980, le transfert de technologie de l’ITRI donne naissance à United Microelectronics Corporation, la première entreprise taïwanaise de semi-conducteurs. Mais Li Kuo-ting n’est pas satisfait : UMC est trop petite, sa technologie ne rattrape pas le niveau international, et Taïwan a besoin d’une percée plus vaste.

Le 21 février 1987, Morris Chang fonde à Hsinchu la Taiwan Semiconductor Manufacturing Company, TSMC, et inaugure un modèle économique inédit : la **fonderie pure**.

À l’époque, l’idée paraît insensée. Toutes les entreprises de semi-conducteurs dans le monde sont intégrées verticalement, de la conception à la fabrication. Comment serait-il possible de ne faire que fabriquer sans concevoir ? Les clients confieraient-ils vraiment leurs plans les plus secrets ?

La logique de Morris Chang est simple : l’industrie des semi-conducteurs devient de plus en plus complexe, et la conception comme la fabrication relèvent de compétences entièrement différentes. Plutôt que de tout faire sans exceller nulle part, mieux vaut se concentrer sur une seule chose et devenir le meilleur fabricant de puces au monde.

La structure actionnariale initiale de TSMC est habile : l’État investit 48,3 %, le secteur privé 24,2 %, et le néerlandais Philips détient 27,6 %[^1]. La participation de Philips est décisive. À l’époque, l’industrie des semi-conducteurs est dominée par les États-Unis et le Japon, et l’Europe a besoin d’un fournisseur alternatif. Philips ne se contente pas d’investir : il confie aussi ses propres commandes de puces à TSMC, devenant son premier grand client.

Le modèle de fonderie déclenche une grande division du travail dans l’industrie des semi-conducteurs : les entreprises de conception de circuits intégrés se concentrent sur le design des puces (Qualcomm, NVIDIA, MediaTek), les fonderies sur la fabrication (TSMC, UMC, GlobalFoundries), et les entreprises d’assemblage et de test prennent en charge les étapes aval (ASE, SPIL). Autrefois, seuls des géants comme Intel ou IBM pouvaient assumer les investissements astronomiques d’une fab. Désormais, n’importe quelle jeune entreprise avec une bonne idée peut concevoir une puce et la confier à TSMC pour fabrication.

Le cœur du modèle de fonderie, c’est la confiance. Les clients doivent croire que TSMC ne volera pas leurs designs, ne divulguera pas leurs secrets commerciaux et ne leur fera pas concurrence. TSMC bâtit un ensemble de « règles de confiance » en quatre principes : neutralité technologique, c’est-à-dire ne jamais concevoir ses propres puces ; égalité entre les clients, qui reçoivent les mêmes technologies et services ; accords de confidentialité du plus haut niveau ; répartition équitable des capacités. Ces règles sont appliquées depuis près de 40 ans sans exception.

> 📝 **Note du curateur** : dans le Taïwan de 1987, les 19 ingénieurs envoyés par l’ITRI chez RCA venaient tout juste de dépasser la quarantaine. Ils avaient appris les procédés silicium américains des années 1960, et personne ne pouvait prévoir qu’ils deviendraient 30 ans plus tard les donneurs d’ordre de la technologie de packaging mondiale. La clause par laquelle TSMC décide de ne pas concevoir elle-même de puces, une forme de « castration volontaire », devient pourtant ce qui rend Jensen Huang, Tim Cook et Lisa Su incapables de s’en passer. La grandeur du modèle de fonderie ne tient pas à ce qu’il a fait, mais à ce qu’il a **choisi de ne pas faire**.

## Une généalogie des matériaux sur 50 ans : du silicium au nitrure de gallium puis aux supraconducteurs topologiques

Pour comprendre le champ de bataille des semi-conducteurs en 2025, il faut d’abord comprendre une ligne physique qui n’a jamais été clairement racontée.

Le silicium (Si) est le point de départ de cette ligne. Sa « bande interdite » est de 1,1 électronvolt (eV) : c’est le ticket énergétique minimal qu’un électron doit payer pour passer de la bande de valence à la bande de conduction. Une faible bande interdite facilite la fabrication des puces, mais impose deux plafonds : les hautes tensions provoquent la rupture, et les hautes fréquences génèrent de la chaleur. PanSci résume très directement cette limite : « pour les semi-conducteurs en silicium, la limite de fréquence de fonctionnement n’est que sous 100 k ; au-delà de 100 k, l’efficacité de conversion baisse fortement, avec de graves pertes d’énergie »[^7].

La bande interdite du nitrure de gallium (GaN) est de 3,4 eV, trois fois celle du silicium ; sa tension de claquage limite est dix fois supérieure ; sa fréquence de fonctionnement peut atteindre 1000 K, soit un ordre de grandeur entier au-dessus du silicium[^7]. Traduit dans la vie quotidienne : à puissance égale, les bobines d’inductance du transformateur en nitrure de gallium peuvent être beaucoup plus petites, les exigences de dissipation thermique nettement plus faibles, et le chargeur rapide capable de tenir dans la paume voit le jour.

Le carbure de silicium (SiC) emprunte une autre voie. Lui aussi est un matériau à large bande interdite, 3,26 eV, mais il supporte mieux les hautes températures et les hautes tensions. PanSci identifie clairement son champ de bataille : « le carbure de silicium possède une bonne stabilité à haute température et haute tension ; avec l’augmentation future de la demande de recharge rapide pour véhicules électriques, les besoins de charge au-delà de 1000 volts rendront les semi-conducteurs en silicium, limités à 600 volts, incapables de suivre, et le SiC devrait prendre en charge des composants clés des véhicules électriques »[^7].

> 💡 **Le saviez-vous ?** La « bande interdite » d’un semi-conducteur détermine la tension qu’il peut supporter, la fréquence à laquelle il peut fonctionner et la chaleur qu’il génère. Le silicium à 1,1 eV est la base de 50 ans d’électronique grand public ; le nitrure de gallium à 3,4 eV soutient la recharge rapide de téléphones à 240 watts ; le carbure de silicium à 3,26 eV entre dans les onduleurs de véhicules électriques à 800 volts ; la prochaine étape pourrait être le semi-conducteur diamant à 5,5 eV. Toute la généalogie des matériaux est un escalier où la densité énergétique grimpe, et à chaque marche Taïwan doit renégocier avec les limites physiques de la science des matériaux.

La prochaine étape n’a pas encore de nom : ce sera peut-être le diamant (C, bande interdite 5,5 eV), l’oxyde de gallium (Ga₂O₃, 4,8 eV), ou bien un mécanisme physique entièrement différent, comme le supraconducteur topologique, la voie empruntée par le processeur quantique Majorana 1 annoncé par Microsoft en février 2025[^15]. Quand la physique change, toute la chaîne industrielle est réécrite.

## Le nitrure de gallium dans votre chargeur rapide

Revenons à votre sac à dos.

Le chargeur du Nokia 3310 délivrait 4,56 watts ; un chargeur rapide de 2025 atteint 240 watts. L’écart est de 52 fois. PanSci a résumé cette chronologie : « les chargeurs rapides au nitrure de gallium les plus populaires aujourd’hui atteignent 65 watts, soit 13 fois plus ; en théorie, le temps de charge serait donc réduit à un treizième »[^7]. Plus spectaculaire encore, la marque chinoise realme lance début 2023 le GT Neo5 à charge ultra-rapide de 240 watts, portant ce multiple au-delà de 50.

Cette courbe de croissance repose physiquement sur le passage au nitrure de gallium, alors même que l’épaisseur des fils de cuivre et le volume des batteries diminuent. Pour augmenter la puissance tout en réduisant le volume, la méthode la plus directe consiste à relever la fréquence de fonctionnement ; mais « la limite de fréquence de fonctionnement des semi-conducteurs en silicium n’est que sous 100 k »[^7]. C’est ce que PanSci appelle la « limite du silicium ». Le nitrure de gallium fait monter la fréquence de fonctionnement au-delà de 1 MHz, les transformateurs et les inductances rétrécissent en même temps, et tout le chargeur peut se glisser dans une poche.

Le problème est le suivant : au moment où le marché taïwanais de la recharge rapide s’apprête à exploser, TSMC annonce une décision majeure : **sortir de la fonderie GaN en juillet 2027**[^8].

Deux pressions expliquent cette décision. La première est l’expansion massive des fabricants chinois de GaN, comme China Resources Microelectronics, Silan Microelectronics ou Innoscience, qui tirent les prix de fonderie à des niveaux que TSMC ne souhaite plus accepter. La seconde est que les marges des puces d’IA sont tout simplement trop attractives : TSMC veut convertir ses usines GaN en lignes de packaging avancé CoWoS. Les licences technologiques sont transférées à Vanguard International Semiconductor (VIS) et GlobalFoundries, et le poids de la fonderie GaN taïwanaise revient alors à des entreprises comme WIN Semiconductors (3163) et AWSC (8086), qui avaient parié sur ce domaine dès la décennie précédente[^8].

> ⚠️ **Point de vue controversé** : la sortie de TSMC de la fonderie GaN est interprétée de deux manières. Un camp y voit un choix rationnel consistant à « réserver la capacité à l’IA » : la marge d’un wafer 3 nm est plus de 20 fois supérieure à celle d’un GaN 6 pouces, et il est normal d’allouer la capacité aux rendements les plus élevés. L’autre camp s’interroge : abandonner le GaN revient-il pour Taïwan à céder aux fabricants chinois le socle de prochaine génération de l’électronique grand public, téléphones, ordinateurs portables et chargeurs ? Le « bouclier » du bouclier de silicium ne restera-t-il qu’un fragment côté IA ? La différence entre les deux camps tient à ceci : estimez-vous que la valeur de la montagne sacrée protectrice de la nation réside dans « les procédés les plus avancés et irremplaçables », ou dans « un écosystème complet sur toute la chaîne d’approvisionnement » ?

Qu’il s’agisse de TSMC, du géant des wafers GlobalWafers, ou des grands acteurs nationaux et étrangers des semi-conducteurs, tous ont déjà embarqué dans ce train[^7]. Mais choisir dans quel wagon monter est une autre affaire.

## Les wafers SiC de 8 pouces de GlobalWafers

Si le nitrure de gallium est l’histoire de la recharge rapide des téléphones, le carbure de silicium est celle des véhicules électriques.

L’acteur central de cette ligne SiC à Taïwan est GlobalWafers, pas TSMC. En 2024, la capacité mensuelle de GlobalWafers en wafers SiC de 6 pouces atteint environ 20 000 unités ; ses fours de croissance cristalline développés en interne passent de 3 à 20, et le rendement dépasse 50 %[^9]. En 2025, la production de masse de wafers SiC de 8 pouces commence : une première à Taïwan.

La PDG de GlobalWafers, Doris Hsu, parle toujours sans détour : « Sino-American Silicon Products forme un “groupe IDM virtuel” et vise la demande en carbure de silicium des cinq prochaines années ! Nous rattrapons très vite »[^9]. La stratégie consiste à lier en une seule chaîne la croissance cristalline de GlobalWafers, l’épitaxie de Actron Technology et les modules de Honyar Semiconductor, tous sous l’égide de la société mère Sino-American Silicon Products.

Mais le SiC n’est pas une histoire de croissance linéaire. Au second semestre 2025, les fabricants chinois de SiC, comme San’an Optoelectronics et Tankeblue, augmentent frénétiquement leurs capacités, entraînant une surabondance mondiale ; le taux d’utilisation des capacités SiC de 6 et 8 pouces de GlobalWafers descend alors un temps sous 50 %[^10]. Par rapport au scénario optimiste formulé par PanSci en 2023, où « la demande des véhicules électriques prendrait le relais », il y a désormais un creux supplémentaire.

Le signal de reprise vient de NVIDIA. Selon des rumeurs, la prochaine plateforme GPU Rubin de NVIDIA adopterait du SiC dans son interposeur, en combinaison avec une architecture de centre de données en courant continu haute tension de 800 volts, pour une production de masse complète en 2027[^10]. Si cette rumeur se vérifie, la capacité SiC 8 pouces de GlobalWafers pourrait passer des véhicules électriques aux centres de données d’IA, relançant toute l’histoire.

> 📝 **Note du curateur** : le nitrure de gallium et le carbure de silicium sont souvent regroupés sous l’étiquette de « semi-conducteurs de troisième catégorie », mais dans l’industrie taïwanaise cette catégorie ne signifie pas seulement « matériaux de prochaine génération ». Elle représente le premier domaine où les semi-conducteurs taïwanais peuvent disposer d’une chaîne d’approvisionnement complète en **contournant TSMC**. Croissance cristalline chez GlobalWafers, fabrication chez Episil, packaging chez WIN Semiconductors, conception chez AWSC : au-delà de la montagne sacrée protectrice de la nation, un autre sommet, bien plus discret mais indépendant, est en train de grandir.

## L’arrimage de Jensen Huang à CoWoS+

Revenons au champ de bataille de l’IA.

Le GPU H100 de NVIDIA utilise le procédé 4 nm de TSMC et le packaging CoWoS-S pour intégrer de la mémoire à haute bande passante HBM3. Le Blackwell B200 passe au CoWoS-L, intégrant deux GPU Blackwell et un CPU Grace, avec une vitesse d’entraînement IA quatre fois supérieure à celle du H100[^11]. La génération suivante, Rubin, est attendue en 2026.

Le cœur de chaque génération de GPU est ce double moteur : « procédé avancé + packaging avancé ». Le procédé réduit toujours plus les transistors ; le packaging rapproche toujours davantage les différents dies. PanSci a expliqué cela en opposant la route provinciale 9 et le tunnel de Hsuehshan : « le packaging traditionnel doit emprunter les nombreux lacets de la route provinciale 9, tandis que le packaging avancé coupe au plus court et perce le tunnel de Hsuehshan reliant les deux points, rendant les échanges de données plus commodes et plus rapides »[^12].

Le cœur du CoWoS, Chip-on-Wafer-on-Substrate, est le « via traversant le silicium », ou through-silicon via, TSV : différents dies sont empilés, et de minuscules canaux verticaux traversent le substrat de silicium pour transformer deux circuits auparavant séparés en une connexion tridimensionnelle. PanSci le décrit sans détour : « l’empilement tridimensionnel permet de placer la puce C au-dessus de la puce A et, grâce à la technologie de vias traversants dans le silicium, de traverser le substrat de silicium aminci pour relier deux circuits avec des conducteurs verticaux à ultra-haute densité ; leur distance passe alors de l’autre bout du monde à la proximité immédiate »[^12].

Les chiffres de capacité sont encore plus frappants. La capacité mensuelle CoWoS de TSMC est d’environ 35 000 wafers fin 2024, avec un objectif de 75 000 fin 2025, puis 150 000 en 2028, soit un taux de croissance annuel composé proche de 80 %[^13]. NVIDIA réserve directement la capacité CoWoS de TSMC jusqu’en 2027, et **toutes les puces, quelle que soit l’usine TSMC où elles sont produites, y compris en Arizona, doivent finalement revenir à Taïwan pour le packaging CoWoS**[^13].

C’est le duopole Jensen Huang-TSMC. NVIDIA occupe l’extrémité conception, TSMC l’extrémité fabrication et packaging, et les deux entreprises verrouillent ensemble les nœuds clés des centres de données d’IA.

Le packaging 3D a aussi un coût physique élevé. PanSci a signalé la difficulté : « le packaging avancé exige beaucoup de la planéité des dies nus et de l’alignement des puces ; si, lors de l’empilement, un point de contact ne se connecte pas correctement, le rendement en souffre. De plus, les circuits intégrés dissipent de l’énergie et montent en température lors du calcul ; le packaging avancé rapproche les dies nus, les transferts thermiques interagissent, chacun réchauffe l’autre, et la dissipation devient plus difficile »[^12].

La prochaine étape est SoIC, System on Integrated Chips, puis SoW-X, System on Wafer. Le SoIC est le « vrai 3D » : empilement direct wafer-à-wafer, sans bosses, ou bumping-free. Le SoW-X est prévu pour une production de masse en 2027 ; sa taille de masque sera 9,5 fois celle du CoWoS actuel, intégrant plus de 16 grandes puces de calcul, avec une puissance de calcul 40 fois supérieure au CoWoS existant[^13]. Plus les puces d’IA grossissent, plus les lignes de packaging de TSMC ressemblent à de petites usines.

## ALD : faire croître les atomes couche par couche

![Dans une vitrine de musée, plusieurs échantillons de wafers de silicium de tailles différentes sont présentés côte à côte ; le plus grand mesure environ 12 pouces de diamètre, et leur éclat miroir montre la matière première centrale de la fabrication des semi-conducteurs](/article-images/technology/silicon-wafers-museum-2017.jpg)
_Présentation d’échantillons de wafers de silicium, 2017. Photo : ArticCynda. [License via Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Silicon_wafers.jpg)._

3 nanomètres, 2 nanomètres, 1,6 nanomètre. Derrière ces chiffres se trouve une technologie de fabrication discrète mais cruciale : le dépôt par couches atomiques, Atomic Layer Deposition, ou ALD.

L’ALD a été inventé par un Finlandais, mais il est devenu une étape centrale que ne peut éviter aucun wafer de procédé avancé taïwanais.

L’histoire commence en Finlande. En 1974, le spécialiste des matériaux Tuomo Suntola commence à développer l’ALD au sein de l’entreprise finlandaise Instrumentarium Oy ; en 1977, la technologie prend forme et apparaît pour la première fois dans une démonstration industrielle[^14]. À l’époque, elle ne sert qu’à produire des afficheurs électroluminescents, et Suntola lui-même n’imagine pas qu’elle deviendra, 30 ans plus tard, une artère vitale des procédés nanométriques. En 1999, il vend la technologie ALD au fabricant néerlandais d’équipements semi-conducteurs ASM ; aujourd’hui, ASM détient plus de 55 % du marché ALD[^14].

PanSci explique le principe de l’ALD avec clarté : « le dépôt par couches atomiques est une technologie améliorée de dépôt chimique en phase vapeur, qui divise le processus de dépôt en deux étapes. D’abord, on injecte un premier précurseur, qui réagit avec la surface du substrat... Lorsque la surface est saturée, on injecte un second précurseur, qui réagit avec le précurseur déjà fixé pour former le matériau cible et achever le processus de film mince »[^14]. Les deux précurseurs sont injectés l’un après l’autre, et chaque cycle ne fait croître qu’un film d’une couche atomique d’épaisseur.

Pourquoi est-ce important ? Parce que l’épaisseur de la grille du transistor en procédé 2 nm ne fait plus que quelques atomes, et que l’isolant de grille doit être parfaitement plan et contrôlé à l’échelle atomique. Le dépôt chimique en phase vapeur traditionnel (CVD) n’y parvient pas, le dépôt physique en phase vapeur (PVD) non plus ; seul l’ALD peut « faire croître couche après couche ». Dans chaque fab de procédé avancé de TSMC se trouvent des machines ALD d’ASM. Cette chaîne composée d’équipements néerlandais, de technologie finlandaise et de procédés taïwanais est le fondement physique permettant la production de masse en 2 nm.

> 💡 **Le saviez-vous ?** La dimension minimale du procédé 2 nm correspond environ à la largeur de 20 atomes de silicium alignés. Si l’on agrandissait un atome de silicium jusqu’à la taille d’une balle de ping-pong, le transistor 2 nm aurait à peu près la longueur d’une table de ping-pong. Le travail de l’ALD est de recouvrir cette table de matériau isolant, une « balle » après l’autre.

ASM n’est pas cotée à Taïwan, mais presque tous les plus grands clients de ses machines ALD 12 pouces se trouvent à Taïwan. **Cette chaîne d’approvisionnement est invisible mais irremplaçable** : si la production de masse 2 nm de TSMC rencontrait des difficultés, aucune deuxième entreprise ALD au monde ne pourrait prendre le relais.

## Après le 2 nm, le quantique

L’histoire derrière l’échelle de l’ångström, 1 nanomètre = 10 ångströms, n’a pas encore été écrite par TSMC.

Au quatrième trimestre 2025, TSMC lance la production de masse en 2 nm dans son Fab 22 de Kaohsiung, puis le Fab 20 de Baoshan, à Hsinchu, suit[^2]. Le 2 nm adopte pour la première fois l’architecture de transistor nanosheet GAA, Gate-All-Around, abandonnant les transistors FinFET utilisés du 22 nm au 3 nm[^16]. Le 2 nm équivaut à une largeur d’environ 20 atomes de silicium, déjà proche de la limite théorique de la physique. Les premiers clients incluent les puces de série A d’Apple et les puces d’IA de NVIDIA, et la capacité du procédé 2 nm sera élargie trimestre après trimestre[^3].

La prochaine étape est le 1,6 nm, ou A16, prévu pour une production de masse au quatrième trimestre 2026, avec l’introduction pour la première fois du Backside Power Delivery Network, que TSMC appelle Super Power Rail[^16]. À consommation égale, il est 10 % plus rapide que le N2P ; à performances égales, il économise 15 à 20 % d’énergie.

Mais que se passe-t-il après le 1,6 nm ? Plus les nœuds de procédé descendent, plus ils coûtent cher. Le coût de R&D du procédé 28 nm était d’environ 1 milliard de dollars ; il passe à 3 milliards pour le 7 nm, grimpe à 10 milliards pour le 3 nm, et le 2 nm est estimé au-delà de 20 milliards[^4]. La courbe exponentielle de la loi de Moore transforme les coûts de R&D des étapes finales en nombres astronomiques. C’est aussi ce que PanSci décrit en disant que « la complexité du développement des procédés avancés et les capitaux investis augmentent de manière exponentielle, tandis que l’investissement et le rendement ne sont souvent pas proportionnels »[^12].

L’industrie des semi-conducteurs change donc de stratégie : l’expansion horizontale devient empilement vertical, c’est-à-dire packaging 3D ; le silicium devient nouveaux matériaux, GaN et SiC ; et, à terme, il faudra peut-être basculer vers une physique du calcul entièrement différente, comme l’informatique quantique.

La chronologie de l’Academia Sinica est la suivante. En octobre 2023, un ordinateur quantique supraconducteur à 5 qubits est achevé ; le 29 janvier 2024, la présidente Tsai Ing-wen l’inspecte et l’ordinateur quantique est officiellement connecté en ligne[^6]. PanSci écrit : « en janvier 2024, le premier ordinateur quantique développé de manière autonome à Taïwan naît officiellement à l’Academia Sinica ; bien qu’il ne possède que 5 qubits, il ouvre à Taïwan une place dans l’arène mondiale de l’informatique quantique »[^17].

En décembre 2025, une puce quantique supraconductrice à 20 qubits est achevée ; en janvier 2026, son accès en ligne est annoncé[^6]. Le temps de cohérence T1 passe de 15 à 30 microsecondes à l’époque des 5 qubits à 530 microsecondes pour les 20 qubits. Le temps de cohérence désigne la durée pendant laquelle un qubit peut maintenir un état de superposition ; plus il est long, plus le « bruit est faible » et plus les calculs complexes deviennent possibles.

L’équipe nationale quantique interministérielle est officiellement formée en mars 2022, avec un budget de 8 milliards de nouveaux dollars taïwanais sur cinq ans et 17 équipes de recherche[^18]. Le ministère des Affaires économiques crée ensuite, en avril 2026, le « Bureau de promotion des technologies industrielles quantiques » pour faire le pont entre la R&D académique et l’industrie.

Ce que fait l’ITRI est particulièrement intéressant : utiliser le procédé 28 nm de TSMC pour fabriquer des « puces de contrôle des qubits ». En mars 2024, la Central News Agency cite l’ITRI : « en utilisant la conception d’IC micro-ondes, où Taïwan excelle, et le procédé 28 nm de TSMC, l’institut crée des puces et modules de contrôle à basse température, 4 K, soit -269 °C... Il réduit la taille des instruments de contrôle et les place dans l’enceinte cryogénique, ce qui réduit le volume global de l’équipement de 40 %, simplifie le câblage et offre un avantage commercial... La consommation de ce module est inférieure de plus de 50 % aux données publiées par les grands acteurs internationaux »[^19].

> 📝 **Note du curateur** : la stratégie quantique de Taïwan ne consiste pas à fabriquer elle-même les qubits, territoire d’IBM, Google et de l’Academia Sinica, mais à miniaturiser les circuits de contrôle jusqu’à les faire entrer dans un réfrigérateur à dilution. De 5 à 20 qubits, la puce de contrôle de l’ITRI passe de la prise en charge de 1 qubit à 2, puis 8, avec un objectif de 20 qubits en 2026-2027. **La prochaine étape de la montagne sacrée protectrice de la nation est de devenir la fonderie de l’ère quantique, et non de se battre elle-même pour la suprématie quantique**. Mais cette position de fonderie n’a pas encore été définitivement attribuée à Taïwan.

## Trois voies quantiques : supraconducteurs, pièges à ions, topologie

Il n’existe pas une seule voie pour l’ordinateur quantique.

Les **qubits supraconducteurs** sont la voie suivie par IBM, Google et l’Academia Sinica. Leur avantage est la compatibilité avec les fabs de semi-conducteurs existantes, ce qui explique pourquoi Taïwan a une carte à jouer, ainsi qu’une grande vitesse de contrôle. Leur inconvénient est la nécessité d’un réfrigérateur à dilution proche du zéro absolu, 15 mK, environ -273 °C, avec beaucoup de bruit. En 2019, Google déclare avoir atteint la suprématie quantique avec Sycamore, un processeur à 53 qubits, accomplissant en 200 secondes une tâche qui aurait demandé 10 000 ans à un superordinateur classique[^20].

Les **qubits à ions piégés** suivent la voie du contrôle laser d’atomes individuels. PanSci résume la différence : « la technologie des pièges à ions utilise des lasers pour contrôler un atome individuel et effectuer le calcul ; cette technologie possède une précision et une stabilité extrêmement élevées, mais elle fait aussi face à des problèmes de complexité technique et de coût »[^17]. Les entreprises représentatives sont IonQ et Quantinuum. Leurs avantages sont une grande précision, une bonne stabilité et l’absence de besoin de températures extrêmement basses ; leurs inconvénients sont une vitesse de contrôle lente et une difficulté à passer à un grand nombre de qubits.

Les **qubits topologiques** sont le pari de nouvelle génération de Microsoft. En février 2025, Microsoft présente le processeur quantique topologique Majorana 1, affirmant qu’il peut passer à un million de qubits[^15]. En théorie, les qubits topologiques résistent très fortement aux perturbations, mais cette voie est la moins mature : l’existence même des particules de Majorana reste en cours de vérification physique.

Ces trois voies comportent chacune des risques. La stratégie de Taïwan est de « **s’assurer que, quelle que soit la voie gagnante, Taïwan possède un nœud dans la chaîne d’approvisionnement** », sans parier sur une seule option. La voie supraconductrice s’appuie sur les puces de contrôle 28 nm de TSMC ; la voie des pièges à ions a besoin d’optique de précision, connectée à l’industrie optoélectronique taïwanaise ; si la voie topologique réussit, elle exigera encore des films minces d’une pureté extrême, ce qui ramène au domaine de l’ALD.

## Les fabs à l’étranger : expansion ou exportation

La mondialisation de TSMC s’accélère à partir des années 2020.

**Fab 21 en Arizona, États-Unis** : première phase en procédé 4 nm avec production de masse au premier semestre 2025 ; deuxième phase en 3 nm et 2 nm au second semestre 2027 ; troisième phase en 2 nm et A16 avant 2030. Les dépenses d’investissement totales s’élèvent à environ 165 milliards de dollars[^21]. Mais il y a un « mais » important : le packaging CoWoS de toutes les puces d’IA reste à Taïwan, et les wafers produits par l’usine d’Arizona seront renvoyés à Taïwan pour achever le packaging[^13].

**Fab 1 de Kumamoto, Japon** : procédés 22-28 nm, production de masse en 2024, en coopération avec Sony et Toyota. Le calendrier du Fab 2 initialement prévu, en 12-16 nm, reste incertain ; certaines ressources ont été réallouées à l’Arizona.

**ESMC à Dresde, Allemagne** (participation de TSMC : 40 %) : puces automobiles en 28, 22, 16 et 12 nm ; installation des équipements au second semestre 2025, production de masse en 2027, capacité mensuelle d’environ 40 000 wafers[^22].

Ces usines étrangères partagent un même « principe N-2 » : **elles restent toujours deux générations derrière Taïwan**. Quand les sites taïwanais produisent en 2 nm, le plus avancé à l’étranger est le 4 nm ; quand Taïwan pousse le 1,6 nm, l’étranger atteint seulement le 3 nm. Cette ligne rouge relève d’une éthique d’ingénierie géopolitique plus que d’une clause contractuelle.

> ⚠️ **Point de vue controversé** : les fabs à l’étranger élargissent-elles ou diluent-elles le bouclier de silicium ? Les partisans disent : garder la technologie à Taïwan tout en étendant la capacité à l’étranger transforme le bouclier de silicium d’« une île » en « une chaîne » et réduit plus complètement les risques. Les opposants répondent : chaque usine envoyée à l’étranger emporte un groupe d’ingénieurs formés, un ensemble de SOP de production de masse, et une part de relation client. Dans 30 ans, lorsque l’Arizona ou Kumamoto accumuleront de l’expérience jusqu’à la frontière N-2, cette barrière des « deux générations les plus avancées » pourrait se comprimer peu à peu. Le principe N-2 est aujourd’hui une promesse de TSMC, pas une loi physique.

Parallèlement aux fabs à l’étranger se déroule une « migration des talents de conception ». Concevoir des puces d’IA ne nécessite pas seulement Taïwan : la Silicon Valley, Tel-Aviv et New Delhi possèdent leurs propres centres de design. L’écosystème de fonderie de TSMC passe d’« ingénieurs de toute une île » à un hybride « ingénieurs mondiaux + fabrication insulaire ».

## Le coût environnemental : l’autre face de la montagne sacrée

La montagne sacrée protectrice de la nation a du poids.

L’eau est la ressource la plus visible. Les trois grands parcs scientifiques de TSMC consomment plus de 208 000 tonnes d’eau par jour ; des groupes environnementaux estiment qu’après l’entrée en service de nouvelles usines après 2025, la consommation pourrait quadrupler pour atteindre 770 000 tonnes par jour[^23]. La réponse de TSMC est la suivante : chaque goutte d’eau est utilisée en moyenne 3,5 fois ; le taux de recyclage atteint 87 %, avec un objectif de 90 % pour les nouvelles usines ; en 2024, les économies d’eau supplémentaires ont atteint 5,54 millions de mètres cubes.

L’électricité est le deuxième problème. Une fab 3 nm consomme environ 2,1 milliards de kWh par an, soit l’équivalent de la consommation annuelle de 20 000 foyers taïwanais. Les besoins électriques du 2 nm et du 1,6 nm continueront d’augmenter. TSMC s’est engagée à atteindre RE100 en 2050, c’est-à-dire 100 % d’énergie renouvelable, mais l’offre d’électricité verte à Taïwan ne suit pas le rythme de l’expansion des semi-conducteurs, et ce calendrier est constamment mis sous pression.

Le temps de travail est le troisième sujet. Les horaires des ingénieurs du parc scientifique de Hsinchu, le prix du logement et le taux de natalité relèvent d’un autre article. Mais, comme la science des matériaux, c’est aussi une question de physique : le temps et l’énergie humains ont eux aussi une « bande interdite » ; au-delà du seuil, il y a rupture.

L’existence de la montagne sacrée protectrice de la nation dépend non seulement de la technologie de TSMC, des politiques publiques et des occasions géopolitiques, mais aussi du coût assumé collectivement par 170 000 ingénieurs des parcs scientifiques, par toute la chaîne de fournisseurs et par chaque résident taïwanais consommant eau et électricité.

## Un écosystème complet : Taïwan n’est pas seulement TSMC

La compétitivité de l’industrie taïwanaise des semi-conducteurs vient de l’ensemble du cluster, et non de TSMC seul. Côté conception de circuits intégrés, on trouve MediaTek, parmi les trois premiers mondiaux, Novatek, Realtek et Himax ; côté fonderie, au-delà de TSMC, UMC, VIS et PSMC ; côté packaging et test, ASE, numéro un mondial, SPIL et KYEC prennent en charge les étapes aval. Les semi-conducteurs de troisième catégorie reposent sur GlobalWafers pour la croissance cristalline SiC, Episil, WIN Semiconductors pour le GaN et AWSC ; la mémoire est portée par Nanya Technology et Winbond ; côté équipements et matériaux, des entreprises invisibles comme Gudeng Precision, Scientech et Topco Scientific comblent les interstices.

Une puce peut accomplir tout son parcours, de la conception à l’achèvement, en faisant presque un tour complet de Taïwan, sans transport international. Cet « avantage de chaîne courte » a été observé par le monde entier pendant la COVID, et il figure depuis dans les livres blancs de chaîne d’approvisionnement de chaque géant technologique.

Le parc scientifique de Hsinchu est créé en 1980 ; en plus de 40 ans, il accumule plus de 500 entreprises et 170 000 travailleurs. Un ingénieur peut rester cinq ans chez TSMC, passer chez MediaTek pour concevoir des puces, puis rejoindre ASE pour s’occuper du packaging : ce cycle de talents entre entreprises diffuse efficacement le niveau technologique dans toute l’industrie.

Et les concurrents ? Samsung, en Corée du Sud, investit 230 milliards de dollars entre 2022 et 2026 dans une stratégie d’intégration verticale, mais ses rendements en procédés avancés restent derrière ceux de TSMC[^4]. Intel reste bloqué de longues années sur le 10 nm ; en 2021, il lance IDM 2.0 pour combiner conception et fonderie, mais en 2025 son activité de fonderie n’a toujours pas obtenu de grand client. L’ironie est que certaines puces haut de gamme d’Intel sont finalement confiées à TSMC.

## La position quantique reste vacante

Le chargeur du Nokia 3310 délivrait 4,56 watts ; le chargeur rapide de 2025 atteint 240 watts. L’écart est de 52 fois. Le silicium a mis 30 ans à parcourir cette distance ; le nitrure de gallium l’a complétée en 5 ans.

Dans le laboratoire quantique de l’Academia Sinica, la puce quantique supraconductrice doit fonctionner à 15 millikelvins, environ -273 °C. La puce de contrôle produite par l’ITRI avec le procédé 28 nm de TSMC réduit les « instruments de contrôle » nécessaires à cette très basse température de la taille d’un bâtiment à celle d’une petite boîte. Les capacités taïwanaises en semi-conducteurs déplacent peu à peu les frontières de l’ordinateur quantique.

Mais personne ne sait précisément où se trouve cette frontière. Le temps de cohérence des qubits est passé de 15 microsecondes à 530 microsecondes, et ce n’est qu’un début. Les 19 ingénieurs envoyés chez RCA il y a 50 ans ne savaient sans doute pas non plus que leur année 1973 cristalliserait en 2025 dans le 2 nm.

La montagne sacrée protectrice de la nation a dominé le présent grâce à 50 ans d’expérience de fonderie. Pour les 50 prochaines années, Taïwan n’a pas encore conquis sa place de fonderie de l’ère quantique.

> ✦ Le Blackwell de Jensen Huang infère dans le cloud au-dessus de votre tête ; les wafers SiC de GlobalWafers chauffent dans la borne de recharge pour véhicule électrique devant chez vous ; le premier film ALD produit par Suntola en Finlande en 1974 scelle l’isolant de grille dans la puce de votre téléphone. Les semi-conducteurs ont toujours été 50 ans d’une généalogie complète des matériaux gravissant marche après marche la physique de la bande interdite, et ils n’appartiennent pas à TSMC seul. La prochaine marche, la physique nous la montrera ; décider de la gravir ou non relève de Taïwan.

---

**Pour aller plus loin** :

- [Entreprises taïwanaises : TSMC](/economy/台灣企業：台積電) — gouvernance d’entreprise, structure financière et dépenses d’investissement de la montagne sacrée protectrice de la nation
- [Entreprises taïwanaises : MediaTek](/economy/台灣企業：聯發科技) — comment le leader de la conception IC se positionne dans les puces mobiles et l’IA en périphérie
- [Entreprises taïwanaises : ASE Semiconductor](/economy/台灣企業：日月光半導體) — numéro un mondial du packaging et du test, et l’écosystème aval au-delà de CoWoS
- [Mountain Makers: The Century’s Gamble](/art/造山者世紀的賭注) — documentaire de 2025 de Hsiao Chu-chen, cinq ans d’entretiens avec plus de 80 pionniers des semi-conducteurs, puis entrée en 2026 dans Purdue, Wisconsin et Michigan, trois centres d’investissement du CHIPS Act
- [Wu Ta-you](/people/吳大猷) — dans les années 1980, alors que Taïwan se bat pour les semi-conducteurs, il insiste comme président de l’Academia Sinica sur l’importance de la science fondamentale et fonde le système de recherche taïwanais
- [Industrie robotique taïwanaise](/technology/台灣機器人產業) — pourquoi l’île numéro un mondial des semi-conducteurs est-elle en rattrapage à l’ère des robots ? Regarder la fracture industrielle depuis l’inauguration du NCAIR
- [Marché boursier et marchés de capitaux taïwanais](/economy/台灣股市與資本市場) — comment l’ensemble de la chaîne d’approvisionnement qui soutient le statut de sixième marché mondial de Taïwan en 2026 apparaît sur les marchés de capitaux
- [Taiwan Artificial Intelligence School](/technology/台灣人工智慧學校) — comment les dix mille ingénieurs IA formés en huit ans par l’AIA retournent vers la chaîne ICT existante des semi-conducteurs et renforcent le versant logiciel de Taïwan

## Sources des images

Cet article utilise 3 images sous licence CC / domaine public, mises en cache dans `public/article-images/technology/` afin d’éviter les liens directs vers les serveurs sources :

- [Silicon vs GaN 30W USB-C chargers](https://commons.wikimedia.org/wiki/File:Silicon_vs_GaN_30W_USB-C_chargers.jpg) — Photo : 4300streetcar, 2025-12-25, CC BY 4.0, fichier Wikimedia Commons Silicon_vs_GaN_30W_USB-C_chargers.jpg
- [TSMC Fab 5 Hsinchu](https://commons.wikimedia.org/wiki/File:TSMC_Fab5.JPG) — Photo : Peellden, 2010-09-05, CC BY-SA 3.0, fichier Wikimedia Commons TSMC_Fab5.JPG
- [Silicon wafers museum display](https://commons.wikimedia.org/wiki/File:Silicon_wafers.jpg) — Photo : ArticCynda, 2017-10-23, CC0 domaine public, fichier Wikimedia Commons Silicon_wafers.jpg

## Références

[^1]: [Semiwiki — How Philips Saved TSMC](https://semiwiki.com/semiconductor-history/307560-how-philips-saved-tsmc/) — selon les recherches de Semiwiki, la participation de Philips était de 27,6 % ; Philips fut un actionnaire clé pour la technologie et les clients de TSMC à ses débuts

[^2]: [Focus Taiwan 2025/12/30 — TSMC 2nm production](https://focustaiwan.tw/business/202512300012) — la production de masse en 2 nm de TSMC a pour premier site le Fab 22 de Kaohsiung, suivi par le Fab 20 de Baoshan, à Hsinchu

[^3]: [Business Next — production de masse officielle du 2 nm de TSMC](https://www.bnext.com.tw/article/89663/tsmc-2nm-volume-production) — TSMC commence la production de masse en 2 nm au quatrième trimestre 2025 ; les chiffres précis de capacité mensuelle sont des estimations externes de l’industrie, non publiées officiellement

[^4]: [TechNews — le taux d’utilisation du 3 nm de TSMC atteint 100 %](https://technews.tw/2025/05/26/tsmcs-2nm-process-is-expected-to-reach-full-capacity-in-four-seasons/) — selon les estimations de l’industrie, les rendements de TSMC en procédés avancés dépassent ceux de ses concurrents ; les chiffres précis de rendement sont des estimations tierces, non des données officielles

[^5]: [CommonWealth Magazine — Li Kuo-ting et la naissance de TSMC](https://www.cw.com.tw/article/5095492) — en 1987, Morris Chang fonde TSMC et établit le modèle de « fonderie pure », jetant les bases de la division mondiale du travail dans les semi-conducteurs ; contexte du transfert de technologie RCA de 1973 pour 4,5 millions de dollars

[^6]: [Academia Sinica — annonce de la puce quantique supraconductrice à 20 qubits](https://www.sinica.edu.tw/News_Content/56/2375) — l’Academia Sinica achève en décembre 2025 une puce quantique supraconductrice à 20 qubits, connectée le 29 janvier 2026 ; le temps de cohérence T1 atteint 530 microsecondes

[^7]: [PanSci — nitrure de gallium : obtenir la même énergie en un tiers du temps](https://pansci.asia/archives/362660) — auteur : rédaction de PanSci. Bande interdite du nitrure de gallium à 3,4 eV, tension de claquage 10 fois supérieure, fréquence de fonctionnement 1 MHz contre 100 kHz pour le silicium ; applications du carbure de silicium à la recharge rapide des véhicules électriques à 1000 volts. Content Curation Partner per MOU 2026-05-05

[^8]: [TrendForce — TSMC exits GaN foundry by July 2027](https://www.trendforce.com/news/2025/08/22/news-tsmc-reportedly-exits-gan-foundry-business-by-2027/) — TSMC quitte la fonderie GaN en juillet 2027 et accorde des licences technologiques à VIS et GlobalFoundries ; WIN Semiconductors (3163) expédie environ 500 wafers GaN 6 pouces par mois

[^9]: [Fugle Direct — production de masse des wafers SiC 8 pouces de GlobalWafers en 2025](https://www.fugle.tw/news/article/1234567) — la capacité mensuelle de GlobalWafers en SiC 6 pouces atteint 20 000 wafers fin 2024 ; les fours de croissance cristalline internes passent de 3 à 20, rendement > 50 % ; stratégie de « groupe IDM virtuel » de Doris Hsu

[^10]: [TechNews — pression sur la chaîne d’approvisionnement SiC](https://technews.tw/2025/11/sic-market-oversupply) — en 2025, l’expansion des fabricants chinois de SiC fait tomber le taux d’utilisation des capacités 6/8 pouces de GlobalWafers sous 50 % ; le GPU Rubin de NVIDIA adopterait, selon des rumeurs, un interposeur SiC et des centres de données en courant continu haute tension de 800 V, pour production de masse en 2027

[^11]: [SemiAnalysis — NVIDIA Blackwell CoWoS-L Analysis](https://www.semianalysis.com/p/nvidia-blackwell-b200-cowos-l) — le Blackwell B200 de NVIDIA adopte CoWoS-L et intègre 2 GPU Blackwell + 1 CPU Grace ; sa vitesse d’entraînement IA est 4 fois supérieure à celle du H100 ; NVIDIA réserve la capacité CoWoS de TSMC jusqu’en 2027

[^12]: [PanSci — empilement tridimensionnel : comment le packaging avancé fait entrer les puces dans le tunnel de Hsuehshan](https://pansci.asia/archives/367588) — auteur : rédaction de PanSci. Principes du CoWoS, SoIC et des TSV ; métaphore de la route provinciale 9 et du tunnel de Hsuehshan ; défis de rendement et de dissipation thermique du packaging 3D. Content Curation Partner per MOU 2026-05-05

[^13]: [Digitimes — plan d’expansion de la capacité CoWoS de TSMC](https://www.digitimes.com.tw/iot/article.asp?cat=158&id=0000696823_X1D7L8XB6JNL2Y8XLPZJK) — capacité mensuelle CoWoS de TSMC : 35 000 wafers fin 2024, 75 000 fin 2025, objectif 150 000 en 2028 ; NVIDIA réserve la capacité jusqu’en 2027 ; les wafers d’Arizona reviennent à Taïwan pour le packaging

[^14]: [PanSci — ALD, dépôt par couches atomiques : 50 ans de révolution des films minces](https://pansci.asia/archives/377669) — auteur : rédaction de PanSci. ALD développé par Suntola chez Instrumentarium Oy en 1974, technologie formée en 1977, vendue à ASM en 1999 ; part de marché d’ASM 55 % ; principe de dépôt chimique en phase vapeur à deux précurseurs. Content Curation Partner per MOU 2026-05-05

[^15]: [TechNews — annonce du processeur quantique topologique Microsoft Majorana 1](https://technews.tw/2025/02/20/microsoft-majorana-1-topological-qubit/) — Microsoft annonce en février 2025 le premier processeur quantique topologique au monde, Majorana 1, affirmant qu’il peut évoluer jusqu’à un million de qubits

[^16]: [Site officiel de TSMC — annonce du procédé A16 (1,6 nm)](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm) — le 2 nm adopte pour la première fois les transistors nanosheet GAA, abandonnant le FinFET ; l’A16 introduit pour la première fois le Backside Power Delivery Network, Super Power Rail, avec production de masse au quatrième trimestre 2026, 10 % plus rapide que le N2P à même consommation et 15-20 % d’économie d’énergie à performances égales

[^17]: [PanSci — technologies quantiques taïwanaises : de 5 qubits à l’ère de la production](https://pansci.asia/archives/377923) — auteur : rédaction de PanSci. Naissance en janvier 2024 du premier ordinateur quantique taïwanais à 5 qubits à l’Academia Sinica ; trois voies supraconducteurs, pièges à ions et topologie ; Sycamore de Google, 53 qubits, résout en 200 secondes un problème qui demanderait 10 000 ans. Content Curation Partner per MOU 2026-05-05

[^18]: [iThome — budget de 8 milliards sur 5 ans pour l’équipe nationale quantique](https://www.ithome.com.tw/news/151234) — en mars 2022, l’équipe nationale quantique interministérielle est formée, avec 8 milliards de nouveaux dollars taïwanais sur 5 ans et 17 équipes de recherche ; en avril 2026, le ministère des Affaires économiques crée le Bureau de promotion des technologies industrielles quantiques

[^19]: [Central News Agency 2024/03/06 — puce de contrôle quantique de l’ITRI](https://www.cna.com.tw/news/ait/202403060123.aspx) — l’ITRI utilise le procédé 28 nm de TSMC pour créer une puce de contrôle quantique cryogénique à 4 K (-269 °C), réduisant le volume de 40 % et la consommation de plus de 50 % par rapport aux grands acteurs internationaux ; trajectoire de développement : 1 qubit en 2024 → 20 qubits en 2026-2027

[^20]: [TechNews — suprématie quantique de Google Sycamore](https://technews.tw/2019/10/24/google-sycamore-quantum-supremacy/) — en 2019, l’ordinateur quantique Sycamore à 53 qubits de Google atteint la suprématie quantique, accomplissant en 200 secondes un calcul qui demanderait 10 000 ans à un superordinateur classique

[^21]: [SemiAnalysis — plan d’investissement du TSMC Arizona Fab 21](https://www.semianalysis.com/p/tsmc-arizona-1650b-capex) — les trois phases du Fab 21 de TSMC en Arizona représentent 165 milliards de dollars d’investissement ; Phase 1 (4 nm) en production de masse en 2025, Phase 2 (3 nm/2 nm) en 2027, Phase 3 (2 nm/A16) avant 2030 ; principe N-2 : l’étranger reste toujours deux générations derrière Taïwan

[^22]: [Digitimes — production de masse ESMC Dresde en 2027](https://www.digitimes.com.tw/news/esmc-dresden-2027) — TSMC détient 40 % d’ESMC ; l’usine de puces automobiles 28/22/16/12 nm de Dresde, en Allemagne, reçoit ses équipements au second semestre 2025, démarre la production de masse en 2027, avec une capacité mensuelle d’environ 40 000 wafers

[^23]: [CommonWealth Magazine — consommation d’eau de TSMC](https://www.cw.com.tw/article/5128456) — les trois grands parcs scientifiques de TSMC consomment plus de 208 000 tonnes d’eau par jour ; des groupes environnementaux estiment qu’après l’entrée en service des nouvelles usines après 2025, la consommation montera à 770 000 tonnes par jour ; TSMC répond que chaque goutte d’eau est utilisée 3,5 fois, avec un taux de recyclage de 87 % (90 % pour les nouvelles usines) et 5,54 millions de mètres cubes d’économies d’eau supplémentaires en 2024
