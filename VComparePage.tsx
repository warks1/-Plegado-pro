import {useMemo,useState} from 'react';
import {Page} from '../../components/Page';
import {useActiveProject} from '../../store/useAppStore';

const openings=[6,8,10,12,16,20,24,25,32,40,50,63,80];
export function VComparePage(){
  const project=useActiveProject();
  const [thickness,setThickness]=useState(project.thickness);
  const [length,setLength]=useState(1000);
  const [strength,setStrength]=useState(450);
  const [selected,setSelected]=useState<number[]>([16,20,24]);
  const rows=useMemo(()=>openings.map(v=>{const radius=v*.16;const minFlange=v*.7;const force=(1.42*strength*length*thickness*thickness)/(1000*v);const ratio=v/thickness;const score=Math.abs(ratio-8);return {v,radius,minFlange,force,score,recommended:ratio>=6&&ratio<=10};}).filter(x=>selected.includes(x.v)).sort((a,b)=>a.score-b.score),[thickness,length,strength,selected]);
  const toggle=(v:number)=>setSelected(s=>s.includes(v)?s.filter(x=>x!==v):[...s,v]);
  return <Page title="Comparador de V" subtitle="Comparación simultánea de apertura, radio, ala mínima y tonelaje">
    <section className="panel form-grid">
      <label>Espesor (mm)<input type="number" min="0.2" step="0.1" value={thickness} onChange={e=>setThickness(Number(e.target.value))}/></label>
      <label>Longitud de plegado (mm)<input type="number" min="1" value={length} onChange={e=>setLength(Number(e.target.value))}/></label>
      <label>Resistencia estimada (MPa)<input type="number" min="100" value={strength} onChange={e=>setStrength(Number(e.target.value))}/></label>
      <label>Material<input value={project.material} readOnly/></label>
    </section>
    <section className="panel"><h3>Aperturas a comparar</h3><div className="chip-grid">{openings.map(v=><button key={v} className={selected.includes(v)?'active':''} onClick={()=>toggle(v)}>V{v}</button>)}</div></section>
    <section className="panel"><div className="requirements-table">{rows.map((r,i)=><article className={`requirement ${r.recommended?'implemented':'partial'}`} key={r.v}><div><b>{i===0?'MEJOR AJUSTE':'ALTERNATIVA'} · V{r.v}</b><strong>Radio estimado {r.radius.toFixed(2)} mm</strong><small>Ala mínima {r.minFlange.toFixed(1)} mm · Relación V/e {(r.v/thickness).toFixed(1)}</small></div><span>{r.force.toFixed(1)} t/m</span></article>)}</div></section>
    <p className="hint">Cálculo orientativo. Debe verificarse con tablas oficiales de material, máquina y utillaje.</p>
  </Page>;
}
