/* Cutting rectangles, in cm. X follows the 244 cm sheet edge and face grain. */
(function(root){
  'use strict';
  const sheet={width:244,height:122},kerf=.3;
  const round=n=>Math.round(n*1000000)/1000000;
  function layout(thickness,rows){
    const pieces=[],cuts=[],offcuts=[],bands=[];
    function rect(list,id,x,y,width,height,extra={}){
      if(width>1e-6&&height>1e-6)list.push({id,x:round(x),y:round(y),width:round(width),height:round(height),...extra});
    }
    let y=0;
    rows.forEach((row,index)=>{
      const band=index+1;
      bands.push({number:band,y:round(y),height:row.height,ids:row.pieces.map(p=>p.id)});
      let x=0;
      row.pieces.forEach(piece=>{
        rect(pieces,piece.id,x,y,piece.width,piece.height,{name:piece.name,band});
        if(piece.height<row.height){
          rect(cuts,'C'+(cuts.length+1),x,y+piece.height,piece.width,kerf,{phase:'trim',band,after:piece.id});
          rect(offcuts,'R'+(offcuts.length+1),x,y+piece.height+kerf,piece.width,row.height-piece.height-kerf,{band});
        }
        rect(cuts,'C'+(cuts.length+1),x+piece.width,y,kerf,row.height,{phase:'crosscut',band,after:piece.id});
        x+=piece.width+kerf;
      });
      rect(offcuts,'R'+(offcuts.length+1),x,y,sheet.width-x,row.height,{band});
      rect(cuts,'C'+(cuts.length+1),0,y+row.height,sheet.width,kerf,{phase:'band',band});
      y+=row.height+kerf;
    });
    rect(offcuts,'R'+(offcuts.length+1),0,y,sheet.width,sheet.height-y,{band:0});
    const area=list=>round(list.reduce((sum,r)=>sum+r.width*r.height,0));
    return {thickness,sheet:{...sheet},kerf,bands,pieces,cuts,offcuts,areas:{sheet:sheet.width*sheet.height,pieces:area(pieces),cuts:area(cuts),offcuts:area(offcuts)}};
  }
  function create(W=135,D=49){
    if(!Number.isFinite(W)||!Number.isFinite(D)||W<120||W>136||D<45||D>53)throw new RangeError('Medidas fuera del rango de la guía');
    const p=(id,name,width,height)=>({id,name,width,height});
    return [
      layout(18,[
        {height:D,pieces:[p('P01','Base',W,D)]},
        {height:D+1,pieces:[p('P09','Tapa',W-37.5,D+1),p('P07','Parte fija',37,D+1),p('P08','Refuerzo',33,33),p('P10','Repisa',34,18)]}
      ]),
      layout(15,[
        {height:41.4,pieces:[p('P02','Trasera',W,41.4),p('P04','Lateral izquierdo',D-3,41.4),p('P05','Lateral derecho',D-3,41.4)]},
        {height:41.4,pieces:[p('P03','Frente',W,41.4),p('P06','Tabique',D-3,41.4)]}
      ])
    ];
  }
  const api={create};root.GuideCutting=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
