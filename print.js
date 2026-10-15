/* Carpenter quotation drawings. Deliberately independent of the shopping catalog and 3D. */
(function(root){
  'use strict';
  const fmt=n=>Number(n.toFixed(2)).toLocaleString('es-CL');
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const line=(x1,y1,x2,y2,cls='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${cls}"/>`;
  const rect=(x,y,w,h,cls='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${cls}"/>`;
  const text=(x,y,t,cls='',anchor='middle')=>`<text x="${x}" y="${y}" text-anchor="${anchor}" class="${cls}">${esc(t)}</text>`;
  const hdim=(x1,x2,y,t,from)=>`${from===undefined?'':line(x1,from,x1,y+5,'extension')+line(x2,from,x2,y+5,'extension')}${line(x1,y,x2,y,'dimension')}${text((x1+x2)/2,y-7,t,'dim-label')}`;
  const vdim=(x,y1,y2,t,from)=>`${from===undefined?'':line(from,y1,x+5,y1,'extension')+line(from,y2,x+5,y2,'extension')}${line(x,y1,x,y2,'dimension')}<text x="${x-8}" y="${(y1+y2)/2}" text-anchor="middle" transform="rotate(-90 ${x-8} ${(y1+y2)/2})" class="dim-label">${esc(t)}</text>`;
  function svg(id,width,height,label,body){return `<svg class="print-drawing" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${id}-title"><title id="${id}-title">${esc(label)}</title><defs><marker id="${id}-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto-start-reverse"><path d="M7 0 0 3.5 7 7" class="arrow"/></marker><pattern id="${id}-hatch" width="9" height="9" patternUnits="userSpaceOnUse"><path d="M-2 2 2 -2 M0 9 9 0 M7 11 11 7" class="hatch-line"/></pattern></defs><g style="--print-arrow:url(#${id}-arrow);--print-hatch:url(#${id}-hatch)">${body}</g></svg>`}
  function table(headers,rows,cls=''){return `<table class="print-table ${cls}"><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((cell,i)=>`<${i?'td':'th scope="row"'}>${cell}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`}
  function page(number,title,sub,body,d){return `<section class="print-page" aria-label="Hoja ${number}: ${esc(title)}"><header class="print-page-header"><p class="print-eyebrow">BANCA CON ARENERO · PLANOS PARA COTIZAR</p><h1>${title}</h1><p>${sub}</p></header><div class="print-page-content">${body}</div><footer class="print-page-footer"><span>W ${fmt(d.width)} · D ${fmt(d.depth-1)} · f ${fmt(d.height-45)} cm | Cotas en cm salvo indicación · Esquemas acotados; no a escala.</span><span>${number} / 6</span></footer></section>`}
  const note=t=>`<p class="print-note">${t}</p>`;
  function overview(W,D,f,d){
    const s=4.05,x=72,y=58,bw=W*s,bh=D*s,inside=(D-3)*s;
    let top=rect(x,y,bw,bh,'wood')+rect(x+1.5*s,y+1.5*s,(W-3)*s,inside,'unfilled')+rect(x+35.5*s,y+1.5*s,1.5*s,inside,'wood');
    top+=rect(x+38*s,y+(D/2-20.5)*s,50*s,41*s,'accessory')+text(x+63*s,y+D*s/2,'Bandeja 50 × 41','label')+text(x+18.5*s,y+bh/2-7,'Descanso','label')+text(x+18.5*s,y+bh/2+12,'34 libres','small-label');
    top+=rect(x+(W-35.5)*s,y+1.5*s,34*s,18*s,'accessory')+text(x+(W-18.5)*s,y+10*s,'P10 · 34 × 18','small-label')+text(x+(88+(W-89.5)/2)*s,y+bh*.76,`Antecámara ${fmt(d.anteroom)}`,'small-label');
    top+=hdim(x,x+bw,y-25,fmt(W),y)+vdim(x+bw+35,y,y+bh,fmt(D),x+bw)+hdim(x,x+35.5*s,y+bh+34,'35,5 · inicio de tabique',y+bh)+text(x,y+bh+68,'PLANTA · sin tapa · atrás arriba / frente abajo','view-label','start');
    const fy=385,wall=41.4*s,baseY=fy+wall,totalTop=fy-1.8*s,ground=baseY+1.8*s+f*s;
    let front=rect(x,fy,bw,wall,'wood')+rect(x,totalTop,bw,1.8*s,'wood')+rect(x,baseY,bw,1.8*s,'wood');
    const c=111.5+(W-135)/2;
    for(const a of [6,c-12.5])front+=rect(x+a*s,baseY-30*s,25*s,30*s,'opening');
    for(const a of [51,56,61,66,71,76])front+=`<circle cx="${x+a*s}" cy="${baseY-6*s}" r="${s}" class="opening"/>`;
    front+=rect(x+57*s,fy,12*s,3*s,'opening');
    for(const a of [4,W/2,W-4])front+=rect(x+(a-1)*s,baseY+1.8*s,2*s,f*s,'wood');
    front+=line(x-6,ground,x+bw+8,ground,'ground')+vdim(x+bw+35,totalTop,ground,`${fmt(d.height)} total`,x+bw)+hdim(x,x+bw,ground+30,fmt(W),ground)+text(x,ground+58,'FRENTE · altura sin cojín · seis patas en total','view-label','start');
    const sx=91,sy=725,ss=3.2,sw=(D+1)*ss,sh=45*ss;
    let side=rect(sx,sy,sw,1.8*ss,'wood')+rect(sx,sy+1.8*ss,D*ss,41.4*ss,'wood')+rect(sx,sy+43.2*ss,D*ss,1.8*ss,'wood');
    for(const a of [3,D-3])side+=rect(sx+a*ss,sy+sh,2*ss,f*ss,'wood');
    side+=hdim(sx,sx+sw,sy-23,`${fmt(D+1)} con tapa`,sy)+text(sx,sy+sh+35,'LATERAL · tapa sobresale 1 cm delante','view-label','start');
    side+=text(350,750,'REFERENCIAS DE ARMADO','view-label','start')+text(350,778,'Paredes: 15 mm · base y tapas: 18 mm','label','start')+text(350,804,`Fondo libre: ${fmt(D-3)} · alto libre: 41,4`,'label','start')+text(350,830,'Tapa: holgura de 0,5 junto a parte fija','label','start')+text(350,856,'Cojín y rascador no sumados al alto','label','start');
    let warning='Revisa el balcón en varios puntos: con ancho 135 queda 1 cm frente al límite de 136. La altura f es una referencia; confírmala con la pata instalada.';
    if(W<123.5)warning+=' La repisa puede interferir con la bandeja: resuelve su posición antes de cortar.';
    if(D<49)warning+=' La alfombra de 66 × 46 no cabe en el fondo interior: adapta su uso.';
    return svg('print-overview',740,925,'Planta, frente y lateral acotados de la banca',top+front+side)+note(warning);
  }
  function cuts(W,D,d){
    const rows=d.cuts.map(p=>[p.id,esc(p.name),'1',`${fmt(p.size[0])} × ${fmt(p.size[1])}`,`${p.thickness} mm`]);
    return `<h2>Terciado estructural · piezas terminadas</h2>${table(['ID','Pieza','Cant.','Medida de corte','Espesor'],rows)}${note('Corta una unidad de cada pieza. Las medidas son de pieza terminada; agrega el ancho de sierra al distribuir los cortes, nunca a estas cotas. P03 lleva las aberturas detalladas en la hoja 5.')}<h2>Listones de pino seco cepillado · sección 1,9 × 4,1 cm</h2>${table(['ID','Uso','Cant.','Largo'],[['L01','Apoyo de tapa, cara derecha del tabique','1',fmt(D-3)],['L02','Apoyo de repisa, pared de atrás','1','34'],['L03','Apoyo de repisa, lateral derecho','1','18'],['L04','Respaldo de bisagras · opcional','1','60']])}<h2>Posiciones para el armado</h2>${table(['Elemento','Referencia para marcar'],[['Tabique P06','Desde el borde izquierdo exterior: inicio a 35,5; termina a 37.'],['Parte fija P07 / tapa P09','Parte fija de 0 a 37; tapa desde 37,5. Deja 0,5 de holgura.'],['Repisa P10',`Desde el borde izquierdo: ${fmt(W-35.5)}. Borde superior de sus apoyos: 27,2 sobre la cara interior de la base.`],['Bisagras','Tres en el borde de atrás: centros a 45, 70 y 95 desde la izquierda.'],['Refuerzo P08','Bajo P07, centrado con la base real del rascador; prueba la fijación antes de perforar.']])}${note('Conserva L03 a 18: al instalarlo después de L02 sobresale 1,9 respecto del frente de la repisa P10. Un listón de 3,2 m cubre los cuatro cortes, incluido L04 opcional. Redondea y lija los cantos de las entradas y de la muesca sin cambiar sus luces libres.')}`;
  }
  function sheetPage(plan){
    const id=`print-sheet-${plan.thickness}`,s=2.6,x=55,y=58;
    let drawing='';
    for(const r of plan.offcuts)drawing+=rect(x+r.x*s,y+r.y*s,r.width*s,r.height*s,'scrap');
    for(const r of plan.cuts)drawing+=rect(x+r.x*s,y+r.y*s,r.width*s,r.height*s,'kerf');
    for(const p of plan.pieces){
      const cx=x+(p.x+p.width/2)*s,cy=y+(p.y+p.height/2)*s;
      drawing+=rect(x+p.x*s,y+p.y*s,p.width*s,p.height*s,'piece');
      drawing+=text(cx,cy-5,p.id,'piece-id')+text(cx,cy+13,`${fmt(p.width)} × ${fmt(p.height)}`,'piece-size');
    }
    drawing+=rect(x,y,244*s,122*s,'unfilled')+hdim(x,x+244*s,y-24,'244',y)+vdim(x-22,y,y+122*s,'122',x)+text(x,y+122*s+31,'Veta exterior paralela al lado de 244 cm →','label','start');
    const rows=plan.bands.map(b=>[`${b.number}`,fmt(b.height),b.ids.map(id=>{const p=plan.pieces.find(p=>p.id===id);return `${p.id}: ${fmt(p.width)} × ${fmt(p.height)}`}).join(' · ')]);
    const steps=plan.bands.map(b=>`<li>Desde el borde ${b.number===1?'superior de la plancha':'del material que queda'}, separa una franja de <strong>${fmt(b.height)} cm</strong> de alto a todo el largo de 244. Descuenta <strong>0,3 cm</strong> de sierra después de la franja.</li>`).join('');
    return svg(id,740,435,`Distribución de corte en plancha de ${plan.thickness} mm, 244 por 122 cm`,drawing)+`<p class="print-legend"><span class="legend-piece"></span> Pieza útil <span class="legend-scrap"></span> Sobrante rayado <span class="legend-kerf"></span> Sierra: 0,3 cm (3 mm)</p>${table(['Franja','Alto','Piezas de izquierda a derecha'],rows)}<h2>Orden de corte sugerido</h2><ol class="print-steps">${steps}<li>En cada franja, corta las piezas de izquierda a derecha con los anchos de la tabla. Deja <strong>0,3 cm entre piezas</strong> para la sierra.</li><li>Recorta el alto final de las piezas más bajas que su franja${plan.thickness===18?' (P08 a 33 y P10 a 18)':''}. Reserva los sobrantes y rotula cada pieza con su ID.</li></ol>${note('Esta distribución incluye una sierra de 3 mm y usa los bordes nominales de la plancha. Revisa escuadra, medidas reales y estado de los bordes antes de cortar; si necesitas sanearlos o la sierra tiene otro ancho, reajusta la distribución. Las líneas de sierra están dibujadas a su ancho real.')}<div class="print-sheet-summary"><strong>1 plancha de ${plan.thickness} mm</strong><span>244 × 122 cm · ${plan.pieces.length} piezas</span></div>`;
  }
  function frontPage(W){
    const c=111.5+(W-135)/2,a=c-12.5,b=c+12.5,s=4.4,x=64,y=98,w=W*s,h=41.4*s,bottom=y+h;
    let drawing=rect(x,y,w,h,'wood');
    for(const start of [6,a])drawing+=rect(x+start*s,bottom-30*s,25*s,30*s,'opening');
    drawing+=rect(x+57*s,y,12*s,3*s,'opening');
    for(const n of [51,56,61,66,71,76])drawing+=`<circle cx="${x+n*s}" cy="${bottom-6*s}" r="${s}" class="opening"/>`;
    drawing+=hdim(x,x+w,y-46,`${fmt(W)} ancho total`,y)+vdim(x+w+32,y,bottom,'41,4 alto total',x+w);
    drawing+=hdim(x+6*s,x+31*s,bottom+28,'25',bottom)+hdim(x+a*s,x+b*s,bottom+28,'25',bottom);
    drawing+=vdim(x+6*s+22,bottom-30*s,bottom,'30',x+6*s)+vdim(x+b*s-17,bottom-30*s,bottom,'30',x+b*s);
    drawing+=hdim(x+57*s,x+69*s,y-15,'12',y)+line(x+69*s,y+3*s,x+77*s,y+26,'extension')+text(x+79*s,y+30,'3 de profundidad','small-label','start');
    drawing+=text(x+18.5*s,bottom-30*s-12,'C1','piece-id')+text(x+c*s,bottom-30*s-12,'C2','piece-id')+text(x+49*s,bottom-12*s,'C4 · 6 × Ø2','small-label','start');
    drawing+=line(x+51*s,bottom-6*s,x+45*s,bottom-14*s,'extension')+text(x,y+h+65,'BORDE INFERIOR · todas las alturas de marcado salen de este borde','view-label','start');
    const rows=[['C1','Entrada al descanso','6 → 31','0 → 30','25 × 30; abierta por abajo'],['C2','Entrada al arenero',`${fmt(a)} → ${fmt(b)}`,'0 → 30','25 × 30; abierta por abajo'],['C3','Muesca para mano','57 → 69','38,4 → 41,4','12 × 3; abierta por arriba'],['C4','6 ventilaciones','51 · 56 · 61 · 66 · 71 · 76','Centros a 6','Ø2 cada una; pasantes']];
    return note('<strong>P03 · terciado de 15 mm.</strong> Coloca la cara frontal hacia ti, con el lado largo horizontal. Izquierda y abajo son los bordes de referencia del dibujo. Es un plano acotado: no lo uses como plantilla a tamaño real.')+svg('print-front',740,390,'Pared frontal P03 y aberturas con medidas desde los bordes izquierdo e inferior',drawing)+table(['ID','Operación','Desde la izquierda','Desde abajo','Medida / tipo'],rows,'front-marks')+`<h2>Cómo marcar antes de cortar</h2><ol class="print-steps"><li>Comprueba el rectángulo P03: <strong>${fmt(W)} × 41,4</strong>. Marca las entradas desde la izquierda; sube 30 desde abajo y une las marcas.</li><li>Para la muesca de arriba, marca 57 y 69 desde la izquierda. Baja 3 desde el borde superior.</li><li>Traza una línea a 6 desde abajo. Sobre ella marca los seis centros de la tabla y perfora a Ø2.</li><li>Presenta el frente con tabique y bandeja antes del corte final. Suaviza los cantos de paso y lija las perforaciones.</li></ol>${note(`La entrada al arenero sigue el ancho elegido: centro = 111,5 + (W − 135) ÷ 2 = <strong>${fmt(c)} cm</strong>. No traslades las cotas de 135 si cambias W. Las aberturas atraviesan los 15 mm de la pared.`)}`;
  }
  function materials(d,ownedIds){
    const owned=new Set(ownedIds);
    const catalog=[
      ['Terciado Estructural 15 mm','Terciado estructural 15 mm','1 plancha','244 × 122 cm; paredes y tabique.'],
      ['Terciado Estructural 18 mm','Terciado estructural 18 mm','1 plancha','244 × 122 cm; base, tapas, refuerzo y repisa.'],
      ['Pino Cepillado Seco 1×2','Pino seco cepillado 1 × 2','1 tira de 3,2 m','Sección real 19 × 41 mm; incluye L04 opcional.'],
      ['Bisagras Simples','Bisagras simples 3 × 3 pulgadas','3 unidades','Confirmar tornillos que no atraviesen tapa de 18 mm.'],
      ['Patas o Regatones','Patas regulables con apoyo de goma','6 unidades','Confirmar fijaciones y altura libre una vez instaladas.'],
      ['Tornillos para Madera 4 × 40 mm','Tornillos para madera 4 × 40 mm','84 unidades','Cabeza plana; uniones de estructura.'],
      ['Tornillos para Madera 4 × 25 mm','Tornillos para madera 4 × 25 mm','24 unidades','Cabeza avellanada; listones y apoyos.'],
      ['Pernos con Golillas y Tuercas','Pernos coche ¼ × 2½ pulgadas','4 juegos','Con golillas y tuercas ciegas; verificar largo con rascador real.'],
      ['Cola para Madera','Cola para madera resistente a humedad','0,5 kg','Aplicación en contactos de madera sin barniz.'],
      ['Barniz Exterior con Tinte','Barniz exterior con tinte','Aprox. 3,8 L','Proteger todas las caras y cantos; seguir secado y curado indicados.'],
      ['Lijas (Grano 80)','Lija para madera · grano 80','4 pliegos','Lijado inicial.'],
      ['Lijas (Grano 120)','Lija para madera · grano 120','4 pliegos','Lijado intermedio.'],
      ['Lijas (Grano 180)','Lija para madera · grano 180','4 pliegos','Confirmar grano final y entre manos según acabado.'],
      ['Cojín y Velcro','Cojín a medida y velcro','1 conjunto',`${d.cushion.map(fmt).join(' × ')} cm; fijación sobre tapa articulada.`]
    ];
    return `<p>Cotiza madera, cortes, armado, acabado y ajuste de los accesorios que aporta el cliente. Cantidades de referencia para una banca.</p>${table(['Material genérico','Cantidad','Especificación / destino','Provisión'],catalog.map(([id,name,qty,spec])=>[name,qty,spec,owned.has(id)?'<strong>Aporta cliente</strong>':'Incluir en cotización']),'materials-quote')}<h2>Accesorios y herramientas</h2><p><strong>Aporta cliente:</strong> bandeja 50 × 41 × 28; alfombra 66 × 46; rascador con base 31 × 31; brocha. Presenta los accesorios reales para comprobar su encaje.</p><p><strong>Conseguir aparte:</strong> rodillo compatible con el acabado, si se usa; prensa rápida para sujetar durante el armado y secado.</p><h2>Confirmar al tomar medidas</h2><p class="print-compact">Altura y fijación de patas; tornillos de bisagras; grosor y acceso de la base del rascador; holgura real del balcón. La tapa requiere apoyo al abrirse. La capacidad de carga del asiento está pendiente de validación.</p>${note('Acabado previsto: 3 manos exteriores y al menos 2 interiores, con lijado entre capas y curado según las instrucciones del acabado elegido. Verifica el rendimiento antes de definir la cantidad final.')}`;
  }
  function render({W=135,D=49,f=1.8,ownedIds=[]}={}){
    if(!Number.isFinite(f)||f<1.8||f>3)throw new RangeError('Altura de patas fuera del rango de la guía');
    const plans=root.GuideCutting.create(W,D),d=root.Guide.derive(W,D,f);
    return [
      page(1,'Vista general y medidas',`Banca de ${fmt(W)} × ${fmt(D+1)} × ${fmt(d.height)} cm · sin cojín ni rascador`,overview(W,D,f,d),d),
      page(2,'Lista de cortes y armado','10 piezas de terciado + 3 listones y 1 listón opcional',cuts(W,D,d),d),
      page(3,'Corte de plancha · 18 mm','Base, parte fija, refuerzo, tapa articulada y repisa',sheetPage(plans.find(p=>p.thickness===18)),d),
      page(4,'Corte de plancha · 15 mm','Paredes, laterales y tabique',sheetPage(plans.find(p=>p.thickness===15)),d),
      page(5,'Aberturas de la pared frontal','Marcado de entradas, muesca y ventilación · pieza P03',frontPage(W),d),
      page(6,'Materiales para la cotización','Especificaciones genéricas · cantidades para una unidad',materials(d,ownedIds),d)
    ].join('');
  }
  root.GuidePrint={render};
})(typeof globalThis!=='undefined'?globalThis:this);
