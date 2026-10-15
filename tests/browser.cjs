const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=process.env.GUIDE_URL||'http://127.0.0.1:8765';
async function setRange(page,id,value){await page.locator(id).fill(String(value));}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  fs.mkdirSync('tests/screenshots',{recursive:true});
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  assert.equal((await page.goto(url)).status(),200);
  await page.waitForFunction(()=>globalThis.GuideApp?.parts.length>20);
  assert.equal(await page.locator('#stage canvas').count(),1);
  await page.screenshot({path:'tests/screenshots/desktop.png',fullPage:true});
  for(let i=0;i<12;i++){
   assert.equal(await page.evaluate(()=>GuideApp.state.step),i);
   assert.ok((await page.locator('#step-content').innerText()).length>150);
   if(i<11)await page.locator('#next-step').click();
  }
  assert.ok(await page.locator('#next-step').isDisabled());
  await page.locator('[data-tab="model"]').click();
  await setRange(page,'#param-W',134);
  assert.equal(await page.evaluate(()=>GuideApp.derive().anteroom),44.5);
  assert.equal(await page.evaluate(()=>GuideApp.parts.find(p=>p.name==='P09').geometry.parameters.width),96.5);
  await setRange(page,'#param-D',45);
  assert.match(await page.locator('#fit-warnings').innerText(),/alfombra/);
  await setRange(page,'#param-W',120);
  assert.match(await page.locator('#fit-warnings').innerText(),/repisa/);
  await setRange(page,'#param-W',135);await setRange(page,'#param-D',49);
  await page.locator('#lid-button').click();
  await page.waitForFunction(()=>GuideApp.state.angle===95*Math.PI/180);
  assert.ok(await page.evaluate(()=>GuideApp.parts.find(p=>p.name==='P09').parent===GuideApp.parts.find(p=>p.name==='C01').parent));
  const getLidCenters=()=>page.evaluate(()=>['P09','C01'].map(id=>GuideApp.parts.find(p=>p.name===id).getWorldPosition(new THREE.Vector3()).toArray()));
  const assembled=await getLidCenters();
  await setRange(page,'#explode',100);
  const exploded=await getLidCenters();
  for(let i=0;i<2;i++){
   assert.ok(Math.abs(exploded[i][0]-assembled[i][0])<.01);
   assert.ok(Math.abs(exploded[i][1]-assembled[i][1]-[55,75][i])<.01,'La explosión de la tapa abierta debe ser vertical');
   assert.ok(Math.abs(exploded[i][2]-assembled[i][2])<.01);
  }
  await setRange(page,'#explode',0);
  await page.screenshot({path:'tests/screenshots/lid-open.png',fullPage:true});
  await page.locator('#lid-button').click();
  await page.waitForFunction(()=>GuideApp.state.angle===0);
  await setRange(page,'#explode',100);
  await page.locator('#stage').screenshot({path:'tests/screenshots/exploded.png'});
  await page.setViewportSize({width:360,height:800});
  await page.locator('#stage').screenshot({path:'tests/screenshots/exploded-mobile.png'});
  await page.setViewportSize({width:1440,height:900});
  await setRange(page,'#explode',0);
  assert.ok(await page.evaluate(()=>GuideApp.parts.every(p=>p.position.distanceTo(p.userData.base)<1e-8)));
  await page.locator('[data-layer="scratcher"]').uncheck();
  assert.ok(await page.evaluate(()=>GuideApp.parts.filter(p=>p.userData.layer==='scratcher').every(p=>!p.visible)));
  await page.locator('[data-layer="scratcher"]').check();
  await page.locator('#dimensions').click();
  assert.equal(await page.locator('.dimension:visible').count(),6);
  for(const name of ['front','top','side','iso'])await page.locator('[data-view="'+name+'"]').click();
  await page.locator('#dimensions').click();
  await page.locator('[data-tab="materials"]').click();
  assert.match(await page.locator('#budget-total').innerText(),/190.307/);
  await page.locator('[data-tab="steps"]').click();
  await page.evaluate(()=>GuideApp.selectStep(0));
  await page.setViewportSize({width:360,height:800});
  await page.screenshot({path:'tests/screenshots/mobile.png',fullPage:true});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  await page.locator('#panel-toggle').click();
  assert.equal(await page.locator('#panel-toggle').getAttribute('aria-expanded'),'false');
  await page.locator('#panel-toggle').click();
  await page.locator('[data-tab="model"]').click();
  await page.locator('[data-tab="model"]').press('ArrowRight');
  assert.equal(await page.evaluate(()=>GuideApp.state.tab),'cuts');
  for(const name of ['model','cuts','materials','steps']){
   await page.locator('[data-tab="'+name+'"]').click();
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Overflow '+name);
  }
  await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});
  await page.screenshot({path:'tests/screenshots/mobile-dark.png',fullPage:true});
  assert.deepEqual(errors,[]);
  const fallback=await browser.newPage({viewport:{width:360,height:800}});
  await fallback.route('https://**/*',r=>r.abort());
  await fallback.goto(url);
  await fallback.waitForFunction(()=>document.querySelector('#fallback-title')?.textContent==='La guía sigue contigo.');
  await fallback.locator('#next-step').click();
  assert.equal(await fallback.evaluate(()=>GuideApp.state.step),1);
  await fallback.locator('[data-tab="cuts"]').click();
  assert.match(await fallback.locator('#cuts-content').innerText(),/97,5/);
  console.log('PASS: desktop, 360px, 12 steps, parameters, lid, explosion, layers, views, dimensions, budget, tabs, dark mode and CDN fallback; no page errors.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
