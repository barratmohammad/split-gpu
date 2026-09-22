## September 22 — GPU studio redesign

Latest direction: Model X Studio-style dark inspection interface, adapted to the GPU. The previous silver presentation is replaced with compact numbered component navigation, a smaller tabbed inspector, individual-piece selection and isolation, camera toolbar, labels, fullscreen/help, and a bottom assembly dock. Explosion now opens the assembly through 65%, then spreads every modeled selectable part into a nonoverlapping viewing-plane inventory. The displayed count is model objects, not a manufacturer BOM. Existing detailed GPU geometry is retained. Dark studio lighting and a circular presentation plinth replace the bright floor.

Reference inspected: https://github.com/ashemag/model-x-studio . GPU UI and layout behavior implemented locally; no Tesla model assets imported. Production build and automated layout/state checks pass. Browser preview verification was blocked by the computer-use browser tool timing out.

# Split GPU — design handoff

## September 22 — realism within the existing silhouette

User explicitly chose realistic detail while preserving the existing concept shape, and requested a wider search for a complete GPU parts list. Research is recorded in `output/HARDWARE_RESEARCH.md`. Located TechInsights and Yole package-analysis reports and manufacturer service documentation; a full authenticated SXM board BOM was not obtained. Do not claim it cannot exist or that full paid reports were accessed.

Added four individually selectable mounting fasteners with recessed drives, washers and threads, based on the documented screw count/type but illustrative dimensions and positions. Memory packages now have chamfered bodies, substrate lips, orientation marks and contact detail. Reduced metal bump strength and enabled mipmap filtering to address the rippled/moire finish visible in the user's screenshot. Build and all 15 tests pass. Visual browser verification was not completed.

## September 22 — GPU-first composition

User requested a smaller, less prominent description box. The side card is now 25vw capped at 360px (previously 35.2vw), with 24px padding, 26–28px titles and 13px description text. Reduced glass opacity, border and shadow. Only the first descriptive paragraph stays visible; stats, further explanation and component selection remain accessible under More details. Redundant generic subtitles are omitted. Camera horizontal fit increases from 56% to 66%, with the GPU shifted closer to center. Existing mobile layout remains stacked.

## September 22 — second visual pass and smaller, sleeker typography

The user rejected the block-like result and requested smaller description text and a sleeker finish. Mechanical plates now use a dedicated beveled, through-hole geometry instead of the electronic-component renderer (which incorrectly put dark pads on their faces). Added brushed metal texture, contrasting studio reflections, more PCB surface detail and cylindrical power components. Removed the rectangular contact-shadow plane and expanded the scene to the full viewport with a reflective floor. Camera framing reserves space for the panel.

Description text now scales from 14–17px; subtitles 16–21px. The panel uses lighter glass, smaller chips, thinner borders and more restrained controls. Other selected parts have smaller titles and their second explanatory paragraph under model notes to prevent the oversized overflowing card seen in the user's screenshot. The package substrate has its own copy.

Build and all 15 tests pass. Browser tooling remained unavailable/timeouts on this pass, so the current rendered appearance has not been visually verified. The procedural reconstruction is not a pixel-exact recreation of the reference image.

## September 22 — supplied concept restored as visual direction

The user explicitly requested the original silver, vertically exploded concept rather than the exposed-board screenshot. The current module uses `referenceAssembly.ts`: vertically stacked conceptual support, board, routing substrate, die/memory package, thermal interface, copper plate, fin array and brushed cover. The initial view selects the GPU die at 72% explosion. Module selection preserves overall framing. Die architecture behavior is retained.

The reference is a visual concept, not verified hardware construction; model notes make that distinction. UI typography, glass panel, lighting and camera were restyled. Historical instructions below for horizontal-only explosion and excluding conceptual coolers are superseded by this request. A pre-change source backup is in `output/backups/before-reference-restyle.tar.gz`.

Validation: production build and 15 tests pass, including vertical layer separation. Browser visual verification could not be completed: Chrome navigation/screenshot requests and native Safari inspection timed out. Do not claim pixel-level matching or completed UI verification.


## Current correction — exposed module, verified in browser

This section supersedes the historical updates below. The user rejected the appearance and requested a fix. The active module now opens assembled, based on the exposed NVIDIA SXM module photograph. Speculative cooler fins, screws, thermal layers and cover are excluded from the rendered inventory. There are 75 selectable module objects; the 66 board-component proxies are illustrative, not a verified BOM.

Astra rebuilt the PCB with rounded edges, mounting holes, copper rings and decorative circuit detail; component packages now have shaped bodies and terminations. Lighting, camera framing and the canvas/panel split were corrected; the opaque reflector rectangle was removed. Horizontal explosion preserves recognizable component groupings, with all fully exploded part bounds separated. Reset returns to the assembled view. The die remains an explicitly schematic architecture view with a separate logical SM/decoder inventory.

Validation: production build and all 15 tests pass. Safari visual inspection confirmed the assembled view, full horizontal explosion, reset and transition into the die view. Source fidelity is limited: no exact manufacturing CAD, exhaustive BOM or verified PCB routing was obtained. Do not claim 100% part-level accuracy. Claude: preserve this correction and read the current files before integration; earlier cooler reconstruction and fully exploded default notes below are obsolete.

## Current implementation — expanded individual detail

The user repeated the request to show every part. Astra replaced the plain cooler block with an explicitly labeled educational reconstruction: 40 individually pickable fins, four schematic fasteners, cooler base, thermal interface, interposer detail and support-plate detail. Fin count, internal construction, dimensions and material choices are NOT verified H100 facts; each such part says so in the panel. The overview and footer also identify the reconstruction. These additions do not establish compliance with the user's earlier demand for a completely verified parts inventory.

The die now includes a separate logical inventory of all 132 enabled SMs plus seven NVDEC and seven JPEG decoder tiles. Their inventory positions do not assert physical coordinates or a disabled-unit map. A component picker exposes every selectable item, including small pieces that are difficult to click. All pieces retain horizontal explosion behavior.

New source: `src/data/coolingDetail.ts`; related edits in detailLayout, part types/renderer, framing, floor height, info panel and tests. Build and 15 tests pass, including pairwise fully exploded layout separation and inventory counts. Browser visual QA remains uncompleted because no browser/native control was available. Do not claim an exhaustive verified bill of materials or screenshot-level fidelity to the original concepts.

## Latest user correction — horizontal individual explosion implemented

The user rejected the grouped assembly and requested every part individually separated horizontally. Astra has now edited app behavior under that explicit instruction. Preserve this change when integrating further work.

- `src/data/detailLayout.ts` expands the existing source-backed render definitions into 77 independently selectable module objects: 66 illustrative board-component proxies, six memory positions, board, package, die, heatsink and cover. It also separates the die's GPC regions, two L2 regions, both controller strips and representative SM.
- All explosion vectors have zero vertical displacement; X/Z positions spread the parts horizontally. Assembled positions are preserved. The initial and reset state is fully exploded so the detailed separation is apparent immediately.
- Camera framing now accounts for horizontal extent, panel space, slider changes and resize. Fog and shadow extent were adjusted for the wider layout.
- Build and all 14 tests pass, including pairwise horizontal non-overlap at full explosion. UI screenshot verification was unavailable because computer/browser control failed earlier in this session; do not claim a visual comparison was completed.
- This separates every modeled object, not a verified complete bill of materials. Board-component quantities remain illustrative; no cooler internals were invented. The unexplained plain cooler remains a limitation for matching the original concept, pending further documented geometry.

Files changed also include the part type and region renderer, geometry dispatcher, framing, module/die exports, store defaults, info copy and data tests. Claude: reread these before editing to avoid restoring grouped or upward-only movement.

## Active instruction — hardware accuracy takes priority

LATEST: user instructed us to use official engineering documents instead. The active geometry reference is now `output/imagegen/engineering-references.html`, containing untouched NVIDIA and Lenovo source figures. All generated images below are style references only. Read the active source policy in HARDWARE_SPEC.md: plastic cover plus GPU/heatsink assembly is the documented service separation; the invented ten-layer cooler is superseded. Astra inspected the original drawings, saved them and assembled the reference page. Claude still owns app integration. Current app code was observed changing during this work, so Astra has not overwritten it.

Revised assets are ready: `output/imagegen/h100-sxm-module-v2.png` and `output/imagegen/h100-sxm-architecture-v2.png`. Generation prompts: `output/imagegen/prompts-v2.md`. Both were visually reviewed for readable labels, eight GPC regions, correct SM chips in the panel, removal of NVENC/DISPLAY and fictional GPC lids, and a distinction between active memory and visible package positions. Fine textures are decorative, not transistor/SM counts. The architecture image aggregates L2 visually; it is not a physical partition map. Module is shown assembled and exposed; undocumented cooling hardware is omitted. Native resolution remains 1672 × 941. App-data corrections listed in HARDWARE_SPEC.md remain Claude's integration task; not claimed complete here.

The user has now selected H100 SXM 80 GB and requires correct parts. Read [HARDWARE_SPEC.md](HARDWARE_SPEC.md) before further integration. It supersedes conflicting details below and the original image prompts. Original generated images are deprecated as hardware references. Revised artwork will remove undocumented cooling hardware and fictional separable die components. Claude: the hardware spec includes corrections needed in the current application data; Astra is updating artwork and reference documentation without overwriting your active app files.

## Collaboration

The user assigns ChatGPT Astra visual design and aesthetics, and Claude architecture and implementation logic. Read the other contributor's current notes and affected files before changes. This document records Astra's design direction; it does not assert agreement from Claude. Link Claude's architecture notes here when available.

Before overlapping implementation edits, establish file ownership in shared notes. Astra should adapt visuals to the agreed component and state interfaces rather than independently replacing them. Architectural or content-accuracy corrections should be reflected in the visual specification.

## Existing visual references

### Accuracy audit — corrections required before using images as hardware references

The user requested an accuracy check. The images are NOT verified parts diagrams. NVIDIA's [Hopper architecture description](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/) confirms H100 SXM: 8 GPCs, 132 enabled SMs, 50 MB L2, and 5 active HBM3 stacks; the full GH100 design supports 6 stacks and 144 SMs. H100 has no NVENC encoder. Remove the unsupported DISPLAY block pending specific documentation. Keep NVDEC; NVIDIA's [H100 specifications](https://www.nvidia.com/en-us/data-center/h100/) list NVDEC and JPEG decoders.

The illustrated GPC lids and removable SM chips are visual metaphors, not mechanical parts. Cooling stack, connectors, exact floorplan and package details have not been validated against a specific physical module. Do not treat the ten illustrated layers as a verified bill of materials.

Do not label this same geometry B200: NVIDIA documents its [Blackwell datacenter GPU](https://www.nvidia.com/en-us/data-center/technologies/blackwell-architecture/) as a two-die design. Recommended baseline for correction is H100 SXM 80 GB. These findings supersede hardware details in the image prompts; the images remain unchanged pending revision.

- `output/imagegen/split-gpu-module.png`: physical module concept.
- `output/imagegen/split-gpu-die.png`: conceptual die interior.
- `output/imagegen/prompts.md`: generation prompts and correction history.

Both images are 1672 × 941. They are visual references, not verified hardware diagrams. Do not derive hardware specifications or literal die topology from generated imagery. Claude should validate educational content before app integration.

## Visual direction

- Bright silver/chrome background, subtle brushed texture, soft floor reflection and studio shadows.
- Real material colors: dark green PCB, gold contacts, copper cold plate, silver fins and shroud, dark components, iridescent blue-purple die.
- Green limited to a small shroud accent and a fine white-green selection outline.
- Desktop layout target: approximately 70% scene and 30% information panel; preserve generous whitespace and readable type.
- Right panel: frosted white glass, thin pale border, rounded corners, charcoal text; component caption, title, subtitle, two short explanations, three compact chips.
- Small spaced-cap SPLIT GPU wordmark at top left; Reset view at top right.
- Bottom slider with ASSEMBLED and EXPLODED labels, white knob and breadcrumb above; reference state around 60% exploded.

## Visual acceptance for the eventual app

- Fit the full exploded object above controls without clipping; maintain distinguishable layers and avoid panel overlap.
- Selected component is identifiable through outline, leader label and matching panel content.
- Camera focus and explode motion are gentle and maintain orientation.
- Module and die views share interface placement, lighting and material treatment.
- Verify final layout in the actual running app at desktop size; compare with these references while prioritizing usable controls and accurate educational content.

## Current status

The two concept images are complete. The user confirmed that Claude shares work in this folder. Astra has read the scaffold configuration plus `src/data/types.ts` and `src/data/materials.ts`; application files remain untouched by Astra.

The current `PartDef` contract already supports panel copy, three stats, material/geometry definitions, explosion vectors and drill-down. Visual work should consume that contract. The material palette is consistent with the reference direction. When assigning the top cover material, use brushed silver/aluminum; reserve `darkShroud` for appropriate dark parts rather than the visible silver top cover specified by the user.

Explicit architecture notes and file ownership have not yet appeared. Until ownership is recorded, Astra's changes are confined to this handoff and visual reference assets to avoid collisions with active implementation.
