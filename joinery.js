/* Reference joinery details. Coordinates use the plan axes: X width, Y depth, Z up (cm). */
(function (root) {
  'use strict';
  const round = n => Math.round(n * 100) / 100;
  const fmt = n => String(round(n)).replace('.', ',');
  const spaced = (length, inset = 4, maximumGap = 15) => {
    const span = length - 2 * inset;
    const intervals = Math.max(1, Math.ceil(span / maximumGap));
    return Array.from({ length: intervals + 1 }, (_, i) => round(inset + span * i / intervals));
  };
  const board = (id, label, min, size, move, cropped = false) => ({ id, label, min, size, move, cropped });
  const screw = (id, owner, receiver, start, direction, length) => ({
    id, owner, receiver, start, direction, length, diameter: 0.4,
    label: `Tornillo 4 × ${length * 10} mm`
  });
  const common = 'Ubicaciones propuestas para presentar y marcar en seco. Comprueba el espesor real, las escuadras y la salida de cada punta antes de atornillar.';
  function create(W = 135, D = 49, f = 1.8) {
    const supportLength = D - 3;
    const alongSupport = spaced(supportLength);
    const fromBack = alongSupport.map(n => fmt(n + 1.5)).join(' · ');
    const cleatPoints = alongSupport.slice(1).map((n, i) => round((alongSupport[i] + n) / 2));
    const cleatFromBack = cleatPoints.map(n => fmt(n + 1.5)).join(' · ');
    return [
      {
        id: 'base', title: 'Base y tabique', steps: [5, 6],
        summary: 'El tabique se apoya sobre la base. Los tornillos entran desde abajo, centrados en su canto de 15 mm.',
        notes: [common, 'En el armado en seco no apliques cola. En el definitivo, extiende una película fina solo en la superficie de contacto.', 'Sujeta el tabique a escuadra y realiza una guía centrada. Un tornillo de 40 mm atraviesa los 18 mm de la base y entra 22 mm en el tabique.', 'Se muestra un tramo de la base y del tabique. Esta unión no certifica la carga del asiento.'],
        positions: [`Centro del canto de P06: x = 36,25 cm desde el extremo izquierdo del mueble.`, `Centros de los tornillos desde el borde trasero de la base: y = ${fromBack} cm.`, 'Primero y último a 4 cm de los extremos del tabique; separación entre centros de hasta 15 cm.'],
        boards: [board('P01', 'Base · 18 mm (tramo)', [0, 0, 0], [16, supportLength, 1.8], [0, 0, -5], true), board('P06', 'Tabique · 15 mm (tramo)', [7.25, 0, 1.8], [1.5, supportLength, 12], [0, 0, 6], true)],
        glue: [{ owner: 'P06', min: [7.25, 0, 1.77], size: [1.5, supportLength, 0.03] }],
        fasteners: alongSupport.map((y, i) => ({ ...screw(`B${i + 1}`, 'P01', 'P06', [8, y, 0], [0, 0, 1], 4), globalStart: [36.25, round(y + 1.5), f] })),
        camera: [30, 40, -26]
      },
      {
        id: 'corner', title: 'Esquina de las paredes', steps: [5, 6],
        summary: 'La trasera cubre el canto del lateral. Atornilla desde la cara exterior de la trasera hacia ese canto.',
        notes: [common, 'La cola va en el canto de 15 mm que toca la trasera, únicamente durante el armado definitivo.', 'El tornillo de 40 mm cruza 15 mm de trasera y entra 25 mm en el lateral. Sujétalo a escuadra antes de perforar.', 'El ejemplo corresponde a P02 y P04. En el frente, adapta la distribución únicamente a las zonas macizas: nunca sobre entradas, ranura ni orificios.', 'Se muestran tramos de ambas paredes; los puntos no representan todas las fijaciones del mueble.'],
        positions: ['Eje de tornillos de esta esquina: x = 0,75 cm desde el extremo izquierdo de P02.', 'Alturas: 4 · 19 · 34 cm desde el borde inferior de las paredes.', `Alturas respecto del suelo con tus patas: ${[4, 19, 34].map(n => fmt(f + 1.8 + n)).join(' · ')} cm.`],
        boards: [board('P02', 'Trasera · 15 mm (tramo)', [0, 0, 0], [16, 1.5, 41.4], [0, -6, 0], true), board('P04', 'Lateral izquierdo · 15 mm (tramo)', [0, 1.5, 0], [1.5, 14, 41.4], [6, 0, 0], true)],
        glue: [{ owner: 'P04', min: [0, 1.47, 0], size: [1.5, 0.03, 41.4] }],
        fasteners: [4, 19, 34].map((z, i) => ({ ...screw(`C${i + 1}`, 'P02', 'P04', [0.75, 0, z], [0, 1, 0], 4), globalStart: [0.75, 0, round(f + 1.8 + z)] })),
        camera: [-28, -40, 24]
      },
      {
        id: 'cleat', title: 'Listón de apoyo de la tapa', steps: [7],
        summary: 'L01 se fija a la cara derecha del tabique, con su borde superior a ras de P06.',
        notes: [common, 'Atornilla desde el lado de descanso: primero cruzas el terciado y después entras en el pino.', 'Propuesta: tornillos de 4 × 25 mm. Cruzan 15 mm de tabique, penetran 10 mm en el listón y dejan 9 mm hasta su cara opuesta.', 'No uses aquí los tornillos de 40 mm: atravesarían los 34 mm conjuntos. Verifica las medidas reales y evita hundir demasiado la cabeza.', 'La cola cubre la cara de contacto de 4,1 cm del listón. El tablero se muestra recortado para ver la unión.'],
        positions: [`L01: ${fmt(supportLength)} cm de largo, desde y = 1,5 hasta y = ${fmt(D - 1.5)} cm.`, `Tornillos: y = ${cleatFromBack} cm desde el borde trasero del mueble; alternados entre los tornillos que entran desde arriba por P07. No alinees ambos patrones.`, `Centros a 2,05 cm bajo el borde superior del tabique (z = ${fmt(f + 41.15)} cm desde el suelo).`],
        boards: [board('P06', 'Tabique · 15 mm (tramo superior)', [0, 0, 0], [1.5, supportLength, 12], [-6, 0, 0], true), board('L01', 'Apoyo de la tapa · pino 19 × 41 mm', [1.5, 0, 7.9], [1.9, supportLength, 4.1], [6, 0, 0])],
        glue: [{ owner: 'P06', min: [1.5, 0, 7.9], size: [0.03, supportLength, 4.1] }],
        fasteners: cleatPoints.map((y, i) => ({ ...screw(`L${i + 1}`, 'P06', 'L01', [0, y, 9.95], [1, 0, 0], 2.5), globalStart: [35.5, round(y + 1.5), round(f + 41.15)] })),
        camera: [-34, 40, 24]
      },
      {
        id: 'shelf', title: 'Listones y repisa desmontable', steps: [7],
        summary: 'L02 y L03 forman dos apoyos sin cruzarse. P10 descansa encima y se puede levantar para limpiar.',
        notes: [common, 'Atornilla los listones desde el exterior de las paredes con 4 × 25 mm: 15 mm de pared y 10 mm de entrada en el pino.', 'La cola solo va entre paredes y listones. No pegues la repisa si quieres retirarla.', 'L03 conserva su corte real de 18 cm: comienza después de L02 y sobresale 1,9 cm por delante de la repisa.', 'Comprueba con tu bandeja real que la repisa deje espacio antes de fijar la altura. Las paredes se muestran recortadas.'],
        positions: ['Borde superior de ambos listones: 27,2 cm sobre la cara interior de la base.', `L02: centros a 4 · 17 · 30 cm de su extremo izquierdo (x = ${[W - 31.5, W - 18.5, W - 5.5].map(fmt).join(' · ')} cm desde el extremo izquierdo del mueble).`, 'L03: centros a 4 y 14 cm de su extremo trasero (y = 7,4 y 17,4 cm desde la trasera del mueble).', 'En ambos listones, centra los tornillos a 2,05 cm bajo su borde superior.'],
        boards: [board('P02', 'Trasera · 15 mm (tramo)', [0, 0, 0], [35.5, 1.5, 12], [0, -6, 0], true), board('P05', 'Lateral derecho · 15 mm (tramo)', [34, 1.5, 0], [1.5, 19.9, 12], [6, 0, 0], true), board('L02', 'Listón trasero · 34 cm', [0, 1.5, 5], [34, 1.9, 4.1], [0, 0, -3]), board('L03', 'Listón lateral · corte real de 18 cm', [32.1, 3.4, 5], [1.9, 18, 4.1], [0, 0, -3]), board('P10', 'Repisa · 34 × 18 × 1,8 cm', [0, 1.5, 9.1], [34, 18, 1.8], [0, 0, 8])],
        glue: [{ owner: 'P02', min: [0, 1.5, 5], size: [34, 0.03, 4.1] }, { owner: 'P05', min: [33.97, 3.4, 5], size: [0.03, 18, 4.1] }],
        fasteners: [...[4, 17, 30].map((x, i) => ({ ...screw(`S${i + 1}`, 'P02', 'L02', [x, 0, 7.05], [0, 1, 0], 2.5), globalStart: [round(W - 35.5 + x), 0, round(f + 26.95)] })), ...[7.4, 17.4].map((y, i) => ({ ...screw(`S${i + 4}`, 'P05', 'L03', [35.5, y, 7.05], [-1, 0, 0], 2.5), globalStart: [W, y, round(f + 26.95)] }))],
        camera: [40, 50, 35]
      },
      {
        id: 'fixed', title: 'Parte fija, refuerzo y holgura', steps: [8],
        summary: 'P07 se fija al canto superior del tabique. P08 se encola por debajo y se mantiene prensado durante el secado.',
        notes: [common, 'Aplica cola entre P07 y P06, y en la superficie completa entre P07 y P08. Sigue el tiempo de prensado indicado en tu adhesivo.', 'En P07 → P06, los tornillos de 40 mm cruzan 18 mm y penetran 22 mm en el tabique.', 'No uses 40 mm para unir solo P07 y P08: suman 36 mm y la punta saldría. Este detalle propone cola y prensas para el refuerzo.', 'La tapa móvil P09 se muestra solo como referencia de la holgura; no se pega ni se atornilla a la parte fija.', 'Las fijaciones del rascador deben definirse con su base real. Este detalle no valida la capacidad para dos adultos.'],
        positions: ['P08: x = 2 a 35 cm; y = 1,5 a 34,5 cm, medidos desde la esquina trasera izquierda de P07.', 'Tornillos sobre P06: x = 36,25 cm desde el extremo izquierdo de P07.', `Centros: y = ${fromBack} cm desde el borde trasero de P07.`, 'P07 termina en x = 37 cm y P09 comienza en x = 37,5 cm: deja 5 mm de separación.'],
        boards: [board('P07', 'Parte fija · 18 mm', [0, 0, 1.8], [37, D + 1, 1.8], [0, 0, 9]), board('P08', 'Refuerzo · 33 × 33 × 1,8 cm', [2, 1.5, 0], [33, 33, 1.8], [0, 0, 4]), board('P06', 'Tabique · 15 mm (tramo superior)', [35.5, 1.5, -10.2], [1.5, supportLength, 12], [0, 0, -5], true), board('P09', 'Tapa móvil · tramo de referencia', [37.5, 0, 1.8], [12, D + 1, 1.8], [6, 0, 0], true)],
        glue: [{ owner: 'P07', min: [2, 1.5, 1.77], size: [33, 33, 0.03] }, { owner: 'P06', min: [35.5, 1.5, 1.8], size: [1.5, supportLength, 0.03] }],
        fasteners: alongSupport.map((y, i) => ({ ...screw(`F${i + 1}`, 'P07', 'P06', [36.25, y + 1.5, 3.6], [0, 0, -1], 4), globalStart: [36.25, round(y + 1.5), round(f + 45)] })),
        camera: [45, 55, -35]
      },
      {
        id: 'hinge', title: 'Presentación de las bisagras', steps: [10],
        summary: 'Presenta una hoja contra la cara exterior de la trasera y la otra bajo la tapa. Ajusta el eje y cualquier rebaje con la bisagra real.',
        notes: ['Esquema de presentación: el herraje está separado hacia atrás para ver sus dos hojas; no representa su asiento definitivo ni un rebaje ya resuelto.', 'Una hoja se prevé contra la cara exterior de P02 y la otra contra la cara inferior de P09. Su encaje o rebaje depende del espesor y del eje de la bisagra real.', 'Las hojas se muestran con espesor ilustrativo de 2 mm. Su grosor, eje, agujeros y recorrido se deben comprobar con el herraje comprado.', 'No se dibujan posiciones de taladros ni tornillos de bisagra. Transfiere los agujeros desde la pieza real, después de presentar y comprobar la apertura.', 'En P09 elige tornillos cuya penetración sea menor que los 18 mm de madera restantes después de cualquier rebaje. No uses directamente tornillos de 25 o 40 mm en la tapa sola.', 'L04 es opcional en el proyecto general y se propone aquí como respaldo interior de la trasera. Se muestra solo su unión encolada: define su fijación mecánica y el anclaje de la bisagra con el herraje real.', 'Ninguna hoja metálica lleva cola. Las bisagras simples no mantienen abierta la tapa; comprueba su apoyo y el recorrido antes de soltarla.'],
        positions: ['Centros propuestos de las tres bisagras: x = 45 · 70 · 95 cm desde el extremo izquierdo del mueble.', 'L04: de x = 40 a 100 cm, contra la cara interior de la trasera y a ras de su borde superior.', 'El detalle representa la bisagra central, H02; las posiciones de los agujeros quedan pendientes del herraje real.'],
        boards: [board('P02', 'Trasera · 15 mm (tramo superior)', [0, 0, 0], [16, 1.5, 10], [0, -3, 0], true), board('P09', 'Tapa móvil · 18 mm (tramo)', [0, 0, 10], [16, 12, 1.8], [0, 0, 8], true), board('L04', 'Respaldo de bisagras · pino 19 × 41 mm (tramo)', [0, 1.5, 5.9], [16, 1.9, 4.1], [0, 5, 0], true)],
        glue: [{ owner: 'L04', min: [0, 1.47, 5.9], size: [16, 0.03, 4.1] }],
        fasteners: [],
        hardware: [{ id: 'H02a', label: 'Hoja vertical · presentación separada', min: [4.2, -4.3, 5.9], size: [7.6, 0.2, 3.8], move: [0, 0, 0], color: '#AAB5BC' }, { id: 'H02b', label: 'Hoja horizontal · presentación separada', min: [4.2, -4.1, 9.5], size: [7.6, 3.8, 0.2], move: [0, 0, 0], color: '#AAB5BC' }],
        camera: [27, -36, -18]
      }
    ];
  }
  const api = { create };
  root.GuideJoinery = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
