import {describe,expect,it} from 'vitest';
import {calculateBend,calculateProject,validateBendGeometry} from './calculations';
import type {Bend,Project} from '../../types/domain';
const bend:Bend={id:'b1',position:200,length:500,angle:90,radius:2,direction:'positive',side:'interior',fixedFace:'left',punchId:'p',dieId:'d',backgaugeX:200,correction:0,order:1};
const project:Project={id:'p',name:'P',customer:'C',material:'S235JR',thickness:2,width:500,length:1000,bends:[bend],updatedAt:new Date().toISOString()};
describe('cálculos de plegado',()=>{it('calcula BA y BD positivas',()=>{const r=calculateBend(bend,2,.38);expect(r.bendAllowance).toBeGreaterThan(0);expect(r.bendDeduction).toBeGreaterThan(0)});it('calcula peso y desarrollo',()=>{const r=calculateProject(project);expect(r.weightKg).toBeGreaterThan(0);expect(r.estimatedFlatLength).toBeLessThan(project.length)});it('valida geometría',()=>{expect(validateBendGeometry(bend,project)).toHaveLength(0)})});
