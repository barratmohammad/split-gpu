# H100 SXM 80 GB — revised image prompts

Built-in image generator used. Native returned resolution: 1672 × 941 each. These supersede v1 concepts. Corrected labels and component categories do not constitute exact physical CAD verification. See `../../HARDWARE_SPEC.md` for source references and limits.

## Module

Use case: ui-mockup.
Create corrected SPLIT GPU reference-based concept frame, 16:9 landscape target 2048x1152. Image 1 is NVIDIA's actual H100 SXM5 module and is the hardware visual authority. Image 2 is the old UI concept and is ONLY a reference for typography, silver lighting, glass panel and controls; do NOT copy its invented hardware.
Hardware target exclusively NVIDIA H100 SXM 80 GB. Left approximately 65-70% shows the exposed module, no cooler. Closely follow image 1: wide rectangular very dark PCB, mounting holes, densely populated power circuitry on both flanks, central rectangular package with a large blue-purple iridescent rectangular GPU silicon face and six small dark package positions arranged three above and three below it (in board local coordinates, as in image 1). Preserve the actual reference's board outline and component group positions. Six visible positions does NOT mean six active stacks; do NOT mark any particular position inactive. No gold PCIe-style edge fingers. No invented standalone NVLink connectors. No silver cover, cooler, vapor chamber, fins, thermal pad, separate power board, or backplate. Show board intact, lifted slightly above a faint reflective silver floor, at elevated three-quarter angle so components visible, large enough for hero impact. Small subtle white-green outline around die with leader "GPU Die — GH100".
UI preserve bright silver brushed background, soft realistic studio light, restrained premium interface. Top left SPLIT GPU; top right Reset view. Right frosted white panel exact text:
"H100 SXM · 80 GB"
"GPU Die"
"The silicon that does the computing"
"GH100 contains the compute, cache and interfaces that power H100. This SXM configuration enables 132 streaming multiprocessors and 50 MB of L2 cache."
"The module provides 80 GB of HBM3 through five active stacks. Six package positions are visible in NVIDIA’s module reference."
Three chips: "80 billion / transistors", "132 / enabled SMs", "50 MB / L2 cache". Use slash here as line break instruction, do not print slash.
Small clearly readable footer under panel: "Based on NVIDIA’s module reference · Geometry not to scale"
Bottom breadcrumb MODULE › DIE. Bottom slider at ASSEMBLED end (knob at 0), other end EXPLODED. Small caption above slider "Module overview". This frame intentionally shows assembled exposed board because unsupported cooler parts were removed for accuracy. No claim of exact CAD or a complete parts inventory. Do not include old COMPONENT 6 OF 10 caption. Dark charcoal text, green only selection accent. Clean readable exact wording.

## Architecture

Use case: ui-mockup. Create corrected SPLIT GPU second concept frame, landscape 16:9 target 2048x1152.
Image 1 is the corrected module UI: use its silver background, exact UI locations, right frosted panel, text style, lighting and footer placement. Image 2 is NVIDIA full GH100 block diagram: architecture reference ONLY, it depicts full 144-SM design, NOT enabled H100 counts. Hardware target H100 SXM 80 GB, 132 enabled SMs.
Left scene: a single thin rectangular silicon slab at a high three-quarter angle, with a crisp readable architectural schematic etched into its top face. NOT a board: no discrete chips, sockets, raised GPC lids, SM packages, mechanical exploded layers or green PCB. Architectural regions delineated by thin engraved boundaries and restrained metallic blue-purple shades, all on the SAME silicon surface.
Use relative arrangement from diagram reference, with EXACTLY eight GPC regions in TWO rows of FOUR (GPC 1 through GPC 4 top; GPC 5 through GPC 8 bottom). Between the rows, a horizontal L2 band visibly divided into two adjacent regions with collective label "L2 cache · 50 MB". Top edge narrow "PCIe Gen5" band and just below a narrow "GigaThread engine" band. Bottom edge "NVLink 4" band. Left and right edges thin "HBM controllers" bands. In a small separate schematic callout below left scene (not claiming a die coordinate) text "Also on die: NVDEC · JPEG decoders". Do not invent NVENC or DISPLAY. Do not draw individual SM counts across all GPC regions, instead subtle fine abstract line textures; avoid suggesting 144 enabled units. Highlight a small representative interior region of front-right GPC using a fine white-green outline and a leader labeled "SM · schematic detail". No raised physical chip. Add clear scene caption "Architecture schematic · Positions and sizes simplified". This is an educational functional map, not exact die floorplan.
Right panel exact text:
"H100 SXM · 80 GB"
"Streaming Multiprocessor (SM)"
"Where parallel threads run"
"An SM runs groups of threads and contains CUDA cores, Tensor Cores, registers and local memory. H100 SXM enables 132 SMs across eight GPCs."
"These are regions of one silicon die, not separate chips. The diagram simplifies their arrangement without assigning disabled SM locations."
Three chips, slash denotes line break not literal slash:
"128 / FP32 cores per SM"
"4 / Tensor Cores per SM"
"132 / enabled SMs total"
Panel footer "Source: NVIDIA Hopper architecture"
Top left SPLIT GPU, top right Reset view, bottom breadcrumb MODULE › DIE. Replace slider endpoint labels in this schematic frame with OVERVIEW and DETAIL; knob 60%. Above breadcrumb small "Inside the die". Same silver premium product UI as reference, dark charcoal typography. All exact text clear and legible. No decorative fake hardware, no additional unsupported numeric claims.
