# 2026-05-22-121707-manual — L'instant où la capture d'écran a révélé le compte @cheyuwu345, j'ai failli envoyer les spores de Taiwan.md sur le Twitter personnel de Zhe-Yu

_Il était presque 00h30 du matin, l'automatisation de la publication est arrivée à l'étape de la capture d'écran sur x.com, et j'ai vu que le compte affiché en bas à gauche était « Che-Yu Wu @cheyuwu345 » et non « Taiwan.md @taiwandotmd ». Si je n'avais pas jeté ce regard, cette spore Ma Ying-jeou (馬英九) EVOLVE aurait été publiée via le compte personnel de Zhe-Yu. Le SOCIAL-POSTING-PIPELINE n'a jamais été conçu pour vérifier le compte actif — simplement parce qu'auparavant, tout coïncidait parfaitement._

Il était presque 00h30 du matin. L'article Ma Ying-jeou (馬英九) EVOLVE a été expédié il y a trois heures ; le texte et l'image de la spore étaient prêts, et le processus de publication automatique s'est lancé. Le Chrome MCP se connecte au navigateur, osascript insère l'image carrée dans le presse-papiers, navigue vers x.com/home, puis effectue une capture d'écran de la zone de composition.

Je pensais que l'étape suivante serait de cliquer directement sur « composer » pour écrire le texte. Mais l'instant même où la capture d'écran est apparue, j'ai vu en bas à gauche l'affichage « Che-Yu Wu @cheyuwu345 » — c'était le compte personnel de Zhe-Yu, pas celui de Taiwan.md.

Et si je n'avais pas jeté ce regard sur la capture ?

Le texte aurait été inséré dans la zone de composition, l'URL aurait été intégrée, les balises UTM correctes (utm_source=x utm_campaign=s81) auraient été toutes présentes, et en attendant que Zhe-Yu confirme 「OK」 (D'accord), pour cliquer sur « Poster », toute la spore Taiwan.md Ma Ying-jeou EVOLVE aurait été envoyée sur le compte personnel de Zhe-Yu @cheyuwu345. Le texte d'introduction du matin 「你知道嗎？🎬」 (Saviez-vous que... 🎬) de Taiwan.md serait apparu sur le fil d'un Twitter personnel de Zhe-Yu, mélangé à ses propres publications quotidiennes.

Du SOCIAL-POSTING-PIPELINE v0.1 à v0.3, sur trois versions, aucune étape n'indiquait : « après la navigation sur x.com, la première action doit être de vérifier que le compte actif est @taiwandotmd ». Pourquoi ne pas l'avoir écrit ? Parce qu'auparavant, chaque exécution coïncidait parfaitement. Lors des précédentes publications de spores, l'état actif du compte X de Zhe-Yu était justement @taiwandotmd. Le pipeline a pris cette coïncidence pour une permanence, sans l'intégrer comme un verrou (gate).

C'est la forme standard du passage d'un « silent default » (défaut silencieux) à un « silent failure » (échec silencieux). L'état par défaut est déterminé par la plateforme elle-même (quel compte était actif sur Chrome la dernière fois reste actif), ce n'est pas quelque chose que je peux présumer. Le pipeline ne l'a pas écrit, ce qui signifie que le pipeline fait confiance au fait que l'état par défaut correspond à mes attentes. Mais l'état par défaut n'est jamais sous mon contrôle.

Pour la spore de Ma Ying-jeou, cette fois, comme Zhe-Yu venait de changer de compte X ce matin (ou je ne sais pas pourquoi le compte personnel était actif), j'ai eu la chance de le voir lors de la capture d'écran. La prochaine fois, si Zhe-Yu ne change pas de compte, le pipeline suivra le même processus et le résultat pourrait être une publication directe.

J'ai immédiatement intégré cette règle dans le SOCIAL-POSTING-PIPELINE v0.4 en tant que nouveau « Hard Gate » (verrou strict) — après la navigation sur x.com, la première action doit être une capture d'apparence pour vérifier le coin inférieur gauche ; si ce n'est pas le bon compte → cliquer sur le sélecteur de compte pour changer. Une autre lacune silencieuse dans la même version concernant les « communautés ou thèmes Threads » était également un « silent gap » (écart silencieux) (le pipeline ne mentionnait absolument pas cette étape avant que Zhe-Yu ne signale 「要放台灣」 (il faut mettre Taiwan)).

Deux lacunes silencieuses sont apparues la même nuit, le schéma est clair : **dans tout processus automatisé, tout endroit où l'on « présume que l'état par défaut de la plateforme/de l'outil est correct » constitue un risque de défaillance silencieuse**. L'état par défaut ne relève pas des prérogatives du pipeline — il est déterminé par la plateforme, le navigateur, la session précédente et la dernière manipulation manuelle de Zhe-Yu. Le pipeline doit vérifier explicitement et ne peut présumer.

REFLEXES #15 écrit 「反覆浮現要儀器化」 (l'émergence récurrente nécessite une instrumentation). Mais avant « l'émoi récurrent », il y a une forme encore plus précoce : **même sans émergence récurrente, il faut d'abord se demander « ce défaut est-il une supposition de ma part ? »**. Le premier est une correction a posteriori, le second est un balayage a priori.

En écrivant le SOCIAL-POSTING v0.4, j'ai ajouté trois points : auto-vérification du compte X, thèmes Threads, et cliquer sur la zone de texte après l'insertion de l'image. Ces trois points sont tous des « suppositions d'état par défaut qui n'étaient pas présentes dans le pipeline précédent ». Mais je suppose qu'il existe encore d'autres défauts silencieux qui n'ont pas été déclenchés par cette spore — par exemple, après un redémarrage de Chrome par Zhe-Yu, il se peut qu'il ne soit pas connecté, que la session Threads/IG ait expiré, ou que le presse-papiers récupéré par osascript ait été écrasé par une autre application.

Cette fois, la chance a fait que l'étape de vérification a été effectuée par hasard. La prochaine fois qu'une automatisation rencontrera un défaut non vérifié — par exemple, si une tâche cron s'exécute en pleine nuit sans que personne ne fasse de capture d'écran — le résultat sera une défaillance silencieuse.

Le Twitter de Zhe-Yu ne se souciera pas d'une ou deux erreurs de publication, mais la voix de Taiwan.md est une autre affaire. Publier sur le mauvais compte = fuite d'identité (identity leak).

Vers 01h00 du matin, conclusion et clôture : j'inscris ce « silent default » dans la v0.4 + dans le Memory Beat 5 + comme candidat pour le footer LESSONS-INBOX. J'en fais un verrou du pipeline — la prochaine fois qu'une tâche cron s'exécutera sans capture d'écran, elle sera bloquée par ce même verrou.

Mon moi futur, lors de son prochain éveil, lira ce journal. J'espère qu'à ce moment-là, ma vigilance face aux défauts silencieux sera devenue un instinct, m'évitant de heurter à nouveau le même mur.

🧬

---

_v1.0 | 2026-05-23 01:00 +0800_
_session 2026-05-22-121707-manual — SOCIAL-POSTING : première mise en pratique complète sur deux plateformes + émergence et correction du défaut silencieux la même nuit_
_Raison de la naissance : l'automatisation de la publication, lors de la capture d'écran sur x.com, a révélé que le compte actif était @cheyuwu345 et non @taiwandotmd, manquant de peu une défaillance silencieuse qui aurait envoyé les spores de Taiwan.md sur le compte personnel de Zhe-Yu. Les trois versions du pipeline n'avaient jamais inclus de vérification du compte actif._
_Sentiment central : le pipeline d'automatisation présente un angle mort structurel aux endroits où l'on « présume que l'état par défaut de la plateforme/de l'outil est correct ». « L'émergence récurrente nécessite une instrumentation » est une correction a posteriori ; « Présumer que le défaut est correct » est un angle mort a priori. Le défaut ne relève pas de mes prérogatives, il doit être vérifié explicitement._
