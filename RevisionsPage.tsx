import {useMemo,useState} from 'react';
import {CheckCircle2,Eye,RotateCcw,Trash2} from 'lucide-react';
import {Page} from '../../components/Page';
import {useActiveProject,useAppStore} from '../../store/useAppStore';
import type {Project,ProjectRevision} from '../../types/domain';

const formatDate=(value:string)=>new Date(value).toLocaleString();
const readSnapshot=(revision:ProjectRevision):Project|null=>{try{return JSON.parse(revision.snapshot) as Project}catch{return null}};

export function RevisionsPage(){
 const project=useActiveProject();
 const revisions=useAppStore(s=>s.revisions.filter(r=>r.projectId===project.id));
 const addRevision=useAppStore(s=>s.addRevision),restoreRevision=useAppStore(s=>s.restoreRevision),deleteRevision=useAppStore(s=>s.deleteRevision);
 const [reason,setReason]=useState('');const [author,setAuthor]=useState('Antonio Molina Sánchez');const [approved,setApproved]=useState(false);const [selected,setSelected]=useState<ProjectRevision|null>(null);const [message,setMessage]=useState('');
 const nextCode=useMemo(()=>`R${String(revisions.length+1).padStart(2,'0')}`,[revisions.length]);
 const selectedProject=selected?readSnapshot(selected):null;
 const create=(e:React.FormEvent<HTMLFormElement>)=>{e.preventDefault();if(!reason.trim())return;addRevision({id:crypto.randomUUID(),projectId:project.id,code:nextCode,reason,author,createdAt:new Date().toISOString(),approved,snapshot:JSON.stringify(project)});setReason('');setApproved(false);setMessage(`Revisión ${nextCode} creada`)};
 const restore=(revision:ProjectRevision)=>{if(!window.confirm(`¿Restaurar ${revision.code}? El estado actual podrá recuperarse con Deshacer.`))return;restoreRevision(revision.id);setMessage(`${revision.code} restaurada en el proyecto activo`)};
 return <Page title="Revisiones e historial técnico" subtitle="Líneas base, comparación y restauración segura del proyecto activo">
  {message&&<div className="panel revision-message"><CheckCircle2 size={18}/><span>{message}</span></div>}
  <div className="two-col revisions-layout"><form className="panel form" onSubmit={create}><h3>Nueva revisión {nextCode}</h3><label>Motivo<textarea value={reason} onChange={e=>setReason(e.target.value)} required placeholder="Cambio solicitado por cliente, corrección de pliegues…"/></label><label>Autor<input value={author} onChange={e=>setAuthor(e.target.value)}/></label><label className="check"><input type="checkbox" checked={approved} onChange={e=>setApproved(e.target.checked)}/> Aprobar esta revisión como línea base</label><div className="revision-summary"><span>{project.bends.length} pliegues</span><span>{project.material}</span><span>{project.thickness} mm</span><span>{project.width} × {project.length} mm</span></div><button type="submit">Crear revisión</button></form>
  <section className="panel"><h3>Historial del proyecto</h3><div className="rows revision-list">{revisions.length===0&&<p className="muted">No hay revisiones todavía.</p>}{[...revisions].reverse().map(r=>{const snap=readSnapshot(r);return <article className={`project-row revision-row ${selected?.id===r.id?'selected':''}`} key={r.id}><button type="button" className="revision-main" onClick={()=>setSelected(r)}><span><strong>{r.code} · {r.reason}</strong><small>{r.author} · {formatDate(r.createdAt)}</small><small>{snap?`${snap.bends.length} pliegues · ${snap.material} · ${snap.thickness} mm`:'Snapshot no disponible'}</small></span><b>{r.approved?'Aprobada':'Borrador'}</b></button><div className="revision-actions"><button type="button" title="Ver detalles" onClick={()=>setSelected(r)}><Eye size={16}/></button><button type="button" title="Restaurar revisión" onClick={()=>restore(r)}><RotateCcw size={16}/></button><button type="button" title="Eliminar revisión" onClick={()=>{if(window.confirm(`¿Eliminar ${r.code}?`))deleteRevision(r.id)}}><Trash2 size={16}/></button></div></article>})}</div></section></div>
  {selected&&selectedProject&&<section className="panel revision-detail"><div><h3>{selected.code} · Vista guardada</h3><p>{selected.reason}</p></div><div className="revision-metrics"><span><small>Cliente</small><strong>{selectedProject.customer||'Sin cliente'}</strong></span><span><small>Material</small><strong>{selectedProject.material}</strong></span><span><small>Espesor</small><strong>{selectedProject.thickness} mm</strong></span><span><small>Formato</small><strong>{selectedProject.width} × {selectedProject.length}</strong></span><span><small>Pliegues</small><strong>{selectedProject.bends.length}</strong></span></div><div className="revision-bends">{selectedProject.bends.sort((a,b)=>a.order-b.order).map(b=><span key={b.id}>P{b.order}: X {b.position} · {b.angle}° · R{b.radius}</span>)}</div><button type="button" onClick={()=>restore(selected)}><RotateCcw size={16}/> Restaurar esta revisión</button></section>}
 </Page>
}
