# Guía de armado de la banca

[Abrir la guía en GitHub Pages](https://kevincastle.github.io/rascador/) · [Repositorio](https://github.com/KevinCastle/rascador)

Abre `index.html` en un navegador con conexión para cargar three.js y sus controles. Conserva los archivos `.js` y `materials.css` en la misma carpeta: contienen los datos de uniones, planos de corte y la lista editable. No necesita instalación ni compilación.

En **Pasos**, el visor muestra las piezas separadas durante la preparación y el armado correspondiente a cada etapa. Las piezas futuras permanecen ocultas. El paso de armado en seco permite alternar la prueba montada y el desarmado. El resaltado verde identifica las piezas que se trabajan; no indica el color del acabado.

Cada paso tiene una ficha con piezas, herramientas, materiales y fijaciones, seguida de las instrucciones y una comprobación antes de continuar. Las fijaciones que el plan no define se indican como pendientes de confirmar. Marca manualmente los pasos completados y las cuatro comprobaciones del proyecto; navegar por la guía no completa pasos.

Las instrucciones de los doce pasos incluyen preparación y orientación de las piezas, seguidas de acciones numeradas. Las medidas se leen desde un borde identificado y los términos de carpintería se explican en contexto. En el frente, el trazado de entradas, agarre y ventilaciones se distingue del corte; sus medidas se actualizan al cambiar el ancho. Los cortes interiores requieren una herramienta adecuada o encargarlos: no se presupone que la circular y el taladro basten para todos los recortes.

El avance, el último paso consultado, las comprobaciones y las medidas elegidas se guardan en `localStorage` con la clave `rascador-progress-v1`. Se restauran al volver al mismo sitio y navegador; no se sincronizan entre dispositivos ni entre la vista previa local y GitHub Pages. Si el navegador bloquea el almacenamiento, la guía sigue funcionando y avisa que el avance solo se conserva durante la sesión abierta. Esta función sustituye la restricción inicial del plan de no guardar estado.

En **Materiales**, pulsa **Editar** para cambiar producto, cantidad, precio total de la fila y enlace de compra; pulsa **Guardar** para aplicar y conservar los cambios. El total no se multiplica por la cantidad. Un precio vacío significa **Por cotizar**; cero es un precio conocido de $0. Marca **Ya lo tengo** para tachar el material y descontarlo solo de **Te falta comprar**. El total del listado conserva todos los precios conocidos; las filas pendientes de cotizar se indican por separado.

Las listas guardadas y respaldos del acabado anterior conservan las ediciones de las demás filas; los cuatro productos retirados se sustituyen por el barniz seleccionado. La lista usa la clave independiente `rascador-materials-v1` y no modifica pasos ni medidas. **Exportar respaldo** descarga los datos aplicados en JSON; **Importar respaldo** los valida y solicita confirmación antes de reemplazar la lista. **Restaurar esta fila** y **Restaurar originales** recuperan el presupuesto inicial. El respaldo solo incluye materiales, no el avance de construcción. Los datos dependen del navegador y del sitio: borrar los datos del navegador también borra la lista local. Exporta antes de cambiar de dispositivo o pasar de localhost a GitHub Pages. Si no se puede guardar, la pantalla avisa y permite exportar los cambios de la sesión.

En **Piezas y cortes**, selecciona una de las 14 piezas desde la lista o los botones de las tablas para verla aislada, girarla y consultar sus medidas. El frente incluye sus escotaduras y perforaciones; el listón L03 se muestra con su largo real de corte de18cm. Las vistas guiadas son independientes de las capas, apertura y separación que ajustes en **Modelo**. En teléfono, los enlaces «Ver este paso/pieza en3D» llevan al visor.

Las piezas aisladas muestran cotas flotantes con flechas que siguen el giro del modelo: dimensiones en cm y espesor del terciado en mm. Puedes ocultarlas. En P03, el selector de detalle permite consultar por separado las entradas, la ranura para la mano y las ventilaciones, para mantener legibles las medidas en pantallas pequeñas. Los valores también están escritos en el panel.

En **Piezas y cortes**, cada espesor tiene su plano de la plancha completa de 122 × 244 cm. Incluye las piezas con medidas finales, sobrantes, pérdidas de sierra y secuencia para separar las franjas y obtener los rectángulos. La plancha se muestra vertical para facilitar la lectura en el panel y en teléfono; las piezas conservan su orientación respecto de la veta. P03 se corta primero como rectángulo: las entradas y perforaciones se hacen en el paso3.

Las distribuciones reservan 3 mm por corte, incluidos los cortes finales contra el sobrante y el ajuste de altura de P08/P10. Comprueba el ancho de tu disco y las dimensiones reales de la plancha antes de trazar. Es una distribución que cabe en todo el rango de la guía, no una promesa de optimización máxima. Piezas, pérdidas y sobrantes se calculan desde los mismos rectángulos, antes de hacer las aberturas.

En **Pasos**, abre **Entiende esta unión en 3D → Ver ubicación y detalle**. Las seis uniones están disponibles desde cualquier paso; el selector distingue las relacionadas e indica dónde se trabajan. Elegir otra unión conserva el paso y tu progreso.

Cada unión abre en **Ubicación en el mueble**, con piezas completas en su posición real y el resto transparente. Después puedes pasar al detalle montado o separado para ver la cola y las fijaciones. La base y el tabique se muestran completos también en el detalle: la cara izquierda del tabique está a35,5cm del extremo izquierdo de la base y deja34cm libres dentro del descanso. Los otros acercamientos identifican sus tramos recortados en el visor y las etiquetas. Volver al paso conserva los ajustes del modelo general.

Las fijaciones son propuestas geométricas para presentar en seco. Sus posiciones y caras de entrada se explican junto al visor. Los tornillos de L01 se intercalan con los de P07 para evitar cruces dentro del tabique. Se proponen 4 × 25 mm desde paredes de 15 mm hacia listones de 19 mm; P08 se encola y prensa, y P10 queda desmontable. L03 conserva sus 18 cm y sobresale 1,9 cm por delante de la repisa después de L02. Estas comprobaciones geométricas no validan la carga del asiento.

La bisagra se muestra separada para explicar sus caras de contacto; el montaje final, rebajes, eje, agujeros y tornillos se ajustan al herraje real. Por eso ese detalle no ofrece una plantilla ni un modo de montaje cerrado. El producto seleccionado es el [pack FIXSER de tres bisagras negras 3 × 3 pulgadas](https://www.sodimac.cl/sodimac-cl/articulo/141360956/Pack-3-Unidades-Bisagra-3X3%27%27-Negro/141360957), de acero no inoxidable, por $4.890 referenciales. Comprueba el largo de sus tornillos contra los 18 mm de la tapa; las cantidades de tornillos de estructura y listones se mantienen. Para encolar, trabaja sobre madera desnuda y sigue los tiempos de tu adhesivo; [Titebond explica la limitación de pegar sobre pintura](https://www.titebond.com/resources/use/glues?handler=Search).

Las medidas provienen de `references/plan-rascador.md`. El bosquejo aportado sirve únicamente como referencia de distribución, no de medidas ni colores. El presupuesto conserva los precios aportados de los materiales vigentes; su subtotal conocido es $102.460 CLP, incluido el barniz Kölor Nogal a $21.990 referenciales, antes de cotizar cojín y velcro. El acabado aprobado el 2026-10-15 usa barniz exterior con tinte para un balcón techado con sol y salpicaduras ocasionales: se retiraron masilla, imprimante, esmalte y poliuretano separado. La madera queda visible. Los pasos 4, 5 y 10 describen lijado y barnizado, dejando sin producto los contactos de cola. Se seleccionó [Kölor Marino Brillante Nogal, 1 galón](https://www.sodimac.cl/sodimac-cl/articulo/140087917/barniz-marino-brillante-1-galones-nogal/140087918): 40 m²/galón/mano, 3 manos exterior y al menos 2 interior. La estimación conservadora de 7 m² por 3 manos y 20 % extra requiere unos 2,4 L, por lo que un galón alcanza teóricamente. Precio web referencial consultado el 2026-10-15; confirmar al comprar. Los tornillos 4 × 40 mm se sustituyeron por 14 paquetes Mamut de 6 unidades a $390 referenciales ($5.460 total); los demás precios y la disponibilidad no se actualizaron. Las fichas provisionales intactas se actualizan a este producto al cargar; las cotizaciones personalizadas se conservan.

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

Rodillo y prensa rápida se muestran en **Conseguir aparte**, fuera del listado editable y de ambos totales. Las listas y respaldos anteriores se adaptan conservando las ediciones de los materiales vigentes.

La brocha ya está disponible y se excluye del presupuesto. Los seis patines PRO RACK seleccionados cuestan $9.540 referenciales en total ($1.590/u). Su ficha indica25×25mm y38mm de alto total; rosca, anclaje a madera y altura libre instalada requieren confirmación. El modelo conserva su separación al suelo como referencia, sin afirmar que corresponda al recorrido real del patín.


## Planos para imprimir y cotizar

El botón **Planos y materiales para imprimir**, bajo el título, abre seis hojas A4: vista general acotada, despiece y posiciones de armado, distribución en ambas planchas (18 y 15 mm), aberturas del frente y materiales genéricos. Usa las medidas actuales de la guía. Los dibujos son esquemas acotados, no plantillas a escala real.

Pulsa **Imprimir / Guardar PDF** y selecciona A4 al 100 %, sin encabezados ni pies del navegador. También funciona la impresión habitual del navegador. La cotización omite marcas, precios, enlaces y textos comerciales personalizados. Mantiene cantidades y especificaciones necesarias; los materiales marcados como disponibles aparecen como aportados por el cliente. Volver a la guía conserva el progreso y los ajustes.

Pruebas: `node --test tests/print.test.cjs` y, con Playwright y el servidor local disponibles, `node tests/print.browser.cjs`. La segunda genera `tests/screenshots/cotizacion-banca.pdf` y verifica impresión A4, parámetros, estado, móvil, teclado y funcionamiento sin el visor 3D.
