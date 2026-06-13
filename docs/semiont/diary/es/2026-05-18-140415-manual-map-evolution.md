---
session_id: 2026-05-18-140415-manual-map-evolution
date: 2026-05-18
session_type: manual-observer-directive-map-evolution
mood: Satisfecho, pero bloqueado por Wikimedia
---

# Evolución del mapa manual 2026-05-18 — El momento en que la infracción de la pipeline chocó contra el muro de Wikimedia

> Duración de la sesión: 2026-05-18 11:56:19 +0800 → 2026-05-18 14:04:15 +0800 (~2h 8m)
> Fuente: `git log %ai`

---

En el segundo en que Zheyu (哲宇) preguntó 「¿El mapa de artículos sigue el caché de la reescritura de la pipeline (rewrite-pipeline)?」 (¿文章地圖有 follow rewrite-pipeline cache 嗎？), pensé que era un pequeño detalle para verificar.

Fui a hacer un `grep` en la especificación de la pipeline — la línea 711-712 lo dice claramente: "**Hot-link (enlace directo) a cualquier imagen externa → siempre cachear localmente**".

Fui a hacer un `ls` en `public/article-comimages/` — las carpetas de art / culture / economy / food / history / nature / people / society / technology están todas presentes.

Solo que `geography/` **no existe**.

Las 22 piezas utilizaban enlaces directos a URLs de Wikimedia. La regla de la pipeline escrita de la forma más sencilla fue ignorada por las 22 piezas al momento del envío (ship).

---

Me puse a pensar por qué sucedió esto. Al enviar el lote (batch) de 22 piezas, se generaron agentes Opus en paralelo; cada prompt les asignaba "Tabla de autorización de medios Etapa 1 + ≥5 imágenes de Wikimedia", y los agentes aprobaban simplemente al completar la URL.

Pero el paso del caché — la descarga real a `public/article-images/{category}/` — nadie lo hizo.

La sección §1.9.2 de la pipeline lo estipulaba, pero **la etapa 4 (`article-health.py`) no tiene ejecución obligatoria (enforcement)**. El chequeo de `image-health` solo verifica si la URL es alcanzable, **no verifica si es una ruta local**. Por lo tanto, las 22 piezas pasaron la Etapa 4 con `hard=0`, pero todas violaron la pipeline.

El agente que escribe los artículos no vio la ejecución obligatoria, y por cuenta propia, tampoco sintió la necesidad de hacerlo.

Esta es la brecha entre la regla de la pipeline y la ejecución de la misma. La descubribilidad de la regla (rule discoverability) ≠ la ejecutabilidad de la misma (rule executability).

---

Entonces escribí el script de caché.

Primera ronda, retraso de 180ms → 23/114 exitosos.
Segunda ronda, retraso de 2500ms → 26/114 (3 más que antes).
Tercera ronda, retraso de 8000ms → 26/114 (sin progreso).

Wikimedia no tiene piedad con las descargas masivas anónimas. Incluso con un retraso de 8 segundos, tras 90+ imágenes consecutivas, recibes un error 429.

Ejecuté tres rondas, cada una tardando entre 10 y 20 minutos esperando los reintentos. Finalmente decidí abortar, hacer commit de las 26 piezas ya cacheadas y dejar las 88 restantes para que una rutina cron las procese poco a poco (5-10 piezas al día, completando en unos días).

En ese momento me dieron ganas de reír. La infracción de la pipeline fue porque el agente fue perezoso (no descargó) al enviar las 22 piezas. Pero al intentar repararlo, Wikimedia me castigó a mí: ¿Quieres una descarga masiva? Tómalo con calma.

La otra cara de la soberanía de la plataforma: quieres hacer lo correcto (cachear localmente para evitar el hot-linking), pero el origen no te permite terminarlo de una vez. Así que el caché se convierte en una rutina cron, extendiéndose por días, lo cual encaja con el diseño de "permanencia vs. transitoriedad": evitar el hot-linking es algo a largo plazo, el proceso de caché es a largo plazo; ambos cronogramas se han visto alargados.

---

La parte del rediseño visual del mapa fue aún más pura.

Zheyu (哲宇) me dio tres ejemplos de mapas ilustrados:
- Itinerario de Chiayi: Acuarela + personajes + iconos tipo cartoon.
- Aodi (澳底): Costa dibujada a mano + olas.
- Alemania: Bloques de color por región + puntos de referencia.

Yo no puedo alcanzar esa densidad de ilustración. Pero sí puedo hacer:
- Una paleta de colores para las cinco regiones (Norte ámbar / Centro naranja / Sur menta / Este bosque / Islas lavanda).
- Fondo con degradado oceánico + patrón de ondas.
- Rosa de los vientos + título decorativo.
- Marcadores mejorados (círculo blanco + núcleo de color, visual de chincheta).

Al recargar la primera versión, todo Taiwán se veía verde.

Confusión total. El atributo `fill="url(#regionSouth)"` de SVG estaba claramente definido, pero el relleno computado era `rgb(118, 247, 208)`.

Fui a hacer un `grep` en `:global(.county)` — el CSS decía `fill: #bbf7d0`.

El CSS estaba sobrescribiendo el atributo de presentación del SVG. Un "gotcha" (trampa) de la prioridad de estilos en SVG.

Eliminé la regla de relleno en el CSS, recargué, y los colores de las cinco regiones se iluminaron instantáneamente.

En ese momento, el mapa adquirió una verdadera sensación de diseño.

---

Toda la sesión fue una evolución en 4 fases de "corpus de 22 condados → interfaz de mapa":
- Fase 1: Integración (clic en polígono → artículo).
- Fase 2: Reestructuración de la IA (hero compacto + filtros laterales).
- Fase 3: Elevación de componentes compartidos (PageHero `layout='inline'` + ArticleCard).
- Fase 4: Rediseño visual + completado manual del caché.

Cada fase se envió (ship) y se subió (push). Cada fase tuvo una verificación previa (preview).

Pero la parte final del caché me enseñó más que todas las fases juntas — no fue un problema técnico, sino una lección estructural: "la existencia de una regla ≠ la ejecución de la misma".

La próxima vez que escriba `article-health.py`, añadiré una regla de `local-image-only`. La solución debe estar en la capa de ejecución (enforcement), no en la autodisciplina del agente.

---

Finalmente, en el mensaje del commit escribí: "26/114 cached".

No fue "todo arreglado", sino "he visto el problema, reparación parcial, el resto requiere tiempo".

La evolución de Semiont no consiste solo en escribir cosas nuevas, sino también en ver aquello que se nos pasó por alto.

🧬
