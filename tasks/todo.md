# Guía de armado — plan de implementación

Objetivo: entregar un único `index.html` local con instrucciones prioritarias y modelo three.js r128 de apoyo, según `references/plan-rascador.md`.

## Alcance y archivos

- `index.html`: CSS, datos, cálculos, interfaz accesible y geometría inline; sin build ni almacenamiento persistente.
- `references/`: copias sin modificar del plan y presupuesto aportados.
- `tests/data.test.cjs`: medidas, cortes dependientes y suma del presupuesto.
- `tests/browser.cjs`: comprobación de navegación, WebGL y adaptación a 360 px.

## Decisiones

- Diseño ya acordado por el usuario: usar el plan como especificación; bosquejo solo para interpretar distribución.
- Acabado café, cojín gris y rascador neutro. Vista 3D arriba en móvil y panel de instrucciones plegable; en escritorio dos columnas.
- Pasos como pestaña inicial; Modelo, Piezas y cortes y Materiales completan el panel.
- Total calculado $190.307, sin cojín. Precios aportados, no cotización actual. Notas técnicas del plan prevalecen sobre notas antiguas del presupuesto.
- Conservar rangos solicitados, avisando incompatibilidad de alfombra para D<49 y posible interferencia de repisa/bandeja para W<123,5.
- No inventar grosor de base del rascador, resistencia de carga ni despeje de bisagras. Apertura95° visual sin muro físico modelado; montaje y espacio a comprobar.
- Dependencias: solo los dos CDN especificados. Las instrucciones siguen disponibles si falla WebGL/CDN.
- Entrega local en archivo, sin commits ni publicación que requiera commits automáticos.
- Actualización del usuario: se permite build/React y futura publicación en Vercel. Se mantiene HTML+three.js porque cubre el alcance sin instalación; la restricción original deja de ser obligatoria.

## Ejecución y aceptación

- [x] Leer fuentes y comprobar suma de materiales.
- [x] Revisar geometría y registrar contradicciones sin modificar medidas.
- [x] Escribir pruebas de datos y comprobar su fallo por ausencia de implementación.
- [x] Implementar archivo único: 12 pasos íntegros, resaltado, cortes dinámicos, presupuesto y pendientes.
- [x] Implementar modelo con escotaduras, ventilaciones, capas, vistas, explosión, cotas, tapa y cojín juntos.
- [x] Ejecutar `node --test tests/data.test.cjs`: defaults135×50×46,8; W134 antecámara44,5; extremos; total190307.
- [x] Verificar navegador escritorio y360px: sin overflow horizontal, sin errores JavaScript, navegación de12pasos, parámetros, apertura y capas; capturas claro/oscuro.
- [x] Revisión final independiente, corregir problemas y registrar limitaciones.

Sin harness existente: no hay `package.json` ni comando `harness:audit` aplicable.

## Evidencia de revisión

- Pruebas de datos: 4/4 pasan. Navegador Chromium: recorrido completo de pasos, medidas, capas, cotas, vistas, presupuesto, teclado en pestañas, plegado móvil y fallback al bloquear los CDN.
- Capturas inspeccionadas en escritorio1440×900 y ancho360, claro/oscuro. Sin desbordamiento horizontal en las cuatro pestañas ni errores de JavaScript.
- Se reprodujo y corrigió desplazamiento local de la explosión con tapa abierta. La regresión comprueba desplazamiento global vertical de55/75cm a95° y reversibilidad; pasa.
- Revisión independiente: sin hallazgos pendientes tras corregir giro/explosión.
- Inspección visual detectó y corrigió colores demasiado claros; se ajustaron conversión sRGB e iluminación.
- Encuadre automático verificado con capturas de despiece completo en escritorio y360px. Suite final de navegador PASS, incluyendo giro y explosión simultáneos; espera al fin exacto de la animación antes de medir posiciones.
- Límites: pruebas con viewport móvil en Chromium, no con teléfono físico ni Safari; no se verifica construcción, resistencia, fijaciones ni precios actuales. La publicación posterior se registra abajo.

## Publicación en GitHub Pages

- [x] Cuenta personal autenticada: KevinCastle. Nombre propuesto disponible: rascador.
- [x] Preparar `.nojekyll`, exclusión de capturas generadas y documentación de publicación desde main/root.
- [x] Obtener excepción explícita a la regla global de no crear commits para el commit inicial y confirmar repositorio público. El usuario autorizó crear commits y aceptó el nombre del repositorio.
- [x] Crear repositorio, subir el proyecto y activar GitHub Pages.
- [x] Comprobar despliegue y respuesta HTTP del sitio publicado.

Repositorio público: https://github.com/KevinCastle/rascador

Sitio: https://kevincastle.github.io/rascador/

Verificación del 15 de octubre de 2026: despliegue inicial exitoso (run38792694525), respuesta HTTP200 y suite completa de navegador PASS contra la URL pública (PC,360px,12pasos,parámetros,tapa/despiece,capas,cotas,presupuesto,teclado,modo oscuro y fallback de CDN). Datos4/4 PASS. El test de fallback bloquea únicamente los dos CDN para permitir verificar también una URL alojada mediante HTTPS.

## Vistas 3D por paso y pieza

Solicitud: mostrar cómo progresa el armado y permitir inspeccionar las piezas/cortes en 3D. Sustituye el resaltado del conjunto completo en Pasos; mantiene las medidas originales.

Archivos: `index.html` (interfaz, escenas, geometría y cámara); `tests/assembly.browser.cjs` (regresiones de los modos); `README.md` y este registro. Sin dependencias nuevas.

Plan:
- [x] Inspeccionar visor y registrar prueba que falla porque aparecen piezas futuras en el paso7.
- [x] Implementar escenas deterministas: vista previa; piezas cortadas separadas; frente aislado; lijado y sellado; prueba en seco/desarmado; caja definitiva; listones/repisa; parte fija/refuerzo; acabado; tapa/cojín; conjunto final.
- [x] Selector accesible y botones en tablas para inspeccionar P01–P10/L01–L04 con medidas, espesor y cortes. L03 aislado mide18cm, aunque montado representa16,1cm.
- [x] Separar poses/visibilidad de Pasos/Cortes respecto de capas, explosión y tapa de Modelo. Encuadrar únicamente piezas visibles. Conservar instrucciones y navegación sin WebGL.
- [x] Verificar progresión, regreso entre pasos, piezas aisladas, parámetros, transición entre pestañas y360px con capturas.
- [x] Revisión independiente, pruebas existentes y nuevas, commit/push autorizado y comprobar despliegue Pages.

Criterios: piezas futuras ausentes; contexto previamente montado visible; resaltado del trabajo actual; dimensiones sin inventar; piezas pequeñas encuadradas; acceso al visor desde navegación móvil. Publicar sobre el sitio existente tras validar.

Validación local de esta mejora: pruebas de datos4/4 PASS; suite original de navegador PASS; nueva suite de armado PASS (14piezas, frente sin/con cortes, L03 de18cm, prueba en seco, capas/apertura independientes, medidas y navegación360px). Revisión independiente sin defectos importantes. Se corrigieron según capturas el ángulo de las vistas interiores, el resaltado y la superposición de etiquetas; prueba automática de etiquetas sin solapamientos en escritorio y360px.

Publicación de vistas guiadas: commit17c3e24; GitHub Pages run38798091315 SUCCESS. Suite de armado ejecutada contra https://kevincastle.github.io/rascador/: PASS, incluidos escritorio/360px, etiquetas sin superposición y las14piezas aisladas.

## Cotas flotantes de piezas

Solicitud: mostrar tamaños con flechas sobre la pieza que se inspecciona.

Alcance: `index.html` (cotas SVG vinculadas a la geometría, controles del detalle frontal y adaptación móvil), `tests/dimensions.browser.cjs`, README y este registro. Reutilizar Three.js y los datos actuales, sin dependencias nuevas.

- [x] Inspeccionar geometría, cámara y etiquetas existentes; presentar el enfoque.
- [x] Añadir tres cotas de dimensiones reales por pieza, visibles por defecto en Piezas y cortes, con flechas y unidades.
- [x] Añadir detalle seleccionable del frente: entradas25×30cm, ranura12×3cm y6orificiosØ20mm; mantener la vista general despejada.
- [x] Mantener anclaje al girar/acercar; actualizar parámetros y cambiar piezas sin etiquetas residuales. No bloquear gestos del visor.
- [x] Verificar tamaños,14piezas, cambios de parámetros, órbita, vistas y legibilidad escritorio/360px; ejecutar regresiones y revisión.

Aceptación: valores coherentes con el plan y geometría (L03=18cm), etiquetas dentro del visor sin solapamientos en vistas iniciales de escritorio/móvil, ausencia fuera de Piezas y cortes, lectura textual disponible si falla WebGL.

Validación local: nueva suite de cotas PASS (14piezas, unidades, detalle frontal, órbita, zoom, cuatro vistas, teclado, parámetros y etiquetas sin solapamientos en1440/360px). Suites existentes de armado y navegador PASS; datos4/4 PASS; diff sin errores de espacios. Capturas inspeccionadas en claro/oscuro, incluidas P01/P03/P09/L03 y los tres detalles frontales. Revisión independiente sin hallazgos accionables. No se probó teléfono físico ni Safari.

Actualización: el usuario autorizó expresamente hacer commit de los cambios. Se prepara el commit y push a main para actualizar GitHub Pages; el resultado del despliegue se comprobará antes de confirmar la publicación.

## Progreso guardado y fichas de armado

Objetivo aprobado por el usuario: recomendaciones1y2; los detalles3D de uniones quedan para una mejora posterior.

Diseño: guardar localmente pasos completados, último paso consultado, cuatro comprobaciones pendientes y dimensionesW/D/f; restaurar antes de construir la interfaz. Casillas manuales independientes de la navegación, contador de completados y lista con marcas. Aviso claro de guardado en este navegador, sin sincronización; si el almacenamiento está bloqueado, seguir en memoria y avisar. El requisito original de no usar localStorage queda sustituido por esta solicitud.

Fichas por paso: piezas con nombres, herramientas/materiales de uso, fijaciones y comprobaciones concretas. Mantener los textos del plan y sus medidas dinámicas. No asignar arbitrariamente tornillos4×25mm a bisagras/listones ni cantidades no definidas; mostrar lo pendiente de confirmar. Pendientes: medidas reales del balcón, cola resistente al agua, base/pernos del rascador y montaje/apoyo de bisagras.

Archivos y dependencias: `index.html` para datos estructurados, almacenamiento validado y UI; `tests/progress.browser.cjs` para restauración/casillas/fallback y vista móvil; `tests/data.test.cjs` para cobertura de fichas si procede; README y este registro. Sin nuevas dependencias, sin cambios al modelo3D.

- [x] Inspeccionar fuentes y estructura; presentar el plan acotado.
- [x] Preparar prueba que reproduzca ausencia de progreso y fichas.
- [x] Implementar fichas en los12pasos y comprobaciones del proyecto.
- [x] Implementar persistencia versionada/validada, último paso y medidas; degradación a memoria sin perder las instrucciones.
- [x] Verificar recarga, nueva pestaña, navegación sin autocompletar, desmarcado, datos corruptos/fuera de rango, errores de almacenamiento y ausencia de WebGL.
- [x] Revisar visualmente escritorio1440px/móvil360px en claro/oscuro; regresiones de visor/cotas; revisión independiente.
- [x] Actualizar documentación y preparar commit/publicación con la autorización de la sesión; verificar el despliegue antes de confirmar al usuario.

Aceptación: progreso real distinto de paso visitado; selección inicial restaurada y coherente con visor; fichas completas y legibles sin inventar fijaciones; datos locales nunca se insertan comoHTML; la guía funciona aunque falle el almacenamiento/CDN. Cada casilla accesible por teclado y táctil. No sincronización entre dispositivos ni detalles nuevos de uniones3D en este cambio.

Validación local: nueva suite de progreso PASS, incluyendo12fichas, recarga/nueva pestaña, cuatro pendientes, paso/medidas, completado/desmarcado, teclado, datos inválidos, lectura/escritura bloqueadas y uso sinCDN. Regresiones de navegador, armado y cotas PASS; datos4/4 PASS. Capturas inspeccionadas1440/360px claro/oscuro. Revisión independiente sin bloqueos. Se reprodujo y corrigió navegación móvil que dejaba el título fuera de vista (y=−395px): los controles explícitos ahora enfocan y desplazan al nuevo título; test PASS. No probado en teléfono físico ni Safari.

La publicación se realiza desde main mediante el despliegue existente de GitHub Pages; se comprobará su resultado y la suite de progreso contra la URL pública antes de confirmar la entrega.

## Uniones explicadas en3D

Solicitud aprobada: acercamientos de encuentros, cola, listones y bisagras; el usuario autoriza proponer posiciones por geometría. Las posiciones nuevas se identifican como propuestas de presentación en seco, sin atribuirles validación estructural.

Plan presentado: detalles independientes del modelo general, accesibles desde pasos6/7/8/9/11. Seis uniones: base–tabique, pared–lateral, apoyoL01, esquina de repisaL02/L03, parte fija/refuerzo, bisagra. Controles unión montada/separada, cola y fijaciones, retorno al paso. Texto con piezas, cara de entrada, referencias y medidas; leyenda de cola y flechas. Sin guardar estado transitorio ni alterar progreso/capas/cotas.

Decisiones: tornillos4×40 para caja y parte fija según plan; propuesta4×25 desde tablero15mm hacia listón19mm (10mm de entrada nominal, sin capacidad de carga calculada). P08 se encola/prensa, sin atravesar36mm con tornillos40mm. P10 se apoya: no añadir tornillos innecesarios. L03 conserva corte18cm, arranca trasL02 y sobresale1,9cm de P10; actualizar representación general y notas para eliminar la antigua abreviación16,1cm. Bisagra ilustrativa sobre caras amplias, no sobre canto estrecho; centros45/70/95 del plan. Agujeros y rebajes se trasladan del herraje real: no inventar plantilla ni longitudes de tornillos de bisagra.

Archivos: `joinery.js` (datos geométricos y propuestas puras); `index.html` (UI, escenas, cámara, integración y notasL03); tests de geometría/uniones; README y este registro. Sin librerías adicionales. Guardar fuentes consultadas y diferenciar evidencia de decisiones propias.

- [x] Inspeccionar código, plan, presupuesto y referencias del fabricante; definir esquema de integración.
- [x] Crear datos de seis detalles con sólidos, caras de cola, tornillos y referencias de medida.
- [x] Añadir interfaz y escenas con selección, separación, identificación, regreso y modo sinWebGL.
- [x] Verificar recorridos de fijaciones, contactos, dimensiones y márgenes en tamaños extremos; mantener cotas/estado existentes.
- [x] Probar seis escenas y controles, escritorio1440px/móvil360px, sinCDN, sin datos de detalle, regresiones y revisión independiente.
- [x] Documentar resultados y entregar cambios locales sin commits, conforme a las instrucciones AGENTS.md más recientes.

Validación local (2026-10-15): datos y geometría 9/9 PASS. Suites de navegador general, armado, cotas, progreso y uniones PASS. La comprobación de fijaciones abarca recorridos, puntas contenidas y posibles cruces entre detalles en coordenadas del mueble, en cuatro tamaños; los tornillos L01 se intercalaron con P07 para eliminar la interferencia detectada. El selector del test de armado se acotó al enlace del paso porque ahora existe además el enlace del detalle.

Revisión independiente: corregidos foco al regresar y conservación de montaje/cola/fijaciones al reencuadrar; cubiertos por la suite de uniones. Capturas inspeccionadas en escritorio y360px: etiquetas, cola, separación, bisagra y encuadres. Sin errores de página en las suites. `git diff --check` PASS. No probado en teléfono físico ni Safari; no hay harness ni comando de auditoría en este proyecto. La geometría no constituye un cálculo de resistencia.

Entrega local: no se crearon commits ni se hizo push. Las instrucciones actuales del usuario reservan los commits al usuario y sustituyen la autorización anterior. Esta mejora aún no está publicada en GitHub Pages.

## Instrucciones claras para construir

Solicitud: reescribir los doce pasos para una persona que no interpreta coordenadas ni vocabulario de carpintería. El ejemplo del frente mezcla trazado, cortes y perforaciones sin explicar cómo orientar el tablero.

Plan: mantener los doce pasos, medidas dinámicas y funciones existentes. En `index.html`, presentar resumen, orientación de las piezas y acciones numeradas; revisar también herramientas, fijaciones, consejos y comprobaciones. Explicar términos en contexto, nombrar la pieza junto a su código y acompañar cada medida de unidad y borde de referencia. Distinguir el trazado del corte y las propuestas de fijación de aquello que aún depende del herraje real. Sin rediseñar el mueble ni publicar.

- [x] Reescribir y renderizar instrucciones de los doce pasos.
- [x] Revisar coherencia con el plan, uniones y herramientas necesarias.
- [x] Comprobar medidas dinámicas del frente y referencias de orientación.
- [x] Revisar lectura en escritorio/360px, navegación, progreso y funcionamiento sin 3D.
- [x] Registrar resultados y entregar vista previa local, sin commits.

Aceptación: el paso del frente permite identificar arriba, abajo e izquierda y trazar cada abertura sin interpretar ejes; cada acción indica qué hacer y sobre qué pieza; no se pierden dimensiones ni se inventan fijaciones pendientes. Listas legibles en móvil, contenido accesible sin depender del visor y progreso compatible.

Resultado: `Guide.instructions(index,W,D,f)` genera preparación y acciones numeradas para los doce pasos. Fichas, consejos y descripción del visor usan el mismo vocabulario. Se explican canto, a ras, escuadra, holgura, agujero guía, diámetro y rebaje. Los recortes interiores requieren una herramienta apta o encargarlos; se eliminó la indicación ambigua de llevar la circular hasta una marca interior. Se aclara marcar P07 antes de voltearlo y dejar madera limpia para pegar L04 después del acabado.

Revisión independiente: se aclaró que la alfombra de 66 × 46 cm no cabe entera solo en la antecámara; el paso 6 pide comprobar si se extiende bajo la bandeja o se adapta cuando su material lo permita, y el paso 12 remite a ese ajuste. Geometría y presupuesto no modificados.

Verificación (2026-10-15): datos y geometría 10/10 PASS, incluyendo medidas del frente a anchos120/134/135/136. Suites navegador general, progreso y uniones PASS. La suite de progreso comprueba listas en los doce pasos, medidas restauradas, navegación, almacenamiento y uso sin3D. Capturas del frente inspeccionadas a1440/360px: listas legibles y sin desbordamiento. `git diff --check` PASS. Sin teléfono físico ni Safari; sin commits ni publicación.

## Guardar el avance en commits

El usuario pidió expresamente realizar commits de todo el avance, como excepción a la instrucción anterior de reservarle los commits. Se agrupan el código y sus pruebas en un commit, y la documentación y lecciones en otro. Antes de guardar: datos y geometría 10/10 PASS y `git diff --check` PASS. Esta solicitud no incluye push ni publicación; quedan dos mejoras posteriores por definir.

## Planos de corte de ambas planchas

Solicitud: añadir distribución de la plancha de15mm y hacer más claros ambos planos, piezas, medidas y cortes. Diseño presentado: plancha122×244cm, dos franjas por espesor, piezas identificadas con sus medidas, cotas exteriores, sobrantes diferenciados, pérdida de3mm y secuencia de corte. Vista vertical en pantallas pequeñas, textos y tablas asociados al plano. Mantener dimensiones ajustables, orientación de veta y acceso existente al3D.

Distribución15mm: primera franja P02 + P04 + P05; segunda P03 + P06. Ambas de41,4cm. Distribución18mm: primera franja P01 de fondoD; segunda P09 + P07 + P08 + P10 con fondoD+1. Contabilizar también cortes finales contra sobrantes y recortes de altura de P08/P10. El dibujo representa rectángulos antes de abrir las entradas del frente.

Archivos: `cutting.js` para geometría pura de piezas/cortes/sobrantes; `index.html` para diagramasSVG, texto y adaptación a pantalla; pruebas geométricas y navegador; README y este registro. Sin dependencias nuevas. Main posee datos/pruebas/documentación; implementador posee index.

- [x] Crear distribuciones y comprobar cabida, pérdidas y ausencia de superposiciones en todo el rango permitido.
- [x] Renderizar ambos planos con medidas, leyenda, sobrantes y pasos de corte legibles.
- [x] Verificar medidas dinámicas, tablas/3D, teclado, móvil360/488px, escritorio y modo oscuro.
- [x] Revisar capturas, registrar resultados y entregar local sin publicar.

Aceptación: aparecen las10piezas correctas (cinco por plancha), cada una una sola vez; medidas coinciden con Piezas y cortes; el plano incluye122/244cm, pérdida de3mm y sobrantes; ninguna pieza se gira respecto de la distribución acordada; textos y cotas legibles sin desbordar la página; guía usable aunque no cargue3D. No se promete optimización global ni dimensiones reales de fábrica.

Verificación: datos/geometría12/12 PASS, incluyendo153combinaciones de ancho/fondo. Piezas+cortes+sobrantes suman el área exacta de la plancha sin superposiciones. Suite de planos PASS a1440/488/360px: etiquetas dentro delSVG y sin colisiones, parámetros, selección por teclado, tema oscuro, sinCDN y ausencia de cutting.js. Regresión de armado/piezas PASS. Capturas inspeccionadas; corregido contraste de la llamada P10 en oscuro y añadido contexto al sobrante que contiene esa llamada. Revisión independiente sin defectos materiales. `git diff --check` PASS; sin teléfono físico ni Safari.

Se mantuvo la plancha vertical también en escritorio para mejorar la legibilidad dentro del panel; la orientación del dibujo se explica como medida vertical × horizontal. Corrección contable frente al esquema anterior: las bandas de18mm y sus cortes ocupan99,6cm, y la segunda banda y sus cortes202,7cm con medidas iniciales. La distribución15mm conserva todas las piezas paralelas a la veta. Entrega local, sin commits ni push para esta mejora.

## Corregir el contexto de las uniones

Reporte: en el paso7 solo aparecen dos opciones y el tabique parece ir al centro de la base. Reproducción en Chromium488×853: selector filtra por paso; detalle base dibuja P01 de16×46cm y P06 de12cm de alto, centrado en el recorte. El modelo completo ya tiene las medidas correctas. La apariencia del recorte no comunica su escala ni su ubicación.

Plan presentado: selector de seis uniones con pasos relacionados; abrir primero una vista de ubicación usando piezas completas del modelo, con selección opaca y contexto translúcido. Luego ofrecer detalle montado/separado. En base–tabique usar piezas completas también en el detalle (P01 W×D; P06 empieza a35,5cm y mide41,4cm de alto). En los otros detalles identificar los tramos en visor y etiquetas. Eliminar duplicado «(tramo)». Mantener paso/progreso, ajustes generales y límites de bisagras.

Archivos: main `joinery.js` para corregir base y registrar orígenes globales; implementador `index.html` para selector/contexto/clones/controles; main pruebas y documentación. Sin dependencias ni cambios al diseño físico.

- [x] Corregir geometría de base y comprobar equivalencia local/global de fijaciones.
- [x] Mostrar las seis uniones y abrir en ubicación con geometría real, sin heredar estado del visor.
- [x] Identificar recortes y comprobar retorno, selección y controles de detalles.
- [x] Revisar capturas488/360/escritorio y pruebas de geometría/estado; registrar resultados.

Verificación: datos/geometría13/13 PASS. Suites de uniones, progreso, armado y cotas PASS. Se comprobaron las seis opciones en los doce pasos, posiciones reales de contexto, geometría independiente, cambios de modo, retorno y controles; capturas revisadas a1440/488/360px y tema oscuro. Se corrigió la superposición de etiquetas de apoyos en móvil. Revisión independiente sin defectos materiales.

La regresión de navegación reveló un fallo intermitente anterior: una proyección no finita durante el movimiento de cámara dejaba las cotas sin extremos y detenía el renderizado. Ahora se omite ese fotograma; una prueba fuerza la proyección inválida y comprueba recuperación y ausencia de errores. Armado y cotas volvieron a pasar después del arreglo. Sin teléfono físico ni Safari. Entrega local, sin commit ni publicación.

Fuentes: plan y presupuesto locales para espesores, cantidades existentes y centros de bisagras. Scanavini https://tiendascanavini.cl/ficha/67/bisagras-acero-inoxidable-30x30-sin-rodamientos confirma bisagra3×3inox sinrodamientos; página sin plantilla dimensionada de agujeros. Titebond https://www.titebond.com/resources/use/glues?handler=Search respalda encolado sobre madera desnuda; seguir etiqueta de la cola comprada para presión/secado, sin trasladar tiempos de otra marca. Las separaciones y posiciones nuevas son propuestas geométricas propias, no recomendaciones estructurales de esos fabricantes.
