# Home Wi-Fi Practical (ICTSAS217) specification

Implemented 20 September 2026. Route: `simulations/networking/10-home-wifi-practical.html`. Plan: [HOME-WIFI-PRACTICAL-plan.md](HOME-WIFI-PRACTICAL-plan.md). SD's decisions (20 September 2026): keep Wireless Router Config (06) alongside; carry the unit code in the title; a generic router is fine.

## What it rehearses

The ICTSAS217 practical sequence as fourteen checkpoints: check the delivery, factory reset, wired access, log in, change the admin password (proved by a re-login), 2.4 GHz and 5 GHz set-up, wireless adapter in Device Manager, wireless join with the cable unplugged, network printer and test page, ping, point out the IPv4 line, show and explain the connected devices, and the job sheet. Three modes: Guided rehearsal (first occasion), Second occasion (192.168.0.1, different defaults and printer address, two seeded faults from a pool of five) and Free bench (no checklist). Completion is labelled "rehearsed"; the scope block says this is not an assessment.

Faults pool: adapter is 2.4 GHz only; adapter driver missing until installed from the manufacturer; 5 GHz radio ships disabled; Ethernet cable A is damaged; power supply missing from the delivery (must be resolved with the supplier).

## Files

| File | Responsibility |
|---|---|
| `simulations/networking/10-home-wifi-practical.html` | Document, three panes, checkpoint rail, show-and-explain, job sheet, scope disclosure |
| `simulations/networking/home-wifi/engine.mjs` | Pure state model: router, PC, printer, phone, delivery; derived ipconfig/ping/arp/netsh output; checkpoints |
| `simulations/networking/home-wifi/app.mjs` | Rendering, event delegation, press-and-hold reset, drafts, persistence, import/export, mode reset |
| `simulations/networking/home-wifi/home-wifi.css` | Layout on the LAN Builder tokens; responsive, reduced motion, print |
| `tools/tests/home-wifi.test.mjs` | 24 model tests, each pairing a right case with a wrong one |

ES modules; serve over HTTP. Storage key `ntwi-home-wifi-v1`; export envelope `ntwi-home-wifi` version 1 holding all three mode states.

## Model contract

- Every prompt line is derived: `ipconfig` shows 169.254.x.x when no lease; `ping` replies only when both ends hold LAN addresses and the target is reachable; `arp -a` lists only hosts the PC has exchanged frames with; `netsh wlan show networks` lists only bands the adapter supports and radios that are enabled. Unknown commands are refused with the Windows wording.
- Reset needs power and a hold of 10 seconds or more. A cable in the Internet port never gets a lease. Applying wireless settings drops clients whose credentials no longer match. The printer joins 2.4 GHz only. WEP, TKIP and open networks never pass; passphrases under 12 characters do not pass the checkpoint.
- Checkpoints that record an achievement (wired lease, login, password proved, reset) key off logged events so a later, deliberate step (unplugging the cable to prove Wi-Fi) does not undo them; live-state checkpoints (join, adapter) reflect the bench as it is.

## Verification done on 20 September 2026

- `node --test tools/tests/home-wifi.test.mjs`: 24 pass.
- Playwright (Chromium, 1400 px and 390 px) drove the whole guided sequence through the real UI: reset too briefly then correctly (keyboard and mouse hold), cable in the WAN port, search-box mistake, old password rejected, WEP refused, wrong passphrase refused, discovery and test page, ping, IPv4 line choice right and wrong, explanation right and wrong, job sheet, completion badge, reload persistence, second-occasion fault seeding, import round trip. No page errors; no horizontal overflow at 390 px.
- Not done: trainer review, learner trial, screen-reader pass, and the live-route check after publication. The page is not committed or published.
