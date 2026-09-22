import type { PartDef, Vec3, MaterialKind } from './types';
import { powerComponents } from './powerComponents';

const note = 'Conceptual teardown based on the supplied visual reference. Mechanical layers, proportions and cooler construction are illustrative, not manufacturing CAD.';

/** The supplied art is the visual authority for this presentation assembly. */
export function referenceAssembly(source: PartDef[]): PartDef[] {
  const original = (id: string) => source.find(p => p.id === id)!;
  const layer = (id: string, name: string, size: Vec3, material: MaterialKind, y: number, lift: number, description: string): PartDef => ({
    id, level: 'module', name, label: name, subtitle: 'Inside the GPU assembly',
    paragraphs: [description, 'This layer is an illustrative reconstruction of the reference artwork. Select the components to explore their roles, or move the slider to bring the assembly together.'],
    stats: [{value:'Concept', label:'assembly'}, {value:'3D', label:'interactive view'}, {value:'Illustrative', label:'construction'}],
    geometry: {kind:'component',size,material}, basePosition:[0,y,0], explodeVector:[0,lift,0], note,
  });
  const board: PartDef = {...original('board'), geometry:{kind:'board',size:[7,.14,5.3]}, basePosition:[0,.25,0],explodeVector:[0,.9,0],note};
  const power = powerComponents([10,.14,4.6]).map((p,i): PartDef => ({
    ...original('power-delivery'), id:i===0?'power-delivery':`power-component-${i+1}`,
    name:`Board component ${i+1}`, label:'Board component', subtitle:'Visible board circuitry · simplified proxy',
    geometry:{kind:'component',size:[p.size[0]*.7,p.size[1],p.size[2]*1.1],material:p.material},
    basePosition:[p.position[0]*.68,.34+p.position[1],p.position[2]*1.08],explodeVector:[0,.9,0],note:'Based on the populated areas in NVIDIA’s module photograph. This generic component shape is illustrative; its part number, electrical role and the total board-component count have not been verified.',
  }));
  const pkg: PartDef = {...original('package'), geometry:{kind:'package',size:[6.3,.16,4.7]},basePosition:[0,1.02,0],explodeVector:[0,3.2,0],note};
  const hbm = [-1,1].flatMap((side,row) => [-1,0,1].map((n,i): PartDef => ({
    ...original('hbm'), id:row*3+i===0?'hbm':`hbm-position-${row*3+i+1}`,
    name:`HBM3 memory position ${row*3+i+1}`,geometry:{kind:'hbm',size:[1.1,.16,.82],positions:[[0,0,0]]},
    basePosition:[side*2.25,1.23,n*1.25],explodeVector:[0,3.2,0],note,
  })));
  const die: PartDef = {...original('gpu-die'),name:'GPU Die',geometry:{kind:'die',size:[2.9,.12,2.6]},basePosition:[0,1.25,0],explodeVector:[0,3.2,0],
    paragraphs:['The GPU die runs thousands of operations in parallel. Its compute blocks work together to turn data into results.','For developers, this parallel design makes large, repeatable workloads a natural fit — from simulation to AI.'], note:original('gpu-die').note};
  return [
    layer('support-plate','Support plate',[7.2,.28,5.5],'graphite',-.12,0,'The lower plate supports the assembly and provides a stable mechanical foundation for the circuit board.'),
    board,...power,
    {...board,id:'routing-board',name:'Package substrate',label:'Package substrate', subtitle:'Connections between the package and the board', paragraphs:['This thin substrate illustrates the routing layer beneath the GPU package. Fine conductive paths carry power and signals between the silicon package and the module board.','Its separate presentation follows the supplied concept artwork. Exact dimensions and physical layer construction are illustrative.'],basePosition:[0,.85,0],explodeVector:[0,2,0], geometry:{kind:'board',size:[6.7,.1,4.9]}},
    pkg,...hbm,die,
    layer('thermal-interface','Thermal interface',[5.7,.055,4.2],'silverMetal',1.39,4.3,'A thin thermal interface illustrates the contact between the package and the cooling assembly, helping transfer heat away from the silicon.'),
    layer('cold-plate','Copper cold plate',[6.8,.18,5.1],'copper',1.55,5.4,'A broad copper-colored plate illustrates how heat spreads from the package toward the much larger cooling surface above it.'),
    {...layer('heatsink','Heatsink fins',[6.8,1.05,5],'silverMetal',2.18,6.5,'Closely spaced metal fins increase the surface area exposed to airflow, carrying heat away from the cooling assembly.'), geometry:{kind:'heatsink',size:[6.8,1.05,5]}},
    {...layer('cover','Top cover',[7,.42,5.2],'silverMetal',2.96,7.2,'The brushed-metal top cover completes the presentation assembly. The finish and construction follow the supplied concept artwork.'), geometry:{kind:'cover',size:[7,.42,5.2]}},
    ...[-1,1].flatMap((x,xi)=>[-1,1].map((z,zi):PartDef=>({
      ...layer(`mounting-screw-${xi*2+zi+1}`,`Mounting fastener ${xi*2+zi+1}`,[.2,.42,.2],'silverMetal',3.02,7.2,'A mounting fastener holds the cooling assembly in place. Lenovo’s H100/H200 service procedure specifies four Torx T15 mounting screws.'),
      geometry:{kind:'fastener',size:[.2,.42,.2],material:'silverMetal'},
      basePosition:[x*3.24,3.02,z*2.34],
      stats:[{value:'4',label:'service screws'},{value:'T15',label:'documented drive'},{value:'Illustrative',label:'placement'}],
      sourceUrl:'https://pubs.lenovo.com/sr685a-v3/remove_an_h100_gpu',
      note:'The service guide documents four Torx T15 screws. Placement, head dimensions and exposed thread geometry here follow the existing concept model, not a dimensioned drawing.',
    }))),
  ];
}
