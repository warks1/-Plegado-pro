import {describe,expect,it} from 'vitest';
import {canClaimOfficialCad,validateDimensions} from './dimensionalValidation';
describe('dimensional CAD validation',()=>{
  it('accepts a model inside tolerance',()=>{const result=validateDimensions({x:100.1,y:50,z:25.2},{x:100,y:50,z:25},.25);expect(result.valid).toBe(true)});
  it('blocks official status without traceability and validation',()=>{expect(canClaimOfficialCad({source:'',license:'',sha256:'x'})).toBe(false)});
  it('allows official status with source, license, hash and valid dimensions',()=>{const validation=validateDimensions({x:100,y:50,z:25},{x:100,y:50,z:25},.1);expect(canClaimOfficialCad({source:'portal oficial',license:'uso autorizado',sha256:'abc',validation})).toBe(true)});
});
