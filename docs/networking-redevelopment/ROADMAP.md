# Rebuild order and phase gates

Updated 17 September 2026. This ordering prioritises misleading outcomes, then contained correctness work, then shared configuration infrastructure. Large tools are split into reviewable milestones. Sizes are relative scope estimates, not elapsed-time promises: **S** = focused correction; **M** = one tool with a bounded model; **L** = multiple interacting state systems and scenarios.

## Ordered backlog

| Order | Work | Size | Why here | Verification required before advancing |
|---|---|---|---|---|
| 0 | LAN Builder pilot | L, implemented | Establish correct outcomes, trace-driven graphics and predictable interaction | 34 model checks and browser activity/recovery checks completed; trainer/learner and device checks remain in VERIFICATION.md |
| 1 | Correctness containment across the existing labs | S–M batch | Stop the most misleading feedback while full rebuilds are queued | Open wireless must not score Excellent; wrong switch settings must not pass; wrong router masks/down interfaces must not produce success/Full neighbours; CLI must not present unsupported verification as real state |
| 2 | IP Calculator | M | Bounded arithmetic and input validation offer high learning value with a small regression surface | Strict IPv4/IPv6 validation; explicit /0, /31 and /32 semantics; VLSM alignment, exhaustion and overlap checks; hand-worked examples agree with outputs |
| 3 | Wireless Config | M–L | Security grading and client consequences can be improved independently of the wired CLI foundation | Open/WEP/WPA variants judged appropriately for the defined scenario; controls actually change state; clients connect or fail for an explained reason; reset/reload do not misreport state |
| 4 | CLI Navigator and shared command/state foundation | L, split | Switch/router labs should reuse a reliable configuration model | Parse command arguments and modes; running/startup state differ correctly; show/save/reload reflect actual state; invalid or unsupported commands have explicit feedback |
| 5 | Switch Config | L, split | Reuse command state; add genuine Layer 2 outcomes | VLAN membership, access/trunk state and permitted traffic agree; incorrect values cannot pass; undoing required configuration revokes completion; MAC learning and diagrams agree |
| 6 | Router Config | L, split | Reuse addressing and configuration foundations; highest protocol complexity | Connected/static routes first; masks and interface state control forwarding; then separately validated routing-protocol and NAT scenarios; no invented adjacency or successful packet path |
| 7 | Device Explorer | M | Recognition graphics deserve reference-led work after core false-success faults are contained | Correct model, orientation, port type/count and equipment behaviour; keyboard identification tasks; real-equipment comparison |
| 8 | Cable & Connector Identifier | M | Extend reference content into practical discrimination and testing | Consistent connector orientation and pinouts; medium/category/context qualifications; termination and test-result tasks; recognisable graphics at classroom scale |
| 9 | Troubleshooter capstone | L, split | Depends on trustworthy outcomes from the other tools | Evidence derives from a seeded fault; no repeat-command point farming; learner repairs the fault; independent retest proves restored service; changed scenarios test transfer |

The containment pass is deliberately narrower than a rewrite. If a result cannot be honestly derived from the current state, label the unsupported check and withhold its success award until the model is implemented. Do not replace one canned success with another. Preserve valid cases with paired regression tests.

The smaller equipment/cable projects are suitable bounded jobs between large milestones when useful, but do not displace the correctness containment pass. No rebuild beyond the LAN pilot is recorded as completed here.

## Repeat these phases for each tool

### A. Specify the learning and technical scope

Define the learner's task, prerequisite, supported behaviours, excluded behaviours, starting state, known-good outcome and at least one plausible misconception. Write the acceptance examples before changing the interface. Check protocol or hardware claims against primary references.

### B. Implement the model and its regression cases

Keep the model independent of drawing and animation. Test genuine wrong configurations as well as correct ones. Derive output, feedback and completion from the same state. For the calculator, do not blindly copy the LAN pilot's /1–/30 restriction: a general calculator needs different boundary semantics.

### C. Build the learning interaction and graphics

Use prediction → action → observation → explanation → changed-case transfer. Keep hints progressive. Use recognisable equipment where identification matters and logical diagrams for packet reasoning. Use native SVG/HTML for inspectable schematics. Add keyboard alternatives, responsive controls and persistence deliberately.

### D. Verification checkpoint — required

Run the model tests; exercise every scenario through the actual UI; try wrong values and interrupted animations; verify reset, undo, import and saved-state recovery. Inspect desktop and narrow layouts, keyboard focus, contrast, motion and narration. Record observed results rather than simply listing intended features. Fix and repeat only the affected checks.

### E. Trainer review, learner trial and release

A trainer confirms the explanation is technically and instructionally sound. Learners attempt a changed example without being given the repair. Record hesitation and misconceptions. Address release-device/accessibility gaps and obtain the user's release instruction before deployment. Verify the live route and newly versioned assets after any authorised publication.

## Suggested large-project milestones

- **CLI:** modes/help/parser → configuration state → show/save/reload → one validated lesson → scenario expansion.
- **Switch:** one VLAN/access-port case → two VLANs with real isolation → trunk case → additional scenarios and completion checks.
- **Router:** one connected route → static route with return path → dynamic routing with real prerequisites → NAT with separate translation checks.
- **Troubleshooter:** one complete fault/evidence/repair/retest loop → varied faults → scoring and independent transfer.

Each milestone ends with Phase D. Avoid a large graphics rewrite followed by a single late correctness check.
