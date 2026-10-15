const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
function setup(){const context={};vm.createContext(context);vm.runInContext(fs.readFileSync('index.html','utf8').match(/<script id="guide-data">([\s\S]*?)<\/script>/)[1],context);vm.runInContext(fs.readFileSync('cutting.js','utf8'),context);if(fs.existsSync('print.js'))vm.runInContext(fs.readFileSync('print.js','utf8'),context);assert.ok(context.GuidePrint?.render,'Falta documento imprimible');return context}
test('Cotización incluye seis páginas, todas las piezas, planchas y materiales sin información comercial',()=>{
 const c=setup(),html=c.GuidePrint.render({W:135,D:49,f:1.8,ownedIds:[]});
 assert.equal((html.match(/class="print-page(?:\s|\")/g)||[]).length,6);
 for(const id of ['P01','P02','P03','P04','P05','P06','P07','P08','P09','P10','L01','L02','L03','L04'])assert.ok(html.includes(id),'Falta pieza '+id);
 for(const value of ['244','122','41,4','97,5','46,8'])assert.ok(html.includes(value),'Falta medida '+value);
 assert.match(html,/bisagra/i);assert.match(html,/25/);assert.match(html,/40/);
 assert.doesNotMatch(html,/Sodimac|Falabella|Fixser|Scanavini|Kölor|Mamut|PRO RACK|Agorex|Cóndor|Lizcal|https?:|\$|CLP/i);
 assert.doesNotMatch(html,/<canvas|<a\s/i);
});
test('Planos siguen parámetros actuales y solo permiten estado de aporte, sin datos editados',()=>{
 const c=setup(),a=c.GuidePrint.render({W:135,D:49,f:1.8,ownedIds:[]}),b=c.GuidePrint.render({W:134,D:48,f:2.4,ownedIds:['Bisagras Simples','<script>alert(1)</script>']});
 for(const value of ['96,5','47,4'])assert.ok(b.includes(value),'Falta medida ajustada '+value);
 assert.notEqual(a,b);assert.doesNotMatch(b,/<script|alert\(1\)/i);
 assert.ok(b.includes('Aporta cliente'),'Falta propiedad del material');
});
