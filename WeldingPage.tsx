import {useState,type FormEvent} from 'react';
import {Page} from '../../components/Page';
import {useAppStore,useActiveProject} from '../../store/useAppStore';
import type {WeldingOperation} from '../../types/domain';

export function WeldingPage(){
  const project=useActiveProject();
  const operations=useAppStore(s=>s.welding);
  const add=useAppStore(s=>s.addWelding);
  const [process,setProcess]=useState<WeldingOperation['process']>('TIG');
  const [joint,setJoint]=useState('Esquina');
  const [length,setLength]=useState(200);
  const [passes,setPasses]=useState(1);
  const [gas,setGas]=useState('Argón');
  const [notes,setNotes]=useState('');
  const submit=(e:FormEvent)=>{e.preventDefault();add({id:crypto.randomUUID(),projectId:project.id,process,joint,length,passes,gas,notes,status:'planned',updatedAt:new Date().toISOString()});setNotes('');};
  return <Page title="Soldadura" subtitle="Planificación de TIG, MIG/MAG y soldadura láser por proyecto">
    <div className="two-col"><form className="panel form" onSubmit={submit}>
      <label>Proceso<select value={process} onChange={e=>setProcess(e.target.value as WeldingOperation['process'])}><option>TIG</option><option>MIG</option><option>MAG</option><option>Láser</option><option>Puntos</option></select></label>
      <label>Tipo de unión<select value={joint} onChange={e=>setJoint(e.target.value)}><option>Esquina</option><option>Solape</option><option>A tope</option><option>En T</option></select></label>
      <label>Longitud (mm)<input type="number" min="1" value={length} onChange={e=>setLength(Number(e.target.value))}/></label>
      <label>Número de pasadas<input type="number" min="1" value={passes} onChange={e=>setPasses(Number(e.target.value))}/></label>
      <label>Gas / protección<input value={gas} onChange={e=>setGas(e.target.value)}/></label>
      <label>Observaciones<textarea value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Secuencia térmica, puntos, sujeción, inspección..."/></label>
      <button type="submit">Añadir operación</button>
    </form><section className="panel"><h3>Operaciones del proyecto</h3><div className="rows">{operations.filter(x=>x.projectId===project.id).map(x=><article className="row" key={x.id}><span className="dot"/><div><strong>{x.process} · {x.joint}</strong><small>{x.length} mm · {x.passes} pasada(s) · {x.gas}</small></div><span>{x.status}</span></article>)}{!operations.some(x=>x.projectId===project.id)&&<p className="muted">Todavía no hay operaciones de soldadura.</p>}</div></section></div>
  </Page>;
}
