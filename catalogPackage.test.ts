import {describe,expect,it} from 'vitest';
import {createEmptyCatalogPackage,validateCatalogPackage} from './catalogPackage';
describe('technical catalog packages',()=>{
  it('accepts an empty valid template',()=>{const pkg=createEmptyCatalogPackage('Prueba');expect(validateCatalogPackage(pkg).valid).toBe(true);});
  it('rejects official items without a source',()=>{const pkg=createEmptyCatalogPackage('Prueba');pkg.items.push({id:'p1',kind:'punch',manufacturer:'TRUMPF',reference:'P1',name:'Punzón',source:'',verification:'official'});const result=validateCatalogPackage(pkg);expect(result.valid).toBe(false);expect(result.errors.join(' ')).toContain('fuente');});
  it('detects duplicated ids',()=>{const pkg=createEmptyCatalogPackage('Prueba');const item={id:'x',kind:'die' as const,manufacturer:'AMADA',reference:'V16',name:'Matriz',source:'catálogo',verification:'validated' as const};pkg.items.push(item,{...item});expect(validateCatalogPackage(pkg).valid).toBe(false);});
});
