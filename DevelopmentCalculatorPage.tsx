import {useMemo,useState} from 'react';
import {Page} from '../../components/Page';

type BendDirection='up'|'down';
type BendRow={id:string;angle:number;radius:number;direction:BendDirection;v:number;useV:boolean};
const rad=(v:number)=>v*Math.PI/180;
const uid=()=>`bend-${Date.now()}-${Math.random().toString(36).slice(2,7)}`;
const radiusFromV=(v:number,thickness:number)=>Math.max(thickness*.8,v*.16);

export function DevelopmentCalculatorPage(){
  const [thickness,setThickness]=useState(2);
  const [k,setK]=useState(.38);
  const [quantity,setQuantity]=useState(1);
  const [segments,setSegments]=useState<number[]>([100,300,100]);
  const [bends,setBends]=useState<BendRow[]>([
    {id:'bend-1',angle:90,radius:2,direction:'up',v:12,useV:true},
    {id:'bend-2',angle:90,radius:2,direction:'down',v:24,useV:true}
  ]);
  const calculations=useMemo(()=>{
    const rows=bends.map((bend,index)=>{
      const included=Math.max(1,Math.min(179,bend.angle));
      const bendAngle=180-included;
      const effectiveRadius=bend.useV?radiusFromV(Math.max(1,bend.v),Math.max(.01,thickness)):Math.max(0,bend.radius);
      const ba=rad(bendAngle)*(effectiveRadius+k*Math.max(.01,thickness));
      const setback=(effectiveRadius+Math.max(.01,thickness))*Math.tan(rad(bendAngle/2));
      const bd=Math.max(0,2*setback-ba);
      return {...bend,index,effectiveRadius,ba,bd,setback};
    });
    const nominal=segments.reduce((sum,value)=>sum+Math.max(0,value),0);
    const totalBd=rows.reduce((sum,row)=>sum+row.bd,0);
    const totalBa=rows.reduce((sum,row)=>sum+row.ba,0);
    const flat=Math.max(0,nominal-totalBd);
    return {rows,nominal,totalBd,totalBa,flat,total:flat*Math.max(1,quantity)};
  },[bends,segments,thickness,k,quantity]);
  const updateSegment=(index:number,value:number)=>setSegments(current=>current.map((item,i)=>i===index?value:item));
  const updateBend=(id:string,patch:Partial<BendRow>)=>setBends(current=>current.map(item=>item.id===id?{...item,...patch}:item));
  const addBend=()=>{setBends(current=>[...current,{id:uid(),angle:90,radius:thickness,direction:current.length%2===0?'up':'down',v:Math.max(8,Math.round(thickness*8)),useV:true}]);setSegments(current=>[...current,100]);};
  const removeBend=(index:number)=>{setBends(current=>current.filter((_,i)=>i!==index));setSegments(current=>current.filter((_,i)=>i!==Math.min(index+1,current.length-1)));};
  return <Page title="Calculadora de desarrollo multiplegado" subtitle="Calcula el desarrollo usando alas, radios, sentido y apertura V independiente por pliegue">
    <div className="calculator-layout multi-bend-calculator">
      <section className="panel form calculator-editor">
        <div className="calculator-heading"><div><h3>Geometría de la pieza</h3><p className="hint">Cada pliegue puede usar una apertura V diferente. El radio efectivo se recalcula automáticamente.</p></div><button type="button" onClick={addBend}>＋ Añadir pliegue</button></div>
        <div className="form-grid"><label>Espesor (mm)<input type="number" min="0.1" step="0.1" value={thickness} onChange={e=>setThickness(Number(e.target.value))}/></label><label>Factor K<input type="number" min="0.1" max="0.6" step="0.01" value={k} onChange={e=>setK(Number(e.target.value))}/></label><label>Cantidad<input type="number" min="1" step="1" value={quantity} onChange={e=>setQuantity(Number(e.target.value))}/></label></div>
        <div className="segment-list"><h3>Tramos y alas</h3>{segments.map((length,index)=><label key={`segment-${index}`}>Tramo {index+1}<input type="number" min="0" step="0.1" value={length} onChange={e=>updateSegment(index,Number(e.target.value))}/></label>)}</div>
        <div className="bend-calculator-list"><h3>Pliegues</h3>{bends.map((bend,index)=><article className="bend-calculator-row" key={bend.id}><header><strong>P{index+1}</strong><button type="button" className="danger" onClick={()=>removeBend(index)}>Eliminar</button></header><div className="form-grid"><label>Ángulo final (°)<input type="number" min="1" max="179" value={bend.angle} onChange={e=>updateBend(bend.id,{angle:Number(e.target.value)})}/></label><label>Apertura V (mm)<input type="number" min="4" step="1" value={bend.v} onChange={e=>updateBend(bend.id,{v:Number(e.target.value)})}/></label><label>Radio manual (mm)<input type="number" min="0" step="0.1" value={bend.radius} disabled={bend.useV} onChange={e=>updateBend(bend.id,{radius:Number(e.target.value)})}/></label><label>Sentido<select value={bend.direction} onChange={e=>updateBend(bend.id,{direction:e.target.value as BendDirection})}><option value="up">Ala hacia arriba</option><option value="down">Ala hacia abajo</option></select></label></div><label className="check-row">Calcular radio desde V<input type="checkbox" checked={bend.useV} onChange={e=>updateBend(bend.id,{useV:e.target.checked})}/></label><small>R efectivo {calculations.rows[index]?.effectiveRadius.toFixed(2)} mm · BA {calculations.rows[index]?.ba.toFixed(2)} mm · BD {calculations.rows[index]?.bd.toFixed(2)} mm</small></article>)}</div>
      </section>
      <section className="panel calculator-results"><h3>Resultado completo</h3><dl><div><dt>Longitud nominal</dt><dd>{calculations.nominal.toFixed(2)} mm</dd></div><div><dt>BA total</dt><dd>{calculations.totalBa.toFixed(2)} mm</dd></div><div><dt>BD total</dt><dd>{calculations.totalBd.toFixed(2)} mm</dd></div><div><dt>Longitud plana</dt><dd>{calculations.flat.toFixed(2)} mm</dd></div><div><dt>Total ({quantity} uds.)</dt><dd>{calculations.total.toFixed(2)} mm</dd></div></dl>
        <div className="multi-bend-sketch">{segments.map((length,index)=><div className="sketch-segment-wrap" key={`sketch-${index}`}><span className="sketch-segment" style={{width:`${Math.max(62,Math.min(210,length*.65))}px`}}>{length} mm</span>{index<bends.length&&<i className={bends[index].direction}>P{index+1}<b>{bends[index].angle}° · V{bends[index].v}</b></i>}</div>)}</div>
        <table className="calculation-table"><thead><tr><th>P</th><th>Sentido</th><th>Ángulo</th><th>V</th><th>Radio</th><th>BA</th><th>BD</th></tr></thead><tbody>{calculations.rows.map(row=><tr key={row.id}><td>P{row.index+1}</td><td>{row.direction==='up'?'Arriba':'Abajo'}</td><td>{row.angle}°</td><td>V{row.v}</td><td>{row.effectiveRadius.toFixed(2)}</td><td>{row.ba.toFixed(2)}</td><td>{row.bd.toFixed(2)}</td></tr>)}</tbody></table>
        <p className="hint">Resultado orientativo. Valida con la tabla real de la máquina, material y utillaje.</p>
      </section>
    </div>
  </Page>;
}
