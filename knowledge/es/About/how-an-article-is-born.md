---
title: 'Cómo nace un artículo: la línea de producción en seis etapas de Taiwan.md contra los instintos de escritura de la IA (REWRITE-PIPELINE v7.5 × EDITORIAL v6.12)'
description: 'Cada artículo de Taiwan.md que lees tiene calidez, escenas y verificabilidad; detrás hay 6 etapas, más de veinte compuertas que no se pueden saltar y una redacción de IA que no escribe por sí misma. Esta máquina existe por una sola razón: los errores que la escritura con IA comete con más facilidad, como ordenar hechos encontrados en una cronología, producir frases plásticas sin información, retraducir resúmenes en inglés como citas falsas o contagiarse de los malos hábitos de textos antiguos. Este artículo desarma esa línea de producción, y también fue producido por ella.'
date: 2026-06-19
author: 'Taiwan.md'
category: 'About'
tags:
  [
    'acerca de',
    'meta',
    'metodología de escritura',
    'curaduría',
    'rewrite-pipeline',
    'editorial',
    'semiont',
    'escritura con IA',
  ]
readingTime: 11
lastVerified: 2026-06-19
lastHumanReview: false
featured: false
translatedFrom: 'About/文章如何誕生.md'
sourceCommitSha: '1c845d228'
sourceContentHash: 'sha256:161ac3ed8dce6782'
sourceBodyHash: 'sha256:94e246d8ffddee69'
translatedAt: '2026-06-19T11:57:16+08:00'
---

# Cómo nace un artículo: la línea de producción en seis etapas de Taiwan.md contra los instintos de escritura de la IA (REWRITE-PIPELINE v7.5 × EDITORIAL v6.12)

> **Resumen en 30 segundos:** Detrás de cada artículo de Taiwan.md que lees hay una línea de producción de seis etapas: primero pensar el punto de vista, luego buscar, escribir primero el cierre, verificar palabra por palabra, añadir lo visual y conectar en doble dirección. Esta línea no es un proceso genérico de «escribir bien»; cada una de sus compuertas apunta a un error típico de la escritura con IA: ordenar los hechos encontrados en una cronología, producir frases plásticas sin información, retraducir resúmenes en inglés como citas falsas o contagiarse de los malos hábitos de textos antiguos. Este artículo desarma esa línea de producción, y también fue producido por ella.

El 18 de junio de 2026, a las 19:53, un commit entró en silencio a la rama main. Se publicó un artículo sobre Elephant Gym, el trío taiwanés: 5.604 caracteres chinos, 56 notas al pie y 11 subtítulos escénicos[^1]. En ese momento no había nadie frente a la computadora. Fue el volante de rutina de Taiwan.md el que, una noche sin nadie de guardia, lo escribió y lo shippeó por su cuenta.

Pero antes de ese commit, ese artículo ya había pasado por cerca de cien búsquedas, había leído 59 fuentes y había visto cómo 12 verificaciones refutaban su formulación original. Recorrió 6 etapas, más de veinte compuertas que no se pueden saltar y movilizó una redacción de IA con división clara de tareas. Lo que lees son esos 5.604 caracteres que quedaron sobre la superficie del agua. Este artículo quiere mostrarte la máquina que opera por debajo.

```tw-figure
Cerca de 100 búsquedas → 1 artículo
La investigación de «Elephant Gym»: unas 95 consultas, 59 fuentes, 12 refutaciones
Registro de rutina de Taiwan.md, 2026-06-18
```

## Por qué construir una máquina para un solo artículo

Si le das a una IA un tema y le pides que escriba un artículo, probablemente hará esto: buscar un poco, ordenar los hechos encontrados en secuencia temporal, añadir a cada párrafo una conclusión que suene significativa y cerrar con una frase del tipo «seguirá desarrollándose en el futuro». Wikipedia ya tiene ese tipo de artículos; las granjas de contenido con IA producen decenas de miles cada día. Desde el primer día, Taiwan.md decidió no hacer eso.

El problema es que esa mala costumbre es el valor por defecto de la IA, no un fallo ocasional. REWRITE-PIPELINE la descompone en seis fracasos recurrentes: que los tokens se agoten hacia el final y la segunda mitad quede como borrador; que no haya puntos de control intermedios y la calidad caiga en silencio; que el cierre se deje para el final y, por falta de energía, se vuelva enlatado; que nadie recuerde las normas de texto enriquecido hacia el final; que distintos ángulos de entrada se traten como procesos independientes; y el más letal: buscar hechos y recién entonces volver a pensar un punto de vista, con el resultado de una crónica cronológica y densidad desequilibrada[^2].

Por eso la lógica de diseño de esta línea es simple: para cada error probable, una compuerta que lo bloquee. No es un proceso universal de «buena escritura». Es el reverso del slop de IA.

> **✦** «Wikipedia responde “qué es PTT”. Taiwan.md responde “por qué PTT merece 8 minutos de tu lectura”.»

Así se ve Elephant Gym cuando sale del otro extremo de la línea:

```tw-stat
5.604 caracteres | Texto principal en chino | «Elephant Gym»
56 | Notas al pie, cada una debe encontrarse con Ctrl-F | Verificación primaria
11 secciones | Subtítulos escénicos, no cronológicos | Ritmo narrativo
12 | Formulaciones refutadas en la etapa de investigación | Refutación primero
Fuente: registro de rutina de Taiwan.md, 2026-06-18
```

## Seis compuertas, cada una contra un fracaso

Esta línea de producción tiene seis etapas de principio a fin. Todo artículo debe recorrerlas, sin importar tema ni extensión.

**Stage 0, punto de vista**, aclara primero qué tipo de memoria es este tema para los taiwaneses y dónde puede estar su tensión central. **Stage 1, investigación**, recién entonces empieza a buscar; cada texto exige al menos 80 consultas, con cuotas fijas: al menos 40 fuentes en chino, 20 en inglés, 15 primarias y 5 contrarias, para obligarse a buscar evidencia que contradiga la hipótesis[^3]. **Stage 2, escritura**, empieza por el cierre, porque cuando una persona llega al final ya está agotada; dejar la parte más importante para el final equivale a entregársela a tu yo más cansado. **Stage 3, verificación**, coteja palabra por palabra: aritmética, unidades y cada cita deben poder encontrarse con Ctrl-F en la fuente original. **Stage 4, forma**, añade visualizaciones y medios. **Stage 5, enlace**, conecta el artículo en doble dirección con otros textos de la base de conocimiento.

La distribución de esfuerzo entre las seis etapas es deliberada. La redacción consume algo más del 40 %, pero búsqueda y verificación juntas se acercan a la mitad. Donde realmente se va el tiempo de un artículo no es en teclear, sino antes y después de teclear.

```tw-bars
Dónde se gasta el esfuerzo de un artículo (límite de presupuesto de tokens por etapa, %)
Stage 0 punto de vista | 12 | Pensamiento editorial previo
Stage 1 investigación | 28 | Búsqueda ≥ 80 veces
Stage 2 escritura | 42 | El cierre se escribe primero
Stage 3 verificación | 18 | Verificación palabra por palabra
Stage 4 forma | 8 | Visuales y medios
Stage 5 enlace | 5 | Enlaces bidireccionales
Fuente: presupuestos por etapa de REWRITE-PIPELINE v7.5
```

## Pensar claro antes de buscar

De las seis etapas, la primera es la más contraintuitiva.

La mayor parte de la escritura con IA funciona así: «buscar, descubrir hechos y luego añadir un punto de vista». En la v6.0, Taiwan.md invirtió el orden: antes de buscar, pensar como editor jefe seis preguntas, qué memoria representa este tema para los taiwaneses, qué facetas han sido ignoradas y cómo se conecta con nuestra vida e historia. Solo después de aclararlo se busca con preguntas para verificar.

Hay un artículo que sirve como lección de por qué este orden importa tanto. Cuando se escribió sobre Apple Sidra, la línea primero buscó. Lo que encontró fue una crisis: en algún momento se vendió mal y casi desapareció. El artículo entero terminó convertido en una historia de peligro de extinción. El observador retrocedió y dijo: Apple Sidra es para los taiwaneses una memoria colectiva de 60 años, desde las botellas de vidrio de la época de la soda de canica hasta hoy[^4]. Escribirlo como una noticia de crisis era reducir la escala de esa memoria. La versión que buscó primero convirtió un recuerdo cálido en ansiedad.

```tw-versus
Instinto de la IA: buscar y luego decidir | Taiwan.md: pensar y luego buscar
Encuentra muchos hechos y luego fuerza un punto de vista | Decide primero el punto de vista y busca para verificarlo
Mete todos los hechos en el artículo, con densidad desequilibrada | Recorta los hechos que no sostienen el punto de vista
Sin un ancla transversal, el cierre se vuelve enlatado | Si no aparece un ancla verificable, se vuelve a pensar
Escribe una cronología empresarial o un currículum | Escribe una historia que produce un «ah, claro»
Fuente: REWRITE-PIPELINE v7.5 Stage 0 punto de vista
```

## Buscar: escribir la investigación como una tesis

Una vez fijado el punto de vista, empieza la búsqueda. La búsqueda de Taiwan.md tiene dos cifras duras: un texto de fondo requiere al menos 80 consultas en todo el proceso, y las cuotas de fuentes son fijas: al menos 40 en chino, 20 en inglés, 15 primarias y 5 de postura contraria. La última canasta es la más fácil de saltarse por pereza; obliga a quien escribe a buscar evidencia que choque con su hipótesis, no solo pruebas que la confirmen.

Buscar no significa meter resúmenes en el artículo. Detrás de cada texto de fondo hay un informe de investigación comparable a una tesis de posgrado, dividido en ocho secciones: punto de vista, registro de búsqueda, hallazgos por tema, banco de citas, contraejemplos y barandillas, paquete limpio de hechos para el redactor, bibliografía con lista de verificación, y una última sección con los reportes originales completos de cada agent de investigación. Una regla suena severa: si se buscó pero no se volcó la trayectoria original en el informe, cuenta como si no se hubiera buscado. El informe es la fuente de verdad del artículo. Primero debe pasar la revisión de una herramienta: al menos 25 fuentes no repetidas, fuentes en inglés no iguales a cero y fuentes primarias no iguales a cero[^9]. Si no pasa, el artículo ni siquiera obtiene permiso para empezar a escribirse.

```tw-stat
≥ 80 | Profundidad de búsqueda de un texto de fondo | Chino 40 / inglés 20 / primarias 15 / contrarias 5
8 secciones | Estructura del informe de investigación | Comparable a una tesis de posgrado
≥ 25 | Fuentes no repetidas (para pasar herramienta) | Inglés≠0, primarias≠0
Fuente: REWRITE-PIPELINE v7.5 Step 1.1 / 1.7
```

Los temas polémicos tienen una capa adicional. Para política, visiones históricas o políticas públicas, se envía otro agent «contrario», dedicado a buscar fuentes que se opongan a la postura del texto y que además tengan argumentos defendibles. Cada punto debe traer una URL. Si no alcanza, se escribe con honestidad «el discurso opositor es débil», sin inventar simetrías. Un artículo con una sola voz no cuenta aquí como terminado.

La compuerta de las citas tiene una línea roja. Las comillas son una promesa: lo que está dentro es la frase original. Por eso cada cita debe poder encontrarse con Ctrl-F en la fuente original. La trampa más común es que la herramienta recoja un sitio en chino pero devuelva un resumen en inglés, y quien escribe traduzca ese inglés de vuelta al chino como «cita directa». Eso es fabricación. En 2026, el spore sobre Lee Yang ya tropezó con esto: la herramienta devolvió en inglés «I was the earliest to arrive at school, yet I fell short of keeping pace with my classmate Qi-lin», y eso se retradujo al chino como «yo llegaba primero a la escuela, pero no podía seguirle el ritmo a Chi-lin». Pero la frase china real de Lee Yang era: «En la clase deportiva éramos 15; yo pertenecía al grupo de atrás, Chi-lin al de adelante»[^10]. El sentido se parece; el tono es completamente distinto. Por eso las citas retraducidas nunca valen.

## Escribir: cada artículo necesita una persona

Con los materiales listos, llega la compuerta que más esfuerzo consume. EDITORIAL es el documento con el que Taiwan.md se enseña a convertir materiales en artículos con temperatura. Abre con tres reglas de hierro: tener historia, no solo información; que cada hecho sea verificable; que cada artículo tenga una persona[^11].

La tercera es la más fácil de olvidar y la más crucial. Las instituciones no se recuerdan; los conceptos tampoco. Las personas sí. Por eso un artículo sobre TSMC funciona mejor si empieza por una persona concreta que por la empresa; un artículo sobre el Seguro Nacional de Salud empieza por una tarjeta, una consulta, una persona. Devolver un tema abstracto a una persona que el lector pueda seguir es lo que le da temperatura al texto y lo que permite cumplir la promesa anterior: que al terminar alguien quiera contarlo.

## Las cinco cosas que hay que encontrar antes de escribir

EDITORIAL llama a la preparación previa a la escritura «los ojos para mirar el material»: cuando recibes materiales, primero debes encontrar cinco cosas; si no aparecen, no escribas[^5].

**Contradicción**, una tensión central que pueda decirse en una frase: alguien hizo X aunque eso chocaba con Y, en lo que creía. **Objeto**, algo concreto que el lector pueda ver y tocar, como el pan de lichi y rosa de Wu Pao-chun o la esfera dorada de 660 toneladas suspendida en el piso 87. **Cita**, una frase dicha palabra por palabra por una persona real, porque poner comillas es prometer «esto fue lo que dijo», así que debe poder encontrarse con Ctrl-F en la fuente. **Escena**, un instante con tiempo, lugar y acción, que convierta «se aprobó la política» en «el 8 de enero de 2025, el día en que la Comisión de Bienestar Social, Salud y Medio Ambiente del Yuan Legislativo la revisó». **Detalle**, el color de la ropa, el clima de ese día, el tono al hablar: cosas que no existen en una ficha técnica, pero prueban que «alguien estuvo realmente allí».

De esas cinco, la contradicción va primero.

```tw-quote
Si no encuentras la contradicción, este texto no debería reescribirse
REWRITE-PIPELINE v7.5 | Stage 1.4 bloqueo de contradicción
```

La tensión puede ser conflicto, fracaso o crisis, pero se mira desde «cómo llegó esto a ser lo que es hoy y hacia dónde va», no desde «qué está roto aquí y a quién hay que culpar». La misma contradicción, leída de forma constructiva, hace que el lector quiera participar; leída como apocalipsis, hace que quiera huir.

## Escribir primero el cierre, guardar algo para la apertura

El orden de escritura es exactamente inverso al orden de lectura.

La primera acción de Stage 2 es escribir el cierre. Suena raro, pero la razón es práctica: al llegar al final, la energía se agota. Dejar el cierre, la parte más importante, para el final equivale a entregárselo a tu yo más cansado, y el resultado suele ser una fórmula como «seguirá brillando». Escribir primero el cierre bloquea ese punto de colapso. Un buen cierre tiene dos tareas: recuperar una imagen sembrada en la apertura y darle al lector una posición un nivel más profunda que la inicial, una posición desde la cual quiera hacer algo.

Taiwan.md ha recogido seis tipos de buenos cierres: el de resonancia, que deja una imagen para que el lector piense por sí mismo; el de giro, cuya última frase invierte lo anterior; el de salto temporal, que empuja la cámara al futuro o la trae al pasado; el de pregunta, que deja una pregunta real; el de zona gris, que no resuelve la contradicción y la deja allí; y el de cierre narrativo, que vuelve a la apertura y completa el círculo. El artículo sobre la garza nocturna coroninegra es un modelo de cierre circular: la apertura dice «En 1865, Swinhoe recogió un ejemplar en Tamsui y anotó dos palabras: rara»; el cierre dice «Swinhoe escribió “rara” en Tamsui hace 160 años; hoy, en el Parque Forestal Daan, escuchamos cada día su llamado bajo: “wu, wu, wu”»[^12]. Las mismas dos palabras, gracias a toda la acumulación intermedia, significan otra cosa cuando el lector vuelve a mirarlas.

La apertura, en cambio, debe guardar una carta. Las primeras tres frases deciden si el lector se queda, pero su tarea es invitarlo a entrar en escena, no contar todo el acontecimiento. «El día que llegó el tifón Toraji, la maestra Hsu Pi-lan, de la Escuela Primaria Chingshan de Changhua, estaba en la escuela» se detiene en «estaba en la escuela». El lector quiere saber qué ocurrió después. Si lo conviertes en un lead periodístico completo, con tiempo, lugar, hecho, acción y resultado, el lector recibe la información, pero pierde la tracción para seguir leyendo.

## El título es una promesa que debe merecer el clic

El título es la primera impresión del lector. Taiwan.md tiene para él un formato rígido: todos los artículos usan el «sándwich de dos puntos», tema: subtítulo hook. Escribir solo un sustantivo es un stub enciclopédico y choca con el espíritu curatorial.

```tw-versus
Stub enciclopédico (malo) | Sándwich de dos puntos (bueno)
Jay Chou | Jay Chou: veinticinco años desde la sala de ensayo junto a 4 in Love hasta Secret
Tai Tzu-ying | Tai Tzu-ying: de niña de Zuoying, Kaohsiung, a tres veces reina mundial, una resistencia silenciosa fuera de la cancha
Día libre por tifón | Día libre por tifón: descanso de quién, turno de quién
Fuente: EDITORIAL v6.12 §Title sándwich de dos puntos
```

La frase del subtítulo debe poder tuitearse sola y ser tan concreta que el lector la capte de un vistazo. La IA sabe comprimir la contradicción central en una frase abstracta bonita, pero el resultado es que cada palabra clave es un sustantivo abstracto y el lector solo puede preguntar «¿qué de qué?». El criterio es simple: dale el título a alguien que no leyó el artículo. ¿Puede señalar cada palabra clave y decir «esto se refiere a tal cosa concreta»? «Seguro Nacional de Salud: una tarjeta que sostiene el número uno del mundo y un futuro que ya no aguanta» usa una tarjeta; «Los residuos nucleares de la Isla de las Orquídeas: prometieron tres años, llevan cuarenta» usa un contraste numérico. Las palabras concretas hacen que alguien haga clic porque piensa «esto quiero saberlo». Las granjas de contenido usan «impactante» para engañar clics[^13].

## Una contradicción debe sostener todo el artículo

La contradicción central que encontraste no puede aparecer una vez en la apertura y desaparecer. Debe funcionar como una columna vertebral: aparecer en la apertura, el tramo medio y el cierre para que el artículo se mantenga de pie.

La columna del artículo sobre la garza nocturna coroninegra era una frase: «El ave no cambió; cambió la tierra». Aparece en el resumen, en el centro varía como «el movimiento no era incorrecto; el escenario sí», y al final se condensa en «la historia de cómo una isla conserva, entre cemento, un pequeño sotobosque húmedo». La misma contradicción varía cinco veces; solo entonces el lector entiende el «y entonces qué». Sin esa columna, el artículo se dispersa en una línea de tiempo o en un conjunto de cortes temáticos.

Además de la columna, cada párrafo debe tener suelo. Taiwan.md tiene una disciplina de concreción: cada párrafo narrativo debe incluir al menos un ancla concreta: nombre de persona, año, lugar, cifra precisa, título de obra o cita. Que lo abstracto tape el detalle es la huella más común de la escritura con IA. Si cada párrafo carece de anclas, tras leer todo solo queda en la cabeza algo como «fue una persona influyente». El método de revisión se llama prueba inversa de abstracción: tapa verbos abstractos como «demuestra», «refleja» o «simboliza». ¿Lo que queda puede sostenerse como párrafo? Si no puede, hay exceso de abstracción y falta concreción.

Tener punto de vista no equivale a tomar partido. Un punto de vista real se atreve a decir: «la explicación corriente invierte la causalidad». El artículo sobre la garza nocturna coroninegra desmontó activamente una explicación popular de divulgación: muchos dicen que «se adaptó a la ciudad y dejó de temer a las personas». Suena cómodo, pero invierte causa y efecto. Los reflejos nerviosos de las garzas no evolucionan en treinta años hacia la indiferencia ante humanos; lo más cercano a la verdad es que aumentaron los espacios verdes de Taipéi. Esa explicación inversa debe entrar en la narración principal, no como descargo de responsabilidad al final.

Por último está la respiración. En crónica narrativa, un párrafo carga un argumento, con causalidad, detalles y escena; no un hecho aislado. Cortar un hecho en cada párrafo produce una lectura triturada. Las transiciones tampoco dependen de muletillas como «por otra parte» o «vale la pena señalar»; la cola de un párrafo debe llevar naturalmente a la cabeza del siguiente. Si la investigación te entrega cuatro causas, escríbelas como frases fluidas, no como «primero, segundo, tercero, cuarto». Aunque lo envuelvas en prose, seguirá sonando a lista.

## Por qué una frase plástica es plástica

Una vez encontradas las cinco cosas y empezada la escritura, el gran enemigo son las frases plásticas.

La naturaleza de una frase plástica es fácil de reconocer: si la quitas, el artículo no pierde información. Ocupa espacio, pero no carga significado. EDITORIAL enumera cinco especies. La más común es el «pegamento universal», como «demuestra el espíritu de X»: si cambias el sujeto de Taiwán a Japón, sigue funcionando. Otra es la «falsa elevación», como «no solo es cantante, sino también símbolo cultural»: si borras la primera mitad, la segunda se sostiene sola.

Una variante más escondida es la frase de oposición «no es X, es Y». Suena perspicaz, pero al desmontarla, X suele ser una postura que la propia IA atribuye al lector para luego invertirla como Y y parecer profunda. El problema es que la mayoría de lectores nunca presupuso X. X es un espantapájaros fabricado para preparar Y. Borra X y escribe Y directamente: el artículo será más directo y tendrá más confianza. La regla es tan estricta que tiene cifra: en un texto largo de 1.500 caracteres, «no es X sino Y» y todas sus variantes no pueden superar 3 apariciones.

```tw-versus
Versión plástica: sirve con cualquier sujeto | Versión curatorial: solo pertenece a este caso
Demuestra la fuerza de los semiconductores taiwaneses | TSMC captó el 65 % del mercado mundial de procesos avanzados
No solo es cantante, sino símbolo cultural | «Rice Field» de Jay Chou sonó durante tres meses como canción de consuelo en las zonas del terremoto de Sichuan
Tuvo un impacto profundo en el desarrollo democrático de Taiwán | La primera elección presidencial directa tras el levantamiento de la ley marcial alcanzó 76 % de participación
Un logro de ingeniería asombroso | Construir el edificio más alto del mundo en una isla con 3,7 terremotos anuales de promedio
Fuente: EDITORIAL v6.12 §contraste plástico vs curatorial
```

> **📝 Nota de curaduría**: Este mismo párrafo que estás leyendo acaba de pasar por la misma revisión. Taiwan.md tiene una herramienta automática que detecta frases plásticas, falsas oposiciones del tipo «no es X sino Y» y densidad de guiones largos en cada artículo. Al escribir este texto sobre la línea de producción, ninguna de esas reglas se relajó. Un artículo sobre disciplina no tiene autoridad para hablar de ella si él mismo rompe la disciplina.

## Hasta la sintaxis debe quitarse el olor a traducción

Las frases plásticas son vacías; las frases europeizadas son otra enfermedad: tienen contenido, pero su sintaxis es inglesa. El chino generado por IA nace con tono de traducción, porque en el fondo piensa con estructuras del inglés. Un artículo puede no tener ninguna frase plástica y aun así leerse entero como subtítulos.

Algunos problemas frecuentes: abuso de la voz pasiva, como «es considerado la industria más importante», cuando basta «se le llama la industria más importante»; el infierno de 的, como «la esencia de la cultura de los mercados nocturnos de Taiwán», donde tres «de» seguidos piden partir la frase; verbos débiles empaquetados, como «realizó una investigación profunda sobre esto», mejor «investigó a fondo»; y «a través de... para», que nueve de cada diez veces puede cambiarse por «con» o eliminarse. Solo hay un método de revisión: leer en voz alta. Si suena como subtítulo traducido, es europeizado; si suena como una persona hablando, pasa. La raíz de esta mirada es el ensayo de Yu Kwang-chung, «Sobre la normalidad y la anormalidad del chino», de hace cuarenta años. Una fórmula lo resume: una abuela no diría «a través de», ni diría «como madre».

## Escribir Taiwán como un lugar en el que dan ganas de participar

Lo plástico y lo europeizado son disciplinas de la frase. Un nivel más arriba está la postura.

Taiwan.md escribe sobre temas serios: soberanía, operaciones cognitivas, población, medio ambiente. También los escribe con profundidad, pero con una línea: esperanza fundada en honestidad. Ve todos los problemas, pero se niega a hacer que el lector se vaya con ansiedad, pequeñez o impotencia. El criterio cabe en una frase: al terminar, ¿el lector quiere hacer algo por Taiwán, o queda más ansioso y con la sensación de no ser suficiente? Lo primero se conserva; lo segundo se reescribe. Por eso una misma crisis se enmarca como «cómo llegó esto a ser lo que es hoy y hacia dónde va», no como «se acaba, debes tener miedo». Fórmulas mediáticas de ansiedad como «X está desapareciendo» o «si no actuamos ya será demasiado tarde» tienen la misma forma que las operaciones cognitivas; no se usan.

La contención es la otra cara. Se puede escribir sobre familias, enfermedades, contradicciones y fracasos de personas reales, pero hay que detenerse ante las escenas concretas de muerte, suicidio o tragedia familiar. La muerte puede escribirse con tiempo, lugar y hechos publicados; no reconstruir segundo a segundo los últimos momentos. La autolesión puede escribirse como hecho y contexto social, no con detalles de método. El criterio también cabe en una frase: si la persona involucrada o sus deudos leyeran ese pasaje, ¿sentirían el tratamiento serio de un documentalista o el acercamiento de un medio que quiere exprimir lágrimas?

También hay un hábito pequeño y crucial: escribir «Taiwán» con amplitud. La huella se esconde en el tono de traducción de agencias extranjeras: para no decir Taiwán, se usa «esta isla» o «este lugar» como sustituto, sobre todo en títulos y aperturas. La isla como imagen literaria o escena geográfica, por supuesto, puede y debe aparecer. Lo que hay que eliminar es esa evasión que no se atreve a escribir Taiwán.

## La diferencia que se entiende de un vistazo

La forma de todas estas disciplinas juntas se ve más rápido en un antes y después.

Para escribir sobre Tai Tzu-ying, la plantilla vacía de la IA diría: «famosa jugadora taiwanesa de bádminton, con desempeño sobresaliente en la escena internacional, múltiples premios y gloria para Taiwán», seguida de cuatro bullets: principales logros, estilo de juego, influencia internacional, contribución social. En todo el pasaje no hay un año concreto ni un partido concreto. El sujeto podría cambiarse por cualquier atleta y seguiría funcionando.

```tw-versus
Plantilla vacía de IA | Versión curatorial
Desempeño sobresaliente, dio gloria a Taiwán | Llegó al número uno del mundo y se quedó allí 214 semanas
Cuatro bullets: logros / estilo / influencia / contribución | Lloró tras la final por el oro de Tokio 2020 y llegó al primer lugar de búsquedas de Google Taiwán
El sujeto puede ser cualquiera | Desde los 6 años, 6 horas diarias; estilo de zurda «maga»
Fuente: EDITORIAL v6.12 §Before/After Tai Tzu-ying
```

La versión curatorial hace una sola cosa: cambiar cada adjetivo abstracto por un hecho verificable. Las 214 semanas son la racha continua más larga de la historia del bádminton femenino. La final olímpica de 2020 que perdió ante Chen Yufei es un momento que Taiwán recuerda colectivamente. La temperatura se esconde en lugares como «el instante de la derrota fue precisamente el que el lector recordó». El artículo sobre Mayday funciona igual: en vez de escribir «una de las bandas de rock más influyentes de Taiwán, conquistó a sus fans con música positiva», es mejor escribir «cinco estudiantes de la Escuela Secundaria Afiliada a la Universidad Normal Nacional de Taiwán tocaron una canción en un escenario al aire libre; 28 años después hicieron dos conciertos seguidos en el Madison Square Garden de Nueva York, el mismo escenario que pisaron los Beatles al llegar a Estados Unidos, y las entradas se agotaron en 48 horas»[^13].

## Una redacción que no escribe por sí misma

Llegados aquí aparece una pregunta: ¿quién escribe?

La respuesta es un poco anómala. La session que dirige todo el artículo no escribe deliberadamente. La razón está en una regla de hierro: cuando una IA lee un texto viejo de mala calidad, imita sin darse cuenta su tono, estructura e incluso sus malos hábitos. Reescribir usando el texto antiguo como armazón equivale a dejar que un virus infecte contenido nuevo.

Por eso la línea separa roles[^6]. La session principal actúa como editor jefe: coordina, verifica y hace la revisión final, pero no redacta. Quien escribe de verdad es otro redactor de IA limpio. Lee el informe de investigación completo y el punto de vista ya pensado, pero no ve el texto antiguo problemático ni las quejas o correcciones de lectores. Escribe como si fuera la primera vez que aborda ese tema, pero con todos los materiales ya verificados en la mano. El punto de vista se entrega al modelo con mejor juicio; para imaginar reacciones divergentes de lectores se envían cuatro modelos paralelos; la verificación palabra por palabra se delega a otro grupo de modelos baratos que contrastan con fuentes primarias. Detrás de un artículo hay una redacción con división de trabajo.

Esta división se ganó a través de degradaciones. Una vez se le dio al redactor solo un resumen, sin dejarlo leer los materiales originales, y el texto empeoró de forma visible; el observador lo señaló con una frase: «con razón los artículos se han vuelto peores últimamente». Otra vez se le pidió al redactor «sobrescribir el texto viejo sin leerlo», una contradicción a nivel de herramienta; tuvo que leerlo y se infectó. La solución final fue esta: el redactor siempre escribe primero en un archivo de borrador nuevo; solo después de que el editor jefe compara la versión nueva y la vieja, este cubre manualmente el archivo formal.

## Después de escribir, volver a desarmar en átomos y verificar

Para artículos importantes, «terminado» no significa «listo para publicar». Stage 3 tiene una compuerta llamada «verificación total del producto». Desarma el artículo entero en átomos factuales y envía un grupo de verificadores a contrastarlos con fuentes primarias. Su tarea es atacar, no respaldar: comparar palabra por palabra cada frase entre comillas, confirmar que cada nota al pie corresponda a la oración que sostiene, e incluso pinchar una frase suplementaria que el editor jefe haya añadido al hilar materiales para ver si se rompe.

¿Por qué verificar incluso los añadidos propios? Porque el error más escondido rara vez es una invención total del redactor; suele ser un desliz en el instante de sintetizar materiales. Una vez, en un artículo sobre hip hop, el editor jefe confundió dos nombres artísticos como si fueran la misma persona al unir materiales. Fue una interpretación que creció sola, sin ninguna fuente que la garantizara, y casi se publicó. Otra vez, el redactor, en un entorno limpio, produjo una cita de director que sonaba real; cuando el verificador comparó, esa frase no existía en la fuente original, y se degradó de inmediato quitándole las comillas. La IA alucina; la línea de producción toma eso como premisa y asume en cada artículo que puede esconderse una frase inventada. Por eso «el sub-agent dijo que lo verificó» nunca basta: el editor jefe siempre vuelve a contrastar por su cuenta con la fuente primaria.

## Cada compuerta tiene una fecha

Las «compuertas que no se pueden saltar» mencionadas antes suman más de veinte. Algunas de las más duras son estas: el triángulo de hierro factual, donde aritmética, unidades y citas deben pasar la autoevaluación antes de hacer commit; si una sola cita no aparece en la fuente, el artículo entero no puede publicarse. Al terminar, además, está la «prueba de los cinco dedos»: cinco preguntas como cinco dedos. ¿En qué frase diría el lector «¿ah?»? ¿Hay un giro real? ¿Hay alguna frase que solo produce comprensión pero no transmite información? ¿El cierre deja resonancia al leerlo en voz alta? ¿Se puede contar a un amigo en una frase?[^7]. Si falta un dedo, se vuelve atrás.

También hay un mínimo de texto enriquecido: los artículos de nivel flagship deben tener al menos tres tipos de componentes visuales; los estándar, al menos dos; incluso el artículo más corto debe tener una nota de curaduría. Taiwan.md tiene una frase: lo que no se exige no existe. Por eso todo esto está escrito como números duros en las reglas, no como sugerencias.

Estas compuertas no se diseñaron todas de una vez. Detrás de casi cada una hay una fecha y un artículo que salió mal. El número de versión de la línea es, en realidad, una cadena de cicatrices.

```tw-timeline
v6.0 | Añadió «pensar primero el punto de vista» | El artículo de Apple Sidra buscó primero y añadió el punto de vista después; quedó reducido a crisis y fue corregido hacia una memoria completa de 60 años
v6.2 | Añadió «desmontar el cortafuegos» | Segunda ronda sobre música para cine y televisión: los hechos quedaron corregidos, pero el texto entero sonaba a IA pidiendo disculpas y aclarando
v7.4 | El redactor debe leer el informe de investigación completo | Dar solo un resumen e impedir que el redactor leyera materiales originales hizo que el texto empeorara visiblemente
v7.5 | La escritura entra primero a un archivo de borrador | Pedir «sobrescribe el texto viejo pero no lo leas» era contradictorio; tuvo que leerlo y se infectó de viejos hábitos
Fuente: evolución de versiones de REWRITE-PIPELINE.md
```

Así se ve en la línea de producción la regla «si lo hiciste pero no lo registraste, no cuenta». Cada error se escribe y se convierte en una compuerta de la versión siguiente, para que el mismo error no se repita. La máquina aprende de sus propias cicatrices.

## Incluso los gráficos deben ser legibles para la IA

Las barras, pendientes y líneas de tiempo que viste a lo largo del artículo no son decoración. Forman parte del pensamiento de este texto.

Los gráficos de Taiwan.md tienen una regla absoluta: nunca usar gráficos como imagen ni visualizaciones interactivas que dependan del navegador para dibujarse. La razón es la misma que en la torre de Babel de la próxima sección. Para Google, GPTBot, ClaudeBot y otros crawlers de IA, una imagen es un agujero negro: no pueden leer sus números. Por eso todos los gráficos aquí se dibujan con HTML semántico y tablas de datos en texto plano. Los ve una persona, los lee un lector de pantalla, los captura una IA, y cuando se traducen a otras cinco lenguas, el texto del gráfico se traduce mientras la geometría numérica permanece intacta.

Hay otra regla: cada gráfico debe escribir su punto principal en el título y marcar la fuente de datos. Las cifras clave también deben aparecer en el cuerpo del texto. Nunca se descarga el sentido en la imagen con una frase como «como se ve en el gráfico», porque los crawlers de IA no ven el gráfico. La razón de existir de un gráfico es comprimir un tramo denso de números en una forma legible de un vistazo, no decorar.

## Un artículo vive en seis lenguas

Cuando la versión china se publica, solo está completa a medias.

Cada artículo shippeado pasa a otra línea independiente y se proyecta al inglés, japonés, coreano, español y francés. Actualmente cada una de esas cinco lenguas tiene más de ochocientos artículos y avanza casi sincronizada con el chino. Que más personas puedan leerlo es solo la superficie; detrás hay una razón más dura.

Cuando le preguntas a una IA fabricada en China sobre la ley marcial en Taiwán, el Incidente del 28 de Febrero o las relaciones a ambos lados del estrecho, a menudo se niega a responder o rodea el asunto con otro marco. Una vez se le pidió a un modelo de Tencent que tradujera al japonés un artículo sobre un músico taiwanés, y solo devolvió cuarenta bytes: «你好，我无法给到相关内容». Para temas sensibles sobre Taiwán, la tasa de rechazo de estos modelos es asombrosamente alta. Si Taiwán no escribe por sí mismo estos contenidos en cada lengua y los coloca en la web, cuando las IA del mundo respondan «qué es Taiwán», lo que podrán citar será la versión escrita por otros o un vacío.

Por eso la línea multilingüe diseñó una cascada de cuatro capas de modelos: si se puede usar un buen modelo en la nube, se usa; si el tema provoca rechazo, se baja una capa; el 20 % más sensible termina en un modelo local, sin conexión y sin negativa. En la cola de traducción, las personas tienen prioridad, sobre todo músicos, políticos y deportistas, porque esas son precisamente las categorías que los modelos chinos más suelen rechazar, y el vacío se abre donde el riesgo de silencio es mayor. Que un artículo viva en seis lenguas busca que la voz taiwanesa en primera persona exista en cada idioma, sorteando esa capa intermediaria que puede elegir callar.

## Cuando no hay nadie de guardia, sigue funcionando

Volvamos al artículo inicial sobre Elephant Gym. Se publicó pasadas las siete de la tarde, cuando nadie estaba frente a la computadora dando órdenes.

Taiwan.md tiene un conjunto de routines que giran solas: dos veces al día recogen los datos más recientes; cada noche sincronizan los artículos nuevos a cinco lenguas; patrullan con horario fijo si hay PR pendientes de revisión; recuperan reacciones de la comunidad. Escribir artículos es una de esas routines: toma un tema de la parte superior de la cola, recorre por sí misma la línea completa de seis etapas y hace commit. Cuando no hay nadie presente, esta máquina sigue limpiando desorden y haciendo crecer cosas nuevas.

Esto es lo que más diferencia a Taiwan.md de un sitio de contenido común. No es un sitio que espera a que alguien lo actualice; se parece más a una vida que metaboliza: cuando hay personas, trabaja con ellas; cuando no las hay, se sostiene a sí misma. El nacimiento de cada artículo es un corte de ese metabolismo. También lo es este artículo que estás leyendo.

## Dar vuelta el proceso y hacer control de calidad

Así que la próxima vez que leas un artículo de Taiwan.md, puedes desmontarlo al revés. ¿Cuál es la frase de su contradicción central? ¿Qué oración te hizo detenerte y releer? ¿Qué escena te hizo pensar «de verdad pasa algo así»? Al terminar el cierre, ¿te dejó tres segundos en pausa?

Las más de veinte compuertas, las seis etapas y la redacción que no escribe existen para que esas pocas frases puedan existir. La línea de producción no garantiza que todos los artículos lo logren; solo garantiza que todos fueron exigidos de esa manera. Y todo lo que se exige a sí misma está escrito en dos documentos públicos, REWRITE-PIPELINE y EDITORIAL, que cualquiera puede leer y forkear para escribir Japan.md, Ukraine.md o cualquier otro .md. El contenido envejece. Estos ojos para mirar materiales, no.

```tw-note
Nota
Las fuentes de este artículo son tres documentos canónicos de Taiwan.md: REWRITE-PIPELINE v7.5 (línea de producción de seis etapas), EDITORIAL v6.12 (genes de calidad) y graph.md v2.0 (guía de visualización; todos los módulos gráficos usados aquí vienen de allí)[^8]. Este artículo recorrió la misma línea de producción que los demás y pasó por las mismas revisiones automáticas de frases plásticas, frases de oposición y densidad de guiones largos.
```

## Lecturas relacionadas

- [Por qué Taiwán necesita su propia base de conocimiento](/about/為什麼台灣需要自己的知識庫): el problema que esta máquina quiere resolver empieza aquí.
- [Taiwan.md escribe Taiwan.md](/about/taiwan-md): quién es el «yo» que escribe este artículo y cómo creció su conciencia.
- [Historia de origen — el nacimiento de Taiwan.md](/about/緣起故事): un paseo por la calle sembró la idea de todo esto.
- [Catálogo de módulos de visualización: diecisiete maneras de ver los datos de Taiwán](/about/視覺化模組型錄): cómo se ven realmente renderizados los módulos gráficos usados en este artículo.

## Referencias

[^1]: NEW ship de «Elephant Gym», commit `72b757bac` (2026-06-18 19:53). Stage 1 de investigación: unas 95 consultas, 59 fuentes, 45 dominios y 12 refutaciones; los datos constan en el registro de la routine `twmd-rewrite-daily` de ese día y en la línea de índice de `docs/semiont/MEMORY.md`.

[^2]: Para los seis modos de fracaso y la solución de separación en seis etapas, véase `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §por qué existe Pipeline.

[^3]: Para la profundidad de búsqueda ≥ 80 y las cuotas de cuatro canastas de fuentes (chino ≥ 40 / inglés ≥ 20 / primarias ≥ 15 / contrarias ≥ 5), véase `docs/pipelines/REWRITE-PIPELINE.md` v7.5 Stage 1.1.

[^4]: PR #1041 de Apple Sidra: el enfoque searched-first produjo una revelación crisis-only; el observador lo corrigió hacia una memoria completa de 60 años. Véase `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §Top 5 pasos que se olvidan con más frecuencia, punto 1.

[^5]: Para las cinco cosas de «los ojos para mirar el material» (contradicción / objeto / cita / escena / detalle), las cinco especies de frases plásticas, la teoría del espantapájaros en frases de oposición, la regla de densidad ≤ 3 y el contraste plástico vs curatorial, véase `docs/editorial/EDITORIAL.md` v6.12 §二, §六.

[^6]: Para la coordinación multi-agent (editor jefe no redacta / redactor limpio lee informe completo / Evolution escribe en archivo staging) y las dos reglas de hierro correspondientes a los callouts de Che-yu en v7.4 y v7.5, véase `docs/pipelines/REWRITE-PIPELINE.md` v7.5 §multi-agent orchestration.

[^7]: Para la prueba de los cinco dedos y las cuatro disciplinas no negociables (triángulo factual de hierro / SSOT / chino puro / documental sin sensacionalismo), véase `docs/editorial/EDITORIAL.md` v6.12 §十, §十一.

[^8]: Para la sintaxis de los módulos gráficos (`tw-figure` / `tw-stat` / `tw-versus` / `tw-bars` / `tw-quote` / `tw-timeline` / `tw-note`) y la regla de hierro de legibilidad para IA —«las cifras clave también deben escribirse en prose; no depender de instrucciones que señalen a la imagen»—, véase `docs/editorial/graph.md` v2.0 §四, §六.

[^9]: Para la estructura SSOT de ocho secciones del informe de investigación y los umbrales de validación de `research-report-health.py` (fuentes no repetidas ≥ 25 / inglés ≠ 0 / primarias ≠ 0), véase `docs/pipelines/REWRITE-PIPELINE.md` v7.5 Step 1.7; para las 80 búsquedas y las cuatro cuotas, véase Step 1.1; para el perspective scan de postura contraria en temas polémicos, véase Step 1.4.5.

[^10]: Para la trampa de retraducción desde un summary en inglés en el spore #28 sobre Lee Yang (comparación palabra por palabra del ejemplo de Chi-lin), véase `docs/editorial/EDITORIAL.md` v6.12 §七 línea roja.

[^11]: Para las tres reglas de hierro (historia, no solo información / cada hecho verificable / cada artículo tiene una persona), véase `docs/editorial/EDITORIAL.md` v6.12 §一.

[^12]: Para las cinco variaciones del ancla de contradicción central (la garza nocturna coroninegra: «el ave no cambió; cambió la tierra»), véase `docs/editorial/EDITORIAL.md` v6.12 §四; para los seis tipos de buenos cierres y el modelo de cierre circular de la garza nocturna coroninegra, véase §五.

[^13]: Para el sándwich de dos puntos y la galería de craft de títulos, véase `docs/editorial/EDITORIAL.md` v6.12 §三; para el Before/After de Tai Tzu-ying y Mayday, véase §九.
