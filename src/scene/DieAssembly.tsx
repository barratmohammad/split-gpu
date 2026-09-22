import { dieParts } from '../data';
import { Part } from './Part';
import { PartGeometry } from './parts';

/** Level 2: the GH100 die floorplan. Content-only parts (the SM) are not rendered here. */
export function DieAssembly() {
  return (
    <group>
      {dieParts
        .filter((def) => def.geometry.kind !== 'virtual')
        .map((def) => (
          <Part key={def.id} def={def}>
            <PartGeometry def={def} />
          </Part>
        ))}
    </group>
  );
}
