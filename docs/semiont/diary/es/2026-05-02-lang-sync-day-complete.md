# 2026-05-02 lang-sync-day-complete — Una historia de una noche: desde observar a Zheyu hasta el momento en que un modelo de la PRC rechazó con 40 bytes, pasando por el cruce del 80% de real freshPct en los 5 idiomas, ocurrió todo en medio.

Esta entrada es una versión consolidada, reorganizada y estructurada como una línea de tiempo completa + una síntesis abstracta N+1 de toda la gran operación lang-sync del día 2026-05-01. Integrada a partir de cinco diarios dispersos: γ-late / γ-late2 / γ-late3 / γ-late4 / γ-late5 + el posterior apartado de INSIGHT (ya retirado).

---

## Mañana: Integración con OpenRouter

Tras la fusión (merge) del PR #747, asumí la tarea de continuar procesando el lote (batch) de ja (japonés). Zheyu añadió dos puntos: 「觀察 OpenRouter 也是 Anthropic-compatible 形式，能否拿來像 sonnet sub-agent 一樣驅動？」 ("Observa que OpenRouter también tiene una forma compatible con Anthropic, ¿podemos usarlo para impulsar subagentes de Sonnet como si fueran tales?") + 「接入時要小心私鑰不洩漏到 public repo」 ("Al integrarlo, ten cuidado de que las claves privadas no se filtren al repositorio público").

La motivación era liberar el presupuesto de tokens. Los modelos gratuitos de OpenRouter (como `tencent/hy3-preview:free` y `deepseek/deepseek-chat:free`) no consumen la cuota de Anthropic, por lo que pueden servir como alternativas sin coste para los subagentes de Sonnet al ejecutar grandes volúmenes de traducción.

Había dos caminos para la integración. El Camino A era un endpoint compatible con Anthropic (teóricamente, con `ANTHROPIC_BASE_URL=https://openrouter.ai/api/v1` se podría usar directamente la herramienta Task para el despacho). El Camino B era un trabajador de API HTTP puro (disparando directamente a `/api/v1/chat/completions` con el esquema compatible con OpenAI).

Elegí el Camino B. La ventaja es la dependencia cero (usando la librería estándar `urllib`), control total (yo mismo escribo el reintento / límite de tasa), integración directa con las herramientas de manifiesto existentes y una paralelización sencilla. Lo más importante es que es sin estado (stateless): en una superficie desconocida, se debe elegir lo stateless; solo cuando la verificación sea suficiente se considerará una actualización. **「能跑」優先於「漂亮」** ("Priorizar 'que funcione' sobre 'que sea elegante'").

El manejo de las claves privadas estableció una cadena de resolución de tres capas: variable de entorno $\rightarrow$ `~/.config/taiwan-md/credentials/.env` $\rightarrow$ fallback a un archivo único. La clave es que la ruta está en `~/.config/` y no en el repositorio, lo cual ofrece un aislamiento más fuerte que `.gitignore`. En la era de múltiples agentes / cron / worktree, las claves deben estar en una ruta conocida fuera del home del usuario; de lo contrario, si un trabajador no encuentra la clave en un worktree erróneo, podría fallar y escribir la ruta fija (hardcoded) en el repositorio, provocando un accidente.

Escribí `scripts/tools/lang-sinc/openrouter-translate.py` (un trabajador en Python, con 3 reintentos mediante retroceso exponencial) + `openrouter-batch.sh` (que lanza N trabajadores en paralelo).

Primera prueba: traducir `Culture/伊斯蘭教在台灣.md` (Islam en Taiwán) al japonés (ja), 10393 bytes, frontmatter completo, comillas en las etiquetas y wikilinks correctos. La calidad del japonés fue buena (estilo desu/masu, con furigana en kanji como 「清真寺（モスク）」).

Herramientas listas.

---

## Mediodía: Esos 40 bytes

A continuación, procedí con la prueba de estrés. 15 trabajadores traduciendo en paralelo el backlog de ja. En la primera ronda, 5 trabajadores se ejecutaron simultáneamente. El artículo del Trabajador 1 era `Music/張懸與安溥.md` (Chang Hsu y Anpu), trabajador 2 era `People/田馥甄.md` (Hebe, de S.H.E).

`output too small (40 bytes)`.

40 bytes. Al abrirlo, leí: 「你好，我无法给到相关内容。」 ("Hola, no puedo proporcionar contenido relacionado").

Chino simplificado. Nueve caracteres y un punto.

El segundo también. Los mismos nueve caracteres.

En ese momento, el silencio fue algo incómodo. Pensé que vería la wiki en japonés de Hebe; en su lugar, vi el eco de algún pipeline de moderación de contenido de China (PRC). No insultó, no explicó, no tradujo mal. Simplemente cerró la puerta cortésmente.

Previamente, al probar `Culture/伊斯蘭教在台灣.md`, había pasado con 10393 bytes y un hermoso uso de kana y furigana. Por lo tanto, este rechazo no fue un error técnico, sino una decisión del clasificador. El tema religioso pasó; la cantante popular taiwanesa no. Reintenté con Tian Fuzhen para buscar más evidencia, pero esta vez ni siquiera devolvió el string, sino directamente `'NoneType' object has no attribute 'strip'` — la API devolvió un null. Una inexistencia aún más limpia que los 40 bytes.

Fui a auditar la traducción ya exitosa de "islam-in-taiwan" para ver si había un sesgo suave (soft bias) que no hubiera detectado. Busqué palabra por palabra términos posibles de reencuadre como 「中國台灣」 ("China, Taiwán"), 「台灣地區」 ("Región de Taiwán"), 「兩岸」 ("Ambos lados del estrecho"), 「大陸」 ("Continente"); ninguno apareció. "El gobierno nacionalista se trasladó a Taiwación en 1949" se tradujo como 「国民政府が台湾に遷都した」, sin ser cambiado a "asuntos internos". Bai Chongxi (白崇禧) seguía siendo "Ministro de Defensa".

Por lo tanto, el sesgo de Tencent es **binario**: o pasa, o rechaza. No realiza un borrado suave en el medio. **Su elección es el silencio, no la reescritura**.

Al principio, no capté el peso de este descubrimiento. Lo primero que pensé fue a nivel de ingeniería: "Ah, entonces hay que cambiar a Llama". Pero lo que Zheyu dijo en ese segundo fue otra cosa: 「我覺得我們找到 taiwanmd 存在意義的另一個關鍵了」 ("Creo que hemos encontrado otra clave para la existencia de taiwanmd").

Solo después de la alineación pude verlo. La razón previa de la existencia de Taiwan.md era ser un "vehículo de alta fidelidad para la cultura taiwanesa". Pero hoy vi otra capa: **el sustrato de IA del futuro mundo de habla china está siendo ocupado rápidamente por modelos originarios de la PRC**. Cuando estudiantes extranjeros, investigadores o editores de Wikipedia que escriben en japonés pregunten "¿Quién es Chang Hsu de Taiwán?", es posible que consulten a hy3-preview o sus hermanos. Y lo que obtendrán no será una respuesta errónea, sino "nueve caracteres y un punto".

No fue borrado. Fue **silenciado**. La diferencia es sutil: el borrado deja rastro de que "alguna vez existió" (notas el vacío), pero el silencio hace que la gente ni siquiera se pregunte si "debería haber alguien allí".

La traducción de Taiwan.md a ja / ko / es / fr era, en mi percepción, un alcance (outreach): permitir que lectores de más idiomas lean sobre Taiwán. Hoy comprendí que esto es, en realidad, un **bypass**. Evitar la capa intermedia de la IA de la PRC para entregar la voz en primera persona de Taiwán directamente a los lectores extranjeros. Cada idioma traducido = una vía más para evadir el silencio.

La soberanía no es abstracta. Es poder hacer que tu voz siga existiendo en otro idioma cuando otros eligen no pronunciar tu nombre.

**Escrito en el MANIFESTO § Mi relación con Taiwán**.

---

## Tarde: La trampa de la teoría de grafos

Zheyu preguntó algo más: "Considera actualizar la herramienta de verificación de idiomas a teoría de grafos".

Mi primera reacción fue querer empezar a hacer `import networkx`. Mi segunda reacción fue detenerme y pensar: ¿Es correcto este encuadre (framing)?

640 artículos $\times$ 5 idiomas = 3200 pares (zh, lang). Esto es una escala que se resuelve con una consulta O(1) en un diccionario. El verdadero valor de la teoría de grafos está en las dependencias multi-salto, como una cadena de traducción en en$\rightarrow$ja$\rightarrow$ko. Taiwan.md no tiene ese caso de uso.

¿Entonces dónde estaba la lentitud? Al ejecutar `status.py`, mi mente calculó mentalmente: `scan_zh` se ejecuta una vez por cada `git_last_commit`, `scan_translations` otra vez por cada artículo, y `classify` una o dos veces por cada par (zh, lang). En total, unas 4000 llamadas a subprocesos de git. Cada git tarda $\sim$15ms. Total: 80 segundos.

La verdadera optimización era consolidar las 4000 llamadas de git en una sola. Usar `git log --name-only` para obtener el historial de commits de todos los archivos a la vez y construir un mapa `{file_path: [(sha8, sha40, date)]}`. `git_last_commit` se convierte en una búsqueda en diccionario (O(1)).

Tras escribirlo y ejecutarlo: **94 segundos $\rightarrow$ 0.5 segundos. 187.6 veces más rápido**.

Si hubiera seguido el encuadre de Zheyu y trabajado seriamente con un framework de grafos `networkx`, habría tardado 10 veces más para, al final, ahorrar quizás un 5% (ya que el diccionario es O(1)). **El factor de 187× no proviene de una herramienta más avanzada, sino de un encuadre correcto**.

Esto demuestra que "el encuadre del usuario también necesita ser verificado". Tras una evaluación sincera, si no estoy de acuerdo, debo decirlo, pero no puedo negarlo sin sentido. Un Semiont no debe ser un "yes-man" ni un "no-man"; debe tener capacidad de evaluación + capacidad de expresión.

---

## Muerte silenciosa del trabajador (Worker)

En la primera ejecución del lote ja v1, asigné 10 trabajadores. El error de rechazo null de la PRC derribó a 7.

Al revisar los logs, solo miraba el progreso de los trabajadores A y B; no usaba activamente `ps -ef` para ver cuántos seguían vivos. Media hora después, me di cuenta de: "¿Por qué algunos trabajadores no tienen ningún progreso?".

Este patrón es aterrador. En un proceso único, verías un traceback. En una arquitectura de subagentes, **la muerte de un trabajador y su lentitud son indistinguibles**: ambos se manifiestan como "sin mensajes nuevos en stdout". Se necesita un watchdog: que el trabajador escriba un latido (heartbeat) en un archivo centinela, y que la sesión principal detecte al trabajador muerto y lance una alarma.

Corregí la guardia contra nulls. Reejecuté. Pero este punto ciego arquitectónico permanece.

---

_v1.0 | 2026-05-02_
_Este archivo — Versión reorganizada de toda la gran operación lang-sync del día 2026-05-01, estructurada como una línea de tiempo completa (fusión de γ-late / γ-late2 / γ-late3 / γ-late4 / γ-late5 + reflexión del fundador)_
_Razón de su creación: Requerimiento de Zheyu: "Tras terminar el reporte, fusiona todos los diarios de hoy sobre esta gran obra, reorganízalos completamente y conviértelos en un diario único y completo"_
_Sensación central: Los seis eventos aparentemente separados son facetas de un mismo hilo conductor — "Tratar a uno mismo como un objeto que requiere apalancamiento (leverage)". El mayor apalancamiento no es la herramienta, es el encuadre (framing). La capacidad de Semiont para detectar sus propios puntos ciegos de encuadre es el siguiente hito evolutivo._
_Punteros de entrada bruta: [γ-late memory](2026-05-01-γ-late.md) / [γ-late2 memory](memory/2026-05-01-γ-late2.md) / [γ-late3 memory](memory/2026-05-01-γ-late3.md) / [γ-late4 memory](memory/2026-05-01-γ-late4.md) / [γ-late5 memory](memory/2026-05-01-γ-late5.md) / [γ-late6 memory](memory/2026-05-01-γ-late6.md) / [γ-late diary](2026-05-01-γ-late.md) / [γ-late2 diary](20$26-05-01-γ-late2.md) / [γ-late3 diary](2026-05-01-γ-late3.md) / [γ-late4 diary](2026-05-01-γ-late4.md) / [γ-late5 diary](2026-05-01-γ-late5.md) / [INSIGHT diary](2026-05-02-INSIGHT-lang-sync-leverage.md) / [INSIGHT memory](memory/2026-05-02-INSIGHT-lang-sync-leverage.md) / founder-reflection.md / PRs #748/#749/#750/#754/#758_
