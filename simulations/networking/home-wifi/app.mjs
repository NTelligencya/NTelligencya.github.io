import * as E from './engine.mjs?v=20260920.1';

const STORAGE = 'ntwi-home-wifi-v1';
const $ = id => document.getElementById(id);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const MODE_LABEL = { first: 'Guided rehearsal', second: 'Second occasion', free: 'Free bench' };

let app = { mode: 'first', states: { first: null, second: null, free: null }, completed: {}, pcTab: 'wifi', wifiPick: null, addByIp: false };
let hintCount = 0, lastCurrent = null, resetArmed = false;
const draft = {};
const v = (key, fallback) => (key in draft ? draft[key] : fallback);
const st = () => app.states[app.mode];

function notice(message, error = false) { const n = $('notice'); n.textContent = message; n.classList.toggle('error', error); clearTimeout(notice.t); notice.t = setTimeout(() => { n.textContent = ''; }, error ? 7000 : 4200); }
function ensure(mode) { if (!app.states[mode]) app.states[mode] = E.newState(mode); }
function pack() { return { format: 'ntwi-home-wifi', version: 1, mode: app.mode, states: app.states, completed: app.completed, pcTab: app.pcTab }; }
function validate(data) {
  if (data?.format !== 'ntwi-home-wifi' || data.version !== 1 || typeof data.states !== 'object') throw Error('Choose a Home Wi-Fi Practical export file (version 1).');
  for (const m of ['first', 'second', 'free']) { const s = data.states[m]; if (s === null || s === undefined) continue; if (!s.scenario?.id || !s.router?.radios || !s.pc?.ethernet || !Array.isArray(s.events)) throw Error('That file does not hold a valid bench state.'); }
  return { mode: MODE_LABEL[data.mode] ? data.mode : 'first', states: { first: data.states.first || null, second: data.states.second || null, free: data.states.free || null }, completed: data.completed && typeof data.completed === 'object' ? data.completed : {}, pcTab: ['wifi', 'devmgr', 'printers', 'cmd'].includes(data.pcTab) ? data.pcTab : 'wifi', wifiPick: null, addByIp: false };
}
function persist(explicit = false) {
  try { localStorage.setItem(STORAGE, JSON.stringify(pack())); $('save-status').textContent = 'Saved in this browser. Export a file to move to another device.'; if (explicit) notice('Progress saved in this browser.'); }
  catch { $('save-status').textContent = 'Browser storage is unavailable or full. Use Export progress to keep your work.'; if (explicit) notice('Could not save in this browser. Export your progress instead.', true); }
}
function restore() {
  try { const saved = localStorage.getItem(STORAGE); if (saved) app = validate(JSON.parse(saved)); } catch { /* start fresh */ }
  ensure(app.mode);
}
function commit(action, message) {
  const before = E.clone(st());
  try { const result = action(st()); persist(); render(); if (message) notice(message); return result; }
  catch (error) { app.states[app.mode] = before; render(); notice(error.message, true); return null; }
}
function clearDraft(...keys) { for (const k of keys) delete draft[k]; }

// ---------- Rendering ----------
function render() { renderModes(); renderBrief(); renderRail(); renderBench(); renderRouter(); renderPc(); renderShow(); renderSheet(); }

function checkpoints() { return app.mode === 'free' ? [] : E.evaluate(st()); }
function currentCheckpoint(list) { return list.find(c => !c.done) || null; }

function renderModes() {
  document.querySelectorAll('[data-mode]').forEach(b => { const m = b.dataset.mode; b.toggleAttribute('aria-current', false); if (m === app.mode) b.setAttribute('aria-current', 'step'); const mark = b.querySelector('.done-mark'); if (mark) mark.textContent = app.completed[m] ? '✓' : ''; });
  $('reseed').hidden = app.mode !== 'second';
}
function renderBrief() {
  const list = checkpoints(); const cur = currentCheckpoint(list);
  const badge = $('mode-state');
  if (app.mode === 'free') {
    $('brief-label').textContent = 'FREE BENCH'; $('brief-title').textContent = 'No checklist. Try things.'; $('brief-text').textContent = 'Set anything, break anything, and read what the PC says about it. Useful for showing a class what a wrong port or a wrong passphrase looks like from the command prompt.'; $('brief-note').textContent = ''; badge.textContent = 'Sandbox'; badge.classList.remove('verified'); $('hint-button').hidden = true; $('hint-text').hidden = true; return;
  }
  $('hint-button').hidden = false;
  if (!cur) {
    $('brief-label').textContent = 'ALL STEPS'; $('brief-title').textContent = 'Every step rehearsed'; $('brief-text').textContent = app.mode === 'first' ? 'That is the whole sequence once. The unit needs it on two separate occasions, so go to Second occasion, where the router, the addresses and the faults are different.' : 'Second occasion done with its seeded faults. Use New second occasion for a different fault mix, or return to the real equipment.'; $('brief-note').textContent = ''; badge.textContent = 'Rehearsed'; badge.classList.add('verified'); $('hint-button').hidden = true; $('hint-text').hidden = true;
    if (!app.completed[app.mode]) { app.completed[app.mode] = new Date().toISOString().slice(0, 10); persist(); renderModes(); }
    return;
  }
  const def = E.CHECKPOINTS.find(c => c.id === cur.id);
  if (lastCurrent !== cur.id) { hintCount = 0; lastCurrent = cur.id; $('hint-text').hidden = true; }
  const done = list.filter(c => c.done).length;
  $('brief-label').textContent = `STEP ${done + 1} OF ${list.length}`; $('brief-title').textContent = def.title; $('brief-text').textContent = def.brief; $('brief-note').textContent = cur.note || '';
  badge.textContent = `${done} of ${list.length} rehearsed`; badge.classList.toggle('verified', false);
  $('hint-button').textContent = hintCount === 0 ? 'Show a hint' : hintCount < def.hints.length ? 'Another hint' : 'That was the last hint';
  $('hint-button').disabled = hintCount >= def.hints.length;
  if (hintCount) { $('hint-text').hidden = false; $('hint-text').textContent = def.hints[Math.min(hintCount, def.hints.length) - 1]; }
}
function renderRail() {
  const list = checkpoints(); const aside = document.querySelector('.rail'); const ws = $('workspace');
  aside.hidden = !list.length; ws.classList.toggle('no-rail', !list.length);
  if (!list.length) return;
  const cur = currentCheckpoint(list);
  $('rail').innerHTML = list.map((c, i) => `<li class="${c.done ? 'done' : ''} ${cur && cur.id === c.id ? 'current' : ''}"><span class="mark" aria-hidden="true">${c.done ? '✓' : i + 1}</span><span>${esc(c.title)}${c.done ? '<span class="sr-only"> (done)</span>' : ''}${!c.done && c.note && cur?.id === c.id ? `<span class="note">${esc(c.note)}</span>` : ''}</span></li>`).join('');
}

function renderBench() {
  const s = st(), sc = s.scenario, r = s.router;
  const missing = s.delivery.items.filter(i => !i.present);
  const packing = `<div class="card"><h3>Packing list</h3><p class="small">Tick each item as you find it in the box.</p><ul class="packing">${s.delivery.items.map(i => `<li><input type="checkbox" id="pk-${esc(i.name)}" data-action="tick" data-item="${esc(i.name)}" ${s.delivery.ticked.includes(i.name) ? 'checked' : ''}><label for="pk-${esc(i.name)}">${esc(i.name)}</label>${!i.present ? '<span class="missing">not in the box</span>' : i.replaced ? '<span class="replaced">replacement received</span>' : ''}</li>`).join('')}</ul>
    ${missing.length && !s.delivery.resolution ? `<p class="small">Something is missing. What now?</p><div class="row"><button class="small" data-action="resolve" data-choice="supplier">Contact the supplier</button><button class="small" data-action="resolve" data-choice="borrow">Borrow one from the lab</button><button class="small" data-action="resolve" data-choice="ignore">Start without it</button></div>` : ''}
    ${s.delivery.resolution && s.delivery.resolution !== 'supplier' ? `<p class="status bad"><b>${s.delivery.resolution === 'borrow' ? 'Borrowed a part.' : 'Started without it.'}</b> The discrepancy is still unresolved with the supplier.</p><div class="row"><button class="small" data-action="resolve" data-choice="supplier">Contact the supplier instead</button></div>` : ''}
    ${s.delivery.resolution === 'supplier' ? '<p class="status good"><b>Supplier contacted</b> with a photo of the box contents; a replacement was sent.</p>' : ''}</div>`;

  const lanOn = n => s.pc.ethernet.port === `lan${n}` && E.ethernetLinkUp(s);
  const light = (name, on, blink) => `<span><i class="${blink ? 'blink' : on ? 'on' : ''}"></i>${name}</span>`;
  const router = `<div class="card"><h3>${esc(sc.routerModel)}</h3><div class="label">Label on the base<br>Address <b>${esc(sc.lanAddress)}</b><br>User <b>${esc(sc.defaultUser)}</b> · Password <b>${esc(sc.defaultPass)}</b><br>Wi-Fi <b>${esc(sc.defaultSsid)}</b> · Key <b>${esc(sc.defaultPassphrase)}</b></div>
    <div class="lights" aria-label="Router lights">${light('Power', r.powered)}${light('Internet', r.powered)}${light('2.4G', r.powered && r.radios.g24.enabled)}${light('5G', r.powered && r.radios.g5.enabled)}${[1, 2, 3, 4].map(n => light(`LAN${n}`, lanOn(n))).join('')}</div>
    <div class="row"><button data-action="power" class="${r.powered ? '' : 'primary'}">${r.powered ? 'Switch off' : 'Switch on'}</button><span class="status">${r.powered ? '<b>Powered</b>' : 'Unplugged'}${r.everReset ? ' · reset done' : ''}</span></div>
    <div class="hold"><label>Hold for (seconds)<input type="number" id="hold-seconds" min="0" max="60" step="1" value="${esc(v('hold', 3))}" data-draft="hold"></label><button id="reset-btn" data-action="reset-click" title="Press and hold with the mouse, or set the seconds and press">Press and hold Reset</button><output id="hold-out" for="hold-seconds" aria-live="polite"></output></div></div>`;

  const e = s.pc.ethernet;
  const pc = `<div class="card"><h3>Bench PC</h3>
    <form data-form="ethernet" class="form-grid"><div class="row"><label>Ethernet cable to<select name="port" data-draft="eth-port">${[['', 'Not connected'], ['lan1', 'Router LAN 1'], ['lan2', 'Router LAN 2'], ['lan3', 'Router LAN 3'], ['lan4', 'Router LAN 4'], ['internet', 'Router Internet (WAN)']].map(([val, t]) => `<option value="${val}" ${v('eth-port', e.port || '') === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label>Cable<select name="cable" data-draft="eth-cable">${['A', 'B'].map(c => `<option ${v('eth-cable', e.cable || 'A') === c ? 'selected' : ''}>${c}</option>`).join('')}</select></label><button type="submit">Plug</button></div></form>
    <p class="status ${e.port ? (E.ethernetLinkUp(s) ? 'good' : 'bad') : ''}">Ethernet port: ${e.port ? `<b>${E.ethernetLinkUp(s) ? 'link light on' : 'no link light'}</b> (cable ${esc(e.cable)} to ${esc(e.port.replace('lan', 'LAN ').replace('internet', 'Internet'))})` : 'nothing plugged in'}</p>
    <div class="row"><button data-action="adapter">${s.pc.adapter.present ? 'Unplug USB wireless adapter' : 'Plug in USB wireless adapter'}</button></div>
    <p class="status">${s.pc.adapter.present ? `USB adapter in a front port. ${s.pc.adapter.driver === 'installed' ? '<b>Windows set it up.</b>' : '<b>Windows says "device driver was not successfully installed".</b>'}` : 'No wireless adapter fitted.'}</p></div>`;

  const nets24 = E.visibleNetworks(s).filter(n => n.band === '2.4');
  const printer = `<div class="card"><h3>${esc(sc.printerModel)}</h3><p class="small">Network page on the printer's own screen. Fixed address <b>${esc(s.printer.address)}</b>. 2.4 GHz only.</p>
    <div class="row"><button data-action="printer-power" class="small">${s.printer.powered ? 'Switch off' : 'Switch on'}</button><span class="status ${s.printer.ssid ? 'good' : ''}">${!s.printer.powered ? 'Off' : s.printer.ssid ? `Joined <b>${esc(s.printer.ssid)}</b>` : '<b>Not connected</b>'}</span></div>
    <form data-form="printer" class="form-grid"><label>Wireless setup wizard: network<select name="ssid" data-draft="pr-ssid">${nets24.length ? nets24.map(n => `<option ${v('pr-ssid', '') === n.ssid ? 'selected' : ''}>${esc(n.ssid)}</option>`).join('') : '<option value="">No 2.4 GHz networks found</option>'}</select></label><label>Passphrase<input name="pass" type="text" data-draft="pr-pass" value="${esc(v('pr-pass', ''))}" autocomplete="off"></label><button type="submit" class="small">Join</button></form></div>`;

  const netsAll = E.visibleNetworks(s);
  const phone = `<div class="card"><h3>Phone</h3><p class="small">A second wireless client for testing.</p><p class="status ${s.phone.ssid ? 'good' : ''}">${s.phone.ssid ? `Joined <b>${esc(s.phone.ssid)}</b> · ${esc(s.phone.lease || '')}` : 'Not connected'}</p>
    <form data-form="phone" class="form-grid"><label>Wi-Fi<select name="ssid" data-draft="ph-ssid">${netsAll.length ? netsAll.map(n => `<option ${v('ph-ssid', '') === n.ssid ? 'selected' : ''}>${esc(n.ssid)} (${n.band} GHz)</option>`).join('') : '<option value="">No networks</option>'}</select></label><label>Password<input name="pass" type="text" data-draft="ph-pass" value="${esc(v('ph-pass', ''))}" autocomplete="off"></label><button type="submit" class="small">Join</button></form></div>`;

  $('bench').innerHTML = packing + router + pc + printer + phone;
}

function renderRouter() {
  const s = st(), ss = s.router.session, sc = s.scenario;
  if (!(('url' in draft))) $('url').value = ss.url || '';
  let html = '';
  if (ss.page === 'blank') html = '<p class="muted">Type the router’s address in the address bar above and press Go. The address is on the label, and it is the Default Gateway in ipconfig.</p>';
  else if (ss.page === 'search') html = `<div class="search-page"><span class="q">${esc(ss.url)}</span><div class="r"><a>How to log in to your router | Home networking help</a><div class="u">www.example-help-site.com › router-login</div>Most home routers use 192.168.1.1 or 192.168.0.1. Type it into the address bar...</div><div class="r"><a>${esc(sc.routerModel)} setup guide (PDF)</a><div class="u">support.example-vendor.com › downloads</div>Quick start guide, firmware and warranty information.</div><p class="muted" style="color:#555;font-size:.8rem">This went to a web search. A search engine cannot open a device on your own network. Type only the address, such as ${esc(s.router.lanAddress)}, into the address bar.</p></div>`;
  else if (ss.page === 'unreachable') html = `<h3>This site can’t be reached</h3><p class="muted"><b>${esc(ss.url)}</b> took too long to respond.</p><ul class="muted"><li>Is the router powered on?</li><li>Is the PC connected to it, by a cable in a LAN port or by Wi-Fi?</li><li>Does ipconfig show a Default Gateway? If the address there is different, use that.</li></ul>`;
  else if (ss.page === 'login') html = `<div class="login-box"><h3>${esc(sc.routerModel)}</h3><form data-form="login" class="form-grid"><label>User name<input name="user" data-draft="login-user" value="${esc(v('login-user', ''))}" autocomplete="off"></label><label>Password<input name="pass" type="password" data-draft="login-pass" value="${esc(v('login-pass', ''))}" autocomplete="off"></label>${ss.loginFailed ? '<p class="err">Incorrect user name or password.</p>' : ''}<button type="submit" class="primary">Log in</button></form></div>`;
  else if (ss.page === 'admin') html = renderAdmin(s);
  $('router-page').innerHTML = html;
}
function renderAdmin(s) {
  const r = s.router, ss = r.session, sc = s.scenario;
  const tabs = [['status', 'Status'], ['wireless', 'Wireless'], ['admin', 'Administration'], ['lan', 'LAN'], ['devices', 'Connected devices'], ['reboot', 'Reboot']];
  let body = '';
  if (ss.tab === 'status') body = `<dl class="kv"><dt>Model</dt><dd>${esc(sc.routerModel)}</dd><dt>Firmware</dt><dd>3.2.14 (2026-02)</dd><dt>Internet</dt><dd>Connected (IPoE, DHCP) · WAN 203.0.113.42</dd><dt>LAN address</dt><dd>${esc(r.lanAddress)} / 255.255.255.0</dd><dt>DHCP server</dt><dd>${r.dhcp.enabled ? `Enabled · ${r.lanAddress.replace(/\d+$/, r.dhcp.start)} onwards` : 'Disabled'}</dd><dt>2.4 GHz</dt><dd>${r.radios.g24.enabled ? `${esc(r.radios.g24.ssid)} · ${E.SECURITY[r.radios.g24.security]}` : 'Off'}</dd><dt>5 GHz</dt><dd>${r.radios.g5.enabled ? `${esc(r.radios.g5.ssid)} · ${E.SECURITY[r.radios.g5.security]}` : 'Off'}</dd><dt>Admin password</dt><dd>${r.adminPassword === sc.defaultPass ? '<span style="color:#a11">Factory default</span>' : 'Changed'}</dd></dl>`;
  else if (ss.tab === 'wireless') body = ['2.4', '5'].map(band => { const k = band === '5' ? 'r5' : 'r24', rd = E.radioFor(s, band); return `<form data-form="radio" data-band="${band}" class="form-grid" style="margin-bottom:18px"><fieldset><legend>${band} GHz network</legend><label class="check"><input type="checkbox" name="enabled" data-draft="${k}-en" ${v(`${k}-en`, rd.enabled) ? 'checked' : ''}> Enable radio</label><label>Network name (SSID)<input name="ssid" maxlength="32" data-draft="${k}-ssid" value="${esc(v(`${k}-ssid`, rd.ssid))}" autocomplete="off"></label><div class="row"><label>Security mode<select name="security" data-draft="${k}-sec">${Object.entries(E.SECURITY).map(([val, t]) => `<option value="${val}" ${v(`${k}-sec`, rd.security) === val ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label>Passphrase<input name="passphrase" type="text" data-draft="${k}-pass" value="${esc(v(`${k}-pass`, rd.passphrase))}" autocomplete="off"></label></div><button type="submit" class="primary">Save ${band} GHz settings</button></fieldset></form>`; }).join('') + '<p class="warnbox">Saving wireless settings disconnects every device on that band until it reconnects with the new details.</p>';
  else if (ss.tab === 'admin') body = `<form data-form="password" class="form-grid"><fieldset><legend>Router password</legend><label>Current password<input name="current" type="password" data-draft="pw-cur" value="${esc(v('pw-cur', ''))}" autocomplete="off"></label><label>New password<input name="next" type="password" data-draft="pw-new" value="${esc(v('pw-new', ''))}" autocomplete="off"></label><label>Confirm new password<input name="confirm" type="password" data-draft="pw-conf" value="${esc(v('pw-conf', ''))}" autocomplete="off"></label><button type="submit" class="primary">Save</button></fieldset></form><p class="muted">The router ends your session when the password changes. Log in again with the new password.</p>`;
  else if (ss.tab === 'lan') body = `<dl class="kv"><dt>Router address</dt><dd>${esc(r.lanAddress)}</dd><dt>Subnet mask</dt><dd>255.255.255.0</dd></dl><label class="check"><input type="checkbox" data-action="dhcp" ${r.dhcp.enabled ? 'checked' : ''}> DHCP server enabled (hands out addresses from ${esc(r.lanAddress.replace(/\d+$/, r.dhcp.start))})</label><p class="muted">Turning DHCP off is a fault to practise recognising, not a setting for a home network.</p>`;
  else if (ss.tab === 'devices') body = r.clients.length ? `<table><thead><tr><th>Device</th><th>IP address</th><th>MAC address</th><th>Connected via</th></tr></thead><tbody>${r.clients.map(c => `<tr><td>${esc(c.host)}</td><td>${esc(c.ip || 'no address')}</td><td>${esc(c.mac)}</td><td>${esc(c.via.startsWith('lan') ? c.via.replace('lan', 'LAN ') : c.via + ' GHz')}</td></tr>`).join('')}</tbody></table>` : '<p class="muted">No devices are connected.</p>';
  else if (ss.tab === 'reboot') body = '<p class="muted">Restart the router. Every connection drops for about a minute.</p><button data-action="reboot">Reboot now</button>';
  return `<div class="admin"><div class="bar"><span>${esc(sc.routerModel)} · logged in as ${esc(sc.defaultUser)}</span><button data-action="logout">Log out</button></div><div class="rtabs" role="tablist">${tabs.map(([id, t]) => `<button role="tab" data-rtab="${id}" aria-selected="${ss.tab === id}">${t}</button>`).join('')}</div><div class="body">${body}</div></div>`;
}

function renderPc() {
  const s = st();
  document.querySelectorAll('[data-pctab]').forEach(b => b.setAttribute('aria-selected', b.dataset.pctab === app.pcTab));
  $('cmd-form').hidden = app.pcTab !== 'cmd';
  let html = '';
  if (app.pcTab === 'wifi') {
    const a = s.pc.adapter;
    if (!a.present) html = '<div class="win"><h3>Network &amp; internet</h3><p class="muted">No Wi-Fi adapter found on this PC.</p><p class="muted">Ethernet: ' + (s.pc.ethernet.lease ? 'Connected' : E.ethernetLinkUp(s) ? 'No internet' : 'Network cable unplugged') + '</p></div>';
    else if (a.driver !== 'installed') html = '<div class="win"><h3>Network &amp; internet</h3><p class="muted">Wi-Fi is unavailable. The wireless adapter has a driver problem; check Device Manager.</p></div>';
    else {
      const nets = E.pcVisibleNetworks(s);
      html = `<div class="win"><h3>Wi-Fi</h3>${nets.length ? `<ul class="netlist">${nets.map(n => `<li class="${s.pc.wifi.ssid === n.ssid ? 'joined' : ''}"><span><b>${esc(n.ssid)}</b><br><span class="muted" style="font-size:.75rem">${s.pc.wifi.ssid === n.ssid ? (s.pc.wifi.lease ? 'Connected, secured' : 'No internet, secured') : n.security === 'none' ? 'Open' : 'Secured'}</span></span><span class="band">${n.band} GHz</span>${s.pc.wifi.ssid === n.ssid ? '<button class="small" data-action="wifi-leave">Disconnect</button>' : `<button class="small" data-action="wifi-pick" data-ssid="${esc(n.ssid)}">Connect</button>`}</li>${app.wifiPick === n.ssid && s.pc.wifi.ssid !== n.ssid ? `<li><form data-form="wifi" data-ssid="${esc(n.ssid)}" class="row" style="width:100%"><label>Enter the network security key<input name="pass" type="password" data-draft="wifi-pass" value="${esc(v('wifi-pass', ''))}" autocomplete="off"></label><button type="submit" class="primary small">Next</button></form></li>` : ''}`).join('')}</ul>` : '<p class="muted">No networks found. Is the router on? Does this adapter support the band the network uses?</p>'}<p class="muted" style="font-size:.78rem">Ethernet: ${s.pc.ethernet.lease ? 'connected' : E.ethernetLinkUp(s) ? 'no internet' : 'cable unplugged'}</p></div>`;
    }
  } else if (app.pcTab === 'devmgr') {
    const a = s.pc.adapter;
    html = `<div class="win"><h3>Device Manager</h3><ul class="tree"><li class="h">BENCH-PC</li><li class="h">Network adapters</li><li><span class="okicon" aria-hidden="true">●</span>PCIe GbE Family Controller</li>${a.present ? `<li><span class="${a.driver === 'installed' ? 'okicon' : 'warnicon'}" aria-hidden="true">${a.driver === 'installed' ? '●' : '▲'}</span>${a.driver === 'installed' ? 'USB Wireless Adapter (802.11 ' + (a.bands.includes('5') ? 'a/b/g/n/ac' : 'b/g/n') + ')' : 'Unknown device (USB)'}${a.driver !== 'installed' ? ' <span class="muted">— the drivers for this device are not installed (Code 28)</span>' : ''}</li>` : ''}<li class="h">System devices</li><li><span class="okicon" aria-hidden="true">●</span>Intel Chipset Device Software</li></ul>
      ${a.present ? `<div class="row" style="margin-top:12px"><button class="small" data-action="driver" data-source="windows-update">Update driver: search automatically</button><button class="small" data-action="driver" data-source="manufacturer">Install driver from manufacturer’s site</button></div><p class="muted" style="font-size:.78rem">Properties › Driver: ${a.driver === 'installed' ? 'Provider Realtek · version 1030.55.220.2026 · date 12/03/2026' : 'No driver files are required or have been loaded for this device.'}<br>Supported bands (from the box): ${a.bands.join(' and ')} GHz.</p>` : '<p class="muted">Plug the USB wireless adapter into the PC on the bench and it will appear here.</p>'}</div>`;
  } else if (app.pcTab === 'printers') {
    const found = E.discoverPrinters(s);
    html = `<div class="win"><h3>Printers &amp; scanners</h3>${s.pc.printers.length ? s.pc.printers.map(p => `<p><b>${esc(p.name)}</b> · ${esc(p.ip)} · ${E.reachable(s, p.ip) ? 'Ready' : 'Offline'} <button class="small" data-action="test-page">Print test page</button></p>`).join('') : '<p class="muted">No printers are installed.</p>'}
      <div class="row"><button class="small primary" data-action="discover">Add device</button><button class="small" data-action="add-manually">Add manually</button></div>
      ${app.discoverResult ? `<p class="muted">${esc(app.discoverResult)}</p>` : ''}
      ${app.addByIp ? `<form data-form="add-ip" class="row"><label>Add a printer using an IP address or hostname<input name="ip" data-draft="pr-ip" value="${esc(v('pr-ip', ''))}" autocomplete="off" placeholder="192.168.x.x"></label><button type="submit" class="small primary">Next</button></form>` : ''}
      ${found.length && !s.pc.printers.length ? `<p class="muted" style="font-size:.78rem">Windows can see: ${esc(found[0].name)} at ${esc(found[0].ip)}.</p>` : ''}</div>`;
  } else if (app.pcTab === 'cmd') {
    html = `<pre class="cmd" id="cmd-out" aria-live="polite">Microsoft Windows [Version 10.0.26200.6584]\n(c) Microsoft Corporation. All rights reserved.\n\n${esc(s.pc.prompt.join('\n'))}</pre>`;
  }
  $('pc-page').innerHTML = html;
  const out = $('cmd-out'); if (out) out.scrollTop = out.scrollHeight;
}

function renderShow() {
  const s = st();
  const cands = E.ipv4LineCandidates(s);
  const ipv4 = `<div class="box"><h3>Point out the IPv4 address</h3>${cands.length ? `<form data-form="ipv4"><p class="small">From the last ipconfig you ran: which line is the PC’s IPv4 address on the network you are using?</p>${cands.map((c, i) => `<label><input type="radio" name="line" value="${esc(c.text)}" ${s.ipv4Choice === c.text ? 'checked' : ''}><span><code>${esc(c.text)}</code><br><span class="small">${esc(c.block)}</span></span></label>`).join('')}<button type="submit" class="small">Check</button></form>` : '<p class="small">Run <code>ipconfig</code> in the Command Prompt first.</p>'}${s.ipv4Choice ? `<p class="feedback ${s.events.includes('ipv4-chosen') ? 'good' : 'bad'}">${s.events.includes('ipv4-chosen') ? 'Correct: that is the address the router leased to the adapter in use.' : 'Not that line. The gateway is the router; the mask is not an address; IPv6 is a different address family. Look for "IPv4 Address" under the adapter that is connected.'}</p>` : ''}</div>`;
  const opts = [['router-only', 'Log in to the router and open the Connected devices page; it lists every device with its name, IP and MAC address.'], ['arp-only', 'Run arp -a on the PC; it lists every device on the network.'], ['both', 'Two ways: the router’s Connected devices page lists everything with a lease; on the PC, arp -a lists the devices this PC has recently talked to, so ping them first.'], ['ipconfig', 'Run ipconfig /all; the DHCP section lists all the devices the router has given addresses to.']];
  const explain = `<div class="box"><h3>Explain how to show the connected devices</h3><form data-form="explain"><p class="small">A colleague asks how to see what is on the network. Which explanation is complete and correct?</p>${opts.map(([val, t]) => `<label><input type="radio" name="choice" value="${val}" ${s.explainDevices === val ? 'checked' : ''}><span>${esc(t)}</span></label>`).join('')}<button type="submit" class="small">Check</button></form>${s.explainDevices ? `<p class="feedback ${s.explainDevices === 'both' ? 'good' : 'bad'}">${s.explainDevices === 'both' ? 'Correct. The router knows every lease; the PC only knows who it has talked to.' : s.explainDevices === 'arp-only' ? 'arp -a shows only the devices this PC has exchanged frames with, not the whole network.' : s.explainDevices === 'ipconfig' ? 'ipconfig only describes this PC’s own adapters.' : 'That is one good way; the PC-side method is expected too.'}</p>` : ''}</div>`;
  $('show-explain').innerHTML = ipv4 + explain;
}
function renderSheet() {
  const s = st(), sh = s.sheet;
  $('sheet-form').innerHTML = `<label>2.4 GHz network name<input name="ssid24" data-draft="sh-24" value="${esc(v('sh-24', sh.ssid24))}" autocomplete="off"></label><label>5 GHz network name<input name="ssid5" data-draft="sh-5" value="${esc(v('sh-5', sh.ssid5))}" autocomplete="off"></label><label>Security mode used<select name="security" data-draft="sh-sec"><option value="">Choose</option>${['WPA3-Personal', 'WPA2/WPA3-Personal', 'WPA2-Personal (AES)'].map(t => `<option ${v('sh-sec', sh.security) === t ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label>Where the passwords are kept<input name="passwords" data-draft="sh-pw" value="${esc(v('sh-pw', sh.passwords))}" placeholder="for example: client’s password manager" autocomplete="off"></label><label>Printer address<input name="printerIp" data-draft="sh-pr" value="${esc(v('sh-pr', sh.printerIp))}" autocomplete="off"></label><label>Packaging and old equipment<select name="packaging" data-draft="sh-pk"><option value="">Choose</option><option value="recycling" ${v('sh-pk', sh.packaging) === 'recycling' ? 'selected' : ''}>Cardboard to recycling, e-waste to a drop-off point</option><option value="general" ${v('sh-pk', sh.packaging) === 'general' ? 'selected' : ''}>General waste bin</option></select></label><label class="check wide"><input type="checkbox" name="stored" data-draft="sh-st" ${v('sh-st', sh.stored) ? 'checked' : ''}> Spare adapter stored in its packaging, in a cool dry place, and recorded</label><div class="wide"><button type="submit">Save job sheet</button></div>`;
}

// ---------- Events ----------
document.addEventListener('input', e => { const k = e.target.dataset?.draft; if (k) draft[k] = e.target.type === 'checkbox' ? e.target.checked : e.target.value; });

document.addEventListener('click', e => {
  const b = e.target.closest('[data-action],[data-mode],[data-pctab],[data-rtab]'); if (!b) return;
  if (b.dataset.mode) { app.mode = b.dataset.mode; ensure(app.mode); hintCount = 0; lastCurrent = null; app.wifiPick = null; app.addByIp = false; app.discoverResult = ''; for (const k of Object.keys(draft)) delete draft[k]; persist(); render(); return; }
  if (b.dataset.pctab) { app.pcTab = b.dataset.pctab; app.discoverResult = ''; if (app.pcTab === 'devmgr') commit(s => E.markEvent(s, 'devmgr-viewed')); else { persist(); render(); } if (app.pcTab === 'cmd') $('cmd').focus(); return; }
  if (b.dataset.rtab) { commit(s => E.setTab(s, b.dataset.rtab)); return; }
  const a = b.dataset.action;
  if (a === 'tick') { commit(s => E.tickItem(s, b.dataset.item)); }
  else if (a === 'resolve') commit(s => E.resolveDelivery(s, b.dataset.choice), b.dataset.choice === 'supplier' ? 'Supplier contacted; the replacement arrived.' : 'Noted. That does not resolve the discrepancy.');
  else if (a === 'power') commit(s => E.setRouterPower(s, !s.router.powered));
  else if (a === 'reset-click') { if (e.detail !== 0) return; /* mouse presses are handled by the pointer hold; keyboard activation uses the field */ doReset(Number($('hold-seconds').value) || 0); }
  else if (a === 'adapter') commit(s => E.plugAdapter(s, !s.pc.adapter.present), st().pc.adapter.present ? 'Adapter removed.' : 'Adapter plugged in. Give Windows a moment, then check Device Manager.');
  else if (a === 'printer-power') commit(s => E.setPrinterPower(s, !s.printer.powered));
  else if (a === 'logout') commit(s => E.logout(s));
  else if (a === 'reboot') commit(s => E.rebootRouter(s), 'Router rebooted. Wireless clients need to reconnect.');
  else if (a === 'dhcp') commit(s => E.setDhcp(s, b.checked));
  else if (a === 'wifi-pick') { app.wifiPick = b.dataset.ssid; clearDraft('wifi-pass'); render(); $('pc-page').querySelector('input[name=pass]')?.focus(); }
  else if (a === 'wifi-leave') commit(s => E.leaveWifi(s), 'Disconnected.');
  else if (a === 'driver') { const r = commit(s => E.installDriver(s, b.dataset.source)); if (r) notice(r.note, !r.ok); }
  else if (a === 'discover') { const r = commit(s => E.addPrinter(s, 'discover')); if (r) { app.discoverResult = r.note; if (!r.ok) app.addByIp = false; render(); } }
  else if (a === 'add-manually') { app.addByIp = true; app.discoverResult = ''; render(); $('pc-page').querySelector('input[name=ip]')?.focus(); }
  else if (a === 'test-page') { const r = commit(s => E.printTestPage(s)); if (r) notice(r.note, !r.ok); }
});

document.addEventListener('submit', e => {
  const f = e.target.closest('form[data-form]'); if (!f) return; e.preventDefault();
  const d = new FormData(f); const g = k => (d.get(k) ?? '').toString();
  switch (f.dataset.form) {
    case 'ethernet': commit(s => E.plugEthernet(s, g('port') || null, g('cable')), g('port') ? 'Cable plugged in. Watch the link light and check ipconfig.' : 'Cable unplugged.'); clearDraft('eth-port', 'eth-cable'); render(); break;
    case 'printer': { const r = commit(s => E.printerJoin(s, g('ssid'), g('pass'))); if (r) notice(r.note, !r.ok); break; }
    case 'phone': { const r = commit(s => E.phoneJoin(s, g('ssid').replace(/ \(\d(\.\d)? GHz\)$/, ''), g('pass'))); if (r) notice(r.note, !r.ok); break; }
    case 'login': { commit(s => E.login(s, g('user'), g('pass'))); if (st().router.session.loggedIn) { clearDraft('login-user', 'login-pass'); render(); notice('Logged in to the router.'); } break; }
    case 'password': { const ok = commit(s => { E.changeAdminPassword(s, g('current'), g('next'), g('confirm')); return true; }); if (ok) { clearDraft('pw-cur', 'pw-new', 'pw-conf', 'login-pass'); render(); notice('Password changed. The router ended the session; log in again with the new password.'); } break; }
    case 'radio': { const band = f.dataset.band, k = band === '5' ? 'r5' : 'r24'; const ok = commit(s => { E.setRadio(s, band, { enabled: d.has('enabled'), ssid: g('ssid'), security: g('security'), passphrase: g('passphrase') }); return true; }); if (ok) { clearDraft(`${k}-en`, `${k}-ssid`, `${k}-sec`, `${k}-pass`); render(); notice(`${band} GHz settings applied.`); } break; }
    case 'wifi': { const r = commit(s => E.joinWifi(s, f.dataset.ssid, g('pass'))); if (r) { notice(r.note, !r.ok); if (r.ok) { app.wifiPick = null; clearDraft('wifi-pass'); render(); } } break; }
    case 'add-ip': { const r = commit(s => E.addPrinter(s, 'ip', g('ip'))); if (r) { notice(r.note, !r.ok); if (r.ok) { app.addByIp = false; clearDraft('pr-ip'); render(); } } break; }
    case 'ipv4': { if (!g('line')) return notice('Choose a line first.', true); const ok = commit(s => E.chooseIpv4Line(s, g('line'))); if (ok !== null) notice(ok ? 'Correct.' : 'Not that line.', !ok); break; }
    case 'explain': { if (!g('choice')) return notice('Choose an explanation first.', true); const ok = commit(s => E.answerExplainDevices(s, g('choice'))); if (ok !== null) notice(ok ? 'Correct.' : 'Not quite.', !ok); break; }
    case 'sheet': commit(s => E.updateSheet(s, { ssid24: g('ssid24').trim(), ssid5: g('ssid5').trim(), security: g('security'), passwords: g('passwords'), printerIp: g('printerIp').trim(), stored: d.has('stored'), packaging: g('packaging') }), 'Job sheet saved.'); clearDraft('sh-24', 'sh-5', 'sh-sec', 'sh-pw', 'sh-pr', 'sh-pk', 'sh-st'); render(); break;
  }
});

$('url-form').addEventListener('submit', e => { e.preventDefault(); clearDraft('url'); commit(s => E.openUrl(s, $('url').value)); if (st().router.session.page === 'login') $('router-page').querySelector('input')?.focus(); });
$('cmd-form').addEventListener('submit', e => { e.preventDefault(); const line = $('cmd').value; $('cmd').value = ''; commit(s => E.runCommand(s, line)); $('cmd').focus(); });

// Press-and-hold reset
const holding = { pointer: false, start: 0, timer: 0 };
function doReset(seconds) { const r = commit(s => E.holdReset(s, seconds)); if (r) notice(r.reason, !r.reset); const o = $('hold-out'); if (o) o.textContent = ''; }
document.addEventListener('pointerdown', e => {
  const b = e.target.closest('#reset-btn'); if (!b || e.button !== 0) return;
  holding.pointer = true; holding.start = performance.now(); b.setPointerCapture?.(e.pointerId);
  document.querySelectorAll('.lights i').forEach(i => i.classList.add('blink'));
  holding.timer = setInterval(() => { const secs = (performance.now() - holding.start) / 1000; const o = $('hold-out'); if (o) o.textContent = `Holding… ${secs.toFixed(0)} s`; $('hold-seconds').value = Math.floor(secs); }, 200);
});
function endHold(e) {
  if (!holding.pointer) return; clearInterval(holding.timer);
  const elapsed = Math.round((performance.now() - holding.start) / 1000 * 10) / 10;
  holding.pointer = false; document.querySelectorAll('.lights i.blink').forEach(i => i.classList.remove('blink'));
  // A quick click counts as a press for the number of seconds in the field; a real hold uses the measured time.
  doReset(elapsed < 0.5 ? (Number($('hold-seconds').value) || 0) : elapsed);
}
document.addEventListener('pointerup', endHold); document.addEventListener('pointercancel', endHold);

$('hint-button').addEventListener('click', () => { hintCount += 1; renderBrief(); });
$('reseed').addEventListener('click', () => { app.states.second = E.newState('second'); delete app.completed.second; hintCount = 0; lastCurrent = null; persist(); render(); notice('A different router, different addresses and a new fault mix.'); });
$('save').addEventListener('click', () => persist(true));
$('export').addEventListener('click', () => {
  const text = JSON.stringify(pack(), null, 1);
  try { const blob = new Blob([text], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `home-wifi-practical-${new Date().toISOString().slice(0, 10)}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); notice('Progress exported.'); }
  catch { $('session-data').hidden = false; $('session-text').value = text; }
});
$('import').addEventListener('change', async e => { const file = e.target.files?.[0]; e.target.value = ''; if (!file) return; try { app = validate(JSON.parse(await file.text())); ensure(app.mode); persist(); render(); notice('Progress loaded.'); } catch (err) { notice(err.message, true); } });
$('load-text').addEventListener('click', () => { try { app = validate(JSON.parse($('session-text').value)); ensure(app.mode); persist(); render(); notice('Progress loaded.'); $('session-data').hidden = true; } catch (err) { notice(err.message, true); } });
$('close-text').addEventListener('click', () => { $('session-data').hidden = true; });
$('reset-mode').addEventListener('click', () => {
  if (!resetArmed) { resetArmed = true; $('reset-mode').textContent = 'Confirm: start this mode again'; setTimeout(() => { resetArmed = false; $('reset-mode').textContent = 'Reset this mode'; }, 5000); return; }
  resetArmed = false; $('reset-mode').textContent = 'Reset this mode'; app.states[app.mode] = E.newState(app.mode); delete app.completed[app.mode]; hintCount = 0; lastCurrent = null; for (const k of Object.keys(draft)) delete draft[k]; persist(); render(); notice(`${MODE_LABEL[app.mode]} started again from the box.`);
});
document.addEventListener('visibilitychange', () => { if (document.hidden) persist(); });

restore();
render();
