import {describe,expect,it} from 'vitest';
import {evaluateBendCollisions,collisionSummary} from './engine';
import type {Machine,Project,Tool} from '../../types/domain';
const project:Project={id:'x',name:'x',customer:'x',material:'S235',thickness:4,width:500,length:800,updatedAt:'',bends:[{id:'b',position:5,length:900,angle:30,radius:2,direction:'positive',side:'interior',fixedFace:'left',punchId:'p',dieId:'d',backgaugeX:5,correction:0,order:1}]};
const machine:Machine={id:'m',manufacturer:'Test',name:'M',forceT:100,lengthMm:700,strokeMm:200,daylightMm:100,throatMm:300,axes:[],clamp:'European',source:'reconstructed',verified:false};
const punch:Tool={id:'p',kind:'punch',manufacturer:'Test',family:'x',name:'P',angle:30,radius:1,height:70,width:20,loadKnM:500,clamp:'European',lengths:[835],source:'reconstructed',verified:false};
const die:Tool={id:'d',kind:'die',manufacturer:'Test',family:'x',name:'D',angle:85,radius:2,height:40,width:60,v:12,loadKnM:500,clamp:'European',lengths:[835],source:'reconstructed',verified:false};
describe('collision engine',()=>{it('detecta incompatibilidades bloqueantes',()=>{const f=evaluateBendCollisions(project,machine,punch,die);expect(collisionSummary(f).blocking).toBeGreaterThan(0);expect(collisionSummary(f).ready).toBe(false)})});
