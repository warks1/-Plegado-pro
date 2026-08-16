import {describe,expect,it} from 'vitest';
import {detectCadFormat,inspectAsciiStl,inspectObj} from './modelInspector';
describe('CAD model inspector',()=>{
  it('detects and measures OBJ',()=>{const r=inspectObj('v 0 0 0\nv 10 0 0\nv 0 5 2\nf 1 2 3');expect(r.vertexCount).toBe(3);expect(r.triangleCount).toBe(1);expect(r.bounds?.size).toEqual([10,5,2]);});
  it('detects ASCII STL',()=>{const text='solid x\nfacet normal 0 0 1\nouter loop\nvertex 0 0 0\nvertex 1 0 0\nvertex 0 1 0\nendloop\nendfacet\nendsolid';expect(detectCadFormat('x.stl',undefined,text)).toBe('stl-ascii');expect(inspectAsciiStl(text).triangleCount).toBe(1);});
});
