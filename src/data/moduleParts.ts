import { referenceAssembly } from './referenceAssembly';
import type { PartDef, Vec3 } from './types';

/*
 * Level 1: the NVIDIA H100 SXM5 80 GB module, listed bottom to top.
 *
 * Sources: NVIDIA "Hopper Architecture In-Depth" (module photograph, figure 1;
 * architecture figures 3 and 4), NVIDIA H100 product specifications (SXM
 * column), and the Lenovo ThinkSystem SR685a V3 H100 service procedure
 * (removable plastic cover; GPU and heatsink removed as one assembly).
 *
 * Geometry is schematic and not to scale. Only parts visible in those sources
 * are modeled. Connector geometry on the underside is omitted because it is
 * not documented in the sources inspected.
 */

const BOARD: Vec3 = [10.0, 0.14, 4.6];
const BOARD_TOP = BOARD[1];

const SOURCE_MODULE = 'Based on NVIDIA’s module photograph. Geometry not to scale.';
const SOURCE_SERVICE =
  'Based on the Lenovo and Dell H100 service procedures, which show this part as a unit. Drawn in a neutral finish; material and internals are not documented there.';

const hbmPositions: Vec3[] = [
  [-0.95, 0, -1.08],
  [0, 0, -1.08],
  [0.95, 0, -1.08],
  [-0.95, 0, 1.08],
  [0, 0, 1.08],
  [0.95, 0, 1.08],
];

const assembledParts: PartDef[] = [
  {
    id: 'board',
    level: 'module',
    name: 'Module board',
    label: 'Module board',
    subtitle: 'The dark circuit board everything is mounted on',
    paragraphs: [
      'The H100 SXM5 module is a flat, wide circuit board rather than a slot-in card. NVIDIA’s photograph shows a dark board with the GPU package in the center, dense power circuitry on both flanks, and mounting holes along the edges.',
      'In a server it sits on an HGX baseboard, which provides the socket the module plugs into. The board carries power to the package and routes the PCIe Gen5 and NVLink signals between the GPU and that baseboard.',
    ],
    stats: [
      { value: 'SXM5', label: 'form factor' },
      { value: '700 W', label: 'max configurable TDP' },
      { value: 'HGX', label: 'baseboard socket' },
    ],
    geometry: { kind: 'board', size: BOARD },
    basePosition: [0, BOARD_TOP / 2, 0],
    explodeVector: [0, 0, 0],
    note: SOURCE_MODULE,
  },
  {
    id: 'power-delivery',
    level: 'module',
    name: 'Power delivery components',
    label: 'Power delivery',
    subtitle: 'The dense circuitry on both flanks of the board',
    paragraphs: [
      'Both sides of the board are packed with power components that convert the supply from the baseboard into the rails the GPU package needs. On a module that can be configured up to 700 W, this circuitry takes up more board area than the GPU itself.',
      'These components are what NVIDIA’s photograph shows on the flanks. Their exact part numbers, phase counts, and voltages are not published, so they are drawn as generic blocks.',
    ],
    stats: [
      { value: '700 W', label: 'max configurable TDP' },
      { value: 'Both flanks', label: 'placement' },
      { value: 'Generic', label: 'parts not published' },
    ],
    geometry: { kind: 'powerFlanks', boardSize: BOARD },
    basePosition: [0, BOARD_TOP, 0],
    explodeVector: [0, 0.6, 0],
    note: SOURCE_MODULE,
  },
  {
    id: 'package',
    level: 'module',
    name: 'GPU package',
    label: 'GPU package',
    subtitle: 'The sealed unit that holds the die and its memory',
    paragraphs: [
      'The GH100 die and its HBM3 memory are assembled together into one package using TSMC CoWoS 2.5D packaging, which places them side by side on a silicon interposer so the memory sits millimeters from the compute.',
      'The package is what actually gets soldered to the board. Everything above it in this view, the memory positions and the die, is part of this single unit; they are separated here only to show what is inside.',
    ],
    stats: [
      { value: 'CoWoS', label: 'TSMC 2.5D packaging' },
      { value: 'TSMC 4N', label: 'die process' },
      { value: '1 unit', label: 'die + memory' },
    ],
    geometry: { kind: 'package', size: [3.5, 0.2, 3.3] },
    basePosition: [0, BOARD_TOP + 0.1, 0],
    explodeVector: [0, 1.5, 0],
    note: SOURCE_MODULE,
  },
  {
    id: 'hbm',
    level: 'module',
    name: 'HBM3 memory positions',
    label: 'HBM3 memory',
    subtitle: 'Six package positions, five active stacks, 80 GB',
    paragraphs: [
      'NVIDIA’s photograph shows six memory positions around the die, three above and three below. The H100 SXM5 product uses five active HBM3 stacks for 80 GB; which position is unused is not identified, so none is marked here.',
      'Each HBM3 stack talks to the GPU over a 1024-bit interface, and the five active stacks together deliver 3.35 TB/s. This is the memory your tensors and buffers live in, and its bandwidth is often what limits performance.',
    ],
    stats: [
      { value: '80 GB', label: 'HBM3 capacity' },
      { value: '3.35 TB/s', label: 'memory bandwidth' },
      { value: '5 active', label: 'of 6 positions' },
    ],
    geometry: { kind: 'hbm', size: [0.62, 0.14, 0.66], positions: hbmPositions },
    basePosition: [0, BOARD_TOP + 0.2 + 0.04 + 0.07, 0],
    explodeVector: [0, 2.3, 0],
    note: SOURCE_MODULE,
  },
  {
    id: 'gpu-die',
    level: 'module',
    name: 'GPU die (GH100)',
    label: 'GPU Die — GH100',
    subtitle: 'The silicon that does the computing',
    paragraphs: [
      'GH100 contains the compute, cache and interfaces that power H100: 80 billion transistors on an 814 mm² die made on TSMC’s 4N process. This SXM configuration enables 132 streaming multiprocessors and 50 MB of L2 cache.',
      'For developers, this parallel design makes large, repeatable workloads a natural fit, from simulation to AI. Explore inside the die to see how its compute, cache, and interfaces are arranged.',
    ],
    stats: [
      { value: '80 billion', label: 'transistors' },
      { value: '132', label: 'enabled SMs' },
      { value: '50 MB', label: 'L2 cache' },
    ],
    geometry: { kind: 'die', size: [1.75, 0.1, 1.55] },
    basePosition: [0, BOARD_TOP + 0.2 + 0.04 + 0.05, 0],
    explodeVector: [0, 3.0, 0],
    drillInto: 'die',
    note: SOURCE_MODULE,
  },
  {
    id: 'heatsink',
    level: 'module',
    name: 'GPU and heatsink assembly',
    label: 'Heatsink assembly',
    subtitle: 'The cooler that ships fitted to the module in a server',
    paragraphs: [
      'Server service guides from Lenovo and Dell show the H100 GPU and its heatsink handled as one assembly: the whole block is unscrewed and lifted off the baseboard together. The heatsink is supplied with the server, not as a separate NVIDIA part.',
      'It sits on top of the package and spreads the heat from a 700 W module into the server’s airflow. Its internal construction is not documented in those guides, so it is drawn as a plain block.',
    ],
    stats: [
      { value: 'One unit', label: 'GPU + heatsink' },
      { value: 'Server air', label: 'cooling' },
      { value: 'Vendor', label: 'supplied with server' },
    ],
    geometry: { kind: 'heatsink', size: [10.2, 3.0, 4.7] },
    basePosition: [0, BOARD_TOP + 0.5 + 1.5, 0],
    explodeVector: [0, 6.6, 0],
    note: SOURCE_SERVICE,
  },
  {
    id: 'cover',
    level: 'module',
    name: 'Plastic cover',
    label: 'Plastic cover',
    subtitle: 'A small removable cap on top of the heatsink',
    paragraphs: [
      'The Lenovo service procedure starts by lifting a small plastic cover off the top of the heatsink assembly. It is the first thing removed and the last thing refitted when a GPU is serviced.',
      'It protects the mounting area beneath it. Nothing electrical lives in it; it is included here because it is a documented, separately removable part of the installed module.',
    ],
    stats: [
      { value: 'Plastic', label: 'per service guide' },
      { value: 'Step 1', label: 'in removal' },
      { value: 'Protective', label: 'function' },
    ],
    geometry: { kind: 'cover', size: [2.6, 0.12, 1.4] },
    basePosition: [0.6, BOARD_TOP + 0.5 + 3.0 + 0.06, 0],
    explodeVector: [0, 8.8, 0],
    note: SOURCE_SERVICE,
  },
];

export const moduleParts = referenceAssembly(assembledParts.map(part => ({ ...part, sourceUrl: part.id === 'heatsink' || part.id === 'cover' ? 'https://pubs.lenovo.com/sr685a-v3/remove_an_h100_gpu' : 'https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/' })));
