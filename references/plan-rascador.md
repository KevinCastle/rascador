# Plan: guía 3D de armado — banca de balcón con arenero y rascador

> Este archivo es la **única fuente de verdad**. Medidas en **cm**. No inventes ni redondees medidas: usa las de aquí. Lo que no esté definido está en la sección 11 (Notas abiertas).

## 1. Objetivo

Crear **una sola página web** (`index.html`) con three.js, que se vea bien en **PC y teléfono**, y que sirva como guía de armado de una banca de balcón hecha de terciado, con arenero para gatos, zona de descanso y rascador fijado encima.

- Prioridad 1: **instrucciones de armado** y **lista de cortes** correctas y claras.
- Prioridad 2: modelo 3D **paramétrico** como apoyo visual. No necesita ser fotorrealista.

## 2. Requisitos técnicos

- Un solo archivo HTML con CSS y JS inline. Sin build, sin frameworks, sin imágenes externas.
- three.js **r128** (UMD) con versión fija: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`.
- OrbitControls: `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`.
- No usar `localStorage` ni `sessionStorage`. El estado vive en memoria.
- **Mobile-first** (probar a 360 px de ancho): canvas arriba, panel inferior plegable con pestañas. Orbitar con 1 dedo, zoom con pellizco. Botones de al menos 44 px.
- Tema claro y oscuro (`prefers-color-scheme`).
- Idioma: español neutro (tú). Unidades: cm.
- Geometrías simples (`BoxGeometry`, `CylinderGeometry`, `ExtrudeGeometry`), sin texturas pesadas.

## 3. Convenciones

- Ejes del plano: **X** = ancho (izquierda a derecha), **Y** = fondo (0 = muro, atrás; +Y = frente), **Z** = altura (suelo = 0).
- En three.js: `position.x = X`, `position.y = Z`, `position.z = Y` (el frente mira a la cámara).
- Cada pieza se define por su **esquina mínima** (x, y, z) y su tamaño (dx, dy, dz). Centro = esquina + tamaño / 2.
- Los z de la tabla de piezas valen para `f = 1,8`. Si `f` cambia, suma `(f − 1,8)` al z de todas las piezas salvo las patas.

## 4. Parámetros (controles de la página)

| Parámetro | Símbolo | Default | Rango | Nota |
|---|---|---|---|---|
| Ancho total | W | 135 | 120 – 136 | Límite del balcón: 136 |
| Fondo de la caja | D | 49 | 45 – 53 | La tapa suma 1 cm adelante (50 en total) |
| Altura de las patas | f | 1,8 | 1,8 – 3,0 | Patas regulables |

Valores fijos: grosor base 1,8 · grosor paredes 1,5 · grosor tapa y parte fija 1,8 · alto de paredes 41,4 (es el interior libre).

Derivados (con los defaults):

- Alto total sin cojín: `H = f + 45,0` → **46,8**. Asiento con cojín de 5,5: ~52,3.
- Zona de descanso (interior): x 1,5 – 35,5 (34 de ancho). Tabique: x 35,5 – 37,0.
- Zona de la bandeja (interior): x 37,0 – 88,0 (51). Antecámara (interior): x 88,0 – (W − 1,5) → **45,5** con W = 135.
- Fondo interior: `D − 3` → 46. Alto interior: 41,4.

Cuando cambia W, **solo cambia la antecámara** y las piezas que dependen de W (indicadas en la tabla).

## 5. Piezas del modelo 3D

Valores con W = 135, D = 49, f = 1,8. Colores sugeridos en la sección 9.

| ID | Pieza | Material | x | y | z | dx | dy | dz | Fórmula / nota |
|---|---|---|---|---|---|---|---|---|---|
| P01 | Base | Terciado 18 | 0 | 0 | 1,8 | 135 | 49 | 1,8 | dx = W, dy = D |
| P02 | Pared trasera | Terciado 15 | 0 | 0 | 3,6 | 135 | 1,5 | 41,4 | dx = W |
| P03 | Pared frontal | Terciado 15 | 0 | 47,5 | 3,6 | 135 | 1,5 | 41,4 | y = D − 1,5; con cortes C1–C4 |
| P04 | Lateral izquierdo | Terciado 15 | 0 | 1,5 | 3,6 | 1,5 | 46 | 41,4 | dy = D − 3 |
| P05 | Lateral derecho | Terciado 15 | 133,5 | 1,5 | 3,6 | 1,5 | 46 | 41,4 | x = W − 1,5 |
| P06 | Tabique (descanso / bandeja) | Terciado 15 | 35,5 | 1,5 | 3,6 | 1,5 | 46 | 41,4 | Sólido |
| P07 | Parte fija (bajo el rascador) | Terciado 18 | 0 | 0 | 45,0 | 37 | 50 | 1,8 | dy = D + 1 |
| P08 | Refuerzo bajo P07 | Terciado 18 | 2,0 | 1,5 | 43,2 | 33 | 33 | 1,8 | Interior del descanso mide 34 |
| P09 | Tapa articulada | Terciado 18 | 37,5 | 0 | 45,0 | 97,5 | 50 | 1,8 | dx = W − 37,5, dy = D + 1 |
| P10 | Repisa (palita y bolsas) | Terciado 18 | 99,5 | 1,5 | 30,8 | 34 | 18 | 1,8 | x = W − 35,5 |
| L01 | Listón de apoyo de la tapa | Pino 1×2 | 37,0 | 1,5 | 40,9 | 1,9 | 46 | 4,1 | Cara derecha del tabique, a ras del borde superior |
| L02 | Listón de repisa (fondo) | Pino 1×2 | 99,5 | 1,5 | 26,7 | 34 | 1,9 | 4,1 | x = W − 35,5 |
| L03 | Listón de repisa (lateral) | Pino 1×2 | 131,6 | 3,4 | 26,7 | 1,9 | 16,1 | 4,1 | x = W − 3,4. Corte real: 18; en el modelo 16,1 para no solapar con L02 |
| L04 | Listón de respaldo de bisagras (opcional) | Pino 1×2 | 40 | 1,5 | 40,9 | 60 | 1,9 | 4,1 | Ver Notas abiertas |
| C01 | Cojín | Espuma + funda | 38 | 1 | 46,8 | 96,5 | 48 | 5,5 | Se mueve con la tapa. dx = W − 38,5, dy = D − 1 |
| R01 | Bandeja del arenero | Plástico | 38 | 4,0 | 4,6 | 50 | 41 | 28 | y = D / 2 − 20,5. Lado bajo (x = 88) de 18 de alto |
| R02 | Alfombra atrapa-arena | Goma | 38 | 1,5 | 3,6 | 66 | 46 | 1,0 | y = D / 2 − 23. Parte bajo la bandeja, 16 cm en la antecámara |

**Patas (F01–F06):** cilindros de Ø4 y alto `f`, z = 0. Posiciones (x, y): (4, 4), (W/2, 4), (W − 4, 4), (4, D − 4), (W/2, D − 4), (W − 4, D − 4).

**Bisagras (H01–H03):** 3 bisagras simples de 3 × 3 pulgadas (7,6 × 7,6). Solo visuales: cajas planas de 7,6 × 7,6 × 0,3 en el borde trasero de la tapa, centradas en x = 45, 70 y 95. Eje de giro: paralelo a X, en y = 0, z = 45,0 (borde trasero inferior de la tapa).

**Rascador (R03)** — modelo simple, apoyado sobre P07 (z base = 46,8). Base de 31 × 31 en x 3,0 – 34,0, y 2,5 – 33,5.

| ID | Pieza | x | y | z | dx | dy | dz |
|---|---|---|---|---|---|---|---|
| R03a | Postes bajos (2 cilindros Ø8) | centros (10; 18) y (27; 18) | | 46,8 | | | 30 |
| R03b | Plataforma baja | 1,0 | 0,5 | 76,8 | 35 | 35 | 2 |
| R03c | Poste alto (cilindro Ø8) | centro (18,5; 18) | | 78,8 | | | 30 |
| R03d | Plataforma alta | 1,0 | 0,5 | 108,8 | 35 | 35 | 2 |

Alto total del rascador: 64 (de z 46,8 a 110,8).

### Cortes de la pared frontal (P03)

Medidas desde el borde izquierdo (x) y desde el borde inferior de la pared (z relativo; el borde inferior está en z = 3,6).

| ID | Corte | Tipo | Posición | Medida |
|---|---|---|---|---|
| C1 | Entrada al descanso | Escotadura desde el borde inferior | x 6 – 31 | 25 ancho × 30 alto |
| C2 | Entrada al arenero | Escotadura desde el borde inferior | x 99 – 124 (centro = 111,5 + (W − 135) / 2) | 25 × 30 |
| C3 | Ranura para la mano y ventilación | Muesca desde el borde superior | x 57 – 69 | 12 ancho × 3 profundo |
| C4 | Ventilación baja | 6 orificios Ø2 | centros x = 51, 56, 61, 66, 71, 76; z relativo = 6 (absoluto 9,6) | Pasan por todo el grosor |

Sugerencia: dibujar P03 con `THREE.Shape` y `ExtrudeGeometry`; las escotaduras y la muesca forman parte del contorno, los orificios son `holes`.

### Tapa y cojín

- La tapa gira en torno al eje de las bisagras (ver H01–H03), de 0° a **95°**. Cojín y tapa se mueven juntos (el cojín va fijado con velcro).
- Con el muro detrás, la tapa **no se mantiene abierta sola**: se apoya contra el muro. En la página, el botón "Abrir tapa" anima hasta 95° y avisa de esto.

## 6. Lista de cortes (la página debe calcularla desde los parámetros)

**Plancha de terciado estructural de 18 mm (122 × 244):**

| Pieza | Cant. | Medida |
|---|---|---|
| Base | 1 | W × D (135 × 49) |
| Tapa | 1 | (W − 37,5) × (D + 1) (97,5 × 50) |
| Parte fija | 1 | 37 × (D + 1) (37 × 50) |
| Refuerzo | 1 | 33 × 33 |
| Repisa | 1 | 34 × 18 |

Distribución: 1) tira de D + 1 de largo cruzando los 122: tapa + repisa. 2) otra tira de D + 1: parte fija + refuerzo. 3) del resto: base. La veta exterior corre a lo largo de los 244. Con D hasta 53 sigue cabiendo en una plancha.

**Plancha de terciado estructural de 15 mm (122 × 244):**

| Pieza | Cant. | Medida (largo × alto) |
|---|---|---|
| Pared frontal | 1 | W × 41,4 |
| Pared trasera | 1 | W × 41,4 |
| Laterales | 2 | (D − 3) × 41,4 |
| Tabique | 1 | (D − 3) × 41,4 |

Distribución: dos tiras de 41,4 de ancho a lo largo de la plancha (frontal y trasera); en el sobrante salen las 3 piezas de 46 × 41,4. Sobra ~1,3 m².

**Pino cepillado seco 1×2 (19 × 41 mm), 1 tabla de 3,2 m:** 60, 46, 34 y 18 de largo (una de cada).

Descontar ~3 mm de sierra por corte al trazar.

## 7. Instrucciones de armado (12 pasos)

La página debe mostrar estos pasos con **título, texto, y las piezas resaltadas** (el resto en gris translúcido). Navegación anterior / siguiente y lista de pasos.

1. **Medir y preparar** — Mide el ancho y el fondo reales del balcón, deja 1 cm de margen. Reúne materiales y herramientas. Usa lentes, mascarilla y guantes al cortar y lijar. *(Resaltar: nada, vista general.)*
2. **Cortar las planchas y los listones** — Corta según la sección 6. Usa una guía recta para la sierra circular y descuenta ~3 mm por corte. Mide tu plancha real antes de trazar. *(Resaltar: P01–P10, L01–L04.)*
3. **Cortar la pared frontal** — Marca y corta las dos escotaduras de 25 × 30 desde el borde inferior (x 6–31 y 99–124) y la muesca de 12 × 3 desde el borde superior (x 57–69). Corta con la circular hasta la marca y termina las esquinas con serrucho. Taladra 6 orificios de Ø20 mm a 6 cm del borde inferior. *(Resaltar: P03.)*
4. **Lijar y suavizar** — Lija las zonas ásperas con grano 80, continúa con grano 120 y redondea levemente las aristas expuestas. Se aceptan parches y defectos cosméticos visibles; no se usa masilla. No aceptar capas despegadas ni madera debilitada. El grano final depende del barniz. *(Resaltar: todas las piezas de terciado.)*
5. **Barnizar los cantos y el interior** — Usa el mismo barniz exterior con tinte en los cantos y las caras interiores, incluidos descanso, arenero y antecámara. Protege con cinta y deja madera limpia en todos los contactos de cola. Kölor Marino Nogal: al menos 2 manos en interior con lijado entre capas. Producto listo para usar; confirmar grano y secado en el envase. *(Resaltar: P01–P06, caras interiores.)*
6. **Armar en seco** — Atornilla las patas bajo la base. Une base, paredes y tabique con tornillos, sin cola. Prueba la bandeja y la alfombra adentro, revisa escuadras y holguras, y desarma. *(Resaltar: P01–P06, F01–F06, R01, R02.)*
7. **Armado definitivo de la caja** — Con cola para madera y tornillos de 4 × 40 mm cada ~15 cm, con guía de 3 mm: paredes a la base, y laterales y tabique a las paredes frontal y trasera. Limpia la cola sobrante y mide las diagonales para verificar la escuadra. *(Resaltar: P01–P06.)*
8. **Listones y repisa** — Pega y atornilla el listón de apoyo de la tapa en la cara derecha del tabique (L01), a ras del borde superior. Fija los listones de la repisa (L02, L03) con su borde superior a 27,2 cm sobre la base interior, y apoya la repisa (P10). *(Resaltar: L01–L03, P10.)*
9. **Parte fija y refuerzo** — Pega el refuerzo de 33 × 33 bajo la parte fija, centrado donde irá el rascador. Pega y atornilla la parte fija sobre las paredes de la zona de descanso (x 0–37). Deja 0,5 cm de holgura con la tapa. *(Resaltar: P07, P08.)*
10. **Acabado** — Lija y retira restos de cola. Prueba el tinte en un sobrante. Usa barniz exterior con tinte apto para aplicación directa en madera, sin imprimante, esmalte ni poliuretano separado. Barniza todas las caras y cantos expuestos, parte inferior de la base, ambas caras de tapa y repisa, listones y zona bajo el rascador. Completa 3 manos en exterior y al menos 2 en interior con lijado entre capas, considerando las ya aplicadas en el paso 5. Mantén limpios los contactos de cola pendientes y deja curar según la etiqueta. *(Resaltar: exterior de toda la caja.)*
11. **Tapa, bisagras y cojín** — Ubica la tapa con 0,5 cm de holgura. Instala las 3 bisagras simples en el borde trasero (x 45, 70 y 95). Fija el cojín a la tapa con velcro adhesivo. *(Resaltar: P09, H01–H03, C01.)*
12. **Rascador y puesta en marcha** — Centra el rascador (base de 31 × 31) sobre la parte fija y fíjalo con 4 pernos a través de la parte fija y el refuerzo, con tuercas ciegas. Si la base del rascador es cerrada y no puedes llegar a ella, usa tornillos largos desde abajo. Coloca la bandeja y la alfombra, y prueba que la gata entre por la abertura. *(Resaltar: R03, R01, R02.)*

## 8. Funciones de la página

- **Vistas predefinidas:** isométrica, frontal, planta, lateral.
- **Explosión:** deslizador de 0 a 100 %. Desplazamientos máximos (dx, dy, dz): patas (0, 0, −12) · pared trasera (0, −18, 0) · pared frontal (0, 30, 0) · lateral izquierdo (−30, 0, 0) · lateral derecho (30, 0, 0) · tabique (0, 0, 30) · listones y repisa (0, 0, 12) · parte fija (0, 0, 40) · refuerzo (0, 0, 25) · tapa (0, 0, 55) · cojín (0, 0, 75) · bandeja y alfombra (0, 0, 30) · rascador (0, 0, 95). La base no se mueve.
- **Transparencia:** alternar para ver el interior.
- **Capas:** mostrar u ocultar estructura, tapa, cojín, rascador, bandeja y alfombra, listones.
- **Botón "Abrir tapa"** con animación.
- **Parámetros:** deslizadores de W, D y f. El modelo, las cotas y la lista de cortes se actualizan al instante.
- **Cotas:** alternar etiquetas con ancho total, fondo, alto, y los anchos interiores de descanso, bandeja y antecámara.
- **Pestañas:** Modelo · Pasos · Piezas y cortes · Materiales.

## 9. Colores sugeridos

| Elemento | Color |
|---|---|
| Terciado a la vista (interior, cantos) | `#D8B98A` |
| Madera barnizada con tinte (tono café referencial) | `#6F4E37` |
| Cojín | `#7A7F85` |
| Metal (bisagras, patas) | `#B8BEC4` |
| Alfombra | `#E8A0B4` |
| Bandeja | `#E9ECEF` |
| Rascador (postes) | `#C9A66B` |
| Rascador (plataformas) | `#D8C3A5` |

Piezas no resaltadas en un paso: gris translúcido (opacidad ~0,15).

## 10. Materiales (pestaña "Materiales")

| Ítem | Cantidad |
|---|---|
| Terciado estructural 15 mm (122 × 244) | 1 |
| Terciado estructural 18 mm (122 × 244) | 1 |
| Pino cepillado seco 1×2, 3,2 m | 1 |
| Bisagras simples FIXSER de acero negro 3 × 3 pulgadas | 1 pack de 3; no inoxidable |
| Patines PRO RACK zincados con goma | 6; alto total 38 mm, separación instalada y anclaje por confirmar |
| Tornillos para madera 4 × 40 mm | ~80 |
| Tornillos para madera 4 × 25 mm | ~20 |
| Pernos coche inox 1/4 × 2-1/2 pulgadas, con golillas y tuercas ciegas | 4 |
| Cola fría para madera (que diga resistente al agua) | 1 |
| Lijas grano 80, 120 y final/entre capas según barniz | Cantidad por confirmar con la ficha |
| Barniz exterior con tinte | Kölor Marino Brillante Nogal, 1 galón (aprox. 3,8 L) |
| Brocha | Ya disponible; fuera del presupuesto |
| Rodillo de espuma | Conseguir aparte si se necesita; fuera del presupuesto |
| Prensa rápida | Conseguir aparte; fuera del presupuesto |
| Cojín de ~97 × 48 × 5–6, con velcro adhesivo | 1 |

Herramientas que se asumen: sierra circular, taladro, serrucho, escuadra, broca de pala de Ø20 mm, brocas guía de 3 y 4 mm.

## Acabado acordado el 2026-10-15

Balcón techado orientado al norte, con sol y gotas/salpicaduras ocasionales, sin agua acumulada. Se acepta la apariencia del terciado. Un único barniz exterior con tinte, apto para exposición solar y aplicación directa sobre madera, sustituye los cuatro productos de acabado anteriores. No se barniza el rascador reutilizado. El color del modelo sigue siendo orientativo.

Estimación conservadora para W = 135 / D = 49: ambas caras y cantos rectangulares de P01–P10 suman 6,76408 m²; listones incluidos L04 suman 0,195832 m²: total 6,959912 m², aproximadamente 7 m²/mano. No se descuentan recortes ni contactos pegados, lo que deja margen. A 10 m²/L/mano, 3 manos y 20 % extra requieren 2,51 L; 4 manos requieren 3,34 L. Buscar 1 galón ≈ 3,8 L; confirmar con el producto real antes de comprar. Las manos reales en interior/exterior se ajustan a su ficha. Diluyente, grano de lija y compatibilidad del rodillo también pendientes.

Producto seleccionado: [Kölor Barniz Marino Brillante Nogal, 1 galón](https://www.sodimac.cl/sodimac-cl/articulo/140087917/barniz-marino-brillante-1-galones-nogal/140087918). Precio referencial $21.990, confirmar al comprar. La ficha declara 40 m²/galón/mano, 3 manos exterior y al menos 2 interior, lijado entre capas, listo para usar (dilución con agua solo para pistola). Para 7 m² × 3 manos: 0,525 galón; con 20 % de margen, 0,63 galón ≈ 2,4 L. Un galón alcanza según este rendimiento teórico. Confirmar grano de lija y curado en envase. No limpiar con paño húmedo antes de 2 semanas. La estimación de 3–4 manos del párrafo anterior era preliminar; prevalecen las indicaciones de este producto.

## 11. Notas abiertas (no inventes: muéstralas como avisos en la página)

1. **Bisagras:** son simples, no mantienen la tapa abierta. El montaje exacto se define al armar en seco. El listón L04 es opcional como superficie de apoyo.
2. **Rascador:** su base mide 31 × 31, pero su grosor y si es hueca o cerrada no se conocen. Los pernos de 6,3 cm solo alcanzan si la base es delgada (hasta ~1,7 cm).
3. **Valores asumidos:** grosor de la alfombra (1,0), posición de la bandeja (centrada, pegada al lado del tabique) y forma de los postes del rascador.
4. **Espacio real:** medir de nuevo el ancho del balcón antes de cortar. Si es menor que 135, reducir W; solo cambia la antecámara.
5. **Seguridad de la gata:** las tuercas de los pernos quedan dentro de la zona de descanso; usar tuercas ciegas.

## 12. Criterios de aceptación

- Con los defaults, las medidas exteriores son **135 × 50 × 46,8** (sin cojín) y todas las piezas de la sección 5 aparecen en su posición.
- Cambiar W a 134 modifica solo la antecámara (44,5) y las piezas que dependen de W; la lista de cortes se actualiza.
- La tapa abre y cierra sin atravesar otras piezas; el cojín la acompaña.
- La explosión separa las piezas sin superposiciones confusas y vuelve a 0 sin errores.
- Los 12 pasos están completos, con piezas resaltadas.
- Se usa sin problemas a 360 px de ancho, con gestos táctiles, y no requiere conexión aparte del CDN.
- Ninguna medida se inventa: todo sale de este archivo.

Nota de actualización de patines: los valores f=1,8 cm y rango1,8–3cm del modelo siguen siendo referencias geométricas, no especificaciones del producto nuevo. Confirmar la altura instalada y su fijación compatible con madera de18mm antes de perforar. No cambiar cortes de tableros a partir del alto total38mm de la ficha.
