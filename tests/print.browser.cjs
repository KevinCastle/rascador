const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
const url=process.env.GUIDE_URL||'http://127.0.0.1:8765';
(async()=>{const browser=await chromium.launch({headless:true});try{
 const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);await page.waitForFunction(()=>globalThis.GuideApp);
 assert.equal(await page.locator('#print-open').count(),1,'Falta acceso a versión imprimible');
 await page.locator('[data-tab="materials"]').click();await page.locator('[data-material-id="Bisagras Simples"] [name="owned"]').check();
 const saved=await page.evaluate(()=>({state:JSON.stringify(GuideApp.state),progress:localStorage.getItem('rascador-progress-v1'),materials:localStorage.getItem('rascador-materials-v1')}));
 await page.locator('#print-open').click();assert.equal(await page.locator('.print-page:visible').count(),6);
 const content=await page.locator('#print-pages').textContent();assert.doesNotMatch(content,/Sodimac|Falabella|FIXSER|Scanavini|Kölor|Mamut|PRO RACK|Agorex|\$|CLP|https?:/i);
 assert.equal(await page.locator('#print-pages a').count(),0);assert.ok(content.includes('Aporta cliente'));
 await page.locator('#print-close').click();assert.ok(await page.locator('#print-open').isVisible());
 assert.deepEqual(await page.evaluate(()=>({state:JSON.stringify(GuideApp.state),progress:localStorage.getItem('rascador-progress-v1'),materials:localStorage.getItem('rascador-materials-v1')})),saved);
 // Native print must rebuild current dimensions even without opening preview first.
 await page.locator('[data-tab="model"]').click();await page.locator('#param-W').fill('134');await page.locator('#param-D').fill('48');await page.locator('#param-f').fill('2.4');
 await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
 let text=await page.locator('#print-pages').textContent();assert.ok(text.includes('96,5'));assert.ok(text.includes('47,4'));
 await page.locator('#param-W').fill('135');await page.locator('#param-D').fill('49');await page.locator('#param-f').fill('1.8');
 await page.setViewportSize({width:360,height:853});await page.locator('#print-open').focus();await page.keyboard.press('Enter');
 assert.ok(await page.locator('#print-run').isVisible());
 await page.emulateMedia({media:'print'});await page.evaluate(()=>dispatchEvent(new Event('beforeprint')));
 assert.equal(await page.locator('.print-page:visible').count(),6);assert.ok(!(await page.locator('#print-toolbar').isVisible()));
 const sizes=await page.locator('.print-page').evaluateAll(els=>els.map(e=>({height:e.getBoundingClientRect().height,scroll:e.scrollHeight,width:e.getBoundingClientRect().width,content:e.querySelector('.print-page-content').scrollHeight,area:e.querySelector('.print-page-content').clientHeight})));
 for(const size of sizes){assert.ok(size.height<=1033,'Página mayor que área A4: '+JSON.stringify(size));assert.ok(size.scroll<=1033,'Contenido fuera de página: '+JSON.stringify(size));assert.ok(size.content<=size.area+1,'Contenido invade el pie: '+JSON.stringify(size));}
 fs.mkdirSync('tests/screenshots',{recursive:true});await page.pdf({path:'tests/screenshots/cotizacion-banca.pdf',preferCSSPageSize:true,printBackground:true,displayHeaderFooter:false});
 await page.emulateMedia({media:'screen'});await page.locator('#print-close').click();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const fallback=await browser.newPage();await fallback.route('**/*three*',r=>r.abort());await fallback.goto(url);await fallback.locator('#print-open').click();assert.equal(await fallback.locator('.print-page:visible').count(),6);
 assert.deepEqual(errors,[]);console.log('PASS:6páginas, sin datos comerciales, parámetros/propiedad, vista previa, teclado/móvil, impresión nativa, A4 y fallback sin3D.');
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exit(1)});
