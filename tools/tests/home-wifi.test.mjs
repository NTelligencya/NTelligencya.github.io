import test from 'node:test';
import assert from 'node:assert/strict';
import { newState, holdReset, setRouterPower, plugEthernet, ethernetLinkUp, openUrl, login, changeAdminPassword, setRadio, plugAdapter, installDriver, pcVisibleNetworks, joinWifi, printerJoin, addPrinter, printTestPage, runCommand, evaluate, tickItem, resolveDelivery, chooseIpv4Line, answerExplainDevices, updateSheet, setDhcp, setTab, markEvent, pickFaults, FAULTS, discoverPrinters, phoneJoin } from '../../simulations/networking/home-wifi/engine.mjs';

const cp = (st, id) => evaluate(st).find(c => c.id === id);
function powered(faults = []) { const st = newState('first', faults); setRouterPower(st, true); return st; }
function wired(faults = []) { const st = powered(faults); holdReset(st, 12); plugEthernet(st, 'lan1', 'B'); return st; }
function loggedIn(faults = []) { const st = wired(faults); openUrl(st, '192.168.1.1'); login(st, 'admin', 'admin'); return st; }
function secured(faults = []) {
  const st = loggedIn(faults);
  changeAdminPassword(st, 'admin', 'Bench-Router-2026', 'Bench-Router-2026'); login(st, 'admin', 'Bench-Router-2026');
  setRadio(st, '2.4', { ssid: 'BenchNet', security: 'wpa3', passphrase: 'Customers123!' });
  setRadio(st, '5', { enabled: true, ssid: 'BenchNet-5G', security: 'wpa3', passphrase: 'Customers123!' });
  return st;
}

test('reset needs power and a long enough hold', () => {
  const st = newState('first', []);
  assert.equal(holdReset(st, 15).reset, false);
  setRouterPower(st, true);
  assert.equal(holdReset(st, 3).reset, false);
  st.router.adminPassword = 'changed-by-last-student';
  assert.equal(holdReset(st, 10).reset, true);
  assert.equal(st.router.adminPassword, 'admin');
  assert.equal(cp(st, 'reset').done, true);
});

test('cable in the Internet port gets no lease; a LAN port does', () => {
  const st = powered(); holdReset(st, 12);
  plugEthernet(st, 'internet', 'A');
  assert.equal(st.pc.ethernet.lease, null);
  assert.match(runCommand(st, 'ipconfig').join('\n'), /Autoconfiguration IPv4 Address. . : 169\.254\./);
  plugEthernet(st, 'lan2', 'A');
  assert.equal(st.pc.ethernet.lease, '192.168.1.100');
  assert.equal(cp(st, 'wired').done, true);
});

test('bad cable fault: cable A never links, cable B does', () => {
  const st = powered(['badCable']); holdReset(st, 12);
  plugEthernet(st, 'lan1', 'A'); assert.equal(ethernetLinkUp(st), false); assert.equal(st.pc.ethernet.lease, null);
  plugEthernet(st, 'lan1', 'B'); assert.equal(ethernetLinkUp(st), true);
});

test('missing power supply must be resolved with the supplier before power on', () => {
  const st = newState('second', ['missingItem', 'radio5Off']);
  assert.throws(() => setRouterPower(st, true), /no power supply/);
  st.delivery.items.forEach(i => tickItem(st, i.name));
  resolveDelivery(st, 'borrow'); assert.equal(cp(st, 'delivery').done, false);
  resolveDelivery(st, 'supplier'); assert.equal(cp(st, 'delivery').done, true);
  setRouterPower(st, true); assert.equal(st.router.powered, true);
});

test('typing the address in the search box does not reach the router', () => {
  const st = wired();
  openUrl(st, 'router login 192.168.1.1'); assert.equal(st.router.session.page, 'search');
  openUrl(st, '192.168.1.1'); assert.equal(st.router.session.page, 'login');
  openUrl(st, '192.168.0.1'); assert.equal(st.router.session.page, 'unreachable');
});

test('router page is unreachable without a LAN address', () => {
  const st = powered(); holdReset(st, 12);
  openUrl(st, 'http://192.168.1.1/'); assert.equal(st.router.session.page, 'unreachable');
});

test('admin password change ends the session and the old password is rejected', () => {
  const st = loggedIn();
  assert.throws(() => changeAdminPassword(st, 'admin', 'short', 'short'), /at least 8/);
  assert.throws(() => changeAdminPassword(st, 'admin', 'admin', 'admin'), /factory default/);
  changeAdminPassword(st, 'admin', 'Bench-Router-2026', 'Bench-Router-2026');
  assert.equal(st.router.session.loggedIn, false);
  assert.equal(cp(st, 'adminpw').done, false, 'not done until re-login proves it');
  login(st, 'admin', 'admin'); assert.equal(st.router.session.loggedIn, false); assert.ok(st.events.includes('old-password-rejected'));
  login(st, 'admin', 'Bench-Router-2026'); assert.equal(st.router.session.loggedIn, true);
  assert.equal(cp(st, 'adminpw').done, true);
});

test('weak security never passes the radio checkpoints', () => {
  const st = loggedIn();
  setRadio(st, '2.4', { ssid: 'BenchNet', security: 'wep', passphrase: 'Customers123!' });
  assert.equal(cp(st, 'radio24').done, false); assert.match(cp(st, 'radio24').note, /WEP/);
  setRadio(st, '2.4', { ssid: 'BenchNet', security: 'wpa-tkip', passphrase: 'Customers123!' });
  assert.equal(cp(st, 'radio24').done, false);
  setRadio(st, '2.4', { ssid: 'BenchNet', security: 'wpa2', passphrase: 'short123' });
  assert.equal(cp(st, 'radio24').done, false); assert.match(cp(st, 'radio24').note, /12 or more/);
  setRadio(st, '2.4', { ssid: 'Homeway-2200', security: 'wpa3', passphrase: 'Customers123!' });
  assert.equal(cp(st, 'radio24').done, false, 'default SSID still');
  setRadio(st, '2.4', { ssid: 'BenchNet', security: 'wpa2wpa3', passphrase: 'Customers123!' });
  assert.equal(cp(st, 'radio24').done, true);
  assert.throws(() => setRadio(st, '5', { security: 'wpa3', passphrase: 'abc' }), /at least 8/);
});

test('an open network cannot be saved as acceptable', () => {
  const st = loggedIn();
  setRadio(st, '2.4', { ssid: 'BenchNet', security: 'none' });
  assert.equal(cp(st, 'radio24').done, false);
});

test('radio5Off fault: 5 GHz must be enabled before it counts', () => {
  const st = loggedIn(['radio5Off']);
  assert.equal(pcVisibleNetworks(st).length, 0, 'no adapter yet');
  setRadio(st, '5', { ssid: 'BenchNet-5G', security: 'wpa3', passphrase: 'Customers123!' });
  assert.equal(cp(st, 'radio5').done, false); assert.match(cp(st, 'radio5').note, /switched off/);
  setRadio(st, '5', { enabled: true, ssid: 'BenchNet-5G', security: 'wpa3', passphrase: 'Customers123!' });
  assert.equal(cp(st, 'radio5').done, true);
});

test('a 2.4 GHz-only adapter never sees the 5 GHz network', () => {
  const st = secured(['adapter24only']);
  plugAdapter(st, true);
  assert.deepEqual(pcVisibleNetworks(st).map(n => n.ssid), ['BenchNet']);
  assert.throws(() => joinWifi(st, 'BenchNet-5G', 'Customers123!'), /not in the list/);
  const out = runCommand(st, 'netsh wlan show networks mode=bssid').join('\n');
  assert.match(out, /BenchNet/); assert.doesNotMatch(out, /BenchNet-5G/);
});

test('driverMissing fault: yellow triangle until installed from the manufacturer', () => {
  const st = secured(['driverMissing']);
  plugAdapter(st, true); assert.equal(st.pc.adapter.driver, 'missing');
  assert.throws(() => joinWifi(st, 'BenchNet', 'Customers123!'), /no working driver/);
  assert.equal(installDriver(st, 'windows-update').ok, false);
  assert.equal(installDriver(st, 'manufacturer').ok, true);
  markEvent(st, 'devmgr-viewed');
  assert.equal(cp(st, 'adapter').done, true);
});

test('wrong passphrase fails; right passphrase gets a lease; cable must be unplugged to pass', () => {
  const st = secured(); plugAdapter(st, true);
  assert.equal(joinWifi(st, 'BenchNet-5G', 'wrongwrong').ok, false);
  assert.equal(joinWifi(st, 'BenchNet-5G', 'Customers123!').ok, true);
  assert.equal(st.pc.wifi.lease, '192.168.1.101');
  runCommand(st, 'ipconfig');
  assert.equal(cp(st, 'join').done, false); assert.match(cp(st, 'join').note, /Still cabled/);
  plugEthernet(st, null);
  assert.equal(cp(st, 'join').done, true);
  assert.match(runCommand(st, 'ipconfig').join('\n'), /Ethernet:\n   Media State . . . . . . . . . . . : Media disconnected/);
});

test('changing a radio after clients joined drops them', () => {
  const st = secured(); plugAdapter(st, true); joinWifi(st, 'BenchNet', 'Customers123!');
  assert.ok(st.pc.wifi.ssid);
  setRadio(st, '2.4', { ssid: 'BenchNet', security: 'wpa3', passphrase: 'NewPassphrase99' });
  assert.equal(st.pc.wifi.ssid, null);
});

test('DHCP off leaves a joined PC with a 169.254 address and no reachability', () => {
  const st = secured(); setDhcp(st, false);
  plugAdapter(st, true); const r = joinWifi(st, 'BenchNet', 'Customers123!');
  assert.equal(r.ok, true); assert.equal(st.pc.wifi.lease, null);
  assert.match(runCommand(st, 'ipconfig').join('\n'), /169\.254/);
  assert.match(runCommand(st, 'ping 192.168.1.1').join('\n'), /transmit failed/);
});

test('printer joins only 2.4 GHz with the right passphrase, then is discoverable, pingable and prints', () => {
  const st = secured(); plugAdapter(st, true); joinWifi(st, 'BenchNet-5G', 'Customers123!'); plugEthernet(st, null);
  assert.throws(() => printerJoin(st, 'BenchNet-5G', 'Customers123!'), /2\.4 GHz/);
  assert.equal(printerJoin(st, 'BenchNet', 'nope-nope-nope').ok, false);
  assert.equal(discoverPrinters(st).length, 0);
  assert.equal(addPrinter(st, 'ip', '192.168.1.144').ok, false, 'not on network yet');
  assert.equal(printerJoin(st, 'BenchNet', 'Customers123!').ok, true);
  assert.match(runCommand(st, 'ping 192.168.1.144').join('\n'), /Lost = 0 \(0% loss\)/);
  assert.equal(addPrinter(st, 'ip', '192.168.1.144').ok, true);
  assert.equal(printTestPage(st).ok, true);
  assert.equal(cp(st, 'printer').done, true); assert.equal(cp(st, 'ping').done, true);
});

test('ping to an absent address times out and to a name resolves only with a lease', () => {
  const st = secured(); plugAdapter(st, true); joinWifi(st, 'BenchNet', 'Customers123!');
  assert.match(runCommand(st, 'ping 192.168.1.77').join('\n'), /Lost = 4 \(100% loss\)/);
  assert.match(runCommand(st, 'ping cdu.edu.au').join('\n'), /Reply from 138\.80/);
  assert.match(runCommand(st, 'ping nowhere.invalid').join('\n'), /could not find host/);
});

test('arp -a lists only hosts the PC has talked to', () => {
  const st = secured(); plugAdapter(st, true); joinWifi(st, 'BenchNet', 'Customers123!'); plugEthernet(st, null);
  printerJoin(st, 'BenchNet', 'Customers123!');
  let out = runCommand(st, 'arp -a').join('\n'); assert.doesNotMatch(out, /192\.168\.1\.144/);
  runCommand(st, 'ping 192.168.1.144');
  out = runCommand(st, 'arp -a').join('\n'); assert.match(out, /192\.168\.1\.144\s+00-1e-8f/);
});

test('phone joins and appears in the router client list', () => {
  const st = secured();
  assert.equal(phoneJoin(st, 'BenchNet-5G', 'Customers123!').ok, true);
  assert.ok(st.router.clients.some(c => c.host === 'Phone' && c.via === '5'));
});

test('ipv4 line choice accepts only the in-use adapter IPv4 line', () => {
  const st = secured(); plugAdapter(st, true); joinWifi(st, 'BenchNet', 'Customers123!'); plugEthernet(st, null);
  runCommand(st, 'ipconfig');
  assert.equal(chooseIpv4Line(st, 'Default Gateway . . . . . . . . . : 192.168.1.1'), false);
  assert.equal(chooseIpv4Line(st, 'IPv4 Address. . . . . . . . . . . : 192.168.1.101(Preferred)'), true);
  assert.equal(cp(st, 'ipv4').done, true);
});

test('connected devices checkpoint needs a view and the right explanation', () => {
  const st = secured();
  assert.equal(cp(st, 'devices').done, false);
  setTab(st, 'devices'); answerExplainDevices(st, 'router-only');
  assert.equal(cp(st, 'devices').done, false);
  answerExplainDevices(st, 'both');
  assert.equal(cp(st, 'devices').done, true);
});

test('job sheet must match the live configuration', () => {
  const st = secured(); printerJoin(st, 'BenchNet', 'Customers123!');
  updateSheet(st, { ssid24: 'BenchNet', ssid5: 'BenchNet-5G', security: 'WPA3-Personal', passwords: 'Client password manager', printerIp: '192.168.1.144', stored: true, packaging: 'general' });
  assert.equal(cp(st, 'finish').done, false); assert.match(cp(st, 'finish').note, /recycling/);
  updateSheet(st, { packaging: 'recycling' });
  assert.equal(cp(st, 'finish').done, true);
});

test('second occasion seeds two distinct faults from the pool', () => {
  for (const seed of [1, 42, 9999, 123456]) { const f = pickFaults(seed); assert.equal(f.length, 2); assert.notEqual(f[0], f[1]); f.forEach(k => assert.ok(k in FAULTS)); }
  const st = newState('second'); assert.equal(st.scenario.faults.length, 2); assert.equal(st.router.lanAddress, '192.168.0.1');
});

test('unknown commands are refused, not faked', () => {
  const st = secured();
  assert.match(runCommand(st, 'tracert 192.168.1.1').join('\n'), /not recognized/);
});
