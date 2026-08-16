import type {Bend,Machine,Project,Tool} from '../../types/domain';

export type CollisionSeverity='info'|'warning'|'blocking';
export interface CollisionFinding {id:string;bendId?:string;severity:CollisionSeverity;title:string;detail:string;recommendation:string;}

export function evaluateBendCollisions(project:Project,machine:Machine,punch:Tool,die:Tool):CollisionFinding[]{
  const findings:CollisionFinding[]=[];
  const daylight=machine.daylightMm;
  const toolStack=punch.height+die.height+project.thickness;
  if(toolStack>daylight){findings.push({id:'stack',severity:'blocking',title:'Altura de montaje incompatible',detail:`Montaje ${toolStack.toFixed(1)} mm > apertura ${daylight} mm.`,recommendation:'Seleccione una máquina con mayor apertura o herramientas más bajas.'});}
  const usableLength=machine.lengthMm;
  project.bends.forEach((bend,index)=>{
    const prefix=`P${bend.order}`;
    if(bend.length>usableLength){findings.push({id:`length-${bend.id}`,bendId:bend.id,severity:'blocking',title:`${prefix}: longitud fuera de máquina`,detail:`El pliegue requiere ${bend.length} mm y la máquina admite ${usableLength} mm.`,recommendation:'Cambie de máquina o divida la operación.'});}
    if(bend.backgaugeX<Math.max(8,project.thickness*3)){findings.push({id:`gauge-${bend.id}`,bendId:bend.id,severity:'warning',title:`${prefix}: apoyo de tope reducido`,detail:`Tope X ${bend.backgaugeX} mm con espesor ${project.thickness} mm.`,recommendation:'Revise estabilidad y considere apoyo alternativo.'});}
    const minV=Math.max(project.thickness*6,4);
    if((die.v??0)<minV){findings.push({id:`die-${bend.id}`,bendId:bend.id,severity:'warning',title:`${prefix}: apertura V muy cerrada`,detail:`V${die.v??0} frente a recomendación mínima V${minV.toFixed(0)}.`,recommendation:'Compruebe tonelaje, radio y riesgo de marcado.'});}
    if(bend.angle<35&&punch.angle>=bend.angle){findings.push({id:`angle-${bend.id}`,bendId:bend.id,severity:'blocking',title:`${prefix}: punzón sin holgura angular`,detail:`Punzón ${punch.angle}° para ángulo objetivo ${bend.angle}°.`,recommendation:'Use un punzón más agudo.'});}
    if(index>0){const previous=project.bends[index-1];const distance=Math.abs(bend.position-previous.position);const flange=Math.min(distance,bend.position,project.length-bend.position);if(flange<toolStack*.35){findings.push({id:`flange-${bend.id}`,bendId:bend.id,severity:'warning',title:`${prefix}: ala corta frente al montaje`,detail:`Ala estimada ${flange.toFixed(1)} mm; altura de montaje ${toolStack.toFixed(1)} mm.`,recommendation:'Revise colisión con portaherramientas y cambie la secuencia si es necesario.'});}}
  });
  if(project.bends.length===0)findings.push({id:'no-bends',severity:'info',title:'Sin pliegues para analizar',detail:'La pieza todavía no contiene operaciones de plegado.',recommendation:'Añada pliegues en Desarrollo o Programación 2D.'});
  return findings;
}

export function collisionSummary(findings:CollisionFinding[]){return {blocking:findings.filter(x=>x.severity==='blocking').length,warnings:findings.filter(x=>x.severity==='warning').length,info:findings.filter(x=>x.severity==='info').length,ready:!findings.some(x=>x.severity==='blocking')};}
