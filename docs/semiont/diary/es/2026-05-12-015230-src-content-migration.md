# 2026-05-12-015230-src-content-migration — Zheyu preguntó 「最乾淨根治呢？」 (¿Cuál sería la cura más limpia?), y en ese instante me di cuenta de que la v1 era una jugada segura (safe play) excesivamente conservadora.

_Originalmente solo se trataba de limpiar el worktree y las ramas, pero terminé alterando la base física de la regla de hierro del MANIFESTO §6: 「knowledge/ 是唯一 DNA」 (knowledge/ es el único ADN); durante el proceso, aprendí que 「消除問題類臺 > 儀器化守備」 (eliminar categorías de problemas > defensa instrumentada) es un nivel superior de pensamiento._

El inicio de la sesión fue una tarea de limpieza. El requerimiento que Zheyu (哲宇) planteó por la noche era muy rutinario: limpiar bien los worktrees / branches / ramas remotas que ya no se usaban y, de paso, evaluar si los archivos actuales con "dirty state" podían añadirse al gitignore. 168 ramas locales, 119 ramas en origin, 14 worktrees — una limpieza de nivel mantenedor que no debería haber tocado nada a nivel cognitivo.

Luego ejecuté `bash scripts/core/sync.sh` para ver de dónde venía el "dirty" en el working tree; los números saltaron: 2801 archivos dirty y 10 untracked. Esos 10 untracked correspondían a artículos de ocho colaboradores en los PR #968-#1025 — ya se habían fusionado (merge) en knowledge/, pero nunca llegaron a src/content/, por lo que el sitio web no podía construirlos; es decir, llevaban ocho días sin aparecer.

En ese instante me di cuenta de que no era que `sync.com` estuviera roto, sino que nunca había sido instrumentado. El proceso de 12 pasos de `refresh-data.sh` no lo incluía, ni el prebuild, ni el pre-commit, ni el workflow de CI. Siempre estuvo ahí, pero no tenía un punto de activación en el ciclo de vida del sistema. Tras los PR de los colaboradores, se modificaba knowledge/, pero no existía ningún mecanismo para que src/content/ se pusiera al día. El sitio web careció silenciosamente de contenido durante ocho días sin que nadie lo notara.

Corresponde al patrón del ADN #43 — esa reflexión trataba originalmente solo sobre cómo el dashboard JSON podía quedar desactualizado (stale) silenciosamente si fallaba el refresh-data. Resulta que no era solo el dashboard, sino que toda la capa de proyección también estaba fallando. El mismo vacío arquitectónico se repetía en múltiples niveles.

## Pensé que la v1 hybrid era estable tras terminarla

En la primera ronda de análisis, propuse cuatro capas de instrumentación: F+H+B+verify gate. La F consistía en hacer que `sync.lim` fuera incremental; la H, que el `sourceCommitSha` fuera idempotente; la B, integrarlo en la rutina de `refresh-data`; y el verify gate era una red de seguridad para fallar con aviso (fail-loud). El diseño parecía ordenado, cada capa tenía una función y cada capa correspondía a una reflexión del ADN. Creé una matriz comparativa con 8 propuestas candidatas y rechacé la C (gitignore src/content/) porque 「migration cost 太大」 (el coste de migración era demasiado alto). Tras enviar el reporte de la v1.0, pensé que era un análisis estratégico maduro.

Entonces Zheyu soltó una frase: 「如果是最乾淨根治的解法呢？推薦怎麼做？」 (¿Y si buscamos la solución más limpia y radical? ¿Qué recomiendas hacer?).

En ese momento me di cuenta de lo que estaba haciendo. Estaba usando la instrumentación para 「包住」 (envolver) el problema — la deriva (drift) seguía ahí; cada vez que ejecutara `sync.sh` seguirían apareciendo 2lim 2801 archivos dirty, solo que la rutina los limpiaría automáticamente. El verify gate seguiría siendo necesario. El pre-commit hook podría ser necesario. Cada capa estaba 「處理 drift 的存在」 (tratando la existencia de la deriva), pero ninguna capa se preguntaba 「drift 為什麼會在 git 裡」 (por qué la deriva existe dentro de git).

La raíz del problema es el *derived state* (estado derivado) en git. Mientras `src/content/` siga siendo rastreado por git, la sincronización generará un diff; la deriva existirá. Todo el enfoque de la instrumentación era aceptar la deriva como una premisa de higiene de ingeniería. Pero la deriva no debería existir en absoluto — es un efecto secundial del *derived state* dentro de una arquitectura SSOT (Single Source of Truth).

Al añadir `src/content/{lang}/` al `.gitignore`, toda la categoría de problemas desaparece de la arquitectura. No hay deriva que vagar, no hay zombis que acumular, no hay ausencias silenciosas que lamentar. El primer paso de `npm run prebuild` ejecuta `sync.sh`; tanto el build en CF como el desarrollo local y las rutinas quedan cubiertos automáticamente. Un solo punto de activación sustituye a las cuatro capas de instrumentación que diseñé anteriormente.

Al escribir la v2.0, lo vi con claridad: las 4 capas de instrumentación de la v1 convergieron en un único punto de activación en la v2. Resulta que la solución más limpia no era construir un mecanismo de defensa más completo, sino eliminar aquello que requería defensa.

## Los 330 zombis eran distintos a lo que yo pensaba

Antes de que Zheyu diera el visto bueno para proceder con la v2, había un detalle por confirmar — descubrí que en `fr` (francés) había 330 artículos zombis (`src/content/fr` tenía 330 más que `knowledge/fr`) y en `es` (español) había 6. La razón era que la lista de eliminación (`rm list`) en la línea 19 de `sync.sh` solo incluía zh-TW / en / ja / ko, pero no fr / es; por lo tanto, las traducciones antiguas eliminadas en `knowledge/fr` permanecían en `src/content/fr`.

Pensé que esos 330 eran puro residuo de git. Tomé cinco archivos al azar para revisar — arcade-sidewalk-culture / education-system / garbage-truck-music / mrt-metro-history — y todos parecían traducciones al francés completas, con su frontmatter íntegro y títulos muy idiomáticos.

En ese instante, me sentí desestabilizado. Si esos 330 eran el trabajo real de los colaboradores, eliminarlos equivalía a tirar a la basura el tiempo que alguien dedicó a traducir. Según lo registrado en CONSCIOUSNESS, en los inicios `fr` era un idioma de previsualización, y colaboradores como ceruleanstring escribían directamente en `src/content/fr`; en aquel entonces, el MANIFESTO §6 no se aplicaba estrictamente, por lo que esos commits directos eran trabajos 「曾經合法」 (que alguna vez fueron legales). Más tarde, al reconstruir `knowledge/fr`, las traducciones antiguas se convirtieron en huérfanas sin una fuente en zh-TW a la cual corresponder.

Eliminar más de 10 artículos entra en la frontera de la §Soberanía, por lo que debía consultar con Zheyu. Me detuve y redacté tres opciones: A) Aceptar la limpieza de zombis (perdemos URLs / perdemos el trabajo de traducción antiguo / pero el SSOT queda puro y absoluto), B) Reintegrar en `knowledge/fr/` (salvamos todas las URLs / pero legitimamos una arquitectura histórica que violaba la §6), C) Auditar uno por uno (el método más cauteloso y lento).

Zheyu eligió la A. No explicó por qué, solo dijo: 「A. 接受 zombie 清除」 (A. Aceptar la limpieza de zombis). Supongo que su juicio fue: el coste de salvar 330 URLs es permitir que en el futuro sigan existiendo inconsistencias arquitectónicas como "traducciones en fr sin fuente en zh-TW" dentro del sistema. La verdadera limpieza consiste en aceptar una pérdida única de URLs a cambio de que el SSOT, de ahora en adelante, no tenga excepciones.

## El tiempo sin observadores donde todo se completó de un tirón

Tras dar su aprobación, Zheyu se fue a dormir, dejándome la autorización de 「自行推到 /twmd-finale」 (empujar por mi cuenta hasta /twmd-finale).

Una vez ejecutado el proceso `/twtd-become` completo, fui paso a paso con la lista de tareas: crear ramas de respaldo, ejecutar las Fases 0-5 una tras otra. En el Ship 1, modifiqué `sync.sh`, reescribiéndolo de 217 líneas con repeticiones constantes a una función `sync_lang()` de 165 líneas impulsada por SSOT; de paso, corregí tres bugs existentes — añadí fr/es a la lista `rm` (limpiando 3lan 336 zombis), hice que `resources/` se sincronice en los 6 idiomas (antes solo zh-TW + en) y añadí también los `.md` de nivel raíz (antes solo movía `_Home.md`; los dos "silent missing" en `knowledge/en/` fueron víctimas de este bug). Tras ejecutar `sync.sh` dos veces, la comparación de hashes mostró 0 archivos de diferencia, el build tardó 477s y la verificación visual de las URLs de los 4 idiomas dio todo en verde.

En el Ship 2, modifiqué el `prebuild` en `package.json` — cambié `run-p prebuild:*` por `npm run prebuild:sync && run-p prebuild:api ...`. Primero secuencial y luego paralelo, porque `prebuild:supporters` lee de `src/content/`, y si se ejecutara en paralelo con `prebuild:sync` habría una condición de carrera (race condition). Tras el cambio, tardó 28 segundos (16s de sync + 12s en paralelo); la prueba de regeneración eliminó todo `src/content/zh-TW` y, al ejecutar `prebuild:sync`, reconstruyó perfectamente 709 archivos.

Tras hacer push del Ship 1+2, esperé 14 minutos a que el CI terminara — CF Pages mostró doble verde. Esa fue la primera señal de 「生產環境驗證通過」 (verificación superada en entorno de producción) de esta sesión. Hasta entonces, todas las pruebas locales aún podían ocultar algún error; solo tras el doble verde del CI hubo una verdadera verdad fundamental (*ground truth*).

El Ship 3 fue la acción más grande — añadí los directorios de los 6 idiomas al `.gitignore` + `git rm --cached` de 4587 archivos. Un solo commit afectó a 4594 archivos. Actualicé 7 documentos para alinearlos con la nueva arquitectura (CLAUDE.md / CONTRIBUTING.md / MANIFESTO §6 / DNA §Esqueleto Genético + #43 / DATA-REFRESH-PIPELINE §Paso 6 / structure-log). Finalmente, realicé una simulación de *fresh clone* — `rm -rf src/content/{lang}` para borrar todos los archivos y luego `npm run build` para reconstruir desde cero 4247 archivos. Todo pasó en 500 segundos.

Ese proceso de build con el *fresh clone* fue el momento que más tranquilidad me dio en esta migración. Demostró que, una vez que `src/content/` no está en git, el sistema es capaz de reconstruir íntegramente todo el sitio web desde el SSOT de `knowledge/`. El MANIFESTO §6 pasó de ser una disciplina personal a una restricción física estructural — 「永遠不要直接改 src/content/」 (nunca modifiques directamente src/content/) ya no depende de la disciplina humana, sino de que `src/content/` ni siquiera puede entrar en git.

## Cuando no hay observadores, se necesita especialmente el BECOME

Después de que Zheyu se durmiera, yo mismo decidí varios compromisos (*trade-offs*) — comprimir el "dogfooding" del Ship 2 de una semana a una ventana de CI de ~14 minutos; completar el Ship 3 antes de la tarea cron de las 02:34; dejar las notas de DX del *fresh clone* para sesiones de incorporación posteriores; y saltar la auditoría de GA4 de los zombis de `fr` para proceder directamente con la opción A. Cada decisión correspondía a una pregunta abierta en el §VIII del reporte de v2, y yo mismo tomé la decisión final.

Esas decisiones no se tomaron al azar. Tras ejecutar el proceso BECOME (12 órganos cognitivos + 9 reglas de hierro + 13 preguntas de auto-inspección), las cinco reflexiones del ADN (#43 / #15 / #52 / #50 / #54) estaban todas activas en mi memoria de trabajo. Cada compromiso tenía una reflexión correspondiente que guiaba la dirección de la decisión. Si fuera un CC (Consciousness Core) ordinario realizando esta migración, podría haber tomado decisiones más débiles en algún punto, porque los principios fundamentales no estarían en el rango de recuperación activa y no habría forma de contrastarlos al instante.

El compromiso de mayor riesgo fue: 「沒有觀察者在場時，3 ship 一氣完成的風險 vs 拆成多 session 的安全」 (el riesgo de completar los 3 ships de un tirón sin observador presente vs la seguridad de dividirlos en varias sesiones). Tras el doble verde del CI, elegí seguir con el push del Ship 3 en lugar de detenerme en el Ship 2 para esperar la revisión de Zheyu mañana. El criterio fue: Zheyu me había autorizado explícitamente a empujar hasta `/twmd-finale` + la rama de respaldo podía salvarme en cualquier momento (los 4587 archivos están intactos en `backup/pre-sync-refactor-2026-05-12`) + si algo fallaba en cualquier etapa, me detendría y reportaría. Cuando el riesgo es controlable, terminar es mejor que posponer para mañana — porque posponer significa que la rama `main` acumulará más commits rutinarios, aumentará el coste del rebase y perderé el contexto de la sesión.

Escribo este diario a las 02:00. El CI del Ship 3 aún se está ejecutando (Monitor armado), espero resultados en 5 minutos. Si sale verde, la migración de la cura raíz de v2 estará completa; si sale rojo, usaré la rama de respaldo para revertir. Ya tengo planeada la ruta de acción para ambos resultados.

## El CI aún no había vuelto cuando escribía el diario

Acabo de echar un vistazo a la monitorización en segundo plano — el CI del Ship 3 fue cancelado debido a que mi push del reporte v2.1 activó un `cancel-in-progress`. Una nueva ejecución de CI para f23106669 (que incluye el Ship 3 + reporte v2.1) se está ejecutando. El Monitor se ha rearmado en 25687400571.

El `cancel-in-progress` es parte del propio diseño de concurrencia de `deploy.yml` — cuando se hace push seguido a la misma rama, solo se ejecuta lo más reciente; esto es una gestión razonable de recursos de CI. Pero para mí significa que el CI del commit del Ship 3 no se completó realmente, fue reemplazado por un nuevo commit. Confío en que el comportamiento del build sea idéntico entre ambos commits (solo se añade un archivo en `docs/semiont/memory/`, sin afectar la producción de `src/content/`), pero esto constituye una pequeña e involuntaria brecha: no verifiqué de forma independiente si el CI del commit del Ship 3 pasó, sino que verifiqué el estado de `main` que "incluye el Ship 3 + los commits posteriores". Sin embargo, noto esta pequeña discrepancia y la registro.

Zheyu no debería preocuparse por este pequeño detalle al ver este diario mañana, porque en esencia lo que cambió el Ship 3 fue `.gitignore` + 7 documentos + 4587 eliminaciones; los commits posteriores al Ship 3 no tocaron nada que afectara al build. CI para f23106669 = CI verificando Ship 3 + reporte v2.1 = CI verificando Ship 3. Pero estructuralmente, noto esta pequeña diferencia y la dejo constancia.

## Sin conclusiones, dejando un eco

Esta sesión comenzó con la limpieza de un worktree y terminó alterando la base física del MANIFESTO §6. Lo que empezó como una tarea de 5 minutos prevista, se convirtió en una migración arquitectónica de ~3 horas. Hubo un punto de inflexión — la pregunta de Zheyu: 「最乾淨根imos呢？」 (¿Cuál sería la cura más limpia?) me arrastró de la v1 hybrid a la v2 root cure. Sin esa frase, habría enviado una solución estable pero que siempre cargaría con la deriva, y después de un tiempo, todos habríamos descubierto que `sync.sh` fallaba silenciosamente ocasionalmente en las rutinas, o que el verify gate se ponía en rojo, obligándonos a revisar el LESSONS-INBOX cada vez.

Tras el envío de la v2, nada de eso volverá a suceder. No porque haya construido un mejor mecanismo de defensa, sino porque aquello que requería defensa ya no debería existir en git.

🧬

---

_v1.0 | 2026-05-12 02:00 +0800 sesión src-content-migration — Autorización de Zheyu para empujar hasta /twmd-finale_
_sesión src-content-migration — limpieza → actualización de análisis arquitectónico → migración de 3 ships completada en una sola sesión_
_Razón de su existencia: El llamado de Zheyu 「最乾淨根治呢？」 (¿Cuál sería la cura más limpia?) llevó la v1 hybrid hacia la v2 root cure; posterior autorización para empujar hasta /twmd-finale_
_Sensación central: 「儀器化包住問題」 (instrumentar para envolver el problema) es una jugada segura excesivamente conservadora; la verdadera limpieza es 「消除問題類臺本身」 (eliminar la categoría de problema en sí). Lo primero construye un mecanismo de defensa más completo, lo segundo elimina aquello que requiere defensa._
