const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function api(){const context={URL};vm.createContext(context);if(fs.existsSync('materials-store.js'))vm.runInContext(fs.readFileSync('materials-store.js','utf8'),context);assert.ok(context.GuideMaterials,'Debe existir el almacenamiento de materiales');return context.GuideMaterials}
const defaults=[{name:'Tabla',product:'Terciado',quantity:'2',total:10000,url:'https://example.com/tabla',note:'18 mm'},{name:'Cojín',product:'A medida',quantity:'1',total:0,url:'',note:'Cotizar'}];
function storage(){const data=new Map();return {getItem:k=>data.get(k)||null,setItem:(k,v)=>data.set(k,v)}}
const plain=v=>JSON.parse(JSON.stringify(v));
test('Editar y marcar existente persiste sin multiplicar el total por cantidad',()=>{
 const a=api(),mem=storage(),s=a.create(defaults,mem);
 s.update('Tabla',{product:'Otro terciado',quantity:'3 planchas',total:8000,url:'https://example.org/oferta',owned:true});
 const restored=a.create(defaults,mem);assert.equal(restored.rows[0].product,'Otro terciado');assert.equal(restored.rows[0].quantity,'3 planchas');assert.equal(restored.rows[0].owned,true);assert.equal(restored.status.saved,true);
 assert.deepEqual(plain(restored.totals()),{total:8000,remaining:0,unpriced:1,remainingUnpriced:1,ownedCount:1});
 restored.update('Tabla',{owned:false});assert.equal(restored.totals().remaining,8000);
 assert.equal(defaults[0].total,10000);const row=restored.rows[0];row.total=1;assert.equal(restored.totals().total,8000);
});
test('Precio cero es conocido y vacío sigue pendiente; reset recupera originales',()=>{
 const s=api().create(defaults,storage());assert.equal(s.rows[1].total,null);s.update('Cojín',{total:0});assert.equal(s.totals().unpriced,0);
 s.update('Tabla',{total:null,owned:true});assert.equal(s.totals().remainingUnpriced,0);s.reset('Tabla');assert.equal(s.rows[0].total,10000);assert.equal(s.rows[0].owned,false);
 s.resetAll();assert.equal(s.rows[1].total,null);
});
test('Respaldo conserva datos y valida todo antes de reemplazar',()=>{
 const a=api(),s=a.create(defaults,storage());s.update('Tabla',{total:7000,product:'<b>Texto literal</b>'});const backup=s.exportJSON();const other=a.create(defaults,storage());other.validateImport(backup);assert.equal(other.rows[0].total,10000);other.importJSON(backup);assert.equal(other.rows[0].total,7000);
 const invalid=JSON.parse(backup);invalid.rows[1].url='javascript:alert(1)';assert.throws(()=>other.importJSON(JSON.stringify(invalid)));assert.equal(other.exportJSON(),backup);
 for(const bad of ['{',JSON.stringify({version:9,rows:[]}),JSON.stringify({...JSON.parse(backup),rows:[JSON.parse(backup).rows[0]]}),JSON.stringify({...JSON.parse(backup),rows:[JSON.parse(backup).rows[0],JSON.parse(backup).rows[0]]})])assert.throws(()=>other.importJSON(bad));
});
test('Rechaza precios, campos e identificadores inválidos sin alterar estado',()=>{
 const s=api().create(defaults,storage()),before=s.exportJSON();
 for(const patch of [{total:-1},{total:1.5},{total:Infinity},{total:'123'},{product:''},{quantity:''},{url:'data:text/html,x'},{url:'/relative'},{owned:'yes'},{id:'Cojín'},{name:'Otra'}]){assert.throws(()=>s.update('Tabla',patch));assert.equal(s.exportJSON(),before)}
 assert.throws(()=>s.update('missing',{total:4}));
});
test('Almacenamiento corrupto o bloqueado se comunica y permite respaldo en memoria',()=>{
 const a=api(),corrupt=a.create(defaults,{getItem:()=>'{',setItem(){}});assert.equal(corrupt.rows.length,2);assert.equal(corrupt.status.saved,false);assert.match(corrupt.status.message,/leer|recuperar/);
 const blocked=a.create(defaults,{getItem(){throw Error('blocked')},setItem(){throw Error('quota')}});blocked.update('Tabla',{total:9000});assert.equal(blocked.status.saved,false);assert.match(blocked.status.message,/guardar/);assert.equal(JSON.parse(blocked.exportJSON()).rows[0].total,9000);
});
test('Cambiar a barniz conserva ediciones de los otros materiales en listas guardadas y respaldos',()=>{
 const a=api(),mem=storage(),retired=['Masilla para Madera','Imprimante para Exterior','Esmalte al Agua para Exterior','Poliuretano al Agua'];
 const oldDefaults=[...defaults,...retired.map(name=>({name,product:name,quantity:'1',total:1000,url:'',note:''}))];
 const old=a.create(oldDefaults,mem);old.update('Tabla',{total:7500,owned:true});const backup=old.exportJSON();
 const nextDefaults=[...defaults,{name:'Barniz Exterior con Tinte',product:'Por elegir',quantity:'1 galón',total:0,url:'',note:''}];
 const next=a.create(nextDefaults,mem);assert.equal(next.rows[0].total,7500);assert.equal(next.rows[0].owned,true);assert.equal(next.rows.at(-1).total,null);assert.match(next.status.message,/barniz/);
 const fresh=a.create(nextDefaults,storage());fresh.importJSON(backup);assert.equal(fresh.rows[0].total,7500);assert.equal(fresh.rows.at(-1).owned,false);
 const invalid=JSON.parse(backup);invalid.rows.pop();assert.throws(()=>fresh.importJSON(JSON.stringify(invalid)));
});
test('El barniz seleccionado reemplaza solo la ficha provisional intacta',()=>{
 const a=api(),mem=storage(),pending={name:'Barniz Exterior con Tinte',product:'Barniz apto para madera exterior y sol · producto por elegir',quantity:'1 galón (aprox. 3,8 L), por confirmar',total:0,url:'',note:''};
 const chosen={...pending,product:'Kölor Marino Nogal',quantity:'1 galón (aprox. 3,8 L)',total:21990,url:'https://example.com/nogal'};
 const old=a.create([...defaults,pending],mem);old.update(pending.name,{owned:true});
 const next=a.create([...defaults,chosen],mem);assert.equal(next.rows.at(-1).product,chosen.product);assert.equal(next.rows.at(-1).total,21990);assert.equal(next.rows.at(-1).owned,true);
 old.update(pending.name,{total:18000});const custom=a.create([...defaults,chosen],mem);assert.equal(custom.rows.at(-1).total,18000);
});
test('Retirar rodillo y prensa conserva cambios y admite respaldos anteriores completos',()=>{
 const a=api(),mem=storage(),tools=['Rodillo de Espuma','Prensa Rápida (Herramienta)'].map(name=>({name,product:name,quantity:'1',total:1000,url:'',note:''}));
 const old=a.create([...defaults,...tools],mem);old.update('Tabla',{total:6500,owned:true});const backup=old.exportJSON();
 const next=a.create(defaults,mem);assert.equal(next.rows.length,2);assert.equal(next.rows[0].total,6500);assert.equal(next.rows[0].owned,true);assert.equal(next.status.saved,true);
 next.importJSON(backup);assert.equal(next.totals().total,6500);assert.equal(next.totals().remaining,0);
 const invalid=JSON.parse(backup);invalid.rows.pop();assert.throws(()=>next.importJSON(JSON.stringify(invalid)));
 const finishes=['Masilla para Madera','Imprimante para Exterior','Esmalte al Agua para Exterior','Poliuretano al Agua'].map(name=>({name,product:name,quantity:'1',total:1000,url:'',note:''}));
 const oldest=a.create([...defaults,...tools,...finishes],storage());oldest.update('Tabla',{total:6000});
 const newest=a.create([...defaults,{name:'Barniz Exterior con Tinte',product:'Barniz',quantity:'1',total:21990,url:'',note:''}],storage());
 newest.importJSON(oldest.exportJSON());assert.equal(newest.rows.length,3);assert.equal(newest.rows[0].total,6000);assert.equal(newest.rows[2].total,21990);
});
test('Sustituir la caja anterior actualiza guardados y respaldos conservando propiedad y otras ediciones',()=>{
 const a=api(),mem=storage(),id='Tornillos para Madera 4 × 40 mm';
 const previous={name:id,product:'Caja Turbo Screw 40 × 4 mm (144 u)',quantity:'~80',total:11990,url:'https://www.sodimac.cl/sodimac-cl/articulo/110282308/Tornillo-Turbo-screw-Madera-Madera-40-mm-4-mm-144-unidad(es',note:''};
 const chosen={...previous,product:'Mamut 4 × 40 mm · cabeza plana (6 u por paquete)',quantity:'14 paquetes · 84 tornillos',total:5460,url:'https://www.sodimac.cl/sodimac-cl/articulo/112857519/Tornillo-Tirafondo-Madera-40-mm-4-mm-6-unidad%28es%29/112857521'};
 const old=a.create([...defaults,previous],mem);old.update(id,{owned:true});old.update('Tabla',{total:7000});const backup=old.exportJSON();
 const next=a.create([...defaults,chosen],mem);assert.equal(next.rows[2].total,5460);assert.equal(next.rows[2].quantity,chosen.quantity);assert.equal(next.rows[2].owned,true);assert.equal(next.rows[0].total,7000);
 next.importJSON(backup);assert.equal(next.rows[2].url,chosen.url);
 old.update(id,{product:'Otra caja personalizada',url:'https://example.com/otra',total:5000});assert.equal(a.create([...defaults,chosen],mem).rows[2].total,5000);
});
test('Brocha existente y nuevos patines conservan ediciones en listas anteriores',()=>{
 const a=api(),mem=storage(),id='Patas o Regatones';
 const previous={name:id,product:'Elevador ABS Aluminio Mate 18–30 mm',quantity:'6',total:11940,url:'https://www.sodimac.cl/sodimac-cl/articulo/110395412/elevador-abs-aluminio-mate-18-30-mm/110395413',note:''};
 const brush={name:'Brocha',product:'Brocha',quantity:'1',total:4690,url:'',note:''};
 const chosen={...previous,product:'PRO RACK · Patín zincado con goma',total:9540,url:'https://www.sodimac.cl/sodimac-cl/articulo/110305628/Patin-zincado-con-goma/110305638'};
 const old=a.create([...defaults,previous,brush],mem);old.update('Tabla',{total:7000});old.update(id,{owned:true});const backup=old.exportJSON();
 const next=a.create([...defaults,chosen],mem);assert.equal(next.rows.length,3);assert.equal(next.rows[0].total,7000);assert.equal(next.rows[2].total,9540);assert.equal(next.rows[2].owned,true);
 next.importJSON(backup);assert.equal(next.rows[2].url,chosen.url);
 old.update(id,{product:'Mis propias patas',url:'https://example.com/patas',total:5000});assert.equal(a.create([...defaults,chosen],mem).rows[2].total,5000);
});
test('Pack Fixser sustituye bisagras anteriores en guardado y respaldo, sin perder otras ediciones',()=>{
 const a=api(),mem=storage(),id='Bisagras Simples';
 const previous={name:id,product:'Bisagra Acero Inoxidable 3"×3" Scanavini',quantity:'3',total:16170,url:'https://www.sodimac.cl/sodimac-cl/articulo/110278315/Bisagra-acero-inoxidable-3-x3-/110278319',note:''};
 const chosen={...previous,product:'FIXSER · Pack de 3 bisagras simples 3 × 3 pulgadas · negro',quantity:'1 pack · 3 bisagras',total:4890,url:'https://www.sodimac.cl/sodimac-cl/articulo/141360956/Pack-3-Unidades-Bisagra-3X3%27%27-Negro/141360957'};
 const old=a.create([...defaults,previous],mem);old.update(id,{owned:true});old.update('Tabla',{total:7000});const backup=old.exportJSON();
 const next=a.create([...defaults,chosen],mem);assert.equal(next.rows[2].total,4890);assert.equal(next.rows[2].quantity,chosen.quantity);assert.equal(next.rows[2].owned,true);assert.equal(next.rows[0].total,7000);
 next.importJSON(backup);assert.equal(next.rows[2].url,chosen.url);
 old.update(id,{product:'Otras bisagras',url:'https://example.com/bisagras',total:3000});assert.equal(a.create([...defaults,chosen],mem).rows[2].total,3000);
});
