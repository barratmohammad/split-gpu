# Split GPU

An interactive, browser-based exploded view of the NVIDIA H100 SXM5 80 GB module, built for
software developers who are new to GPUs. Drag the slider to split the module apart, click any part
to read what it is and why it matters, and step inside the GPU die to see an architecture schematic.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
```

Other commands:

```bash
npm test           # vitest: explode math and data integrity
npm run typecheck  # tsc --noEmit
npm run build      # typecheck + production build into dist/
npm run preview    # serve the production build
```

## Current presentation

The default view follows the supplied silver exploded concept: a vertical assembly with the GPU die selected. Cooling and support layers are illustrative reconstructions, not verified manufacturing CAD. Use the slider to assemble the layers and the DIE breadcrumb to explore the architectural view. Reset restores the selected-die exploded composition.

## What is modeled

**Module level** (bottom to top): module board, power delivery components, GPU package, six HBM3
memory positions, the GH100 die, the GPU/heatsink assembly, and its plastic cover. Only parts visible
in NVIDIA's module photograph or documented in the Lenovo and Dell H100 service procedures are
modeled. Connector geometry on the underside is omitted because it is not documented in the sources
inspected.

**Die level**: an architecture schematic that follows the arrangement of NVIDIA's full-GH100 block
diagram: PCIe Gen5 and the GigaThread engine across the top, two rows of four GPCs with the L2 cache
between them, HBM controllers on both edges, NVLink 4 along the bottom. NVDEC and JPEG decoders are
listed without a position. The regions are parts of one die; the Detail slider lifts them only as a
schematic visualization. GPC 4 carries one representative SM tile.

All figures are the enabled H100 SXM5 product figures (132 SMs, 50 MB L2, 80 GB HBM3, 3.35 TB/s,
900 GB/s NVLink, 128 GB/s PCIe Gen5, up to 700 W). The source policy and its limits are in
`HARDWARE_SPEC.md`; the reference artwork is under `output/imagegen/`.

## Stack

Vite, React 19, TypeScript, Three.js via React Three Fiber, drei, postprocessing (selection
outline), zustand, vitest. All geometry is procedural; there are no model files.

```
src/data      part definitions, educational content, material colors
src/lib       pure explode math and camera framing helpers (unit tested)
src/store     zustand store: explode amount, level, selection, hover
src/scene     Canvas, environment, camera rig, effects, Part wrapper, geometry builders
src/ui        info panel, slider, breadcrumb, top bar, die notes
src/test      vitest suites
```

## Manual checklist

1. Page loads on a silver gradient with a soft reflective floor and no console errors.
2. Slider at 0 shows the assembled module; sliding to 1 lifts each layer in order with easing.
3. Hovering a part shows a pointer cursor and a green outline; clicking selects it, frames it left
   of the panel, shows a leader label, and fills the panel with title, subtitle, two paragraphs,
   three stat chips, and a source note.
4. Clicking empty space clears the selection. Reset view returns the camera and slider.
5. "Explore inside the die" (or double-clicking the die, or the DIE breadcrumb) zooms into the
   schematic; the slider relabels to Overview / Detail; the bottom-left callout opens the decoders.
6. Clicking a region selects it; clicking the small tile on GPC 4 selects the SM.
7. "Back to module" or the MODULE breadcrumb returns with the die reselected.
8. Below 900 px width the panel moves under the canvas and the slider stays usable.
