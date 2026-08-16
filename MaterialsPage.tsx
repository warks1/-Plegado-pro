import {useEffect,useMemo,useState} from 'react';
import {Page} from '../../components/Page';
import {useAppStore} from '../../store/useAppStore';
import type {MaterialRecord} from '../../types/domain';

const expanded:MaterialRecord[]=[
{id:'m-corten-a',name:'S355J2W / Corten A',family:'Acero patinable',standard:'EN 10025-5',density:7.85,kFactor:.4,minRadius:1.5,springback:3.2,verified:true},
{id:'m-hardox-400',name:'Hardox 400',family:'Acero antidesgaste',standard:'SSAB',density:7.85,kFactor:.44,minRadius:3,springback:7,verified:false},
{id:'m-42crmo4',name:'42CrMo4',family:'Acero aleado',standard:'EN 10083-3',density:7.85,kFactor:.43,minRadius:2.5,springback:6,verified:true},
{id:'m-aisi430',name:'AISI 430',family:'Acero inoxidable ferrítico',standard:'EN 10088',density:7.7,kFactor:.41,minRadius:1.5,springback:4.5,verified:true},
{id:'m-aisi201',name:'AISI 201',family:'Acero inoxidable austenítico',standard:'EN 10088',density:7.86,kFactor:.42,minRadius:1.5,springback:5,verified:true},
{id:'m-al1050',name:'EN AW-1050A',family:'Aluminio',standard:'EN 573-3',density:2.71,kFactor:.34,minRadius:.8,springback:2.5,verified:true},
{id:'m-al5005',name:'EN AW-5005',family:'Aluminio',standard:'EN 573-3',density:2.7,kFactor:.35,minRadius:1.2,springback:3.5,verified:true},
{id:'m-al6061',name:'EN AW-6061 T6',family:'Aluminio',standard:'EN 573-3',density:2.7,kFactor:.39,minRadius:2.2,springback:6,verified:true},
{id:'m-al7075',name:'EN AW-7075 T6',family:'Aluminio alta resistencia',standard:'EN 573-3',density:2.81,kFactor:.42,minRadius:4,springback:8,verified:true},
{id:'m-zintec',name:'Electrocincado DC01+ZE',family:'Acero recubierto',standard:'EN 10152',density:7.85,kFactor:.37,minRadius:.9,springback:2,verified:true},
{id:'m-prepainted',name:'Chapa prelacada',family:'Acero recubierto',standard:'EN 10169',density:7.85,kFactor:.38,minRadius:1.2,springback:2.5,verified:true},
{id:'m-titanium2',name:'Titanio Grado 2',family:'Titanio',standard:'ASTM B265',density:4.51,kFactor:.46,minRadius:2.5,springback:9,verified:true}
];

export function MaterialsPage(){
 const {materials,addMaterial}=useAppStore();
 const [query,setQuery]=useState('');const [family,setFamily]=useState('Todas');const [name,setName]=useState('');
 useEffect(()=>{const ids=new Set(materials.map(m=>m.id));expanded.filter(m=>!ids.has(m.id)).forEach(addMaterial)},[]); // merge library after updates without deleting workshop materials
 const filtered=useMemo(()=>materials.filter(m=>(family==='Todas'||m.family===family)&&`${m.name} ${m.family} ${m.standard}`.toLowerCase().includes(query.toLowerCase())),[materials,query,family]);
 const families=[...new Set(materials.map(m=>m.family))].sort();
 return <Page title="Materiales" subtitle="Biblioteca ampliada de aceros, inoxidables, aluminios, cobre, latón, titanio y materiales personalizados"><div className="two-col"><section className="panel"><div className="supplier-toolbar"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Buscar material, familia o norma"/><select value={family} onChange={e=>setFamily(e.target.value)}><option>Todas</option>{families.map(x=><option key={x}>{x}</option>)}</select></div><p className="muted">{filtered.length} materiales disponibles</p><div className="rows">{filtered.map(m=><article className="library-card" key={m.id}><strong>{m.name}</strong><span>{m.family} · {m.standard}</span><small>ρ {m.density} g/cm³ · K {m.kFactor} · Rmín {m.minRadius}t · recuperación {m.springback}°</small><em className={`source-badge ${m.verified?'official':'pending'}`}>{m.verified?'Datos de referencia':'Validar con proveedor'}</em></article>)}</div></section><section className="panel"><h3>Material personalizado</h3><form className="form" onSubmit={e=>{e.preventDefault();if(!name)return;addMaterial({id:crypto.randomUUID(),name,family:'Personalizado',standard:'Taller',density:7.85,kFactor:.4,minRadius:1,springback:2,verified:false});setName('')}}><label>Nombre<input value={name} onChange={e=>setName(e.target.value)}/></label><button type="submit">Guardar material</button></form><h3>Uso técnico</h3><p className="form-help">Los valores sirven como punto de partida. Deben validarse con lote, estado metalúrgico, sentido de laminación, herramienta y máquina reales.</p></section></div></Page>
}
