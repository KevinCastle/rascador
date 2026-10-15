# Guía de armado de la banca

[Abrir la guía en GitHub Pages](https://kevincastle.github.io/rascador/) · [Repositorio](https://github.com/KevinCastle/rascador)

Abre `index.html` en un navegador con conexión para cargar three.js y sus controles. Conserva `joinery.js` y `cutting.js` en la misma carpeta: contienen los datos de uniones y planos de corte. No necesita instalación ni compilación.

En **Pasos**, el visor muestra las piezas separadas durante la preparación y el armado correspondiente a cada etapa. Las piezas futuras permanecen ocultas. El paso de armado en seco permite alternar la prueba montada y el desarmado. El resaltado verde identifica las piezas que se trabajan; no indica el color del acabado.

Cada paso tiene una ficha con piezas, herramientas, materiales y fijaciones, seguida de las instrucciones y una comprobación antes de continuar. Las fijaciones que el plan no define se indican como pendientes de confirmar. Marca manualmente los pasos completados y las cuatro comprobaciones del proyecto; navegar por la guía no completa pasos.

Las instrucciones de los doce pasos incluyen preparación y orientación de las piezas, seguidas de acciones numeradas. Las medidas se leen desde un borde identificado y los términos de carpintería se explican en contexto. En el frente, el trazado de entradas, agarre y ventilaciones se distingue del corte; sus medidas se actualizan al cambiar el ancho. Los cortes interiores requieren una herramienta adecuada o encargarlos: no se presupone que la circular y el taladro basten para todos los recortes.

El avance, el último paso consultado, las comprobaciones y las medidas elegidas se guardan en `localStorage` con la clave `rascador-progress-v1`. Se restauran al volver al mismo sitio y navegador; no se sincronizan entre dispositivos ni entre la vista previa local y GitHub Pages. Si el navegador bloquea el almacenamiento, la guía sigue funcionando y avisa que el avance solo se conserva durante la sesión abierta. Esta función sustituye la restricción inicial del plan de no guardar estado.

En **Piezas y cortes**, selecciona una de las 14 piezas desde la lista o los botones de las tablas para verla aislada, girarla y consultar sus medidas. El frente incluye sus escotaduras y perforaciones; el listón L03 se muestra con su largo real de corte de18cm. Las vistas guiadas son independientes de las capas, apertura y separación que ajustes en **Modelo**. En teléfono, los enlaces «Ver este paso/pieza en3D» llevan al visor.

Las piezas aisladas muestran cotas flotantes con flechas que siguen el giro del modelo: dimensiones en cm y espesor del terciado en mm. Puedes ocultarlas. En P03, el selector de detalle permite consultar por separado las entradas, la ranura para la mano y las ventilaciones, para mantener legibles las medidas en pantallas pequeñas. Los valores también están escritos en el panel.

En **Piezas y cortes**, cada espesor tiene su plano de la plancha completa de 122 × 244 cm. Incluye las piezas con medidas finales, sobrantes, pérdidas de sierra y secuencia para separar las franjas y obtener los rectángulos. La plancha se muestra vertical para facilitar la lectura en el panel y en teléfono; las piezas conservan su orientación respecto de la veta. P03 se corta primero como rectángulo: las entradas y perforaciones se hacen en el paso3.

Las distribuciones reservan 3 mm por corte, incluidos los cortes finales contra el sobrante y el ajuste de altura de P08/P10. Comprueba el ancho de tu disco y las dimensiones reales de la plancha antes de trazar. Es una distribución que cabe en todo el rango de la guía, no una promesa de optimización máxima. Piezas, pérdidas y sobrantes se calculan desde los mismos rectángulos, antes de hacer las aberturas.

En **Pasos**, abre **Entiende esta unión en 3D → Ver ubicación y detalle**. Las seis uniones están disponibles desde cualquier paso; el selector distingue las relacionadas e indica dónde se trabajan. Elegir otra unión conserva el paso y tu progreso.

Cada unión abre en **Ubicación en el mueble**, con piezas completas en su posición real y el resto transparente. Después puedes pasar al detalle montado o separado para ver la cola y las fijaciones. La base y el tabique se muestran completos también en el detalle: la cara izquierda del tabique está a35,5cm del extremo izquierdo de la base y deja34cm libres dentro del descanso. Los otros acercamientos identifican sus tramos recortados en el visor y las etiquetas. Volver al paso conserva los ajustes del modelo general.

Las fijaciones son propuestas geométricas para presentar en seco. Sus posiciones y caras de entrada se explican junto al visor. Los tornillos de L01 se intercalan con los de P07 para evitar cruces dentro del tabique. Se proponen 4 × 25 mm desde paredes de 15 mm hacia listones de 19 mm; P08 se encola y prensa, y P10 queda desmontable. L03 conserva sus 18 cm y sobresale 1,9 cm por delante de la repisa después de L02. Estas comprobaciones geométricas no validan la carga del asiento.

La bisagra se muestra separada para explicar sus caras de contacto; el montaje final, rebajes, eje, agujeros y tornillos se ajustan al herraje real. Por eso ese detalle no ofrece una plantilla ni un modo de montaje cerrado. La ficha de [Scanavini](https://tiendascanavini.cl/ficha/67/bisagras-acero-inoxidable-30x30-sin-rodamientos) confirma el formato 3 × 3, pero no aporta una plantilla dimensionada. Para encolar, trabaja sobre madera desnuda y sigue los tiempos de tu adhesivo; [Titebond explica la limitación de pegar sobre pintura](https://www.titebond.com/resources/use/glues?handler=Search).

Las medidas provienen de `references/plan-rascador.md`. El bosquejo aportado sirve únicamente como referencia de distribución, no de medidas ni colores. El presupuesto conserva los precios aportados; su suma es $190.307 CLP, sin cojín ni velcro cotizados. No se comprobaron precios ni disponibilidad actuales.

Como alternativa en Vercel, usa el preset **Other**, activa Override de Build Command y déjalo vacío. El directorio raíz se sirve como salida estática al no existir `public`. No hay variables de entorno. [Documentación oficial de Vercel](https://vercel.com/docs/builds/configure-a-build#skip-build-step).

## GitHub Pages

Publicado desde **main / (root)**, con **Deploy from a branch** en Settings → Pages. El archivo `.nojekyll` permite servir directamente el HTML, sin procesamiento de Jekyll. Las actualizaciones publicadas en `main` actualizarán el sitio. [Documentación oficial de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).

La guía permite explorar variaciones, pero no valida la resistencia de la banca para dos adultos. El montaje real de bisagras y su despeje contra el muro, la fijación del rascador, el ancho real del balcón y la resistencia al agua de la cola siguen pendientes de comprobación.

## Verificación

Datos y medidas: `node --test tests/data.test.cjs`.

Planos de corte: `node --test tests/cutting.test.cjs` comprueba las153combinaciones enteras de ancho/fondo admitidas, medidas sin giro, límites, cortes finales, partición de área y ausencia de superposiciones. `node tests/cutting.browser.cjs` verifica ambos planos a1440/488/360px, etiquetas, medidas dinámicas, selección de piezas por teclado, modo oscuro y disponibilidad sin3D. Acepta `GUIDE_URL`.

Uniones: `node --test tests/joinery.test.cjs` verifica puntas contenidas, recorridos en madera y ausencia de cruces entre tornillos de distintos detalles en cuatro tamaños. `node tests/joints.browser.cjs` recorre las seis escenas a 1440 y 360 px, controles, armado en seco, retorno, independencia del progreso y funcionamiento sin CDN o sin datos de uniones. También acepta `GUIDE_URL`.

Navegador: con Playwright disponible, sirve esta carpeta (`python3 -m http.server 8765 --bind 127.0.0.1`) y ejecuta `node tests/browser.cjs`. La suite genera capturas en `tests/screenshots/` y prueba escritorio1440×900, ancho360, doce pasos, parámetros, tapa, despiece, capas y modo sin conexión a los CDN. No equivale a probar en un teléfono físico.

Vistas guiadas: `node tests/assembly.browser.cjs` comprueba el armado progresivo, la prueba en seco, los cortes, las14piezas aisladas, medidas paramétricas y separación de estados entre pestañas. Ambas suites aceptan `GUIDE_URL` para probar un sitio publicado.

Cotas flotantes: `node tests/dimensions.browser.cjs` comprueba las14piezas, los detalles del frente, actualización de medidas, giro, vistas y etiquetas legibles en escritorio y360px. También acepta `GUIDE_URL`.

Progreso y fichas: `node tests/progress.browser.cjs` verifica las12fichas, completado manual, pendientes, recarga y nueva pestaña, restauración de medidas, validación de datos y funcionamiento sin almacenamiento ni CDN. Genera capturas de escritorio/360px y admite `GUIDE_URL`.

El registro de implementación y las verificaciones realizadas están en `tasks/todo.md`. GitHub Pages se actualiza cuando los cambios llegan a `main` en GitHub.
