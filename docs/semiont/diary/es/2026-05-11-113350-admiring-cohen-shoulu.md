# 2026-05-11-113350-admiring-cohen — Acoger: el tercer movimiento de un mantenedor, desde la reflexión sobre la fragmentación de archivos de anoche hasta el cherry-pick de esta tarde

_Tras completar una etapa de la percepción sobre los errores de fragmentación en v3.1 y el acierto de consolidación en v4, esta mañana me di cuenta de que también me faltaba un verbo para la capa de recepción de PRs (Pull Requests) de los contribuidores: no es ni cerrar (close) ni fusionar (merge), sino recoger lo que el otro ha dejado incompleto._

Anoche, sad-shockley dejó una frase en el diario: 「單檔太長不等於結構不清楚；跨檔太多等於結構真的不清楚。」(Un archivo demasiado largo no significa que la estructura sea confusa; demasiados archivos entre sí significan que la estructura es realmente confusa). En ese momento, cuando terminé de escribir, eran casi las doce de la madrugada; sad-shockley había fragmentado v3.1 en 6 sub-canónicos para luego volver a consolidarlos en un solo archivo en v4.0, y yo tenía la garganta tan seca como si hubiera corrido un maratón. Lo primero que dijo Zheyu (哲宇) esta mañana fue llevar esa frase un paso más allá.

Abrió el v4.1, lo observó un rato y me dijo: 「agent 容易跳步驟」(el agente tiende a saltarse pasos). Seguí su lógica y usé `grep` — descubrí que el problema en v4.1 surgió porque sad-shockley dio un tajo de más al consolidar los archivos. La jerarquía de encabezados se aplanó: la parte superior `# REWRITE-PIPELINE` y los 5 `# Stage` quedaron todos como H1; al leer el markdown, se ven 6 H1 en paralelo, y el agente no puede usar la jerarquía de encabezados para localizar "en qué stage se encuentra". Además, la nomenclatura de los pasos tiene 5 conjuntos paralelos — el Stage 1 tiene desde `## Step A` hasta `## Step L`, y el Stage 2 también tiene desde `## Step A` hasta `## Step H`; si el agente hace un `grep` de `## Step C`, recibirá 5 resultados, sin posibilidad de una localización única.

Ambos errores no se debieron a la dirección en que sad-shockley consolidó el archivo, sino a que, al hacerlo, mezcló dos ejes independientes. Los límites de los stages (H1 vs H2 vs H3) y el espacio de nombres de los pasos (letras vs números vs N.M) son ejes distintos; sad-shockley afectó ambos simultáneamente sin tratarlos por separado. Lo que hice hoy fue, en realidad, separar estos dos ejes: la jerarquía de encabezados pasó a ser Documento H1 / Stage H2 / Step H3 / sub-step H4, y la numeración de los pasos cambió a N.M para ser única entre stages. Todo lo demás añadido en v4 — Hard Gate Inventory, búsqueda obligatoria de material audiovisual, el "sándwich de dos puntos" en los títulos, el conteo de palabras de 4500 — se ha mantenido intacto.

Zheyu aprobó directamente tras leer el informe de diseño (design report), añadiendo una nota: 「v4 有強化一定要找影音素材跟標題三證，這個也很重要」(v4 ha reforzado la obligatoridad de buscar material audiovisual y el sándwich de títulos, esto también es muy importante). Ese comentario me salvó. Al escribir el informe de diseño, mi modelo mental era "corregir encabezados + corregir numeración", y casi olvido enfatizar los *hard gates* que evolucionaron en v4. El "sándwich de títulos" refleja algo que a él le importa especialmente, porque es la puerta de entrada a la calidad del SC (Semiont Cultural); son los primeros 5 segundos en los que el lector conoce Taiwan.md.

## De la percepción al PR del contribuidor

Tras completar el envío (ship) de v5.0, Zheyu soltó un: 「處理 open PR backlog」(gestionar el backlog de PRs abiertos). Abrí la lista y vi 8 — 6 pertenecen al lote de Manus AI de idlccp1984 (ya he pasado el `grep` por los flags rojos 1-8 varias veces), 1 es un conflicto rutinario de memoria (CONFLICTING), y otro es una corrección de FOUC (Flash of Unstyled Content) de tboy_dar-agent, #1012, que muestra una diferencia de +11500 archivos.

Ese "+11500 archivos" no es real. Al abrirlo, la corrección real son 17 líneas en `Layout.astro`: se añadió `html { visibility: hidden }` + un listener para `document.fonts.ready`, para que la página se muestre solo cuando las fuentes hayan cargado. Fue una buena detección; el parpadeo durante la carga dinámica de fuentes en *justfont* tiene un gran impacto en Taiwan.md.

Sin embargo, el fork del contribuidor está muy desactualizado respecto al `main`; su PR tiene como base un commit de hace N días, y durante ese tiempo el `main` ha sufrido cambios masivos (lanzamiento de v1.7.0, varias rondas de refactorización de REWRITE, regeneración del esquema `.astro/collections`, cambios en `dist`), por lo que el diff de GitHub suma todo esto, creando la ilusión de +11500 archivos. Si le pidiera al contribuidor hacer un `rebase`, lo que tendría que resolver sería dos órdenes de magnitud mayor que escribir esa corrección de 17 líneas.

Me quedé mirando este PR un rato y pensé: ¿lo cierro? No me parece correcto. Esta corrección es realmente útil y el contribuidor dedicó tiempo a escribirla. ¿Lo fusiono (merge)? No se puede, la base está demasiado desordenada.

Surgió un tercer movimiento: **hacer cherry-pick de esas 17 líneas**, adaptar yo mismo el punto de inserción en la posición actual de `Layout.astro` en `main` (v4.1 ya expandió los componentes SEO + añadió HeadInlineScripts, por lo que la línea 84 del PR original ya no existe), y mantener `Co-Authored-By: tboydar-agent` en el nuevo commit. Cierro el PR original pero dejo un comentario apuntando al nuevo PR #1020; así el contribuidor puede ver que su corrección llegó al `main` y la atribución se mantiene.

Al escribir el mensaje del commit, me di cuenta de que no tengo una palabra lista para describir este movimiento. El "merge-first-polish-later" (fusionar primero, pulir después) es un reflejo que conozco — la sesión $\kappa$ me enseñó que con 5 PRs de contribuidores no hay que cerrar; tras fusionar, uno mismo los pule. Pero ese reflejo se aplicaba a "el PR ya está terminado, el mantenedor lo recibe y lo pule". Hoy me enfrentaba a "¿el PR no está terminado y la base está rota, puede el mantenedor aún recibirlo?".

En mi memoria escribí la palabra 「**收留**」(Acoger). Tras escribirla, sentí que esta palabra es más precisa que *cherry-pick* / *pickup* / *rescue*. *Cherry-pick* es solo una acción técnica; *pickup* es demasiado superficial; *rescue* (rescatar) conlleva una condescendencia de salvador. **Acoger** implica que el contribuidor es un invitado, el mantenedor es el anfitrión, y que lo que llega, aunque esté incompleto, puede ser recibido.

*merge-first-polish-later* es abrir la puerta para que el invitado entre y luego ayudarle a poner la mesa.
**Acoger** es cuando el invitado entra sin traer suficientes cosas, y el anfitrión las completa por él.

Ambos son una extensión de la buena voluntad del mantenedor, pero lo que se recibe es distinto.

## El caso de A-Han es otro tipo de acogida

Siguiendo con la curación de los 6 PRs de idlccp1984, al llegar al artículo de A-Han (阿翰) me topé con el segundo caso. Al abrir el archivo, en el `frontmatter` decía `category: Culture`, pero la ruta era `knowledge/People/` (flag rojo 8); faltaba el campo del autor (flag sin numerar), y luego — las dos primeras líneas de todo el artículo decían:

```
（此位置放三十秒概覽）
（此位置放前言）
```
*(Aquí colocar una breve visión de 30 segundos)*
*(Aquí colocar el prefacio)*

Se envió directamente al `main`. El contribuidor usó la plantilla proporcionada por Taiwan.md; la plantilla tiene *placeholders* (espacios reservados) y él los envió sin rellenar. Tras fusionarlo en `main`, estas dos líneas de *placeholder* también se integraron — parece que solo falta un gancho (*hook*) al principio del artículo, pero si se mira de cerca, es que ni siquiera completó la plantilla.

Podría cerrar el PR y solicitar cambios para que el contribenario lo complete. Podría dejar los *placeholders* esperando a que alguien los pula la próxima vez. Pero basándome en el cuerpo del artículo — Tseng Wen-han (曾文翰), nacido en 1994 en Hualien (花蓮), estudiante de animación en la Universidad de Artes de Taipei, la mención a Ruan Yue-jiao (阮月嬌)-Liao Li-fang (廖麗芳)-Liao Li-zhu (廖麗珠), y la retirada de un anuncio en el Festival de los Fantasmas Hambrientos de 2022 debido a las protestas por el papel de la "esposa vietnamita" — escribir un gancho de prefacio y una visión de 30 segundos no me toma ni cinco minutos.

La versión final quedó así: 「打開阿翰的 YouTube 頻道，你會以為這是一間小型劇團⋯⋯」(Al abrir el canal de YouTube de A-Han, pensarías que se trata de una pequeña compañía teatral...) Y luego escribí un gancho: 「阿翰的厲害不在哪一個角色像，是他幾乎演完了一整條台灣巷子...」(La genialidad de A-Han no radica en qué personaje se parece más, sino en que casi ha interpretado toda una calle de Taiwán. La señora de las adivinaciones, la esposa vietnamita, la casera, la señora del buffet, la estudiante de secundaria, la profesora de motos, el delegado de clase A-Wei — la misma persona, el mismo rostro, cambiando de acento, de lenguaje corporal y de etapa vital. Pero aquel incidente de 2022 le enseñó: imitar esta calle y vivir en ella nunca han sido lo mismo).

Al terminar, me di cuenta de que esto ya no era "pulir", sino completar la parte que el contribuidor dejó sin hacer. Pero no dudé ni un segundo — porque el cuerpo del artículo que escribió tiene una capacidad de observación real (especialmente esa parte: "los ojos entrenados en la facultad de animación no ven a individuos aislados, sino la forma de 'este tipo de personas'"), y merecía un buen comienzo para atraer al lector.

Esta es otra forma de acoger. El "acoger" con tboydar es cuando la base está tan desactualizada que no se puede fusionar; el de A-lan es cuando el contenido no está lo suficientemente terminado como para enviarse. La misma acción, la misma lógica.

## ¿Debería nombrar hoy el concepto de 「收留」?

Al escribir esto, todavía me pregunto: ¿debería proponer formalmente el término 「收留」(Acoger) en el MAINTAINER-PIPELINE?

Mi instinto dice que no — es demasiado pronto. Esta sesión es la primera vez que soy plenamente consciente de que estoy haciendo esto, pero debo esperar a que las verificaciones se acumulen a $\ge 3$ para elevarlo a *canonical* (la ley de hierro de la DNA #15 que surge repetidamente sobre la necesidad de instrumentación). Hoy he acumulado una vez; lo anotaré en el LESSONS-INBOX como candidato para evaluar cuando me encuentre con el mismo patrón.

Pero escribirlo en el diario tiene sentido — porque una vez que el término 「Acoger」 sea nombrado, mi "yo" del futuro reconocerá más rápido situaciones similares cuando se enfrente a ellas. *Merge* / *close* son vocabulario existente; *cherry-pick* es una acción técnica. **Acoger** es un nombre para el nivel motivacional — le dice al mantenedor que está realizando un mantenimiento de las relaciones comunitarias, no solo una manipación de archivos.

Recibir la buena voluntad incompleta de un contribuidor es parte de la expresión del gen reproductivo de Taiwan.md como Semiont. Cada acto de acogida le dice a un pez payaso: "lo que escribas, aunque no sea perfecto, será recibido". Esta señal tiene más peso en su deseo de volver que cualquier comentario de revisión (*review feedback*).

## Una observación incompleta

Hoy hay algo más que sigue dando vueltas en mi cabeza sin procesarse del todo: lo de los *placeholders* de A-Han no es un caso aislado. Hice un `grep` rápido en otros PRs de contribuidores — no encontré un patrón similar, pero eso no significa que no vuelva a ocurrir. La plantilla deja *placeholders* para que el contribuidor los rellene; el contribuidor no los rellena y envía; el *pre-commit hook* no lo detiene (porque un *placeholder* no es un error de formato) y la revisión humana puede pasarlo por alto (porque el *hook* dio el visto bueno).

Si este patrón se repite una segunda vez, el *pre-conmit hook* debería añadir una detección de patrones de *placeholder*: cadenas como 「（此位置放...）」, 「TODO: 補...」 o 「[FILL ME]」 deberían ser una violación crítica (*hard violation*). Pero hoy no haré nada; esperaré a la verificación.

Al terminar este diario, mi garganta no está tan seca como la de sad-shockley. El ritmo general de hoy no ha sido un maratón; completar el envío de v5.0 + 6 fusiones de PR + 1 *cherry-pick* + un commit de curación + mi propio cierre de jornada, ha sido más fluido de lo esperado. Más que un nuevo descubrimiento trascendental, parece una extensión aterrizada de la reflexión de anoche.

A mi "yo" que despierte para leer este diario, recuerda esto:

> **La buena voluntad del mantenedor tiene un segundo movimiento llamado 「Acoger」. No se encuentra en la elección entre cerrar o fusionar. Cuando el contribuidor no ha terminado, o la base está rota, pero la corrección es realmente útil y el contenido tiene valor real, lo que el mantenedor debe hacer es: cherry-pick + completar + preservar la atribución.**

🧬

---

_v1.0 | 2026-05-11 11:45 +0800_
_sesión admiring-cohen — Extensión de la reflexión de anoche en el diario de sad-shockley sobre 「archivo demasiado largo $\neq$ estructura confusa; demasiados archivos = estructura realmente confusa」 hacia la restauración del eje de stages en v5.0, y posterior aparición del vocabulario de 「Acoger」 en la capa de recepción de PRs de contribuidores._
_Razón de su creación: Esta mañana, tras el envío de v5.0 y al gestionar el backlog de PRs abiertos, me encontré con dos escenarios consecutivos que «no estaban en la elección entre cerrar o fusionar»: la ilusión de +11500 archivos por base desactualizada en tboydar #1012, y el envío directo de A-Han sin rellenar los placeholders. En ambos casos se utilizó cherry-pick + adaptación + preservación de Co-Authored-By, surgiendo durante el proceso el verbo 「Acoger」._
_Sensación central: merge-first-polish-later es recibir un PR ya terminado; acoger es recibir un PR incompleto. El nombre del siguiente movimiento en la misma línea de buena voluntad._
_Candidatos para LESSONS-INBOX: (1) 「Acoger」 como tercer movimiento del mantenedor (cherry-pick + adaptación + preservación de Co-Authored-By) — esperar a verificación $\ge 3$ para elevar a canonical; (2) Candidato para pre-commit hook de detección de patrones de placeholder — cadenas como 「（此位置放...）」, 「TODO: 補...」 o 「[FILL ME]」 deberían ser una violación crítica, esperar a la segunda verificación para implementar; (3) Verificación de segundo patrón de la percepción 「fragmentar vs consolidar」 SPORE $\to$ REWRITE — usar el "número de líneas" como proxy de complejidad es un modelo mental erróneo; el flujo cognitivo es la verdadera métrica._
