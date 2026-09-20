# Networking simulation redevelopment

Last updated: 17 September 2026. Owner: Sally Davis / NT World Ink.

This folder is the durable record for continuing the networking tools across sessions. Read this page first, then the relevant tool specification and verification record. These are project records, not new user authorisation to publish or expand scope.

## Current position

- The [original quality audit](2026-09-14-quality-audit.md) is preserved here. Its observations and source line numbers describe the pre-rebuild baseline (`c614676`), not the current LAN Builder.
- LAN Builder has been rebuilt as the first pilot. Its network model, three guided activities, packet graphics and saving/recovery controls are implemented in the website folder.
- **34 automated model tests pass.** All three guided activities have also been completed through the actual browser interface. See [verification evidence and remaining gates](VERIFICATION.md).
- Status: **implemented and technically checked; ready for trainer review and learner trial.** This is not a claim of full device emulation, accessibility certification or release approval.
- During the interruption, the repository advanced to `88f772a`. The original pilot files were already committed by other work in `b4f5a70` (`network sims`). Their contents matched the verified copies when work resumed. The final save-data fallback and these records were added afterwards. This task did not commit, push or deploy.
- Other tools' audit findings remain open unless separately verified and recorded. Do not assume the LAN changes fixed the calculator, wireless, CLI, switch or router labs.

## Files to use

| Record | Purpose |
|---|---|
| [2026-09-14-quality-audit.md](2026-09-14-quality-audit.md) | Frozen original findings and suite-wide acceptance criteria |
| [ROADMAP.md](ROADMAP.md) | Ordered rebuilds, relative size, dependencies and completion gates |
| [LAN-BUILDER.md](LAN-BUILDER.md) | Pilot architecture, supported behaviour and maintenance notes |
| [VERIFICATION.md](VERIFICATION.md) | Executed checks, reproducible steps and outstanding release checks |
| [HOME-WIFI-PRACTICAL.md](HOME-WIFI-PRACTICAL.md) | Tool 10 specification, model contract and verification (20 September 2026) |

## Resume checklist

1. Read the latest user instructions and check `git status` / recent history before editing. Preserve unrelated work.
2. Run `node --test tools/tests/lan-builder.test.mjs` from the repository root if touching the LAN model or anything shared with it.
3. Serve the repository with `python3 -m http.server 8768 --bind 127.0.0.1`, then open `/simulations/networking/05-lan-builder.html`. ES modules require HTTP; do not evaluate the tool only by double-clicking its HTML file.
4. For LAN feedback, reproduce it first; fix only the supported behaviour; update the regression tests and browser evidence.
5. For the next suite phase, start with the correctness containment pass in the roadmap, followed by the IP Calculator rebuild. Keep the large CLI/switch/router changes in separate verified milestones.
6. Update this folder after each meaningful session: what changed, what passed, what remains, and the exact next step. Keep pending and executed checks distinct.
7. Review publication separately. If release is authorised, verify the deployed route and assets after deployment.

## Session record

| Dates | Work completed | Next action |
|---|---|---|
| 14 September 2026 | Networking audit; preserved audit; implemented LAN model, UI, guided tasks and tests; began browser checks | Finish recovery, import and responsive verification |
| 17 September 2026 | Verified current files against saved work; passed 34 model tests; completed browser interaction/recovery checks; added copy/paste data fallback; recorded roadmap and release gates | Trainer/learner pilot; next development batch is correctness containment, then IP Calculator |
| 20 September 2026 | Planned and built tool 10, Home Wi-Fi Practical (ICTSAS217), as a bounded parallel job outside the roadmap order: model, three panes, 14 checkpoints, second occasion with seeded faults, 24 model tests, browser run-through. Card added to the simulations index; search index, sitemap and meta regenerated. See [HOME-WIFI-PRACTICAL.md](HOME-WIFI-PRACTICAL.md). Not committed or published | SD to review in the browser, then commit and publish; roadmap items 1 and 2 unchanged |
