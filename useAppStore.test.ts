import {beforeEach,describe,expect,it} from 'vitest';
import {useAppStore} from './useAppStore';

describe('Plegar Pro store',()=>{
  beforeEach(()=>{localStorage.clear();useAppStore.setState({projects:[{id:'p',name:'Test',customer:'',material:'S235JR',thickness:2,width:500,length:800,bends:[],updatedAt:''}],activeProjectId:'p',selectedMachineId:'truma-v85',orders:[],history:[],future:[]})});
  it('adds and edits a bend',()=>{useAppStore.getState().addBend({position:200,length:500,angle:90,radius:2,direction:'positive',side:'interior',fixedFace:'left',punchId:'p-tr-88-r1',dieId:'d-am-v16',backgaugeX:200,correction:0});const bend=useAppStore.getState().projects[0].bends[0];expect(bend.order).toBe(1);useAppStore.getState().updateBend(bend.id,{angle:88});expect(useAppStore.getState().projects[0].bends[0].angle).toBe(88)});
  it('undoes and redoes project changes',()=>{useAppStore.getState().updateProject('p',{material:'S355JR'});expect(useAppStore.getState().projects[0].material).toBe('S355JR');useAppStore.getState().undo();expect(useAppStore.getState().projects[0].material).toBe('S235JR');useAppStore.getState().redo();expect(useAppStore.getState().projects[0].material).toBe('S355JR')});
});

describe('selección CAD y simulación',()=>{
  it('conserva máquina, punzón, matriz, velocidad y cámara',()=>{
    const state=useAppStore.getState();
    state.setMachine('by-100-2006');
    state.setPunch('p-am-30-r2');
    state.setDie('d-by-v24');
    state.setSimulationSpeed('fast');
    state.setCameraView('side');
    state.setShowDimensions(false);
    const next=useAppStore.getState();
    expect(next.selectedMachineId).toBe('by-100-2006');
    expect(next.selectedPunchId).toBe('p-am-30-r2');
    expect(next.selectedDieId).toBe('d-by-v24');
    expect(next.simulationSpeed).toBe('fast');
    expect(next.cameraView).toBe('side');
    expect(next.showDimensions).toBe(false);
  });
});

describe('enterprise state',()=>{
  it('adds a supplier and an agenda event',()=>{
    const state=useAppStore.getState();
    const supplierId='supplier-test';
    state.addSupplier({id:supplierId,name:'Proveedor test',city:'Barcelona',materials:['S235JR'],services:['Corte'],email:'',phone:'',website:'',source:'workshop'});
    state.addEvent({id:'event-test',title:'Entrega prueba',date:'2026-08-02',type:'delivery',notes:''});
    expect(useAppStore.getState().suppliers.some(item=>item.id===supplierId)).toBe(true);
    expect(useAppStore.getState().events.some(item=>item.id==='event-test')).toBe(true);
  });
});


describe('engineering tools v0.5',()=>{it('persists welding and imported documents',()=>{const state=useAppStore.getState();state.addWelding({id:'w-test',projectId:'p',process:'TIG',joint:'Esquina',length:120,passes:1,gas:'Argón',notes:'',status:'planned',updatedAt:''});state.addImportedDocument({id:'i-test',name:'pieza.dxf',format:'dxf',size:1000,units:'mm',scale:1,mode:'editable',status:'analyzed',detectedBends:2,confidence:.95,createdAt:''});expect(useAppStore.getState().welding.some(x=>x.id==='w-test')).toBe(true);expect(useAppStore.getState().importedDocuments.some(x=>x.id==='i-test')).toBe(true)})});


describe('operations suite v0.6',()=>{
  it('persists stock, quotes, routes, notifications and technical messages',()=>{
    const s=useAppStore.getState();
    s.addStock({id:'stock-test',kind:'remnant',name:'Retal test',material:'S235JR',thickness:2,width:400,length:500,quantity:1,location:'R-01',reserved:0,updatedAt:''});
    s.addQuote({id:'quote-test',reference:'PRE-TEST',projectId:'p',customerId:'c-demo',quantity:1,materialCost:10,cuttingCost:5,bendingCost:8,weldingCost:0,finishingCost:0,transportCost:0,margin:20,status:'draft',updatedAt:''});
    s.addRoute({id:'route-test',name:'Ruta test',projectId:'p',steps:[{id:'st',name:'Plegado',notes:'',order:1}],status:'draft',updatedAt:''});
    s.addNotification({id:'n-test',title:'Aviso',detail:'Prueba',type:'info',read:false,createdAt:''});
    s.addMessage({id:'msg-test',projectId:'p',channel:'Plegado',author:'Test',text:'Confirmar cota',priority:'high',createdAt:''});
    const next=useAppStore.getState();
    expect(next.stock.some(x=>x.id==='stock-test')).toBe(true);
    expect(next.quotes.some(x=>x.id==='quote-test')).toBe(true);
    expect(next.routes.some(x=>x.id==='route-test')).toBe(true);
    expect(next.notifications.some(x=>x.id==='n-test')).toBe(true);
    expect(next.messages.some(x=>x.id==='msg-test')).toBe(true);
  });
});

describe('project workflow v0.16.2',()=>{
  it('deletes a project and restores it with undo',()=>{
    useAppStore.setState({projects:[{id:'p1',name:'Uno',customer:'A',material:'S235JR',thickness:2,width:500,length:800,bends:[],updatedAt:''},{id:'p2',name:'Dos',customer:'B',material:'S355JR',thickness:3,width:600,length:900,bends:[],updatedAt:''}],activeProjectId:'p2',orders:[],routes:[],documents:[],revisions:[],releases:[],history:[],future:[]});
    useAppStore.getState().deleteProject('p2');
    expect(useAppStore.getState().projects.map(p=>p.id)).toEqual(['p1']);
    expect(useAppStore.getState().activeProjectId).toBe('p1');
    useAppStore.getState().undo();
    expect(useAppStore.getState().projects.some(p=>p.id==='p2')).toBe(true);
  });
});
