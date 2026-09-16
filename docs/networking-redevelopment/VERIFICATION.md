# LAN Builder verification record

Updated: 17 September 2026. Target: repository files served locally through HTTP in the Codex in-app browser. Model tests use Node's built-in test runner. No claim of external network traffic or hardware emulation is made.

**Decision:** the implemented pilot is ready for trainer review and a learner trial. The technical checks below passed; the separate release gates remain open.

## Automated model checks — passed

Command from the repository root:

```sh
node --test tools/tests/lan-builder.test.mjs
```

Result on 17 September: **34 tests, 34 passed, 0 failed, 0 skipped.**

Coverage includes strict IPv4/prefix validation; network and broadcast addresses; octet-boundary subnets; unconnected endpoints; switched local traffic; the original direct-cable/different-subnet false-success regression; correct and missing gateways in both directions; nonexistent/off-subnet/self gateways; wrong masks; an ordinary PC masquerading as a gateway; router broadcast isolation; switch ingress MAC learning; ARP cache use on reply; frame address changes and TTL at routers; duplicate IPs; disabled interfaces/cables; overlapping router networks; occupied ports/self-links/switch loops; pure deterministic traces; and valid/invalid import cases including identity/MAC collisions and position limits.

Additional checks passed: JavaScript syntax checks for both modules, unique static HTML IDs, existence of local HTML assets/navigation targets and social image, and `git diff --check`. The four delivered runtime files total about 77 KB uncompressed, without additional libraries or font downloads. This is a file-size observation, not a measured low-end-device performance result.

## Browser checks — observed

| Check | Observed result |
|---|---|
| Local activity | Connected PC A and PC B through different switch ports; ping succeeded without gateways; ARP and Echo Request/Reply appeared in the trace |
| Explanation grading | Incorrect switch-routing explanation did not complete the activity; correct explanation produced “Verified & explained” |
| Routed activity, no gateways | Failed with the source's missing gateway |
| Routed activity, only source gateway | Request arrived; reply failed because PC B had no gateway |
| Routed activity, both gateways | Completed both directions and met the activity goal |
| Return-path fault activity | Request arrived; ARP for 10.20.20.254 failed on the return path; changing PC B's gateway to 10.20.20.1 restored ping and allowed correct explanation completion |
| Device selection | Pointer selection correctly changed the inspector after fixing pointer-capture handling |
| Positioning | Pointer drag moved PC A from (80,190) to (130,140); one Undo restored (80,190). Arrow Up moved PC B by 10 px and Undo restored it |
| Invalid configuration | 255.0.255.0 produced an explicit error and retained the applied /24 configuration |
| Remove / Undo / Redo | Removing PC B removed its cable; Undo restored five devices/four cables; Redo removed it again; Undo recovered it |
| Save and reload | Network, corrected settings and all three previous completion marks survived reload; old packet results did not survive as fresh tests |
| Playback controls | Next/back/timeline/result controls selected the trace steps; playback advanced to Step 13 of 13 and stopped at verified success; play/pause changed state; changing activity during playback cleared the old trace and disabled its controls |
| Native keyboard action | Enter on Connect submitted the cable form; arrow keys repositioned devices |
| File import | Valid version-1 network file restored a five-device/four-cable scenario. Malformed network file was rejected without replacing the network |
| Copy/paste save fallback | Show data produced a versioned 2,570-character initial network; adding a router then restoring that data recovered the three-device network; malformed JSON retained current work |
| Tables and synchronized trace | At local ARP request, Switch A learnt PC A’s MAC on port 1; ARP caches were still empty; both diagrams highlighted the same two links |
| Graphics | SVG equipment, port indicators, full topology and packet overview inspected. Highlighted ARP path stopped at the router. Added the overview next to the explanation so the drawing and explanation can be inspected together |
| Responsive geometry | Page width matched viewport at 390, 768, 1280 and 1920 px. At 390 px the 860 px network drawing scrolled inside its own 364 px region; it did not widen the document. Tablet inspector stacked below the network |
| Browser console | No warning/error messages captured during the inspected flows |

Browser checks exercised real forms/buttons through the UI, rather than invoking the application's state functions. The browser's temporary viewport override developed a scale/click mismatch during the long mobile sequence; clearing it restored interaction. The completed recovery checks were repeated at the normal viewport. This is why the record does not claim that the entire workflow has passed on real phone hardware.

## Bugs found and corrected during verification

- Pointer capture intercepted a normal device click and left the wrong device selected. Capture now begins only once a drag starts. Selection, drag and keyboard placement were rechecked.
- The browser retained an old stylesheet after a reload, causing overview cables to lose their styles. Explicit asset versions now load the intended stylesheet/module revision together; correct strokes were inspected in the DOM and screenshot.
- Imported high device IDs could exceed the old import pattern after adding a device, and imported MACs could collide with a future generated MAC. Added bounded identifiers/collision avoidance and regression cases.
- Position limits differed between import, adding and keyboard movement. The model now constrains positions consistently.
- Prototype property names could be mistaken for supported device/lesson keys. Key lookup now checks own properties; invalid device types have a regression test.

## Limits and release gates — still open

- **Native download delivery:** the export action ran without a console error, but this in-app browser did not produce a confirmable download event/file. Normal browser file export remains to be checked. The copy/paste save/restore fallback is implemented and verified; file import is verified.
- **Human learning trial:** a trainer should confirm terminology and explanations. Several learners of differing confidence should attempt all three tasks and the changed-address sandbox task. Record where they hesitate and whether they can explain next hops and the return path without being told the answer.
- **Accessibility/device checks:** complete a keyboard-only lesson from the page start, check with a screen reader, measure contrast, inspect real 200% zoom, and test touch/orientation on actual phones/tablets. Named controls, focus styles, live status and non-drag alternatives are implemented and partially exercised, not certified.
- **Motion/background behaviour:** code review confirms reduced-motion and visibility handlers, but actual system reduced-motion and background-tab behaviour still need a deliberate device/browser check.
- **Performance and compatibility:** test a representative lower-powered classroom device, Safari/Firefox/Chrome or the actual classroom browser, storage denial/quota failure, and normal JSON download delivery. The copy/paste fallback should remain usable without local storage.
- **Release verification:** this task has not pushed or deployed. Repository changes were committed by other work during the interruption; live publication state was not audited here. After any separately authorised release, verify the live route, module/CSS assets, saved-state compatibility and a fresh local and routed ping.

Do not report these pending items as passed. The remaining checks distinguish an implemented pilot from a fully trialled, release-verified learning tool.

## Short repeatable smoke test

1. Start the HTTP preview and reset the local activity. Connect the two PCs through Switch A, choose a prediction, run ping, inspect ARP, then Show result. Try the wrong explanation before the correct one.
2. Open Reach another subnet. Test without gateways; configure only PC A to 192.168.1.1 and test; configure PC B to 192.168.2.1 and retest. Confirm failure, return-path failure, then success.
3. Open Restore service. Inspect the unanswered return-path ARP; correct PC B's gateway to 10.20.20.1 and retest.
4. While playing, change activity. Confirm no stale packets, success message or controls leak into it.
5. Remove a device, Undo, Redo, Undo. Save, reload and inspect the recovered network.
6. For repeatable file imports, use `tools/tests/fixtures/lan-builder-valid.json` and `tools/tests/fixtures/lan-builder-invalid.json`. Show current network data; make a change; restore from data; verify the saved state. Try malformed JSON and confirm it does not replace the state.
7. Check a narrow viewport and keyboard controls; restore the normal viewport afterwards. Inspect the console and rerun the model tests only if model changes were made.
