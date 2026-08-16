import {useMemo,useState} from 'react';
import {Page} from '../../components/Page';

type ReleaseManifest={
  product:string;
  version:string;
  channel:'stable'|'beta';
  publishedAt:string;
  minimumVersion?:string;
  notes:string[];
  packageUrl?:string;
  sha256?:string;
};

const CURRENT_VERSION='0.21.0';
const DEFAULT_CHANNEL='beta';
const STORAGE_KEY='plegar-pro-update-source';

const compareVersions=(a:string,b:string)=>{
  const aa=a.split('.').map(Number),bb=b.split('.').map(Number);
  for(let i=0;i<Math.max(aa.length,bb.length);i++){
    const delta=(aa[i]??0)-(bb[i]??0);
    if(delta!==0)return delta;
  }
  return 0;
};

export function UpdatesPage(){
  const [source,setSource]=useState(()=>localStorage.getItem(STORAGE_KEY)??'/updates/latest.json');
  const [manifest,setManifest]=useState<ReleaseManifest|null>(null);
  const [state,setState]=useState<'idle'|'checking'|'available'|'current'|'error'>('idle');
  const [message,setMessage]=useState('');
  const available=useMemo(()=>manifest?compareVersions(manifest.version,CURRENT_VERSION)>0:false,[manifest]);

  const check=async()=>{
    setState('checking');setMessage('Comprobando el canal de actualizaciones…');
    try{
      const response=await fetch(`${source}${source.includes('?')?'&':'?'}t=${Date.now()}`,{cache:'no-store'});
      if(!response.ok)throw new Error(`Respuesta ${response.status}`);
      const data=await response.json() as ReleaseManifest;
      if(data.product!=='Plegar Pro'||!data.version||!Array.isArray(data.notes))throw new Error('Manifiesto no válido');
      setManifest(data);
      setState(compareVersions(data.version,CURRENT_VERSION)>0?'available':'current');
      setMessage(compareVersions(data.version,CURRENT_VERSION)>0?`Actualización ${data.version} disponible.`:'Plegar Pro está actualizado.');
      localStorage.setItem(STORAGE_KEY,source);
    }catch(error){setState('error');setMessage(`No se pudo comprobar: ${error instanceof Error?error.message:'error desconocido'}`)}
  };

  const download=()=>{
    if(!manifest?.packageUrl){setMessage('El manifiesto no incluye todavía una dirección de descarga.');return;}
    window.open(manifest.packageUrl,'_blank','noopener,noreferrer');
  };

  const importManifest=async(file:File|null)=>{
    if(!file)return;
    try{
      const data=JSON.parse(await file.text()) as ReleaseManifest;
      if(data.product!=='Plegar Pro'||!data.version||!Array.isArray(data.notes))throw new Error('Formato incorrecto');
      setManifest(data);setState(compareVersions(data.version,CURRENT_VERSION)>0?'available':'current');setMessage(`Paquete ${data.version} leído correctamente.`);
    }catch{setState('error');setMessage('El archivo de actualización no es válido.');}
  };

  return <Page title="Actualizaciones" subtitle="Una sola instalación de Plegar Pro y reparaciones acumulativas" actions={<button type="button" onClick={check} disabled={state==='checking'}>{state==='checking'?'Comprobando…':'Buscar actualizaciones'}</button>}>
    <div className="update-layout">
      <section className="panel update-current">
        <div className="update-badge">INSTALACIÓN ACTUAL</div>
        <h2>Plegar Pro {CURRENT_VERSION}</h2>
        <dl><div><dt>Canal</dt><dd>{DEFAULT_CHANNEL}</dd></div><div><dt>Estado</dt><dd>{state==='available'?'Actualización disponible':'Operativo'}</dd></div><div><dt>Datos</dt><dd>Se conservan entre actualizaciones</dd></div></dl>
        <label>Origen del canal<input value={source} onChange={e=>setSource(e.target.value)} placeholder="/updates/latest.json"/></label>
        <p className={`update-status ${state}`}>{message||'Pulsa “Buscar actualizaciones” para comprobar el canal configurado.'}</p>
      </section>
      <section className="panel update-release">
        <h3>{manifest?`Versión ${manifest.version}`:'Próxima actualización'}</h3>
        {manifest?<><p><strong>Publicada:</strong> {new Date(manifest.publishedAt).toLocaleString()}</p><ul>{manifest.notes.map((note,index)=><li key={`${note}-${index}`}>{note}</li>)}</ul>{manifest.sha256&&<p className="hash"><strong>SHA-256:</strong> {manifest.sha256}</p>}<button type="button" onClick={download} disabled={!available}>Descargar actualización</button></>:<p>Las futuras reparaciones se distribuirán como versiones acumulativas. No será necesario reinstalar ni abrir carpetas de betas diferentes.</p>}
      </section>
      <section className="panel update-recovery">
        <h3>Seguridad de actualización</h3>
        <ol><li>Copia automática de los datos locales.</li><li>Comprobación de versión y manifiesto.</li><li>Descarga del paquete firmado.</li><li>Posibilidad de volver a la versión anterior.</li></ol>
        <label className="file-button">Leer manifiesto local<input type="file" accept=".json,application/json" onChange={e=>importManifest(e.target.files?.[0]??null)}/></label>
      </section>
    </div>
  </Page>;
}
