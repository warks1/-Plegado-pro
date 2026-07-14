const PAGE_META={
 dashboard:['Panel principal','Proyecto acumulativo profesional'],
 import:['Importación universal','Planos, imágenes y modelos CAD'],
 bends:['Multiplegado','Secuencia editable de varios pliegues'],
 calc:['Compensación por matriz V','Desarrollo, pérdida y ganancia de medidas'],
 vanalyzer:['Analizador inteligente V','Impacto dimensional, agujeros, fuerza y robustez'],
 beta:['Centro de la beta','Versión, integridad, módulos y exportación'],
 simulation2d:['Simulación 2D','Playback Studio reversible y sincronizado'],
 simulation:['Simulación 3D','Vista de plegadora, trancha, mesa y utillaje'],
 playbackcontrol:['Centro de simulación','Control maestro 2D/3D, rangos, cámaras y diagnóstico'],
 tools:['Utillaje','Biblioteca Mecos, Bystronic y multimarca'],
 production:['Producción','Preparación, montaje, fabricación y tiempo real'],
 quality:['Calidad','Corrección de primera pieza'],
 clients:['Clientes y comunicación','WhatsApp, correo e historial'],
 quotes:['Presupuestos','Coste, margen y precio por pieza'],
 planner:['Planificación','Órdenes, prioridad y carga de máquina'],
 inventory:['Inventario','Materiales y utillaje disponible'],
 documents:['Documentación','Planos, certificados y copias de seguridad'],
 analytics:['Indicadores','Resumen operativo del taller'],
 preparation:['Preparación','Checklist y validación previa'],
 strategies:['Qué pasaría si','Comparación de matrices, tiempos y riesgos'],
 calibration:['Calibración','Correcciones reales por máquina y material'],
 traceability:['Trazabilidad','Pasaporte digital de la pieza'],
 rules:['Reglas del taller','Procedimientos y experiencia interna'],
 jobs:['Órdenes de trabajo','Expediente, estados y persistencia local'],
 optimizer:['Optimizador','Comparación automática de alternativas V'],
 engineering:['Núcleo industrial','Motores, integridad y análisis de decisión'],
 system:['Centro del sistema','Integridad, errores, datos y actualizaciones'],
 ai:['Copiloto IA','Asistente técnico de plegado']
};
const LABELS={dashboard:'Panel',import:'Importar',bends:'Pliegues',calc:'Comparar V',vanalyzer:'Analizador V',beta:'Beta',simulation2d:'2D',simulation:'3D',playbackcontrol:'Control sim.',tools:'Utillaje',production:'Tiempos',quality:'Calidad',clients:'Clientes',quotes:'Presup.',planner:'Planificar',inventory:'Inventario',documents:'Docs',analytics:'Indicadores',preparation:'Preparar',strategies:'Escenarios',calibration:'Calibrar',traceability:'Trazabilidad',rules:'Reglas',jobs:'Órdenes',optimizer:'Optimizar',engineering:'Núcleo',system:'Sistema',ai:'IA'};
const nav=document.getElementById('nav');
const MENU_GROUPS=[
  ['Trabajo',['dashboard','jobs','import','bends','simulation2d','simulation','playbackcontrol','calc','vanalyzer','tools','optimizer','beta']],
  ['Producción',['production','quality','preparation','strategies','calibration']],
  ['Gestión',['clients','quotes','planner','inventory','documents','analytics']],
  ['Conocimiento',['traceability','rules','engineering','system','ai']]
];
MENU_GROUPS.forEach(([title,items])=>{
  const group=document.createElement('div');group.className='nav-group';
  group.innerHTML=`<div class="nav-title">${title}</div>`;
  items.forEach((k)=>{
    const b=document.createElement('button');
    b.textContent=LABELS[k];
    b.dataset.page=k;
    b.dataset.search=(LABELS[k]+' '+PAGE_META[k][0]+' '+PAGE_META[k][1]).toLowerCase();
    b.className=k==='dashboard'?'active':'';
    b.onclick=()=>{go(k);if(innerWidth<=900)toggleMenu(false)};
    group.appendChild(b);
  });
  nav.appendChild(group);
});
const launcher=document.getElementById('moduleLauncher');if(launcher){Object.entries(LABELS).forEach(([k,v])=>{launcher.insertAdjacentHTML('beforeend',`<button class="module-link" onclick="go('${k}')"><strong>${v}</strong><small>${PAGE_META[k]?.[1]||''}</small></button>`);});}
function go(k){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.dataset.page===k));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.page===k));pageTitle.textContent=PAGE_META[k][0];pageSub.textContent=PAGE_META[k][1];if(k==='simulation2d')setTimeout(draw2D,40);if(k==='simulation')setTimeout(drawSim,40);if(k==='playbackcontrol')setTimeout(initMasterPlaybackUI,30);if(k==='system')setTimeout(runSystemDiagnostics,20);if(k==='beta')setTimeout(runBetaDiagnostics,20)}
function toggleMenu(open){document.body.classList.toggle('menu-open',open)}
function filterMenu(){
  const q=normalizeText(menuSearch.value);
  document.querySelectorAll('.nav-group').forEach(g=>{
    let visible=0;
    g.querySelectorAll('button[data-page]').forEach(b=>{
      const show=!q||normalizeText(b.dataset.search).includes(q);
      b.style.display=show?'':'none';if(show)visible++;
    });
    g.style.display=visible?'':'none';
  });
}
function detectDevice(){const w=window.innerWidth;let d=w<=760?'Móvil':w<=1100?'Tablet':'PC';kDevice.textContent=d;deviceStatus.textContent='● '+d+' · interfaz adaptada';document.body.dataset.device=d.toLowerCase()}
window.addEventListener('resize',()=>{detectDevice();if(document.querySelector('[data-page="simulation2d"]')?.classList.contains('active'))draw2D();if(document.querySelector('[data-page="simulation"]')?.classList.contains('active'))drawSim()});detectDevice();

let selectedFiles=[];const drop=document.getElementById('drop'),fileInput=document.getElementById('fileInput');
drop.onclick=()=>fileInput.click();fileInput.onchange=e=>{selectedFiles=[...e.target.files];renderFiles()};
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('drag')}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('drag')}));
drop.addEventListener('drop',e=>{selectedFiles=[...e.dataTransfer.files];renderFiles()});
function renderFiles(){fileList.innerHTML=selectedFiles.map(f=>`<div class="pill">${f.name} · ${(f.size/1024).toFixed(1)} KB</div>`).join('');validation.textContent=selectedFiles.length?`${selectedFiles.length} archivo(s) preparados para análisis.`:'Carga un plano.'}
function analyzeFiles(){if(!selectedFiles.length){validation.textContent='No hay archivos seleccionados.';return}detMat.value=jobMaterial.value;detThk.value=jobThickness.value+' mm';detBends.value=bends.length;detScale.value='1:1 (verificar)';validation.textContent='Análisis preliminar completado. Confirma escala, espesor, cotas y líneas de pliegue antes de fabricar.'}

let bends=[
 {angle:90,dir:'Arriba',length:50},
 {angle:88,dir:'Abajo',length:85},
 {angle:90,dir:'Arriba',length:40}
];
function renderBends(){bendList.innerHTML='';bends.forEach((b,i)=>{const div=document.createElement('div');div.className='bend-item';div.innerHTML=`<div class="bend-num">#${i+1}</div>
<div class="field"><label>Ángulo</label><input type="number" value="${b.angle}" onchange="updateBend(${i},'angle',this.value)"></div>
<div class="field"><label>Sentido</label><select onchange="updateBend(${i},'dir',this.value)"><option ${b.dir==='Arriba'?'selected':''}>Arriba</option><option ${b.dir==='Abajo'?'selected':''}>Abajo</option></select></div>
<button class="btn danger" onclick="removeBend(${i})">Eliminar</button>`;bendList.appendChild(div)});
kBends.textContent=bends.length;pBends.value=bends.length;renderBendSummary()}
function updateBend(i,k,v){bends[i][k]=k==='angle'?+v:v;renderBendSummary()}
function removeBend(i){bends.splice(i,1);if(!bends.length)bends.push({angle:90,dir:'Arriba',length:50});renderBends();resetSim()}
function addBend(){bends.push({angle:90,dir:bends.length%2?'Abajo':'Arriba',length:50});renderBends();resetSim()}
function loadExampleBends(){bends=[{angle:90,dir:'Arriba'},{angle:30,dir:'Arriba'},{angle:88,dir:'Abajo'},{angle:90,dir:'Arriba'},{angle:60,dir:'Abajo'}];renderBends();resetSim()}
function renderBendSummary(){const rows=bends.map((b,i)=>`<tr><td>${i+1}</td><td>${b.angle}°</td><td>${b.dir}</td><td>${i===0?'Interior inicial':i===bends.length-1?'Cierre final':'Intermedio'}</td></tr>`).join('');
bendSummary.innerHTML=`<div class="table-wrap"><table><tr><th>Paso</th><th>Ángulo</th><th>Sentido</th><th>Función</th></tr>${rows}</table></div>`;
sequenceAdvice.textContent=bends.length>4?'Secuencia compleja: revisar primero pliegues interiores, cierres y posibles bloqueos. Conviene reducir giros y agrupar pliegues con el mismo montaje.':'La secuencia es viable de forma preliminar. La simulación permite revisar cada paso.'}
renderBends();if(typeof init2D==='function')init2D();

const V_LIST=[6,12,16,22,24,32,36,40,50];
V_LIST.forEach(v=>{cV1.add(new Option('V'+v,v));cV2.add(new Option('V'+v,v))});cV1.value='16';cV2.value='12';
function bendData(V,t,A,K){const r=Math.max(.2,V*.16);const theta=(180-A)*Math.PI/180;const BA=theta*(r+K*t);const setback=(r+t)*Math.tan(theta/2);const BD=2*setback-BA;return{r,BA,BD}}
function calculateV(){const t=+cT.value,A=+cA.value,L1=+cL1.value,L2=+cL2.value,V1=+cV1.value,V2=+cV2.value,K=+cK.value,cal=+cCal.value||0;const a=bendData(V1,t,A,K),b=bendData(V2,t,A,K);const dev1=L1+L2-a.BD,dev2=L1+L2-b.BD;const devDiff=dev2-dev1+cal;const measureChange=(b.BD-a.BD)-cal;const perSide=measureChange/2;
const word=measureChange>0?'ganará':measureChange<0?'perderá':'no cambiará';
calcResult.innerHTML=`<div class="table-wrap"><table>
<tr><th>Dato</th><th>V${V1}</th><th>V${V2}</th><th>Diferencia</th></tr>
<tr><td>Radio interior estimado</td><td>${a.r.toFixed(2)} mm</td><td>${b.r.toFixed(2)} mm</td><td>${(b.r-a.r).toFixed(2)} mm</td></tr>
<tr><td>Bend Allowance</td><td>${a.BA.toFixed(2)} mm</td><td>${b.BA.toFixed(2)} mm</td><td>${(b.BA-a.BA).toFixed(2)} mm</td></tr>
<tr><td>Bend Deduction</td><td>${a.BD.toFixed(2)} mm</td><td>${b.BD.toFixed(2)} mm</td><td>${(b.BD-a.BD).toFixed(2)} mm</td></tr>
<tr><td>Desarrollo para mantener cotas</td><td>${dev1.toFixed(2)} mm</td><td>${dev2.toFixed(2)} mm</td><td>${devDiff.toFixed(2)} mm</td></tr>
<tr><td>Cambio de medida usando el mismo desarrollo</td><td>Referencia</td><td class="${measureChange<0?'bad':'good'}">${measureChange.toFixed(2)} mm</td><td>${perSide.toFixed(2)} mm por ala</td></tr>
</table></div>
<p class="notice">Al pasar de V${V1} a V${V2}, manteniendo el mismo desarrollo, la pieza <b>${word} ${Math.abs(measureChange).toFixed(2)} mm</b> en la medida exterior total. Corrección orientativa: ${(-devDiff).toFixed(2)} mm en el desarrollo o ${(-perSide).toFixed(2)} mm por ala. Validar con probeta y calibración real del taller.</p>`}



const BETA_VERSION='28.1';
const BETA_BUILD='2026.07.14-2810';
let betaRuntimeErrors=[];
window.addEventListener('error',e=>{betaRuntimeErrors.push({message:e.message,at:new Date().toISOString()});if(document.getElementById('betaErrors'))betaErrors.textContent=betaRuntimeErrors.length});
function runBetaDiagnostics(){
  if(!document.getElementById('betaResults'))return;
  const pages=[...document.querySelectorAll('.page')],navButtons=[...document.querySelectorAll('.nav button[data-page]')],buttons=[...document.querySelectorAll('button')];
  const pageNames=pages.map(p=>p.dataset.page),duplicates=pageNames.filter((p,i,a)=>a.indexOf(p)!==i);
  const required=['dashboard','import','bends','calc','vanalyzer','simulation2d','simulation','playbackcontrol','tools','production','quality','clients','quotes','planner','inventory','documents','analytics','preparation','strategies','calibration','traceability','rules','jobs','optimizer','engineering','system','ai','beta'];
  const checks=[
    ['Páginas obligatorias',required.every(p=>pageNames.includes(p)),required.filter(p=>!pageNames.includes(p)).join(', ')||'Completas'],
    ['Páginas sin duplicados',duplicates.length===0,duplicates.join(', ')||'Correcto'],
    ['Motor 2D',typeof draw2D==='function','Disponible'],
    ['Motor 3D',typeof drawSim==='function','Disponible'],
    ['Playback maestro',typeof initMasterPlaybackUI==='function','Disponible'],
    ['Analizador V',typeof vaCalculate==='function','Disponible'],
    ['Comparador V',typeof calculateV==='function','Disponible'],
    ['Persistencia local',typeof localStorage!=='undefined','Disponible'],
    ['Utillaje',typeof renderTools==='function'||document.querySelector('[data-page="tools"]'),'Disponible'],
  ];
  let storageBytes=0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);storageBytes+=(k?.length||0)+(localStorage.getItem(k)?.length||0)}
  betaModules.textContent=Object.keys(LABELS).length;betaPages.textContent=pages.length;betaButtons.textContent=buttons.length;betaErrors.textContent=betaRuntimeErrors.length;betaStorage.textContent=(storageBytes/1024).toFixed(1)+' KB';
  const ok=checks.every(c=>c[1])&&betaRuntimeErrors.length===0;betaStatus.textContent=ok?'OPERATIVA':'REVISAR';betaStatus.className=ok?'good':'bad';
  betaResults.innerHTML=checks.map(c=>`<div class="approval-step"><span>${c[0]}<br><small class="muted">${c[2]}</small></span><span class="${c[1]?'badge-ok':'badge-bad'}">${c[1]?'Correcto':'Fallo'}</span></div>`).join('');
  return {version:BETA_VERSION,build:BETA_BUILD,checks,errors:betaRuntimeErrors,pages:pageNames,modules:Object.keys(LABELS)};
}
function exportBetaState(){
 const state=runBetaDiagnostics();
 const blob=new Blob([JSON.stringify({state,localData:Object.fromEntries(Object.keys(localStorage).map(k=>[k,localStorage.getItem(k)]))},null,2)],{type:'application/json'});
 const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='PlegarPro_v28_1_estado.json';a.click();URL.revokeObjectURL(a.href);
}

const VA_KEY='pp_v_analyzer_scenarios_v205';
let vaScenarios=JSON.parse(localStorage.getItem(VA_KEY)||'[]');
let vaLastResult=null;

function vaForceEstimate(V,t,L){
  const tonsPerMeter=(1.42*450*t*t)/Math.max(1,V)/100;
  return tonsPerMeter*(L/1000);
}
function vaHoleRisk(V,t,distance,diameter){
  const influence=Math.max(V*.5,t*2.5);
  const edge=Math.max(0,distance-diameter/2);
  const ratio=edge/Math.max(.1,influence);
  if(ratio<.55)return{level:'Alto',score:3,text:'El borde del agujero está dentro de la zona de deformación estimada.'};
  if(ratio<1)return{level:'Medio',score:2,text:'El agujero está próximo a la zona de deformación; revisar con probeta.'};
  return{level:'Bajo',score:1,text:'El agujero queda fuera de la zona de deformación estimada.'};
}
function vaCalculate(){
  const t=+vaT.value||2,A=+vaA.value||90,L1=+vaL1.value||0,L2=+vaL2.value||0,V1=+vaCurrent.value,V2=+vaAlternative.value,K=+vaK.value||.33;
  const length=+vaBendLength.value||1000,machineTons=+vaMachineTons.value||100,distance=+vaHoleDistance.value||0,diameter=+vaHoleDiameter.value||0;
  const current=bendData(V1,t,A,K),alt=bendData(V2,t,A,K);
  const devCurrent=L1+L2-current.BD,devAlt=L1+L2-alt.BD,devDiff=devAlt-devCurrent,measureDiff=alt.BD-current.BD;
  const forceCurrent=vaForceEstimate(V1,t,length),forceAlt=vaForceEstimate(V2,t,length);
  const holeCurrent=vaHoleRisk(V1,t,distance,diameter),holeAlt=vaHoleRisk(V2,t,distance,diameter);
  const minFlangeCurrent=Math.max(4*t,V1*.7),minFlangeAlt=Math.max(4*t,V2*.7),flange=Math.min(L1,L2);
  const flangeRiskCurrent=flange<minFlangeCurrent,flangeRiskAlt=flange<minFlangeAlt;
  const machineOkCurrent=forceCurrent<=machineTons,machineOkAlt=forceAlt<=machineTons;
  const robustness=Math.max(0,100-(holeAlt.score-1)*20-(flangeRiskAlt?25:0)-(!machineOkAlt?35:0)-Math.min(20,Math.abs(measureDiff)*12));
  vaLastResult={at:new Date().toISOString(),reason:vaReason.value,t,A,L1,L2,V1,V2,K,length,machineTons,distance,diameter,current,alt,devCurrent,devAlt,devDiff,measureDiff,forceCurrent,forceAlt,holeCurrent,holeAlt,minFlangeCurrent,minFlangeAlt,flangeRiskCurrent,flangeRiskAlt,machineOkCurrent,machineOkAlt,robustness};
  vaRenderResult(vaLastResult);return vaLastResult;
}
function vaRenderResult(r){
  vaHeadCurrent.textContent=`V${r.V1}`;vaHeadAlternative.textContent=`V${r.V2}`;
  vaDevDiff.textContent=`${r.devDiff>=0?'+':''}${r.devDiff.toFixed(3)} mm`;
  vaMeasureDiff.textContent=`${r.measureDiff>=0?'+':''}${r.measureDiff.toFixed(3)} mm`;
  vaRadiusDiff.textContent=`${(r.alt.r-r.current.r)>=0?'+':''}${(r.alt.r-r.current.r).toFixed(2)} mm`;
  vaForceDiff.textContent=`${(r.forceAlt-r.forceCurrent)>=0?'+':''}${(r.forceAlt-r.forceCurrent).toFixed(1)} t`;
  vaHoleRisk.textContent=`${r.holeCurrent.level} → ${r.holeAlt.level}`;
  vaRobustness.textContent=`${Math.round(r.robustness)}/100`;vaRobustness.className=r.robustness>=80?'risk-low':r.robustness>=55?'risk-medium':'risk-high';
  const rows=[
    ['Radio interior estimado',`${r.current.r.toFixed(2)} mm`,`${r.alt.r.toFixed(2)} mm`,`${(r.alt.r-r.current.r).toFixed(2)} mm`],
    ['Bend Allowance',`${r.current.BA.toFixed(3)} mm`,`${r.alt.BA.toFixed(3)} mm`,`${(r.alt.BA-r.current.BA).toFixed(3)} mm`],
    ['Bend Deduction',`${r.current.BD.toFixed(3)} mm`,`${r.alt.BD.toFixed(3)} mm`,`${(r.alt.BD-r.current.BD).toFixed(3)} mm`],
    ['Desarrollo para mantener cotas',`${r.devCurrent.toFixed(3)} mm`,`${r.devAlt.toFixed(3)} mm`,`${r.devDiff.toFixed(3)} mm`],
    ['Cambio con mismo desarrollo','Referencia',`${r.measureDiff.toFixed(3)} mm`,`${(r.measureDiff/2).toFixed(3)} mm por ala`],
    ['Fuerza estimada',`${r.forceCurrent.toFixed(1)} t`,`${r.forceAlt.toFixed(1)} t`,`${(r.forceAlt-r.forceCurrent).toFixed(1)} t`],
    ['Ala mínima orientativa',`${r.minFlangeCurrent.toFixed(1)} mm`,`${r.minFlangeAlt.toFixed(1)} mm`,`${(r.minFlangeAlt-r.minFlangeCurrent).toFixed(1)} mm`],
    ['Riesgo de agujero',r.holeCurrent.level,r.holeAlt.level,`${r.holeCurrent.level} → ${r.holeAlt.level}`],
    ['Máquina',r.machineOkCurrent?'Compatible':'Supera límite',r.machineOkAlt?'Compatible':'Supera límite',`${r.machineTons.toFixed(0)} t disponibles`],
  ];
  vaRows.innerHTML=rows.map(x=>`<tr><td>${x[0]}</td><td>${x[1]}</td><td>${x[2]}</td><td>${x[3]}</td></tr>`).join('');
  const warnings=[];
  if(r.holeAlt.score>r.holeCurrent.score)warnings.push('La V alternativa aumenta el riesgo de deformación del agujero.');
  if(r.holeAlt.score<r.holeCurrent.score)warnings.push('La V alternativa mejora la separación respecto a la zona sensible del agujero.');
  if(r.flangeRiskAlt)warnings.push(`La pestaña más corta está por debajo del mínimo orientativo de V${r.V2}.`);
  if(!r.machineOkAlt)warnings.push(`La fuerza estimada supera el límite de ${r.machineTons.toFixed(0)} t.`);
  if(Math.abs(r.measureDiff)>.5)warnings.push('El cambio dimensional estimado supera 0,50 mm.');
  const recommendation=r.robustness>=80?'Alternativa técnicamente favorable de forma preliminar.':r.robustness>=55?'Alternativa posible, pero requiere revisión y probeta.':'Alternativa poco robusta con los parámetros actuales.';
  vaRecommendation.innerHTML=`<b>${recommendation}</b><br>V${r.V1} → V${r.V2}: desarrollo ${r.devDiff>=0?'+':''}${r.devDiff.toFixed(3)} mm; medida total con el mismo desarrollo ${r.measureDiff>=0?'+':''}${r.measureDiff.toFixed(3)} mm.<br>${warnings.length?warnings.map(w=>`• ${w}`).join('<br>'):'• Sin avisos básicos adicionales.'}<br><span class="small muted">Validar con tabla real de máquina, herramienta, material y probeta.</span>`;
  vaDrawComparison(r);
}
function vaDrawComparison(r){
  const c=vaCanvas,d=Math.min(devicePixelRatio||1,2),w=c.clientWidth||900,h=c.clientHeight||340;c.width=w*d;c.height=h*d;
  const x=c.getContext('2d');x.setTransform(d,0,0,d,0,0);x.clearRect(0,0,w,h);x.fillStyle='#03101a';x.fillRect(0,0,w,h);
  x.strokeStyle='#123047';for(let gx=0;gx<w;gx+=25){x.beginPath();x.moveTo(gx,0);x.lineTo(gx,h);x.stroke()}for(let gy=0;gy<h;gy+=25){x.beginPath();x.moveTo(0,gy);x.lineTo(w,gy);x.stroke()}
  const drawProfile=(V,color,yOffset)=>{const r0=Math.max(.2,V*.16),scale=Math.min(3.2,(w-150)/(r.L1+r.L2+40)),cx=w*.47,cy=h*.60+yOffset,a=(180-r.A)*Math.PI/180,left=r.L1*scale,right=r.L2*scale;x.strokeStyle=color;x.lineWidth=7;x.lineCap='round';x.lineJoin='round';x.beginPath();x.moveTo(cx-left,cy);x.lineTo(cx,cy);x.arc(cx,cy-r0*scale,r0*scale,Math.PI/2,Math.PI/2-a,true);x.lineTo(cx+Math.sin(a)*right,cy-Math.cos(a)*right);x.stroke();x.fillStyle=color;x.font='12px sans-serif';x.fillText(`V${V} · R≈${r0.toFixed(2)} mm`,20,30+yOffset)};
  drawProfile(r.V1,'#4eb9ff',0);drawProfile(r.V2,'#47dfbd',16);
  const scale=Math.min(3.2,(w-150)/(r.L1+r.L2+40)),cx=w*.47,cy=h*.60+16,holeX=cx-r.distance*scale;
  x.fillStyle='#ffbe6240';x.beginPath();x.arc(holeX,cy,r.diameter*scale/2+8,0,Math.PI*2);x.fill();x.strokeStyle='#ffbe62';x.lineWidth=2;x.beginPath();x.arc(holeX,cy,r.diameter*scale/2,0,Math.PI*2);x.stroke();
}
function vaRenderScenarios(){
  vaScenarioList.innerHTML=vaScenarios.length?vaScenarios.map((s,i)=>`<div class="scenario-card"><header><b>V${s.V1} → V${s.V2}</b><button class="icon-btn danger" onclick="vaDeleteScenario(${i})">×</button></header><small>${s.reason} · ${new Date(s.at).toLocaleString('es-ES')}</small><small>Desarrollo ${s.devDiff>=0?'+':''}${s.devDiff.toFixed(3)} mm · Medida ${s.measureDiff>=0?'+':''}${s.measureDiff.toFixed(3)} mm</small><small>Riesgo ${s.holeCurrent.level} → ${s.holeAlt.level} · Robustez ${Math.round(s.robustness)}/100</small><div class="actions"><button class="btn secondary" onclick="vaLoadScenario(${i})">Cargar</button></div></div>`).join(''):'<div class="empty-state">Sin escenarios guardados.</div>';
}
function vaDeleteScenario(i){vaScenarios.splice(i,1);localStorage.setItem(VA_KEY,JSON.stringify(vaScenarios));vaRenderScenarios()}
function vaLoadScenario(i){const s=vaScenarios[i];if(!s)return;vaT.value=s.t;vaA.value=s.A;vaL1.value=s.L1;vaL2.value=s.L2;vaCurrent.value=s.V1;vaAlternative.value=s.V2;vaK.value=s.K;vaBendLength.value=s.length;vaMachineTons.value=s.machineTons;vaHoleDistance.value=s.distance;vaHoleDiameter.value=s.diameter;vaReason.value=s.reason;vaLastResult=s;vaRenderResult(s);go('vanalyzer')}
function initVAnalyzer(){
  if(!document.getElementById('vaCurrent'))return;
  V_LIST.forEach(v=>{vaCurrent.add(new Option('V'+v,v));vaAlternative.add(new Option('V'+v,v))});vaCurrent.value='12';vaAlternative.value='10';
  vaAnalyzeBtn.onclick=vaCalculate;
  vaApplyBtn.onclick=()=>{const r=vaLastResult||vaCalculate();cT.value=r.t;cA.value=r.A;cL1.value=r.L1;cL2.value=r.L2;cV1.value=r.V1;cV2.value=r.V2;cK.value=r.K;go('calc');calculateV()};
  vaSaveScenarioBtn.onclick=()=>{const r=vaLastResult||vaCalculate();vaScenarios.unshift({...r});vaScenarios=vaScenarios.slice(0,50);localStorage.setItem(VA_KEY,JSON.stringify(vaScenarios));vaRenderScenarios()};
  vaClearScenariosBtn.onclick=()=>{vaScenarios=[];localStorage.removeItem(VA_KEY);vaRenderScenarios()};
  vaRenderScenarios();vaCalculate();
}

const tools=[];
V_LIST.forEach(v=>[30,60,88,90].forEach(a=>tools.push({brand:'Mecos',family:'Bystronic',type:'Matriz',name:`Mecos V${v} ${a}°`,angle:a,v:v,shape:'V',ref:`MEC-V${v}-${a}` })));
tools.push(
 {brand:'Mecos',family:'Bystronic',type:'Punzón',name:'Punzón recto 30°',angle:30,r:1,shape:'Recto',ref:'MEC-P-R30'},
 {brand:'Mecos',family:'Bystronic',type:'Punzón',name:'Punzón pata de cabra 90°',angle:90,r:1.5,shape:'Pata de cabra',ref:'MEC-P-PC90'},
 {brand:'Mecos',family:'Bystronic',type:'Punzón',name:'Punzón recto 88°',angle:88,r:1,shape:'Recto',ref:'MEC-P-R88'},
 {brand:'Bystronic',family:'Bystronic',type:'Punzón',name:'Punzón estándar 90°',angle:90,r:1,shape:'Recto',ref:'BYS-P-90'},
 {brand:'TRUMPF',family:'TRUMPF',type:'Punzón',name:'Punzón estándar 30°',angle:30,r:1,shape:'Recto',ref:'TRU-P-30'},
 {brand:'AMADA',family:'AMADA',type:'Matriz',name:'Matriz estándar V16 88°',angle:88,v:16,shape:'V',ref:'AMA-V16-88'},
 {brand:'Corplec',family:'Corplec',type:'Matriz',name:'Matriz estándar V12 90°',angle:90,v:12,shape:'V',ref:'COR-V12-90'}
);
let selPunch=null,selDie=null;
function normalizeText(value){
  return String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[°º]/g,'').replace(/\s+/g,' ').trim();
}
function toolSearchText(t){
  return normalizeText([
    t.brand,t.family,t.type,t.name,t.angle,t.v?`v${t.v}`:'',t.v||'',t.r?`r${t.r}`:'',
    t.shape,t.ref,`${t.angle} grados`,t.type==='Matriz'?'matriz die':'punzon punch'
  ].join(' '));
}
function renderTools(){
  const brand=normalizeText(fBrand.value),type=normalizeText(fType.value),angle=normalizeText(fAngle.value);
  const query=normalizeText(fSearch.value);
  const terms=query.split(' ').filter(Boolean);
  const list=tools.filter(t=>{
    const hay=toolSearchText(t);
    const brandOk=brand==='todos'||normalizeText(t.brand)===brand||normalizeText(t.family)===brand||hay.includes(brand);
    const typeOk=type==='todos'||normalizeText(t.type)===type;
    const angleOk=angle==='todos'||String(t.angle)===angle;
    const searchOk=!terms.length||terms.every(term=>hay.includes(term));
    return brandOk&&typeOk&&angleOk&&searchOk;
  });
  toolGrid.innerHTML=list.map(t=>{
    const idx=tools.indexOf(t);
    const selected=(selPunch===idx||selDie===idx)?' selected':'';
    return `<div class="tool-card${selected}" onclick="selectTool(${idx})">
      <b>${t.name}</b>
      <small>${t.brand} · Compatible/familia ${t.family}</small>
      <small>${t.type} · ${t.angle}° · ${t.v?'V'+t.v:'R'+(t.r||'—')}</small>
      <small>Ref. ${t.ref}</small>
      <button class="btn secondary" style="margin-top:8px;width:100%" onclick="event.stopPropagation();selectTool(${idx})">Seleccionar</button>
    </div>`;
  }).join('')||`<div class="notice"><b>No hay coincidencias con los filtros actuales.</b><br>Prueba a pulsar “Limpiar filtros” o busca solo por V, ángulo, marca o tipo.</div>`;
  toolCount.textContent=`${list.length} coincidencia${list.length===1?'':'s'}`;
  kTools.textContent=tools.length;
}
function clearToolFilters(){
  fBrand.value='Todos';fType.value='Todos';fAngle.value='Todos';fSearch.value='';renderTools();
document.addEventListener('keydown',e=>{if(e.key==='Escape')toggleMenu(false)});
}
function selectTool(i){const t=tools[i];if(t.type==='Punzón')selPunch=i;else selDie=i;renderTools();const p=selPunch!=null?tools[selPunch]:null,d=selDie!=null?tools[selDie]:null;mountInfo.innerHTML=`<b>Punzón:</b> ${p?p.name:'Pendiente'}<br><b>Matriz:</b> ${d?d.name:'Pendiente'}${p&&d?`<br><span class="${Math.abs(p.angle-d.angle)<=2?'good':'warntext'}">${Math.abs(p.angle-d.angle)<=2?'Montaje angular compatible de forma preliminar.':'Revisar compatibilidad angular y método de plegado.'}</span>`:''}`}
renderTools();


const cv=document.getElementById('sim'),ctx=cv?.getContext('2d');
const cv2=document.getElementById('sim2d'),ctx2=cv2?.getContext('2d');
const simInfoEl=document.getElementById('simInfo'),collisionInfoEl=document.getElementById('collisionInfo');
let simStep=0,simProgress=0,playing=false,lastT=0,simDirection=1,sim3dLoop=false;
let sim2dStep=0,sim2dProgress=0,sim2dPlaying=false,sim2dLastT=0,sim2dDirection=1,sim2dElapsed=0,sim3dElapsed=0;
let cameraView='operator',renderMode='high',orbitX=0,orbitY=0,dragging=false,lastPointer=null;
let sceneParts={backgauge:true,supports:true,safety:true};let pinchDistance=0;let simSpeed=1;let fullSequence=false;
const CAMERA_PRESETS={free:{yaw:-8,pitch:8,zoom:1},operator:{yaw:-8,pitch:8,zoom:1},front:{yaw:0,pitch:0,zoom:1.04},rear:{yaw:180,pitch:0,zoom:1.04},side:{yaw:62,pitch:3,zoom:.93},top:{yaw:0,pitch:66,zoom:.90},iso:{yaw:-34,pitch:22,zoom:.92}};
function formatPlaybackTime(seconds){const m=Math.floor(seconds/60),s=(seconds%60).toFixed(1).padStart(4,'0');return `${String(m).padStart(2,'0')}:${s}`}
function totalPlaybackPosition(step,progress){return bends.length?Math.max(0,Math.min(1,(step+progress)/bends.length)):0}
function renderTimelineMarkers(targetId){const host=document.getElementById(targetId);if(!host)return;host.innerHTML=bends.map((b,i)=>`<button style="left:${((i+.5)/Math.max(1,bends.length))*100}%" title="P${i+1} · ${b.angle}°" data-marker="${i}">${i+1}</button>`).join('')}
function update2DPlaybackUI(){const pos=totalPlaybackPosition(sim2dStep,sim2dProgress),fill=document.getElementById('sim2dTimelineFill'),clock=document.getElementById('sim2dClock'),btn=document.getElementById('play2dBtn'),rev=document.getElementById('reverse2dBtn');if(fill)fill.style.width=`${pos*100}%`;if(clock)clock.textContent=formatPlaybackTime(sim2dElapsed);if(btn)btn.textContent=sim2dPlaying&&sim2dDirection>0?'⏸ Pausar':'▶ Reproducir';if(rev)rev.textContent=sim2dPlaying&&sim2dDirection<0?'⏸ Pausar':'◀ Reproducir atrás'}
function update3DPlaybackUI(){const pos=totalPlaybackPosition(simStep,simProgress),fill=document.getElementById('sim3dTimelineFill'),clock=document.getElementById('sim3dClock'),dir=document.getElementById('statusDirection'),btn=document.getElementById('play3dBtn'),rev=document.getElementById('reverse3dBtn');if(fill)fill.style.width=`${pos*100}%`;if(clock)clock.textContent=formatPlaybackTime(sim3dElapsed);if(dir)dir.textContent=simDirection>0?'Adelante':'Atrás';if(btn)btn.textContent=playing&&simDirection>0?'⏸ Pausar':'▶ Reproducir / Pausa';if(rev)rev.textContent=playing&&simDirection<0?'⏸ Pausar':'◀ Reproducir atrás'}
function sync2DTo3D(){simStep=sim2dStep;simProgress=sim2dProgress;playing=false;fullSequence=false;drawSim();update3DPlaybackUI()}
function sync3DTo2D(){sim2dStep=simStep;sim2dProgress=simProgress;sim2dPlaying=false;const s=document.getElementById('sim2dStep'),p=document.getElementById('sim2dProgress');if(s)s.value=sim2dStep;if(p)p.value=Math.round(sim2dProgress*100);draw2D();update2DPlaybackUI()}
function toggle3DLoop(){sim3dLoop=!sim3dLoop;const b=document.getElementById('loop3dBtn');if(b)b.textContent=`Bucle: ${sim3dLoop?'sí':'no'}`}
function setCameraView(name){cameraView=name;if(name!=='free'){orbitX=0;orbitY=0}const sel=document.getElementById('cameraSelect');if(sel)sel.value=name;const st=document.getElementById('statusCamera');if(st)st.textContent=({free:'Libre',operator:'Operador',front:'Frontal',rear:'Trasera',side:'Lateral',top:'Superior',iso:'Isométrica'})[name]||name;drawSim()}
function setRenderQuality(v){renderMode=v;document.getElementById('statusQuality').textContent=({high:'Alta',medium:'Media',mobile:'Móvil'})[v]||v;drawSim()}
function toggleScenePart(part,btn){sceneParts[part]=!sceneParts[part];btn.classList.toggle('active',sceneParts[part]);drawSim()}
function setSpeed(v){simSpeed=v;document.getElementById('statusSpeed').textContent=v<1?'Lenta':v>1?'Rápida':'Normal'}
function playFullSequence(direction=1){simDirection=direction;fullSequence=true;simStep=direction>0?0:Math.max(0,bends.length-1);simProgress=direction>0?0:1;playing=true;lastT=performance.now();document.getElementById('statusSequence').textContent=direction>0?'Automática':'Automática inversa';renderSequenceTrack();update3DPlaybackUI();requestAnimationFrame(animate3D)}
function captureScene(){if(!cv)return;const a=document.createElement('a');a.href=cv.toDataURL('image/png');a.download=`PlegarPro_pliegue_${simStep+1}.png`;a.click()}
function renderSequenceTrack(){const el=document.getElementById('sequenceTrack');if(!el)return;el.innerHTML=bends.map((b,i)=>`<div class="seq-step ${i<simStep?'done':''} ${i===simStep?'active':''}" data-simstep="${i}"><b>#${i+1}</b><span>${b.angle}° · ${b.dir}</span></div>`).join('');el.querySelectorAll('[data-simstep]').forEach(n=>n.onclick=()=>{simStep=+n.dataset.simstep;simProgress=0;playing=false;fullSequence=false;drawSim();update3DPlaybackUI()})}
function projectSimple(x,y,z,scene){const p=CAMERA_PRESETS[cameraView]||CAMERA_PRESETS.operator,yaw=(p.yaw+orbitX)*Math.PI/180,pitch=(p.pitch+orbitY)*Math.PI/180;let X=x*Math.cos(yaw)-z*Math.sin(yaw),Z=x*Math.sin(yaw)+z*Math.cos(yaw),Y=y*Math.cos(pitch)-Z*Math.sin(pitch);Z=y*Math.sin(pitch)+Z*Math.cos(pitch);const q=scene.depth/(scene.depth+Z+420);return[scene.cx+X*scene.scale*p.zoom*q,scene.cy-Y*scene.scale*p.zoom*q,q]}
function drawSim(){if(!cv||!ctx)return;const dpr=Math.min(devicePixelRatio||1,renderMode==='high'?2:renderMode==='medium'?1.5:1),w=cv.clientWidth||900,h=cv.clientHeight||600;cv.width=w*dpr;cv.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#122c41');bg.addColorStop(1,'#02070b');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);const ramY=h*.24+(1-simProgress)*70;ctx.fillStyle='#17364f';ctx.fillRect(w*.05,h*.1,w*.16,h*.72);ctx.fillRect(w*.79,h*.1,w*.16,h*.72);ctx.fillRect(w*.05,h*.06,w*.9,h*.14);ctx.fillStyle='#cbd5db';ctx.fillRect(w*.18,ramY,w*.64,48);ctx.fillStyle='#f3f6f8';ctx.beginPath();ctx.moveTo(w*.22,ramY+48);ctx.lineTo(w*.78,ramY+48);ctx.lineTo(w*.5,ramY+135);ctx.closePath();ctx.fill();ctx.fillStyle='#6f8797';ctx.beginPath();ctx.moveTo(w*.2,h*.68);ctx.lineTo(w*.5,h*.58);ctx.lineTo(w*.8,h*.68);ctx.closePath();ctx.fill();const b=bends[Math.min(simStep,bends.length-1)]||{angle:90,dir:'Arriba'};const ang=(b.angle||90)*simProgress*Math.PI/180,dir=b.dir==='Abajo'?-1:1,cx=w*.5,cy=h*.57,L=Math.min(220,w*.24);ctx.strokeStyle='#4ce0be';ctx.lineWidth=14;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(cx-L,cy);ctx.lineTo(cx,cy);ctx.lineTo(cx+Math.cos(ang)*L,cy-dir*Math.sin(ang)*L);ctx.stroke();if(simInfoEl)simInfoEl.textContent=`Pliegue ${simStep+1}/${bends.length} · ${Math.round((b.angle||90)*simProgress)}°`;if(collisionInfoEl)collisionInfoEl.textContent='Sin colisiones detectadas';renderSequenceTrack()}
function animate3D(t){if(!playing)return;if(!lastT)lastT=t;const dt=t-lastT,delta=dt/(1900/simSpeed);lastT=t;sim3dElapsed+=dt/1000;simProgress+=delta*simDirection;if(simDirection>0&&simProgress>=1){simProgress=1;if((fullSequence||sim3dLoop)&&simStep<bends.length-1){simStep++;simProgress=0}else if(sim3dLoop){simStep=0;simProgress=0}else{playing=false;fullSequence=false;document.getElementById('statusSequence').textContent='Manual'}}if(simDirection<0&&simProgress<=0){simProgress=0;if((fullSequence||sim3dLoop)&&simStep>0){simStep--;simProgress=1}else if(sim3dLoop){simStep=Math.max(0,bends.length-1);simProgress=1}else{playing=false;fullSequence=false;document.getElementById('statusSequence').textContent='Manual'}}drawSim();update3DPlaybackUI();if(playing)requestAnimationFrame(animate3D)}
function toggleSim(direction=1){if(playing&&simDirection===direction){playing=false;update3DPlaybackUI();return}simDirection=direction;playing=true;lastT=performance.now();requestAnimationFrame(animate3D);update3DPlaybackUI()}
function stepSim(d){playing=false;simDirection=d>=0?1:-1;if(d>0){if(simProgress<1)simProgress=1;else{simStep=Math.min(bends.length-1,simStep+1);simProgress=0}}else{if(simProgress>0)simProgress=0;else{simStep=Math.max(0,simStep-1);simProgress=1}}drawSim();update3DPlaybackUI()}
function resetSim(){simStep=0;simProgress=0;playing=false;fullSequence=false;sim3dElapsed=0;drawSim();update3DPlaybackUI()}
function draw2D(){if(!cv2||!ctx2)return;const dpr=Math.min(devicePixelRatio||1,2),w=cv2.clientWidth||900,h=cv2.clientHeight||600;cv2.width=w*dpr;cv2.height=h*dpr;ctx2.setTransform(dpr,0,0,dpr,0,0);ctx2.clearRect(0,0,w,h);ctx2.fillStyle='#04101a';ctx2.fillRect(0,0,w,h);ctx2.strokeStyle='#123047';for(let x=0;x<w;x+=25){ctx2.beginPath();ctx2.moveTo(x,0);ctx2.lineTo(x,h);ctx2.stroke()}for(let y=0;y<h;y+=25){ctx2.beginPath();ctx2.moveTo(0,y);ctx2.lineTo(w,y);ctx2.stroke()}const b=bends[Math.min(sim2dStep,bends.length-1)]||{angle:90,dir:'Arriba'},ang=(b.angle||90)*sim2dProgress*Math.PI/180,dir=b.dir==='Abajo'?-1:1,cx=w*.48,cy=h*.55,L=Math.min(250,w*.3);ctx2.strokeStyle='#4ce0be';ctx2.lineWidth=16;ctx2.lineCap='round';ctx2.beginPath();ctx2.moveTo(cx-L,cy);ctx2.lineTo(cx,cy);ctx2.lineTo(cx+Math.cos(ang)*L,cy-dir*Math.sin(ang)*L);ctx2.stroke();ctx2.fillStyle='#fff';ctx2.font='14px sans-serif';ctx2.fillText(`P${sim2dStep+1} · ${Math.round((b.angle||90)*sim2dProgress)}°`,20,30);document.getElementById('sim2dInfo').textContent=`Pliegue ${sim2dStep+1}/${bends.length} · ${Math.round((b.angle||90)*sim2dProgress)}°`}
function animate2D(t){if(!sim2dPlaying)return;if(!sim2dLastT)sim2dLastT=t;const dt=t-sim2dLastT,speed=+(document.getElementById('sim2dSpeed')?.value||1);sim2dLastT=t;sim2dElapsed+=dt/1000;sim2dProgress+=dt/(1600/speed)*sim2dDirection;const mode=document.getElementById('sim2dLoop')?.value||'stop';if(sim2dDirection>0&&sim2dProgress>=1){sim2dProgress=1;if(sim2dStep<bends.length-1){sim2dStep++;sim2dProgress=0}else if(mode==='loop'){sim2dStep=0;sim2dProgress=0}else if(mode==='pingpong'){sim2dDirection=-1;sim2dProgress=1;document.getElementById('sim2dDirection').value='-1'}else sim2dPlaying=false}if(sim2dDirection<0&&sim2dProgress<=0){sim2dProgress=0;if(sim2dStep>0){sim2dStep--;sim2dProgress=1}else if(mode==='loop'){sim2dStep=Math.max(0,bends.length-1);sim2dProgress=1}else if(mode==='pingpong'){sim2dDirection=1;sim2dProgress=0;document.getElementById('sim2dDirection').value='1'}else sim2dPlaying=false}document.getElementById('sim2dStep').value=sim2dStep;document.getElementById('sim2dProgress').value=Math.round(sim2dProgress*100);draw2D();update2DPlaybackUI();if(sim2dPlaying)requestAnimationFrame(animate2D)}
function start2DPlayback(direction){if(sim2dPlaying&&sim2dDirection===direction){sim2dPlaying=false;update2DPlaybackUI();return}sim2dDirection=direction;document.getElementById('sim2dDirection').value=String(direction);sim2dPlaying=true;sim2dLastT=performance.now();requestAnimationFrame(animate2D);update2DPlaybackUI()}
function init2D(){const s=document.getElementById('sim2dStep');if(!s)return;s.innerHTML=bends.map((b,i)=>`<option value="${i}">Pliegue ${i+1} · ${b.angle}°</option>`).join('');renderTimelineMarkers('sim2dMarkers');renderTimelineMarkers('sim3dMarkers');s.onchange=()=>{sim2dStep=+s.value;sim2dProgress=0;document.getElementById('sim2dProgress').value=0;draw2D();update2DPlaybackUI()};document.getElementById('sim2dProgress').oninput=e=>{sim2dProgress=+e.target.value/100;draw2D();update2DPlaybackUI()};document.getElementById('sim2dDirection').onchange=e=>{sim2dDirection=+e.target.value};document.getElementById('play2dBtn').onclick=()=>start2DPlayback(1);document.getElementById('reverse2dBtn').onclick=()=>start2DPlayback(-1);document.getElementById('prev2dBtn').onclick=()=>{sim2dPlaying=false;sim2dStep=Math.max(0,sim2dStep-1);sim2dProgress=0;s.value=sim2dStep;draw2D();update2DPlaybackUI()};document.getElementById('next2dBtn').onclick=()=>{sim2dPlaying=false;sim2dStep=Math.min(bends.length-1,sim2dStep+1);sim2dProgress=0;s.value=sim2dStep;draw2D();update2DPlaybackUI()};document.getElementById('reset2dBtn').onclick=()=>{sim2dPlaying=false;sim2dStep=0;sim2dProgress=0;sim2dElapsed=0;s.value=0;document.getElementById('sim2dProgress').value=0;draw2D();update2DPlaybackUI()};document.getElementById('sync2dTo3dBtn').onclick=sync2DTo3D;document.querySelectorAll('#sim2dMarkers [data-marker]').forEach(n=>n.onclick=()=>{sim2dStep=+n.dataset.marker;sim2dProgress=0;s.value=sim2dStep;draw2D();update2DPlaybackUI()});document.querySelectorAll('#sim3dMarkers [data-marker]').forEach(n=>n.onclick=()=>{simStep=+n.dataset.marker;simProgress=0;playing=false;drawSim();update3DPlaybackUI()});draw2D();update2DPlaybackUI();update3DPlaybackUI()}
if(cv){cv.addEventListener('pointerdown',e=>{dragging=true;lastPointer=[e.clientX,e.clientY];cameraView='free';cv.setPointerCapture?.(e.pointerId)});cv.addEventListener('pointermove',e=>{if(!dragging)return;orbitX+=(e.clientX-lastPointer[0])*.18;orbitY=Math.max(-25,Math.min(55,orbitY+(e.clientY-lastPointer[1])*.12));lastPointer=[e.clientX,e.clientY];drawSim()});cv.addEventListener('pointerup',()=>{dragging=false});cv.addEventListener('wheel',e=>{e.preventDefault();const z=document.getElementById('sceneZoom');z.value=Math.max(70,Math.min(130,+z.value+(e.deltaY>0?-5:5)));drawSim()},{passive:false})}
document.getElementById('camFrontBtn')?.addEventListener('click',()=>setCameraView('front'));document.getElementById('camRearBtn')?.addEventListener('click',()=>setCameraView('rear'));document.getElementById('camSideBtn')?.addEventListener('click',()=>setCameraView('side'));document.getElementById('camTopBtn')?.addEventListener('click',()=>setCameraView('top'));document.getElementById('cameraSelect')?.addEventListener('change',e=>setCameraView(e.target.value));
init2D();drawSim();

const CLIENT_KEY='plegarProClientsV71';
let clients=JSON.parse(localStorage.getItem(CLIENT_KEY)||'null')||[
 {company:'Taller Ejemplo',contact:'Juan Pérez',tax:'B12345678',phone:'34600111222',email:'compras@tallerejemplo.es',address:'Polígono Industrial',notes:'Cliente de demostración',history:[{date:new Date().toLocaleDateString('es-ES'),job:'Soporte multiplegado',status:'Preparación',channel:'Aplicación'}]}
];
let activeClient=0;

const MASTER_CAMERA_KEY='pp_v204_camera_presets';
let masterPlayback={playing:false,direction:1,lastT:0,elapsed:0,frames:0,lastFrameMs:0,position:0};
let savedCameraPresets=JSON.parse(localStorage.getItem(MASTER_CAMERA_KEY)||'[]');
function normalizedToPlayback(pos){
  const n=Math.max(1,bends.length),raw=Math.max(0,Math.min(.999999,pos))*n,step=Math.min(n-1,Math.floor(raw)),progress=raw-step;
  return{step,progress};
}
function playbackToNormalized(step,progress){return bends.length?Math.max(0,Math.min(1,(step+progress)/bends.length)):0}
function applyMasterPosition(pos){
  masterPlayback.position=Math.max(0,Math.min(1,pos));const p=normalizedToPlayback(masterPlayback.position),mode=document.getElementById('masterSync')?.value||'both';
  if(mode==='both'||mode==='2d'){sim2dStep=p.step;sim2dProgress=p.progress;const s=document.getElementById('sim2dStep'),r=document.getElementById('sim2dProgress');if(s)s.value=p.step;if(r)r.value=Math.round(p.progress*100);draw2D();update2DPlaybackUI()}
  if(mode==='both'||mode==='3d'){simStep=p.step;simProgress=p.progress;drawSim();update3DPlaybackUI()}
  updateMasterPlaybackUI();
}
function masterRange(){let a=+(document.getElementById('masterRangeStart')?.value||0)/1000,b=+(document.getElementById('masterRangeEnd')?.value||1000)/1000;if(a>b)[a,b]=[b,a];return[a,b]}
function updateMasterPlaybackUI(){
  const [a,b]=masterRange(),head=document.getElementById('masterPlayhead'),fill=document.getElementById('masterRangeFill');
  if(head)head.style.left=`${masterPlayback.position*100}%`;if(fill){fill.style.left=`${a*100}%`;fill.style.width=`${Math.max(0,b-a)*100}%`}
  const label=document.getElementById('masterRangeLabel');if(label)label.textContent=`Rango ${(a*100).toFixed(0)} % – ${(b*100).toFixed(0)} %`;
  const clock=document.getElementById('masterClock');if(clock)clock.textContent=formatPlaybackTime(masterPlayback.elapsed);
  const p=normalizedToPlayback(masterPlayback.position);document.getElementById('masterPosition').textContent=`${(masterPlayback.position*100).toFixed(1)} %`;document.getElementById('masterOperation').textContent=`P${p.step+1} · ${(p.progress*100).toFixed(0)} %`;document.getElementById('masterDirection').textContent=masterPlayback.direction>0?'Adelante':'Atrás';document.getElementById('masterState').textContent=masterPlayback.playing?'Reproduciendo':'Detenido';
  document.getElementById('diagFrames').textContent=masterPlayback.frames;document.getElementById('diagFrameMs').textContent=`${masterPlayback.lastFrameMs.toFixed(1)} ms`;document.getElementById('diagFps').textContent=masterPlayback.lastFrameMs?Math.min(999,1000/masterPlayback.lastFrameMs).toFixed(0):'—';
  const sync=document.getElementById('masterSync')?.value||'both',delta=Math.abs(playbackToNormalized(sim2dStep,sim2dProgress)-playbackToNormalized(simStep,simProgress));document.getElementById('diagSync').textContent=sync==='both'?(delta<.001?'Correcta':'Diferencia detectada'):'Motor individual';document.getElementById('diagSync').className=sync==='both'&&delta>=.001?'warntext':'good';
  document.getElementById('masterPlay').textContent=masterPlayback.playing&&masterPlayback.direction>0?'⏸ Pausar':'▶ Reproducir';document.getElementById('masterReverse').textContent=masterPlayback.playing&&masterPlayback.direction<0?'⏸ Pausar':'◀ Hacia atrás';
}
function animateMasterPlayback(t){
  if(!masterPlayback.playing)return;if(!masterPlayback.lastT)masterPlayback.lastT=t;const dt=Math.min(100,t-masterPlayback.lastT),speed=+(document.getElementById('masterSpeed')?.value||1),[a,b]=masterRange(),span=Math.max(.001,b-a);masterPlayback.lastT=t;masterPlayback.lastFrameMs=dt;masterPlayback.elapsed+=dt/1000;masterPlayback.frames++;masterPlayback.position+=dt/10000*speed*masterPlayback.direction;
  const mode=document.getElementById('masterEndMode')?.value||'stop';
  if(masterPlayback.direction>0&&masterPlayback.position>=b){if(mode==='loop')masterPlayback.position=a;else if(mode==='pingpong'){masterPlayback.position=b;masterPlayback.direction=-1}else{masterPlayback.position=b;masterPlayback.playing=false}}
  if(masterPlayback.direction<0&&masterPlayback.position<=a){if(mode==='loop')masterPlayback.position=b;else if(mode==='pingpong'){masterPlayback.position=a;masterPlayback.direction=1}else{masterPlayback.position=a;masterPlayback.playing=false}}
  applyMasterPosition(masterPlayback.position);if(masterPlayback.playing)requestAnimationFrame(animateMasterPlayback)
}
function startMasterPlayback(direction){if(masterPlayback.playing&&masterPlayback.direction===direction){masterPlayback.playing=false;updateMasterPlaybackUI();return}masterPlayback.direction=direction;masterPlayback.playing=true;masterPlayback.lastT=performance.now();requestAnimationFrame(animateMasterPlayback);updateMasterPlaybackUI()}
function stepMaster(frames){masterPlayback.playing=false;const step=(1/Math.max(1,bends.length))/30;applyMasterPosition(masterPlayback.position+frames*step)}
function resetMasterPlayback(){masterPlayback.playing=false;masterPlayback.elapsed=0;masterPlayback.frames=0;applyMasterPosition(masterRange()[0])}
function renderMasterMarkers(){const host=document.getElementById('masterMarkers');if(!host)return;host.innerHTML=bends.map((b,i)=>`<button style="left:${((i+.5)/Math.max(1,bends.length))*100}%" data-master-marker="${i}" title="P${i+1} · ${b.angle}°">${i+1}</button>`).join('');host.querySelectorAll('[data-master-marker]').forEach(n=>n.onclick=()=>applyMasterPosition((+n.dataset.masterMarker)/Math.max(1,bends.length)))}
function renderCameraPresets(){const s=document.getElementById('savedCameraSelect');if(!s)return;s.innerHTML=savedCameraPresets.map((p,i)=>`<option value="${i}">${p.name}</option>`).join('')||'<option value="">Sin cámaras guardadas</option>'}
function saveCurrentCameraPreset(){const name=(document.getElementById('cameraPresetName').value||'Vista personalizada').trim();savedCameraPresets.push({name,cameraView,orbitX,orbitY,zoom:+(document.getElementById('sceneZoom')?.value||100),quality:renderMode,at:new Date().toISOString()});localStorage.setItem(MASTER_CAMERA_KEY,JSON.stringify(savedCameraPresets));renderCameraPresets()}
function loadSelectedCameraPreset(){const i=+document.getElementById('savedCameraSelect').value,p=savedCameraPresets[i];if(!p)return;cameraView=p.cameraView||'free';orbitX=+p.orbitX||0;orbitY=+p.orbitY||0;const z=document.getElementById('sceneZoom');if(z)z.value=p.zoom||100;setRenderQuality(p.quality||'high');const sel=document.getElementById('cameraSelect');if(sel)sel.value=cameraView;drawSim()}
function deleteSelectedCameraPreset(){const i=+document.getElementById('savedCameraSelect').value;if(!Number.isInteger(i)||!savedCameraPresets[i])return;savedCameraPresets.splice(i,1);localStorage.setItem(MASTER_CAMERA_KEY,JSON.stringify(savedCameraPresets));renderCameraPresets()}
function renderPlaybackEngineStatus(){const host=document.getElementById('enginePlaybackStatus');if(!host)return;const items=[['Motor 2D',!!cv2&&typeof draw2D==='function'],['Motor 3D',!!cv&&typeof drawSim==='function'],['Secuencia',bends.length>0],['Cámara orbital',typeof setCameraView==='function'],['Persistencia cámaras',typeof localStorage!=='undefined']];host.innerHTML=items.map(([n,ok])=>`<div class="check"><b class="${ok?'good':'bad'}">${ok?'✓':'✕'} ${n}</b></div>`).join('')}
function initMasterPlaybackUI(){
  if(!document.getElementById('masterTimeline'))return;masterPlayback.position=playbackToNormalized(simStep,simProgress);renderMasterMarkers();renderCameraPresets();renderPlaybackEngineStatus();updateMasterPlaybackUI();
  document.getElementById('masterPlay').onclick=()=>startMasterPlayback(1);document.getElementById('masterReverse').onclick=()=>startMasterPlayback(-1);document.getElementById('masterFrameBack').onclick=()=>stepMaster(-1);document.getElementById('masterFrameForward').onclick=()=>stepMaster(1);document.getElementById('masterReset').onclick=resetMasterPlayback;
  document.getElementById('masterRangeStart').oninput=()=>{const [a,b]=masterRange();if(masterPlayback.position<a)applyMasterPosition(a);updateMasterPlaybackUI()};document.getElementById('masterRangeEnd').oninput=()=>{const [a,b]=masterRange();if(masterPlayback.position>b)applyMasterPosition(b);updateMasterPlaybackUI()};document.getElementById('masterSync').onchange=()=>applyMasterPosition(masterPlayback.position);
  document.getElementById('masterTimeline').onclick=e=>{const r=e.currentTarget.getBoundingClientRect();applyMasterPosition((e.clientX-r.left)/Math.max(1,r.width))};document.getElementById('saveCameraPreset').onclick=saveCurrentCameraPreset;document.getElementById('loadCameraPreset').onclick=loadSelectedCameraPreset;document.getElementById('deleteCameraPreset').onclick=deleteSelectedCameraPreset;document.getElementById('open2DFromControl').onclick=()=>go('simulation2d');document.getElementById('open3DFromControl').onclick=()=>go('simulation');
}
document.addEventListener('keydown',e=>{const active=document.querySelector('.page.active')?.dataset.page;if(!['simulation2d','simulation','playbackcontrol'].includes(active)||['INPUT','SELECT','TEXTAREA'].includes(document.activeElement?.tagName))return;if(e.code==='Space'){e.preventDefault();startMasterPlayback(masterPlayback.direction||1)}else if(e.key==='ArrowLeft'){e.preventDefault();stepMaster(-1)}else if(e.key==='ArrowRight'){e.preventDefault();stepMaster(1)}else if(/^[1-6]$/.test(e.key)){const cameras=['operator','front','rear','side','top','iso'];setCameraView(cameras[+e.key-1])}});

function renderClients(){const q=(clientSearch?.value||'').toLowerCase();clientList.innerHTML='';clients.forEach((c,i)=>{if(q && !(`${c.company} ${c.contact} ${c.phone}`.toLowerCase().includes(q))) return;const d=document.createElement('div');d.className='client-row'+(i===activeClient?' active':'');d.innerHTML=`<b>${c.company||'Sin empresa'}</b><div class="muted small">${c.contact||'Sin contacto'} · ${c.phone||'Sin teléfono'}</div>`;d.onclick=()=>loadClient(i);clientList.appendChild(d)});}
function loadClient(i){activeClient=i;const c=clients[i];clCompany.value=c.company||'';clContact.value=c.contact||'';clTax.value=c.tax||'';clPhone.value=c.phone||'';clEmail.value=c.email||'';clAddress.value=c.address||'';clNotes.value=c.notes||'';clientHistory.innerHTML=(c.history||[]).map(h=>`<tr><td>${h.date}</td><td>${h.job}</td><td>${h.status}</td><td>${h.channel}</td></tr>`).join('')||'<tr><td colspan="4" class="muted">Sin historial.</td></tr>';renderClients()}
function newClient(){clients.push({company:'Nuevo cliente',contact:'',tax:'',phone:'',email:'',address:'',notes:'',history:[]});activeClient=clients.length-1;loadClient(activeClient)}
function saveClient(){if(activeClient==null)return;const c=clients[activeClient];Object.assign(c,{company:clCompany.value.trim(),contact:clContact.value.trim(),tax:clTax.value.trim(),phone:clPhone.value.trim(),email:clEmail.value.trim(),address:clAddress.value.trim(),notes:clNotes.value.trim()});localStorage.setItem(CLIENT_KEY,JSON.stringify(clients));renderClients();mountInfo && (mountInfo.dataset.saved='1')}
function normalizedPhone(){return (clPhone.value||'').replace(/[^0-9]/g,'')}
function addClientHistory(channel){const c=clients[activeClient];if(!c)return;c.history=c.history||[];c.history.unshift({date:new Date().toLocaleDateString('es-ES'),job:jobName.value||'Trabajo sin nombre',status:'Comunicación preparada',channel});saveClient();loadClient(activeClient)}
function openWhatsApp(){saveClient();const phone=normalizedPhone();if(!phone){alert('Añade un número de teléfono con prefijo internacional.');return}const msg=encodeURIComponent(waMessage.value||'');addClientHistory('WhatsApp');window.open(`https://wa.me/${phone}?text=${msg}`,'_blank','noopener')}
async function copyWhatsApp(){await navigator.clipboard.writeText(waMessage.value||'');addClientHistory('WhatsApp copiado')}
function openEmail(){saveClient();const email=(clEmail.value||'').trim();if(!email){alert('Añade un correo electrónico válido.');return}const url=`mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(mailSubject.value||'')}&body=${encodeURIComponent(mailBody.value||'')}`;addClientHistory('Correo');location.href=url}
async function copyEmail(){await navigator.clipboard.writeText(`${mailSubject.value}\n\n${mailBody.value}`);addClientHistory('Correo copiado')}
renderClients();loadClient(0);


const factory={plans:JSON.parse(localStorage.getItem('pp_plans')||'[]'),materials:JSON.parse(localStorage.getItem('pp_materials')||'[]'),toolStock:JSON.parse(localStorage.getItem('pp_toolstock')||'[]'),docs:JSON.parse(localStorage.getItem('pp_docs')||'[]'),lastQuote:0};
function money(v){return new Intl.NumberFormat('es-ES',{style:'currency',currency:'EUR'}).format(v)}
function calcQuote(){const qty=+qQty.value,mat=+qMaterial.value,min=+qMinutes.value,mach=+qMachine.value,lab=+qLabor.value,margin=+qMargin.value;const time=(mach+lab)*(min/60),base=mat+time,total=base*(1+margin/100),unit=total/Math.max(1,qty);factory.lastQuote=total;aQuote.textContent=money(total);quoteResult.innerHTML=`<div class="table-wrap"><table><tr><td>Material</td><td>${money(mat)}</td></tr><tr><td>Máquina + mano de obra</td><td>${money(time)}</td></tr><tr><td>Coste base</td><td>${money(base)}</td></tr><tr><td>Margen</td><td>${margin.toFixed(1)} %</td></tr><tr><th>Total</th><th>${money(total)}</th></tr><tr><th>Precio unitario</th><th>${money(unit)}</th></tr></table></div>`;updateAnalytics()}
function printQuote(){window.print()}
function addPlan(){factory.plans.push({job:plJob.value,date:plDate.value,machine:plMachine.value,priority:plPriority.value,status:'Pendiente'});localStorage.setItem('pp_plans',JSON.stringify(factory.plans));renderFactory()}
function addMaterialStock(){factory.materials.push({material:invMat.value,thickness:invThk.value,qty:+invQty.value});localStorage.setItem('pp_materials',JSON.stringify(factory.materials));renderFactory()}
function addToolStock(){factory.toolStock.push({code:invToolCode.value,location:invToolLoc.value,state:invToolState.value});localStorage.setItem('pp_toolstock',JSON.stringify(factory.toolStock));renderFactory()}
function saveDocs(){const arr=[...docInput.files].map(f=>({name:f.name,size:f.size,type:f.type,date:new Date().toISOString()}));factory.docs.push(...arr);localStorage.setItem('pp_docs',JSON.stringify(factory.docs));renderFactory()}
function exportBackup(){
  const keys=[
    CLIENT_KEY,COMM_KEY,CAL_KEY,TRACE_KEY,RULE_KEY,'pp_work_orders_v20',
    'pp_factory_v20','pp_last_selected_work_order'
  ];
  const storage={};
  keys.forEach(k=>{if(k&&localStorage.getItem(k)!==null)storage[k]=localStorage.getItem(k)});
  const data={
    product:'Plegar Pro',
    version:'20.0',
    exportedAt:new Date().toISOString(),
    storage,
    snapshot:{
      bends,
      selectedPunch:selPunch,
      selectedDie:selDie,
      currentJob:{
        name:jobName?.value||'',
        material:jobMaterial?.value||'',
        thickness:+(jobThickness?.value||0),
        quantity:+(jobQty?.value||0)
      }
    }
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=url;a.download=`PlegarPro_v20_backup_${new Date().toISOString().slice(0,10)}.json`;
  a.click();URL.revokeObjectURL(url);
}
async function importBackup(file){
  if(!file)return;
  try{
    const data=JSON.parse(await file.text());
    if(!data||data.product!=='Plegar Pro'||!data.storage)throw new Error('Formato no reconocido');
    Object.entries(data.storage).forEach(([k,v])=>localStorage.setItem(k,v));
    alert('Copia restaurada. La aplicación se recargará.');
    location.reload();
  }catch(err){
    alert(`No se pudo restaurar la copia: ${err.message}`);
  }
}
function renderFactory(){planTable.innerHTML='<tr><th>Trabajo</th><th>Entrega</th><th>Máquina</th><th>Prioridad</th><th>Estado</th></tr>'+factory.plans.map(x=>`<tr><td>${x.job}</td><td>${x.date||'—'}</td><td>${x.machine}</td><td>${x.priority}</td><td class="good">${x.status}</td></tr>`).join('');matStock.innerHTML='<tr><th>Material</th><th>Espesor</th><th>Stock</th></tr>'+factory.materials.map(x=>`<tr><td>${x.material}</td><td>${x.thickness}</td><td>${x.qty}</td></tr>`).join('');toolStock.innerHTML='<tr><th>Código</th><th>Ubicación</th><th>Estado</th></tr>'+factory.toolStock.map(x=>`<tr><td>${x.code}</td><td>${x.location}</td><td>${x.state}</td></tr>`).join('');docList.innerHTML=factory.docs.length?factory.docs.map(x=>`<div class="pill">${x.name} · ${(x.size/1024).toFixed(1)} KB</div>`).join(''):'Sin documentos registrados.';updateAnalytics()}
function updateAnalytics(){aOrders.textContent=factory.plans.length;aMaterials.textContent=factory.materials.reduce((n,x)=>n+x.qty,0);aTools.textContent=factory.toolStock.length;analyticsText.textContent=`${factory.plans.length} órdenes registradas, ${factory.materials.length} referencias de material y ${factory.toolStock.length} útiles controlados.`}
setTimeout(renderFactory,50);


const V_SCENARIOS=[6,12,16,22,24,32,36,40,50];
[sV1,sV2,calV].forEach(sel=>V_SCENARIOS.forEach(v=>sel.add(new Option('V'+v,v))));
sV1.value='16';sV2.value='12';calV.value='16';

function validatePreparation(){
  const checks=[...document.querySelectorAll('#prepChecklist input')];
  const done=checks.filter(x=>x.checked).length;
  prepResult.innerHTML=done===checks.length
    ? '<b class="good">Preparación completa.</b><br>La orden está lista para validación final del operario y primera pieza.'
    : `<b class="warntext">${done}/${checks.length} comprobaciones completadas.</b><br>No iniciar la serie hasta revisar los puntos pendientes.`;
}
function resetPreparation(){document.querySelectorAll('#prepChecklist input').forEach(x=>x.checked=false);prepResult.textContent='Completa la lista antes de iniciar el trabajo.'}

function compareStrategies(){
  const t=+sThickness.value,v1=+sV1.value,v2=+sV2.value,q=+sQty.value;
  const a=bendData(v1,t,90,.33),b=bendData(v2,t,90,.33);
  const measure=b.BD-a.BD;
  const setupA=8+(v1<8?3:0),setupB=8+(v2<8?3:0);
  const runA=(bends.length*11*q)/60,runB=(bends.length*11*q)/60;
  const riskA=v1/t<6?'Alto por V estrecha':v1/t>12?'Alto por radio grande':'Medio/bajo';
  const riskB=v2/t<6?'Alto por V estrecha':v2/t>12?'Alto por radio grande':'Medio/bajo';
  strategyResult.innerHTML=`
    <div class="strategy-card"><b>Geometría</b><p>V${v1}: R ${a.r.toFixed(2)} mm<br>V${v2}: R ${b.r.toFixed(2)} mm<br><span class="${measure<0?'bad':'good'}">Cambio de medida: ${measure.toFixed(2)} mm</span></p></div>
    <div class="strategy-card"><b>Producción</b><p>Escenario A: ${(setupA+runA).toFixed(1)} min<br>Escenario B: ${(setupB+runB).toFixed(1)} min<br>Cantidad: ${q}</p></div>
    <div class="strategy-card"><b>Riesgo</b><p>V${v1}: ${riskA}<br>V${v2}: ${riskB}<br>Validar agujeros, colisiones y tonelaje.</p></div>`;
}

const CAL_KEY='pp_calibrations_v14';
let calibrations=JSON.parse(localStorage.getItem(CAL_KEY)||'[]');
function saveCalibration(){
  calibrations.unshift({machine:calMachine.value,material:calMaterial.value,thickness:+calThickness.value,v:+calV.value,error:+calError.value,angle:+calAngle.value});
  localStorage.setItem(CAL_KEY,JSON.stringify(calibrations));
  renderCalibrations();
}
function renderCalibrations(){
  calTable.innerHTML='<tr><th>Máquina</th><th>Material</th><th>Espesor</th><th>V</th><th>Corrección</th><th>Ángulo</th></tr>'+
  calibrations.map(c=>`<tr><td>${c.machine}</td><td>${c.material}</td><td>${c.thickness} mm</td><td>V${c.v}</td><td>${c.error>=0?'+':''}${c.error.toFixed(2)} mm</td><td>${c.angle>=0?'+':''}${c.angle.toFixed(1)}°</td></tr>`).join('');
}
renderCalibrations();

const TRACE_KEY='pp_trace_v14';
let traces=JSON.parse(localStorage.getItem(TRACE_KEY)||'[]');
function addTrace(){
  traces.unshift({date:new Date().toLocaleString('es-ES'),ref:trRef.value,client:trClient.value,revision:trRevision.value,operator:trOperator.value,machine:trMachine.value,result:trResult.value});
  localStorage.setItem(TRACE_KEY,JSON.stringify(traces));renderTrace();
}
function renderTrace(){
  traceTimeline.innerHTML=traces.length?traces.map(t=>`<div class="timeline-item"><b>${t.date}</b><span><strong>${t.ref} · ${t.revision}</strong><br>${t.client} · ${t.machine}<br>${t.operator} · ${t.result}</span></div>`).join(''):'<div class="timeline-item"><b>Inicio</b><span>Sin hitos registrados.</span></div>';
}
renderTrace();

const RULE_KEY='pp_rules_v14';
let rules=JSON.parse(localStorage.getItem(RULE_KEY)||'null')||[
 {condition:'Acero S235 2 mm y V16',action:'Usar como configuración base y corregir con calibración de máquina.'},
 {condition:'Agujero próximo a la línea de pliegue',action:'Comparar una V menor y calcular la variación de medida y desarrollo.'}
];
function addRule(){rules.unshift({condition:ruleCondition.value.trim(),action:ruleAction.value.trim()});localStorage.setItem(RULE_KEY,JSON.stringify(rules));renderRules()}
function renderRules(){ruleList.innerHTML=rules.map((r,i)=>`<div class="rule-row"><div><b>SI</b><br>${r.condition}</div><div><b>ENTONCES</b><br>${r.action}</div><button class="btn danger" onclick="rules.splice(${i},1);localStorage.setItem(RULE_KEY,JSON.stringify(rules));renderRules()">Eliminar</button></div>`).join('')}
renderRules();

if('serviceWorker' in navigator){navigator.serviceWorker.getRegistrations().then(rs=>rs.forEach(r=>r.unregister()));}if('caches' in window){caches.keys().then(keys=>keys.forEach(k=>caches.delete(k)));}

const ENGINE_REGISTRY=[
 {name:'Industrial Kernel',desc:'Trabajo, historial y coherencia de datos'},
 {name:'Geometry Engine',desc:'Pliegues, alas y geometría editable'},
 {name:'Physics Engine',desc:'Radio, BA, BD, V y desarrollo'},
 {name:'Process Engine',desc:'Preparación, producción y calidad'},
 {name:'Knowledge Graph',desc:'Reglas, calibraciones y trazabilidad'},
 {name:'Decision Engine',desc:'Comparación de estrategias y riesgos'},
 {name:'AI Orchestrator',desc:'Asistencia contextual explicable'},
 {name:'Visual Engine',desc:'Gemelo visual y secuencia multiplegado'},
 {name:'Integration Bus',desc:'Importación, correo y WhatsApp'},
 {name:'Evolution Layer',desc:'Bibliotecas y módulos ampliables'}
];

const WORK_ORDER_KEY='pp_work_orders_v20';
let workOrders=JSON.parse(localStorage.getItem(WORK_ORDER_KEY)||'[]');
let selectedWorkOrderId=localStorage.getItem('pp_last_selected_work_order')||'';

function uid(prefix='id'){
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
}
function safeText(value){
  return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function saveWorkOrder(){
  const ref=woRef.value.trim(),name=woName.value.trim();
  if(!ref||!name){alert('La referencia y la descripción son obligatorias.');return}
  const existing=workOrders.find(x=>x.id===selectedWorkOrderId);
  const now=new Date().toISOString();
  const order={
    id:existing?.id||uid('wo'),
    ref,name,client:woClient.value.trim(),revision:woRevision.value.trim()||'R1',
    material:woMaterial.value,thickness:+woThickness.value,qty:+woQty.value,
    due:woDue.value,priority:woPriority.value,status:woStatus.value,
    createdAt:existing?.createdAt||now,updatedAt:now,
    history:[...(existing?.history||[]),{at:now,action:existing?'Orden actualizada':'Orden creada',status:woStatus.value}]
  };
  if(existing)workOrders=workOrders.map(x=>x.id===order.id?order:x);else workOrders.unshift(order);
  selectedWorkOrderId=order.id;
  localStorage.setItem(WORK_ORDER_KEY,JSON.stringify(workOrders));
  localStorage.setItem('pp_last_selected_work_order',selectedWorkOrderId);
  syncOrderToCurrentJob(order);
  renderWorkOrders();renderWorkOrderDetail(order);
  refreshIntegrity();
}
function newWorkOrder(){
  selectedWorkOrderId='';
  woRef.value=`PP-${new Date().getFullYear()}-${String(workOrders.length+1).padStart(3,'0')}`;
  woName.value='';woClient.value='';woRevision.value='R1';woMaterial.value='Acero S235';
  woThickness.value=2;woQty.value=1;woDue.value='';woPriority.value='Normal';woStatus.value='Borrador';
  workOrderDetail.innerHTML='<div class="empty-state">Nueva orden preparada.</div>';
}
function loadWorkOrder(id){
  const order=workOrders.find(x=>x.id===id);if(!order)return;
  selectedWorkOrderId=id;localStorage.setItem('pp_last_selected_work_order',id);
  woRef.value=order.ref;woName.value=order.name;woClient.value=order.client;woRevision.value=order.revision;
  woMaterial.value=order.material;woThickness.value=order.thickness;woQty.value=order.qty;woDue.value=order.due||'';
  woPriority.value=order.priority;woStatus.value=order.status;
  syncOrderToCurrentJob(order);renderWorkOrders();renderWorkOrderDetail(order);
}
function deleteWorkOrder(id){
  const order=workOrders.find(x=>x.id===id);if(!order||!confirm(`Eliminar ${order.ref}?`))return;
  workOrders=workOrders.filter(x=>x.id!==id);localStorage.setItem(WORK_ORDER_KEY,JSON.stringify(workOrders));
  if(selectedWorkOrderId===id){selectedWorkOrderId='';localStorage.removeItem('pp_last_selected_work_order')}
  renderWorkOrders();workOrderDetail.innerHTML='<div class="empty-state">Orden eliminada.</div>';refreshIntegrity();
}
function syncOrderToCurrentJob(order){
  if(jobName)jobName.value=order.name;
  if(jobMaterial)jobMaterial.value=order.material;
  if(jobThickness)jobThickness.value=order.thickness;
  if(jobQty)jobQty.value=order.qty;
  if(engMaterial)engMaterial.value=order.material;
  if(engThickness)engThickness.value=order.thickness;
}
function renderWorkOrders(){
  const tbody=document.getElementById('workOrderRows');if(!tbody)return;
  const q=normalizeText(document.getElementById('woSearch')?.value||'');
  const list=workOrders.filter(o=>!q||normalizeText([o.ref,o.name,o.client,o.material,o.status].join(' ')).includes(q));
  tbody.innerHTML=list.map(o=>`<tr class="${o.id===selectedWorkOrderId?'selected-row':''}">
    <td><button class="table-link" onclick="loadWorkOrder('${o.id}')">${safeText(o.ref)}</button><small>${safeText(o.revision)}</small></td>
    <td>${safeText(o.client||'—')}</td><td>${safeText(o.material)} · ${o.thickness} mm</td>
    <td>${o.qty}</td><td>${o.due||'—'}</td><td><span class="status-chip">${safeText(o.status)}</span></td>
    <td><button class="icon-btn danger" onclick="deleteWorkOrder('${o.id}')" title="Eliminar">×</button></td>
  </tr>`).join('')||'<tr><td colspan="7" class="empty-cell">No hay órdenes guardadas.</td></tr>';
}
function renderWorkOrderDetail(order){
  const el=document.getElementById('workOrderDetail');if(!el||!order)return;
  el.innerHTML=`<div class="work-order-summary">
    <div><span>Referencia</span><b>${safeText(order.ref)} · ${safeText(order.revision)}</b></div>
    <div><span>Cliente</span><b>${safeText(order.client||'Sin asignar')}</b></div>
    <div><span>Material</span><b>${safeText(order.material)} · ${order.thickness} mm</b></div>
    <div><span>Producción</span><b>${order.qty} unidades · ${safeText(order.priority)}</b></div>
  </div>
  <div class="actions"><button class="btn" onclick="go('engineering')">Analizar ingeniería</button>
  <button class="btn secondary" onclick="go('optimizer')">Comparar estrategias</button>
  <button class="btn secondary" onclick="go('simulation')">Abrir simulación</button></div>
  <h3>Historial</h3><div class="compact-timeline">${(order.history||[]).slice().reverse().map(h=>`<div><time>${new Date(h.at).toLocaleString('es-ES')}</time><span>${safeText(h.action)} · ${safeText(h.status)}</span></div>`).join('')}</div>`;
}
function initWorkOrders(){
  const due=document.getElementById('woDue');if(due&&!due.value){
    const d=new Date();d.setDate(d.getDate()+7);due.value=d.toISOString().slice(0,10);
  }
  renderWorkOrders();
  if(selectedWorkOrderId&&workOrders.some(x=>x.id===selectedWorkOrderId))loadWorkOrder(selectedWorkOrderId);
}

function scoreStrategy({V,t,L,A,bendsCount,material,goal}){
  const data=bendData(V,t,A,.33),ratio=V/Math.max(t,.1),mf=materialFactor(material);
  const tonnage=(1.42*mf*L*t*t/Math.max(V,1))/10;
  const minFlange=Math.max(V*.7,4*t);
  const riskPenalty=(ratio<6?28:0)+(ratio>12?22:0)+(tonnage>90?25:tonnage>70?12:0);
  const precision=Math.max(0,100-Math.abs(ratio-8)*7-Math.abs(data.r-t)*3);
  const speed=Math.max(0,100-(bendsCount*2.4)-(V<12?8:0));
  const safety=Math.max(0,100-riskPenalty);
  const weights=goal==='precision'?[.55,.15,.30]:goal==='speed'?[.18,.60,.22]:goal==='lowrisk'?[.15,.15,.70]:[.34,.31,.35];
  const score=precision*weights[0]+speed*weights[1]+safety*weights[2];
  return {V,data,ratio,tonnage,minFlange,precision,speed,safety,score};
}
function runStrategyOptimizer(){
  const t=+optThickness.value,L=+optLength.value,A=+optAngle.value,bendsCount=+optBends.value;
  const material=optMaterial.value,goal=optGoal.value;
  if(!(t>0&&L>0&&A>0&&A<180)){optimizerResults.innerHTML='<div class="notice">Revisa los datos de entrada.</div>';return}
  const results=V_LIST.map(V=>scoreStrategy({V,t,L,A,bendsCount,material,goal})).sort((a,b)=>b.score-a.score);
  optimizerResults.innerHTML=`<div class="optimizer-list">${results.map((r,i)=>`
    <article class="strategy-result ${i===0?'recommended':''}">
      <header><div><span class="rank">#${i+1}</span><b>V${r.V}</b></div><strong>${r.score.toFixed(0)}/100</strong></header>
      <div class="strategy-metrics">
        <span>Radio <b>${r.data.r.toFixed(2)} mm</b></span>
        <span>Tonelaje <b>${r.tonnage.toFixed(1)} t</b></span>
        <span>Ala mín. <b>${r.minFlange.toFixed(1)} mm</b></span>
        <span>V/e <b>${r.ratio.toFixed(1)}</b></span>
      </div>
      <div class="score-bars">
        <label>Precisión<i><em style="width:${r.precision}%"></em></i></label>
        <label>Rapidez<i><em style="width:${r.speed}%"></em></i></label>
        <label>Riesgo<i><em style="width:${r.safety}%"></em></i></label>
      </div>
      <button class="btn secondary" onclick="applyOptimizedV(${r.V})">Usar V${r.V}</button>
    </article>`).join('')}</div>
    <div class="notice">Clasificación orientativa basada en el modelo configurado. Valida tonelaje, geometría, herramienta, agujeros próximos y primera pieza.</div>`;
}
function applyOptimizedV(V){
  if(cV1)cV1.value=String(V);if(engV)engV.value=String(V);if(calV)calV.value=String(V);
  go('calc');calculateV();
}


const SYSTEM_VERSION='20.5';
const SYSTEM_BUILD='2026.07.14-2050';
let systemErrors=[];
window.addEventListener('error',e=>{systemErrors.push({at:new Date().toISOString(),message:e.message,source:e.filename||'interfaz',line:e.lineno||0});renderSystemErrors()});
window.addEventListener('unhandledrejection',e=>{systemErrors.push({at:new Date().toISOString(),message:String(e.reason||'Promesa rechazada'),source:'promise',line:0});renderSystemErrors()});
function storageBytes(){let n=0;for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);n+=(k?.length||0)+(localStorage.getItem(k)?.length||0)}return n*2}
function runSystemDiagnostics(){
 const pages=[...document.querySelectorAll('.page')],buttons=[...document.querySelectorAll('button')];
 const checks=[
  ['Navegación registrada',Object.keys(PAGE_META).every(k=>document.querySelector(`[data-page="${k}"]`))],
  ['Páginas sin duplicados',new Set(pages.map(p=>p.dataset.page)).size===pages.length],
  ['Biblioteca de herramientas',Array.isArray(tools)&&tools.length>0],
  ['Multiplegado inicializado',Array.isArray(bends)&&bends.length>0],
  ['Simulación 2D disponible',!!document.getElementById('sim2d')&&typeof draw2D==='function'],['Simulación 3D disponible',!!document.getElementById('sim')&&typeof drawSim==='function'],['Analizador V inteligente',typeof vaCalculate==='function'],
  ['Persistencia local',typeof localStorage!=='undefined'],
  ['Órdenes de trabajo',Array.isArray(workOrders)],
  ['Calibraciones',Array.isArray(calibrations)],
  ['Reglas del taller',Array.isArray(rules)],
  ['Botones disponibles',buttons.length>0]
 ];
 const host=document.getElementById('systemChecks');if(host)host.innerHTML=checks.map(([name,ok])=>`<div class="system-check ${ok?'ok':'fail'}"><b>${ok?'✓':'✕'}</b><span>${name}</span></div>`).join('');
 if(document.getElementById('sysModules'))sysModules.textContent=Object.keys(PAGE_META).length;
 if(document.getElementById('sysPages'))sysPages.textContent=pages.length;
 if(document.getElementById('sysErrors'))sysErrors.textContent=systemErrors.length;
 if(document.getElementById('sysStorage'))sysStorage.textContent=(storageBytes()/1024).toFixed(1)+' KB';
 renderSystemErrors();return checks.every(x=>x[1]);
}
function renderSystemErrors(){const host=document.getElementById('systemErrorLog');if(!host)return;host.innerHTML=systemErrors.length?systemErrors.slice().reverse().map(e=>`<div><b>${new Date(e.at).toLocaleTimeString('es-ES')}</b> · ${escapeHtml(e.message)} <small>${escapeHtml(e.source)}:${e.line}</small></div>`).join(''):'Sin errores registrados en esta sesión.';if(document.getElementById('sysErrors'))sysErrors.textContent=systemErrors.length}
function clearSystemErrors(){systemErrors=[];renderSystemErrors()}
function exportSystemState(){const state={product:'Plegar Pro',version:SYSTEM_VERSION,build:SYSTEM_BUILD,exportedAt:new Date().toISOString(),data:{bends,clients,calibrations,rules,workOrders,inventory:typeof inventory!=='undefined'?inventory:[],errors:systemErrors}};const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`PlegarPro_v${SYSTEM_VERSION}_estado.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function importSystemStateFile(file){if(!file)return;file.text().then(text=>{const state=JSON.parse(text),d=state.data||{};if(Array.isArray(d.bends)){bends=d.bends;renderBends()}if(Array.isArray(d.clients)){clients=d.clients;renderClients?.()}if(Array.isArray(d.calibrations)){calibrations=d.calibrations;renderCalibrations?.()}if(Array.isArray(d.rules)){rules=d.rules;renderRules?.()}if(Array.isArray(d.workOrders)){workOrders=d.workOrders;persistWorkOrders?.();initWorkOrders?.()}runSystemDiagnostics();alert('Estado importado. Revisa los módulos antes de fabricar.');}).catch(err=>alert('No se pudo importar: '+err.message))}
document.addEventListener('change',e=>{if(e.target?.id==='systemImport')importSystemStateFile(e.target.files?.[0])});

function initEngineeringCore(){
 const grid=document.getElementById('engineGrid');
 if(grid)grid.innerHTML=ENGINE_REGISTRY.map((e,i)=>`<div class="engine-card"><b>${String(i+1).padStart(2,'0')} · ${e.name}</b><small>${e.desc}</small><span class="engine-state">Operativo</span></div>`).join('');
 const sel=document.getElementById('engV');if(sel&&!sel.options.length)V_LIST.forEach(v=>sel.add(new Option('V'+v,v)));if(sel)sel.value='16';
 refreshIntegrity();
}
function materialFactor(name){return /inox/i.test(name)?1.5:/aluminio/i.test(name)?.55:/galvan/i.test(name)?1.05:1}
function runEngineeringAnalysis(){
 const material=engMaterial.value,t=+engThickness.value,L=+engLength.value,V=+engV.value,A=+engAngle.value,n=+engBends.value;
 const calc=bendData(V,t,A,.33),ratio=V/Math.max(t,.1),mf=materialFactor(material);
 const tonnage=(1.42*mf*L*t*t/Math.max(V,1))/10;
 const minFlange=Math.max(V*.7,4*t),risk=[];
 if(ratio<6)risk.push('La apertura V es estrecha respecto al espesor: revisar tonelaje, marcado y radio.');
 if(ratio>12)risk.push('La apertura V es grande respecto al espesor: aumentará el radio y puede variar la medida final.');
 if(n>=6)risk.push('Secuencia compleja: revisar giros, cierres y necesidad de segundo montaje.');
 if(!risk.length)risk.push('Configuración preliminar equilibrada; validar con la primera pieza y las tablas reales del utillaje.');
 const recommendation=ratio<6?`Comparar V${V} con V${V_LIST.find(x=>x>V)||V}.`:ratio>12?`Comparar V${V} con V${[...V_LIST].reverse().find(x=>x<V)||V}.`:'Mantener esta V como opción principal y comparar una alternativa próxima.';
 engineeringReport.innerHTML=`
 <div class="report-block"><h3>Geometría y desarrollo</h3>
 <div class="report-line"><i class="src calculated"></i><span>Radio interior estimado: <b>${calc.r.toFixed(2)} mm</b>.</span></div>
 <div class="report-line"><i class="src calculated"></i><span>Bend Allowance: <b>${calc.BA.toFixed(2)} mm</b>; Bend Deduction: <b>${calc.BD.toFixed(2)} mm</b>.</span></div>
 <div class="report-line"><i class="src calculated"></i><span>Ala mínima orientativa: <b>${minFlange.toFixed(1)} mm</b>.</span></div></div>
 <div class="report-block"><h3>Máquina y esfuerzo</h3>
 <div class="report-line"><i class="src calculated"></i><span>Tonelaje orientativo para ${L} mm: <b>${tonnage.toFixed(1)} t</b>.</span></div>
 <div class="report-line"><i class="src registered"></i><span>Material seleccionado: <b>${material}</b>; espesor: <b>${t} mm</b>; matriz: <b>V${V}</b>.</span></div></div>
 <div class="report-block"><h3>Riesgos y decisión</h3>${risk.map(x=>`<div class="report-line"><i class="src recommendation"></i><span>${x}</span></div>`).join('')}
 <div class="report-line"><i class="src recommendation"></i><span><b>${recommendation}</b></span></div></div>
 <div class="notice">Resultado orientativo. Confirma geometría, tonelaje, límites del punzón/matriz y valores reales de máquina antes de fabricar.</div>`;
}
function applyEngineeringToJob(){jobMaterial.value=engMaterial.value;jobThickness.value=engThickness.value;pBends.value=engBends.value;refreshIntegrity();go('dashboard')}
function refreshIntegrity(){
 const map={integrityTools:tools?.length||0,integrityBends:bends?.length||0,integrityClients:clients?.length||0,integrityCal:calibrations?.length||0,integrityRules:rules?.length||0,integrityOrders:workOrders?.length||0};
 Object.entries(map).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.textContent=v});
}

initEngineeringCore();
initVAnalyzer();
initWorkOrders();
document.addEventListener('keydown',e=>{
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='s'){
    e.preventDefault();
    if(document.querySelector('[data-page="jobs"]')?.classList.contains('active'))saveWorkOrder();
  }
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){
    e.preventDefault();toggleMenu(true);document.getElementById('menuSearch')?.focus();
  }
});
setTimeout(drawSim,100);setTimeout(runSystemDiagnostics,150);

if(document.getElementById('betaRunBtn'))betaRunBtn.onclick=runBetaDiagnostics;if(document.getElementById('betaExportBtn'))betaExportBtn.onclick=exportBetaState;
