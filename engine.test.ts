import {describe,expect,it} from 'vitest';
import {createSimulationFrames} from './engine';
import type {Project} from '../../types/domain';
const project:Project={id:'p',name:'P',customer:'C',material:'S235JR',thickness:2,width:500,length:1000,updatedAt:'x',bends:[{id:'b1',position:200,length:500,angle:90,radius:2,direction:'positive',side:'interior',fixedFace:'left',punchId:'p',dieId:'d',backgaugeX:200,correction:0,order:1}]};
describe('motor de simulación',()=>{it('genera estados de posicionamiento y plegado',()=>{const frames=createSimulationFrames(project);expect(frames).toHaveLength(4);expect(frames.at(-1)?.status).toBe('complete');expect(frames.at(-1)?.achievedAngle).toBe(90)})});
