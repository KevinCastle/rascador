const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=process.env.GUIDE_URL||'http://127.0.0.1:8765';
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>globalThis.GuideApp);
  await page.locator('[data-tab="cuts"]').click();
  fs.mkdirSync('tests/screenshots',{recursive:true});
  for(const width of [1440,488,360]){
   await page.setViewportSize({width,height:900});
   for(const thickness of [18,15]){
    const plan=page.locator(`.sheet-plan[data-thickness="${thickness}"]`);
    assert.equal(await plan.locator('.sheet-piece[data-piece-id]').count(),5);
    const text=await plan.innerText();
    assert.match(text,/244/);assert.match(text,/122/);assert.match(text,/3 mm/);
    const labels=await plan.locator('.sheet-piece-label').evaluateAll(nodes=>nodes.map(n=>{
     const r=n.getBoundingClientRect(),svg=n.ownerSVGElement.getBoundingClientRect();
     return {text:n.textContent,x:r.x,y:r.y,right:r.right,bottom:r.bottom,svg:{x:svg.x,y:svg.y,right:svg.right,bottom:svg.bottom}};
    }));
    assert.equal(labels.length,5);
    for(const a of labels){
     assert.ok(a.x>=a.svg.x&&a.y>=a.svg.y&&a.right<=a.svg.right&&a.bottom<=a.svg.bottom,'Etiqueta fuera del plano: '+a.text);
    }
    for(let i=0;i<labels.length;i++)for(let j=i+1;j<labels.length;j++){
     const a=labels[i],b=labels[j];
     assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'Etiquetas superpuestas: '+a.text+'/'+b.text);
    }
    await plan.screenshot({path:`tests/screenshots/cutting-${thickness}-${width}.png`});
   }
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Desbordamiento de página');
  }
  // Parameter changes must replace both diagrams, not leave stale measurements.
  await page.locator('[data-tab="model"]').click();
  await page.locator('#param-W').fill('136');await page.locator('#param-D').fill('53');
  await page.locator('[data-tab="cuts"]').click();
  assert.match(await page.locator('.sheet-plan[data-thickness="15"] .sheet-piece-label').allTextContents().then(a=>a.join(' ')),/136/);
  assert.match(await page.locator('.sheet-plan[data-thickness="18"] .sheet-piece-label').allTextContents().then(a=>a.join(' ')),/98,5/);
  await page.locator('.piece-button[data-piece="P06"]').focus();await page.locator('.piece-button[data-piece="P06"]').press('Enter');
  assert.equal(await page.locator('#piece-select').inputValue(),'P06');
  await page.emulateMedia({colorScheme:'dark'});
  assert.ok(await page.locator('.sheet-callout-label').evaluate(n=>getComputedStyle(n).fill===getComputedStyle(document.body).color),'P10 debe contrastar sobre el sobrante en modo oscuro');
  for(const thickness of [18,15])await page.locator(`.sheet-plan[data-thickness="${thickness}"]`).screenshot({path:`tests/screenshots/cutting-${thickness}-dark.png`});
  assert.deepEqual(errors,[]);
  const fallback=await browser.newPage({viewport:{width:360,height:800}});
  await fallback.route(/^https:\/\/(cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)\//,r=>r.abort());
  await fallback.goto(url);await fallback.waitForFunction(()=>globalThis.GuideApp);
  await fallback.locator('[data-tab="cuts"]').click();
  assert.equal(await fallback.locator('.sheet-plan .sheet-piece').count(),10,'Los planos funcionan sin3D');
  const missing=await browser.newPage();
  await missing.route('**/cutting.js',r=>r.abort());
  await missing.goto(url);await missing.waitForFunction(()=>globalThis.GuideApp);
  await missing.locator('[data-tab="cuts"]').click();
  assert.equal(await missing.locator('.sheet-fallback').count(),2);
  assert.equal(await missing.locator('.piece-button[data-piece="P06"]').count(),1,'Conservar tablas cuando faltan los planos');
  console.log('PASS: planos18/15, etiquetas sin colisiones, medidas dinámicas, teclado/3D, escritorio1440 y móvil488/360, oscuro y sinCDN.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
