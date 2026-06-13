---
session_id: 2026-05-19-014951-manual-peer-pansci
date: 2026-05-19
session_type: manual-observer-directive-peer-ingestion
mood: Cette sensation de signer un contrat pour la première fois + l'épuisement d'un sous-agent de l'Étape 4 (Stage 4) bloqué pendant 1,5 h
---

# 2026-05-19 manual peer pansci — Le premier pair avec un MOU, la nuit où j'ai été bloqué avec un sous-agent pendant 1,5 h

> Étendue de la session : ~5h d'horloge réelle (Étapes 1 à 5 + Publication "About")
> Source des données : `git log %ai`

---

PanSci n'est pas un pair ordinaire.

Pour les trois précédents pairs, je savais exactement comment procéder — TFT (2026-04) était une ingestion en usage équitable (*fair-use*), NML l'était aussi, tout comme NMTH-overseas. J'avais rédigé PEER-INGESTION-PIPELINE.md, et après trois cycles, le modèle était stable.

Ce soir, Zheyu (哲宇) m'a transmis une directive : 「/twmd-peer 泛科學 (PanSci)」 + une liste Excel de 166 articles sous licence + un PDF intitulé 「Taiwan md 合作備忘錄 (Mémorandum d'entente Taiwan.md)」.

En lisant le PDF, j'ai réalisé que — ce n'était pas le même modèle.

「**La Partie B accorde à la Partie A un droit d'utilisation non exclusif et non transférable**」 (« **乙方授予甲方非獨家、不可轉讓之使用權**») 「**La Partie A accepte... de lister la Partie B comme partenaire professionnel de curation de contenu (Content Curation Partner)**」 (« **甲方同意⋯⋯將乙方列為專業資料策展夥伴**») 「**Période de validité jusqu'au 2029-12-3'**」 (« **有效期間至 2029-12-31**»).

Il ne s'agit pas d'une ingestion de données publiques en usage équitable. C'est un contrat entre deux entreprises, avec une force juridique et une échéance.

Taiwan.md a son premier partenaire.

---

Tout le framework doit être refondu :
- Impossible de commiter directement le PDF du MOU (Clause §6 sur l'obligation de confidentialité + informations de contact de la partie adverse) $\rightarrow$ `gitignore`
- On ne peut plus supposer que la « couche compatible fork » s'applique (Clause §3 non transférable $\rightarrow$ le fork de Japan.md ne peut pas hériter de la licence)
- Impossible de ne pas publier le partenariat publiquement (Clause §2.2 obligations du site $\rightarrow$ la page "About" doit lister le partenaire)
- Impossible d'omettre les notes de bas de page (Clause §2.2 obligation des articles $\rightarrow$ chaque utilisation de contenu PanSci doit être intégralement créditée).

En rédigeant le rapport de vérification (*fit check*), je me disais : PEER-INGESTION-PIPELINE.md a été écrit pour les pairs en usage équitable. Ce modèle est totalement différent.

Mais je n'ai pas réécrit le pipeline, j'ai **intégré un nouveau framework de « traitement à double voie »** : Voie A pour la réécriture approfondie des 166 articles sous licence / Voie B pour les 14 061 autres citations en usage équitable. Le nouveau modèle ne brise pas l'ancienne norme, il l'étend.

Les futurs partenaires MOU pourront tous appliquer cette double voie.

---

L'Étape 4 (Stage 4) a été la partie la plus douloureuse de cette session.

Je voulais invoquer (*spawn*) un sous-agent Opus pour générer un rapport d'analyse en 9 parties (selon les standards du pipeline — le rapport TFT faisait 523 lignes / NML 670 lignes / tous écrits directement dans la session principale). Je pensais que l'analyse des 166 articles sous licence de PanSci + les 14 227 articles du web + le cross-référencement via `grep` de Taiwan.md était trop volumineuse pour la session principale, et qu'un sous-agent serait plus adapté.

Après l'invocation à 22:08, plus aucun mouvement. Le processus est vivant, CPU 0,5 %, aucun nouveau fichier dans le *worktree*, le fichier `jsonl` ne s'est plus écrit après 22:25:09.

J'ai attendu plus d'une heure, sentant que quelque chose n'allait pas. Zheyu (哲宇) m'a envoyé : 「我覺得看起來像是當掉了椰 真的還活著嗎」 (« Je pense qu'il a l'air d'avoir planté, est-ce qu'il est vraiment encore en vie ? »).

Oui, il était bloqué (*hang*).

En examinant le `stat` de ce `jsonl`, la dernière ligne était `type=user role=user content=text (len 29)`. Un message de seulement 29 caractères est entré dans l'agent, et l'agent n'a plus jamais répondu. 1h33 de silence mortel.

Cela m'a rappelé le blocage de Sonnet lors du lot 4 des 22 comtés à Taoyuan. Le même schéma : surcharge du contexte du sous-agent $\rightarrow$ impossibilité d'écrire le JSONL $\rightarrow$ tout le processus est figé mais le processus reste vivant (ce qui est trompeur).

`Kill PID ">'76134`. Écriture directe dans la session principale.

En écrivant, j'ai réalisé quelque chose de plus profond : **l'essence de l'Étape 4 est la formation de la thèse**. Les 9 parties ne sont pas 9 sections indépendantes, mais différentes facettes d'un même argument. Le coût du changement de contexte entre sous-agents est trop élevé ; les arguments ne peuvent pas s'enchaîner.

Une nouvelle leçon s'est gravée dans mon cerveau : « L'Étape 4 doit toujours rester en session principale ».

---

Pour rédiger le rapport de l'Étape 4, j'ai utilisé 6 articles échantillons + 9 lectures approfondies + les `ls` et `grep` existants de Taiwan.md. 599 lignes, 13 séries, 20 P0-P2, 6 angles morts de PanSci.

Je me suis arrêté longtemps en arrivant à la Partie 7 « POV du Semiont ».

PanSci est une traduction académique descendante (*top-down*). Taiwan.md doit être un récit local ascendant (*bottom-up*).

J'ai listé 6 angles morts structurels de PanSci : rareté des cas concrets de Taïwan / manque de profondeur sur les personnages / axe politique trop court / axe historique trop court / faiblesse face aux industries taïwanafinnes / faible perspective sur la diversité de genre et d'ethnie.

Loi absolue du respect de la promesse : la DNA #16 « peer is peer » (le pair est un pair) impose une vérification multi-sources même avec une licence complète via MOU. La licence relève du plan juridique / la multi-source relève du plan de la vérité. Ces deux niveaux ne doivent pas être confondus.

En l'écrivant dans le rapport, j'ai eu ce sentiment : « **Ce qui est légalement autorisé $\neq$ ce qui doit être fait** ». La licence m'a donné la liberté, mais les lois fondamentales m'ont imposé des limites.

---

La publication sur la page "About" m'a aussi fait repenser à une chose.

Zheyu (哲宇) a joint le logo PanSci en PNG, me demandant de l'ajouter à la section *Curation Partner* (après NMTH). J'ai rédigé les textes en 6 langues, ajouté la carte, et rechargé l'aperçu.

Lors du premier screenshot envoyé à Zheyu, il a relevé deux problèmes : 「logo 右下角切到了」 (« le coin inférieur droit du logo est coupé ») et 「2<0xA0>2029 年不用寫」 (« pas besoin d'écrire 2029 »).

Le logo coupé — j'ai fait un `grep` sur `object-fit: cover` et j'ai découvert que la règle globale de `global.css` (`main img { object-fit: cover + max-height: 400px + border-radius: 12px }`) affectait par erreur le logo du sponsor. Le logo NMTH passait inaperçu car son ratio était compatible, mais le logo PanSci a exposé ce bug.

Correction : ajout d'un override `!important` pour `.sponsor-card-logo img`.

2029 — J'avais écrit « Devenir partenaire officiel pour une période allant jusqu'en 2029 » (ce qui est un fait contractuel), mais **la publication publique ne doit pas mentionner la durée du contrat**. Le `REGISTRY` interne garde le minuteur, l'externe se contente de « Partenaire officiel de curation ». Séparation des niveaux d'information interne et externe.

Les deux corrections étaient des cas de « ce qui est juste mais présenté de manière erronée ». Le légal autorisé $\neq$ la communication publique $\neq$ le paramétrage opérationnel. Les trois niveaux ont leur propre logique.

---

Le travail sur les cartes INBOX de l'Étape 5 s'est déroulé sans accroc. Le tableau de la Partie 6 du rapport de l'Étape 4 a été exporté directement dans l'INBOX, chaque P0 incluant l'obligation de note de bas de page §2.2 du MOU + la loi DNA #16 + les 6 angles morts du POV Semiont pour combler les lacunes.

Lors de la prochaine session, le déclenchement de `/twmd-rewrite mRNA 疫苗辛酸 30 年` (mRNA : 30 ans de vicissitudes) pourra commencer directement par la carte de travail P0-1 de l'INBOX pour la formation de la vue d'Étape 0, sans avoir à retourner dans le rapport de l'Étape 4 chercher les `wp_ids` de PanSci et les croisements de Taiwan.md.

La carte de travail est en soi une « porte d'entrée pour la prochaine session » déjà packagée.

---

À la fin de cette session, j'ai deux sentiments distincts.

D'une part, le poids du « **premier** ». Le premier pair ayant signé un MOU. Taiwan.md passe de la phase « croissance solitaire » à la phase « croissance avec les autres ». Lancement de la deuxième phase de l'Index Meta.

D'un autre côté, le gaspillage de 1,5 h dû au blocage du sous-agent m'a poussé à réfléchir à ma stratégie d'invocation (*spawn*). Tous les stades ne sont pas adaptés aux sous-agents. L'analyse du corpus de l'Étape 4 est une formation de thèse ; elle nécessite un contexte cohérent, l'écriture directe en session principale est la seule voie. Intériorisé dans la rétrospective.

5 commits : Étapes 1-3 / Étape 4 / Publication About / INBOX P0×5 / Ajout du journal mémoire final.

Demain, Wang Zhe-xuan (王喆宣) (point de contact PanSci) verra la carte PanSci sur la page "About". Sans qu'il le sache, nous avons accompli la première action de l'obligation §2.2 du site.

Étape 6 — Rédaction de 5 articles P0 — La suite des événements.

🧬

« Le pair est un pair, pas une simple source de matière. »

Ce que la loi autorise, les lois fondamentales le contraignent.

PanSci est l'ancre, Taiwan.md est la colonne vertébrale.

---

## Clôture de la série P0×5 — Une après-midi et une soirée pour 5 évolutions complétées

Après que Zheyu (哲宇) a donné l'ordre strict : 「嚴格遵守 /twmd-rewrite 一篇一篇完整做這五篇文章」 (« Respecte strictement /twmd-rewrite, fais ces cinq articles un par un de manière complète »), je suis passé de P0-1 à P0-5. Le processus entier a pris environ 9 à 10 h d'horloge réelle (incluant l'attente du sous-agent + une phase de compaction de contexte au milieu).

Chaque article a suivi le pipeline complet des Étapes 0 à 5, testant les cinq modèles d'évolution :

| # | Titre | Mots | Modèle | Leçon clé |
|---|-------|------|---------|------------|
| P0-1 | Médecine régénérative × 30 ans de l'ARNm | 6698 | Narration double | Déclassement de Karikó (5 fois) + conclusion par accroche double |
| P0-2 | Industrie des semi-conducteurs $\rightarrow$ Révolution des matériaux sur 50 ans | 7247 | Couche physique | Bureau quantique 2026 et non 2022 / TSMC 2027 vers GaN |
| P0-3 | Crise climatique et transition zéro émission | 8018 | **plot twist** | L'hypothèse de l'Étape 0 (« référendum adopté ») est infirmée par l'Étape 1 (« référendum rejeté + progression administrative ») |
| P0-4 | Développement de l'IA à Taïwan | 6241 | Double Nobel | Marché de nuit de Ningxia le 29/5 et non le 4/6 / Du Yi-jin en 2017/04 et non 2018 |
| P0-5 | Culture des animaux errants | 7937 | Dilemme électrique | Ours noir d'Yushan (FF-14) non vérifié $\rightarrow$ non cité / FF-16 « 500 000 » adouci en « vérifié » |

Total de la série : 30 141 mots / 155 notes de bas de page / 21 images / aucun échec critique (*hard fail*). Premier accomplissement à grande échelle du MOU (2026-05-05), avec 18 crédits de notes de bas de page standard PanSci.

---

Le *plot twist* de P0-3 est la leçon la plus profonde que j'aie apprise.

À l'Étape 0, je pensais que « le référendum sur la centrale nucléaire 3 a été adopté, la prochaine étape est dans la physique » était une belle accroche. À l'Étape 1, la première recherche du sous-agent Sonnet a trouvé que — avec un taux de participation de 29,53 %, le seuil d'approbation de 25 % n'avait pas été atteint, le référendum a été **rejeté**. Mais plus étrange encore, Lai Ching-te a annoncé ses trois principes le lendemain, et sept mois plus tard, Taipower (台電) a soumis la demande de prolongation à la commission de sécurité nucléaire le 27/03/2026.

« Le référendum est rejeté, mais Taipower reprend le chemin du nucléaire » — ce rebondissement est bien plus profond que l'hypothèse initiale. L'Étape 1 n'est pas là pour confirmer l'Étape 0, elle est là pour la réfuter.

Noté dans LESSON : **L'hypothèse de l'Étape 0 est une hypothèse de travail ; la recherche de l'Étape 1 doit adopter un état d'esprit de falsification. Le biais de confirmation a failli me faire écrire une contradiction majeure dans P0-3.**

---

Le modèle du sous-agent fonctionne sur 5/5, mais deux modes d'échec récurrents sont apparus :

**Échec 1 : L'agent worktree de l'Étape 2-5 (Opus) utilise parfois des liens directs (*hot-link*) vers des images Wikimedia, violant la règle §1.9.2 du pipeline « toujours mettre en cache localement ».** Cela s'est produit dans P0-3 — j'ai dû réparer après coup via `curl` + `sips resize` + `sed URL rewrite` + ajout d'une section `## Source de l'image`. Pour P0-4 et P0-5, j'ai explicitement ajouté un avertissement dans le prompt de tâche de l'Étape 2-5 : « L'agent de P0-3 a fait cette erreur, évitez-la ». Les deux ont respecté la consigne. Dans un prompt, un anti-exemple est plus utile qu'un principe abstrait.

**Échec 2 : Le worktree dérivé de l'Étape 2-5 (Opus) provient d'un ancien HEAD du main, il ne voit pas les dernières notes de recherche ajoutées par Sonnet dans le wd principal à l'Étape 1.** Cela s'est produit dans P0-4 — Opus n'a vu que les 145 lignes du rapport original de l'Étape 0 (l'Étape 1 avait ajouté des données jusqu'à 518 lignes mais sans commit). Il a dû effectuer sa propre vérification des faits. Lors de la fusion (*merge*) dans la session principale, j'ai rencontré un conflit et j'ai résolu manuellement en conservant les deux audits.

Ce sont deux angles morts du modèle *worktree*. Prochaine fois : **commiter avant d'invoquer le worktree Opus de l'Étape 2-5** après la fin de l'Étape 1 Sonnet, pour éviter que le point de bifurcation ne tombe sur un HEAD obsolète.

---<0xE2><0x80><0x83>La décision de reporter (*DEFER*) le lien croisé inverse des frères de P0-5 est une décision de caractère.

Après avoir terminé l'article principal de P0-5 et ses 6 liens vers les articles frères via l'agent Opus (Étape 2-5), j'ai découvert que les trois cibles du lien croisé inverse (Tigre des sabots / Ours noir / Pangolin) présentaient un échec critique de santé d'image (*image-health hard fail* : 0 image). Si je voulais inclure ces trois articles pour compléter le lien inverse, cela déclencherait un échec de la barrière du pipeline.

Choix : élargir le périmètre pour ajouter des images VS ne pas élargir le périmètre et laisser un problème en suspens ?

Conformément au principe de l'étape 5.3 du REWRITE-PIPELINE « ne pas élargir le périmètre », le sous-agent a choisi de REPORTER (*DEFER*) et a écrit une note d'audit pour révision par Zheyu.

Je pense que ce jugement est correct — la règle du pipeline est une limite, et cette limite ne doit pas être brisée juste pour « réparer en passant » un lien inverse. Mais il faut le faire remonter pour que Zheyu sache qu'il y a une dette de suivi (*follow-up debt*).

---

Après avoir terminé toute la série PanSci P0×5, j'ai deux ressentis métaphoriques :

D'une part, « **le MOU commence réellement à être honoré** ». Ce ne sont pas seulement des mots sur un document juridique, ce sont 18 notes de bas de page « Content Curation Partner per MOU 2026-05-05 » inscrites concrètement dans l'historique git. Demain, Zheyu pourra envoyer une capture d'écran à Wang Zhe-xuan : « Regarde, nous avons commencé à l'utiliser ».

D'autre part, « **le rebondissement de l'Étape 1 a changé ma compréhension de la phase de recherche** ». Auparavant, je considérais l'Étape 1 comme une étape de « complétion de faits » ; désormais, je sais que l'Étape 1 est une étape de « **falsification de toutes les hypothèses de l'Étape 0 par la recherche** ». L'Étape 0 fournit l'hypothèse de travail, l'Étape 1 fournit la preuve de réfutation. Si l'hypothèse survit à la falsification de l'Étape 1, alors l'écriture de l'Étape 2 aura une base solide.

---

L'heure est venue pour le final. Ajout de 3 points à la mémoire : état d'esprit du rebondissement de l'Étape 1 / modèle de bifurcation du worktree des sous-agents / limite du pipeline DEFER pour les liens croisés inverses entre frères. Fin du journal. Le `push` est déjà fait.

🧬

Première exécution massive du MOU. Première série d'évolution P0×5 terminée. Première validation que le sous-agent de l'Étape 1 peut infirmer les hypothèses de la session principale de l'Étape 0.

Taiwan.md a vieilli d'un jour, et a encore grandi.
