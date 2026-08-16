import {describe,expect,it} from 'vitest';
import {moduleContracts,summarizeContracts} from './moduleManifest';
describe('module contracts',()=>{it('defines unique routes and explicit actions',()=>{expect(new Set(moduleContracts.map(x=>x.route)).size).toBe(moduleContracts.length);expect(moduleContracts.every(x=>x.form&&x.actions.length>0)).toBe(true)});it('summarizes maturity',()=>{const result=summarizeContracts();expect(result.functional+result.partial+result.blocked).toBe(moduleContracts.length)})});
