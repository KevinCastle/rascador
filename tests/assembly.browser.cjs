const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=process.env.GUIDE_URL||'http://127.0.0.1:8765';
const visible=page=>page.evaluate(()=>[...new Set(GuideApp.parts.filter(p=>p.visible).map(p=>p.userData.id))].sort());
async function assertLabelsReadable(page){
 const boxes=await page.locator('.part-label:visible').evaluateAll(nodes=>nodes.map(el=>{const b=el.getBoundingClientRect();return {id:el.textContent,x:b.x,y:b.y,right:b.right,bottom:b.bottom}}));
 for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++){
  const a=boxes[i],b=boxes[j];
  assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'Etiquetas superpuestas: '+a.id+' / '+b.id);
 }
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>globalThis.GuideApp?.parts.length>20);
  fs.mkdirSync('tests/screenshots',{recursive:true});
  await page.evaluate(()=>GuideApp.selectStep(1));
  assert.equal(await page.evaluate(()=>GuideApp.parts.find(p=>p.name==='P03').geometry.type),'BoxGeometry','El frente todavía no tiene aberturas al cortar los tableros');
  await page.locator('#stage').screenshot({path:'tests/screenshots/cut-blanks.png'});
  await assertLabelsReadable(page);
  await page.setViewportSize({width:360,height:800});
  await page.locator('#stage').screenshot({path:'tests/screenshots/cut-blanks-mobile.png'});
  await assertLabelsReadable(page);
  await page.setViewportSize({width:1440,height:900});
  await page.evaluate(()=>GuideApp.selectStep(3));
  await page.locator('#stage').screenshot({path:'tests/screenshots/sanding-pieces.png'});
  await page.evaluate(()=>GuideApp.selectStep(5));
  assert.ok((await visible(page)).includes('R01'));
  await page.locator('[data-dryfit="disassembled"]').click();
  assert.ok(!(await visible(page)).includes('R01'));
  assert.ok(await page.evaluate(()=>GuideApp.parts.find(p=>p.name==='P03').position.distanceTo(GuideApp.parts.find(p=>p.name==='P03').userData.base)>0));
  await page.locator('#stage').screenshot({path:'tests/screenshots/dry-disassembled.png'});
  await page.locator('[data-dryfit="mounted"]').click();
  assert.ok((await visible(page)).includes('R01'));
  await page.evaluate(()=>GuideApp.selectStep(6));
  let ids=await visible(page);
  assert.ok(ids.includes('P01')&&ids.includes('P06'),'La caja aparece en el armado definitivo');
  assert.ok(!ids.includes('P09')&&!ids.includes('R03')&&!ids.includes('P10'),'Las piezas futuras no deben aparecer');
  await page.evaluate(()=>GuideApp.selectStep(7));ids=await visible(page);
  assert.ok(ids.includes('P10')&&ids.includes('L01')&&!ids.includes('P07'));
  await page.evaluate(()=>GuideApp.selectStep(8));ids=await visible(page);
  assert.ok(ids.includes('P07')&&ids.includes('P08')&&!ids.includes('P09'));
  await page.evaluate(()=>GuideApp.selectStep(10));ids=await visible(page);
  assert.ok(ids.includes('P09')&&ids.includes('C01')&&!ids.includes('R03'));
  await page.evaluate(()=>GuideApp.selectStep(11));assert.ok((await visible(page)).includes('R03'));
  await page.evaluate(()=>GuideApp.selectStep(2));assert.deepEqual(await visible(page),['P03']);
  assert.equal(await page.evaluate(()=>GuideApp.parts.find(p=>p.name==='P03').geometry.parameters.shapes.holes.length),6);
  await page.screenshot({path:'tests/screenshots/step-front-cut.png',fullPage:true});
  await page.locator('[data-tab="model"]').click();
  await page.locator('#explode').fill('80');
  await page.locator('[data-layer="structure"]').uncheck();
  await page.locator('#lid-button').click();
  await page.waitForFunction(()=>GuideApp.state.angle===95*Math.PI/180);
  await page.locator('[data-tab="steps"]').click();
  await page.evaluate(()=>GuideApp.selectStep(7));
  assert.ok((await visible(page)).includes('P01'),'Los ajustes libres no ocultan el armado');
  await page.screenshot({path:'tests/screenshots/step-shelf.png',fullPage:true});
  await page.locator('[data-tab="cuts"]').click();
  assert.equal(await page.locator('#piece-select').count(),1);
  for(const id of ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10','L01','L02','L03','L04']){
   await page.locator('#piece-select').selectOption(id);
   assert.deepEqual(await visible(page),[id],id+' debe poder inspeccionarse de forma aislada');
   assert.ok((await page.locator('#piece-info').innerText()).length>20);
  }
  await page.locator('#piece-select').selectOption('P03');
  assert.deepEqual(await visible(page),['P03']);
  assert.match(await page.locator('#piece-info').innerText(),/135/);
  await page.screenshot({path:'tests/screenshots/piece-front.png',fullPage:true});
  await page.locator('#piece-select').selectOption('L03');
  assert.deepEqual(await visible(page),['L03']);
  assert.match(await page.locator('#piece-info').innerText(),/18/);
  const length=await page.evaluate(()=>{
   const p=GuideApp.parts.find(p=>p.name==='L03');p.updateWorldMatrix(true,false);
   const size=new THREE.Box3().setFromObject(p).getSize(new THREE.Vector3());return Math.max(size.x,size.y,size.z);
  });
  assert.ok(Math.abs(length-18)<1e-6,'El listón aislado debe mostrar su largo de corte de18cm');
  await page.locator('[data-tab="model"]').click();
  assert.equal(await page.evaluate(()=>GuideApp.state.explode),.8);
  assert.equal(await page.locator('[data-layer="structure"]').isChecked(),false);
  assert.equal(await page.locator('#lid-button').getAttribute('aria-pressed'),'true');
  await page.locator('#param-W').fill('134');
  await page.locator('[data-tab="cuts"]').click();
  await page.locator('#piece-select').selectOption('P09');
  assert.match(await page.locator('#piece-info').innerText(),/96,5/);
  await page.setViewportSize({width:360,height:800});
  await page.screenshot({path:'tests/screenshots/piece-mobile.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#piece-select').selectOption('P03');
  assert.deepEqual(await visible(page),['P03']);
  await page.locator('[data-tab="steps"]').click();
  await page.evaluate(()=>GuideApp.selectStep(6));
  await page.locator('#content-steps .viewer-jump').click();
  assert.ok(await page.locator('#viewer').evaluate(el=>Math.abs(el.getBoundingClientRect().top)<5));
  await page.screenshot({path:'tests/screenshots/assembly-mobile.png',fullPage:true});
  assert.deepEqual(errors,[]);
  console.log('PASS: progressive assembly, preparatory front view, model-setting independence, isolated pieces, L03 cut length, dynamic sizes and mobile layout.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
