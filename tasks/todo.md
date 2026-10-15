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

## Materiales editables con guardado local

Diseño aprobado: editar producto, cantidad, total de la fila y enlace; marcar «Ya lo tengo», tachar y excluir del pendiente. Mantener total conocido del listado y pendiente de compra, sin tratar «Por cotizar» como gratis. Guardar automáticamente en este navegador, con respaldo JSON exportable/importable y restauración de valores originales. No hay sincronización entre dispositivos; localhost y GitHub Pages guardan listas separadas. Sin nuevas dependencias, cuentas, commits ni publicación.

Plan de ejecución: `materials-store.js` contiene validación, totales y persistencia versionada independiente de progreso; `materials-ui.js` y `materials.css` presentan tarjetas y formulario accesible, integrados en `index.html`. Se conservan notas técnicas y categorías originales. Clave estable por nombre original de material, inmutable en el editor. No multiplicar total por cantidad: el usuario introduce el total de la fila. URL vacía o HTTP(S), precio entero CLP no negativo o null para pendiente. Texto renderizado como texto, nunca HTML importado. Importación validada completa antes de sustituir, con confirmación; restauración también confirmada. Fallo de almacenamiento se informa y permite exportar los cambios en memoria.

- [x] Pruebas de datos primero: actualización/persistencia, totales y cotizaciones, importar/exportar, rechazo atómico, corrupción y almacenamiento bloqueado.
- [x] Implementar store y controles de edición, estado y respaldo; mantener materiales disponibles sin 3D.
- [x] Comprobar en navegador recarga, edición, tachado reversible, totales, respaldo/restauración, errores, teclado y lectura a360/488/1440px.
- [x] Revisar cambios, ejecutar regresiones pertinentes y documentar limitaciones.

Main posee store, pruebas y documentación; implementador posee UI/CSS e integración en index. Aceptación: cambios persisten tras recarga; marcar existente reduce solo el pendiente; precio cero y pendiente se distinguen; archivos inválidos no alteran datos; ninguna modificación afecta pasos, geometría o progreso.

Resultado: 20 tarjetas editables con Guardar/Cancelar/Escape, casilla reversible, totales separados, cotizaciones pendientes y restauración por fila o global. Respaldo JSON valida versión, identificación única/completa de filas, tipos, límites y protocolos de enlaces antes de sustituir la lista. Precio original pendiente se representa como null; cero introducido por el usuario es conocido. Clave independiente `rascador-materials-v1`. No se cambió el presupuesto base ni el avance de construcción.

Verificación: pruebas de store fallaron primero por ausencia del módulo y luego pasaron5/5; datos/geometría/store18/18 PASS. Suite de materiales PASS (recarga, totales, rechazo de enlace peligroso y JSON inválido, cancelación, restauración por fila/global, texto literal, respaldo, progreso independiente, teclado, almacenamiento bloqueado y sin3D). Suite de progreso existente PASS. Capturas inspeccionadas a360/488/1440px y oscuro; corregido contraste de Guardar al pasar el cursor y fuente móvil16px. Revisión independiente sin defectos. `git diff --check` PASS. Sin teléfono físico ni Safari; sin sincronización entre pestañas/dispositivos; datos vinculados al navegador y sitio, respaldo manual disponible. Sin commit ni publicación de esta mejora.

## Acabado simplificado aprobado — conversación lateral, 2026-10-15

Alcance explícito: balcón techado orientado al norte, sol y salpicaduras ocasionales sin agua acumulada; madera visible y defectos cosméticos aceptados. Sustituir masilla, imprimante, esmalte y poliuretano separado por un barniz exterior con tinte, producto/precio pendientes. Mantener lijado y contactos de cola limpios. Actualizar guía, fichas, materiales, plan y presupuesto del repositorio, sin tocar originales externos ni el trabajo previo ajeno a este alcance. Sin commit ni push.

Plan: (1) aceptación de nuevos pasos/listado y migración antes de editar; (2) actualizar contenido y migrar exclusivamente el conjunto anterior de cuatro acabados, conservando ediciones de las otras filas; (3) actualizar pruebas que esperan el listado anterior y comprobar datos/sintaxis/diff; (4) documentar estimación de barniz y límites de verificación. Cantidad preliminar: área conservadora6,96m² incluyendo ambas caras/cantos/listones y L04, sin descontar recortes ni contactos de cola; a10m²/L/mano y20%extra: 3manos2,51L, 4manos3,34L. Buscar1galón≈3,8L, confirmar con ficha real antes de comprar.

Resultado de este alcance: lista vigente17filas y subtotal conocido$127.847 (se retiran$62.460); barniz y cojín/velcro por cotizar. Actualizados pasos4/5/10, sus herramientas y comprobaciones, documentos del repositorio y expectativas de pruebas. Las cuatro filas retiradas quedan identificadas como LEGACY en el presupuesto de referencia. No se alteraron geometría ni precios de las demás filas. Migración limitada reconoce el conjunto completo anterior y conserva sus ediciones/estado en las filas vigentes; respaldos incompletos siguen rechazándose. Los archivos originales de Downloads no se editaron.

Verificación: aceptación del acabado y migración fallaron antes del cambio, luego datos/materiales/geometría20/20PASS; sintaxis inline y módulo PASS; git diff --check PASS. La suite materials.browser.cjs se actualizó a17filas y los nuevos totales, pero Chromium no pudo arrancar por permiso de MachPortRendezvous en el sandbox de esta conversación lateral; no se solicitó ampliación de permisos. No se afirma nueva validación visual. Cambios sin commit ni publicación.

## Producto de barniz seleccionado — conversación lateral, 2026-10-15

Petición: añadir el Kölor Marino Brillante Nogal del enlace140087918 y aconsejar posibles ahorros. Agregado al listado y documentos:1galón≈3,8L, precio referencial$21.990 visible en la ficha indexada de Sodimac (otras versiones muestran$26.490; confirmar al comprar). Subtotal base$149.837, faltan cojín/velcro y posibles fijaciones adicionales. Se actualizaron instrucciones a3manos exterior/al menos2interior, lijado entre capas, listo para usar y espera de2semanas antes de limpiar con paño húmedo. No aplicar recetas de dilución del ejemplo previo SIPA.

Las listas guardadas con la fila provisional intacta reciben el producto seleccionado conservando su marca «Ya lo tengo». Se preservan cotizaciones o productos personalizados; no se toca el almacenamiento del navegador directamente. Prueba de esa transición: RED antes de implementar y GREEN después; datos/materiales13/13PASS y diff--checkPASS. Navegador no repetido por la restricción ya documentada; sin cambios de layout. Sin commit ni publicación. No se retiró ningún otro material: rodillo prescindible si aplica con brocha, prensa obtenible prestada, cantidades de lija y cajas de tornillos ajustables tras revisar necesidades; son propuestas pendientes del usuario.

## Rodillo y prensa a conseguir aparte

Petición: retirar rodillo y prensa del listado de compra y dejarlos como elementos que se conseguirán aparte; consultar compatibilidad de un enlace de tornillos4×40mm. Alcance: quitar las dos filas de `Guide.materials`, sección visible «Conseguir aparte», subtotal base$127.360 ($149.837 menos$22.477), sincronizar referencias y aceptar listas guardadas/respaldos anteriores conservando las demás ediciones. Mantener el acabado vigente y todo trabajo previo de conversaciones laterales. No sustituir aún el producto de tornillos ni su precio: el usuario preguntó por su compatibilidad.

Verificación: prueba de migración RED→GREEN, incluyendo transición combinada del antiguo acabado y las herramientas retiradas; datos/materiales14/14PASS. Suite de navegador de materiales PASS con15filas, subtotal nuevo, sección aparte, edición, persistencia, respaldo/restauración, teclado, móvil y almacenamiento bloqueado. `git diff --check` PASS. Sin commit ni publicación.

Ficha indexada oficial Sodimac112857521: Mamut tirafondo para madera, diámetro4mm, largo40mm, cabeza plana, acero zincado brillante,6unidades por paquete. Coincide con el tipo y medida de las uniones indicadas4×40; para la estimación de80tornillos se requieren14paquetes=84. No se verificó resistencia estructural ni una clasificación exterior del recubrimiento; no reemplaza tornillos4×25 ni los de bisagras. URL: https://www.sodimac.cl/sodimac-cl/articulo/112857519/Tornillo-Tirafondo-Cabeza-Plana-Madera-40-mm-4-mm-6-unidad%28es%29/112857521 . Precio no cambiado.

## Sustituir tornillos4×40 por paquetes Mamut

Petición aprobada: reemplazar la caja Turbo Screw144u por el enlace Mamut112857521. Aplicado:14paquetes×6=84tornillos; precio referencial$390/paquete, total$5.460; ahorro$6.530 y subtotal base$120.830. Fuente de precio: mismo SKU vendido por Sodimac en Falabella https://www.falabella.com/falabella-cl/product/112857519/Tornillo-Tirafondo-Madera-40-mm-4-mm-6-unidad%28es%29/112857521 . Sodimac confirma especificaciones pero el texto accesible no muestra precio. Se deja explícito confirmar precio/stock al comprar.

Migración de filas guardadas o respaldos: sustituir la caja anterior identificada por producto+URL, conservar owned y todas las demás filas; productos personalizados distintos siguen intactos. Documentación/presupuesto y expectativas de subtotal sincronizados. Prueba de migración RED→GREEN; datos/materiales15/15PASS y diff--checkPASS. Sin commit ni publicación.

## Brocha existente y patines PRO RACK

Solicitud: sacar brocha por estar disponible y reemplazar elevadores anteriores por patín110305638. Aplicado:14filas, sección «Ya tienes: brocha», seis patines a$1.590/u=$9.540. Ahorro frente a patas anteriores$2.400 más brocha$4.690; subtotal base$113.740. La conversación previa sobre bisagras fue una evaluación y aún no sustituyó esa fila; no se incorpora aquí ese ahorro hipotético.

Ficha oficial consultada: https://www.sodimac.cl/sodimac-cl/articulo/110305628/Patin-zincado-con-goma/110305638 . Acero,25×25mm, alto total38mm, nivelable. No constan rosca, rango instalado, herrajes incluidos ni capacidad de carga; no inferir anclaje directo a terciado ni separación real al suelo. Materiales, instrucciones de armado en seco y panel Modelo explican comprobar fijación y altura instalada. Se conservan cortes y geometría de referencia, sin trasladar38mm de alto total al parámetro f.

Migración limitada elimina brocha y sustituye solo la ficha del elevador anterior conservando owned; otras ediciones y productos personalizados intactos. Datos y migraciones16/16PASS tras RED→GREEN; diff--checkPASS. Documentos del repositorio sincronizados. Sin commit ni publicación.

## Corrección: aplicar el pack de bisagras solicitado

El usuario señaló que la evaluación anterior no se había llevado al listado. Sustituidas las tres Scanavini por1pack FIXSER de3bisagras negras3×3pulgadas, acero no inoxidable, SKU141360957 a$4.890referenciales (ficha Sodimac verificada). Ahorro$11.280; subtotal base$102.460 tras los cambios anteriores. Notas conservan comprobar longitud de tornillos respecto de la tapa18mm; no se reducen tornillos4×40/4×25. Documentos y referencias actualizados, retirando la ficha Scanavini como producto vigente.

La migración reconoce la fila anterior por producto+URL y la sustituye en guardados y respaldos conservando owned y las demás ediciones. Productos alternativos personalizados intactos. Prueba RED→GREEN; datos/materiales17/17PASS y diff--checkPASS. Lección registrada. Sin commit ni publicación.

## Guardar todo el avance de materiales

Solicitud explícita de commit de todos los cambios pendientes. Incluye lista editable con guardado local y respaldos, migraciones de catálogo, acabado con barniz, sustituciones de tornillos/patines/bisagras, herramientas aparte/existentes y documentos/pruebas asociados. Validación previa:25/25pruebas de datos/geometría/materiales PASS; navegador general PASS a escritorio/360px,12pasos, parámetros,3D, presupuesto, tema oscuro y fallbackCDN, sin errores de página. Suite específica de materiales PASS tras el último cambio de bisagras. Diff sin errores de espacios. Sin push ni publicación solicitados.

## Versión imprimible para cotizar

Solicitud: imprimir cortes, planos, medidas y materiales genéricos, sin marcas, datos comerciales, precios ni enlaces. Plan presentado:6páginasA4 (vista general, despiece, plancha18mm, plancha15mm, frente, materiales). Usar W/D/f actuales y geometría Guide/GuideCutting; impresión vectorial y tinta negra, sin depender de WebGL. Especificaciones necesarias y cantidades conservadas, sin textos de producto personalizados. Marcar materiales aportados por cliente según «Ya lo tengo»; brocha propia, rodillo/prensa aparte y accesorios existentes separados. No se omiten materiales necesarios del despiece.

Archivos: print.js/print.css para documento puro; index.html para abrir/cerrar vista previa e imprimir/antes de imprimir; tests/print.test.cjs y tests/print.browser.cjs; README y registro. Sin dependencias nuevas para usuarios. No modificar progreso ni preferencias del visor. Main posee integración/pruebas/documentos; implementador posee print.js/css.

- [x] Comprobar datos de cotización y exclusión de marcas/precios/enlaces con pruebas antes de implementar.
- [x] Generar6páginas con planos/cotas SVG, despiece y materiales; integrar vista previa e impresión/PDF.
- [x] Verificar A4 real,6páginas sin recortes, medidas dinámicas, privacidad comercial, móvil/teclado y fallback sin3D.
- [x] Revisar PDF renderizado y registrar resultados.

Criterios: ambas planchas122×244cm reservan3mm por corte; cada pieza tiene ID/cantidad/espesor/medidas; frente muestra entradas25×30,ranura12×3 y6orificiosØ20mm con referencias inequívocas; tablas coinciden con geometría actual. Aclarar esquemas no a escala, altura de patas referencial y fijaciones pendientes. Cotización contempla cortes/armado/acabado y adaptación de accesorios del cliente; no promete carga admisible ni montaje no confirmado.


Verificación realizada: 27/27 pruebas de datos, cortes, uniones, materiales e impresión PASS; navegador general PASS (escritorio/360 px y fallback), suite imprimible PASS (seis hojas, parámetros actuales, propiedad, conservación de estado, teclado/móvil, impresión nativa y sin 3D). PDF generado y revisado visualmente en sus seis páginas: A4, sin recortes, sin anotaciones de enlaces ni contenido comercial. Límites del área de contenido comprobados en medidas predeterminadas y extremos permitidos. No se probó una impresora física. Se corrigieron el desborde de dos hojas y las interferencias de estilos globales en cotas y tablas. Sin dependencias de producción adicionales; no existe harness ni script de auditoría en este repositorio.

Publicación autorizada explícitamente por el usuario: realizar commit y push después de estas comprobaciones y verificar el despliegue de GitHub Pages. El resultado se informa al entregar.
