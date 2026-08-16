import {useMemo,useState} from 'react';
import {Page} from '../../components/Page';
import {useActiveProject,useAppStore} from '../../store/useAppStore';

export function ReleasePage(){
 const project=useActiveProject();
 const {documents,revisions,orders,routes,quality,selectedMachineId,selectedPunchId,selectedDieId,releases,setRelease}=useAppStore();
 const [responsible,setResponsible]=useState('Antonio Molina Sánchez');const [notes,setNotes]=useState('');
 const checks=useMemo(()=>[
  {label:'Proyecto y geometría',ok:project.bends.length>0,detail:`${project.bends.length} plegados definidos`},
  {label:'Máquina y utillaje',ok:Boolean(selectedMachineId&&selectedPunchId&&selectedDieId),detail:`${selectedMachineId} · ${selectedPunchId} · ${selectedDieId}`},
  {label:'Plano aprobado',ok:documents.some(d=>d.projectId===project.id&&d.category==='drawing'&&d.status==='approved'),detail:'Debe existir al menos un plano aprobado'},
  {label:'Revisión aprobada',ok:revisions.some(r=>r.projectId===project.id&&r.approved),detail:'Debe existir una línea base aprobada'},
  {label:'Ruta validada o liberada',ok:routes.some(r=>r.projectId===project.id&&r.status!=='draft'),detail:'Ruta de fabricación preparada'},
  {label:'Orden asociada',ok:orders.some(o=>o.projectId===project.id),detail:'Orden de fabricación creada'},
  {label:'Calidad definida',ok:quality.some(q=>q.projectId===project.id),detail:'Al menos una característica de control'},
 ],[project,documents,revisions,routes,orders,quality,selectedMachineId,selectedPunchId,selectedDieId]);
 const ready=checks.every(c=>c.ok);const current=releases.find(r=>r.projectId===project.id);
 return <Page title="Liberación a producción" subtitle="Puerta de control antes de enviar el trabajo al taller">
  <div className="two-col"><section className="panel"><h3>Comprobaciones</h3><div className="requirements-table">{checks.map(c=><article key={c.label} className={`requirement ${c.ok?'implemented':'pending'}`}><div><strong>{c.label}</strong><small>{c.detail}</small></div><span>{c.ok?'Correcto':'Pendiente'}</span></article>)}</div></section>
  <form className="panel form" onSubmit={e=>{e.preventDefault();setRelease({id:current?.id??crypto.randomUUID(),projectId:project.id,status:ready?'released':'blocked',checks,releasedBy:ready?responsible:undefined,releasedAt:ready?new Date().toISOString():undefined,notes})}}><h3>Decisión</h3><div className={`release-state ${ready?'ready':'blocked'}`}>{ready?'Proyecto preparado para liberar':'Proyecto bloqueado'}</div><label>Responsable<input value={responsible} onChange={e=>setResponsible(e.target.value)}/></label><label>Observaciones<textarea value={notes} onChange={e=>setNotes(e.target.value)}/></label><button type="submit">{ready?'Liberar a producción':'Registrar bloqueo'}</button>{current&&<p className="muted">Último estado: {current.status} {current.releasedAt?`· ${new Date(current.releasedAt).toLocaleString()}`:''}</p>}</form></div>
 </Page>
}
