const {test}=require('node:test');
const assert=require('node:assert/strict');
const Joinery=require('../joinery.js');
const add=(a,b)=>a.map((n,i)=>n+b[i]);
const end=s=>add(s.start,s.direction.map(n=>n*s.length));
const inside=(point,board,margin=0)=>point.every((n,i)=>n>=board.min[i]+margin-1e-6&&n<=board.min[i]+board.size[i]-margin+1e-6);
function pointDistance(point,s){
 const t=Math.max(0,Math.min(s.length,point.reduce((sum,n,i)=>sum+(n-s.start[i])*s.direction[i],0)));
 return Math.hypot(...point.map((n,i)=>n-s.start[i]-s.direction[i]*t));
}
for(const dims of [[135,49,1.8],[120,45,3],[136,53,1.8],[134,50,2.4]]){
 test('Uniones coherentes y tornillos contenidos: '+dims.join(' / '),()=>{
  const details=Joinery.create(...dims);
  assert.deepEqual(details.map(d=>d.id),['base','corner','cleat','shelf','fixed','hinge']);
  for(const detail of details){
   assert.ok(detail.summary&&detail.notes.length&&detail.positions.length,detail.id+' requiere explicación y posiciones');
   for(const board of detail.boards){
    assert.ok(board.size.every(n=>Number.isFinite(n)&&n>0),board.id);
    assert.ok([...board.min,...board.move].every(Number.isFinite));
   }
   for(const glue of detail.glue){
    assert.ok(detail.boards.some(b=>b.id===glue.owner),'La cola debe acompañar una pieza');
    assert.ok(Math.min(...glue.size)<=.05,'La cola representa una película');
   }
   for(const screw of detail.fasteners){
    const owner=detail.boards.find(b=>b.id===screw.owner),receiver=detail.boards.find(b=>b.id===screw.receiver);
    assert.ok(owner&&receiver,'Fijación sin tableros definidos');
    assert.ok(Math.abs(Math.hypot(...screw.direction)-1)<1e-8);
    assert.ok(inside(screw.start,owner),'El inicio debe estar en la cara de entrada '+detail.id+'/'+screw.id);
    assert.ok(inside(end(screw),receiver,.1),'La punta debe quedar dentro de la pieza receptora '+detail.id+'/'+screw.id);
    for(let t=.05;t<=screw.length;t+=.05){
     const p=add(screw.start,screw.direction.map(n=>n*t));
     assert.ok(inside(p,owner)||inside(p,receiver),'Recorrido vacío '+detail.id+'/'+screw.id);
    }
   }
   for(let i=0;i<detail.fasteners.length;i++)for(let j=i+1;j<detail.fasteners.length;j++){
    const a=detail.fasteners[i],b=detail.fasteners[j];
    for(let t=0;t<=a.length;t+=.05){
     const p=add(a.start,a.direction.map(n=>n*t));
     assert.ok(pointDistance(p,b)>(a.diameter+b.diameter)/2+.05,'Tornillos cruzados '+detail.id);
    }
   }
  }
  // Compare in furniture coordinates: separate closeups can share a board.
  const all=details.flatMap(detail=>detail.fasteners.map(s=>{
   assert.ok(s.globalStart?.length===3&&s.globalStart.every(Number.isFinite));
   return {...s,id:detail.id+'/'+s.id,start:s.globalStart};
  }));
  for(let i=0;i<all.length;i++)for(let j=i+1;j<all.length;j++){
   const a=all[i],b=all[j];
   for(let t=0;t<=a.length;t+=.05){
    const p=add(a.start,a.direction.map(n=>n*t));
    assert.ok(pointDistance(p,b)>(a.diameter+b.diameter)/2+.05,'Interferencia entre detalles: '+a.id+' / '+b.id);
   }
  }
 });
}
test('Decisiones explícitas de la repisa y bisagra, sin falsa plantilla',()=>{
 const details=Joinery.create(),shelf=details.find(d=>d.id==='shelf'),hinge=details.find(d=>d.id==='hinge');
 const short=shelf.boards.find(b=>b.id==='L03'),top=shelf.boards.find(b=>b.id==='P10');
 assert.equal(short.size[1],18);
 assert.ok(Math.abs(short.min[1]+18-top.min[1]-top.size[1]-1.9)<1e-8);
 assert.equal(hinge.fasteners.length,0);
 assert.match([...hinge.notes,...hinge.positions].join(' '),/herraje|bisagra real/i);
 assert.match([...hinge.notes,...hinge.positions].join(' '),/45/);
 assert.match([...hinge.notes,...hinge.positions].join(' '),/95/);
 assert.ok(!details.find(d=>d.id==='fixed').fasteners.some(s=>s.receiver==='P08'),'El refuerzo se encola, no se atraviesa con40mm');
 assert.ok(shelf.fasteners.every(s=>s.owner!=='P10'),'La repisa se apoya sin agregar tornillos');
});
