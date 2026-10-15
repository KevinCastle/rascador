const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
function guide(){
  const html=fs.existsSync('index.html')?fs.readFileSync('index.html','utf8'):'';
  const script=html.match(/<script id="guide-data">([\s\S]*?)<\/script>/);
  assert.ok(script,'La página debe incluir sus datos calculables');
  const context={};vm.createContext(context);vm.runInContext(script[1],context);return context.Guide;
}
test('Las medidas exteriores y cortes corresponden al diseño',()=>{
  const g=guide(),d=g.derive(135,49,1.8);
  assert.equal(d.width,135);assert.equal(d.depth,50);assert.equal(d.height,46.8);
  assert.equal(d.anteroom,45.5);
  assert.deepEqual(Array.from(d.cuts.find(c=>c.id==='P09').size),[97.5,50]);
});
test('Reducir el ancho solo reduce la antecámara y cortes dependientes',()=>{
  const g=guide(),a=g.derive(135,49,1.8),b=g.derive(134,49,1.8);
  assert.equal(b.anteroom,44.5);
  for(const id of ['P04','P05','P06','P07','P08','P10'])assert.deepEqual(Array.from(a.cuts.find(c=>c.id===id).size),Array.from(b.cuts.find(c=>c.id===id).size));
  assert.deepEqual(Array.from(b.cuts.find(c=>c.id==='P09').size),[96.5,50]);
});
test('Altura de patas y fondo actualizan sus medidas dependientes',()=>{
  const d=guide().derive(136,53,3);
  assert.equal(d.height,48);assert.equal(d.depth,54);assert.equal(d.anteroom,46.5);
  assert.deepEqual(Array.from(d.cuts.find(c=>c.id==='P04').size),[50,41.4]);
});
test('Guía completa y suma del presupuesto con acabado simplificado',()=>{
  const g=guide();assert.equal(g.steps.length,12);
  assert.equal(g.materials.reduce((sum,m)=>sum+(m.total||0),0),102460);
});
test('Las instrucciones del frente conservan las medidas al ajustar el ancho',()=>{
 const g=guide();
 for(const [width,left,right] of [[120,'91,5','116,5'],[134,'98,5','123,5'],[135,'99','124'],[136,'99,5','124,5']]){
  const front=g.instructions(2,width,49,1.8);
  assert.match(front.setup,new RegExp(width+' cm'));
  assert.match(front.setup,/cara exterior/);
  assert.ok(front.actions[1].includes(left+' cm')&&front.actions[1].includes(right+' cm'));
  assert.match(front.actions[0],/6 cm.*31 cm/);
  assert.match(front.actions[2],/57 cm.*69 cm/);
  assert.match(front.actions[3],/51, 56, 61, 66, 71 y 76 cm/);
  assert.match(front.actions[3],/6 cm sobre el borde inferior/);
 }
});
test('El acabado aprobado usa solo barniz exterior con tinte y conserva doce pasos',()=>{
 const g=guide();assert.equal(g.steps.length,12);
 const names=g.materials.map(m=>m.name);
 for(const removed of ['Masilla para Madera','Imprimante para Exterior','Esmalte al Agua para Exterior','Poliuretano al Agua'])assert.ok(!names.includes(removed));
 const varnish=g.materials.find(m=>m.name==='Barniz Exterior con Tinte');assert.ok(varnish);assert.equal(varnish.total,21990);assert.match(varnish.url,/140087918$/);assert.match(varnish.product,/Kölor/);assert.match(varnish.quantity,/3,8/);
 const active=JSON.stringify([g.steps,[3,4,9].map(i=>g.instructions(i,135,49,1.8))]);assert.doesNotMatch(active,/poliuretano|imprimante|esmalte|rellena con masilla/i);assert.match(active,/barniz exterior con tinte/);
});
