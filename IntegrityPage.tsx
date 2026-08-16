import {Page} from '../../components/Page';
import {moduleContracts,summarizeContracts} from '../../core/integrity/moduleManifest';

export function IntegrityPage(){const summary=summarizeContracts();return <Page title="Integridad funcional" subtitle="Contrato específico de formularios, acciones y funciones pendientes por módulo">
  <div className="stats"><article className="stat"><span>Funcionales</span><b>{summary.functional}</b></article><article className="stat"><span>Parciales</span><b>{summary.partial}</b></article><article className="stat"><span>Bloqueados</span><b>{summary.blocked}</b></article></div>
  <section className="panel integrity-list">{moduleContracts.map(item=><article key={item.id} className={`integrity-item ${item.maturity}`}><header><div><b>{item.label}</b><small>{item.route}</small></div><span>{item.maturity==='functional'?'Funcional':item.maturity==='partial'?'Parcial':'Bloqueado'}</span></header><p><strong>Formulario:</strong> {item.form}</p><p><strong>Acciones:</strong> {item.actions.join(' · ')}</p>{item.missing.length>0&&<div className="missing"><strong>Pendiente:</strong>{item.missing.map(x=><small key={x}>{x}</small>)}</div>}</article>)}</section>
  <section className="panel notice"><b>Criterio de aceptación</b><p>Un módulo solo pasa a “Funcional” cuando dispone de formulario propio, validación, persistencia y acciones conectadas. “Parcial” significa que la interfaz existe pero falta capacidad técnica importante; no equivale a módulo terminado.</p></section>
</Page>}
