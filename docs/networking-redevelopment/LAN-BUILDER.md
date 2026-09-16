# LAN Builder pilot specification

Implemented September 2026. Route: `simulations/networking/05-lan-builder.html`.

## Learning activities

1. **Build a local network:** connect two pre-addressed PCs to different switch ports, predict ping, follow ARP and ICMP, explain why a gateway is unnecessary.
2. **Reach another subnet:** configure both host gateways on an already cabled routed topology. A correct outward gateway alone must still fail on the return path.
3. **Restore service:** trace a successful request followed by an unanswered ARP for the remote PC's incorrect gateway; repair it and verify both directions.
4. **Free build:** independent sandbox with a transfer task using 172.16.10.0/24 and 172.16.20.0/24, followed by a changed cable or mask.

Guided completion requires a successful test meeting the network objective plus the correct explanation. Previous completion is labelled separately from a fresh test after edits. This is formative practice, not a validated competency assessment.

## Architecture and source files

| File | Responsibility |
|---|---|
| `simulations/networking/05-lan-builder.html` | Semantic document, forms, activities, playback, tables and scope disclosure |
| `simulations/networking/lan-builder/engine.mjs` | Pure Ethernet/IPv4 model, validation, trace generation, scenarios and import normalisation |
| `simulations/networking/lan-builder/app.mjs` | Learner interaction, rendering, playback, persistence, undo/redo and completion |
| `simulations/networking/lan-builder/lan-builder.css` | Responsive layout, native equipment drawings' presentation, focus and reduced-motion styling |
| `tools/tests/lan-builder.test.mjs` | 34 meaningful model and regression tests, including the original false-positive ping |

The route is preserved. There are no new package dependencies, external fonts or remote runtime scripts. Serve through HTTP because the model and application are ES modules. HTML stylesheet/module links and the engine import carry an explicit asset version; update them together when releasing a new revision.

## Model contract

- Up to 16 devices: PCs, servers, printers, eight-port switches and three-interface routers. End devices have one Ethernet port; one cable per port.
- Strict dotted IPv4 input and contiguous subnet masks. This introductory LAN model deliberately accepts /1–/30 host assignments. It rejects network/broadcast addresses and unsupported loopback, multicast and automatic link-local addressing. /31 point-to-point and /32 host-route semantics belong in later/different tools.
- Hosts decide local versus remote using their own prefix. Remote traffic uses their configured on-link gateway. Syntactically valid wrong/missing gateways are allowed for diagnostic practice.
- ARP reaches only the connected Ethernet broadcast domain. Switches learn source MAC addresses on ingress; routers do not bridge ARP between their interfaces.
- Router interfaces must have non-overlapping networks. Forwarding uses enabled, directly connected prefixes; Ethernet addresses change at the router and IP endpoints remain unchanged. TTL decreases on routing.
- Ping succeeds only after both Echo Request and Echo Reply complete. Duplicate addressing and disabled links/interfaces prevent a false success.
- Every run starts with empty logical ARP/MAC tables. A complete deterministic trace is computed first; playback only displays it. Editing the network, endpoints or prediction invalidates the displayed test.
- Main network drawing, compact packet overview, packet fields, timeline and learned tables read the same trace. SVG packet motion is optional and not needed to interpret the textual events.

This is an educational model. Timing/retries are simplified, not a wire capture or operating-system ping implementation. It excludes DHCP, DNS, VLANs, spanning tree, static/dynamic routing protocols, NAT, firewalls and the Internet. Redundant switch loops are rejected because STP is not modelled. It must not be described as full Cisco emulation. Passing ping does not imply an application or DNS is working.

## Interaction and durability

- Optional drag positioning, arrow-key positioning and a device selector; labelled native forms for connections and addressing.
- Next/back/jump/play/pause controls, speed selection, and sticky playback controls. No automatic start or timed grading.
- System reduced-motion preference suppresses moving packet markers. A preference change or hidden document stops playback.
- Reversible reset, device removal, cable changes and configuration edits. Undo/redo retain up to 60 snapshots during the current page session.
- Auto-save under `ntwi-lan-builder-v1`, plus explicit save, JSON export/import and a tested copy/paste JSON fallback for browsers that do not download files. Undo history itself does not survive reload.
- Versioned import envelope (`ntwi-lan-builder`, version 1), whitelisted fields, size limits, unique identity/MAC validation, position bounds and network-schema checks. Invalid files do not replace current work.

## Technical references

Protocol intent was checked against the primary specifications: [RFC 826, ARP](https://www.rfc-editor.org/rfc/rfc826.html), [RFC 792, ICMP](https://www.rfc-editor.org/rfc/rfc792.html), and [RFC 1122, host requirements](https://www.rfc-editor.org/rfc/rfc1122.html). These references inform the model; they do not imply that every behaviour in those standards is implemented.

## Maintenance rules

When extending the model, add a good case and a plausible wrong case first. Do not write UI-only success checks that bypass the trace. Preserve old export compatibility or increment the format version and provide migration. Add shared utilities only when a second tool needs them; the calculator's full CIDR support must not inherit the LAN pilot's teaching limits accidentally.
