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
test('Guía completa y suma del presupuesto original',()=>{
  const g=guide();assert.equal(g.steps.length,12);
  assert.equal(g.materials.reduce((sum,m)=>sum+(m.total||0),0),190307);
});
