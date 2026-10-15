const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=process.env.GUIDE_URL||'http://127.0.0.1:8765';
const key='rascador-progress-v1';
const saved=page=>page.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
const ready=page=>page.waitForFunction(()=>globalThis.GuideApp);
async function openPending(page){
 await page.locator('[data-pending="balcony"]').evaluate(el=>{const details=el.closest('details');if(details)details.open=true});
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const context=await browser.newContext({viewport:{width:1440,height:900}});
  const page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await ready(page);
  assert.equal(await page.locator('#step-complete').count(),1,'Falta marcar paso completado');
  assert.match(await page.locator('#completion-summary').innerText(),/0\s*(de|\/)\s*12/);
  await page.waitForFunction(()=>GuideApp.parts.length>20);
  for(let step=0;step<12;step++){
   await page.evaluate(step=>GuideApp.selectStep(step),step);
   for(const selector of ['[data-card-parts]','[data-card-tools]','[data-card-fixings]','[data-card-checks]']){
    assert.ok((await page.locator(selector).innerText()).trim().length>15,`Paso ${step+1}: ${selector}`);
   }
  }
  assert.match(await page.locator('#completion-summary').innerText(),/0\s*(de|\/)\s*12/,'Navegar no completa pasos');
  await page.evaluate(()=>GuideApp.selectStep(6));
  assert.match(await page.locator('[data-card-fixings]').innerText(),/4\s*×\s*40/);
  await page.locator('#step-complete').focus();await page.locator('#step-complete').press('Space');
  assert.ok(await page.locator('#step-complete').isChecked());
  assert.equal(await page.evaluate(()=>document.activeElement.id),'step-complete','Marcar conserva el foco');
  assert.match(await page.locator('#completion-summary').innerText(),/1\s*(de|\/)\s*12/);
  await openPending(page);
  for(const id of ['balcony','glue','scratcher','hinges'])await page.locator(`[data-pending="${id}"]`).check();
  await page.locator('[data-tab="model"]').click();
  await page.locator('#param-W').fill('134');await page.locator('#param-D').fill('50');await page.locator('#param-f').fill('2.4');
  await page.locator('[data-tab="steps"]').click();
  let data=await saved(page);
  assert.deepEqual(data.completed,[6]);assert.equal(data.lastStep,6);
  assert.deepEqual(data.dimensions,{W:134,D:50,f:2.4});
  await page.reload();await ready(page);
  assert.equal(await page.evaluate(()=>GuideApp.state.step),6);
  assert.ok(await page.locator('#step-complete').isChecked());
  assert.equal(await page.locator('#param-W').inputValue(),'134');
  assert.equal(await page.locator('#param-D').inputValue(),'50');
  assert.equal(await page.locator('#param-f').inputValue(),'2.4');
  await openPending(page);
  for(const id of ['balcony','glue','scratcher','hinges'])assert.ok(await page.locator(`[data-pending="${id}"]`).isChecked());
  await page.locator('#step-complete').uncheck();await page.locator('[data-pending="glue"]').uncheck();
  await page.evaluate(()=>GuideApp.selectStep(2));
  assert.match(await page.locator('#step-content').innerText(),/98,5/,'Las instrucciones del frente usan el ancho guardado');
  const other=await context.newPage();await other.goto(url);await ready(other);
  assert.equal(await other.evaluate(()=>GuideApp.state.step),2);
  assert.match(await other.locator('#completion-summary').innerText(),/0\s*(de|\/)\s*12/);
  data=await saved(other);assert.equal(data.pending.glue,false);await other.close();
  await page.waitForFunction(()=>GuideApp.parts.length>20);
  fs.mkdirSync('tests/screenshots',{recursive:true});
  await page.evaluate(()=>GuideApp.selectStep(6));
  await page.screenshot({path:'tests/screenshots/progress-desktop.png',fullPage:true});
  await page.setViewportSize({width:360,height:800});
  await page.locator('#next-step').click();
  assert.ok(await page.locator('#step-content h2').evaluate(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<innerHeight}),'Al avanzar se debe ver el título del nuevo paso');
  assert.equal(await page.evaluate(()=>document.activeElement.tagName),'H2');
  await page.locator('#prev-step').click();
  await page.screenshot({path:'tests/screenshots/progress-mobile.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.emulateMedia({colorScheme:'dark'});
  await page.screenshot({path:'tests/screenshots/progress-dark.png',fullPage:true,animations:'disabled'});
  for(let step=0;step<12;step++){
   await page.evaluate(step=>GuideApp.selectStep(step),step);await page.locator('#step-complete').check();
  }
  assert.match(await page.locator('#completion-summary').innerText(),/12\s*(de|\/)\s*12/);
  await page.reload();await ready(page);
  assert.match(await page.locator('#completion-summary').innerText(),/12\s*(de|\/)\s*12/);
  assert.deepEqual(errors,[]);await context.close();

  // Invalid storage must never inject markup or make navigation unusable.
  const scenarios=[
   {value:'{oops',step:0,count:0},
   {value:JSON.stringify({version:99,lastStep:9,completed:[1]}),step:0,count:0},
   {value:JSON.stringify({version:1,lastStep:99,completed:[0,0,11,99,-1,'2',null],pending:{balcony:true,glue:'true',scratcher:false,hinges:true},dimensions:{W:999,D:45.5,f:'2.4'}}),step:0,count:2},
   {value:JSON.stringify({version:1,lastStep:'<img src=x onerror=alert(1)>',completed:{bad:true},pending:null,dimensions:null}),step:0,count:0}
  ];
  for(const scenario of scenarios){
   const c=await browser.newContext();
   await c.addInitScript(({key,value})=>localStorage.setItem(key,value),{key,value:scenario.value});
   await c.route(/^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//,route=>route.abort());
   const p=await c.newPage(),failures=[];p.on('pageerror',e=>failures.push(e.message));
   await p.goto(url);await ready(p);
   assert.equal(await p.evaluate(()=>GuideApp.state.step),scenario.step);
   assert.match(await p.locator('#completion-summary').innerText(),new RegExp(scenario.count+'\\s*(de|/)\\s*12'));
   assert.equal(await p.locator('#param-W').inputValue(),'135');assert.equal(await p.locator('#param-D').inputValue(),'49');assert.equal(await p.locator('#param-f').inputValue(),'1.8');
   await p.locator('#next-step').click();assert.equal(await p.evaluate(()=>GuideApp.state.step),1);
   assert.deepEqual(failures,[]);await c.close();
  }
  for(const failure of ['read','write']){
   const c=await browser.newContext({viewport:{width:360,height:800}});
   await c.addInitScript(failure=>{
    if(failure==='read')Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked storage')}});
    else Storage.prototype.setItem=function(){throw new Error('quota exceeded')};
   },failure);
   await c.route(/^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//,r=>r.abort());
   const p=await c.newPage(),failures=[];p.on('pageerror',e=>failures.push(e.message));
   await p.goto(url);await ready(p);await p.locator('#step-complete').check();
   await p.locator('#next-step').click();
   assert.match(await p.locator('#progress-storage-status').innerText(),/no se (pudo|puede)|solo|mientras/i);
   assert.match(await p.locator('#completion-summary').innerText(),/1\s*(de|\/)\s*12/);
   assert.ok((await p.locator('[data-card-tools]').innerText()).length>20);
   assert.deepEqual(failures,[]);await c.close();
  }
  console.log('PASS: 12 fichas, progreso manual y teclado, pendientes, restauración de paso/medidas, nueva pestaña, datos inválidos, almacenamiento bloqueado y fallback sin3D; escritorio/360px.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
