const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const Cutting=require('../cutting.js');
const context={};vm.createContext(context);
vm.runInContext(fs.readFileSync('index.html','utf8').match(/<script id="guide-data">([\s\S]*?)<\/script>/)[1],context);
const area=r=>r.width*r.height;
test('Cada distribución conserva todas las piezas sin giro, fuera de los cortes de sierra',()=>{
 for(let W=120;W<=136;W++)for(let D=45;D<=53;D++){
  const expected=context.Guide.derive(W,D).cuts;
  for(const layout of Cutting.create(W,D)){
   const pieces=expected.filter(p=>p.thickness===layout.thickness);
   assert.equal(layout.pieces.length,pieces.length);
   assert.equal(new Set(layout.pieces.map(p=>p.id)).size,pieces.length);
   for(const p of pieces){
    const actual=layout.pieces.find(a=>a.id===p.id);
    assert.ok(actual,p.id);
    assert.deepEqual([actual.width,actual.height],Array.from(p.size),p.id+' debe conservar medidas y veta');
   }
   const regions=[...layout.pieces,...layout.cuts,...layout.offcuts];
   for(const r of regions){
    assert.ok([r.x,r.y,r.width,r.height].every(Number.isFinite));
    assert.ok(r.width>0&&r.height>0);
    assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=244+1e-7&&r.y+r.height<=122+1e-7,'Fuera de plancha '+r.id);
   }
   for(let i=0;i<regions.length;i++)for(let j=i+1;j<regions.length;j++){
    const a=regions[i],b=regions[j];
    const overlapX=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x);
    const overlapY=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);
    assert.ok(overlapX<1e-7||overlapY<1e-7,`Solape ${layout.thickness}: ${a.id}/${b.id}`);
   }
   assert.ok(Math.abs(regions.reduce((sum,r)=>sum+area(r),0)-244*122)<1e-6,'Debe particionar la plancha entera');
   assert.ok(Math.abs(layout.areas.pieces+layout.areas.cuts+layout.areas.offcuts-layout.areas.sheet)<1e-6);
   assert.equal(layout.cuts.filter(c=>c.phase==='band').length,2,'Incluye el corte final de la segunda franja');
   for(const p of layout.pieces){
    const cut=layout.cuts.find(c=>c.phase==='crosscut'&&c.after===p.id);
    assert.ok(cut,'Incluye el corte final de '+p.id);
    assert.ok(Math.abs(cut.x-p.x-p.width)<1e-7);
    assert.equal(cut.width,.3);
   }
  }
 }
});
test('Sobrantes reales después de todos los cortes con medidas iniciales',()=>{
 const [thick,thin]=Cutting.create();
 assert.equal(thick.offcuts.find(r=>r.band===0).height,22.4);
 assert.equal(thin.offcuts.find(r=>r.band===0).height,38.6);
 assert.equal(thin.offcuts.find(r=>r.band===1).width,16.1);
 assert.equal(thin.offcuts.find(r=>r.band===2).width,62.4);
 assert.equal(thick.offcuts.find(r=>r.band===2&&r.height===50).x,202.7);
 assert.equal(thick.cuts.filter(c=>c.phase==='trim').length,2);
 assert.equal(thin.cuts.filter(c=>c.phase==='trim').length,0);
});
