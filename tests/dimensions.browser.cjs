const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const url=process.env.GUIDE_URL||'http://127.0.0.1:8765';
const labels=page=>page.locator('#piece-dimensions .piece-dimension-label:visible');
async function readable(page){
 const result=await page.evaluate(()=>{
  const stage=document.querySelector('#stage').getBoundingClientRect();
  return {stage:{x:stage.x,y:stage.y,right:stage.right,bottom:stage.bottom},boxes:[...document.querySelectorAll('#piece-dimensions .piece-dimension-label')].filter(el=>el.getBoundingClientRect().width).map(el=>{
   const r=el.getBoundingClientRect();return {text:el.textContent,x:r.x,y:r.y,right:r.right,bottom:r.bottom};
  })};
 });
 for(const b of result.boxes){
  assert.ok(b.x>=result.stage.x&&b.y>=result.stage.y&&b.right<=result.stage.right&&b.bottom<=result.stage.bottom,'Cota fuera del visor: '+b.text);
 }
 for(let i=0;i<result.boxes.length;i++)for(let j=i+1;j<result.boxes.length;j++){
  const a=result.boxes[i],b=result.boxes[j];
  assert.ok(a.right<=b.x||b.right<=a.x||a.bottom<=b.y||b.bottom<=a.y,'Cotas superpuestas: '+a.text+' / '+b.text);
 }
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try{
  const page=await browser.newPage({viewport:{width:1440,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url);await page.waitForFunction(()=>globalThis.GuideApp?.parts.length>20);
  await page.locator('[data-tab="cuts"]').click();
  assert.equal(await labels(page).count(),3,'Cada pieza debe tener tres cotas flotantes');
  assert.equal(await page.locator('#piece-dimensions').getAttribute('aria-hidden'),'true');
  assert.equal(await page.locator('#piece-dimensions').evaluate(el=>getComputedStyle(el).pointerEvents),'none');
  assert.ok(await page.locator('#piece-dimensions [marker-end]').count()>0,'Las cotas deben tener flechas');
  const expected={P01:['135 cm','49 cm','18 mm'],P02:['135 cm','41,4 cm','15 mm'],P03:['135 cm','41,4 cm','15 mm'],P04:['46 cm','41,4 cm','15 mm'],P05:['46 cm','41,4 cm','15 mm'],P06:['46 cm','41,4 cm','15 mm'],P07:['37 cm','50 cm','18 mm'],P08:['33 cm','33 cm','18 mm'],P09:['97,5 cm','50 cm','18 mm'],P10:['34 cm','18 cm','18 mm'],L01:['46 cm','1,9 cm','4,1 cm'],L02:['34 cm','1,9 cm','4,1 cm'],L03:['18 cm','1,9 cm','4,1 cm'],L04:['60 cm','1,9 cm','4,1 cm']};
  fs.mkdirSync('tests/screenshots',{recursive:true});
  for(const width of [1440,360]){
   await page.setViewportSize({width,height:width===360?800:900});
   for(const [id,values] of Object.entries(expected)){
    await page.locator('#piece-select').selectOption(id);
    await page.waitForFunction(()=>document.querySelectorAll('#piece-dimensions .piece-dimension-label').length===3);
    const texts=await labels(page).allTextContents();
    assert.equal(texts.length,3,id);
    for(const value of values)assert.ok(texts.some(text=>text.includes(value)),id+' falta '+value+' en '+texts.join(' / '));
    await readable(page);
    if(['P01','P03','P09','L03'].includes(id))await page.locator('#viewer').screenshot({path:`tests/screenshots/dimensions-${id}-${width}.png`});
   }
   await page.locator('#piece-select').selectOption('P03');
   for(const [mode,values] of [['entries',['25 cm','30 cm']],['slot',['12 cm','3 cm']],['vents',['20 mm']]]){
    await page.locator('#piece-detail-select').selectOption(mode);
    const texts=await labels(page).allTextContents();
    for(const value of values)assert.ok(texts.some(text=>text.includes(value)),mode+' falta '+value);
    await readable(page);
    await page.locator('#viewer').screenshot({path:`tests/screenshots/dimensions-${mode}-${width}.png`});
   }
   await page.locator('#piece-detail-select').selectOption('overall');
  }
  await page.setViewportSize({width:1440,height:900});
  await page.locator('#piece-select').selectOption('P01');
  await page.locator('#piece-dimensions-toggle').click();assert.equal(await labels(page).count(),0);
  await page.locator('#piece-dimensions-toggle').press('Enter');assert.equal(await labels(page).count(),3);
  await page.locator('#viewer').scrollIntoViewIfNeeded();
  const before=await page.locator('#piece-dimensions').innerHTML();
  const canvas=await page.locator('#stage canvas').boundingBox();
  await page.mouse.move(canvas.x+canvas.width/2,canvas.y+canvas.height/2);
  await page.mouse.down();await page.mouse.move(canvas.x+canvas.width/2+80,canvas.y+canvas.height/2+30,{steps:8});await page.mouse.up();
  await page.waitForFunction(previous=>document.querySelector('#piece-dimensions').innerHTML!==previous,before);
  await readable(page);
  const beforeZoom=await page.locator('#piece-dimensions').innerHTML();
  await page.mouse.wheel(0,-100);
  await page.waitForFunction(previous=>document.querySelector('#piece-dimensions').innerHTML!==previous,beforeZoom);
  await readable(page);
  for(const view of ['front','top','side','iso']){await page.locator(`[data-view="${view}"]`).click();await readable(page)}
  await page.locator('[data-tab="model"]').click();assert.equal(await labels(page).count(),0);
  await page.locator('#param-W').fill('134');await page.locator('#param-D').fill('48');
  await page.locator('[data-tab="cuts"]').click();await page.locator('#piece-select').selectOption('P09');
  const changed=await labels(page).allTextContents();assert.ok(changed.some(t=>t.includes('96,5 cm')));assert.ok(changed.some(t=>t.includes('49 cm')));
  await page.locator('[data-tab="steps"]').click();assert.equal(await labels(page).count(),0);
  await page.locator('[data-tab="cuts"]').click();await page.emulateMedia({colorScheme:'dark'});
  await page.locator('#viewer').screenshot({path:'tests/screenshots/dimensions-dark.png'});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  assert.deepEqual(errors,[]);
  console.log('PASS: 14 piezas, medidas y flechas, detalle frontal, órbita, vistas, parámetros, controles y legibilidad escritorio/360px.');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exit(1)});
