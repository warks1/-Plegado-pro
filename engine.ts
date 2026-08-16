import type {ManufacturingOrder,ManufacturingRoute,Project,ProjectDocument,ProjectRevision,QualityInspection,QualityIssue,ReleaseRecord} from '../../types/domain';

export interface QualityGateInput {
  project:Project;
  selectedMachineId:string;
  selectedPunchId:string;
  selectedDieId:string;
  documents:ProjectDocument[];
  revisions:ProjectRevision[];
  routes:ManufacturingRoute[];
  orders:ManufacturingOrder[];
  quality:QualityInspection[];
  releases:ReleaseRecord[];
  issues:QualityIssue[];
}
export interface GateCheck {id:string;label:string;ok:boolean;detail:string;severity:'critical'|'major'|'minor'}
export interface QualityGateResult {checks:GateCheck[];score:number;blocking:number;openIssues:number;readyForRc:boolean}

export function evaluateQualityGate(input:QualityGateInput):QualityGateResult{
  const p=input.project;
  const approvedDrawing=input.documents.some(d=>d.projectId===p.id&&d.category==='drawing'&&d.status==='approved');
  const approvedRevision=input.revisions.some(r=>r.projectId===p.id&&r.approved);
  const validRoute=input.routes.some(r=>r.projectId===p.id&&r.status!=='draft');
  const order=input.orders.some(o=>o.projectId===p.id);
  const quality=input.quality.some(q=>q.projectId===p.id);
  const released=input.releases.some(r=>r.projectId===p.id&&r.status==='released');
  const open=input.issues.filter(i=>(!i.projectId||i.projectId===p.id)&&i.status!=='resolved'&&i.status!=='accepted');
  const critical=open.filter(i=>i.severity==='critical').length;
  const checks:GateCheck[]=[
    {id:'geometry',label:'Geometría definida',ok:p.bends.length>0&&p.width>0&&p.length>0&&p.thickness>0,detail:`${p.bends.length} plegados · ${p.width} × ${p.length} × ${p.thickness} mm`,severity:'critical'},
    {id:'tooling',label:'Máquina y utillaje seleccionados',ok:Boolean(input.selectedMachineId&&input.selectedPunchId&&input.selectedDieId),detail:`${input.selectedMachineId} · ${input.selectedPunchId} · ${input.selectedDieId}`,severity:'critical'},
    {id:'drawing',label:'Plano aprobado',ok:approvedDrawing,detail:approvedDrawing?'Documento aprobado disponible':'Falta plano aprobado',severity:'critical'},
    {id:'revision',label:'Revisión aprobada',ok:approvedRevision,detail:approvedRevision?'Línea base técnica disponible':'Falta revisión aprobada',severity:'major'},
    {id:'route',label:'Ruta validada',ok:validRoute,detail:validRoute?'Proceso de fabricación definido':'Falta validar la ruta',severity:'major'},
    {id:'order',label:'Orden de fabricación',ok:order,detail:order?'Orden asociada':'Falta crear una orden',severity:'major'},
    {id:'quality',label:'Plan de calidad',ok:quality,detail:quality?'Características de control definidas':'Falta control dimensional',severity:'major'},
    {id:'release',label:'Liberación registrada',ok:released,detail:released?'Proyecto liberado':'Pendiente de liberación',severity:'major'},
    {id:'issues',label:'Sin incidencias críticas abiertas',ok:critical===0,detail:critical?`${critical} incidencias críticas abiertas`:`${open.length} incidencias abiertas, ninguna crítica`,severity:'critical'},
  ];
  const weighted=checks.reduce((n,c)=>n+(c.ok?(c.severity==='critical'?3:c.severity==='major'?2:1):0),0);
  const total=checks.reduce((n,c)=>n+(c.severity==='critical'?3:c.severity==='major'?2:1),0);
  const blocking=checks.filter(c=>!c.ok&&c.severity==='critical').length;
  return {checks,score:Math.round(weighted/total*100),blocking,openIssues:open.length,readyForRc:blocking===0&&checks.every(c=>c.ok)};
}
