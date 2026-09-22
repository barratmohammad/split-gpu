import { EffectComposer, Outline } from '@react-three/postprocessing';

/** Selection glow: a soft white-green outline around the hovered or selected part. */
export function Effects() {
  return (
    <EffectComposer multisampling={4} autoClear={false}>
      <Outline
        blur
        edgeStrength={6}
        pulseSpeed={0}
        width={1600}
        visibleEdgeColor={0xbfff6a}
        hiddenEdgeColor={0x5d8f1a}
        xRay={false}
      />
    </EffectComposer>
  );
}
