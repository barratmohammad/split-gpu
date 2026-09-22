import { detailedDie } from './detailLayout';
import type { PartDef, Vec3 } from './types';

/*
 * Level 2: an architecture schematic of the GH100 die, following the relative
 * arrangement of NVIDIA's full-GH100 block diagram (Hopper In-Depth, figure 3):
 * PCIe and the GigaThread engine along the top edge, two rows of four GPCs
 * with the L2 cache between them, memory controllers on both sides, and NVLink
 * along the bottom.
 *
 * These are regions of one piece of silicon, not separate chips. Positions and
 * sizes are simplified; the "Detail" slider lifts the regions purely as a
 * schematic visualization. The diagram shows the full design (144 SMs); the
 * H100 SXM5 product enables 132, and which SMs are disabled is not published.
 */

const SOURCE_ARCH = 'Source: NVIDIA Hopper architecture. Architecture schematic; positions and sizes simplified.';

const REGION_Y = 0.24 + 0.04;
const gpcColumns = [-3.15, -1.05, 1.05, 3.15];
const gpcRows = [-1.2, 1.2];

const gpcContent = {
  subtitle: 'A cluster of streaming multiprocessors',
  paragraphs: [
    'A Graphics Processing Cluster groups streaming multiprocessors (SMs) with the shared logic that feeds them. The full GH100 design has 8 GPCs, each with 9 texture processing clusters of 2 SMs, for 144 SMs. The H100 SXM5 product enables 8 GPCs, 66 TPCs and 132 SMs, so not every GPC runs all 18.',
    'Hopper lets developers schedule a cluster of thread blocks onto one GPC so they can cooperate through distributed shared memory. Clusters of up to 8 blocks are portable across GPUs; H100 supports 16 as an opt-in.',
  ] as [string, string],
  stats: [
    { value: '8', label: 'GPCs enabled' },
    { value: '18', label: 'SMs per GPC (full design)' },
    { value: '132', label: 'enabled SMs total' },
  ] as PartDef['stats'],
};

const gpcs: PartDef[] = gpcRows.flatMap((z, r) =>
  gpcColumns.map((x, c): PartDef => {
    const n = r * 4 + c + 1;
    const showSm = n === 4;
    return {
      id: `gpc-${n}`,
      level: 'die',
      name: `GPC ${n} (Graphics Processing Cluster)`,
      label: `GPC ${n}`,
      ...gpcContent,
      geometry: {
        kind: 'region',
        size: [1.95, 0.08, 1.4],
        style: 'gpc',
        text: `GPC ${n}`,
        sm: showSm ? { offset: [-0.6, 0.05, 0.2], size: [0.32, 0.05, 0.42] } : undefined,
      },
      basePosition: [x, REGION_Y, z],
      explodeVector: [0, 0.34, 0],
      note: SOURCE_ARCH,
    };
  }),
);

const assembledParts: PartDef[] = [
  {
    id: 'die-base',
    level: 'die',
    name: 'GH100 silicon die',
    label: 'GH100 silicon',
    subtitle: 'One piece of silicon, 80 billion transistors',
    paragraphs: [
      'GH100 is made on TSMC’s 4N process and measures 814 mm². Every region drawn above this base is etched into the same slab of silicon: compute clusters, cache, memory controllers, and the PCIe and NVLink interfaces.',
      'The full design contains 144 SMs and 60 MB of L2 with six memory-stack positions. The H100 SXM5 product enables 132 SMs, 50 MB of L2 and five HBM3 stacks. Which units are disabled is not published, so this map does not mark them.',
    ],
    stats: [
      { value: '814 mm²', label: 'die area' },
      { value: 'TSMC 4N', label: 'process' },
      { value: '80 billion', label: 'transistors' },
    ],
    geometry: { kind: 'dieBase', size: [9.6, 0.24, 5.4] },
    basePosition: [0, 0.12, 0],
    explodeVector: [0, 0, 0],
    note: SOURCE_ARCH,
  },
  {
    id: 'pcie',
    level: 'die',
    name: 'PCIe Gen5 host interface',
    label: 'PCIe Gen5',
    subtitle: 'The link to the host CPU',
    paragraphs: [
      'A 16-lane PCIe Gen5 interface connects the GPU to the host processor at 128 GB/s bidirectional. Kernel launches, driver commands, and host-to-device copies that go over PCIe travel through it.',
      'It is far slower than the GPU’s own memory or NVLink, which is why developers try to keep data resident on the GPU and overlap transfers with compute.',
    ],
    stats: [
      { value: 'Gen5 x16', label: 'interface' },
      { value: '128 GB/s', label: 'bidirectional' },
      { value: 'Host CPU', label: 'connects to' },
    ],
    geometry: { kind: 'region', size: [8.4, 0.08, 0.28], style: 'band', text: 'PCIe Gen5' },
    basePosition: [0, REGION_Y, -2.42],
    explodeVector: [0, 0.2, 0],
    note: SOURCE_ARCH,
  },
  {
    id: 'gigathread',
    level: 'die',
    name: 'GigaThread engine',
    label: 'GigaThread engine',
    subtitle: 'The dispatcher that hands work to the GPCs',
    paragraphs: [
      'The front end of the chip. It takes kernel launches from the command queues, breaks each grid into thread blocks, and distributes them to GPCs that have free SM capacity, tracking completion as they finish.',
      'On H100 it also implements MIG control, the Multi-Instance GPU feature that can partition one H100 into up to seven isolated instances, each with its own compute and memory slice.',
    ],
    stats: [
      { value: 'Grids', label: 'input' },
      { value: 'Thread blocks', label: 'unit dispatched' },
      { value: 'MIG', label: 'partition control' },
    ],
    geometry: { kind: 'region', size: [8.4, 0.08, 0.28], style: 'band', text: 'GigaThread engine with MIG control' },
    basePosition: [0, REGION_Y, -2.08],
    explodeVector: [0, 0.22, 0],
    note: SOURCE_ARCH,
  },
  ...gpcs,
  {
    id: 'sm',
    level: 'die',
    name: 'Streaming Multiprocessor (SM)',
    label: 'SM · schematic detail',
    subtitle: 'Where parallel threads run',
    paragraphs: [
      'An SM runs groups of 32 threads called warps. Each H100 SM has four partitions, each with its own warp scheduler, 32 FP32 units, 16 INT32 units, 16 FP64 units, and a fourth-generation Tensor Core for matrix math: 128 FP32 CUDA cores and 4 Tensor Cores per SM.',
      'Each SM has a 256 KB register file and 256 KB of combined L1 cache and shared memory that a kernel can partition. Keeping many warps resident hides memory latency, which is why occupancy and shared-memory reuse matter so much in GPU tuning. This tile is one representative SM; the 132 enabled SMs are spread across the eight GPCs.',
    ],
    stats: [
      { value: '128', label: 'FP32 cores per SM' },
      { value: '4', label: 'Tensor Cores per SM' },
      { value: '132', label: 'enabled SMs total' },
    ],
    geometry: { kind: 'virtual' },
    basePosition: [0, 0, 0],
    explodeVector: [0, 0, 0],
    note: SOURCE_ARCH,
  },
  {
    id: 'l2-cache',
    level: 'die',
    name: 'L2 cache',
    label: 'L2 cache · 50 MB',
    subtitle: 'The last stop before memory',
    paragraphs: [
      'A 50 MB cache shared by every SM, split into two partitions that sit between the rows of GPCs. Data pulled from HBM lands here, so SMs that touch the same lines again can be served without another trip to memory.',
      'Hopper adds a Tensor Memory Accelerator for asynchronous bulk copies between global and shared memory, and a portion of the L2 can be set aside for accesses marked persistent so hot data is more likely to stay cached.',
    ],
    stats: [
      { value: '50 MB', label: 'enabled capacity' },
      { value: '2', label: 'partitions' },
      { value: 'Shared', label: 'by all SMs' },
    ],
    geometry: { kind: 'region', size: [8.4, 0.08, 0.5], style: 'l2', text: 'L2 cache · 50 MB' },
    basePosition: [0, REGION_Y, 0],
    explodeVector: [0, 0.26, 0],
    note: SOURCE_ARCH,
  },
  {
    id: 'memory-controllers',
    level: 'die',
    name: 'HBM3 memory controllers',
    label: 'HBM controllers',
    subtitle: 'The on-die side of the memory link',
    paragraphs: [
      'Memory controllers along both edges of the die drive the HBM3 stacks through the package. H100 SXM5 uses ten active 512-bit controllers to reach its five active stacks; each stack presents a 1024-bit interface.',
      'Together with the L2, these controllers set the 3.35 TB/s ceiling. When a kernel is memory-bound, they and the DRAM behind them are what is saturated.',
    ],
    stats: [
      { value: '10 x 512-bit', label: 'active controllers' },
      { value: '3.35 TB/s', label: 'memory bandwidth' },
      { value: '5', label: 'active HBM3 stacks' },
    ],
    geometry: { kind: 'region', size: [0.34, 0.08, 4.7], style: 'controller', text: 'HBM controllers', textRotation: 90 },
    basePosition: [0, REGION_Y, 0],
    explodeVector: [0, 0.2, 0],
    note: SOURCE_ARCH,
  },
  {
    id: 'nvlink',
    level: 'die',
    name: 'NVLink 4 interface',
    label: 'NVLink 4',
    subtitle: 'High-speed links to other GPUs',
    paragraphs: [
      'Eighteen fourth-generation NVLink links give 900 GB/s of total bandwidth for GPU-to-GPU traffic, seven times the PCIe Gen5 figure. In an HGX system they connect through NVSwitch chips so every GPU can reach every other at full speed.',
      'This is the fabric that lets a model too large for one GPU be split across eight, and what multi-GPU collective operations such as all-reduce run over.',
    ],
    stats: [
      { value: '18', label: 'NVLink links' },
      { value: '900 GB/s', label: 'total bandwidth' },
      { value: 'NVSwitch', label: 'fabric partner' },
    ],
    geometry: { kind: 'region', size: [8.4, 0.08, 0.28], style: 'band', text: 'NVLink 4' },
    basePosition: [0, REGION_Y, 2.42],
    explodeVector: [0, 0.2, 0],
    note: SOURCE_ARCH,
  },
  {
    id: 'media-engines',
    level: 'die',
    name: 'NVDEC and JPEG decoders',
    label: 'Also on die',
    subtitle: 'Fixed-function decoders beside the compute',
    paragraphs: [
      'H100 includes seven NVDEC video decoders and seven NVJPG JPEG decoders, so image and video pipelines can feed the SMs without spending compute on decoding.',
      'H100 has no video encoder and no display outputs. These decoders are on the die, but NVIDIA’s block diagram does not place them, so this schematic lists them without a position.',
    ],
    stats: [
      { value: '7', label: 'NVDEC decoders' },
      { value: '7', label: 'JPEG decoders' },
      { value: 'None', label: 'encoder or display' },
    ],
    geometry: { kind: 'virtual' },
    basePosition: [0, 0, 0],
    explodeVector: [0, 0, 0],
    note: SOURCE_ARCH,
  },
];

/** Both memory-controller strips share one part; these are their offsets. */
export const CONTROLLER_OFFSETS: Vec3[] = [
  [-4.5, 0, 0],
  [4.5, 0, 0],
];

/** The two L2 partitions share one part; these are their offsets. */
export const L2_OFFSETS: Vec3[] = [
  [-2.12, 0, 0],
  [2.12, 0, 0],
];

export const dieParts = detailedDie(assembledParts);
