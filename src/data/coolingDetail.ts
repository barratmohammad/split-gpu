import type { PartDef, Vec3, MaterialKind } from './types';

const NOTE = 'Educational reconstruction: this part’s internal geometry, dimensions and quantity are not verified for the H100 cooler. It is shown to explain the assembly, not as a manufacturing parts list.';

function item(id: string, name: string, size: Vec3, material: MaterialKind, base: Vec3,
  target: [number, number], description: string, kind: 'component' | 'fastener' = 'component'): PartDef {
  return {
    id, level: 'module', name, label: name, subtitle: 'Schematic mechanical detail',
    paragraphs: [description,
      'Select this individual piece to inspect it. The slider returns it to its illustrative assembled position; the exploded layout spreads it out for visibility.'],
    stats: [{ value: 'Schematic', label: 'geometry' }, { value: 'Individual', label: 'selection' }, { value: 'Unverified', label: 'exact H100 construction' }],
    geometry: { kind, size, material }, basePosition: base,
    explodeVector: [target[0] - base[0], 0, target[1] - base[2]], note: NOTE,
  };
}

/** Extra educational detail is explicitly distinguished from sourced component identity. */
export function coolingDetail(): PartDef[] {
  const parts = [
    item('heatsink', 'Cooler base — schematic', [10.2, 0.2, 4.7], 'copper', [0, 0.6, 0], [13, -4],
      'The cooler base provides a path for heat to reach the fin array. This copper-colored plate is an educational model; neither its material nor a vapor-chamber construction is asserted for the documented assembly.'),
    item('thermal-interface', 'Thermal interface — schematic', [2.1, 0.04, 1.9], 'siliconGray', [0, 0.47, 0], [3, -7],
      'Thermal interface material fills small gaps between contacting surfaces. This thin layer illustrates its role; its formulation and thickness are not verified for this H100 assembly.'),
    item('interposer-detail', 'Interposer — schematic', [3.2, 0.04, 3], 'silverMetal', [0, 0.36, 0], [3, -10.5],
      'The interposer illustrates the fine connections between the GPU die and nearby memory. Its geometry is enlarged for inspection, without claiming a measured package cross-section.'),
    item('support-plate-detail', 'Support plate — schematic', [10.2, 0.1, 4.8], 'graphite', [0, -0.08, 0], [-14, -7],
      'This support plate illustrates mechanical reinforcement below the board. Its presence, shape and material are not established by the module references and are not verified H100 specifications.'),
  ];
  // The count is a visualization choice, not a hardware specification.
  for (let i = 0; i < 40; i++) {
    parts.push(item(`cooling-fin-${i + 1}`, `Cooling fin ${i + 1} — schematic`, [0.065, 2.5, 4.4], 'silverMetal',
      [-4.68 + i * 0.24, 1.95, 0], [8.8 + i * 0.36, 2],
      'This individual fin illustrates how a cooler increases the area exposed to airflow. Forty fins are drawn for this teaching model; that number is not a verified count for an H100 heatsink.'));
  }
  for (let i = 0; i < 4; i++) {
    parts.push(item(`mounting-screw-${i + 1}`, `Mounting screw ${i + 1} — schematic`, [0.28, 0.75, 0.28], 'silverMetal',
      [i % 2 ? 4.7 : -4.7, 0.5, i < 2 ? -2 : 2], [9 + i * 1.1, 6],
      'Mounting screws secure an assembly to its support. These fastener shapes and dimensions are simplified; their positions are illustrative rather than a dimensioned service drawing.', 'fastener'));
  }
  return parts;
}
