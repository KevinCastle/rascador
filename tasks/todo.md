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
