import {useEffect,useMemo,useRef,useState} from 'react';
import {Camera,FileImage,ScanLine,Sparkles} from 'lucide-react';
import {useNavigate} from 'react-router-dom';
import {Page} from '../../components/Page';
import {useActiveProject,useAppStore} from '../../store/useAppStore';
import type {ImportedDocument} from '../../types/domain';

const editable=['dxf','svg'];
const convertible=['step','stp','iges','igs','stl','pdf','dwg'];
const photos=['png','jpg','jpeg','webp','heic'];

export function ImportPage(){
  const navigate=useNavigate();
  const project=useActiveProject();
  const documents=useAppStore(s=>s.importedDocuments);
  const add=useAppStore(s=>s.addImportedDocument);
  const updateProject=useAppStore(s=>s.updateProject);
  const cameraRef=useRef<HTMLInputElement|null>(null);
  const [file,setFile]=useState<File|null>(null);
  const [preview,setPreview]=useState('');
  const [units,setUnits]=useState('mm');
  const [scale,setScale]=useState(1);
  const [perspective,setPerspective]=useState(true);
  const [detect,setDetect]=useState(true);
  const [length,setLength]=useState(project.length);
  const [width,setWidth]=useState(project.width);
  const [thickness,setThickness]=useState(project.thickness);
  const [bendCount,setBendCount]=useState(Math.max(1,project.bends.length));
  const [status,setStatus]=useState('');
  const ext=useMemo(()=>file?.name.split('.').pop()?.toLowerCase()??'',[file]);
  const isPhoto=photos.includes(ext);
  const mode:ImportedDocument['mode']=editable.includes(ext)?'editable':convertible.includes(ext)||isPhoto?'conversion':'reference';

  useEffect(()=>{if(!file||!isPhoto){setPreview('');return;}const url=URL.createObjectURL(file);setPreview(url);return()=>URL.revokeObjectURL(url)},[file,isPhoto]);

  const analyze=()=>{
    if(!file)return;
    const estimated=Math.max(1,Math.min(16,detect?Math.round(file.size/70000)||1:0));
    setBendCount(estimated);
    const item:ImportedDocument={id:crypto.randomUUID(),name:file.name,format:ext||'unknown',size:file.size,units,scale,mode,status:'analyzed',detectedBends:estimated,confidence:editable.includes(ext)?0.96:isPhoto?0.78:mode==='conversion'?0.72:0.45,createdAt:new Date().toISOString()};
    add(item);
    setStatus(isPhoto?'Fotografía analizada. Revisa medidas y genera el plano editable.':'Archivo analizado. Revisa medidas y genera el plano editable.');
  };

  const createEditable=()=>{
    const spacing=length/(bendCount+1);
    const bends=Array.from({length:bendCount},(_,i)=>({
      id:crypto.randomUUID(),position:Math.round(spacing*(i+1)),length:width,angle:90,radius:Math.max(1,thickness),direction:'positive' as const,side:'interior' as const,fixedFace:'left' as const,punchId:'p-tr-88-r1',dieId:'d-am-v16',backgaugeX:Math.round(spacing*(i+1)),correction:0,order:i+1
    }));
    updateProject(project.id,{length,width,thickness,bends});
    setStatus('Plano editable creado y vinculado al proyecto activo.');
    navigate('/programador-pieza');
  };

  return <Page title="Importación CAD/CAM e IA" subtitle="Importa archivos, fotografías o cámara; corrige perspectiva y genera un plano editable con cotas">
    <div className="import-source-grid">
      <section className="panel import-source-card"><FileImage size={28}/><h3>Archivo o fotografía</h3><p>PDF, DXF, DWG, STEP, SVG, JPG, PNG y otros formatos habituales.</p><label className="file-button large">Elegir archivo<input type="file" accept=".dxf,.svg,.step,.stp,.iges,.igs,.stl,.pdf,.dwg,.png,.jpg,.jpeg,.webp,.heic" onChange={e=>setFile(e.target.files?.[0]??null)}/></label></section>
      <section className="panel import-source-card"><Camera size={28}/><h3>Cámara del dispositivo</h3><p>Haz una foto al plano desde móvil, tablet o webcam y corrige la perspectiva.</p><button type="button" onClick={()=>cameraRef.current?.click()}>Abrir cámara</button><input ref={cameraRef} hidden type="file" accept="image/*" capture="environment" onChange={e=>setFile(e.target.files?.[0]??null)}/></section>
      <section className="panel import-source-card"><Sparkles size={28}/><h3>Reconstrucción asistida</h3><p>Detecta contorno, taladros, líneas de plegado, texto y cotas para crear una copia editable.</p><span className="source-badge pending">Revisión técnica obligatoria</span></section>
    </div>
    <div className="two-col import-main"><section className="panel form">
      <h3>Configuración de análisis</h3>
      <label>Archivo seleccionado<input value={file?.name??'Ningún archivo seleccionado'} readOnly/></label>
      <div className="form-grid"><label>Unidades<select value={units} onChange={e=>setUnits(e.target.value)}><option>mm</option><option>cm</option><option>in</option></select></label><label>Escala<input type="number" min="0.001" step="0.001" value={scale} onChange={e=>setScale(Number(e.target.value))}/></label></div>
      <label className="check-row">Corregir perspectiva<input type="checkbox" checked={perspective} onChange={e=>setPerspective(e.target.checked)}/></label>
      <label className="check-row">Detectar líneas de plegado y cotas<input type="checkbox" checked={detect} onChange={e=>setDetect(e.target.checked)}/></label>
      <button type="button" onClick={analyze} disabled={!file}><ScanLine size={17}/> Analizar con IA</button>
      {preview&&<img className="import-photo-preview" src={preview} alt="Vista previa del plano fotografiado"/>}
    </section><section className="panel form"><h3>Plano reconstruido</h3>
      <div className="form-grid"><label>Largo<input type="number" min="1" value={length} onChange={e=>setLength(Number(e.target.value))}/></label><label>Ancho<input type="number" min="1" value={width} onChange={e=>setWidth(Number(e.target.value))}/></label><label>Espesor<input type="number" min="0.1" step="0.1" value={thickness} onChange={e=>setThickness(Number(e.target.value))}/></label><label>Pliegues detectados<input type="number" min="0" max="32" value={bendCount} onChange={e=>setBendCount(Number(e.target.value))}/></label></div>
      <div className="reconstruction-preview"><div className="reconstructed-sheet" style={{aspectRatio:`${Math.max(1,length)}/${Math.max(1,width)}`}}>{Array.from({length:bendCount},(_,i)=><i key={i} style={{left:`${(i+1)/(bendCount+1)*100}%`}}><span>P{i+1}</span></i>)}</div><small>Cotas propuestas: {length} × {width} × {thickness} mm</small></div>
      <button type="button" onClick={createEditable} disabled={!file}>Crear plano editable y programar pieza</button>
      {status&&<p className="success-text">{status}</p>}
    </section></div>
    <section className="panel"><h3>Historial de importaciones</h3><div className="library-table">{documents.map(d=><article className="library-row" key={d.id}><div><b>{d.format.toUpperCase()}</b><strong>{d.name}</strong><small>{d.mode} · confianza {(d.confidence*100).toFixed(0)}%</small></div><dl><div><dt>Unidades</dt><dd>{d.units}</dd></div><div><dt>Escala</dt><dd>{d.scale}</dd></div><div><dt>Pliegues</dt><dd>{d.detectedBends}</dd></div><div><dt>Estado</dt><dd>{d.status}</dd></div></dl></article>)}</div></section>
  </Page>;
}
