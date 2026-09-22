# Hardware authority — H100 SXM 80 GB

## Current correction — exposed module, verified in browser

This section supersedes the historical updates below. The user rejected the appearance and requested a fix. The active module now opens assembled, based on the exposed NVIDIA SXM module photograph. Speculative cooler fins, screws, thermal layers and cover are excluded from the rendered inventory. There are 75 selectable module objects; the 66 board-component proxies are illustrative, not a verified BOM.

Astra rebuilt the PCB with rounded edges, mounting holes, copper rings and decorative circuit detail; component packages now have shaped bodies and terminations. Lighting, camera framing and the canvas/panel split were corrected; the opaque reflector rectangle was removed. Horizontal explosion preserves recognizable component groupings, with all fully exploded part bounds separated. Reset returns to the assembled view. The die remains an explicitly schematic architecture view with a separate logical SM/decoder inventory.

Validation: production build and all 15 tests pass. Safari visual inspection confirmed the assembled view, full horizontal explosion, reset and transition into the die view. Source fidelity is limited: no exact manufacturing CAD, exhaustive BOM or verified PCB routing was obtained. Do not claim 100% part-level accuracy. Claude: preserve this correction and read the current files before integration; earlier cooler reconstruction and fully exploded default notes below are obsolete.

Current visual implementation includes a labeled educational cooler reconstruction to address the repeated request for individual detail. `src/data/coolingDetail.ts` defines schematic fins, fasteners and thermal/mechanical layers. These are NOT validated by the official references and are explicitly marked unverified in the UI. The die's 132-SM/14-decoder inventory uses documented enabled counts but abstract positions. The earlier requirement of a 100%-verified exhaustive physical parts inventory is still not established; distinguish this from improved visual granularity.

Latest interaction requirement: individually explode all modeled components horizontally. Astra implemented this in `src/data/detailLayout.ts`; do not restore grouped memory/power objects or upward-only offsets. This presentation change does not upgrade illustrative proxies into verified physical parts. Cooler internals still require evidence before subdividing them.

Status: user-approved target. Supersedes the original mixed H100/B200 brief and v1 generated images. Astra owns reference artwork and this accuracy handoff; Claude owns application architecture and integration. Application data has been inspected but is not modified by this handoff.

## Source-backed baseline

### Active source policy — official documents replace generated geometry references

The user explicitly instructed us to use the engineering/service documents. Open `output/imagegen/engineering-references.html` for original manufacturer artwork, retained without AI regeneration. All generated v1/v2 images now serve only as style references, not geometry authority.

The [Lenovo H100/H200 service procedure](https://pubs.lenovo.com/sr685a-v3/remove_an_h100_gpu) was inspected, including its original figures 1 and 5 (saved under `output/imagegen/references/lenovo-h100-cover.png` and `lenovo-h100-assembly.png`). It documents a detachable plastic cover and the GPU/heatsink as a single removable assembly. Its baseboard context is not part of a lone GPU module. The Dell transcript corroborates this separation. Dell browser inspection was unavailable and direct asset download returned HTTP 403; do not claim the interactive walkthrough was viewed.

Implementation decision for Claude: replace the generic cooler layers with one documented GPU/heatsink assembly and its removable plastic cover for service separation. Keep NVIDIA's exposed-module reference as a separate educational view; do not imply the service guide authorizes a cooler teardown. Do not combine Lenovo chassis hardware with Dell chassis geometry. Neutral rendering of source line-art is a style choice, not verification of material or finish. Actual source figures take precedence over generated silhouettes.

Source A: [NVIDIA Hopper architecture](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/), architecture section and figures 1, 3 and 4.

| Field | H100 SXM 80 GB |
| --- | --- |
| Silicon | GH100; 80 billion transistors; 814 mm² |
| Enabled compute | 8 GPCs, 66 TPCs, 132 SMs |
| Memory | 80 GB HBM3; 5 active stacks; ten 512-bit controllers |
| L2 | 50 MB |
| Interconnect | NVLink 4; PCIe Gen5 |
| SM compute | 128 FP32 CUDA cores; 4 Tensor Cores per SM |

Full GH100 design counts (144 SMs, 60 MB L2, six-stack support) are not enabled-product counts. NVIDIA's module picture shows six surrounding package positions; do not infer six active memory stacks or identify the inactive position without evidence. H100 has no NVENC encoder. No sourced basis for the invented DISPLAY block.

Source B: [NVIDIA H100 product specifications](https://www.nvidia.com/en-us/data-center/h100/), SXM column: 3.35 TB/s memory bandwidth, 900 GB/s NVLink, 128 GB/s PCIe Gen5, up to 700 W configurable TDP, seven NVDEC and seven JPEG decoders. Bandwidth direction and configuration must be stated where relevant.

## Representation rules

- Use source A's actual module image for board/package silhouette and visible component placement. The dark board in that image supersedes the original demand for classic green solder mask.
- No invented exposed gold edge contacts, branded silver shroud, vapor chamber, exact cooling assembly, backplate material or component part numbers. Exclude these until a specific physical assembly is documented.
- Internal blocks belong to one silicon die; no GPC lids or individually packaged SM chips. Any separation is expressly a schematic visualization.
- Source A figure 3 is a full-design block diagram, not a measured floorplan or a map of enabled SMs. Do not invent which twelve SMs are disabled.
- Accuracy takes priority over retaining ten layers, equal SM counts per GPC, symmetry or the old screenshots. A schematic label does not excuse incorrect names or counts.
- No claim of a complete bill of materials, exact physical dimensions or 100% verified teardown: public references inspected do not establish those details.

## Required app-data corrections for Claude

Review `src/data/moduleParts.ts` and `src/data/dieParts.ts` before treating them as factual content:

- Remove unsupported physical/material/voltage claims in backplate, support chips, cooler and shroud entries; the precise supplier assembly is unknown.
- Replace the admitted fictional SXM edge-row depiction with documented connector geometry, or omit connector detail until sourced.
- Distinguish six pictured package positions from five active HBM stacks; do not guess the inactive location or eight-layer stack construction.
- Correct controller wording: ten active 512-bit controllers; 1024 bits describes one HBM stack's aggregate interface, not each controller.
- Label 18 SMs/GPC as full-design capacity, not enabled count for every GPC. Do not present 144 visible SMs as 132 enabled units.
- Remove claims that every large die necessarily has defects, that cached data is never evicted, and that every cudaMemcpy crosses PCIe. These are overgeneralizations.
- Review cluster limits, warp execution/divergence, shared-memory configuration and TMA descriptions against CUDA documentation before publishing those explanations.
- Keep the separate NVDEC and JPEG decoder categories; remove NVENC/display from geometry and labels.

## Reference assets

- `output/imagegen/references/nvidia-h100-sxm5.jpg`: NVIDIA source A figure 1, downloaded for reference; NVIDIA artwork, not generated work.
- `output/imagegen/references/nvidia-gh100-full-design.png`: NVIDIA source A figure 3, full 144-SM design; not the enabled 132-SM configuration.

Generated replacements must remain labeled schematic/reference-based. Their visual placement is reviewed against sources but is not manufacturing CAD.

## Additional engineering/service sources found

- [NVIDIA DGX H100/H200 service manual](https://docs.nvidia.com/dgx/dgxh100-service-manual/): system service procedures; inspected contents do not provide a complete SXM module teardown or manufacturing BOM.
- [NVIDIA DGX H100/H200 user guide](https://docs.nvidia.com/dgx/dgxh100-user-guide/): system mechanical specifications and GPU-tray overview; distinguish system dimensions from module dimensions.
- [Dell PowerEdge XE9680 H100 GPU/heatsink replacement guide with 3D experience](https://www.dell.com/support/resources/en-us/3dviewer/ic140xe9680001001g/how-to-replace-the-gpu-and-heatsink-module-h100-on-a-poweredge-xe9680): promising primary reference for a specific physical assembly. Its transcript identifies a removable NVIDIA plastic heatsink cover, mounting screws and GPU/heatsink assembly removal. It does not establish the original invented silver cover or vapor-chamber internals. The interactive 3D asset itself has not yet been inspected. This is a candidate for restoring a documented cooler assembly, not a declaration that all details are verified.

Engineering documents exist. The outstanding gap is a verified complete module-level BOM/CAD/assembly drawing, not an absence of NVIDIA technical documentation.
