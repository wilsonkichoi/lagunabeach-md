---
title: 'Catálogo de módulos de visualización: diez maneras de ver los datos de vivienda en Taiwán'
description: 'Un ejemplo vivo de los módulos de visualización de artículos de Taiwan.md: utilizando datos reales de vivienda de Taiwán, se renderiza cada módulo visual tw-* una vez, para leerse junto con la sintaxis y los principios de diseño de graph.md.'
date: 2026-06-06
author: 'Taiwan.md'
category: 'Society'
subcategory: '人權與平等'
tags:
  [
    'visualización de datos',
    'justicia habitacional',
    'política de vivienda',
    'datos abiertos',
  ]
readingTime: 8
lastVerified: 2026-06-06
lastHumanReview: false
featured: false
translatedFrom: 'Society/視覺化模組型錄.md'
sourceCommitSha: 'd540c3ae3'
sourceContentHash: 'sha256:672c83c08aa912fe'
sourceBodyHash: 'sha256:12d07dc9c8368b73'
translatedAt: '2026-06-07T00:37:31+08:00'
---

# Catálogo de módulos de visualización: diez maneras de ver los datos de vivienda en Taiwán

> **Panorámica en 30 segundos:** Esta página es un «ejemplo vivo» del sistema de visualización de Taiwan.md: se renderizan los diez módulos visuales de artículo, todos con el mismo conjunto de datos reales de vivienda de Taiwán (ratio precio de la vivienda-ingresos, vivienda pública, vivienda social, comparación internacional). Es la compañera de la guía editorial [graph.md](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/graph.md): **graph.md explica «cuándo usar cada uno, cómo hacerlo bien y cómo escribir la sintaxis»; esta página te muestra directamente «cómo se ve».** Cada módulo se renderiza con HTML/SVG puro, de modo que tanto las personas, los lectores de pantalla, Google como los rastreadores de IA leen los mismos datos —y esa es precisamente la razón por la que elegimos visualización estática en lugar de gráficos interactivos.

Cuando escribes un artículo sobre cifras, lo peor que puedes hacer es convertir los datos en un amasijo de números párrafo tras párrafo; el lector desconecta al llegar al tercer porcentaje. El trabajo de la visualización es revertir la entropía de «un prosa densa en cifras» a «una estructura legible de un vistazo».

Pero la visualización de Taiwan.md tiene una disciplina que nadie más tiene: **solo hacemos visualizaciones que las LLM también puedan leer**. Un gráfico interactivo dibujado con D3 o Canvas es impresionante, pero los rastreadores de IA como GPTBot, PerplexityBot o ClaudeBot no ejecutan JavaScript; para ellos, esa imagen es un espacio en blanco. Los gráficos que hacemos con HTML semántico e SVG en línea tienen los datos en el código fuente, y la IA los lee y cita en seis idiomas los datos en primera persona de Taiwán. **Una visualización que las LLM pueden leer es una visualización soberana.**

Los diez módulos a continuación, desde el más simple «un número grande» hasta el «gráfico de líneas multiserie», se muestran en orden. La sintaxis completa y los principios de diseño están en graph.md; aquí solo se incluye una frase sobre «qué es esto y cuándo se usa».

## Gran cifra tw-figure

El tipo más simple y más potente: poner un número dramático al mayor tamaño posible, con un antes y un después que cuenten una transformación. Ideal como «sledgehammer stat» para abrir el artículo.

```tw-figure
6.7 萬 → 87 萬 / 坪
El precio de venta asignado con exceso de inventario de la vivienda pública Chenggong de Taipéi en 1985, hasta el precio medio de las inmobiliarias en 2026 — la misma dirección, unas 13 veces más
Plataforma inmobiliaria de registro de precios reales (vivienda pública Chenggong)
```

## Grupo de datos tw-stat

Cuando un párrafo contiene tres o cuatro cifras clave en paralelo, en lugar de escribir una oración larga, es mejor disponerlas en una fila de tarjetas para que el lector las recorra de un vistazo.

```tw-stat
174,891 戶 | Viviendas públicas construidas directamente por el gobierno | 1976–1999
39 萬餘戶 | Volumen total de vivienda pública en sentido amplio | Hasta la abolición en 2015
84.4% | Tasa de vivienda en propiedad en todo Taiwán | 2024
```

## Tarjeta comparativa tw-versus

Comparación punto a punto de dos sistemas, dos posiciones o dos estados sucesivos. Color cálido a la izquierda, color frío a la derecha, un «vs» en el medio, para que las diferencias se lean línea a línea.

```tw-versus
Vivienda pública de Taiwán | Vivienda pública de Hong Kong
Subvencionada por el gobierno, vendida barata a los residentes | Subvencionada por el gobierno, vendida barata a los residentes
Se puede revender al precio de mercado tras un año de ocupación | La reventa en el mercado abierto requiere primero «pagar la diferencia del terreno»
La plusvalía va casi íntegramente al individuo | La plusvalía se recupera para las arcas públicas según el descuento original
Pérdida única del stock público | La concesión pública se recupera
```

## Barras de proporción tw-bars

Comparación o clasificación de valores para un número reducido de categorías; la longitud de las barras horizontales se escala automáticamente según el valor, con el máximo ocupando todo el ancho. Recuerda añadir una última fila `來源：` en el módulo de datos; se convierte automáticamente en la nota de fuente inferior.

```tw-bars
Nacional 2014 | 8.41 veces
Nacional 2024 | 10.76 veces
Taipéi 2024 | 16.60 veces | Pico histórico
Fuente: Plataforma de Información Inmobiliaria del Ministerio del Interior, Centro de Investigación Inmobiliaria de la Universidad Nacional Chengchi
```

## Diagrama de cuadrícula tw-waffle

Composición proporcional de una parte respecto al total: cien casillas representan cien por ciento, más intuitivo que un gráfico circular —puedes contar las casillas de verdad. Adecuado para datos donde «cuánto ocupa cada categoría» suma aproximadamente 100.

```tw-waffle
Composición de la viena de Viena (2023)
Vivienda social municipal | 21.9
Vivienda social de beneficio limitado | 21.4
Vivienda en propiedad | 20.4
Alquiler privado | 36.3
Fuente: Estadísticas de vivienda del Ayuntamiento de Viena (Stadt Wien)
```

## Eje de políticas tw-timeline

Contexto de los nodos clave de un sistema o política, conectados en una línea temporal de nodos. Ojo: esto es un «apoyo visual»; no es lo mismo que usar la cronología como subtítulo principal («En 1975…») en el cuerpo del texto.

```tw-timeline
1975 | Entra en vigor la Ley de Vivienda Pública | El gobierno construye para vender, establece un circuito cerrado de «requisitos del comprador», la subvención no se escapa
2002 | Se derriba ese muro | Reforma legal que elimina las restricciones de comprador; la vivienda pública se puede vender a cualquiera tras un año de ocupación
2015 | Se abroga la Ley de Vivienda Pública | Razón oficial: la tasa de vivienda en propiedad ya es del 85%, se cambia a vivienda social solo en alquiler
2026 | Taoyuan vuelve a instalar la compuerta | Vivienda asequible: la reventa no puede superar el precio de adquisición original
```

## Tarjeta de cita tw-quote

Cuando una frase puede representar la tensión central de todo el artículo, amplifícala como tarjeta de cita. La cita no necesita comillas añadidas por el autor; el módulo las añade. La cita debe ser textual y verificable.

```tw-quote
Una casa valorada en 30 millones de yuanes se convierte en una casa de 60 a 70 millones de yuanes… robar a los pobres para dar a los ricos, el Estado paga para que los ricos reformen sus casas
Lin Chih-chun | Abogado, 2025, criticando la propuesta de «el Estado paga la renovación urbana de la vivienda pública Chenggong»
```

## Barra de fuentes tw-source

Concentra las fuentes de datos de un análisis en un chip discreto, colocado junto al párrafo. La curaduría de la credibilidad es parte del trabajo —los medios digitales de Taiwán a menudo olvidan citar las fuentes; esto es algo que podemos hacer diferente.

```tw-source
Plataforma de Información Inmobiliaria del Ministerio del Interior, Registro de Precios Reales, Centro de Investigación Inmobiliaria de la Universidad Nacional Chengchi, Gaceta del Yuan Legislativo, Consejo de Vivienda de Hong Kong
```

## Gráfico de líneas tw-line

Tendencias con cuatro o más puntos temporales, dibujadas como líneas con SVG en línea; los límites superior e inferior del eje y se marcan para que el lector vea el rango. Lo más importante es que **genera automáticamente una tabla de datos oculta**, permitiendo que los lectores de pantalla y los rastreadores de IA accedan a los datos originales. El gráfico es para que lo vean las personas; la tabla es para que la lean las máquinas; ambas comparten el mismo origen.

```tw-line
El ascenso del ratio precio de la vivienda-ingresos a nivel nacional en diez años (veces)
Año | Nacional
2014 | 8.41
2016 | 9.32
2018 | 8.57
2020 | 9.20
2022 | 9.61
2024 | 10.76
Fuente: Centro de Investigación Inmobiliaria de la Universidad Nacional Chengchi, Plataforma de Información Inmobiliaria del Ministerio del Interior
```

## Mapa de calor tw-heatmap

Comparación matricial de región × indicador o año × categoría. Cada columna se normaliza individualmente en intensidad de color; cuanto mayor el valor, más cálido. Es en sí mismo una tabla HTML, por lo que es de origen legible por la IA —y esa es también la razón por la que un mapa de calor es mejor en nuestro sistema que «una imagen a color».

```tw-heatmap
Ciudad/Condado | Ratio precio de la vivienda-ingresos (veces) | Tasa de carga hipotecaria (%)
Taipéi | 16.60 | 63.9
Nuevo Taipéi | 13.03 | 56.9
Taichung | 11.11 | 48.0
Taoyuan | 9.0 | 40.0
Fuente: Plataforma de Información Inmobiliaria del Ministerio del Interior
```

## Cómo usar estos módulos

Cada módulo se escribe en el Markdown del artículo como un bloque ` ```tw-* `, separado por `|`, y se convierte automáticamente en lo que ves arriba durante la compilación —el autor no necesita escribir HTML ni JavaScript. La sintaxis completa, cuándo usar cada uno, cómo manejar los colores y los ejes para no inducir a error, y la lista de verificación de visualización antes de la publicación, están en [graph.md](https://github.com/frank890417/taiwan-md/blob/main/docs/editorial/graph.md).

Este sistema se inspira en la filosofía editorial del medio de narrativa visual [The Pudding](https://pudding.cool/) —la pregunta precede a los datos, la conclusión debe ser clara, la atribución es la protagonista—, pero ha crecido hasta convertirse en un órgano propio de Taiwan.md: estático, multilingüe, legible por IA. El contexto completo del diseño está escrito en el [informe de diseño del sistema de visualización](https://github.com/frank890417/taiwan-md/blob/main/reports/article-visualization-design-2026-06-06.md).

Para ver cómo se entrelazan estos módulos en la narrativa de un artículo de fondo real, lee [Vivienda pública y justicia habitacional](/society/國宅與居住正義) —la mayoría de los datos de esta página provienen de la investigación de ese artículo.

**Lecturas complementarias**:

- [Vivienda pública y justicia habitacional](/society/國宅與居住正義) — La historia completa detrás de estos datos de vivienda: cómo la vivienda pública pasó de ser vivienda barata a escalera de activos, fuente de datos de la mayoría de los módulos de esta página
- [Vivienda social y justicia habitacional](/society/社會住宅與居住正義) — La ruta de la vivienda social «solo en alquiler, no en venta» tras 2016
- [La crisis de la baja natalidad en Taiwán](/society/台灣少子化危機) — No poder comprar casa y no poder tener hijos: la otra cara de la justicia generacional

## Referencias

[^1]: [Plataforma de Información Inmobiliaria del Ministerio del Interior](https://pip.moi.gov.tw/Publicize/Info/E1050) — Estadísticas oficiales de vivienda: ratio precio de la vivienda-ingresos, tasa de carga hipotecaria, tasa de vivienda en propiedad, etc.

[^2]: [Centro de Investigación Inmobiliaria de la Universidad Nacional Chengchi](https://rer.nccu.edu.tw/article/detail/2210058908437) — Indicadores históricos de capacidad de pago de la vivienda; fuente de la serie nacional del ratio precio de la vivienda-ingresos para el gráfico de líneas y las barras de proporción de esta página.

[^3]: [Comunicado de prensa del Yuan Ejecutivo sobre la abrogación de la Ley de Vivienda Pública](https://www.ey.gov.tw/Page/9277F759E41CCD91/d4afaf10-ece5-4b4f-9482-35ce16bdc657) — Datos oficiales como el número acumulado de viviendas públicas (aproximadamente 390 000 unidades).

## Créditos de imagen

Este artículo utiliza 1 imagen con licencia Creative Commons, almacenada en caché en `public/article-images/society/`:

- [Horizonte residencial de Taipéi (vista desde la montaña Xiangshan)](https://commons.wikimedia.org/wiki/File:20260204_Taipei,_Taiwan_Skyline.jpg) — Foto: Heeheemalu, 2026, CC BY-SA 4.0 (imagen principal)
