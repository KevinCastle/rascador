const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=process.env.GUIDE_URL||'http://127.0.0.1:8765';
const cases=[['base',6],['corner',6],['cleat',7],['shelf',7],['fixed',8],['hinge',10]];
async function open(page,id,step){
 await page.evaluate(step=>{GuideApp.selectTab('steps');GuideApp.selectStep(step)},step);
 await page.locator('#joint-select').selectOption(id);await page.locator('#joint-open').click();
 await page.waitForFunction(id=>GuideApp.state.jointId===id&&GuideApp.jointGroup?.visible,id);
}
async function assertLabels(page){
 const result=await page.evaluate(()=>{
  const rect=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,right:r.right,bottom:r.bottom}};
  return {stage:rect(document.querySelector('#stage')),labels:[...document.querySelectorAll('.joint-piece-label')].filter(el=>!el.hidden).map(el=>({...rect(el),text:el.textContent}))};
 });
 for(const l of result.labels)assert.ok(l.x>=result.stage.x&&l.right<=result.stage.right&&l.y>=result.stage.y&&l.bottom<=result.stage.bottom,'Etiqueta fuera del visor '+l.text);
 for(let i=0;i<result.labels.length;i++)for(let j=i+1;j<result.labels.length;j++){
  const a=result.labels[i],b=result.labels[j];
  assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'Etiquetas superpuestas '+a.text+'/'+b.text);
 }
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>globalThis.GuideApp?.parts.length>20);
  for(let step=0;step<12;step++){
   await page.evaluate(step=>GuideApp.selectStep(step),step);
   assert.equal(await page.locator('#joint-select option').count(),6,'Todas las uniones deben ser descubribles en cada paso');
  }
  fs.mkdirSync('tests/screenshots',{recursive:true});
  for(const width of [1440,488,360]){
   await page.setViewportSize({width,height:width===360?800:900});
   for(const [id,step] of cases){
    await open(page,id,step);
    assert.equal(await page.evaluate(()=>GuideApp.state.jointState),'context');
    assert.ok(await page.locator('#joint-glue').isDisabled());
    assert.ok(await page.locator('#joint-fixings').isDisabled());
    const location=await page.evaluate(()=>{
     const box=id=>{
      const mesh=GuideApp.jointGroup.children.find(p=>p.name===id);
      const b=new THREE.Box3().setFromObject(mesh),size=b.getSize(new THREE.Vector3());
      const source=GuideApp.parts.find(p=>p.name===id);
      return {min:b.min.toArray(),size:size.toArray(),ownGeometry:mesh.geometry!==source.geometry,kind:mesh.userData.kind};
     };
     return {base:box('P01'),divider:box('P06'),lid:box('P09'),state:{...GuideApp.state}};
    });
    assert.equal(location.base.size[0],location.state.W);
    assert.equal(location.base.size[2],location.state.D);
    assert.ok(Math.abs(location.divider.min[0]-35.5)<1e-6,'Tabique en su posición real, no al centro');
    assert.ok(Math.abs(location.divider.size[1]-41.4)<1e-5,'Tabique completo');
    assert.ok(location.base.ownGeometry&&location.divider.ownGeometry,'No compartir geometría que se eliminará al cerrar');
    assert.ok(Math.abs(location.lid.min[1]-location.state.f-43.2)<1e-5,'Tapa en posición original, sin apertura heredada');
    await page.locator('#viewer').screenshot({path:`tests/screenshots/joint-${id}-context-${width}.png`});
    await assertLabels(page);
    await page.locator('[data-joint-state="separated"]').click();
    assert.match(await page.locator('#joint-description').innerText(),/propuest|presenta/i);
    assert.ok((await page.locator('#joint-description').innerText()).length>100);
    assert.equal(await page.locator('#lid-button').isVisible(),false);
    assert.equal(await page.locator('.dimension:visible').count(),0,'No deben quedar cotas del modo anterior');
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.locator('#joint-glue').uncheck();await page.locator('#joint-glue').check();
    if(id!=='hinge'){
     await page.locator('#joint-fixings').uncheck();await page.locator('#joint-fixings').check();
     await page.locator('[data-joint-state="assembled"]').click();
     assert.equal(await page.locator('[data-joint-state="assembled"]').getAttribute('aria-pressed'),'true');
     await page.locator('#viewer').screenshot({path:`tests/screenshots/joint-${id}-assembled-${width}.png`});
     await page.locator('[data-joint-state="separated"]').click();
    }else{
     assert.ok(await page.locator('[data-joint-state="assembled"]').isDisabled(),'Bisagra no debe fingir montaje resuelto');
     assert.ok(await page.locator('#joint-fixings').isDisabled(),'Sin agujeros inventados');
    }
    await page.locator('#viewer').screenshot({path:`tests/screenshots/joint-${id}-separated-${width}.png`});
    await assertLabels(page);
    if(id==='hinge'){
     assert.equal(await page.locator('.joint-piece-label').filter({hasText:'H02'}).count(),1);
     assert.ok(await page.locator('[data-joint-glue-legend]').isVisible());
     assert.equal(await page.locator('[data-joint-fixings-legend]').isVisible(),false);
    }
    // Reframing must preserve choices, including the assembled view.
    await page.locator('#joint-glue').uncheck();
    if(id!=='hinge'){
     await page.locator('[data-joint-state="assembled"]').click();
     await page.locator('#joint-fixings').uncheck();
    }
    const before=await page.evaluate(()=>[GuideApp.state.jointState,GuideApp.state.jointGlue,GuideApp.state.jointFixings]);
    await page.locator('#joint-open').click();
    assert.deepEqual(await page.evaluate(()=>[GuideApp.state.jointState,GuideApp.state.jointGlue,GuideApp.state.jointFixings]),before);
    for(const view of ['front','top','side','iso'])await page.locator(`[data-view="${view}"]`).click();
    assert.ok(await page.evaluate(()=>GuideApp.jointGroup?.visible));
    await page.locator('#joint-return').click();
    assert.equal(await page.evaluate(()=>document.activeElement.id),'joint-open');
    assert.ok(await page.evaluate(()=>!GuideApp.state.jointId));
    assert.equal(await page.evaluate(()=>GuideApp.state.step),step);
   }
  }
  // Selecting another detail must replace the active scene without changing the build step.
  await open(page,'base',0);
  await page.locator('#joint-select').selectOption('shelf');
  assert.equal(await page.evaluate(()=>GuideApp.state.step),0);
  assert.equal(await page.evaluate(()=>GuideApp.state.jointId),'shelf');
  assert.equal(await page.evaluate(()=>GuideApp.state.jointState),'context');
  await page.locator('[data-joint-state="separated"]').click();
  assert.match(await page.locator('#viewer-note').innerText(),/tramo/i);
  assert.ok(await page.locator('.joint-piece-label').filter({hasText:/tramo/i}).count()>0);
  assert.doesNotMatch(await page.locator('#joint-description').innerText(),/\(tramo\)\s*\(tramo\)/);
  // Dry assembly shares the geometry, but never suggests glue.
  await open(page,'base',5);assert.ok(await page.locator('#joint-glue').isDisabled());assert.equal(await page.locator('#joint-glue').isChecked(),false);
  await page.evaluate(()=>GuideApp.selectStep(6));assert.ok(await page.evaluate(()=>!GuideApp.state.jointId));
  // Free-view settings and completion remain independent.
  await page.locator('#step-complete').check();
  await page.locator('[data-tab="model"]').click();await page.locator('#explode').fill('60');
  await page.locator('[data-layer="structure"]').uncheck();
  await open(page,'base',6);
  assert.equal(await page.evaluate(()=>GuideApp.jointGroup.children.find(p=>p.name==='P06').position.x),36.25,'La separación libre no debe afectar la ubicación');
  await page.locator('[data-tab="model"]').click();
  assert.ok(await page.evaluate(()=>!GuideApp.state.jointId));
  assert.equal(await page.evaluate(()=>GuideApp.state.explode),.6);
  assert.equal(await page.locator('[data-layer="structure"]').isChecked(),false);
  await page.locator('#param-W').fill('120');await page.locator('#param-D').fill('45');
  await open(page,'shelf',7);await page.locator('#joint-return').click();
  await page.locator('[data-tab="cuts"]').click();await page.locator('#piece-select').selectOption('L03');
  assert.match(await page.locator('#piece-info').innerText(),/18/);
  await page.locator('[data-tab="steps"]').click();await page.evaluate(()=>GuideApp.selectStep(6));assert.ok(await page.locator('#step-complete').isChecked());
  await page.emulateMedia({colorScheme:'dark'});await open(page,'cleat',7);
  await page.locator('#viewer').screenshot({path:'tests/screenshots/joint-dark.png',animations:'disabled'});
  assert.deepEqual(errors,[]);
  // Text remains available without WebGL; missing detail data does not break the guide.
  for(const dependency of ['cdn','joinery']){
   const p=await browser.newPage({viewport:{width:360,height:800}}),failures=[];p.on('pageerror',e=>failures.push(e.message));
   if(dependency==='cdn')await p.route(/^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//,r=>r.abort());
   else await p.route('**/joinery.js',r=>r.abort());
   await p.goto(url);await p.waitForFunction(()=>globalThis.GuideApp);
   await p.evaluate(()=>GuideApp.selectStep(7));
   assert.ok((await p.locator('#step-content').innerText()).length>200);
   if(dependency==='cdn')assert.ok((await p.locator('#joint-description').innerText()).length>100);
   await p.locator('#next-step').click();assert.equal(await p.evaluate(()=>GuideApp.state.step),8);
   assert.deepEqual(failures,[]);await p.close();
  }
  console.log('PASS: seis uniones desde12pasos, ubicación real, piezas completas, etiquetas488/360/escritorio, separación, cola, fijaciones, retorno, progreso independiente y fallback.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
