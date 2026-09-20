// Home Wi-Fi Practical (ICTSAS217): pure state model. No DOM. Every pane and every
// command-prompt line is derived from this state, never canned.

export const SECURITY = {
  none: 'None (open)', wep: 'WEP', 'wpa-tkip': 'WPA-Personal (TKIP)',
  wpa2: 'WPA2-Personal (AES)', wpa2wpa3: 'WPA2/WPA3-Personal', wpa3: 'WPA3-Personal'
};
export const ACCEPTED_SECURITY = ['wpa3', 'wpa2wpa3', 'wpa2'];
export const FAULTS = {
  adapter24only: 'The supplied USB adapter only supports the 2.4 GHz band.',
  driverMissing: 'Windows has no driver for the adapter; it must be installed from the manufacturer.',
  radio5Off: 'The router ships with its 5 GHz radio switched off.',
  badCable: 'One of the two Ethernet cables in the box is damaged.',
  missingItem: 'The power supply is missing from the delivery.'
};
const PHONE_MAC = 'A4-83-E7-12-9C-01', PC_ETH_MAC = '3C-7C-3F-5A-22-10', PC_WIFI_MAC = '98-DE-D0-44-71-8B', PRINTER_MAC = '00-1E-8F-73-2A-55';

export const SCENARIOS = {
  first: {
    id: 'first', name: 'First occasion', routerModel: 'Homeway HW-2200 dual-band router', lanAddress: '192.168.1.1',
    defaultUser: 'admin', defaultPass: 'admin', defaultSsid: 'Homeway-2200', defaultPassphrase: 'hw2200guest',
    printerModel: 'Officejet 4200 wireless printer', printerAddress: '192.168.1.144', dhcpStart: 100, faults: []
  },
  second: {
    id: 'second', name: 'Second occasion', routerModel: 'Arafura AR-9 dual-band router', lanAddress: '192.168.0.1',
    defaultUser: 'admin', defaultPass: 'password', defaultSsid: 'Arafura-AR9', defaultPassphrase: 'ar9wireless',
    printerModel: 'LaserPrint LP-330 wireless printer', printerAddress: '192.168.0.150', dhcpStart: 20, faults: null
  },
  free: {
    id: 'free', name: 'Free bench', routerModel: 'Homeway HW-2200 dual-band router', lanAddress: '192.168.1.1',
    defaultUser: 'admin', defaultPass: 'admin', defaultSsid: 'Homeway-2200', defaultPassphrase: 'hw2200guest',
    printerModel: 'Officejet 4200 wireless printer', printerAddress: '192.168.1.144', dhcpStart: 100, faults: []
  }
};

export function clone(x) { return JSON.parse(JSON.stringify(x)); }
export function ipv4(s) { return typeof s === 'string' && /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/.test(s.trim()); }
function net(ip) { return ip.split('.').slice(0, 3).join('.'); }

export function pickFaults(seed = Date.now()) {
  const pool = Object.keys(FAULTS); let s = seed >>> 0;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 2 ** 32; };
  const a = pool.splice(Math.floor(rnd() * pool.length), 1)[0];
  const b = pool.splice(Math.floor(rnd() * pool.length), 1)[0];
  return [a, b];
}

export function newState(scenarioId = 'first', faults) {
  const sc = clone(SCENARIOS[scenarioId] || SCENARIOS.first);
  sc.faults = faults ?? (sc.faults || pickFaults());
  const f = k => sc.faults.includes(k);
  const items = [
    { name: 'Router', present: true }, { name: 'Power supply', present: !f('missingItem') },
    { name: 'Ethernet cable A', present: true }, { name: 'Ethernet cable B', present: true },
    { name: 'Quick start guide', present: true }, { name: 'USB wireless adapter (separate box)', present: true }
  ];
  return {
    scenario: sc,
    delivery: { items, ticked: [], resolution: null },
    router: {
      powered: false, everReset: false, adminPassword: sc.defaultPass, lanAddress: sc.lanAddress,
      dhcp: { enabled: true, start: sc.dhcpStart, next: sc.dhcpStart },
      radios: {
        g24: { enabled: true, ssid: sc.defaultSsid, security: 'wpa2', passphrase: sc.defaultPassphrase },
        g5: { enabled: !f('radio5Off'), ssid: sc.defaultSsid + '-5G', security: 'wpa2', passphrase: sc.defaultPassphrase }
      },
      clients: [], // {mac, host, ip, via: 'lan1'|'2.4'|'5'}
      session: { url: '', page: 'blank', loggedIn: false, tab: 'status', loginFailed: false }
    },
    pc: {
      ethernet: { cable: null, port: null, lease: null }, // port: lan1..lan4 | internet
      adapter: { present: false, driver: 'none', bands: f('adapter24only') ? ['2.4'] : ['2.4', '5'] },
      wifi: { ssid: null, lease: null, band: null }, arp: [], printers: [], lastIpconfig: null, prompt: []
    },
    printer: { powered: true, ssid: null, address: sc.printerAddress },
    phone: { ssid: null },
    sheet: { ssid24: '', ssid5: '', security: '', passwords: '', printerIp: '', stored: false, packaging: '' },
    events: [], explainDevices: null, ipv4Choice: null
  };
}

function log(st, e) { if (!st.events.includes(e)) st.events.push(e); }
function fault(st, k) { return st.scenario.faults.includes(k); }
function nextLease(st) { const ip = `${net(st.router.lanAddress)}.${st.router.dhcp.next}`; st.router.dhcp.next += 1; return ip; }
function dropClient(st, mac) { st.router.clients = st.router.clients.filter(c => c.mac !== mac); }
export function radioFor(st, band) { return st.router.radios[band === '5' ? 'g5' : 'g24']; }

// ---------- Delivery ----------
export function tickItem(st, name) { const it = st.delivery.items.find(i => i.name === name); if (!it) throw Error('No such item on the packing list.'); if (!st.delivery.ticked.includes(name)) st.delivery.ticked.push(name); log(st, 'delivery-checked'); }
export function resolveDelivery(st, choice) {
  const missing = st.delivery.items.filter(i => !i.present);
  if (!missing.length) throw Error('Nothing is missing from this delivery.');
  st.delivery.resolution = choice;
  if (choice === 'supplier') { missing.forEach(i => { i.present = true; i.replaced = true; }); log(st, 'delivery-resolved'); }
}
export function deliveryComplete(st) {
  const all = st.delivery.items.every(i => st.delivery.ticked.includes(i.name));
  const missing = st.delivery.items.some(i => !i.present);
  return all && !missing && (!st.delivery.items.some(i => i.replaced) || st.delivery.resolution === 'supplier');
}

// ---------- Bench: router ----------
export function setRouterPower(st, on) {
  if (on && !st.delivery.items.find(i => i.name === 'Power supply').present) throw Error('There is no power supply to plug in.');
  st.router.powered = !!on;
  if (!on) { st.router.clients = []; st.pc.ethernet.lease = null; st.pc.wifi = { ssid: null, lease: null, band: null }; st.router.session = { url: '', page: 'blank', loggedIn: false, tab: 'status', loginFailed: false }; }
  else refreshLinks(st);
}
export function holdReset(st, seconds) {
  if (!st.router.powered) return { reset: false, reason: 'The router is not powered on, so nothing happened.' };
  if (!(seconds >= 10)) return { reset: false, reason: `Held for ${seconds} seconds; the lights did not change. Most routers need the button held for 10 to 15 seconds.` };
  const sc = st.scenario;
  st.router.adminPassword = sc.defaultPass;
  st.router.dhcp = { enabled: true, start: sc.dhcpStart, next: sc.dhcpStart };
  st.router.radios.g24 = { enabled: true, ssid: sc.defaultSsid, security: 'wpa2', passphrase: sc.defaultPassphrase };
  st.router.radios.g5 = { enabled: !fault(st, 'radio5Off'), ssid: sc.defaultSsid + '-5G', security: 'wpa2', passphrase: sc.defaultPassphrase };
  st.router.clients = []; st.router.everReset = true;
  st.router.session = { url: '', page: 'blank', loggedIn: false, tab: 'status', loginFailed: false };
  st.pc.wifi = { ssid: null, lease: null, band: null }; st.printer.ssid = null; st.phone.ssid = null; st.pc.arp = []; st.pc.ethernet.lease = null;
  log(st, 'reset');
  refreshLinks(st);
  return { reset: true, reason: 'The lights flashed and cycled. After a minute the power light is steady: factory defaults restored.' };
}

// ---------- Bench: cables and adapter ----------
export function plugEthernet(st, port, cable) {
  if (port && !['lan1', 'lan2', 'lan3', 'lan4', 'internet'].includes(port)) throw Error('Unknown router port.');
  if (port && !cable) throw Error('Choose which cable to use.');
  if (port && !st.delivery.items.find(i => i.name === `Ethernet cable ${cable}`)?.present) throw Error('That cable is not in the box.');
  st.pc.ethernet.port = port || null; st.pc.ethernet.cable = port ? cable : null;
  refreshLinks(st);
}
export function ethernetLinkUp(st) {
  const e = st.pc.ethernet;
  return !!(e.port && st.router.powered && !(fault(st, 'badCable') && e.cable === 'A'));
}
export function plugAdapter(st, present) {
  st.pc.adapter.present = !!present;
  if (present) st.pc.adapter.driver = fault(st, 'driverMissing') ? 'missing' : 'installed';
  else { st.pc.adapter.driver = 'none'; leaveWifi(st); }
}
export function installDriver(st, source) {
  if (!st.pc.adapter.present) throw Error('No adapter is plugged in.');
  if (source === 'windows-update') return { ok: false, note: 'Windows Update found no driver for this adapter.' };
  if (source === 'manufacturer') { st.pc.adapter.driver = 'installed'; log(st, 'driver-installed'); return { ok: true, note: 'Driver installed from the manufacturer\u2019s support site. The adapter now shows without a warning.' }; }
  throw Error('Unknown driver source.');
}
export function adapterReady(st) { return st.pc.adapter.present && st.pc.adapter.driver === 'installed'; }

function refreshLinks(st) {
  // Ethernet lease
  const e = st.pc.ethernet;
  dropClient(st, PC_ETH_MAC);
  if (ethernetLinkUp(st) && e.port !== 'internet' && st.router.dhcp.enabled) {
    if (!e.lease) e.lease = nextLease(st);
    log(st, 'wired-lease');
    st.router.clients.push({ mac: PC_ETH_MAC, host: 'BENCH-PC', ip: e.lease, via: e.port });
  } else e.lease = null;
  // Wi-Fi client re-validation
  if (st.pc.wifi.ssid) {
    const r = radioFor(st, st.pc.wifi.band);
    if (!st.router.powered || !r.enabled || r.ssid !== st.pc.wifi.ssid || !adapterReady(st)) leaveWifi(st);
    else { dropClient(st, PC_WIFI_MAC); st.router.clients.push({ mac: PC_WIFI_MAC, host: 'BENCH-PC', ip: st.pc.wifi.lease, via: st.pc.wifi.band }); }
  }
  for (const [dev, mac] of [[st.printer, PRINTER_MAC], [st.phone, PHONE_MAC]]) {
    dropClient(st, mac);
    if (dev.ssid) {
      const band = dev === st.printer ? '2.4' : (st.router.radios.g5.ssid === dev.ssid && st.router.radios.g5.enabled ? '5' : '2.4');
      const r = radioFor(st, band);
      if (!st.router.powered || !r.enabled || r.ssid !== dev.ssid || (dev === st.printer && !dev.powered)) dev.ssid = null;
      else st.router.clients.push({ mac, host: dev === st.printer ? 'PRINTER' : 'Phone', ip: dev === st.printer ? dev.address : dev.lease, via: band });
    }
  }
  if (!st.pc.ethernet.lease && !st.pc.wifi.lease) st.router.session = { ...st.router.session, page: st.router.session.url ? 'unreachable' : 'blank', loggedIn: false };
}

// ---------- Router admin session ----------
export function pcOnLan(st) { return !!(st.pc.ethernet.lease || st.pc.wifi.lease); }
export function openUrl(st, text) {
  const s = st.router.session; s.url = (text || '').trim(); s.loggedIn = false; s.loginFailed = false;
  const bare = s.url.replace(/^https?:\/\//i, '').replace(/\/.*$/, '');
  if (!s.url) { s.page = 'blank'; return; }
  if (bare === st.router.lanAddress) { s.page = (st.router.powered && pcOnLan(st)) ? 'login' : 'unreachable'; if (s.page === 'login') log(st, 'router-page-opened'); return; }
  if (ipv4(bare)) { s.page = 'unreachable'; return; }
  s.page = 'search';
}
export function login(st, user, pass) {
  const s = st.router.session;
  if (s.page !== 'login' && !s.loggedIn) throw Error('Open the router\u2019s address first.');
  if (user === st.scenario.defaultUser && pass === st.router.adminPassword) {
    s.loggedIn = true; s.page = 'admin'; s.tab = 'status'; s.loginFailed = false;
    log(st, st.router.adminPassword === st.scenario.defaultPass ? 'login-default' : 'login-new');
  } else { s.loginFailed = true; if (pass === st.scenario.defaultPass && st.router.adminPassword !== st.scenario.defaultPass) log(st, 'old-password-rejected'); }
}
export function logout(st) { const s = st.router.session; s.loggedIn = false; s.page = 'login'; }
export function setTab(st, tab) { if (!st.router.session.loggedIn) throw Error('Not logged in.'); st.router.session.tab = tab; if (tab === 'devices') log(st, 'devices-viewed'); }
export function changeAdminPassword(st, current, next, confirm) {
  if (!st.router.session.loggedIn) throw Error('Log in to the router first.');
  if (current !== st.router.adminPassword) throw Error('The current password is wrong.');
  if (next === st.scenario.defaultPass) throw Error('That is the factory default; choose a different password.');
  if (!next || next.length < 8) throw Error('Choose a password of at least 8 characters.');
  if (next !== confirm) throw Error('The new password and its confirmation do not match.');
  st.router.adminPassword = next; log(st, 'password-changed');
  st.router.session = { ...st.router.session, loggedIn: false, page: 'login', loginFailed: false }; // router restarts its web session
}
export function setRadio(st, band, values) {
  if (!st.router.session.loggedIn) throw Error('Log in to the router first.');
  const r = radioFor(st, band);
  const ssid = (values.ssid ?? r.ssid).trim();
  if (!ssid || ssid.length > 32) throw Error('An SSID must be 1 to 32 characters.');
  if (!(values.security in SECURITY)) throw Error('Unknown security mode.');
  const pass = values.security === 'none' ? '' : (values.passphrase ?? r.passphrase);
  if (values.security !== 'none' && pass.length < 8) throw Error('A Wi-Fi passphrase must be at least 8 characters.');
  const prevSsid = r.ssid, prevPass = r.passphrase;
  Object.assign(r, { enabled: values.enabled ?? r.enabled, ssid, security: values.security, passphrase: pass });
  log(st, `radio-${band === '5' ? '5' : '24'}-saved`);
  // Applying settings drops clients whose credentials no longer match.
  const changed = prevSsid !== ssid || prevPass !== pass || !r.enabled;
  if (changed && st.pc.wifi.ssid === prevSsid) leaveWifi(st);
  if (changed && band !== '5' && st.printer.ssid === prevSsid) st.printer.ssid = null;
  if (changed && st.phone.ssid === prevSsid) st.phone.ssid = null;
  refreshLinks(st);
}
export function setDhcp(st, enabled) { if (!st.router.session.loggedIn) throw Error('Log in to the router first.'); st.router.dhcp.enabled = !!enabled; if (!enabled) { st.pc.ethernet.lease = null; leaveWifi(st); } refreshLinks(st); }
export function rebootRouter(st) { if (!st.router.session.loggedIn) throw Error('Log in to the router first.'); setRouterPower(st, false); setRouterPower(st, true); }

// ---------- Wi-Fi clients ----------
export function visibleNetworks(st) {
  if (!st.router.powered) return [];
  const out = [];
  for (const [band, key] of [['2.4', 'g24'], ['5', 'g5']]) { const r = st.router.radios[key]; if (r.enabled) out.push({ band, ssid: r.ssid, security: r.security }); }
  return out;
}
export function pcVisibleNetworks(st) { if (!adapterReady(st)) return []; return visibleNetworks(st).filter(n => st.pc.adapter.bands.includes(n.band)); }
export function joinWifi(st, ssid, passphrase) {
  if (!st.pc.adapter.present) throw Error('There is no wireless adapter in this PC.');
  if (st.pc.adapter.driver !== 'installed') throw Error('The wireless adapter has no working driver.');
  const n = pcVisibleNetworks(st).find(x => x.ssid === ssid);
  if (!n) throw Error(`"${ssid}" is not in the list of networks this adapter can see.`);
  const r = radioFor(st, n.band);
  if (r.security !== 'none' && passphrase !== r.passphrase) { log(st, 'wifi-wrong-passphrase'); return { ok: false, note: 'Can\u2019t connect to this network. Check the network security key and try again.' }; }
  if (!st.router.dhcp.enabled) { st.pc.wifi = { ssid, band: n.band, lease: null, pass: passphrase }; return { ok: true, note: 'Connected, but no IP address was assigned. The network shows "No internet" and the address is 169.254.x.x.' }; }
  st.pc.wifi = { ssid, band: n.band, lease: nextLease(st), pass: passphrase };
  log(st, 'wifi-joined'); refreshLinks(st);
  return { ok: true, note: `Connected to ${ssid} on the ${n.band} GHz band.` };
}
export function leaveWifi(st) { st.pc.wifi = { ssid: null, lease: null, band: null }; dropClient(st, PC_WIFI_MAC); }
export function printerJoin(st, ssid, passphrase) {
  if (!st.printer.powered) throw Error('The printer is switched off.');
  const n = visibleNetworks(st).find(x => x.ssid === ssid && x.band === '2.4');
  if (!n) throw Error(`The printer cannot see a 2.4 GHz network called "${ssid}". Most printers only use 2.4 GHz.`);
  const r = radioFor(st, '2.4');
  if (r.security !== 'none' && passphrase !== r.passphrase) return { ok: false, note: 'The printer reports "authentication failed". Check the passphrase.' };
  st.printer.ssid = ssid; st.printer.pass = passphrase; log(st, 'printer-joined'); refreshLinks(st);
  return { ok: true, note: `Printer joined ${ssid}. Its network page shows address ${st.printer.address}.` };
}
export function setPrinterPower(st, on) { st.printer.powered = !!on; if (!on) st.printer.ssid = null; refreshLinks(st); }
export function phoneJoin(st, ssid, passphrase) {
  const n = visibleNetworks(st).find(x => x.ssid === ssid);
  if (!n) throw Error(`The phone cannot see "${ssid}".`);
  const r = radioFor(st, n.band);
  if (r.security !== 'none' && passphrase !== r.passphrase) return { ok: false, note: 'Incorrect password.' };
  if (!st.router.dhcp.enabled) return { ok: false, note: 'Joined, but no address was assigned.' };
  st.phone.ssid = ssid; st.phone.lease = nextLease(st); refreshLinks(st);
  return { ok: true, note: `Phone joined ${ssid} (${n.band} GHz).` };
}

// ---------- Printers on the PC ----------
export function reachable(st, ip) {
  if (!pcOnLan(st) || !st.router.powered) return false;
  if (ip === st.router.lanAddress) return true;
  if (ip === st.printer.address) return !!st.printer.ssid;
  if (st.phone.ssid && ip === st.phone.lease) return true;
  return false;
}
export function discoverPrinters(st) { return (st.printer.ssid && reachable(st, st.printer.address)) ? [{ name: st.scenario.printerModel, ip: st.printer.address }] : []; }
export function addPrinter(st, method, ip) {
  if (method === 'discover') { const p = discoverPrinters(st)[0]; if (!p) return { ok: false, note: 'No printers were found. If yours is not listed, choose "Add manually".' }; addP(st, p.ip, 'discover'); return { ok: true, note: `${p.name} added.` }; }
  if (method === 'ip') { if (!ipv4(ip)) throw Error('Type a valid IPv4 address.'); if (!reachable(st, ip.trim()) || ip.trim() !== st.printer.address) return { ok: false, note: `Windows can\u2019t find a printer at ${ip}. Check the address and that the printer is on the same network.` }; addP(st, ip.trim(), 'ip'); return { ok: true, note: `Printer at ${ip} added.` }; }
  throw Error('Unknown method.');
}
function addP(st, ip, how) { if (!st.pc.printers.some(p => p.ip === ip)) st.pc.printers.push({ name: st.scenario.printerModel, ip, how }); log(st, 'printer-added'); }
export function printTestPage(st) {
  const p = st.pc.printers[0]; if (!p) throw Error('No printer is installed on this PC.');
  if (!reachable(st, p.ip)) return { ok: false, note: 'The printer is offline. Windows queued the page and shows "Error, printing".' };
  log(st, 'test-page'); return { ok: true, note: 'A test page came out of the printer.' };
}

// ---------- Command Prompt ----------
function fakeLinkLocal(mac) { return `169.254.${parseInt(mac.slice(-5, -3), 16)}.${parseInt(mac.slice(-2), 16)}`; }
function adapterBlocks(st, all) {
  const gw = st.router.lanAddress, blocks = [];
  const eth = st.pc.ethernet, up = ethernetLinkUp(st);
  blocks.push({ title: 'Ethernet adapter Ethernet:', mac: PC_ETH_MAC, up, lease: eth.lease, all });
  if (st.pc.adapter.present) blocks.push({ title: 'Wireless LAN adapter Wi-Fi:', mac: PC_WIFI_MAC, up: !!st.pc.wifi.ssid, lease: st.pc.wifi.lease, all, ssid: st.pc.wifi.ssid });
  return blocks.map(b => {
    const l = ['', b.title];
    if (b.all) l.push('   Description . . . . . . . . . . . : ' + (b.title.startsWith('Wireless') ? 'USB Wireless Adapter' : 'PCIe GbE Family Controller'), '   Physical Address. . . . . . . . . : ' + b.mac, '   DHCP Enabled. . . . . . . . . . . : Yes');
    if (!b.up) { l.push('   Media State . . . . . . . . . . . : Media disconnected'); return l; }
    if (b.lease) { l.push('   Link-local IPv6 Address . . . . . : fe80::9d2a:' + b.mac.slice(-5).replace('-', '') + ':1%12', '   IPv4 Address. . . . . . . . . . . : ' + b.lease + '(Preferred)', '   Subnet Mask . . . . . . . . . . . : 255.255.255.0', '   Default Gateway . . . . . . . . . : ' + gw); if (b.all) l.push('   DHCP Server . . . . . . . . . . . : ' + gw, '   DNS Servers . . . . . . . . . . . : ' + gw); }
    else l.push('   Link-local IPv6 Address . . . . . : fe80::9d2a:' + b.mac.slice(-5).replace('-', '') + ':1%12', '   Autoconfiguration IPv4 Address. . : ' + fakeLinkLocal(b.mac) + '(Preferred)', '   Subnet Mask . . . . . . . . . . . : 255.255.0.0', '   Default Gateway . . . . . . . . . : ');
    return l;
  }).flat();
}
export function runCommand(st, line) {
  const raw = (line || '').trim(); const parts = raw.split(/\s+/); const cmd = (parts[0] || '').toLowerCase(); const args = parts.slice(1).map(a => a.toLowerCase());
  let out = [];
  if (!raw) out = [];
  else if (cmd === 'cls') { st.pc.prompt = []; return []; }
  else if (cmd === 'ipconfig') {
    if (args[0] === '/release') { st.pc.ethernet.lease = null; leaveWifi(st); refreshLinks(st); out = ['', 'Windows IP Configuration', '', ...adapterBlocks(st, false)]; }
    else if (args[0] === '/renew') { refreshLinks(st); out = ['', 'Windows IP Configuration', '', ...adapterBlocks(st, false)]; }
    else if (args[0] === '/all' || !args[0]) { out = ['', 'Windows IP Configuration', '', ...adapterBlocks(st, args[0] === '/all')]; st.pc.lastIpconfig = out.slice(); log(st, 'ipconfig'); }
    else out = [`Error: unrecognized or incomplete command line.`];
  }
  else if (cmd === 'ping') {
    const target = parts.find((p, i) => i > 0 && !p.startsWith('-'));
    if (!target) out = ['Usage: ping [-t] [-4] [-6] target_name'];
    else out = pingOutput(st, target);
  }
  else if (cmd === 'arp' && args[0] === '-a') {
    log(st, 'arp');
    const src = st.pc.wifi.lease || st.pc.ethernet.lease;
    if (!src) out = ['No ARP Entries Found.'];
    else { out = ['', `Interface: ${src} --- 0xc`, '  Internet Address      Physical Address      Type']; for (const e of st.pc.arp) out.push(`  ${e.ip.padEnd(22)}${e.mac.toLowerCase().padEnd(22)}dynamic`); out.push(`  ${net(src)}.255`.padEnd(24) + 'ff-ff-ff-ff-ff-ff     static'); }
  }
  else if (cmd === 'netsh' && args[0] === 'wlan' && args[1] === 'show' && args[2] === 'networks') {
    if (!adapterReady(st)) out = ['There is no wireless interface on the system.'];
    else { const nets = pcVisibleNetworks(st); out = ['', `Interface name : Wi-Fi`, `There are ${nets.length} networks currently visible.`]; nets.forEach((n, i) => out.push('', `SSID ${i + 1} : ${n.ssid}`, `    Network type            : Infrastructure`, `    Authentication          : ${n.security === 'none' ? 'Open' : n.security === 'wep' ? 'WEP' : n.security === 'wpa-tkip' ? 'WPA-Personal' : n.security === 'wpa3' ? 'WPA3-Personal' : 'WPA2-Personal'}`, `    Encryption              : ${n.security === 'none' ? 'None' : n.security === 'wep' ? 'WEP' : n.security === 'wpa-tkip' ? 'TKIP' : 'CCMP'}`, args[3] === 'mode=bssid' ? `    Band                    : ${n.band} GHz` : null)); out = out.filter(l => l !== null); log(st, 'netsh-networks'); }
  }
  else if (cmd === 'netsh' && args[0] === 'wlan' && args[1] === 'show' && args[2] === 'interfaces') {
    if (!adapterReady(st)) out = ['There is no wireless interface on the system.'];
    else if (!st.pc.wifi.ssid) out = ['', '    Name                   : Wi-Fi', '    State                  : disconnected'];
    else out = ['', '    Name                   : Wi-Fi', `    SSID                   : ${st.pc.wifi.ssid}`, `    Band                   : ${st.pc.wifi.band} GHz`, `    Authentication         : ${SECURITY[radioFor(st, st.pc.wifi.band).security]}`, '    State                  : connected', '    Signal                 : 86%'];
  }
  else if (cmd === 'help') out = ['This bench prompt understands: ipconfig, ipconfig /all, ipconfig /release, ipconfig /renew, ping, arp -a, netsh wlan show networks [mode=bssid], netsh wlan show interfaces, cls.'];
  else out = [`'${parts[0]}' is not recognized as an internal or external command,`, 'operable program or batch file.'];
  st.pc.prompt.push(`C:\\Users\\student>${raw}`, ...out, '');
  if (st.pc.prompt.length > 400) st.pc.prompt = st.pc.prompt.slice(-400);
  return out;
}
function pingOutput(st, target) {
  const src = st.pc.wifi.lease || st.pc.ethernet.lease;
  let ip = target, resolved = null;
  if (!ipv4(target)) {
    if (!src) return [`Ping request could not find host ${target}. Please check the name and try again.`];
    if (/^(www\.)?cdu\.edu\.au$/i.test(target)) { resolved = '138.80.0.10'; ip = resolved; }
    else return [`Ping request could not find host ${target}. Please check the name and try again.`];
  }
  const head = resolved ? `Pinging ${target} [${resolved}] with 32 bytes of data:` : `Pinging ${ip} with 32 bytes of data:`;
  const ok = resolved ? (src && st.router.powered) : reachable(st, ip);
  const l = ['', head];
  if (ok) { const t = ip === st.router.lanAddress ? 1 : resolved ? 24 : 3; for (let i = 0; i < 4; i++) l.push(`Reply from ${ip}: bytes=32 time=${t + (i % 2)}ms TTL=${resolved ? 55 : 64}`); l.push('', `Ping statistics for ${ip}:`, '    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss),'); if (!resolved) { const mac = ip === st.router.lanAddress ? 'B0-4E-26-7A-11-C2' : ip === st.printer.address ? PRINTER_MAC : PHONE_MAC; if (!st.pc.arp.some(e => e.ip === ip)) st.pc.arp.push({ ip, mac }); } log(st, `ping-ok:${ip === st.printer.address ? 'printer' : ip === st.router.lanAddress ? 'router' : resolved ? 'internet' : 'other'}`); }
  else { if (!src) { l.pop(); l.push('PING: transmit failed. General failure.'); return l; } for (let i = 0; i < 4; i++) l.push('Request timed out.'); l.push('', `Ping statistics for ${ip}:`, '    Packets: Sent = 4, Received = 0, Lost = 4 (100% loss),'); }
  return l;
}
export function ipv4LineCandidates(st) {
  const out = st.pc.lastIpconfig; if (!out) return [];
  const lines = []; let block = '';
  for (const l of out) { if (/adapter/.test(l)) block = l; else if (/^\s+(IPv4 Address|Autoconfiguration IPv4|Subnet Mask|Default Gateway|Link-local IPv6)/.test(l) && l.split(':')[1]?.trim()) lines.push({ block, text: l.trim() }); }
  return lines;
}
export function chooseIpv4Line(st, text) {
  st.ipv4Choice = text;
  const lease = st.pc.wifi.lease || st.pc.ethernet.lease;
  const ok = !!lease && /^IPv4 Address/.test(text) && text.includes(lease);
  if (ok) log(st, 'ipv4-chosen'); return ok;
}
export function answerExplainDevices(st, choice) { st.explainDevices = choice; if (choice === 'both') log(st, 'explain-devices-ok'); return choice === 'both'; }
export function updateSheet(st, values) { Object.assign(st.sheet, values); }

// ---------- Checkpoints ----------
const has = (st, e) => st.events.includes(e);
const securityOk = r => ACCEPTED_SECURITY.includes(r.security) && r.passphrase.length >= 12;
export const CHECKPOINTS = [
  { id: 'delivery', title: 'Check the delivery', brief: 'Tick every item on the packing list against what is in the box. If anything is missing, decide what to do about it before you start.',
    hints: ['The packing list is on the bench pane. Every line needs a tick.', 'Something missing is the supplier\u2019s problem to fix, not yours to work around.', 'Tick each item; if one is missing, choose "Contact the supplier" and wait for the replacement.'],
    check: st => ({ done: deliveryComplete(st), note: st.delivery.resolution && st.delivery.resolution !== 'supplier' ? 'Starting without a part, or borrowing one, is not how a discrepancy is resolved.' : '' }) },
  { id: 'reset', title: 'Factory reset the router', brief: 'The router has been used before. Power it on and return it to factory settings so you start from a known state.',
    hints: ['The reset button is recessed on the back of the router.', 'Three seconds is not enough. Watch the lights.', 'With the router powered on, hold Reset for 10 to 15 seconds until the lights flash, then wait for the power light to go steady.'],
    check: st => ({ done: has(st, 'reset') && st.router.everReset, note: '' }) },
  { id: 'wired', title: 'Connect the PC by cable', brief: 'Connect the bench PC to the router with an Ethernet cable so the router can be configured over a link that will not drop.',
    hints: ['A wired session survives Wi-Fi changes; a wireless one drops the moment you save.', 'The Internet port is for the nbn box, not the PC.', 'Plug a cable from the PC into LAN 1 to 4, then check ipconfig shows an address in the router\u2019s range. If it shows 169.254, try the other cable.'],
    check: st => ({ done: has(st, 'wired-lease'), note: st.pc.ethernet.port === 'internet' ? 'The cable is in the Internet (WAN) port.' : (st.pc.ethernet.port && !ethernetLinkUp(st) ? 'The link light is off. Check the cable.' : '') }) },
  { id: 'login', title: 'Log in to the router', brief: 'Open the router\u2019s management page in the browser and sign in with the factory credentials from the label.',
    hints: ['The address is on the sticker on the base of the router (the dashed box on the router card), and it is also the Default Gateway in ipconfig.', 'Type it in the address bar, not the search box.', 'Browse to the router\u2019s address and sign in with the default user name and password printed on the sticker.'],
    check: st => ({ done: has(st, 'login-default') || has(st, 'login-new'), note: st.router.session.page === 'search' ? 'That went to a web search. Type the address in the address bar.' : '' }) },
  { id: 'adminpw', title: 'Change the administrator password', brief: 'Default router passwords are public knowledge. Replace it, then prove the change by logging in again with the new one.',
    hints: ['Look under Administration.', 'The router will end your session when the password changes; that is normal.', 'Administration > Router password: enter the current password, a new one of 8 or more characters, confirm, Save. Then log in again with the new password.'],
    check: st => ({ done: has(st, 'password-changed') && has(st, 'login-new'), note: has(st, 'password-changed') && !has(st, 'login-new') ? 'Now log in again with the new password to prove it took.' : '' }) },
  { id: 'radio24', title: 'Set up the 2.4 GHz network', brief: 'Give the 2.4 GHz network its own name, a current security mode and a strong passphrase.',
    hints: ['Wireless > 2.4 GHz.', 'WPA3-Personal, or WPA2/WPA3 if older devices must join. Never WEP or TKIP. A passphrase of 12 characters or more.', 'Set a non-default SSID, choose WPA3-Personal or WPA2/WPA3-Personal, type a 12+ character passphrase, Save.'],
    check: st => { const r = st.router.radios.g24; return { done: has(st, 'radio-24-saved') && r.enabled && r.ssid !== st.scenario.defaultSsid && securityOk(r), note: has(st, 'radio-24-saved') && !securityOk(r) ? (ACCEPTED_SECURITY.includes(r.security) ? 'Passphrase too short for a home network; use 12 or more characters.' : `${SECURITY[r.security]} is not acceptable security in 2026.`) : (has(st, 'radio-24-saved') && r.ssid === st.scenario.defaultSsid ? 'Still the default network name.' : '') }; } },
  { id: 'radio5', title: 'Set up the 5 GHz network', brief: 'Do the same for the 5 GHz band. A distinct name (for example the 2.4 GHz name with -5G) makes each band easy to test.',
    hints: ['Wireless > 5 GHz. Check the band is enabled.', 'Same security standard as 2.4 GHz.', 'Enable the 5 GHz radio, set its SSID, WPA3 or WPA2/WPA3, a 12+ character passphrase, Save.'],
    check: st => { const r = st.router.radios.g5; return { done: has(st, 'radio-5-saved') && r.enabled && r.ssid !== st.scenario.defaultSsid + '-5G' && securityOk(r), note: has(st, 'radio-5-saved') && !r.enabled ? 'The 5 GHz radio is switched off.' : '' }; } },
  { id: 'adapter', title: 'Install the wireless adapter', brief: 'Plug the USB wireless adapter into the PC and confirm it is working in Device Manager.',
    hints: ['Device Manager > Network adapters.', 'A yellow triangle means the driver is not right.', 'Plug it in; open Device Manager; if it shows a warning, install the driver from the manufacturer\u2019s site rather than waiting for Windows Update.'],
    check: st => ({ done: adapterReady(st) && has(st, 'devmgr-viewed'), note: st.pc.adapter.present && st.pc.adapter.driver === 'missing' ? 'The adapter shows a warning triangle in Device Manager.' : (adapterReady(st) ? 'Open Device Manager to confirm it.' : '') }) },
  { id: 'join', title: 'Connect wirelessly', brief: 'Join the new network from the PC with the passphrase you set, unplug the Ethernet cable, and prove the wireless adapter has an address from the router.',
    hints: ['The Wi-Fi list is in the network flyout on the PC pane.', 'If the 5 GHz name never appears, ask what bands the adapter supports.', 'Join your SSID with the passphrase, unplug the cable on the bench, run ipconfig and read the Wireless LAN adapter\u2019s IPv4 address.'],
    check: st => ({ done: !!st.pc.wifi.lease && !st.pc.ethernet.port && has(st, 'ipconfig'), note: st.pc.wifi.lease && st.pc.ethernet.port ? 'Still cabled. Unplug the Ethernet cable so the wireless link is the one being proved.' : (st.pc.wifi.ssid && !st.pc.wifi.lease ? 'Connected but no address was assigned; check DHCP on the router.' : '') }) },
  { id: 'printer', title: 'Add the network printer', brief: 'Join the printer to your 2.4 GHz network, add it on the PC, and print a test page.',
    hints: ['The printer joins the network from its own panel on the bench first, using the 2.4 GHz network name and the passphrase you set on the router.', 'If Windows does not list it, add it by its IP address.', 'Printer panel: choose your 2.4 GHz SSID and type the passphrase you saved in the router\u2019s Wireless page. PC: Printers & scanners > Add device, or Add manually by IP. Then Print test page.'],
    check: st => ({ done: has(st, 'test-page'), note: st.pc.printers.length && !has(st, 'test-page') ? 'Now print a test page.' : (st.printer.ssid ? '' : 'The printer is not on the network yet.') }) },
  { id: 'ping', title: 'Ping another device', brief: 'From Command Prompt, ping the printer or the router and show four replies with no loss.',
    hints: ['ping followed by the address.', '"Request timed out" means no reply; check both devices are on the same network.', `Run ping followed by the printer\u2019s address or the router\u2019s address and read the statistics line.`],
    check: st => ({ done: has(st, 'ping-ok:printer') || has(st, 'ping-ok:router'), note: '' }) },
  { id: 'ipv4', title: 'Show the PC\u2019s IPv4 address', brief: 'Run ipconfig and point to the line that is the PC\u2019s IPv4 address on the network you are using.',
    hints: ['ipconfig, then look under the adapter you are actually using.', 'Not the gateway, not the mask, not the IPv6 line.', 'Run ipconfig, then choose the "IPv4 Address" line under Wireless LAN adapter Wi-Fi.'],
    check: st => ({ done: has(st, 'ipv4-chosen'), note: st.ipv4Choice && !has(st, 'ipv4-chosen') ? 'That is not the IPv4 address line for the adapter in use.' : '' }) },
  { id: 'devices', title: 'Show the connected devices', brief: 'Show which devices are on the network, and be able to explain both ways of doing it.',
    hints: ['The router keeps a list; the PC keeps a smaller one.', 'The PC only knows about devices it has talked to.', 'Router: Connected devices tab. PC: arp -a after pinging. Then answer the explanation question.'],
    check: st => ({ done: (has(st, 'devices-viewed') || has(st, 'arp')) && has(st, 'explain-devices-ok'), note: st.explainDevices && st.explainDevices !== 'both' ? 'Not quite; both methods are expected.' : '' }) },
  { id: 'finish', title: 'Finish the job', brief: 'Record the settings on the job sheet, store the spare adapter, and dispose of the packaging properly.',
    hints: ['The job sheet is below the bench.', 'Passwords are recorded as where they are kept, not written on the router.', 'Fill in both SSIDs, the security mode, where the passwords are kept and the printer address; tick "spare adapter stored"; choose recycling for the packaging.'],
    check: st => { const s = st.sheet; const ok = s.ssid24 === st.router.radios.g24.ssid && s.ssid5 === st.router.radios.g5.ssid && s.security && s.passwords.trim().length > 3 && s.printerIp === st.printer.address && s.stored && s.packaging === 'recycling'; return { done: ok, note: s.packaging === 'general' ? 'Cardboard and the router\u2019s box go to recycling, not general waste.' : '' }; } }
];
export function evaluate(st) { return CHECKPOINTS.map(c => ({ id: c.id, title: c.title, ...c.check(st) })); }
export function markEvent(st, e) { log(st, e); }
