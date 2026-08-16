import {useMemo,useRef,useState} from 'react';
import type {PointerEvent as ReactPointerEvent,WheelEvent as ReactWheelEvent} from 'react';
import {Page} from '../../components/Page';
import {tools} from '../../data/catalog';
import {useAppStore} from '../../store/useAppStore';
import type {Tool} from '../../types/domain';

function ToolDrawing({tool,mode}:{tool:Tool;mode:'2d'|'3d'}){
  const isPunch=tool.kind==='punch';
  const punchPath='M255 55 H365 L350 250 Q345 300 390 334 L330 430 H290 L230 334 Q275 300 270 250 Z';
  const diePath='M120 160 H230 L310 265 L390 160 H500 L475 385 H145 Z';
  const depth=mode==='3d'?[30,24,18,12,6]:[];
  return <svg className={`technical-tool mode-${mode}`} viewBox="0 0 680 500" role="img" aria-label={`Vista ${mode} de ${tool.name}`}>
    <defs>
      <linearGradient id={`steel-${tool.id}`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f7fbfd"/><stop offset=".38" stopColor="#a6bbc5"/><stop offset=".72" stopColor="#4e6673"/><stop offset="1" stopColor="#d7e4e9"/></linearGradient>
      <linearGradient id={`side-${tool.id}`} x1="0" x2="1"><stop stopColor="#1b2f3a"/><stop offset=".5" stopColor="#5f7884"/><stop offset="1" stopColor="#243d49"/></linearGradient>
      <filter id={`shadow-${tool.id}`}><feDropShadow dx="0" dy="18" stdDeviation="13" floodOpacity=".62"/></filter>
      <marker id={`arrow-${tool.id}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M8,0 L0,4 L8,8" fill="none" stroke="#26d9ff"/></marker>
    </defs>
    <g transform={mode==='3d'?'translate(30 -2) skewY(-4)':'translate(0 0)'} filter={`url(#shadow-${tool.id})`}>
      {depth.map(d=>isPunch?<path key={d} d={punchPath} transform={`translate(${d} ${-d*.32})`} fill={`url(#side-${tool.id})`} stroke="#203844" strokeWidth="2"/>:<path key={d} d={diePath} transform={`translate(${d} ${-d*.32})`} fill={`url(#side-${tool.id})`} stroke="#203844" strokeWidth="2"/>)}
      {isPunch?<>
        <path d={punchPath} fill={`url(#steel-${tool.id})`} stroke="#eafaff" strokeWidth="3"/>
        <path d="M290 430 L310 448 L330 430" fill="#d4dde0" stroke="#fff" strokeWidth="2"/>
        <rect x="272" y="55" width="76" height="24" rx="4" fill="#263b46" stroke="#8edff0"/>
      </>:<>
        <path d={diePath} fill={`url(#steel-${tool.id})`} stroke="#eafaff" strokeWidth="3"/>
        <path d={`M${310-(tool.v??16)*2.2} 160 L310 265 L${310+(tool.v??16)*2.2} 160`} fill="#071118" stroke="#dce9ed" strokeWidth="3"/>
        <rect x="145" y="385" width="330" height="34" rx="4" fill="#263b46" stroke="#8edff0"/>
      </>}
    </g>
    <g className="cad-dims">
      <line x1="85" y1="55" x2="85" y2={isPunch?'448':'419'} markerStart={`url(#arrow-${tool.id})`} markerEnd={`url(#arrow-${tool.id})`}/><text x="25" y="250">H {tool.height} mm</text>
      <line x1="120" y1="465" x2="500" y2="465" markerStart={`url(#arrow-${tool.id})`} markerEnd={`url(#arrow-${tool.id})`}/><text x="265" y="490">A {tool.width} mm</text>
      {isPunch?<><path d="M270 412 A55 55 0 0 0 350 412"/><text x="280" y="390">{tool.angle}°</text><text x="360" y="438">R {tool.radius}</text></>:<><line x1={310-(tool.v??16)*2.2} y1="125" x2={310+(tool.v??16)*2.2} y2="125" markerStart={`url(#arrow-${tool.id})`} markerEnd={`url(#arrow-${tool.id})`}/><text x="276" y="108">V {tool.v} mm</text><text x="345" y="250">R {tool.radius}</text></>}
      {mode==='3d'&&<text x="500" y="70">Profundidad 3D paramétrica</text>}
    </g>
  </svg>
}

export function ToolingPage(){
  const selectedPunchId=useAppStore(s=>s.selectedPunchId),selectedDieId=useAppStore(s=>s.selectedDieId),setPunch=useAppStore(s=>s.setPunch),setDie=useAppStore(s=>s.setDie);
  const [kind,setKind]=useState<'punch'|'die'|'assembly'>('punch');const [mode,setMode]=useState<'2d'|'3d'>('3d');const [query,setQuery]=useState('');const [manufacturer,setManufacturer]=useState('Todos');const [rotation,setRotation]=useState(-12);const [rotationX,setRotationX]=useState(-7);const [zoom,setZoom]=useState(1);const [pan,setPan]=useState({x:0,y:0});const drag=useRef<{x:number;y:number;pan:boolean}|null>(null);
  const filtered=useMemo(()=>tools.filter(t=>(kind==='assembly'||t.kind===kind)&&(manufacturer==='Todos'||t.manufacturer===manufacturer)&&`${t.manufacturer} ${t.family} ${t.name}`.toLowerCase().includes(query.toLowerCase())),[kind,manufacturer,query]);
  const punch=tools.find(t=>t.id===selectedPunchId)??tools.find(t=>t.kind==='punch')!;const die=tools.find(t=>t.id===selectedDieId)??tools.find(t=>t.kind==='die')!;
  const selected=kind==='die'?die:punch;
  const select=(t:Tool)=>t.kind==='punch'?setPunch(t.id):setDie(t.id);
  const onPointerDown=(event:ReactPointerEvent)=>{drag.current={x:event.clientX,y:event.clientY,pan:event.shiftKey||event.button===1};event.currentTarget.setPointerCapture(event.pointerId)};
  const onPointerMove=(event:ReactPointerEvent)=>{if(!drag.current)return;const dx=event.clientX-drag.current.x,dy=event.clientY-drag.current.y;if(drag.current.pan)setPan(v=>({x:v.x+dx,y:v.y+dy}));else{setRotation(v=>v+dx*.55);setRotationX(v=>Math.max(-80,Math.min(55,v-dy*.4)))}drag.current={...drag.current,x:event.clientX,y:event.clientY}};
  const stopDrag=(event:ReactPointerEvent)=>{drag.current=null;try{event.currentTarget.releasePointerCapture(event.pointerId)}catch{/*noop*/}};
  const onWheel=(event:ReactWheelEvent)=>{event.preventDefault();setZoom(z=>Math.max(.45,Math.min(2.2,z*(event.deltaY<0?1.12:.88))))};
  const center=()=>{setRotation(-12);setRotationX(-7);setZoom(1);setPan({x:0,y:0})};
  return <Page title="Utillaje CAD" subtitle="Punzones, matrices y montajes con fichas, cotas y selección persistente">
    <div className="tooling-toolbar panel"><div className="tabs"><button className={kind==='punch'?'active':''} onClick={()=>setKind('punch')}>Punzones</button><button className={kind==='die'?'active':''} onClick={()=>setKind('die')}>Matrices</button><button className={kind==='assembly'?'active':''} onClick={()=>setKind('assembly')}>Montaje</button></div><input placeholder="Buscar referencia, familia o fabricante" value={query} onChange={e=>setQuery(e.target.value)}/><select value={manufacturer} onChange={e=>setManufacturer(e.target.value)}><option>Todos</option>{[...new Set(tools.map(t=>t.manufacturer))].map(x=><option key={x}>{x}</option>)}</select><div className="tabs"><button className={mode==='2d'?'active':''} onClick={()=>setMode('2d')}>2D acotado</button><button className={mode==='3d'?'active':''} onClick={()=>setMode('3d')}>3D</button></div></div>
    <div className="tool-grid advanced">
      <section className="panel tool-list">{filtered.map(t=><button className={(t.id===(t.kind==='punch'?selectedPunchId:selectedDieId))?'selected':''} key={t.id} onClick={()=>select(t)}><b>{t.manufacturer}</b><strong>{t.name}</strong><span>{t.family} · {t.clamp}</span></button>)}</section>
      <section className="panel tool-view advanced">
        <div className="tool-cad-stage interactive-tool" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={stopDrag} onPointerCancel={stopDrag} onWheel={onWheel} onDoubleClick={center}><div className="tool-cad-object" style={{transform:`translate3d(${pan.x}px,${pan.y}px,0) scale(${zoom}) rotateY(${mode==='3d'?rotation:0}deg) rotateX(${mode==='3d'?rotationX:0}deg)`}}>{kind==='assembly'?<div className="assembly-stack"><ToolDrawing tool={punch} mode={mode}/><div className="assembly-sheet"/><ToolDrawing tool={die} mode={mode}/></div>:<ToolDrawing tool={selected} mode={mode}/>}</div><div className="cad-toolbar"><button type="button" onClick={()=>setRotation(r=>r-15)}>↶ Girar</button><button type="button" onClick={()=>setRotation(r=>r+15)}>Girar ↷</button><button type="button" onClick={()=>setZoom(z=>Math.min(1.8,z+.12))}>＋</button><button type="button" onClick={()=>setZoom(z=>Math.max(.55,z-.12))}>−</button><button type="button" onClick={center}>Centrar</button></div><div className="viewport-help">Arrastrar: girar · Mayús + arrastrar: mover · rueda/pellizco: zoom · doble clic: centrar</div></div>
        <div className="tool-data"><h2>{kind==='assembly'?'Montaje activo':selected.name}</h2><p>{kind==='assembly'?`${punch.name} + ${die.name}`:`${selected.manufacturer} · ${selected.family}`}</p>{kind!=='assembly'&&<><dl><div><dt>Ángulo</dt><dd>{selected.angle}°</dd></div><div><dt>Radio</dt><dd>{selected.radius} mm</dd></div><div><dt>Altura</dt><dd>{selected.height} mm</dd></div><div><dt>Anchura</dt><dd>{selected.width} mm</dd></div><div><dt>Apertura V</dt><dd>{selected.v??'—'}</dd></div><div><dt>Carga</dt><dd>{selected.loadKnM??'—'} kN/m</dd></div><div><dt>Amarre</dt><dd>{selected.clamp}</dd></div><div><dt>Longitudes</dt><dd>{selected.lengths.join(' / ')}</dd></div></dl><div className={`verification ${selected.verified?'ok':'pending'}`}>{selected.verified?'CAD verificado':'Reconstrucción paramétrica pendiente de validar'}</div></>}</div>
      </section>
    </div>
  </Page>
}
