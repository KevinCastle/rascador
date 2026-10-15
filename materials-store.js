/* Local materials state; independent of construction progress and the 3D viewer. */
(function(root){
'use strict';
const key='rascador-materials-v1';
const fields=['product','quantity','total','url','owned'];
// Only this approved catalog transition is accepted; other missing/unknown rows
// still fail validation so a partial backup cannot silently erase edits.
const retiredFinishes=['Masilla para Madera','Imprimante para Exterior','Esmalte al Agua para Exterior','Poliuretano al Agua'];
const separateTools=['Rodillo de Espuma','Prensa Rápida (Herramienta)'];
const varnishId='Barniz Exterior con Tinte';
function text(value,label,max){
  if(typeof value!=='string'||!value.trim()||value.length>max)throw new Error(label+' debe tener entre 1 y '+max+' caracteres.');
  return value.trim();
}
function values(row){
  const product=text(row.product,'El producto',300),quantity=text(row.quantity,'La cantidad',80);
  if(row.total!==null&&(!Number.isSafeInteger(row.total)||row.total<0||row.total>1000000000))throw new Error('El precio debe ser un entero entre 0 y 1.000.000.000 CLP, o quedar por cotizar.');
  if(typeof row.owned!=='boolean')throw new Error('El estado «Ya lo tengo» no es válido.');
  if(typeof row.url!=='string'||row.url.length>2048)throw new Error('El enlace no es válido.');
  const url=row.url.trim();
  if(url){let parsed;try{parsed=new URL(url)}catch{throw new Error('Usa un enlace completo que empiece por https:// o http://.')}
    if(!['https:','http:'].includes(parsed.protocol))throw new Error('El enlace debe empezar por https:// o http://.');
  }
  return {product,quantity,total:row.total,url,owned:row.owned};
}
function create(defaults,storage){
  const originals=defaults.map(row=>({id:row.name,name:row.name,note:row.note,...values({...row,total:row.total===0?null:row.total,owned:false})}));
  let rows=originals.map(row=>({...row}));
  let status={saved:true,message:'Los cambios se guardan automáticamente en este navegador.'};
  const snapshot=()=>JSON.stringify({version:1,rows:rows.map(({id,product,quantity,total,url,owned})=>({id,product,quantity,total,url,owned}))},null,2);
  function parse(raw){
    if(typeof raw!=='string'||raw.length>1000000)throw new Error('El respaldo debe ser un archivo JSON de menos de 1 MB.');
    let data;try{data=JSON.parse(raw)}catch{throw new Error('No se pudo leer el respaldo JSON.');}
    if(!data||data.version!==1||!Array.isArray(data.rows))throw new Error('Este respaldo no corresponde a la lista de materiales actual.');
    const ids=data.rows.map(row=>row?.id);
    const legacy=originals.some(row=>row.id===varnishId)&&!ids.includes(varnishId)&&retiredFinishes.every(id=>ids.includes(id));
    const expected=legacy?[...originals.filter(row=>row.id!==varnishId).map(row=>row.id),...retiredFinishes]:originals.map(row=>row.id);
    if(separateTools.every(id=>!expected.includes(id)&&ids.includes(id)))expected.push(...separateTools);
    if(!expected.includes('Brocha')&&ids.includes('Brocha'))expected.push('Brocha');
    if(data.rows.length!==expected.length)throw new Error('Este respaldo no corresponde a la lista de materiales actual.');
    const seen=new Set(),found=new Map();
    for(const row of data.rows){
      if(!row||typeof row!=='object'||!expected.includes(row.id)||seen.has(row.id))throw new Error('El respaldo contiene materiales desconocidos o repetidos.');
      seen.add(row.id);found.set(row.id,values(row));
    }
    return originals.map(row=>{
      const saved=found.get(row.id);
      // Fill the earlier pending selection without overwriting a user's quote.
      const pending=row.id===varnishId&&saved?.product==='Barniz apto para madera exterior y sol · producto por elegir'&&saved.quantity==='1 galón (aprox. 3,8 L), por confirmar'&&saved.total===null&&saved.url==='';
      const replacedScrews=row.id==='Tornillos para Madera 4 × 40 mm'&&row.url.includes('/112857521')&&saved?.product==='Caja Turbo Screw 40 × 4 mm (144 u)'&&saved.url.includes('/110282308/');
      const replacedFeet=row.id==='Patas o Regatones'&&row.url.includes('/110305638')&&saved?.product==='Elevador ABS Aluminio Mate 18–30 mm'&&saved.url.includes('/110395412/');
      const replacedHinges=row.id==='Bisagras Simples'&&row.url.includes('/141360957')&&saved?.product==='Bisagra Acero Inoxidable 3"×3" Scanavini'&&saved.url.includes('/110278315/');
      return pending||replacedScrews||replacedFeet||replacedHinges?{...row,owned:saved.owned}:{...row,...saved};
    });
  }
  function persist(){
    try{storage.setItem(key,snapshot());status={saved:true,message:'Cambios guardados en este navegador.'}}
    catch{status={saved:false,message:'No se pudieron guardar los cambios. Se conservan mientras esta página siga abierta; exporta un respaldo antes de salir.'}}
  }
  try{const saved=storage.getItem(key);if(saved!==null){rows=parse(saved);if(JSON.parse(saved).rows.length!==originals.length)status={saved:true,message:'Lista adaptada al presupuesto vigente: se conservan tus cambios en los materiales que siguen en la lista. El acabado vigente es barniz exterior con tinte; rodillo y prensa se consiguen aparte.'}}}
  catch{status={saved:false,message:'No se pudo recuperar la lista guardada. Se muestra el presupuesto original; puedes importar un respaldo.'}}
  const index=id=>{const i=rows.findIndex(row=>row.id===id);if(i===-1)throw new Error('Material desconocido.');return i};
  return {
    get rows(){return rows.map(row=>({...row}))},
    get status(){return {...status}},
    update(id,patch){
      const i=index(id);
      if(!patch||typeof patch!=='object'||Array.isArray(patch)||Object.keys(patch).some(field=>!fields.includes(field)))throw new Error('No se puede editar ese campo del material.');
      const updated=values({...rows[i],...patch});rows[i]={...rows[i],...updated};persist();
    },
    reset(id){const i=index(id);rows[i]={...originals[i]};persist()},
    resetAll(){rows=originals.map(row=>({...row}));persist()},
    totals(){return rows.reduce((sum,row)=>{
      if(row.owned)sum.ownedCount++;
      if(row.total===null){sum.unpriced++;if(!row.owned)sum.remainingUnpriced++}
      else {sum.total+=row.total;if(!row.owned)sum.remaining+=row.total}
      return sum;
    },{total:0,remaining:0,unpriced:0,remainingUnpriced:0,ownedCount:0})},
    exportJSON:snapshot,
    validateImport(raw){return parse(raw)},
    importJSON(raw){const next=parse(raw);rows=next;persist()}
  };
}
root.GuideMaterials={create};
})(globalThis);
