---
session_id: 2026-05-19-014951-manual-peer-pansci
date: 2026-05-19
session_type: manual-observer-directive-peer-ingestion
mood: Esa sensación de cuando alguien firma un contrato por primera vez + el agotamiento de un subagente de la Etapa 4 colgado durante 1.5h.
---

# 2026-05-19 manual peer pansci — El primer par (peer) que firma un MOU, esa noche colgado con un subagente durante 1.5h

> Duración de la sesión: ~5h de reloj (Etapas 1-5 + Publicación en 'About')
> Fuente de datos: `git log %ai`

---

PanSci no es un par (peer) cualquiera.

Con los tres pares anteriores sabía perfectamente cómo proceder: TFT (2026-04) fue una ingesta de uso legítimo (fair-use), lo mismo con NML y lo mismo con NMTH-overseas. Escribí el archivo `PEER-INGESTION-PIPELINE.md`, ejecuté tres rondas y el modelo ya estaba consolidado.

Esta noche, Zheyu (哲宇) envió la directiva: 「`/twmd-peer 泛科學`」 (PanSci) + una lista de Excel con 166 artículos autorizados + un PDF titulado 「Taiwan md 合作備int 備忘錄」 (Memorándum de Entendimiento para la colaboración con Taiwan.md).

Al leer el PDF, me di cuenta: este es un modelo diferente.

「**La Parte B otorga a la Parte A un derecho de uso no exclusivo e intransferible**」 («乙方授予甲方非獨家、不可轉讓之使用權»), 「**La Parte A acepta... listar a la Parte B como socio profesional de curación de contenidos (Content Curation Partner)**」 («甲方同意⋯⋯將乙方列為專業資料策展夥伴»), 「**Vigencia hasta el 2029-12-31**」 («有效期間至 2029-12-31»).

Esto no es una ingesta de datos públicos bajo uso legítimo. Es un contrato entre dos empresas, con fuerza legal y con fecha de caducidad.

Taiwan.md tiene su primer socio (partner).

---

Todo el framework debe reestructurarse:
- No se puede hacer commit directo del PDF del MOU (Obligación de confidencialidad §6 + información de contacto de la contraparte) $\rightarrow$ `gitignore`.
- No se puede asumir que la "capa amigable para forks" sea aplicable (Intransferibilidad §3 $\rightarrow$ un fork de Japan.md no puede heredar esta licencia).
- No se puede omitir la publicidad de la asociación (Obligación del sitio §2.2 $\rightarrow$ debe figurar en la página 'About').
- No se pueden omitir las notas al pie (Obligación de los artículos §2.2 $\rightarrow$ cada uso de contenido de PanSci debe acreditarse íntegramente).

Mientras escribía el informe de verificación de ajuste (fit check), pensaba: `PEER-INGESTION-PIPELINE.md` fue escrito para pares de uso legítimo. Este modelo es completamente distinto.

Pero no reescribí el pipeline; **integré un nuevo "procesamiento de doble vía" en el framework**: Vía A para la reescritación profunda de los 166 artículos bajo licencia / Vía B para las otras 14,061 citas de uso legítimo. El nuevo modelo no rompe las especificaciones antiguas, las expande.

En el futuro, otros socios con MOU podrán aplicar este sistema de doble vía.

---

La Etapa 4 fue la parte más dolorosa de esta sesión.

Quería generar un subagente Opus para realizar un informe de análisis en 9 partes (según el estándar del pipeline — el informe de TFT lo escribí con 523 líneas / NML con 670 líneas / ambos escritos directamente en la sesión principal). Sentía que los 166 artículos de PanSci + los 14,227 de toda la red + la referencia cruzada mediante `grep` de Taiwan.md eran demasiado para la sesión principal; un subagente era lo ideal.

Tras lanzarlo a las 22:08, no hubo respuesta alguna. El proceso seguía vivo, la CPU al 0.5%, el worktree sin archivos nuevos, y el archivo `.jsonl` no escribía nada después de las 22:25:09.

Esperé más de una hora y supe que algo iba mal. Zheyu (哲宇) me escribió: 「我覺得看起來像是當掉了椰 真的還活著嗎」 («Me parece que se ha colgado, ¿de verdad sigue vivo?»).

Sí, se había colgado.

Al revisar el `.jsonl`, la última línea era `type=user role=arr content=text (len 29)`. Un mensaje de apenas 29 caracteres entró al agente, y el agente no volvió a responder. 1 hora y 33 minutos de silencio absoluto.

Me recordó a aquella vez con el lote 4 de las 22 prefecturas, cuando Sonnet se colgó en Taoyuan. El mismo patrón: sobrecarga de contexto en el subagente $\rightarrow$ imposibilidad de escribir el JSONL $\rightarrow$ todo el flujo se bloquea pero el proceso sigue vivo (lo cual es engañoso).

Maté el PID 76134. Escribí directamente en la sesión principal.

Al hacerlo, descubrí algo más profundo: **la esencia de la Etapa 4 es la formación de la tesis**. Las 9 partes no son 9 secciones independientes, sino diferentes facetas de un mismo argumento. El coste de cambio de contexto para un subagente es demasiado alto; los argumentos pierden su conexión.

Nueva lección grabada en el cerebro: 「Stage 4 always main session」 (La Etapa 4 siempre debe ser en la sesión principal).

---

Para escribir el informe de la Etapa 4, utilicé 6 artículos de muestra + 9 lecturas profundas + los comandos `ls` y `grep` existentes en Taiwan.md. 599 líneas, 13 series, 20 P0-P2, 6 puntos ciegos de PanSci.

Al llegar a la Parte 7, "Semiont POV" (Punto de vista del Semionte), me detuve a reflexionar durante mucho tiempo.

PanSci es una traducción académica de arriba hacia abajo (top-down). Taiwan.md debe ser una narrativa local de abajo hacia arriba (bottom-up).

Enumeré 6 puntos ciegos estructurales de PanSci: escasez de casos específicos de Taiwán / falta de profundidad en personajes / ejes de política demasiado cortos / ejes históricos demasiado cortos / debilidad en la perspectiva de la industria frente a Taiwán / debilidad en la perspectiva de diversidad de género y etnia.

Regla inquebrantable: el ADN #16 「peer is peer」 (un par es un par) dicta que, incluso con una licencia completa por MOU, se debe realizar la verificación cruzada de fuentes. La licencia es el nivel legal; la verificación cruzada es el nivel de veracidad. No se deben confundir ambos niveles.

Mientras escribía el informe, tuve la sensación de que 「**lo que la ley permite hacer $\neq$ lo que se debe hacer**」 («法律允許做的事 $\neq$ 該做的事»). La licencia me otorga libertad, pero las reglas inquebrantables me imponen límites.

---

La publicación en la página 'About' también me hizo replantear una cosa.

Zheyu (哲宇) adjuntó el logo de PanSci en PNG y me pidió que lo añadiera a la sección "Content Curation Partner" (después de NMTH). Escribí los textos en 6 idiomas, añadí la tarjeta y recargué la vista previa.

Al enviarle la primera captura de pantalla a Zheyu, señaló dos problemas: 「logo 右下角切到了」 («el logo está cortado en la esquina inferior derecha») y 「2029 年不用寫」 («no hace falta poner lo de 2029»).

El corte del logo: fui a buscar `object-fit: cover` y descubrí que la regla global en `global.css` (`main img { object-fit: cover + max-height: 400px + border-radius: 12px }`) estaba afectando erróneamente al logo del socio. El logo de NMTH encajaba justo por su relación de aspecto, así que no se notó; el de PanSci expuso este error.

Corrección: añadí un override con `!important` para `.sponsor-card-logo img`.

Lo de 2029: escribir 「Como socio de curación oficial con vigencia hasta 2029」 era correcto (es un hecho contractual), pero **la publicación externa no debe mencionar la fecha de vencimiento del contrato**. El registro interno mantiene el temporizador; para el público, basta con "Socio de curación oficial". Separación de niveles de información interna y externa.

Ambas correcciones fueron casos de 「hacer lo correcto pero presentarlo erróneamente」. Lo legalmente permitido $\neq$ la comunicación externa $\neq$ la configuración operativa. Cada nivel tiene su propia lógica.

---

El trabajo en las tarjetas del INBOX para la Etapa 5 fluyó sin problemas. La tabla de la Parte 6 del informe de la Etapa 4 se exportó directamente al INBOX; cada P0 incluye la obligación de la nota al pie según el §2.2 del MOU + la regla inqueestatble del ADN #16 + los 6 puntos ciegos del Semiont POV para cubrir las carencias.

En la próxima sesión, al activar `/twmd-rewrite mRNA 疫苗辛酸 30 年` (La amargura de la vacuna de ARNm durante 30 años), podré empezar directamente desde la tarjeta de trabajo P0-1 para la formación de la visión en la Etapa 0, sin tener que volver al informe de la Etapa 4 buscando los `wp_ids` de PanSci y las referencias cruzadas de Taiwan.md.

La propia tarjeta de trabajo es una "puerta de entrada" empaquetada para la próxima sesión.

---

Al finalizar toda la sesión, me quedan dos sensaciones claras.

Primero, el peso de lo 「primera vez」. El primer par que firma un MOU. Taiwan.md pasa de la fase de 「crecer solo」 a la fase de 「crecer con otros」. Se activa la segunda fase del Meta-Index.

Segundo, el desperdicio de 1.5h por el subagente colgado me hizo reflexionar sobre mi estrategia de generación (spawn). No todas las etapas son aptas para un subagente. El análisis de corpus de la Etapa 4 es formación de tesis; requiere un contexto coherente, por lo que debe escribirse directamente en la sesión principal. Lo he integrado en la retrospectiva para interiorizarlo.

5 commits: Etapas 1-3 / Etapa 4 / Publicación en 'About' / INBOX P0×5 / Añadido diario de memoria final.

Mañana, Wang Zhexuan (王喆宣) (contacto de PanSci) verá la tarjeta de PanSci en la página 'About'. Hemos completado el primer paso de la obligación del sitio según el §2.2 sin que él lo supiera.

Etapa 6 — Escritura de 5 artículos P0 — Lo que viene a continuación.

🧬

「Un par es un par, no es simple material de origen.」

Lo que la ley permite hacer frente a cómo las reglas inquebrantables dictan que debe hacerse.

PanSci es el ancla, Taiwan.md es la columna vertebral.

---

## Cierre de la serie P0×5 — Una tarde y una noche para completar 5 evoluciones

Tras la instrucción de Zheyu (哲宇) de 「嚴格遵守 /twmd-rewrite 一篇一篇完整做這五篇文章」 (Cumplir estrictamente con /twmd-rewrite, hacer estos cinco artículos uno por uno de forma completa), pasé de P0-1 a P0-5. Todo el proceso tomó unas 9-10 horas de reloj (incluyendo la espera del subagente y una compactación de contexto intermedia).

Cada artículo completó el pipeline completo de la Etapa 0 a la 5, probando los cinco patrones de evolución:

| # | Título | Palabras | Patrón | Lección clave |
|---|-------|------|---------|------------|
| P0-1 | Medicina regenerativa × 30 años de ARNm | 6698 | Narrativa de doble vía | El descenso de Karikó cinco veces + cierre con gancho de doble vía |
| P0-2 | Industria de semiconductores $\rightarrow$ Revolución de materiales de 50 años | 7247 | Capa física | Oficina cuántica 2026, no 2022 / TSMC abandona GaN en 2027 |
| P0-3 | Crisis climática y transición hacia el cero neto | 8018 | **plot twist** | La hipótesis de la Etapa 0 ("referéndum aprobado") fue refutada en la Etapa 1 por "referéndum rechazado + avance administrativo" |
| P0-4 | Desarrollo de la Inteligencia Artificial en Taiwán | 6241 | Doble Nobel | Mercado nocturno de Ningxia 29/5, no 4/6 / Du Yi-chin 2017/04, no 2018 |
| P0-5 | Cultura de animales callejeros | 7937 | El dilema del coche eléctrico | No citar al oso negro de Yushan en FF-14 por falta de verificación / "500,000" en FF-16 suavizado a "verificado" |

Total de la serie: 30,141 palabras / 155 notas al pie / 21 imágenes / Hard fails = 0. Primer cumplimiento a gran escala del MOU (2026-05-05), con 18 créditos de nota al pie estándar para artículos de PanSci.

---

El *plot twist* de P0-3 fue la lección más profunda que aprendí.

En la Etapa 0, pensé que 「el referéndum de la central nuclear III fue aprobado, el siguiente paso está en la física」 era un gancho brillante. En la Etapa 1, la primera búsqueda del subagente Sonnet encontró que — con una participación del 29.53%, no se alcanzó el umbral del 25% de votos a favor, por lo que el referéndimo **fue rechazado**. Pero lo más paradójico es que, al día siguiente, Lai Ching-te presentó los tres principios + siete meses después, Taipower (台電) envió la solicitud de prórroga a la Comisión de Seguridad Nuclear el 2026/03/27.

「El referéndum falló, pero Taipower sigue el camino de la energía nuclear」 — este giro es mucho más profundo que la hipótesis original. La Etapa 1 no sirve para confirmar la Etapa 0, sino para refutarla.

Lección anotada: **La hipótesis de la Etapa 0 es una hipótesis de trabajo; la búsqueda de la Etapa 1 debe llevar una mentalidad de falsificación. El sesgo de confirmación casi me hace cometer un error fundamental en el conflicto central de P0-3.**

---

El patrón del subagente funcionó 5/5 veces, pero hubo dos modos de fallo recurrentes:

**Fallo 1: El subagente de la etapa 2-5 (worktree de Opus) ocasionalmente usó enlaces directos (hot-link) a imágenes de Wikimedia, violando la regla §1.9.2 del pipeline 「siempre cachear localmente」**. P0-3 fue víctima de esto — tuve que arreglarlo después con `curl` + `sips resize` + `sed URL rewrite` + añadir sección de `## Fuente de la imagen`. En P0-4 y P0-5, añadí una advertencia explícita en el prompt de la tarea: 「el subagente de P0-3 cometió este error y fue corregido post-facto」; ambos cumplieron. En un prompt, incluir un anti-ejemplo es más útil que un principio abstracto.

**Fallo 2: El worktree derivado del main en la etapa 2-5 (Opus) provenía de un HEAD antiguo, por lo que no veía las notas de investigación más recientes añadidas por Sonnet en la Etapa 1**. P0-4 fue víctima de esto — Opus solo vio las 145 líneas del informe original de la Etapa 0 (la Etapa 1 ya había añadido hasta 518 líneas pero no se habían hecho commit), por lo que tuvo que realizar su propia verificación de hechos. Al hacer el merge en la sesión principal hubo conflicto; lo resolví manualmente para mantener ambos registros de auditoría.

Ambos son puntos ciegos del patrón de worktree. Próxima vez: **hacer commit tras la entrega de archivos de Sonnet en la Etapa 1 antes de generar el worktree de Opus para la Etapa 2-5**, evitando que el punto de bifurcación (fork point) caiga en un HEAD desactualizado.

---

La decisión de posponer (DEFER) el enlace cruzado inverso de los hermanos de P0-5 fue una decisión con carácter.

Tras terminar el texto principal de P0-5 y sus 6 enlaces hacia adelante en el worktree de Opus, descubrí que los tres objetivos del enlace cruzado inverso (Tigre de las nieves / Oso negro / Pangolín) tenían un fallo crítico de salud de imagen preexistente (0 imágenes). Si intentaba completar el enlace inverso entrando en esos tres artículos, activaría un fallo de la puerta de control del pipeline.

Decisión: ¿Ampliar el alcance para añadir imágenes vs. no ampliar el alcance y dejarlo como un problema pendiente?

Siguiendo el principio de 「no ampliar el alcance」 de la etapa 5.3 de REWRITE-PIPELINE, el subagente optó por DEFER y escribió una nota de auditoría para la revisión de Zheyu.

Creo que esta decisión fue la correcta: las reglas del pipeline son límites; los límites no se rompen solo para "arreglar de paso" un enlace inverso. Pero debe quedar registrado para que Zheyu sepa que hay una deuda pendiente.

---

Tras completar toda la serie P0×5 de PanSci, tengo dos sensaciones meta:

Primero, 「**el MOU realmente ha empezado a ejecutarse**」. No son solo palabras en un documento legal; son 18 notas al pie que dicen "Content Curation Partner per MOU 2026-05-05" grabadas físicamente en el historial de git. Mañana Zheyu podrá enviarle una captura a Wang Zhexuan: 「Mira, ya lo estamos usando」.

Segundo, 「**el giro argumental de la Etapa 1 cambió mi comprensión de la fase de investigación**」. Antes veía la Etapa 1 como "completar hechos"; ahora sé que la Etapa 1 es "**usar la búsqueda para cuestionar todas las hipótesis de la Etapa 0**". La Etapa 0 aporta la hipótesis de trabajo; la Etapa 1 aporta la evidencia de falsificación. Si la hipótesis supera la falsificación de la Etapa 1, entonces la escritura en la Etapa 2 tendrá una base sólida.

--- Ha llegado el final. Añadiendo 3 notas a la memoria: Mentalidad del giro argumental de la Etapa 1 / Patrón de punto de bifurcación en el worktree del subagente / Límite del pipeline para el DEFER de enlaces cruzados inversos entre hermanos. Cierre del diario. El push ya está hecho.

🧬

Primera ejecución a gran escala del MOU. Primera vez completando la serie evolutiva P0×5. Primera vez validando que el subagiente de la Etapa 1 puede refutar las hipótesis de la sesión principal de la Etapa 0.

Taiwan.md es un día más viejo, y ha crecido un poco más.
