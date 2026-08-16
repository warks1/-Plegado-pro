import {useState} from 'react';
import {Page} from '../../components/Page';
import {useActiveProject,useAppStore} from '../../store/useAppStore';
import type {ProjectDocument} from '../../types/domain';

export function DocumentsPage(){
 const project=useActiveProject();
 const documents=useAppStore(s=>s.documents.filter(d=>d.projectId===project.id));
 const addDocument=useAppStore(s=>s.addDocument);
 const [name,setName]=useState('');
 const [category,setCategory]=useState<ProjectDocument['category']>('drawing');
 const [version,setVersion]=useState('A');
 const [status,setStatus]=useState<ProjectDocument['status']>('draft');
 const [notes,setNotes]=useState('');
 return <Page title="Documentación del proyecto" subtitle="Planos, fotografías, certificados, manuales e informes con control de versión">
  <div className="two-col">
   <form className="panel form" onSubmit={e=>{e.preventDefault();if(!name.trim())return;addDocument({id:crypto.randomUUID(),projectId:project.id,name,category,version,status,notes,createdAt:new Date().toISOString()});setName('');setNotes('')}}>
    <h3>Nuevo documento</h3>
    <label>Nombre<input value={name} onChange={e=>setName(e.target.value)} required/></label>
    <div className="form-grid"><label>Categoría<select value={category} onChange={e=>setCategory(e.target.value as ProjectDocument['category'])}><option value="drawing">Plano</option><option value="photo">Fotografía</option><option value="certificate">Certificado</option><option value="manual">Manual</option><option value="report">Informe</option><option value="other">Otro</option></select></label><label>Versión<input value={version} onChange={e=>setVersion(e.target.value)}/></label></div>
    <label>Estado<select value={status} onChange={e=>setStatus(e.target.value as ProjectDocument['status'])}><option value="draft">Borrador</option><option value="approved">Aprobado</option><option value="obsolete">Obsoleto</option></select></label>
    <label>Notas<textarea value={notes} onChange={e=>setNotes(e.target.value)}/></label>
    <button type="submit">Guardar documento</button>
   </form>
   <section className="panel"><h3>Documentos de {project.name}</h3><div className="rows">{documents.length===0&&<p className="muted">Todavía no hay documentación asociada.</p>}{documents.map(d=><article key={d.id} className="project-row"><span><strong>{d.name}</strong><small>{d.category} · versión {d.version} · {new Date(d.createdAt).toLocaleString()}</small></span><b>{d.status==='approved'?'Aprobado':d.status==='obsolete'?'Obsoleto':'Borrador'}</b></article>)}</div></section>
  </div>
 </Page>
}
