import {useEffect,useMemo,useRef,useState} from 'react';
import type {CSSProperties,PointerEvent as ReactPointerEvent,WheelEvent as ReactWheelEvent} from 'react';
import {ChevronLeft,ChevronRight,FastForward,FlipHorizontal2,Home,Maximize2,Minus,Pause,Play,Plus,RotateCcw,RotateCw,SkipBack,SkipForward} from 'lucide-react';
import {Page} from '../../components/Page';
import {useActiveProject,useAppStore} from '../../store/useAppStore';
import {machines,tools} from '../../data/catalog';
import {createSimulationFrames} from '../../core/simulation/engine';

const delays={slow:1100,normal:650,fast:280} as const;
type CameraState={zoom:number;rotateX:number;rotateY:number;panX:number;panY:number;flipped:boolean};
const defaultCamera:CameraState={zoom:1,rotateX:-4,rotateY:-8,panX:0,panY:0,flipped:false};

export function SimulationPage({initialMode='3d',lockedMode=false}:{initialMode?:'2d'|'3d';lockedMode?:boolean}={}){
  const project=useActiveProject();
  const machineId=useAppStore(s=>s.selectedMachineId); const punchId=useAppStore(s=>s.selectedPunchId); const dieId=useAppStore(s=>s.selectedDieId);
  const speed=useAppStore(s=>s.simulationSpeed); const setSpeed=useAppStore(s=>s.setSimulationSpeed);
  const showDimensions=useAppStore(s=>s.showDimensions); const setShowDimensions=useAppStore(s=>s.setShowDimensions);
  const [mode,setMode]=useState<'2d'|'3d'>(initialMode); const [step,setStep]=useState(0); const [playing,setPlaying]=useState(false);
  const [camera,setCamera]=useState<CameraState>(defaultCamera);
  const drag=useRef<{x:number;y:number;camera:CameraState;mode:'orbit'|'pan'}|null>(null);
  const frames=useMemo(()=>createSimulationFrames(project),[project]);
  useEffect(()=>{setStep(0);setPlaying(false)},[project.id,project.bends.length,mode]);
  useEffect(()=>{if(!playing)return;const t=window.setInterval(()=>setStep(v=>{if(v>=frames.length-1){setPlaying(false);return frames.length-1}return v+1}),delays[speed]);return()=>window.clearInterval(t)},[playing,frames.length,speed]);
  const frame=frames[Math.min(step,frames.length-1)]??frames[0];
  const machine=machines.find(x=>x.id===machineId)??machines[0];
  const punch=tools.find(x=>x.id===punchId)??tools.find(x=>x.kind==='punch')!;
  const die=tools.find(x=>x.id===dieId)??tools.find(x=>x.kind==='die')!;
  const angle=Math.max(0,Math.min(180,frame?.achievedAngle??180));
  const bend=frame?.bend; const currentLabel=step===frames.length-1?'Pieza terminada':bend?`Plegado ${bend.order} de ${project.bends.length}`:'Posicionar chapa';
  const progress=Math.round((step/Math.max(1,frames.length-1))*100);
  const cards=[{label:'Preparar',frame:0},...project.bends.map((b,i)=>({label:`Plegado ${b.order}`,frame:Math.min(frames.length-1,2+i*3)})),{label:'Final',frame:frames.length-1}];
  const go=(n:number)=>{setPlaying(false);setStep(Math.max(0,Math.min(frames.length-1,n)))};
  const resetCamera=()=>setCamera(defaultCamera);
  const updateZoom=(delta:number)=>setCamera(v=>({...v,zoom:Math.max(.55,Math.min(2.4,v.zoom+delta))}));
  const onWheel=(event:ReactWheelEvent)=>{event.preventDefault();updateZoom(event.deltaY>0?-.1:.1)};
  const onPointerDown=(event:ReactPointerEvent<HTMLElement>)=>{drag.current={x:event.clientX,y:event.clientY,camera,mode:event.shiftKey||event.pointerType==='touch'&&event.isPrimary===false?'pan':'orbit'};event.currentTarget.setPointerCapture(event.pointerId)};
  const onPointerMove=(event:ReactPointerEvent<HTMLElement>)=>{if(!drag.current)return;const dx=event.clientX-drag.current.x,dy=event.clientY-drag.current.y;if(drag.current.mode==='pan'){setCamera({...drag.current.camera,panX:drag.current.camera.panX+dx,panY:drag.current.camera.panY+dy})}else{setCamera({...drag.current.camera,rotateY:drag.current.camera.rotateY+dx*.24,rotateX:Math.max(-55,Math.min(55,drag.current.camera.rotateX-dy*.2))})}};
  const onPointerUp=(event:ReactPointerEvent<HTMLElement>)=>{drag.current=null;try{event.currentTarget.releasePointerCapture(event.pointerId)}catch{/* noop */}};
  const setView=(view:'front'|'side'|'top'|'iso')=>setCamera(v=>({...v,rotateX:view==='top'?72:view==='iso'?-18:0,rotateY:view==='side'?90:view==='iso'?-22:0,panX:0,panY:0,zoom:1}));
  const visualTransform=`translate3d(${camera.panX}px,${camera.panY}px,0) scale(${camera.flipped?-camera.zoom:camera.zoom},${camera.zoom}) rotateX(${camera.rotateX}deg) rotateY(${camera.rotateY}deg)`;
  const cardClass=(frameNumber:number)=>step===frameNumber?'active':step>frameNumber?'completed':'';
  return <Page title={mode==='2d'?'Simulación 2D':'Simulación 3D'} subtitle={mode==='2d'?'Sección técnica animada con cotas y herramientas':'Plegadora completa, cámara libre y secuencia sincronizada'}>
    {!lockedMode&&<div className="sim-ref-tabs"><button className={mode==='2d'?'active':''} onClick={()=>setMode('2d')}>Simulación 2D</button><button className={mode==='3d'?'active':''} onClick={()=>setMode('3d')}>Simulación 3D</button></div>}
    <section className="sim-ref-shell simulation-pro-shell">
      <header className="sim-ref-player">
        <div className="sim-ref-controls"><button title="Inicio" onClick={()=>go(0)}><SkipBack/></button><button title="Anterior" onClick={()=>go(step-1)}><ChevronLeft/></button><button className="active" title={playing?'Pausar':'Reproducir'} onClick={()=>setPlaying(v=>!v)}>{playing?<Pause/>:<Play/>}</button><button title="Siguiente" onClick={()=>go(step+1)}><ChevronRight/></button><button title="Final" onClick={()=>go(frames.length-1)}><SkipForward/></button></div>
        <div className="simulation-step-heading"><strong>Paso {step+1}/{frames.length}</strong><span>{currentLabel}</span></div><div className="sim-ref-progress"><i style={{width:`${progress}%`}}/></div><b className="simulation-percent">{progress}%</b>
      </header>
      <div className="sim-ref-body">
        <aside className="sim-ref-tools"><button title="Isométrica" onClick={()=>setView('iso')}><Maximize2/></button><button title="Frontal" onClick={()=>setView('front')}><Home/></button><button title="Lateral" onClick={()=>setView('side')}><FastForward/></button><button title="Superior" onClick={()=>setView('top')}><RotateCcw/></button><button title="Acercar" onClick={()=>updateZoom(.12)}><Plus/></button><button title="Alejar" onClick={()=>updateZoom(-.12)}><Minus/></button><button title="Girar" onClick={()=>setCamera(v=>({...v,rotateY:v.rotateY+15}))}><RotateCw/></button><button title="Voltear" onClick={()=>setCamera(v=>({...v,flipped:!v.flipped}))}><FlipHorizontal2/></button><button title="Centrar" onClick={resetCamera}><Home/></button></aside>
        <main className="sim-ref-stage" onWheel={onWheel} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onDoubleClick={resetCamera}>
          <div className="simulation-interaction-hint">Arrastra para girar · Mayús + arrastrar para mover · Rueda/pellizco para zoom</div>
          {mode==='2d'?<div className="sim2d-reference sim2d-pro" style={{transform:`translate(${camera.panX}px,${camera.panY}px) scale(${camera.flipped?-camera.zoom:camera.zoom},${camera.zoom}) rotate(${camera.rotateY*.08}deg)`}}>
            <div className="sim2d-punch"><i/></div><div className="sim2d-sheet" style={{transform:`rotate(${(180-angle)/2}deg)`}}/><div className="sim2d-sheet right" style={{transform:`scaleX(-1) rotate(${(180-angle)/2}deg)`}}/><div className="sim2d-die"><i/></div><div className="sim2d-angle">{Math.round(angle)}°</div><div className="sim2d-centerline"/><div className="sim2d-v-dimension">V {die.v??'—'} mm</div><div className="sim2d-radius-dimension">R {bend?.radius??0} mm</div><div className="sim2d-y-dimension">Y {frame.ramY} mm</div>
          </div>:<div className="sim3d-reference sim3d-pro" style={{transform:visualTransform}}>
            <div className="sim3d-factory"><i/><i/><i/></div><div className="sim3d-wall"/><div className="sim3d-machine"><div className="sim3d-top"><span>{machine.manufacturer}</span><b>{machine.name}</b><small>{machine.forceT??100} T · {machine.lengthMm??project.width} mm</small></div><div className="sim3d-red left"/><div className="sim3d-red right"/><div className="sim3d-column left"/><div className="sim3d-column right"/><div className="sim3d-cylinder left"/><div className="sim3d-cylinder right"/><div className="sim3d-ram" style={{transform:`translateY(${Math.min(34,frame.ramY/2)}px)`}}/><div className="sim3d-tool"/><div className="sim3d-table"/><div className="sim3d-backgauge"><i/><i/></div><div className="sim3d-console"><span>PLEGAR PRO</span><b>{progress}%</b></div><div className="sim3d-part" style={{'--fold':`${Math.max(0,180-angle)}deg`} as CSSProperties}><i className="left"/><i className="center"/><i className="right"/></div></div>
          </div>}
          {showDimensions&&<div className="sim-ref-overlay"><span>L {project.length} mm</span><span>A {project.width} mm</span><span>E {project.thickness} mm</span><span>Ángulo {Math.round(angle)}°</span><span>Radio R{bend?.radius??0}</span><span>AV {die.v??'—'} mm</span><span>X {bend?.backgaugeX??0} mm</span><span>Y {frame.ramY} mm</span></div>}
        </main>
        <aside className="sim-ref-data"><h3>DATOS EN TIEMPO REAL</h3><dl><div><dt>Máquina</dt><dd>{machine.name}</dd></div><div><dt>Punzón</dt><dd>{punch.name}</dd></div><div><dt>Matriz</dt><dd>{die.name}</dd></div><div><dt>Espesor</dt><dd>{project.thickness} mm</dd></div><div><dt>Material</dt><dd>{project.material}</dd></div><div><dt>Fuerza actual</dt><dd>{Math.round((machine.forceT||100)*(progress/100))} T</dd></div><div><dt>Ángulo actual</dt><dd>{Math.round(angle)}°</dd></div><div><dt>Radio interior</dt><dd>R{bend?.radius??0}</dd></div><div><dt>Tope X</dt><dd>{bend?.backgaugeX??0} mm</dd></div><div><dt>Y actual</dt><dd>{frame.ramY} mm</dd></div></dl><label>Velocidad<select value={speed} onChange={e=>setSpeed(e.target.value as 'slow'|'normal'|'fast')}><option value="slow">0,5×</option><option value="normal">1×</option><option value="fast">2×</option></select></label><label className="dimension-toggle"><input type="checkbox" checked={showDimensions} onChange={e=>setShowDimensions(e.target.checked)}/> Mostrar todas las cotas</label><div className="simulation-state-card"><i className={playing?'running':'ready'}/><span>{playing?'Máquina en ciclo':step===frames.length-1?'Pieza terminada':'Máquina preparada'}</span></div></aside>
      </div>
      <footer className="sim-ref-sequence"><div className="sequence-heading"><h3>SECUENCIA DE PLEGADO</h3><span>{project.bends.length} pliegues · {frames.length} estados</span></div><div>{cards.map((c,i)=><button key={`${c.label}-${i}`} className={cardClass(c.frame)} onClick={()=>go(c.frame)}><span>{i+1}</span><div className={`mini-part stage-${Math.min(i,3)}`}><i/><b/></div><strong>{c.label}</strong><small>{step>c.frame?'Completado':step===c.frame?'En curso':'Pendiente'}</small></button>)}</div></footer>
    </section>
  </Page>;
}


export function Simulation2DPage(){
  return <SimulationPage initialMode="2d" lockedMode/>;
}

export function Simulation3DPage(){
  return <SimulationPage initialMode="3d" lockedMode/>;
}
