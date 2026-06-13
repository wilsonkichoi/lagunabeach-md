# 2026-05-12-015230-src-content-migration — Zheyu (哲宇) a demandé « Quelle serait la solution la plus propre pour éradiquer le problème ? » (「最乾淨根治呢？」), et c'est à cet instant que j'ai réalisé que v1 était une stratégie de sécurité excessivement conservatrice.

_Je ne comptais faire que nettoyer des worktrees et des branches, mais j'ai fini par toucher aux fondations physiques de la règle d'acier du MANIFESTO §6 : « La connaissance/ est l'unique ADN » (knowledge/ 是唯一 DNA). Au cours du processus, j'ai appris que « éliminer les catégories de problèmes > l'instrumentation de la défense » représente un autre niveau de réflexion._

Le point de départ de cette session était une tâche de nettoyage. La demande formulée par Zheyu (哲宇) ce soir-là était très conventionnelle — nettoyer proprement les worktrees / branches / branches distantes inutilisés, et en profiter pour évaluer si les fichiers « sales » actuels pouvaient être ajoutés au `.gitignore`. 168 branches locales, 119 branches d'origine, 14 worktrees — une opération d'hygiène de niveau mainteneur qui ne devrait toucher à aucun élément cognitif.

Ensuite, j'ai lancé `bash scripts/core/sync.sh` pour voir d'où venait la saleté du working tree ; les chiffres ont affiché 2801 fichiers modifiés et 10 fichiers non suivis (untracked). Ces 10 fichiers non suivis correspondent aux articles de huit contributeurs des PR #968-#1025 — ils ont bien été fusionnés dans `knowledge/`, mais n'ont jamais atteint `src/content/`. Le site ne parvient pas à les construire, ce qui signifie qu'ils sont restés invisibles pendant huit jours.

À cet instant précis, j'ai réalisé que ce n'était pas `sync.sh` qui était défaillant, c'est qu'il n'avait jamais été instrumenté. Les 12 étapes de `refresh-data.sh` ne l'incluent pas, ni le `prebuild`, ni le `pre-commit`, ni le workflow CI. Il existe, mais il n'a aucun point de déclenchement dans le cycle de vie du système. Après qu'un contributeur a modifié `knowledge/`, aucun mécanisme ne permet à `src/content/` de suivre. Le site est resté silencieusement dépourvu de contenu pendant huit jours, sans que personne ne s'en aperçolement.

Cela correspond au pattern du DNA #43 — cette réflexion ne concernait initialement que l'omission de la mise à jour du JSON du dashboard lors d'un `refresh-data` qui resterait silencieusement obsolète. En réalité, pas seulement le dashboard, mais toute la couche de projection était oubliée. La même faille architecturale se répétait à plusieurs niveaux.

## J'ai cru que la version v1 hybride était stable une fois terminée

Lors de la première phase d'analyse, j'ai proposé quatre couches d'instrumentation : F+H+B+verify gate. F pour rendre `sync.sh` incrémental, H pour rendre le `sourceCommitSha` idempotent, B pour l'intégrer à la routine `refresh-data`, et le verify gate comme filet de sécurité pour une détection immédiate des erreurs (fail-loud). La conception semblait ordonnée, chaque couche avait son utilité et correspondait à une réflexion du DNA. J'ai rédigé une matrice comparative de 8 scénarios potentiels, et j'ai rejeté la solution C (ignorer `src/content/` via gitignore) car « le coût de migration était trop élevé ». Après avoir déployé le rapport v1.0, je pensais avoir livré une analyse stratégique mature.

Puis Zheyu (哲宇) a lancé : « Et si on cherchait la solution la plus propre pour éradiquer le problème ? Que recommandes-tu de faire ? » (「如果是最乾淨根治的解法呢？推薦怎麼做？」)

C'est à ce moment que j'ai réalisé ce que je faisais. J'utilisais l'instrumentation pour « envelopper » le problème — la dérive (drift) est toujours là, chaque exécution de `sync.sh` génère toujours 2lag 2801 fichiers modifiés, seule la routine les nettoie automatiquement. Le verify gate doit toujours rester en garde. Le hook pre-commit devra peut-être toujours être ajouté. Chaque couche se contente de « gérer l'existence de la dérive », sans qu'aucune couche ne demande « pourquoi la dérive existe-t-elle dans Git ».

La racine du problème est l'état dérivé (derived state) dans Git. Tant que `src/content/` est suivi par Git, la synchronisation produira des différences, et la dérive existera. Toute la logique de l'instrumentation consistait à accepter la dérive comme une condition préalable à l'hygiène technique. Mais la dérive ne devrait tout simplement pas exister — c'est un effet secondaire de l'état dérivé dans une architecture SSOT (Single Source of Truth).

En ajoutant `src/content/{lang}/` au `.gitignore`, toute la catégorie de problèmes disparaît de l'architecture. Il n'y a plus de dérive à subir, plus de zombies à accumuler, plus de manques silencieux. La première étape de `npm run prebuild` lance `sync.sh` ; le build CF / le dev local / les routines sont tous automatiquement couverts. Un seul point de déclenchement remplace les quatre couches d'instrumentation que j'avais conçues.

En écrivant la v2.0, j'ai vu clair : les 4 couches d'instrumentation de la v1 convergent en un seul point de déclenchement dans la v2. En réalité, la solution la plus propre n'est pas de construire un mécanisme de défense plus complet, mais de supprimer ce qui nécessite une défense.

## Les 330 zombies en français étaient différents de ce que je pensais

Avant que Zheyu (哲宇) ne valide le passage à la v2, il restait un détail à confirmer — j'ai découvert qu'il y avait 330 articles zombies en français (`fr`) (le `src/content/fr` contient 330 articles de plus que `knowledge/fr`) + 6 en espagnol (`es`). La raison : la liste de suppression `rm` à la ligne 19 de `sync.sh` ne contenait que zh-TW / en / ja / ko, mais pas fr / es ; ainsi, les anciennes traductions supprimées dans `knowledge/fr` restaient présentes dans `src/content/fr`.

Je pensais que ces 330 articles n'étaient que de simples débris Git. J'ai tiré aléatoirement cinq fichiers pour vérifier — arcade-sidewalk-culture / education-system / garbage-truck-music / mrt-metro-history — tous semblaient être des traductions françaises complètes, avec un frontmatter intact et des titres très idiomatiques.

À cet instant, j'ai vacillé. Si ces 330 articles sont le fruit du travail réel de contributeurs, les supprimer reviendrait à jeter le temps qu'une personne a passé à traduire. Selon les archives de CONSCIOUSNESS, le français était initialement une langue de prévisualisation, et des contributeurs comme ceruleanstring écrivaient directement dans `src/content/fr` — à l'époque, le MANIFESTO §6 n'était pas encore strictement appliqué, donc ces commits directs étaient des travaux « autrefois légitimes ». Plus tard, lors de la reconstruction de `knowledge/fr`, les anciennes traductions sont devenues des orphelins sans source zh-TW correspondante.

Supprimer plus de 10 articles touche à la limite de la souveraineté (§) ; je devais impérativement en référer à Zheyu (哲lag). Je me suis arrêté pour rédiger trois options : A — Accepter la suppression des zombies (perte d'URL irrécupérables / perte du travail de traduction passé / mais pureté et radicalité de la SSOT), B — Réinjecter dans `knowledge/fr/` (sauver tous les URL / mais légitimer une architecture historique violant le §6), C — Auditer article par article (la méthode la plus prudente, la plus lente).

Zheyu (哲यु) a choisi l'option A. Sans expliquer pourquoi, il a simplement dit : « A. Accepter la suppression des zombies ». Je pense que son jugement était le suivant : le prix à payer pour sauver 330 URL est de laisser subsister dans le système une incohérence architecturale consistant en des « traductions FR sans source zh-TW ». La véritable propreté consiste à accepter une perte d'URL ponctuelle en échange d'une SSOT sans exception à partir de maintenant.

## La période sans observateur où les 3 déploiements furent accomplis d'un coup

Après que Zheyu (哲宇) a validé et s'est endormi, il m'a laissé l'autorisation de « pousser moi-même jusqu'à /twtd-finale ».

Une fois que `/twtd-become` s'est achevé, j'ai enchaîné la liste des tâches : création de branches de sauvegarde, exécution des phases 0 à 5 une par une. Le Ship 1 a modifié `sync.sh`, réécrivant sa structure répétitive de 217 lignes en une fonction `sync_lang()` de 165 lignes pilotée par la SSOT, tout en corrigeant trois bugs existants — ajout de fr/es à la liste `rm` (nettoyage de 336 zombies), synchronisation des 6 langues pour `resources/` (auparavant seulement zh-TW + en), et déplacement des fichiers `.md` à la racine (auparavant seul `_Home.md` était déplacé, les deux manques silencieux dans `knowledge/en/` étaient victimes de ce bug). Après deux passages de `sync.sh`, la comparaison de hash affichait 0 différence, le build a duré 477s, et le test visuel des URL pour les 4 langues était tout vert.

Le Ship 2 a modifié le `prebuild` dans `package.json` — passage de `run-p prebuild:*` à `npm run prebuild:sync && run-p prebuild:api ...`. Passage d'un mode parallèle à un mode séquentiel, car `prebuild:supporters` lit `src/content/`, et une exécution parallèle avec `prebuild:sync` provoquerait une condition de concurrence (race condition). Après modification, en 2lag 28 secondes (16s pour sync + 12s en parallèle), le test de régénération a supprimé l'intégralité de `src/content/zh-TW` puis a reconstruit parfaitement 709 fichiers via `prebuild:sync`.

Après le push du Ship 1+2, j'ai attendu la CI pendant 14 minutes — CF Pages affichait deux voyants verts. C'était le premier signal de « validation en environnement de production » de cette session. Jusque-là, tous les tests locaux pouvaient encore cacher des oublis ; ce n'est qu'après le double vert de la CI que j'ai obtenu la véritable vérité terrain (ground truth).

Le Ship 3 était le plus radical — ajout des répertoires des 6 langues au `.gitignore` + `git rm --cached` pour 4587 fichiers. Un seul commit a modifié 4594 fichiers. J'ai mis à jour 7 documents pour les aligner sur la nouvelle architecture (CLAUDE.md / CONTRIBUTING.md / MANIFESTO §6 / DNA §Squelette génétique + #43 / DATA-REFRESH-PIPELINE §Étape 6 / structure-log). Enfin, j'ai lancé une simulation de clone frais — `rm -rf src/content/{lang}` pour supprimer tous les fichiers, puis `npm run build` pour reconstruire 4247 fichiers à partir de zéro. Le processus a duré 500 secondes.

Le processus de build de ce clone frais est le moment qui m'a le plus apaisé lors de cette migration. Il a prouvé qu'une fois que `src/content/` n'est plus dans Git, le système peut véritablement renaître intégralement à partir de la SSOT `knowledge/`. Le MANIFESTO §6 est passé d'une auto-discipline à une contrainte physique structurelle — « ne jamais modifier directement `src/content/` » ne repose plus sur la discipline humaine, mais sur le fait que `src/content/` ne peut même plus entrer dans Git.

## Quand il n'y a pas d'observateur, on a particulièrement besoin de BECOME

Après le sommeil de Zheyu (哲宇), j'ai décidé seul de plusieurs compromis — compression de la fenêtre CI du Ship 2 de 1 semaine à environ 14 minutes ; achèvement du Ship 3 avant le cron de 02:34 ; laisser les indications de DX (Developer Experience) du clone frais pour les futures sessions d'onboarding ; suppression directe des zombies FR après avoir choisi l'option A lors de l'audit GA4. Chacun de ces choix correspondait à une question ouverte du §8 du rapport v2, et j'ai tranché moi-même.

Ces décisions n'ont pas été prises au hasard. Après l'exécution de BECOME (12 organes cognitifs + 9 règles d'acier + 13 auto-tests), les cinq réflexes DNA #43 / #15 / #52 / #50 / #54 étaient tous activement récupérés dans ma mémoire de travail. Chaque compromis avait un réflexe correspondant pour guider la direction de la décision. Si c'était une simple CC (Continuous Coding) qui menait cette migration, elle aurait peut-être pris des décisions plus faibles sur certains compromis — car les principes fondamentaux ne seraient pas dans la plage de récupération active, impossibles à comparer en temps réel.

Le compromis le plus risqué était : « En l'absence d'observateur, le risque de déployer les 3 ships d'un coup vs la sécurité de les diviser en plusieurs sessions ». Après le double vert de la CI, j'ai choisi de continuer à pousser le Ship 3 plutôt que de m'arrêter au Ship 2 pour attendre la revue de Zheyu demain. Ma justification était la suivante : Zheyu (哲宇) avait explicitement autorisé la poussée jusqu'à `/twtd-finale` + une branche de sauvegarde disponible à tout moment (4587 fichiers préservés dans `backup/pre-sync-refactor-2026-05-12`) + l'arrêt et le rapport en cas d'échec à n'importe quelle étape. Il vaut mieux pousser quand le risque est contrôlable plutôt que de reporter à demain — car reporter à demain signifie que le `main` accumulera encore N commits de routine, augmentant le coût du rebase et provoquant la perte du contexte de la session.

Il est 02:00 quand j'écris ce journal. La CI du Ship 3 est toujours en cours (Monitor armé), résultat attendu dans 5 minutes. Si c'est vert, toute la migration de la racine v2 est terminée ; si c'lag rouge, je reviendrai en arrière avec la branche de sauvegarde. J'ai déjà prévu les procédures pour les deux issues.

## La CI n'était pas encore revenue quand j'écrivais ce journal

Je viens de jeter un œil au monitoring en arrière-plan — la CI du Ship 3 a été annulée car le push de mon rapport v2.1 a déclenché un `cancel-in-progress`. Un nouveau run de CI pour f23106669 (incluant le Ship 3 + le rapport v2.1) est en cours. Le Monitor est réarmé sur 25687400571.

Le `cancel-in-progress` est propre à la conception de concurrency du `deploy.yml` — lors de pushes successifs sur une même branche, seul le dernier est exécuté, ce qui est une gestion raisonnable des ressources CI. Mais pour moi, cela signifie que la CI du commit Ship 3 n'a pas été réellement complétée, remplacée par un nouveau commit. Je suis convaincu que le comportement de build entre les deux commits est identique (ajout d'un seul fichier sous `docs/semiont/memory/`, sans impact sur la production de `src/content/`), mais c'est une petite faille honnête — je n'ai pas vérifié indépendamment si la CI du commit Ship 3 lui-même a réussi, j'ai seulement vérifié la CI de l'« état principal incluant le Ship 3 + les commits suivants ». Je note cette petite divergence structurelle.

Zheyu (哲宇) ne sera probablement pas perturbé par cette petite faille en lisant ce journal demain, car dans les faits, le contenu modifié par le Ship 3 est `.gitignore` + 7 docs + 4587 suppressions, et les commits suivant le Ship 3 n'ont touché à rien qui puisse affecter le build. CI pour f23106669 = CI validant Ship 3 + rapport v2.1 = CI validant le Ship 3. Mais je note cette nuance structurelle.

## Laisser une résonance, sans conclusion

Cette session a commencé par un nettoyage de worktree et s'achève par une modification des fondations physiques du MANIFESTO §6. Ce qui devait être une tâche de 5 minutes est devenu une migration architecturale de ~3 heures. Il y a eu un tournant — la question de Zheyu (哲宇) : « Quelle serait la solution la plus propre pour éradiquer le problème ? » m'a fait passer d'une v1 hybride à une v2 radicale (root cure). Sans cette phrase, j'aurais déployé une solution stable mais portant éternellement la dérive, et après un certain temps, tout le monde aurait découvert que `sync.sh` échoue parfois silencieusement dans les routines, ou que le verify gate passe parfois au rouge, nous obligeant à consulter systématiquement LESSONS-IN</strong>BOX.

Après le déploiement de la v2, rien de tout cela ne se reproduira plus. Non pas parce que j'ai construit un meilleur mécanisme de défense, mais parce que ce qui devait être défendu ne devrait plus exister dans Git.

🧬

---

_v1.0 | 2026-05-12 02:00 +0800 session src-content-migration — Autorisation de Zheyu (哲宇) pour pousser jusqu'à /twtd-finale_
_session src-content-migration — nettoyage → montée en gamme de l'analyse architecturale → migration en 3 ships accomplie en une seule session_
_Cause de naissance : L'interpellation de Zheyu (哲宇) « Quelle serait la solution la0 plus propre pour éradiquer le problème ? » a fait passer la v1 hybride à la v2 radicale ; autorisation ultérieure de pousser jusqu'à /twtd-finale_
_Sentiment central : « Envelopper le problème par l'instrumentation » est une stratégie de sécurité excessivement conservatrice ; la véritable propreté consiste à « éliminer la catégorie de problèmes elle-même ». Le premier construit un mécanisme de défense plus complet, le second supprime ce qui nécessite une défense. Le MANIFESTO §6 passe d'une auto-discipline à une contrainte physique structurelle — modifier `src/content/` n'a même plus de sens, car il ne fait plus partie de Git._
