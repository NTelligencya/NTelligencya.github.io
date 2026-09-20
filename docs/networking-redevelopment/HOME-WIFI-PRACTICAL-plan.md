# Home Wi-Fi Practical simulator: build plan

Drafted 20 September 2026 for ntworldink.com, Networking Simulations section. Status: built the same day (see HOME-WIFI-PRACTICAL.md); not committed or published. Owner: SD.

## Why this tool

The ICTSAS217 practical (reset a router, secure it, set up both Wi-Fi bands, install a wireless adapter, join the network, add a network printer, ping, ipconfig, show connected devices) is the one hands-on sequence in the Cert II that none of the existing nine networking tools rehearses end to end (high; checked against the nine tool pages and the 14 September 2026 audit). The closest, Wireless Router Config (06), is a settings wizard pitched at ICTNWK311: it covers SSID, security, channels and DHCP inside the router only, its security grading is on the audit's fault list (an open network can score Excellent), and it has no PC side at all (high). The steps that trip people up in the lab are PC-side: which port the cable goes in, what a 169.254 address means, why the 5 GHz network never appears, how to add a printer by IP, and where "connected devices" lives.

So the gap is not "another router wizard". It is a rehearsal room with three things on the bench: a router, a Windows 11 PC and a printer, where every step you would be observed doing can be done, checked and repeated without the equipment in front of you.

## What the learner does

One page, three panes side by side (stacked on a phone):

- **The bench.** A drawing of the router (ports labelled Internet, LAN 1 to 4, Reset, power), the PC (USB ports, Ethernet port), the printer and a phone. You plug cables by choosing a device port pair, press and hold Reset, plug in the USB adapter, and turn things on and off. The router's lights change state.
- **The router's admin page.** A simulated browser tab. Typing the right address in the address bar (not the search box) opens a plain, generic router interface: Status, Wireless (2.4 GHz, 5 GHz), Administration (admin password), LAN (DHCP on/off, address range), Connected devices, Reboot. Generic on purpose; the lab's Linksys and a client's TP-Link both look like this in the ways that matter.
- **The PC.** A simulated Windows 11 surface with just the parts the practical uses: the taskbar network flyout (Wi-Fi list, connect, passphrase), Device Manager (Network adapters, with the yellow triangle state), Settings > Printers & scanners (Add device, Add manually, add by IP address, Print test page), Settings > Time & language for the time zone, and a Command Prompt that understands `ipconfig`, `ipconfig /all`, `ipconfig /release`, `ipconfig /renew`, `ping`, `arp -a`, `netsh wlan show networks mode=bssid`, `netsh wlan show interfaces`, `cls`, and answers anything else with a real-looking "not recognised" line.

Every pane reads and writes the same state model, so the Command Prompt output is derived from what you actually did on the bench and in the router, never canned. That is the LAN Builder rule and it carries over unchanged.

## Three modes

**Guided rehearsal.** The observation sequence as checkpoints, in lab order, each with a one-line brief, a hint ladder (three hints, last one is the exact steps) and a check that reads the state model:

| Checkpoint | Passes when the model shows |
|---|---|
| Check the delivery | Every packing-list item ticked; the missing-item case answered with "contact the supplier" not "start anyway" |
| Factory reset | Reset held 10 seconds or more with power on; router state back to defaults |
| Wired access | PC cabled to a LAN port (not Internet); Ethernet adapter holds a DHCP lease |
| Log in | Correct gateway address entered as a URL; default credentials accepted |
| Admin password | Changed, saved, and re-login with the new password succeeded; old password rejected |
| 2.4 GHz network | Non-default SSID; WPA3 or WPA2/WPA3 (WPA2-AES accepted with a note); passphrase 12 or more characters |
| 5 GHz network | Same, distinct SSID accepted or shared SSID accepted; band enabled |
| Wireless adapter | Adapter plugged in; appears under Network adapters with no warning, or warning cleared by installing the driver |
| Join wirelessly | Connected to the new SSID with the new passphrase; Ethernet unplugged; wireless adapter holds a lease in the router's range |
| Add the printer | Printer joined to the same SSID; added by discovery or by IP; test page printed |
| Ping | `ping` to the printer and router returned four replies with 0% loss in the prompt |
| IPv4 address | `ipconfig` run; learner selects the correct line in the output |
| Connected devices | Learner opens the router's Connected devices page or runs `arp -a`, and answers the "explain it to someone" prompt (multiple choice, both methods) |
| Finish | Settings recorded in the on-page job sheet; spare adapter "stored"; packaging to the right bin |

Each checkpoint follows the site's pattern: predict, act, observe, explain. Completion is labelled "rehearsed", never "competent"; the scope note says plainly that this is formative practice, not a validated assessment.

**Second occasion.** The unit needs the sequence done twice, and the second time should not be a replay. This mode reruns the checklist with a different router address (192.168.0.1), different default credentials, a different printer address, and one or two seeded faults drawn from a pool: the adapter is 2.4 GHz only; DHCP is off on the router; the cable is in the Internet port; the passphrase on 5 GHz was mistyped; the printer is on the old default SSID; the driver did not install. The learner has to notice and fix, and the fault is not named until it is fixed.

**Free bench.** No checklist. Set anything, break anything, run the commands, look at the output. Useful for explaining things to a student on a projector.

## The state model (engine.mjs)

Pure functions, no DOM, so it can be tested with `node --test` like LAN Builder (high; that harness already exists at `tools/tests/`).

- Router: powered, defaults, adminPassword, lanAddress, dhcp {enabled, range}, radios {2.4: {enabled, ssid, security, passphrase}, 5: {...}}, leases, wanState, lights.
- PC: ethernet {cabledTo, lease}, usbAdapter {present, driverState, bands}, wifi {joinedSsid, passphraseUsed, lease}, arpCache, timeZone, printers.
- Printer: powered, joinedSsid, address (static), driverInstalled.
- Phone: joinedSsid, lease (exists so "ping the phone" can time out for the honest reason).
- Derived: what `ipconfig` prints (169.254.x.x when there is no lease), what `netsh wlan show networks` lists (only bands the adapter supports and radios that are enabled), what `ping` does (reply only if both ends hold addresses on the same LAN and the target answers ping; the phone does not), what `arp -a` shows (only hosts the PC has talked to), what Connected devices lists (current leases).
- Rules that must be tested with a wrong case as well as a right one: reset held too briefly changes nothing; cable in the Internet port gets no LAN lease; a 2.4 GHz-only adapter never sees a 5 GHz SSID; wrong passphrase fails to join; joining with Ethernet still plugged in keeps the wired lease (so unplugging is a real step); the printer must be on the same SSID to be pinged; WEP and WPA-TKIP never pass the security check; hidden SSID and MAC filtering earn a note, not marks.

## Architecture

Same shape as the LAN Builder pilot, which is the only tool in the suite that has passed the audit's standard (high):

| File | Role |
|---|---|
| `simulations/networking/10-home-wifi-practical.html` | Semantic document: three panes, checkpoint rail, hint ladder, job sheet, scope disclosure |
| `simulations/networking/home-wifi/engine.mjs` | State model, derived outputs, fault seeding, scenario definitions |
| `simulations/networking/home-wifi/app.mjs` | Rendering, pane interaction, Command Prompt parser, persistence, undo |
| `simulations/networking/home-wifi/home-wifi.css` | Layout on the existing dark teal tokens (`--bg #071012`, `--teal #50ddd2`), reduced-motion and print rules copied across |
| `tools/tests/home-wifi.test.mjs` | Model tests, right and wrong cases, one per rule above |

Serve over HTTP for ES modules (`python3 -m http.server`), as with LAN Builder. No new dependencies, no remote scripts, no page-level style overrides beyond the tool's own CSS file (the simulations section is already an accepted exception to the shared-stylesheet rule). Auto-save under `ntwi-home-wifi-v1`, JSON export/import with the same versioned envelope. Keyboard alternatives for every bench action; `aria-live` on the Command Prompt output and the checkpoint status.

Card on `simulations/index.html` under Networking Simulations, after the Troubleshooter: "Home Wi-Fi Practical. Reset, secure and set up a home router, install a wireless adapter, add a network printer and prove it all from the command prompt. Rehearse the whole sequence twice." Description meta and social block added the site's usual way (`node tools/add-meta.js`).

## What it deliberately does not do

State this in the scope block on the page: no real 802.11 radio behaviour (no channels, interference or signal strength); no internet beyond a "WAN up" light; no DNS modelling except that `ping cdu.edu.au` resolves when WAN is up; no Cisco CLI; not a Linksys or TP-Link emulation. Channels and DHCP-scope design stay in Wireless Router Config (06), which this tool links to for that depth.

## Where it sits in the roadmap

The redevelopment roadmap's item 3 is a Wireless Config rebuild (medium to large). This tool covers the learner-facing part of that item (security judged honestly, controls that change state, clients that connect or fail for a stated reason) and adds the PC and printer side. Two choices, for SD to make:

- Build this as tool 10 and leave 06 in place, fixing 06's open-network grading in the containment pass as already planned. Two wireless tools, different jobs.
- Build this as tool 10 and retire 06 once this ships, folding its channel and DHCP-scope screens into the free bench later.

The first is recommended; it keeps the roadmap's ordering (containment, then IP Calculator) intact and adds this as a bounded, self-contained job that can run in parallel. Size: L, split into three milestones, each ending in the roadmap's Phase D verification: bench and router with the model and tests; the PC surface and Command Prompt; guided rehearsal, second occasion and faults.

## Reuse from the study page

The ICTSAS217 study page on cybersecurityink.com now carries "Rehearsal: from the box to a printed test page" and a fault-finder table. The checkpoint briefs, hints and fault pool come straight from that section, so the two stay in step; when one is corrected, correct the other.

## Open items

- SD to confirm the generic router look is acceptable, or whether the admin page should mimic the lab's Linksys layout more closely (low; the lab's exact model and firmware are not recorded in the source documents).
- Whether the tool should carry the unit code in its title, as 06 carries ICTNWK311 (SD's call; the simulations index copy already says "Certificate IV, practise before the real gear", which this Cert II tool would need to broaden).
- Not touched in this session: README session record and ROADMAP in `docs/networking-redevelopment/`; add an entry there when the build is authorised.

## Sources used

Repo read on 20 September 2026: `simulations/index.html`, the nine networking tool pages, `docs/networking-redevelopment/` (README, ROADMAP, LAN-BUILDER, 2026-09-14 quality audit, all dated 14 to 17 September 2026), `tools/tests/lan-builder.test.mjs`, and the site CLAUDE.md. Practical sequence and checklist items: the ICTSAS217 Assessor Guide v4.4, the ICTSAS217 practical assessment instructions and the ICT20120 direct observation checklist (February 2026), all in the CERTII folder.
