# NT World Ink — networking simulation quality audit

14 September 2026 · Audit and improvement plan

**Verdict: keep the collection and its teaching scope, but substantially improve the simulation behaviour before investing in a visual overhaul.** All nine tools have worthwhile purposes. Several currently reward an incorrect configuration or display results that do not follow from the learner’s actions. More attractive graphics would make those errors more convincing.

The strongest opportunity is to make every activity follow a visible learning cycle: **predict → act → observe → explain → try a changed problem**. The learner should see both what changed and why it mattered.

## Scope and evidence

I reviewed the nine tools in the live [Networking catalogue](https://ntworldink.com/simulations/#networking), inspected their local HTML/CSS/JavaScript, exercised representative interactions and deliberately incorrect inputs, and measured layouts at 1280 × 800 and 390 × 844. I also examined Network Architect in IT & Cyber as a comparison for learning design.

Local source: `/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/`, repository revision `c614676`. The working tree was clean at the start of the audit. Website files were not edited or published.

This is a practical product and learning audit, not a complete protocol-conformance, curriculum-mapping, accessibility certification or cross-browser test. Physical touch devices, screen-reader announcements, every quiz branch, and classroom learning outcomes remain to be tested. Findings below distinguish live reproductions from source inspection and design recommendations. Network Architect received a comparison review, not the same full scope as the nine networking tools. Firewall Gatekeeper and the remaining simulation categories are outside this first audit.

## Decisions by tool

| Tool | What is worth keeping | Verdict and main improvement | Relative redevelopment size |
|---|---|---|---|
| 01 Device Explorer | Equipment exploration, selectable views and port explanations | Correct the named hardware and redraw it accurately; add practical identification tasks | Medium |
| 02 CLI Navigator | Low-pressure introduction to command modes, history and command suggestions | Rebuild configuration state and verification; use the same command model as the other labs | Large |
| 03 Cable & Connector Identifier | Cable/connector organisation, A/B pin sequences and illustrated cutaways | Refine technical content and recognition artwork; add termination and cable-test activities | Medium |
| 04 IP Calculator | IPv4 binary display, calculator, VLSM and practice structure | Repair validation and arithmetic boundaries; explain the calculation and let learners predict results | Medium |
| 05 LAN Builder | Direct manipulation and the open network canvas | Rebuild the connectivity model; make this the pilot for the improved suite | Large |
| 06 Wireless Config | Familiar router administration layout and settings coverage | Correct security grading, connect all controls to state and show effects on clients | Medium–large |
| 07 Switch Config | Switch faceplate, VLAN colouring, console and scenario range | Replace command-prefix completion with checks of actual configuration and forwarding | Large |
| 08 Router Config | Broad lab progression and some existing state-based checks | Strengthen checks and derive routes, neighbours, NAT and packet outcomes from state | Large |
| 09 Troubleshooter | Support tickets, diagnostic tools and scenario progression | Redesign evidence gathering, scoring and repair verification; make it the capstone | Large |

These sizes describe relative complexity, not time estimates. Shared components should reduce repeated work across tools 02, 05, 07, 08 and 09.

## Highest-priority findings

### 1. LAN Builder reports successful ping across incompatible subnets

**Live reproduction:** placed two PCs, connected them directly, left PC1 at `192.168.1.11/24`, and changed PC2 to `10.0.0.2/24`. With no router or configured gateway, Test Ping returned a successful reply.

**Cause:** `testPing()` calls a graph traversal that only checks whether a sequence of drawn connections exists. It does not consult IP addresses, masks or device forwarding roles. An ordinary PC can consequently act as an intermediate forwarding node in the graph.

**Learning impact:** a learner can conclude that a drawn cable path is sufficient for IP communication and that subnet settings do not matter.

**Improve:** model interfaces, compatible media, link state, host IP/mask/default gateway, switch forwarding and router next hops. Begin with a deliberately limited, reliable model. Animate ARP and ICMP one step at a time, show the packet fields that matter, and identify the actual failure point. Add selectable source/destination, undo, save/load, starter networks and guided faults.

**Graphics:** replace the briefcase used for a laptop and platform-dependent emoji with a consistent SVG equipment set. Show actual ports and label links. Use colour plus symbols and text for state. Provide tap-to-add and connect-from/to controls alongside dragging.

Evidence: [LAN Builder source](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/05-lan-builder.html:686).

### 2. Switch lab gives full marks for the wrong configuration

**Live reproduction:** in Basic VLAN Configuration, entered `name Wrong`, selected `interface Fa0/2`, and assigned `switchport access vlan 20`. The task required VLAN 10 named Sales on Fa0/1. After verification, the lab displayed **8/8 tasks** and congratulated the learner, while its own VLAN table showed the incorrect configuration.

**Cause:** task completion matches command prefixes such as `name`, `interface` and `switchport access vlan`. Completion is then retained rather than recalculated from the required final configuration.

**Improve:** evaluate the correct VLAN, name, interface, port mode and membership. Revoke completion when a later command invalidates the result. Distinguish “command practised” from “working configuration achieved”. Include valid command abbreviations and reject ambiguous or invalid arguments consistently.

**Graphics:** retain the faceplate concept, but connect port LEDs, VLAN overlays and the MAC table to the same state. Let learners send a frame, watch MAC learning, compare access and trunk traffic, and see a blocked STP path or a port-security violation.

Evidence: [completion logic](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/07-switch-config.html:1902), [task definitions](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/07-switch-config.html:1130).

### 3. Wireless Config praises an open network

**Live reproduction:** changed the default security mode to “None (Open Network)”. The tool displayed **B — Excellent Security Configuration**, alongside its warning that the network was completely open.

**Cause:** password-complexity points remain in the score even when the password is irrelevant to the selected mode. The headline rating is not constrained by critical security properties.

**Source inspection:** several displayed controls, including MAC filtering, client isolation and the 5 GHz channel, are not connected to the configuration model through change handlers. Apply Security reports success without validating a mode-appropriate configuration. Tutorial completion is based on advancing pages rather than demonstrated settings.

**Improve:** assess each selected security mode with appropriate requirements. Open/WEP configurations must not receive an excellent protected-network verdict. Explain compatibility trade-offs and distinguish personal from enterprise authentication. Use pending/applied settings consistently, then show simulated clients reconnecting or failing for a specific reason.

**Graphics:** add a simple floor plan with APs and clients, selectable interference sources, a channel-overlap view and client signal/connection status. Present RF outcomes as an explicitly simplified model. Add an Australian regulatory-domain profile verified against current authoritative requirements during implementation.

Evidence: [rating logic](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/06-wireless-config.html:1603), [event handlers](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/06-wireless-config.html:1453).

### 4. CLI Navigator acknowledges changes that its verification commands cannot show

**Live reproduction:** configured G0/0 as `192.168.1.1 255.255.255.0` and issued `no shutdown`. The tool acknowledged both actions. After leaving configuration mode, `show ip interface brief` still reported unassigned/administratively down; `show running-config` still showed `no ip address` and `shutdown`.

The task itself instructs `copy run start`, but that abbreviation was rejected. `end` was also rejected in interface mode, although the help encourages it as a way out of configuration.

**Source inspection:** interface configuration mainly prints acknowledgements; the show-command outputs are largely fixed strings. Ping prints a success pattern regardless of the target. Save commands report success without modelling a separate startup configuration.

**Improve:** establish real running/startup configuration objects within the simulator. Render show commands from them and demonstrate what survives a reload. Add a persistent mode breadcrumb, command-token help and an explanation of the effect of each command. Keep guided command insertion optional, with a later challenge that removes it.

**Accessibility:** Shift+Tab remained in the command input during the live check. The key handler intercepts Tab for completion without handling Shift+Tab separately. Provide a keyboard route out of the console and a clearly documented completion shortcut.

Evidence: [fixed output and command processing](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/02-cli-navigator.html:463), [keyboard handler](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/02-cli-navigator.html:654).

### 5. Router lab accepts wrong masks and invents established OSPF neighbours

**Live reproduction:** configured `192.168.1.1 255.0.0.0`. The task requiring `192.168.1.1/24` was marked complete. Enabled an OSPF process without enabling an interface or configuring its OSPF network; `show ip ospf neighbor` nevertheless displayed two FULL neighbours. The interface summary simultaneously showed all interfaces administratively down.

**Cause:** some task checks compare only the IP, network or existence of an entry. The neighbour display is a fixed example gated only by whether OSPF is enabled. NAT translations are similarly canned once a NAT pool entry exists.

**Improve:** check masks, wildcard masks, ACL action/order/direction, NAT bindings and relevant interface state. Separate configured routes from installed routes. Derive OSPF adjacency from the simplified topology and compatible interface settings. Generate NAT entries only from simulated traffic. These are state-dependent behaviours in real equipment; see [Cisco’s OSPF troubleshooting guidance](https://www.cisco.com/c/en/us/support/docs/ip/open-shortest-path-first-ospf/13699-29.html).

**Graphics:** show both ends of each link and their interface addresses. Allow learners to step through next-hop selection, TTL changes, ACL decisions and inside/outside address translation. Keep the topology and CLI visible together on laptops.

Evidence: [lab checks](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/08-router-config.html:954), [neighbour output](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/08-router-config.html:1755).

### 6. IP Calculator needs a correctness and legibility pass

**Live reproductions:**

- Entered CIDR `0`; the input retained 0 while the results calculated `/24`.
- Entered IPv6 `gggg::1`; the tool produced `gggg::/64` instead of rejecting it.
- Set base network `10.0.0.1/24`, requested 50 hosts, and received “Network: 10.0.0.1/26” and broadcast `10.0.0.64`. The base should be rejected or normalised to its actual network boundary before allocation.

**Source inspection:** `/31` and `/32` are blanket-labelled as having no usable host range. The tool should explain point-to-point `/31` addressing and `/32` host routes rather than applying ordinary LAN arithmetic to every prefix. [RFC 3021](https://www.rfc-editor.org/rfc/rfc3021.html) specifies the `/31` case. IPv6 parsing needs hexadecimal, group-count, compression and prefix checks consistent with [RFC 4291](https://www.rfc-editor.org/rfc/rfc4291.html).

**Improve:** one tested address engine, strict input parsing before conversion, non-contiguous-mask rejection, aligned VLSM allocations, capacity checking and explicit treatment of special prefixes. Clear or mark old results when new input is invalid. Present historical address classes as historical context, with CIDR as the working model.

**Graphics:** its panel headings are almost invisible: the live computed heading colour was `rgb(15, 23, 42)` on a dark panel. Replace that colour, enlarge key results, and animate the AND operation and changing network/host boundary. Let the learner predict network and broadcast before revealing them. At phone width, group bits into readable octets rather than forcing the learner to track an 815 px binary row through a 298 px viewport.

Evidence: [IPv4 calculation](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/04-ip-calculator.html:1084), [VLSM](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/04-ip-calculator.html:1376), [IPv6 parsing](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/04-ip-calculator.html:1745).

## Equipment, cable and troubleshooting improvements

### 7. Device Explorer: make recognition transfer to real equipment

The exploration concept is useful, but the Cisco 2911 drawing puts the console and Ethernet ports on the view labelled Front Panel and the power socket on the view labelled Rear Panel. Cisco’s hardware guide places the power connector/switch on the front and console/Ethernet on the back. The simplified chassis also omits significant identifying detail. Because the tool names an exact model, its drawing should match that model. [Cisco 2911 hardware guide](https://www.cisco.com/c/en/us/td/docs/routers/access/2900/hardware/installation/guide/Hardware_Installation_Guide/Overview.html).

The power explanation says to use `reload` before unplugging. That is misleading: reload restarts the software; it is not a power-off procedure. Replace this with model-appropriate save and shutdown guidance. [Cisco reload reference](https://www.cisco.com/E-Learning/bulk/public/tac/cim/cib/using_cisco_ios_software/cmdrefs/reload.htm).

Use reference-checked vector drawings or authorised photographs with accurate hotspots, zoom and orientation. Add a “find the console”, “choose the correct cable” and “identify the link fault” sequence. Hide labels during recognition challenges, then explain the distinguishing feature after the answer. Model the boot/link/activity LEDs consistently; the current power-on routine lights them randomly.

The five-question quiz auto-advances after two seconds and supplies generic feedback. Replace the timer with Continue, explain each misconception, and finish with a targeted retry of missed concepts. Label legacy equipment appropriately while retaining it where it matches the teaching lab.

Evidence: [device explanations](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/01-device-explorer.html:952), [power and quiz logic](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/01-device-explorer.html:1007).

### 8. Cable Identifier: extend the reference gallery into a practical activity

The cutaways and correct A/B colour sequences provide a useful base. However, coloured cable jackets and labels do much of the identification work. The drawings need closer correspondence to real connectors, latches, ferrules, dimensions and jacket markings.

The RJ-11 artwork says 6P4C, its accessible label says four contacts, and the adjacent description says six pins. Clarify housing positions versus populated contacts and the relevant connector variant. The generic coax card combines an F-type/RG-6 illustration with 10 Mbps/500 m specifications from a different historical application. Generic fibre speed/distance claims also need a named fibre/transceiver/application context. Avoid teaching a single speed as an intrinsic property of “coax” or “fibre”.

The crossover guidance needs a legacy/manual-MDI context and an Auto-MDIX explanation. [Cisco’s Auto-MDIX documentation](https://www.cisco.com/c/en/us/td/docs/switches/lan/catalyst_digital_building_series_switches/software/15-2_6_e/configuration_guide/b_1526e_consolidated_cdb_cg/m_int_automdix_cg.html) explains why supported interfaces can use either cable type.

The pinout labels visibly extend beyond their narrow coloured backgrounds, leaving dark text over a dark panel. Replace the small swatches with an oriented plug view: latch position, pin 1, pair grouping and striped conductors. Add arrange-the-conductors interaction, a cable tester, and open/short/reversed/split-pair faults. A correct-looking sequence should not hide an incorrectly paired cable. Provide keyboard and tap alternatives to moving wires.

Use unlabeled close-ups, different orientations and plausible distractors for recognition. The eight-question quiz currently selects randomly with replacement; build balanced coverage, explanations and a missed-concept review.

Evidence: [cable and connector data](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/03-cable-identifier.html:570), [quiz selection](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/03-cable-identifier.html:764).

### 9. Troubleshooter: teach diagnosis from evidence

The ticket format and six scenarios are a strong foundation. The current experience, however, behaves mostly as a diagnostic-output menu followed by a multiple-choice solution.

**Live observations:** the first scenario’s ipconfig output literally marks the gateway “INCORRECT!”, giving away the diagnosis. Repeating the same ipconfig test increased the score from 5 to 10 without gathering new evidence. A five-minute timer starts as soon as the scenario loads.

**Source inspection:** each applicable diagnostic use adds points; solution availability depends on two distinct tools being selected rather than adequate relevant evidence. Choosing the right answer sets a solved flag but does not change the underlying network and rerun the failed test. Tool success/failure also paints whole OSI layers, which overstates what an individual observation establishes.

**Improve:** separate guided practice from an optional timed challenge. Require a hypothesis, relevant observations, an actual repair and a successful verification. Score evidence interpretation and justified decisions; record repeated tests without rewarding point farming. Make hints optional, staged and specific. Allow a defensible escalation with a short handover record.

**Graphics:** replace letter blocks with a readable topology shared with LAN Builder. Show uncertain, observed-failed and verified-working states separately. In challenge mode, do not reveal the faulty device or answer before investigation. End with an evidence timeline explaining the cause, repair and result.

Evidence: [diagnostic/scoring logic](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/09-network-troubleshooter.html:1623), [solution handling](/Users/sallydavis/Desktop/Websites/ntworldink-LIVE/NTelligencya.github.io/simulations/networking/09-network-troubleshooter.html:1704).

## Graphics, accessibility and consistency across the suite

The collection mixes orange/grey, purple terminal, blue admin and red router interfaces. Individual tools often look presentable, but learners repeatedly relearn the controls. Establish a shared NT World Ink learning interface: consistent navigation, readable type, task placement, feedback, help and progress. Keep the site's dark/teal identity, with distinct success/warning/error cues that also have text or symbols.

Graphics should show the concept being learnt. Equipment identification needs recognisable equipment; packet behaviour needs a clean logical diagram. Use separate physical and logical views where both matter. Avoid decorative motion that competes with the relevant change. Add pause, single-step, speed and replay for meaningful animation.

Several interactive regions are plain divs: device hotspots, cable cards, wireless navigation, lab selectors and diagnostic controls. Source inspection found no `aria-live` regions or reduced-motion media queries in the nine networking HTML files. The calculator’s visible IPv4 fields and slider had no associated labels or `aria-label`. These are concrete reasons to perform a full accessibility pass, rather than assuming a dark theme is accessible.

Adopt the relevant [WCAG 2.2 criteria](https://www.w3.org/TR/WCAG22/) for keyboard access, labels, contrast, focus, reflow, timing and non-drag alternatives. Formal conformance requires additional testing. CLI autocomplete must not trap focus; result messages must be available without relying on colour or a brief toast.

### Measured layout results

| Tool | Document width at 390 px viewport | Document width at 1280 px viewport | Interpretation |
|---|---:|---:|---|
| Device Explorer | 390 | 1280 | No page overflow in inspected initial state; hotspots still need accessibility work |
| CLI Navigator | 406 | 1280 | Phone overflow |
| Cable Identifier | 390 | 1280 | No page overflow; pinout label overflow exists inside panels |
| IP Calculator | 390 | 1280 | No page overflow; binary row requires substantial internal horizontal scrolling on phone |
| LAN Builder | 452 | 1280 | Phone canvas squeezed out between side panels; body overflow hidden |
| Wireless Config | 390 | 1280 | No page overflow in inspected initial state |
| Switch Config | 400 | 1280 | Phone overflow |
| Router Config | 547 | 1293 | Phone and desktop overflow |
| Troubleshooter | 439 | 1280 | Phone overflow |

These measurements are state-specific observations, not a claim that every panel was responsive. Test expanded panels, long outputs, zoom, keyboard focus and orientation after redesign. Phone reflow must preserve the learning activity; merely hiding overflow is not a fix.

## Network Architect: a useful pattern with qualifications

Its Workshop is closer to the desired standard. Moving the boundary changes the bit display, mask, subnet count and host count together. In a live test, choosing `/27` for a requirement of at least 50 hosts returned an explanation that it offers only 30, and directed the learner to give bits back to the host side. The Commission adds client briefs and growth requirements.

Reuse that connection between action, visible consequence and explanation. Do not copy its claims uncritically. The Flat Network uses invented health/broadcast formulas for dramatic effect; label them as illustrative, and make workload a controllable variable instead of suggesting a modest device count inevitably ruins a LAN. Its security text does mention policy enforcement at a router, which is useful, but the animation also clears the infected state when segmentation is clicked. A redesign should show VLAN/L2 boundaries, routed policy and the continuing compromised endpoint explicitly. Subnetting alone must not appear to cure infection. The mobile Workshop also needs a more usable binary-row presentation.

## Recommended implementation plan

### Phase 1 — repair misleading outcomes

Correct wireless grading, switch completion, CLI state/show/save behaviour, router masks/neighbours, LAN ping and calculator validation. Correct Device Explorer’s hardware orientation and reload wording. Build focused regression checks around the exact failures reproduced in this audit. This comes before extending the content or re-skinning the suite.

Completion criterion: the incorrect configurations documented above cannot produce successful or excellent results, and legitimate configurations continue to work.

### Phase 2 — build one complete LAN Builder pilot

Use LAN Builder to establish the shared visual language and learning interaction. Deliver a small reliable network: two PCs, a switch and an optional router; valid addressing; ARP and ping; clear failure reasons; guided and independent modes; save/reset/undo; keyboard and touch-friendly controls.

Pilot lesson: predict whether two PCs can communicate, connect them, run a stepped ping, change one subnet, observe the failure, then restore communication using the appropriate configuration. The explanation must point to the relevant packet and interface, not simply display a green or red banner.

Completion criterion: a learner can complete the activity without facilitator rescue, explain why each result occurred, and solve a variation with different addresses. Review both an equipment view and a logical view before extending the artwork set.

### Phase 3 — share the model across configuration labs

Extract a common address engine, command parser, network state, feedback components and lab evaluator. Keep content/scenarios separate from that logic. Reuse the model across CLI Navigator, Switch Config and Router Config so that commands, tables, LEDs and packet outcomes agree.

Keep the scope explicit and achievable: a reliable educational subset of device behaviour. Support the commands and protocols the lessons teach, with clear explanations for unsupported operations. Avoid promising full Cisco emulation.

Completion criterion: changing a setting updates every relevant view; invalid arguments are rejected consistently; undoing a required setting revokes its completion; changing a scenario starts from a defined state.

### Phase 4 — deepen the learning sequence

Build practical recognition/termination tasks for equipment and cables; give the calculator guided prediction and explanation; make wireless settings visibly affect clients; turn Troubleshooter into a repair-and-verify capstone.

Provide an explicit suggested route: equipment and media → basic addressing → a working LAN → CLI modes → switching and VLANs → routing → wireless → troubleshooting. Allow direct access for experienced learners. Add a stated objective, prerequisite, estimated activity duration, hint ladder and a transfer challenge to each tool.

Save progress and scenario state locally with a clear reset/export option. Treat this as practice evidence, not validated competency assessment. Keep current unit labels provisional until a separate curriculum review verifies them.

### Phase 5 — verify with users, then release deliberately

Run the acceptance checks below, then pilot with several learners of differing confidence and a trainer. Observe hesitation, incorrect mental models, ability to explain results and completion of a changed scenario. Revise from those observations. Publish only when separately authorised.

## Acceptance checks for the improved collection

- **Correctness:** known good and bad address/configuration cases have documented outcomes; all views reflect one state; false success cases in this report become regression tests.
- **Learning:** each activity has prediction, meaningful action, explainable consequences and an independent transfer task. Success requires the stated outcome, not a string of clicks.
- **Graphics:** exact-model artwork matches references; port and cable types are recognisable without relying on labels; diagrams remain legible at laptop and projected sizes.
- **Accessibility:** complete core tasks by keyboard; visible focus and no traps; named controls; announced results; non-drag alternatives; adequate contrast; controllable timing and motion.
- **Responsive behaviour:** verify 390, 768, 1280 and 1920 px, 200% zoom and orientation changes. Keep controls and explanations usable when diagrams need internal pan/zoom.
- **Robustness:** reset/retry and rapid scenario changes work; pending animations cannot write into the next scenario; saved progress survives reload; storage failure has a usable fallback.
- **Performance:** measure startup and interaction on a representative lower-powered device; animation remains responsive and pauses when hidden. Preserve a lightweight static deployment where practical.
- **Release:** review the updated tools locally, then verify live rendering and routes after an authorised deployment.

**Recommended first redevelopment: LAN Builder, following the immediate correctness repairs.** It has the clearest opportunity to become the visual foundation for the switching, routing and troubleshooting tools.
