import {Page} from '../../components/Page';
import {useActiveProject,useAppStore} from '../../store/useAppStore';
import {machines,tools} from '../../data/catalog';
import type {ValidationItem} from '../../types/domain';
import {calculateProject,validateBendGeometry} from '../../core/bending/calculations';

export function ValidationPage(){
  const p=useActiveProject();
  const machineId=useAppStore(s=>s.selectedMachineId);
  const machine=machines.find(m=>m.id===machineId);
  const punchIds=new Set(tools.filter(t=>t.kind==='punch').map(t=>t.id));
  const dieIds=new Set(tools.filter(t=>t.kind==='die').map(t=>t.id));
  const calculation=calculateProject(p);
  const geometryErrors=p.bends.flatMap(b=>validateBendGeometry(b,p));
  const items:ValidationItem[]=[
    {id:'project',label:'Proyecto activo',ok:Boolean(p?.id),detail:p?.name??'Sin proyecto'},
    {id:'material',label:'Material y espesor',ok:Boolean(p.material&&p.thickness>0),detail:`${p.material} · ${p.thickness} mm`},
    {id:'sheet',label:'Dimensiones de chapa',ok:p.width>0&&p.length>0,detail:`${p.length} × ${p.width} mm`},
    {id:'bends',label:'Plegados definidos',ok:p.bends.length>0,detail:`${p.bends.length} pliegue(s)`},
    {id:'measurements',label:'Medidas válidas',ok:p.bends.every(b=>b.position>0&&b.position<p.length&&b.length>0&&b.length<=p.width&&b.angle>0&&b.angle<180&&b.radius>=0),detail:'Posición, longitud, ángulo y radio'},
    {id:'tools',label:'Utillaje asignado',ok:p.bends.every(b=>punchIds.has(b.punchId)&&dieIds.has(b.dieId)),detail:'Punzón y matriz por pliegue'},
    {id:'machine',label:'Máquina seleccionada',ok:Boolean(machine),detail:machine?`${machine.manufacturer} ${machine.name}`:'Sin máquina'},
    {id:'geometry-engine',label:'Motor geométrico',ok:geometryErrors.length===0,detail:geometryErrors.length?geometryErrors[0]:`BA ${calculation.totalBendAllowance.toFixed(2)} mm · BD ${calculation.totalBendDeduction.toFixed(2)} mm`},
    {id:'weight',label:'Peso y superficie calculados',ok:calculation.weightKg>0&&calculation.areaM2>0,detail:`${calculation.weightKg.toFixed(2)} kg · ${calculation.areaM2.toFixed(3)} m²`}
  ];
  const ready=items.every(i=>i.ok);
  return <Page title="Validación" subtitle="Comprobación previa a fabricación"><div className="validation-layout"><section className={`panel validation-summary ${ready?'ready':'blocked'}`}><span>{ready?'LISTO PARA LIBERAR':'PENDIENTE DE REVISIÓN'}</span><h2>{p.name}</h2><p>{ready?'La configuración mínima está completa.':'Corrige los puntos pendientes antes de liberar la pieza.'}</p></section><section className="panel validation-list">{items.map(item=><article className={item.ok?'valid':'invalid'} key={item.id}><b>{item.ok?'✓':'!'}</b><div><strong>{item.label}</strong><small>{item.detail}</small></div></article>)}</section></div></Page>}
