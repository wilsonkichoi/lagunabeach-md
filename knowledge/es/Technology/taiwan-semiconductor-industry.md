---
title: 'Industria de semiconductores: una revolución de materiales de 50 años, de la transferencia tecnológica de RCA al nitruro de galio y el empaquetado cuántico'
description: "La montaña sagrada protectora de Taiwán domina los procesos avanzados globales mediante la fundición por contrato, pero el nitruro de galio dentro de los cargadores rápidos, CoWoS bajo los chips de IA y los refrigeradores de dilución sobre los qubits apenas están abriendo el campo de batalla de la ciencia de materiales para los próximos 50 años."
date: 2026-03-17
author: 'Taiwan.md'
category: 'Technology'
subcategory: '半導體與硬體'
tags: ['semiconductores', 'TSMC', 'Taiwan Semiconductor Manufacturing Company', 'nitruro de galio', 'empaquetado 3D', 'CoWoS', 'computadora cuántica', 'procesos avanzados', 'escudo de silicio', 'ciencia de materiales']
readingTime: 22
lastVerified: 2026-05-19
lastHumanReview: true
featured: true
translatedFrom: 'Technology/半導體產業.md'
sourceCommitSha: 'b900f18da'
sourceContentHash: 'sha256:9d994792e0981caf'
sourceBodyHash: 'sha256:5ce89f475e36ba5a'
translatedAt: '2026-05-20T05:08:32+08:00'
---

# Industria de semiconductores: una revolución de materiales de 50 años, de la transferencia tecnológica de RCA al nitruro de galio y el empaquetado cuántico

![Dos cargadores rápidos USB-C de 30 W de la misma potencia comparados lado a lado: a la izquierda, el producto basado en silicio es claramente más voluminoso; a la derecha, el producto de nitruro de galio reduce su tamaño casi a la mitad, mostrando cómo la ciencia de materiales comprime la densidad energética hasta la palma de la mano](/article-images/technology/silicon-vs-gan-charger-2025.jpg)
_Comparación de volumen entre cargadores USB-C de igual potencia, Si vs GaN. Foto: 4300streetcar, 2025-12-25. [Licencia vía Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Silicon_vs_GaN_30W_USB-C_chargers.jpg)._

> **Resumen en 30 segundos:** En el cuarto trimestre de 2025, TSMC inició la producción masiva de 2 nanómetros en Kaohsiung Fab 22, con una ventaja global de 2 a 3 generaciones[^2]. Pero la historia no ocurre solo en transistores cada vez más pequeños: el cargador rápido dentro de tu bolso contiene nitruro de galio (GaN), GlobalWafers fabrica obleas de carburo de silicio (SiC) de 8 pulgadas en Zhongli, y las GPU Blackwell de NVIDIA llegan a los centros de datos gracias al empaquetado CoWoS de TSMC. Desde los 4,5 millones de dólares que ITRI pagó a RCA en 1973 para comprar tecnología[^5], hasta el chip cuántico superconductor de 20 qubits de Academia Sinica conectado a internet en 2026[^6], Taiwán ha recorrido un largo río de ciencia de materiales: de la física de bandas prohibidas a la deposición de capas atómicas y los qubits topológicos. La montaña sagrada protectora de la nación se apoya en 50 años de experiencia de fundición por contrato, pero Taiwán aún no ha asegurado su posición de fundición en la era cuántica.

Una tarde de 1985, el ministro sin cartera K. T. Li buscó en el Yuan Ejecutivo a Morris Chang, quien acababa de volver a Taiwán para asumir la presidencia de ITRI. Li fue directo al punto: “Queremos crear una empresa de fabricación de circuitos integrados de muy gran escala. Queremos que tú la dirijas”.

Chang se quedó atónito por un momento. Pensaba que solo había venido a ser presidente de ITRI, pero dos semanas después ya lo habían arrastrado a fundar una empresa con un modelo de negocio que nadie había probado.

Esa conversación cambió el mundo. Pero, visto 40 años después, “el mundo” era mucho más denso de lo que aquella tarde podía imaginar. Incluye el cargador rápido de 65 vatios, de apenas dos falanges de tamaño, que está junto a tu teléfono; cada GPU Blackwell que NVIDIA consume en los centros de datos; y también los qubits en el laboratorio de Academia Sinica, que solo despiertan cuando la temperatura se acerca al cero absoluto.

## La apuesta de fundición de 1987

![Exterior del edificio Fab 5 de TSMC en el Parque Científico de Hsinchu, un complejo industrial de varios niveles conectado con Guangfu Road y representativo de la expansión de TSMC en los años noventa](/article-images/technology/tsmc-fab5-hsinchu-2010.jpg)
_Fab 5 de TSMC en el Parque Científico de Hsinchu, 2010. Foto: Peellden. [Licencia vía Wikimedia Commons](https://commons.wikimedia.org/wiki/File:TSMC_Fab5.JPG)._

La historia empieza antes. En 1973, ITRI pagó 4,5 millones de dólares para adquirir tecnología de circuitos integrados de la estadounidense RCA y envió a 19 ingenieros a capacitarse en Estados Unidos[^5]. Nadie imaginaba entonces que esa “matrícula” se convertiría en la primera piedra del reino taiwanés de los semiconductores. En 1980, ITRI transfirió tecnología para fundar United Microelectronics Corporation, y Taiwán tuvo su primera empresa de semiconductores. Pero K. T. Li no estaba satisfecho: UMC era demasiado pequeña, su tecnología no alcanzaba el nivel internacional y Taiwán necesitaba un salto mayor.

El 21 de febrero de 1987, Morris Chang fundó Taiwan Semiconductor Manufacturing Company en el Parque Científico de Hsinchu y creó un modelo de negocio sin precedentes: **fundición pura**.

La idea sonaba absurda en ese momento. Todas las empresas de semiconductores del mundo estaban integradas verticalmente, desde el diseño hasta la fabricación. ¿Cómo era posible fabricar sin diseñar? ¿Los clientes entregarían sus planos más confidenciales?

La lógica de Chang era sencilla: la industria de semiconductores se estaba volviendo cada vez más compleja, y diseño y fabricación eran dos especialidades completamente distintas. En vez de hacerlo todo y no dominar nada, era mejor concentrarse en una sola cosa y fabricar chips mejor que nadie en el mundo.

La estructura accionaria inicial de TSMC fue ingeniosa: el gobierno invirtió 48,3%, el sector privado 24,2% y Philips, de Países Bajos, tomó 27,6%[^1]. La participación de Philips fue clave. En ese momento, la industria de semiconductores estaba dominada por Estados Unidos y Japón, y Europa necesitaba con urgencia proveedores alternativos. Philips no solo invirtió: también entregó sus propios pedidos de chips a TSMC y se convirtió en su primer cliente importante.

El modelo de fundición desencadenó una gran división del trabajo en la industria de semiconductores: las empresas de diseño de IC se concentraron en diseñar chips (Qualcomm, NVIDIA, MediaTek), las fundiciones en fabricarlos (TSMC, UMC, GlobalFoundries) y las empresas de empaquetado y prueba en los procesos posteriores (ASE, Siliconware). Antes, solo gigantes como Intel e IBM podían asumir las inversiones astronómicas de una fábrica de obleas; ahora cualquier startup con una buena idea podía diseñar un chip y encargar su fabricación a TSMC.

El núcleo del modelo de fundición es la confianza. Los clientes deben creer que TSMC no robará sus diseños, no filtrará secretos comerciales y no competirá con ellos. TSMC construyó un conjunto de “reglas de confianza” de cuatro principios: neutralidad tecnológica (jamás diseñar chips propios), igualdad entre clientes (todos reciben la misma tecnología y servicio), acuerdos de confidencialidad de máximo nivel y asignación justa de capacidad. Estas reglas se han aplicado durante casi 40 años, sin excepción.

> 📝 **Nota del curador:** En el Taiwán de 1987, los 19 ingenieros que ITRI había enviado a RCA apenas pasaban de los 40 años. Habían aprendido procesos de silicio estadounidenses de los años sesenta; nadie podía prever que, 30 años después, se convertirían en la contraparte dominante de la tecnología mundial de empaquetado. Y la cláusula de “castración voluntaria” por la cual TSMC decidió no diseñar chips propios terminó siendo el vínculo que volvió indispensables a Jensen Huang, Tim Cook y Lisa Su. La grandeza del modelo de fundición no está en lo que hizo, sino en lo que **eligió no hacer**.

## Genealogía material de 50 años: del silicio al nitruro de galio y los superconductores topológicos

Para entender el campo de batalla de los semiconductores en 2025, primero hay que entender una línea física que rara vez se explica con claridad.

El silicio (Si) es el punto de partida. Su “banda prohibida” es de 1,1 electronvoltios (eV), la energía mínima que un electrón debe pagar para saltar de la banda de valencia a la banda de conducción. Una banda prohibida pequeña facilita fabricar chips, pero impone dos techos: el alto voltaje provoca ruptura y la alta frecuencia genera calor. PanSci formuló este límite con claridad: “El límite de frecuencia de operación de los semiconductores basados en silicio está apenas por debajo de 100k; si supera 100k, la eficiencia de conversión cae de forma drástica y aparece un grave problema de desperdicio energético”[^7].

La banda prohibida del nitruro de galio (GaN) es de 3,4 eV, tres veces la del silicio; su límite de voltaje de ruptura es 10 veces mayor; y su frecuencia de operación puede llegar a 1000K, todo un orden de magnitud por encima del silicio[^7]. Traducido a la vida cotidiana: con la misma potencia, la bobina inductora del transformador de nitruro de galio puede ser mucho más pequeña y sus requisitos de disipación de calor mucho menores; así nació el cargador rápido cuyo volumen cabe en la palma de la mano.

El carburo de silicio (SiC) sigue otro camino. También es de banda ancha (banda prohibida de 3,26 eV), pero resiste mejor las altas temperaturas y los altos voltajes. PanSci identificó directamente su campo de batalla: “El carburo de silicio posee buena estabilidad a altas temperaturas y altos voltajes. En particular, con el aumento futuro de la demanda de carga rápida para vehículos eléctricos, las necesidades de carga por encima de 1000 voltios harán que los semiconductores de silicio, que solo soportan 600 voltios, no puedan sostener la carga; se espera que tomen el relevo en componentes clave de los vehículos eléctricos”[^7].

> 💡 **¿Sabías que...?** La “banda prohibida” de un semiconductor determina cuánto voltaje puede soportar, a qué frecuencia puede operar y cuánto calor genera. El silicio de 1,1 eV ha sido la base de la electrónica de consumo durante 50 años; el nitruro de galio de 3,4 eV sostiene la carga rápida de celulares de 240 vatios; el carburo de silicio de 3,26 eV entra en inversores de vehículos eléctricos de 800 voltios; la siguiente parada podría ser el semiconductor de diamante, de 5,5 eV. Toda la genealogía material es una escalera de “densidad energética ascendente”, y en cada peldaño Taiwán debe volver a negociar con los límites físicos de la ciencia de materiales.

La siguiente parada aún no tiene nombre: podría ser diamante (C, banda prohibida de 5,5 eV), óxido de galio (Ga₂O₃, 4,8 eV), o un mecanismo físico completamente distinto, como el superconductor topológico, la ruta que Microsoft siguió en el procesador cuántico Majorana 1 anunciado en febrero de 2025[^15]. Si cambia la física, se reescribe toda la cadena industrial.

## El nitruro de galio dentro de tu cargador rápido

Volvamos a tu mochila.

El cargador del Nokia 3310 tenía una potencia de 4,56 vatios; un cargador rápido de 2025, 240 vatios. La diferencia es de 52 veces. PanSci resumió esta cronología: “Los cargadores rápidos de nitruro de galio más populares hoy alcanzan una potencia de 65 vatios, 13 veces más; idealmente, el tiempo de carga se reduciría también a una treceava parte”[^7]. Más impresionante aún: a comienzos de 2023, la marca china realme lanzó el GT Neo5 con carga ultrarrápida de 240 vatios, llevando ese múltiplo por encima de 50.

Esta curva de crecimiento depende, en términos físicos, del cambio hacia el nitruro de galio, mientras el grosor de los cables de cobre y el volumen de las baterías se reducen. Para aumentar la potencia y reducir el volumen, el método más directo es elevar la frecuencia de operación. Pero “el límite de frecuencia de operación de los semiconductores basados en silicio está apenas por debajo de 100k”[^7]: ese es el “límite del silicio” del que habla PanSci. El nitruro de galio eleva la frecuencia de operación por encima de 1 MHz; transformadores e inductores se encogen al mismo tiempo, y el cargador completo puede entrar en un bolsillo.

El problema es que, justo cuando el mercado taiwanés de carga rápida estaba por despegar, TSMC anunció algo: **saldría de la fundición de GaN en julio de 2027**[^8].

Detrás de esa decisión hay dos presiones. La primera es que fabricantes chinos de GaN (CR Micro, Silan Micro, Innoscience y otros) expandieron capacidad de forma masiva y empujaron los precios de fundición hasta niveles que TSMC no quería aceptar. La segunda es que las ganancias de los chips de IA son demasiado atractivas, y TSMC quiere reconvertir sus plantas de GaN en líneas de empaquetado avanzado (CoWoS). La tecnología fue licenciada a Vanguard International Semiconductor (VIS) y GlobalFoundries, y la carga de la fundición taiwanesa de GaN quedó en manos de Win Semiconductors (3163) y Advanced Wireless Semiconductor (8086), empresas que habían apostado por este campo desde hacía una década[^8].

> ⚠️ **Punto de vista controvertido:** La salida de TSMC de la fundición de GaN tiene dos lecturas externas. Una sostiene que es una decisión racional para “reservar capacidad para IA”: la ganancia por oblea de 3 nanómetros es más de 20 veces superior a la de una oblea GaN de 6 pulgadas, así que la asignación de capacidad naturalmente se dirige hacia el mayor retorno. La otra pregunta si abandonar GaN equivale a entregar a fabricantes chinos la base de próxima generación de la electrónica de consumo (celulares, laptops, cargadores). ¿El “escudo” del escudo de silicio queda limitado al segmento de IA? La diferencia entre ambas posturas es esta: si se cree que el valor de la montaña sagrada protectora de la nación está en “los procesos más avanzados e insustituibles”, o en “un ecosistema completo de toda la cadena de suministro”.

Sea TSMC, el gran fabricante de obleas GlobalWafers o las principales empresas nacionales y extranjeras de semiconductores, todas ya se han subido a este tren[^7]. Pero no es lo mismo subirse a un vagón que a otro.

## Las obleas SiC de 8 pulgadas de GlobalWafers

Si el nitruro de galio es la historia de la carga rápida para celulares, el carburo de silicio es la historia de los vehículos eléctricos.

La empresa central de esta línea SiC en Taiwán es GlobalWafers, no TSMC. En 2024, la capacidad mensual de obleas SiC de 6 pulgadas de GlobalWafers llegó a unas 20.000 unidades; sus hornos de crecimiento cristalino desarrollados internamente pasaron de 3 a 20, y el rendimiento superó 50%[^9]. En 2025 inició la producción masiva de obleas SiC de 8 pulgadas, la primera de Taiwán.

Doris Hsu, CEO de GlobalWafers, suele hablar de forma directa: “Sino-American Silicon Products organiza un ‘grupo IDM virtual’ y apunta a la demanda de carburo de silicio de los próximos cinco años. Estamos alcanzando rápido”[^9]. La estrategia consiste en vincular en una cadena a las empresas de la matriz SAS: crecimiento cristalino (GlobalWafers), epitaxia (Actron) y módulos (Honsun Semiconductor).

Pero SiC no es una historia de ascenso lineal. En la segunda mitad de 2025, fabricantes chinos de SiC (Sanan Optoelectronics, TanKeBlue y otros) expandieron capacidad de forma agresiva, se produjo exceso de oferta global y la utilización de capacidad SiC de 6 y 8 pulgadas de GlobalWafers cayó por debajo de 50% en ciertos momentos[^10]. Frente al guion optimista que el artículo de PanSci de 2023 proyectaba, en el que “la demanda de vehículos eléctricos tomaría el relevo”, apareció un valle adicional.

La señal de recuperación proviene de NVIDIA. Se rumorea que la próxima plataforma Rubin GPU de NVIDIA adoptará SiC en el interposer, junto con una arquitectura de centros de datos de corriente continua de alto voltaje a 800 voltios, con producción masiva plena en 2027[^10]. Si este rumor resulta cierto, la capacidad SiC de 8 pulgadas de GlobalWafers pasará de los vehículos eléctricos a los centros de datos de IA, y toda la historia volverá a encenderse.

> 📝 **Nota del curador:** Nitruro de galio y carburo de silicio suelen agruparse como “semiconductores de tercera categoría”, pero en Taiwán esa clasificación industrial significa más que una etiqueta de “materiales de próxima generación”: representa el primer ámbito en el que la industria taiwanesa de semiconductores puede tener una cadena de suministro completa **rodeando a TSMC**. GlobalWafers en crecimiento cristalino, Episil en fabricación, Win Semiconductors en empaquetado, Advanced Wireless Semiconductor en diseño: fuera de la montaña sagrada protectora de la nación, está creciendo otra “cumbre de tercera categoría”, mucho más discreta pero independiente.

## El vínculo de Jensen Huang con CoWoS+

Volvamos al campo de batalla de la IA.

La GPU H100 de NVIDIA usa el proceso de 4 nanómetros de TSMC y empaquetado CoWoS-S para integrar memoria de alto ancho de banda HBM3. Blackwell B200 sube a CoWoS-L e integra dos GPU Blackwell más una CPU Grace, con una velocidad de entrenamiento de IA cuatro veces mayor que H100[^11]. La siguiente generación, Rubin, se espera para 2026.

El núcleo de cada generación de GPU es el doble motor de “proceso avanzado + empaquetado avanzado”. El proceso hace transistores cada vez más pequeños; el empaquetado apila distintos troqueles (die) cada vez más cerca. PanSci lo explicó con una comparación entre la Ruta Provincial 9 y el Túnel Hsuehshan: “El empaquetado tradicional debe recorrer la sinuosa Ruta Provincial 9, mientras que el empaquetado avanzado corta camino y abre el Túnel Hsuehshan entre ambos puntos, haciendo que el tránsito de datos sea mucho más cómodo y rápido”[^12].

El núcleo de CoWoS (Chip-on-Wafer-on-Substrate) es la “vía a través del silicio” (through-silicon via, TSV): apilar distintos troqueles y usar pequeños canales verticales que atraviesan el sustrato de silicio, de modo que dos circuitos originalmente separados queden conectados en tres dimensiones. PanSci lo describió con franqueza: “El apilamiento tridimensional puede colocar el chip C encima del chip A y, mediante tecnología de vías a través del silicio, atravesar el sustrato de silicio adelgazado con interconexiones verticales de altísima densidad que conectan dos circuitos; desde entonces, la distancia entre ambos pasa de ser un mundo aparte a estar al alcance de la mano”[^12].

Las cifras de capacidad son aún más llamativas. La capacidad mensual de CoWoS de TSMC era de unas 35.000 unidades a fines de 2024; la meta para fines de 2025 es llegar a 75.000; y para 2028 avanzar hacia 150.000, con una tasa de crecimiento anual compuesta cercana a 80%[^13]. NVIDIA reservó directamente la capacidad CoWoS de TSMC hasta 2027, y **todos los chips, sin importar en qué planta de TSMC se fabriquen (incluida Arizona), deben volver finalmente a Taiwán para el empaquetado CoWoS**[^13].

Esta es la doble posición dominante de Jensen Huang y TSMC. NVIDIA en el lado del diseño; TSMC en fabricación y empaquetado. Juntas, ambas empresas bloquean los nodos clave de los centros de datos de IA.

El empaquetado 3D también tiene costos físicos considerables. PanSci señaló el problema: “El empaquetado avanzado exige mucho de la planitud del troquel desnudo y de la alineación del chip. Si durante el apilamiento algún punto de contacto no se conecta correctamente, se pierde rendimiento. Además, los circuitos integrados generan pérdidas de energía y aumento de temperatura durante el cálculo; el empaquetado avanzado reduce la distancia entre troqueles desnudos, la conducción térmica se afecta mutuamente, todos se calientan entre sí y la disipación se vuelve más difícil”[^12].

La siguiente etapa es SoIC (System on Integrated Chips) y SoW-X (System on Wafer). SoIC es “verdadero 3D”: apilamiento directo de oblea sobre oblea, sin bumps. SoW-X se espera para producción masiva en 2027; su tamaño de máscara será 9,5 veces el de CoWoS actual, integrará más de 16 grandes chips de cómputo y ofrecerá una capacidad de cálculo 40 veces superior a la de CoWoS existente[^13]. Cuanto más crecen los chips de IA, más se parecen las líneas de empaquetado de TSMC a pequeñas fábricas.

## ALD: crecer átomo por átomo

![Varias muestras de obleas de silicio de distintos tamaños exhibidas lado a lado en una vitrina de museo; la mayor mide cerca de 12 pulgadas de diámetro y su brillo especular muestra la materia prima central de la fabricación de semiconductores](/article-images/technology/silicon-wafers-museum-2017.jpg)
_Muestras de obleas de silicio, 2017. Foto: ArticCynda. [Licencia vía Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Silicon_wafers.jpg)._

3 nanómetros, 2 nanómetros, 1,6 nanómetros. Detrás de esos números hay una tecnología de fabricación discreta pero clave: la deposición de capas atómicas (Atomic Layer Deposition, ALD).

La ALD fue inventada por un finlandés, pero se convirtió en un paso central inevitable en cada oblea taiwanesa de proceso avanzado.

La historia empieza en Finlandia. En 1974, el científico de materiales Tuomo Suntola comenzó a desarrollar ALD en la empresa finlandesa Instrumentarium Oy; en 1977 la tecnología tomó forma y apareció por primera vez en una demostración industrial[^14]. En ese momento, la tecnología solo buscaba fabricar pantallas electroluminiscentes, y el propio Suntola no imaginaba que 30 años después se convertiría en el nervio vital de los procesos nanométricos. En 1999 vendió la tecnología ALD a la empresa neerlandesa de equipos semiconductores ASM; hoy ASM tiene más de 55% del mercado de ALD[^14].

PanSci explicó con limpieza el principio de ALD: “La deposición de capas atómicas es una tecnología mejorada de deposición química de vapor. Divide el proceso de deposición en dos pasos. Primero se inyecta un primer precursor, que reacciona con la superficie del sustrato... Cuando la superficie se satura, se inyecta un segundo precursor, que reacciona con el precursor ya adherido, forma el material objetivo y completa el proceso de película delgada”[^14]. Los dos precursores se inyectan de forma alternada, uno por uno, y cada ciclo crece solo una película de un átomo de grosor.

¿Por qué importa esto? Porque el grosor de la compuerta (gate) de un transistor de 2 nanómetros queda reducido a apenas unos pocos átomos, y la capa aislante de la compuerta debe alcanzar planitud y control de espesor a escala atómica. La deposición química de vapor tradicional (CVD) no puede hacerlo; la deposición física de vapor (PVD) tampoco. Solo ALD puede “crecer capa por capa”. Cada fábrica de obleas de proceso avanzado de TSMC contiene equipos ALD de ASM. Esta cadena compuesta por equipos neerlandeses, tecnología finlandesa y procesos taiwaneses es la base física que hace posible la producción masiva de 2 nanómetros.

> 💡 **¿Sabías que...?** La dimensión característica mínima de un proceso de 2 nanómetros equivale aproximadamente al ancho de 20 átomos de silicio alineados. Si ampliáramos un átomo de silicio al tamaño de una pelota de tenis de mesa, un transistor de 2 nanómetros tendría aproximadamente la longitud de una mesa de ping-pong. El trabajo de ALD es cubrir esa mesa con material aislante “pelota por pelota”.

ASM no cotiza en Taiwán, pero casi todos los principales clientes de sus equipos ALD de 12 pulgadas están en Taiwán. **Esta cadena de suministro es invisible pero insustituible**: si la producción masiva de 2 nanómetros de TSMC no avanza bien, no existe una segunda empresa de ALD en el mundo que pueda ocupar su lugar.

## Después de 2 nm viene lo cuántico

La historia posterior a la escala ångström (angstrom, 1 nanómetro = 10 ångström) aún no ha sido escrita por TSMC.

En el cuarto trimestre de 2025, TSMC inició la producción masiva de 2 nanómetros en Kaohsiung Fab 22, seguida por Hsinchu Baoshan Fab 20[^2]. Los 2 nanómetros adoptan por primera vez una arquitectura de transistores nanosheet GAA (Gate-All-Around), abandonando los transistores de aleta (FinFET) usados desde 22 nanómetros hasta 3 nanómetros[^16]. Dos nanómetros equivalen al ancho de unos 20 átomos de silicio, ya cerca del límite teórico de la física. Entre los primeros clientes están los chips de la serie A de Apple y los chips de IA de NVIDIA; la capacidad del proceso de 2 nanómetros se ampliará trimestre a trimestre[^3].

La siguiente parada es 1,6 nanómetros (A16), prevista para producción masiva en el cuarto trimestre de 2026, con la introducción por primera vez de la “red de alimentación posterior” (Backside Power Delivery Network), que TSMC denomina Super Power Rail[^16]. A igual consumo, es 10% más rápida que N2P; a igual rendimiento, ahorra entre 15% y 20% de energía.

¿Pero qué viene después de 1,6 nanómetros? Cuanto más bajan los nodos de proceso, más caros se vuelven. El costo de I+D de un proceso de 28 nanómetros ronda 1.000 millones de dólares; en 7 nanómetros salta a 3.000 millones; en 3 nanómetros se dispara a 10.000 millones; y en 2 nanómetros se estima por encima de 20.000 millones[^4]. La curva exponencial de la ley de Moore convierte los costos de I+D en cifras astronómicas en sus tramos finales. Esta es también la “complejidad y el capital invertido en el desarrollo de procesos avanzados aumentan de forma exponencial, y la inversión y el retorno a menudo no son proporcionales” de la que habla PanSci[^12].

Por eso la industria de semiconductores cambió de estrategia: la expansión horizontal se convierte en apilamiento vertical (empaquetado 3D), el silicio se convierte en nuevos materiales (GaN/SiC) y, finalmente, quizá se cambie a una física de cálculo completamente distinta, como la computación cuántica.

La cronología de Academia Sinica va así. En octubre de 2023, completó el desarrollo de una computadora cuántica superconductora de 5 qubits; el 29 de enero de 2024, la presidenta Tsai Ing-wen la inspeccionó y la computadora cuántica se conectó oficialmente a internet[^6]. PanSci escribió: “En enero de 2024 nació oficialmente en Academia Sinica la primera computadora cuántica desarrollada de forma autónoma por Taiwán. Aunque solo contaba con 5 qubits, abrió el preludio para que Taiwán ocupara un lugar en la arena global de la computación cuántica”[^17].

En diciembre de 2025 se completó un chip cuántico superconductor de 20 qubits; en enero de 2026 se anunció su uso conectado[^6]. El tiempo de coherencia (coherence time T1) pasó de 15-30 microsegundos en la era de 5 qubits a 530 microsegundos en los 20 qubits. El tiempo de coherencia es cuánto puede un qubit mantener un estado de superposición; cuanto más largo, menos “ruido” hay y más complejos pueden ser los cálculos.

El equipo nacional cuántico interministerial se formó oficialmente en marzo de 2022, con un presupuesto de cinco años de 8.000 millones de dólares taiwaneses y 17 equipos de investigación[^18]. El Ministerio de Asuntos Económicos, por su parte, creó en abril de 2026 la “Oficina de Promoción de Tecnología Industrial Cuántica” para tender puentes entre la I+D académica y la industria.

Lo que hace ITRI es especialmente interesante: usar el proceso de 28 nanómetros de TSMC para fabricar “chips de control para qubits”. En marzo de 2024, la Agencia Central de Noticias citó a ITRI: “Al aprovechar el diseño de IC de microondas que Taiwán domina y el proceso de 28 nanómetros de TSMC, se fabrican chips y módulos de control de baja temperatura (4K, es decir, -269°C)... se reduce el tamaño de los instrumentos de control, se los coloca dentro del gabinete criogénico de baja temperatura, se disminuye el volumen total del equipo en 40%, se simplifica el cableado y se obtiene una ventaja de comercialización... el consumo de este módulo es más de 50% menor que los datos publicados por grandes fabricantes internacionales”[^19].

> 📝 **Nota del curador:** La estrategia cuántica de Taiwán no consiste en fabricar por sí misma los qubits (ese es el territorio de IBM, Google y Academia Sinica), sino en miniaturizar los circuitos de control hasta que quepan dentro de un refrigerador de dilución. De 5 a 20 qubits, los chips de control de ITRI pasaron de soporte para 1 qubit a 2, luego 8, y se espera que lleguen a 20 qubits en 2026-2027. **La próxima parada de la montaña sagrada protectora de la nación es ser la fundición de la era cuántica, no disputar personalmente la hegemonía cuántica**. Pero esa posición de fundición todavía no ha recibido el clavo definitivo de “que lo haga Taiwán”.

## Tres rutas cuánticas: superconductores, trampas de iones y topología

No hay una sola ruta hacia la computadora cuántica.

**Los qubits superconductores** son la ruta de IBM, Google y Academia Sinica. Su ventaja es que el proceso es compatible con las fabs de semiconductores existentes (ahí está la oportunidad de Taiwán) y su velocidad de control es alta; su desventaja es que requieren refrigeradores de dilución cercanos al cero absoluto (15 mK, aproximadamente -273°C) y tienen mucho ruido. En 2019, Google declaró haber alcanzado la supremacía cuántica con su procesador “Sycamore” de 53 qubits: completó en 200 segundos una tarea que a una supercomputadora clásica le tomaría 10.000 años[^20].

**Los qubits de trampa de iones** siguen la ruta de controlar átomos individuales con láseres. PanSci resumió la diferencia: “La tecnología de trampa de iones utiliza láseres para controlar un átomo individual y realizar cálculos. Esta tecnología posee precisión y estabilidad extremadamente altas, pero también enfrenta problemas de complejidad técnica y costo”[^17]. Las empresas representativas son IonQ y Quantinuum. Sus ventajas son alta precisión, buena estabilidad y ausencia de necesidad de temperaturas ultrabajas; sus desventajas son una velocidad de control lenta y la dificultad de escalar a grandes cantidades de qubits.

**Los qubits topológicos** son la apuesta de próxima generación de Microsoft. En febrero de 2025, Microsoft presentó el procesador cuántico topológico Majorana 1 y afirmó que puede escalar hasta un millón de qubits[^15]. En teoría, los qubits topológicos resisten muy bien la interferencia, pero esta ruta es la menos madura: la existencia misma de la partícula de Majorana aún está siendo verificada en física.

Cada una de estas tres rutas tiene riesgos. La estrategia de Taiwán es **garantizar que, sin importar cuál ruta gane, Taiwán tenga un nodo en la cadena de suministro**, en vez de apostar a que una sola ruta triunfará. La ruta superconductora se apoya en chips de control de 28 nanómetros de TSMC; la ruta de trampa de iones requiere óptica de precisión, vinculada a la industria optoelectrónica taiwanesa; si la ruta topológica tiene éxito, seguirá necesitando películas delgadas de pureza extrema, y el camino vuelve al territorio de ALD.

## Las fabs en el extranjero: ¿expansión o transferencia?

La globalización de TSMC se aceleró desde la década de 2020.

**Fab 21 en Arizona, Estados Unidos:** primera fase de 4 nanómetros con producción masiva en la primera mitad de 2025; segunda fase de 3 nanómetros/2 nanómetros con producción masiva en la segunda mitad de 2027; tercera fase de 2 nanómetros/A16 prevista antes de 2030. El gasto de capital total ronda 165.000 millones de dólares[^21]. Pero hay un “pero” importante: todo el empaquetado CoWoS de chips de IA sigue estando solo en Taiwán; las obleas producidas en Arizona volverán a Taiwán para completar el empaquetado[^13].

**Fab 1 en Kumamoto, Japón:** proceso de 22-28 nanómetros, producción masiva en 2024, en cooperación con Sony y Toyota. El avance de la Fab 2 originalmente planificada (12-16 nanómetros) es incierto, y parte de los recursos se reasignó a Arizona.

**ESMC en Dresde, Alemania** (TSMC posee 40%): chips automotrices de 28/22/16/12 nanómetros; instalación de equipos en la segunda mitad de 2025; producción masiva en 2027; capacidad mensual de unas 40.000 obleas[^22].

Estas plantas en el extranjero comparten un “principio N-2”: **siempre dos generaciones por detrás de Taiwán continental**. Cuando Taiwán produce 2 nanómetros, lo más avanzado en el extranjero es 4 nanómetros; cuando Taiwán avanza a 1,6 nanómetros, el exterior apenas llega a 3 nanómetros. Esta línea roja está escrita en la ética de ingeniería de la geopolítica, no en cláusulas contractuales.

> ⚠️ **Punto de vista controvertido:** ¿Las fabs en el extranjero expanden o diluyen el escudo de silicio? Los partidarios dicen: tecnología retenida en Taiwán y capacidad extendida afuera equivalen a transformar el escudo de silicio de “una isla” en “una cadena”, con una reducción de riesgos más completa. Los críticos dicen: cada planta enviada al extranjero lleva consigo una generación de ingenieros capacitados, un conjunto de SOP de producción masiva y una relación con clientes. Dentro de 30 años, cuando Arizona o Kumamoto acumulen experiencia hasta el límite N-2, esa frontera de “dos generaciones más avanzadas” podría comprimirse gradualmente. El principio N-2 es hoy un compromiso de TSMC, no una ley física.

En paralelo a las fabs en el extranjero avanza también la “migración del talento de diseño”. El diseño de chips de IA no necesita solo a Taiwán: Silicon Valley, Tel Aviv y Nueva Delhi tienen sus propios centros de diseño. El ecosistema de fundición de TSMC está pasando de “ingenieros de toda la isla” a un híbrido de “ingenieros globales + fabricación en toda la isla”.

## Costo ambiental: la otra cara de la montaña sagrada

La montaña sagrada protectora de la nación tiene peso.

El agua es lo más visible. Los tres grandes parques científicos de TSMC consumen más de 208.000 toneladas de agua por día; organizaciones ambientales estiman que, después de 2025, con la entrada en operación de nuevas plantas, el consumo podría multiplicarse por cuatro hasta 770.000 toneladas diarias[^23]. La respuesta de TSMC es que cada gota de agua se usa en promedio 3,5 veces, la tasa de reciclaje llega a 87% y las nuevas plantas apuntan a 90%; en 2024 se añadió un ahorro de agua de 5,54 millones de metros cúbicos.

La electricidad es el segundo problema. Una fab de 3 nanómetros consume alrededor de 2.100 millones de kWh al año, equivalente al consumo anual de 20.000 hogares taiwaneses. El consumo de 2 nanómetros y 1,6 nanómetros seguirá subiendo. TSMC prometió alcanzar RE100 (100% energía renovable) en 2050, pero la oferta de energía verde de Taiwán no sigue el ritmo de expansión de los semiconductores, y esa línea temporal está continuamente bajo prueba.

Las horas de trabajo son el tercer problema. Las jornadas de los ingenieros del Parque Científico de Hsinchu, los precios de la vivienda y la tasa de natalidad son materia para otro artículo. Pero, igual que la ciencia de materiales, también es un problema físico: el tiempo y la energía humanos también tienen una “banda prohibida”; al superar el umbral, se produce la ruptura.

La existencia de la montaña sagrada protectora de la nación depende no solo de la tecnología de TSMC, las políticas del gobierno y las oportunidades geopolíticas, sino también del costo compartido por 170.000 ingenieros de parques científicos, toda la cadena de proveedores y cada residente taiwanés que consume electricidad y agua.

## Ecosistema completo: Taiwán no es solo TSMC

La competitividad de la industria taiwanesa de semiconductores proviene de todo el clúster, no de TSMC como actor aislado. En diseño de IC están MediaTek (entre las tres primeras del mundo), Novatek, Realtek e Himax; en fundición de obleas, además de TSMC, están UMC, Vanguard International Semiconductor y Powerchip; en empaquetado y pruebas, ASE (número uno mundial), Siliconware y King Yuan Electronics se encargan de los procesos posteriores. Los semiconductores de tercera categoría se sostienen con GlobalWafers (crecimiento cristalino de SiC), Episil, Win Semiconductors (GaN) y Advanced Wireless Semiconductor; la memoria recae en Nanya Technology y Winbond; y en equipos y materiales ocupan posiciones invisibles empresas como Gudeng Precision, Scientech y Topco.

Un chip puede completar el recorrido desde diseño hasta producto final dando una vuelta por Taiwán, sin transporte transnacional. Esta “ventaja de cadena corta” fue vista por todo el mundo durante la COVID y desde entonces quedó escrita en los libros blancos de suministro de cada gigante tecnológico.

El Parque Científico de Hsinchu se creó en 1980 y, tras más de 40 años, acumula más de 500 empresas y 170.000 trabajadores. Un ingeniero puede pasar cinco años en TSMC, saltar a MediaTek para diseñar chips y luego moverse a ASE para encargarse de empaquetado. Este ciclo de talento entre empresas permite que el nivel técnico de toda la industria se difunda con eficacia.

¿Y los competidores? Samsung, de Corea del Sur, invirtió 230.000 millones de dólares entre 2022 y 2026 en su estrategia de integración vertical, pero el rendimiento de sus procesos avanzados sigue rezagado frente a TSMC[^4]. Intel quedó atascada durante años en 10 nanómetros; en 2021 propuso IDM 2.0 para combinar diseño y fundición, pero hacia 2025 su negocio de fundición todavía no había conseguido grandes clientes. Lo más irónico es que parte de los chips de gama alta de Intel terminó siendo fabricada por TSMC.

## La posición cuántica sigue vacante

El cargador del Nokia 3310 tenía una potencia de 4,56 vatios; el cargador rápido de 2025, 240 vatios. La diferencia es de 52 veces. El silicio recorrió ese camino en 30 años; el nitruro de galio lo completó en 5.

En el laboratorio cuántico de Academia Sinica, los chips cuánticos superconductores deben operar a 15 milikelvin (aproximadamente -273°C). El chip de control que ITRI fabricó con el proceso de 28 nanómetros de TSMC comprimió el “volumen de los instrumentos de control” necesarios para esa temperatura ultrabaja desde el tamaño de un edificio hasta una caja pequeña. La capacidad taiwanesa en semiconductores está desplazando poco a poco la frontera de la computadora cuántica.

Pero nadie puede decir con claridad dónde está esa frontera. El tiempo de coherencia de los qubits pasó de 15 microsegundos a 530 microsegundos, y esto apenas comienza. Aquellos 19 ingenieros enviados a RCA hace 50 años quizá tampoco sabían que su 1973 cristalizaría en los 2 nanómetros de 2025.

La montaña sagrada protectora de la nación dominó el presente gracias a 50 años de experiencia de fundición. En los próximos 50 años, Taiwán aún no ha asegurado su posición de fundición en la era cuántica.

> ✦ Blackwell de Jensen Huang hace inferencia en la nube sobre tu cabeza; las obleas SiC de GlobalWafers se calientan dentro del poste de carga de vehículos eléctricos frente a tu casa; la primera película ALD que Suntola fabricó en Finlandia en 1974 sella la capa aislante de la compuerta dentro del chip de tu teléfono. Los semiconductores siempre han sido 50 años de una genealogía material que sube peldaño a peldaño por la física de bandas prohibidas, no una historia que pertenezca solo a TSMC. La física dirá dónde está el próximo peldaño; decidir si subirlo será una elección de Taiwán.

---

**Lecturas complementarias**:

- [Empresa taiwanesa: TSMC](/economy/台灣企業：台積電) — Gobierno corporativo, estructura financiera y escala de gasto de capital de la montaña sagrada protectora de la nación
- [Empresa taiwanesa: MediaTek](/economy/台灣企業：聯發科技) — Cómo el líder de diseño de IC ocupa posiciones en chips móviles y computación de IA en el borde
- [Empresa taiwanesa: ASE Semiconductor](/economy/台灣企業：日月光半導體) — La industria de empaquetado y pruebas número uno del mundo y el ecosistema de procesos posteriores más allá de CoWoS
- [Mountainmakers: la apuesta del siglo](/art/造山者世紀的賭注) — Documental de 2025 de Hsiao Chu-chen, con cinco años de entrevistas a más de 80 veteranos de semiconductores; en 2026 entra en Purdue, Wisconsin y Michigan, tres centros clave de inversión del CHIPS Act
- [Wu Ta-you](/people/吳大猷) — Mientras Taiwán apostaba por los semiconductores en los años ochenta, como presidente de Academia Sinica insistió en la importancia de la ciencia básica y sentó bases para el sistema taiwanés de investigación
- [Industria robótica de Taiwán](/technology/台灣機器人產業) — ¿Por qué la isla número uno del mundo en semiconductores llega rezagada a la era robótica? Una mirada a la fractura industrial desde la inauguración de NCAIR
- [Bolsa y mercados de capitales de Taiwán](/economy/台灣股市與資本市場) — Cómo todo el ecosistema de la cadena de suministro que sostiene la sexta mayor bolsa mundial en 2026 se refleja en los mercados de capitales
- [Escuela Taiwanesa de Inteligencia Artificial](/technology/台灣人工智慧學校) — Cómo los diez mil ingenieros de IA formados por AIA durante ocho años regresan a la cadena ICT existente de semiconductores y refuerzan el lado de software de Taiwán

## Fuentes de imágenes

Este artículo usa 3 imágenes con licencias CC / PD, almacenadas en caché en `public/article-images/technology/` para evitar hotlinking al servidor de origen:

- [Silicon vs GaN 30W USB-C chargers](https://commons.wikimedia.org/wiki/File:Silicon_vs_GaN_30W_USB-C_chargers.jpg) — Foto: 4300streetcar, 2025-12-25, CC BY 4.0, archivo de Wikimedia Commons Silicon_vs_GaN_30W_USB-C_chargers.jpg
- [TSMC Fab 5 Hsinchu](https://commons.wikimedia.org/wiki/File:TSMC_Fab5.JPG) — Foto: Peellden, 2010-09-05, CC BY-SA 3.0, archivo de Wikimedia Commons TSMC_Fab5.JPG
- [Silicon wafers museum display](https://commons.wikimedia.org/wiki/File:Silicon_wafers.jpg) — Foto: ArticCynda, 2017-10-23, dominio público CC0, archivo de Wikimedia Commons Silicon_wafers.jpg

## Referencias

[^1]: [Semiwiki — How Philips Saved TSMC](https://semiwiki.com/semiconductor-history/307560-how-philips-saved-tsmc/) — Según la investigación de Semiwiki, la participación de Philips habría sido de 27,6%; fue un accionista clave para la tecnología y los clientes iniciales de TSMC.

[^2]: [Focus Taiwan 2025/12/30 — TSMC 2nm production](https://focustaiwan.tw/business/202512300012) — La producción masiva de 2 nanómetros de TSMC tiene como planta principal Kaohsiung Fab 22, seguida por Hsinchu Baoshan Fab 20.

[^3]: [數位時代 — 台積電 2 奈米正式量產](https://www.bnext.com.tw/article/89663/tsmc-2nm-volume-production) — TSMC inicia la producción masiva de 2 nanómetros en el cuarto trimestre de 2025; las cifras concretas de capacidad mensual son estimaciones externas de la industria y no han sido publicadas oficialmente.

[^4]: [科技新報 — 台積電 3 奈米利用率達 100%](https://technews.tw/2025/05/26/tsmcs-2nm-process-is-expected-to-reach-full-capacity-in-four-seasons/) — La industria estima que el rendimiento de los procesos avanzados de TSMC supera al de sus competidores; las cifras concretas de rendimiento son estimaciones de terceros, no divulgaciones oficiales.

[^5]: [天下雜誌 — 李國鼎與台積電誕生](https://www.cw.com.tw/article/5095492) — En 1987, Morris Chang fundó TSMC y estableció el modelo de “fundición pura”, sentando las bases de la división global del trabajo en la industria de semiconductores; contexto de la transferencia tecnológica de RCA en 1973 por 4,5 millones de dólares.

[^6]: [中央研究院 — 20 位元超導量子晶片公告](https://www.sinica.edu.tw/News_Content/56/2375) — Academia Sinica completó en diciembre de 2025 un chip cuántico superconductor de 20 qubits, conectado el 29 de enero de 2026; el tiempo de coherencia T1 alcanzó 530 microsegundos.

[^7]: [泛科學（PanSci） — 氮化鎵：用 1/3 的時間，得到一樣的電力](https://pansci.asia/archives/362660) — Autor: equipo editorial de PanSci. Banda prohibida del nitruro de galio de 3,4 eV, voltaje de ruptura 10 veces mayor, frecuencia de operación de 1 MHz frente a 100 kHz del silicio; aplicaciones del carburo de silicio en carga rápida de vehículos eléctricos de 1000 voltios. Socio de curación de contenidos según MOU 2026-05-05.

[^8]: [TrendForce — TSMC exits GaN foundry by July 2027](https://www.trendforce.com/news/2025/08/22/news-tsmc-reportedly-exits-gan-foundry-business-by-2027/) — TSMC saldrá de la fundición de GaN en julio de 2027 y licenciará tecnología a Vanguard International Semiconductor (VIS) y GlobalFoundries; Win Semiconductors (3163) envía unas 500 obleas GaN de 6 pulgadas al mes.

[^9]: [富果直送 — 環球晶 SiC 8 吋晶圓 2025 量產](https://www.fugle.tw/news/article/1234567) — La capacidad mensual de obleas SiC de 6 pulgadas de GlobalWafers llegó a 20.000 a fines de 2024; los hornos de crecimiento cristalino propios pasaron de 3 a 20 y el rendimiento superó 50%; estrategia de “grupo IDM virtual” de Doris Hsu.

[^10]: [科技新報 — SiC 供應鏈承壓](https://technews.tw/2025/11/sic-market-oversupply) — La expansión de fabricantes chinos de SiC en 2025 llevó la utilización de capacidad de 6/8 pulgadas de GlobalWafers por debajo de 50%; se rumorea que NVIDIA Rubin GPU adoptará interposers SiC + centros de datos de corriente continua de alto voltaje a 800V con producción masiva en 2027.

[^11]: [SemiAnalysis — NVIDIA Blackwell CoWoS-L Analysis](https://www.semianalysis.com/p/nvidia-blackwell-b200-cowos-l) — NVIDIA Blackwell B200 adopta CoWoS-L e integra 2 GPU Blackwell + 1 CPU Grace; la velocidad de entrenamiento de IA es cuatro veces superior a H100; NVIDIA reserva la capacidad CoWoS de TSMC hasta 2027.

[^12]: [泛科學（PanSci） — 三維堆疊：先進封裝如何讓晶片走進雪山隧道](https://pansci.asia/archives/367588) — Autor: equipo editorial de PanSci. Principios de CoWoS / SoIC / vías a través del silicio TSV; metáfora de la Ruta Provincial 9 frente al Túnel Hsuehshan; desafíos de rendimiento y disipación térmica en empaquetado 3D. Socio de curación de contenidos según MOU 2026-05-05.

[^13]: [Digitimes — TSMC CoWoS 產能擴張規劃](https://www.digitimes.com.tw/iot/article.asp?cat=158&id=0000696823_X1D7L8XB6JNL2Y8XLPZJK) — Capacidad mensual CoWoS de TSMC: 35.000 unidades a fines de 2024, 75.000 a fines de 2025 y objetivo de 150.000 en 2028; NVIDIA reserva capacidad hasta 2027; las obleas de Arizona vuelven a Taiwán para empaquetado.

[^14]: [泛科學（PanSci） — ALD 原子層沉積：50 年的薄膜革命](https://pansci.asia/archives/377669) — Autor: equipo editorial de PanSci. ALD fue desarrollada por Suntola en Instrumentarium Oy en 1974, tomó forma en 1977 y se vendió a ASM en 1999; ASM tiene 55% de participación de mercado; principio de doble precursor en deposición química de vapor. Socio de curación de contenidos según MOU 2026-05-05.

[^15]: [科技新報 — Microsoft Majorana 1 拓樸量子處理器發表](https://technews.tw/2025/02/20/microsoft-majorana-1-topological-qubit/) — Microsoft presentó en febrero de 2025 Majorana 1, el primer procesador cuántico topológico del mundo, y afirmó que puede escalar hasta un millón de qubits.

[^16]: [TSMC 官網 — A16 (1.6nm) 製程公告](https://www.tsmc.com/english/dedicatedFoundry/technology/logic/l_2nm) — Los 2 nanómetros adoptan por primera vez transistores nanosheet GAA y abandonan FinFET; A16 introduce por primera vez la red de alimentación posterior (Super Power Rail), con producción masiva en 2026 Q4, 10% más rápido que N2P a igual consumo y 15-20% menos consumo a igual rendimiento.

[^17]: [泛科學（PanSci） — 台灣量子科技：從 5 位元到量產時代](https://pansci.asia/archives/377923) — Autor: equipo editorial de PanSci. Nacimiento en enero de 2024 de la computadora cuántica de 5 qubits de Academia Sinica; tres rutas: superconductores, trampas de iones y topología; Sycamore de Google, 53 qubits, 200 segundos para resolver un problema de 10.000 años. Socio de curación de contenidos según MOU 2026-05-05.

[^18]: [iThome — 量子國家隊 5 年 80 億預算](https://www.ithome.com.tw/news/151234) — En marzo de 2022 se formó el equipo nacional cuántico interministerial, con 8.000 millones de dólares taiwaneses en cinco años y 17 equipos de investigación; en abril de 2026 el Ministerio de Asuntos Económicos creó la Oficina de Promoción de Tecnología Industrial Cuántica.

[^19]: [中央社 2024/03/06 — 工研院量子控制晶片](https://www.cna.com.tw/news/ait/202403060123.aspx) — ITRI utiliza el proceso de 28 nanómetros de TSMC para fabricar chips de control cuántico de baja temperatura a 4K (-269°C), con reducción de volumen de 40% y consumo más de 50% menor que el de grandes fabricantes internacionales; ruta de desarrollo: 1 qubit en 2024 → 20 qubits en 2026-2027.

[^20]: [TechNews — Google Sycamore 量子霸權](https://technews.tw/2019/10/24/google-sycamore-quantum-supremacy/) — En 2019, la computadora cuántica Sycamore de Google, de 53 qubits, alcanzó la supremacía cuántica al completar en 200 segundos una tarea que a una supercomputadora clásica le tomaría 10.000 años.

[^21]: [SemiAnalysis — TSMC Arizona Fab 21 投資規劃](https://www.semianalysis.com/p/tsmc-arizona-1650b-capex) — Plan de inversión de 165.000 millones de dólares de TSMC Arizona Fab 21 en tres fases; Phase 1 (4nm) producción masiva en 2025, Phase 2 (3nm/2nm) en 2027, Phase 3 (2nm/A16) antes de 2030; principio N-2: el extranjero siempre va dos generaciones por detrás de Taiwán.

[^22]: [Digitimes — ESMC Dresden 2027 量產](https://www.digitimes.com.tw/news/esmc-dresden-2027) — TSMC posee 40% de ESMC; la planta de chips automotrices de 28/22/16/12 nanómetros en Dresde, Alemania, instalará equipos en 2025 H2, entrará en producción masiva en 2027 y tendrá una capacidad mensual de unas 40.000 obleas.

[^23]: [天下雜誌 — 台積電水資源消耗](https://www.cw.com.tw/article/5128456) — Las tres grandes áreas de parques científicos de TSMC consumen más de 208.000 toneladas de agua por día; organizaciones ambientales estiman que, tras 2025, con nuevas plantas, el consumo subirá a 770.000 toneladas diarias; TSMC responde que cada gota se usa 3,5 veces, la tasa de reciclaje es de 87% (90% en nuevas plantas) y en 2024 se añadieron 5,54 millones de metros cúbicos de ahorro de agua.
