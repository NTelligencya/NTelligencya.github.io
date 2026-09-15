// Pure educational Ethernet/IPv4 model. No DOM, timers or network requests.
export const VERSION = 1;
export const TYPES = { pc: 'PC', switch: 'Switch', router: 'Router', server: 'Server', printer: 'Printer' };
export const clone = value => JSON.parse(JSON.stringify(value));
export const key = endpoint => `${endpoint.node}:${endpoint.port}`;
export const endpoint = (node, port) => ({ node, port });
export const getNode = (net, id) => net.nodes.find(n => n.id === id);
export const getPort = (net, ep) => getNode(net, ep.node)?.ports.find(p => p.id === ep.port);
export const isHost = n => n && !['switch', 'router'].includes(n.type);
export const maskText = prefix => [24, 16, 8, 0].map(shift => ((0xffffffff << (32 - prefix)) >>> shift) & 255).join('.');

export function ipv4(text) {
  if (typeof text !== 'string' || !/^(0|[1-9]\d{0,2})(\.(0|[1-9]\d{0,2})){3}$/.test(text)) return null;
  const octets = text.split('.').map(Number);
  if (octets.some(n => n > 255)) return null;
  return octets.reduce((n, octet) => n * 256 + octet, 0);
}
export function prefixValue(value) {
  if (typeof value === 'number') return Number.isInteger(value) && value >= 1 && value <= 30 ? value : null;
  if (typeof value !== 'string') return null;
  if (/^\/?([1-9]|[12]\d|30)$/.test(value)) return Number(value.replace('/', ''));
  const mask = ipv4(value);
  if (mask === null) return null;
  for (let p = 1; p <= 30; p++) if (maskText(p) === value) return p;
  return null;
}
export function networkNumber(ip, prefix) {
  const size = 2 ** (32 - prefix);
  return Math.floor(ipv4(ip) / size) * size;
}
export function sameSubnet(a, b, prefix) {
  return ipv4(a) !== null && ipv4(b) !== null && networkNumber(a, prefix) === networkNumber(b, prefix);
}
export function addressError(ip, prefix) {
  const num = ipv4(ip), p = prefixValue(prefix);
  if (num === null) return 'Enter four decimal octets from 0 to 255, without leading zeros.';
  if (p === null) return 'Use a LAN prefix from /1 to /30, or its contiguous subnet mask. /31 and /32 are outside this introductory lab.';
  const [a, b] = ip.split('.').map(Number);
  if (a === 0 || a === 127 || a >= 224 || (a === 169 && b === 254)) return 'Use a unicast host address. Loopback, multicast and automatic link-local addressing are outside this lab.';
  const start = networkNumber(ip, p), end = start + 2 ** (32 - p) - 1;
  if (num === start) return `${ip}/${p} is the network address. Choose a host address.`;
  if (num === end) return `${ip}/${p} is the broadcast address. Choose a host address.`;
  return '';
}

export function emptyNetwork() { return { version: VERSION, nextId: 1, nodes: [], links: [] }; }
export function addNode(net, type, x = 120, y = 170) {
  if (!Object.hasOwn(TYPES, type)) throw Error('Choose a supported device type.');
  if (net.nodes.length >= 16) throw Error('This lab supports up to 16 devices. Remove a device before adding another.');
  // Imported MACs may be valid but use an upcoming generated identifier.
  const used = new Set(net.nodes.flatMap(n => n.ports.map(p => p.mac.slice(0,11))));
  while (used.has(`02:${((net.nextId >>> 16) & 255).toString(16).padStart(2, '0')}:${((net.nextId >>> 8) & 255).toString(16).padStart(2, '0')}:${(net.nextId & 255).toString(16).padStart(2, '0')}`) || net.nodes.some(n => n.id === `n${net.nextId}`)) net.nextId++;
  if (!Number.isSafeInteger(net.nextId) || net.nextId < 1 || net.nextId > 0xffffff) throw Error('Device identifier limit reached. Start a fresh network.');
  const number = net.nextId++, id = `n${number}`;
  const portNames = type === 'switch' ? ['1', '2', '3', '4', '5', '6', '7', '8'] : type === 'router' ? ['g0/0', 'g0/1', 'g0/2'] : ['eth0'];
  const node = { id, type, name: `${TYPES[type]} ${number}`, x: Math.max(8, Math.min(756, x)), y: Math.max(8, Math.min(335, y)),
    ports: portNames.map((port, i) => ({ id: port, enabled: true, ip: type === 'switch' || type === 'router' ? '' : `192.168.1.${10 + number % 200}`,
      prefix: 24, gateway: '', mac: `02:${((number >>> 16) & 255).toString(16).padStart(2, '0')}:${((number >>> 8) & 255).toString(16).padStart(2, '0')}:${(number & 255).toString(16).padStart(2, '0')}:00:${i.toString(16).padStart(2, '0')}` })) };
  net.nodes.push(node); return node;
}
function switchPath(net, start, end, visited = new Set()) {
  if (start === end) return true;
  visited.add(start);
  for (const l of net.links) {
    const next = l.a.node === start ? l.b.node : l.b.node === start ? l.a.node : null;
    if (next && getNode(net, next)?.type === 'switch' && !visited.has(next) && switchPath(net, next, end, visited)) return true;
  }
  return false;
}
export function connect(net, a, b) {
  if (!getPort(net, a) || !getPort(net, b)) throw Error('Choose a device and a valid port at both ends.');
  if (a.node === b.node) throw Error('Connect two different devices.');
  if (net.links.some(l => [key(l.a), key(l.b)].some(k => k === key(a) || k === key(b)))) throw Error('That port already has a cable. Use a free port or remove its cable.');
  if (getNode(net, a.node).type === 'switch' && getNode(net, b.node).type === 'switch' && switchPath(net, a.node, b.node)) {
    throw Error('This would create a switch loop. Spanning tree is outside this lab: remove the redundant switch link.');
  }
  const id = `c${net.nextId++}`;
  net.links.push({ id, a: { ...a }, b: { ...b }, enabled: true }); return id;
}
export function removeNode(net, id) {
  net.nodes = net.nodes.filter(n => n.id !== id);
  net.links = net.links.filter(l => l.a.node !== id && l.b.node !== id);
}
export function configurePort(net, ep, values) {
  const port = getPort(net, ep), node = getNode(net, ep.node);
  if (!port) throw Error('Select a valid interface.');
  const ip = String(values.ip ?? port.ip).trim(), prefix = prefixValue(values.prefix ?? port.prefix);
  const gateway = String(values.gateway ?? port.gateway).trim();
  if (prefix === null) throw Error('Use a prefix from /1 to /30 or a contiguous subnet mask.');
  if (node.type !== 'switch' && ip) { const error = addressError(ip, prefix); if (error) throw Error(error); }
  if (node.type === 'router' && ip && node.ports.some(p => p.id !== ep.port && p.ip && sameSubnet(ip, p.ip, Math.min(prefix, p.prefix)))) throw Error('Router interfaces must use non-overlapping networks in this lab.');
  if (gateway && ipv4(gateway) === null) throw Error('Enter a valid IPv4 gateway address.');
  if (gateway && ip && sameSubnet(ip, gateway, prefix) && addressError(gateway, prefix)) throw Error('The gateway must be a usable host address.');
  // Off-subnet/nonexistent gateways are permitted so the learner can diagnose them.
  Object.assign(port, { ip: node.type === 'switch' ? '' : ip, prefix, gateway: isHost(node) ? gateway : '', enabled: values.enabled ?? port.enabled });
}

// A broadcast domain crosses switches, never hosts or routers. Parent edges
// describe real cable hops and internal switch forwarding separately.
export function segment(net, start) {
  const seen = new Map([[key(start), { ep: start, parent: null, link: null }]]), queue = [start];
  if (!getPort(net, start)?.enabled) return seen;
  while (queue.length) {
    const ep = queue.shift();
    const visit = (other, link) => {
      if (!getPort(net, other)?.enabled || seen.has(key(other))) return;
      seen.set(key(other), { ep: other, parent: key(ep), link }); queue.push(other);
    };
    for (const l of net.links.filter(l => l.enabled)) {
      if (key(l.a) === key(ep)) visit(l.b, l.id);
      else if (key(l.b) === key(ep)) visit(l.a, l.id);
    }
    const n = getNode(net, ep.node);
    if (n.type === 'switch') for (const p of n.ports) visit(endpoint(n.id, p.id), null);
  }
  return seen;
}
function pathTo(domain, target) {
  const path = []; let item = domain.get(key(target));
  while (item?.parent) {
    const prev = domain.get(item.parent);
    if (item.link) path.unshift({ link: item.link, from: prev.ep, to: item.ep });
    item = prev;
  }
  return path;
}

export function tracePing(net, sourceId, targetId) {
  const source = getNode(net, sourceId), target = getNode(net, targetId);
  const events = [], arp = new Map(), mac = new Map();
  let direction = 'request', routed = false;
  const table = () => [...mac].flatMap(([node, entries]) => [...entries].map(([address, port]) => ({ node, name: getNode(net, node).name, mac: address, port })));
  const caches = () => [...arp].flatMap(([ep, entries]) => [...entries].map(([ip, address]) => ({ endpoint: ep, ip, mac: address })));
  const push = (kind, title, detail, extra = {}) => events.push({ kind, title, detail, direction, nodes: [], links: [], ...extra, macTable: table(), arpTable: caches() });
  const fail = (code, detail, nodes = []) => { push('failure', direction === 'reply' ? 'The reply cannot get home' : 'The request cannot continue', detail, { code, nodes }); return { success: false, code, direction, events, routed }; };
  const learn = (node, address, port) => { if (!mac.has(node)) mac.set(node, new Map()); mac.get(node).set(address, port); };
  const cache = (ep, ip, address) => { if (!arp.has(key(ep))) arp.set(key(ep), new Map()); arp.get(key(ep)).set(ip, address); };
  const learnPath = (path, address) => path.forEach(hop => { if (getNode(net, hop.to.node).type === 'switch') learn(hop.to.node, address, hop.to.port); });
  if (!isHost(source) || !isHost(target) || sourceId === targetId) return fail('ENDPOINTS', 'Choose two different end devices. Switches forward frames; routers forward packets.');
  for (const n of [source, target]) {
    if (!n.ports[0].ip) return fail('UNCONFIGURED', `${n.name} needs an IPv4 address.`, [n.id]);
    const problem = addressError(n.ports[0].ip, n.ports[0].prefix);
    if (problem) return fail('INVALID_ADDRESS', `${n.name}: ${problem}`, [n.id]);
  }
  const transfer = (origin, destination) => {
    const srcIP = origin.ports[0].ip, dstIP = destination.ports[0].ip;
    let sender = origin, out = endpoint(origin.id, origin.ports[0].id), ttl = 64;
    for (let hop = 0; hop < 16; hop++) {
      let port, nextHop;
      if (sender.type === 'router') {
        routed = true;
        const routes = sender.ports.filter(p => p.enabled && p.ip && !addressError(p.ip, p.prefix) && sameSubnet(p.ip, dstIP, p.prefix)).sort((a, b) => b.prefix - a.prefix);
        if (!routes.length) return fail('NO_ROUTE', `${sender.name} has no enabled, directly connected route to ${dstIP}. Configure its outgoing interface and network. Static routes are outside this lab.`, [sender.id]);
        port = routes[0]; out = endpoint(sender.id, port.id); nextHop = dstIP; ttl--;
        push('route', `${sender.name} chooses ${port.id}`, `The longest matching connected prefix is ${port.ip}/${port.prefix}. The router reduces TTL to ${ttl}; the end-to-end IP addresses stay ${srcIP} → ${dstIP}.`, { nodes: [sender.id], srcIP, dstIP, ttl });
      } else {
        port = getPort(net, out);
        const local = sameSubnet(port.ip, dstIP, port.prefix);
        push('decision', `${sender.name}: local or remote?`, `${port.ip}/${port.prefix} ${local ? 'places the destination on this subnet, so ARP asks for the destination itself.' : 'places the destination on another subnet, so the next hop must be a gateway.'}`, { nodes: [sender.id], srcIP, dstIP, ttl });
        if (!local && !port.gateway) return fail('NO_GATEWAY', `${sender.name} needs a default gateway to reach ${dstIP}. A cable path alone cannot join IP subnets.`, [sender.id]);
        if (!local && (!sameSubnet(port.ip, port.gateway, port.prefix) || port.gateway === port.ip)) return fail('GATEWAY_SUBNET', `${sender.name}'s gateway ${port.gateway} must be a different, usable address on its own subnet.`, [sender.id]);
        nextHop = local ? dstIP : port.gateway;
      }
      if (!port.enabled) return fail('PORT_DOWN', `${sender.name} ${port.id} is disabled. Enable the interface.`, [sender.id]);
      const cable = net.links.find(l => key(l.a) === key(out) || key(l.b) === key(out));
      if (!cable || !cable.enabled || !getPort(net, key(cable.a) === key(out) ? cable.b : cable.a).enabled) return fail('LINK_DOWN', `${sender.name} ${port.id} has no working Ethernet link. Check the cable and both interface states.`, [sender.id]);
      const domain = segment(net, out);
      const members = [...domain.values()].filter(v => getNode(net, v.ep.node).type !== 'switch');
      if (members.some(v => key(v.ep) !== key(out) && getPort(net, v.ep).ip === port.ip)) return fail('DUPLICATE_IP', `More than one interface on this Ethernet segment uses ${port.ip}. Give each interface a unique address.`, [sender.id]);
      const matches = members.filter(v => getPort(net, v.ep).ip === nextHop);
      if (!arp.get(key(out))?.has(nextHop)) {
        for (const v of domain.values()) if (v.link && getNode(net, v.ep.node).type === 'switch') learn(v.ep.node, port.mac, v.ep.port);
        push('arp-request', `ARP: who has ${nextHop}?`, `${sender.name} broadcasts on this Ethernet segment. Switches learn the source MAC on the incoming port and flood the request. Routers do not forward this broadcast.`, { nodes: [...new Set([...domain.values()].map(v => v.ep.node))], links: [...new Set([...domain.values()].map(v => v.link).filter(Boolean))], srcMac: port.mac, dstMac: 'ff:ff:ff:ff:ff:ff', arpSender: port.ip, arpTarget: nextHop });
      }
      if (matches.length > 1) return fail('DUPLICATE_IP', `Multiple interfaces answer for ${nextHop}. Duplicate addressing prevents a reliable result.`, matches.map(v => v.ep.node));
      if (!matches.length) return fail('ARP_NO_REPLY', `No interface on this Ethernet segment answers for ${nextHop}. Check the address, subnet mask, gateway and physical path.`, [sender.id]);
      const receiverEP = matches[0].ep, receiver = getNode(net, receiverEP.node), receiverPort = getPort(net, receiverEP);
      const path = pathTo(domain, receiverEP);
      if (arp.get(key(out))?.has(nextHop)) {
        push('arp-cache', 'The MAC address is already known', `${sender.name} uses the mapping learnt earlier in this trace: ${nextHop} → ${receiverPort.mac}.`, { nodes: [sender.id], srcMac: port.mac, dstMac: receiverPort.mac });
      } else {
        cache(receiverEP, port.ip, port.mac); cache(out, nextHop, receiverPort.mac);
        const reverse = path.slice().reverse().map(h => ({ link: h.link, from: h.to, to: h.from }));
        learnPath(reverse, receiverPort.mac);
        push('arp-reply', `${receiver.name} answers the ARP request`, `${nextHop} is at ${receiverPort.mac}. The reply is unicast; the switches also learn its source MAC.`, { nodes: [receiver.id, sender.id], links: path.map(h => h.link), path: reverse, srcMac: receiverPort.mac, dstMac: port.mac, arpSender: nextHop, arpTarget: port.ip });
      }
      learnPath(path, port.mac);
      for (const h of path) {
        push('icmp', direction === 'request' ? 'ICMP Echo Request' : 'ICMP Echo Reply', `${getNode(net, h.from.node).name} ${h.from.port} → ${getNode(net, h.to.node).name} ${h.to.port}. Ethernet carries this IP packet to the next hop.`, { nodes: [h.from.node, h.to.node], links: [h.link], path: [h], srcIP, dstIP, srcMac: port.mac, dstMac: receiverPort.mac, ttl });
      }
      if (receiver.id === destination.id) { push('arrive', direction === 'request' ? 'The request arrived' : 'The reply arrived', direction === 'request' ? `${destination.name} now has to send an Echo Reply. The return path needs its own valid addressing and gateway.` : `${destination.name} received the Echo Reply. Both directions worked.`, { nodes: [receiver.id], srcIP, dstIP, ttl }); return null; }
      if (receiver.type !== 'router') return fail('NOT_A_ROUTER', `${receiver.name} answered at the next-hop address, but an end device cannot forward this packet to another host. Use a router as the gateway.`, [receiver.id]);
      sender = receiver;
    }
    return fail('HOP_LIMIT', 'The packet did not reach its destination within the lab hop limit. Check the topology.');
  };
  push('start', 'A fresh packet journey', `Ping ${source.ports[0].ip} → ${target.ports[0].ip}. Each new test begins with empty ARP and MAC tables so learning is visible. Timing and retries are simplified.`);
  const outward = transfer(source, target); if (outward) return outward;
  direction = 'reply'; const backward = transfer(target, source); if (backward) return backward;
  push('success', 'Ping verified in both directions', `Echo Request and Echo Reply completed. This verifies simulated IPv4 reachability between ${source.name} and ${target.name}; it does not test DNS or an application.`, { nodes: [source.id, target.id] });
  return { success: true, code: 'SUCCESS', direction, events, routed };
}

export function makeScenario(id = 'local') {
  const net = emptyNetwork();
  if (id === 'sandbox') return net;
  const a = addNode(net, 'pc', 80, 190); a.name = 'PC A';
  const s = addNode(net, 'switch', id === 'local' ? 350 : 240, 190); s.name = 'Switch A';
  const b = addNode(net, 'pc', 700, 190); b.name = 'PC B';
  a.ports[0].ip = '192.168.1.10'; b.ports[0].ip = '192.168.1.20';
  if (id === 'local') return net;
  const r = addNode(net, 'router', 395, 190); r.name = 'Router';
  const t = addNode(net, 'switch', 550, 190); t.name = 'Switch B';
  const first = id === 'repair' ? '10.20.10' : '192.168.1', second = id === 'repair' ? '10.20.20' : '192.168.2';
  a.ports[0].ip = `${first}.10`; b.ports[0].ip = `${second}.20`;
  r.ports[0].ip = `${first}.1`; r.ports[1].ip = `${second}.1`;
  a.ports[0].gateway = id === 'repair' ? `${first}.1` : '';
  b.ports[0].gateway = id === 'repair' ? `${second}.254` : '';
  connect(net, endpoint(a.id, 'eth0'), endpoint(s.id, '1'));
  connect(net, endpoint(s.id, '2'), endpoint(r.id, 'g0/0'));
  connect(net, endpoint(r.id, 'g0/1'), endpoint(t.id, '1'));
  connect(net, endpoint(t.id, '2'), endpoint(b.id, 'eth0'));
  return net;
}

export function validateImport(input) {
  if (!input || input.version !== VERSION || !Array.isArray(input.nodes) || !Array.isArray(input.links)) throw Error('This is not a supported LAN Builder network (version 1).');
  if (input.nodes.length > 16 || input.links.length > 64) throw Error('This network exceeds the lab size limit.');
  const net = emptyNetwork(), ids = new Set(), macs = new Set();
  for (const data of input.nodes) {
    if (!data || typeof data.id !== 'string' || (!/^n[1-9]\d{0,7}$/.test(data.id) || Number(data.id.slice(1)) > 0xffffff) || ids.has(data.id) || !Object.hasOwn(TYPES, data.type)) throw Error('Invalid or duplicate device.');
    ids.add(data.id);
    if (typeof data.name !== 'string' || !data.name.trim() || data.name.length > 40) throw Error('Device names must contain 1–40 characters.');
    if (!Number.isFinite(data.x) || !Number.isFinite(data.y)) throw Error('Invalid device position.');
    const node = addNode(net, data.type, Math.max(8, Math.min(756, data.x)), Math.max(8, Math.min(335, data.y)));
    node.id = data.id; node.name = data.name.trim();
    if (!Array.isArray(data.ports) || node.ports.length !== data.ports.length) throw Error('Invalid port list.');
    for (let i = 0; i < node.ports.length; i++) {
      const p = data.ports[i];
      if (!p || p.id !== node.ports[i].id || typeof p.enabled !== 'boolean' || typeof p.ip !== 'string' || typeof p.gateway !== 'string') throw Error('Invalid interface settings.');
      if (typeof p.mac !== 'string' || !/^02(:[0-9a-f]{2}){5}$/.test(p.mac) || macs.has(p.mac)) throw Error('Invalid or duplicate MAC address.');
      macs.add(p.mac); configurePort(net, endpoint(node.id, p.id), p); node.ports[i].mac = p.mac;
    }
  }
  net.nextId = Math.max(1, ...net.nodes.map(n => Number(n.id.slice(1)) + 1));
  for (const link of input.links) {
    if (!link?.a || !link?.b || typeof link.enabled !== 'boolean') throw Error('Invalid cable.');
    const id = connect(net, link.a, link.b); net.links.find(l => l.id === id).enabled = link.enabled;
  }
  return net;
}
