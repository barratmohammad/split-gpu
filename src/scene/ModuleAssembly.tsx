import { moduleParts } from '../data';
import { Part } from './Part';
import { PartGeometry } from './parts';

/** Level 1: every part of the H100 SXM5 module. */
export function ModuleAssembly() {
  return (
    <group>
      {moduleParts.map((def) => (
        <Part key={def.id} def={def}>
          <PartGeometry def={def} />
        </Part>
      ))}
    </group>
  );
}
