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
- Límites: pruebas con viewport móvil en Chromium, no con teléfono físico ni Safari; no se verifica construcción, resistencia, fijaciones ni precios actuales. La página no está publicada.

## Publicación en GitHub Pages

- [x] Cuenta personal autenticada: KevinCastle. Nombre propuesto disponible: rascador.
- [x] Preparar `.nojekyll`, exclusión de capturas generadas y documentación de publicación desde main/root.
- [x] Obtener excepción explícita a la regla global de no crear commits para el commit inicial y confirmar repositorio público. El usuario autorizó crear commits y aceptó el nombre del repositorio.
- [ ] Crear repositorio, subir el proyecto y activar GitHub Pages.
- [ ] Comprobar despliegue y respuesta HTTP del sitio publicado.
