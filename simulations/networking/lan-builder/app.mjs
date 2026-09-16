import { TYPES, clone, key, endpoint, getNode, getPort, isHost, maskText, sameSubnet, addNode, connect, removeNode, configurePort, tracePing, makeScenario, validateImport } from './engine.mjs?v=20260917.1';

const $ = id => document.getElementById(id);
const esc = text => String(text).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORAGE = 'ntwi-lan-builder-v1';
const lessons = {
  local: { title: 'Give two PCs a working Ethernet path', text: 'Connect PC A and PC B to different ports on Switch A. Their /24 addresses already share a subnet. Predict the result, run ping, then explain what the switch does.', hints: ['Each PC has one Ethernet port. Use a different switch port for each cable.', 'Connect PC A · eth0 to Switch A · 1, then PC B · eth0 to Switch A · 2.', 'For this local subnet, leave the default gateways blank. Watch ARP find PC B before ICMP is sent.'], question: 'Why can these PCs communicate without a default gateway?', answers: ['A switch routes between all IP subnets automatically.', 'Their masks place them on the same subnet; ARP finds the destination MAC and the switch forwards the frames.', 'Any continuous cable path is enough, regardless of IP addresses.'], correct: 1, explanation: 'The source applies its mask to decide the destination is local. ARP resolves that destination’s MAC address. The switch learns and forwards Ethernet frames; no router is needed.' },
  route: { title: 'Make two subnets communicate in both directions', text: 'The cables and router interfaces are ready. PC A is on 192.168.1.0/24; PC B is on 192.168.2.0/24. Configure each PC’s default gateway, then verify both the request and the reply.', hints: ['Run a test before changing anything. What does the first failure say?', 'A default gateway must be the router interface on that PC’s own subnet.', 'PC A needs 192.168.1.1. PC B needs 192.168.2.1. The reply uses PC B’s gateway.'], question: 'What changes when this packet passes through the router?', answers: ['The Ethernet MAC addresses change for the next link and TTL decreases; the original source and destination IPs remain.', 'The router broadcasts the original ARP request onto every subnet.', 'The router changes the source IP to its own address even without NAT.'], correct: 0, explanation: 'The router removes the incoming Ethernet frame, selects an outgoing connected route and creates a new frame for that link. It decrements TTL. In this lab there is no NAT, so the IP endpoints stay the same.' },
  repair: { title: 'The request arrives. Why is the ping still failing?', text: 'A workstation on 10.20.10.0/24 cannot ping a workstation on 10.20.20.0/24. Investigate before changing anything. Repair the addressing fault, retest, and explain the evidence that proves service is restored.', hints: ['Follow the Echo Request all the way to PC B, then continue stepping.', 'Compare PC B’s gateway with the router interface on the 10.20.20.0/24 network.', 'PC B is using 10.20.20.254. The connected router is 10.20.20.1. Correct the gateway and run a new test.'], question: 'What is enough evidence that this repair restored ping?', answers: ['The Echo Request reached PC B.', 'Every cable is drawn in the diagram.', 'Both the Echo Request and the Echo Reply completed using valid next hops.'], correct: 2, explanation: 'A one-way delivery is not a successful ping. The remote host needs a valid return path, and the original sender must receive the Echo Reply.' },
  sandbox: { title: 'Build your own network and test an idea', text: 'Add devices, connect ports, configure addresses and choose two end devices to test. Transfer challenge: connect two LANs using 172.16.10.0/24 and 172.16.20.0/24 through one router. Explain both directions of a successful ping, then predict what happens if you disable a cable or change a mask.', hints: [], question: '' }
};
let state = { network: makeScenario('local'), lesson: 'local', completed: [] };
let selected = '', selectedPort = '', history = [], future = [], trace = null, step = -1, playing = false, timer = null, hintCount = 0, predicted = '', testedSource = '', testedTarget = '';
let noticeTimer;
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const icons = {
  pc: '<rect x="9" y="3" width="62" height="37" rx="3" fill="#152f3a" stroke="#9cc4d2" stroke-width="2"/><rect x="14" y="8" width="52" height="25" rx="1" fill="#224950"/><path d="M20 27l10-10 9 6 10-11 11 5" stroke="#50ddd2" fill="none" stroke-width="2"/><path d="M33 41v5h14v-5M25 47h30" stroke="#9cc4d2" stroke-width="3"/>',
  switch: '<rect x="3" y="13" width="74" height="29" rx="4" fill="#23434a" stroke="#a7ced2" stroke-width="2"/><path d="M7 11l7-7h51l9 7" fill="#315158" stroke="#a7ced2"/><g fill="#061215" stroke="#8caeb5"><path d="M9 23h5v10H9zM17 23h5v10h-5zM25 23h5v10h-5zM33 23h5v10h-5zM41 23h5v10h-5zM49 23h5v10h-5zM57 23h5v10h-5zM65 23h5v10h-5z"/></g><path d="M10 18h6m5 0h6" stroke="#8ae4ac" stroke-width="2"/>',
  router: '<rect x="5" y="9" width="70" height="33" rx="7" fill="#29453b" stroke="#b7d9be" stroke-width="2"/><path d="M20 25h17m-4-4 4 4-4 4M60 25H43m4-4-4 4 4 4M40 14v7m0 8v7" fill="none" stroke="#8ae4ac" stroke-width="2"/><path d="M15 39h9m5 0h9m5 0h9" stroke="#50ddd2" stroke-width="3"/>',
  server: '<rect x="18" y="2" width="44" height="46" rx="4" fill="#27394a" stroke="#a8c4df" stroke-width="2"/><path d="M24 10h32v8H24zM24 24h32v8H24z" fill="#11232f" stroke="#7494a7"/><path d="M29 14h13m-13 14h13" stroke="#88acb7"/><circle cx="51" cy="14" r="2" fill="#8ae4ac"/><circle cx="51" cy="28" r="2" fill="#8ae4ac"/>',
  printer: '<path d="M22 15V3h36v12" fill="#d0dfdf" stroke="#97b8be" stroke-width="2"/><rect x="9" y="15" width="62" height="27" rx="4" fill="#29454c" stroke="#9fbec7" stroke-width="2"/><path d="M23 34h34v14H23z" fill="#d0dfdf" stroke="#97b8be"/><path d="M29 40h22m-22 4h17" stroke="#416067"/><circle cx="60" cy="22" r="2" fill="#8ae4ac"/>'
};
function notice(message, error = false) {
  clearTimeout(noticeTimer); $('notice').classList.toggle('error', error); $('notice').textContent = message;
  if (!error) noticeTimer = setTimeout(() => { $('notice').textContent = ''; }, 7000);
}
function unpack(data) {
  if (data?.format !== 'ntwi-lan-builder' || data.version !== 1 || !Object.hasOwn(lessons, data.lesson) || !Array.isArray(data.completed)) throw Error('Choose a LAN Builder export file (version 1).');
  return { network: validateImport(data.network), lesson: data.lesson, completed: [...new Set(data.completed.filter(id => id !== 'sandbox' && Object.hasOwn(lessons, id)))] };
}
function pack() { return { format: 'ntwi-lan-builder', version: 1, ...state }; }
try {
  const saved = localStorage.getItem(STORAGE);
  if (saved) { if (saved.length > 300000) throw Error('Saved file is too large.'); state = unpack(JSON.parse(saved)); $('save-status').textContent = 'Your saved network has been restored.'; }
} catch (error) { $('save-status').textContent = 'Saved work could not be loaded. Export your network to keep a copy.'; }
selected = state.network.nodes[0]?.id || '';
function persist(explicit = false) {
  try { localStorage.setItem(STORAGE, JSON.stringify(pack())); $('save-status').textContent = 'Saved in this browser. Export a file to move to another device.'; if (explicit) notice('Network and activity progress saved in this browser.'); }
  catch { $('save-status').textContent = 'Browser storage is unavailable or full. Use Export network to keep your work.'; if (explicit) notice('Could not save in this browser. Export your network instead.', true); }
}
function stop() { playing = false; clearTimeout(timer); timer = null; }
function invalidate() { stop(); trace = null; step = -1; $('prediction').value = ''; }
function commit(action, message) {
  const before = clone(state);
  try { action(); history.push(before); if (history.length > 60) history.shift(); future = []; invalidate(); persist(); render(); if (message) notice(message); }
  catch (error) { state = before; notice(error.message, true); }
}
function options(select, entries, chosen, prompt = null) {
  select.innerHTML = (prompt ? `<option value="">${esc(prompt)}</option>` : '') + entries.map(e => `<option value="${esc(e.value)}"${e.disabled ? ' disabled' : ''}>${esc(e.label)}</option>`).join('');
  if (entries.some(e => e.value === chosen && !e.disabled)) select.value = chosen;
  else select.value = entries.find(e => !e.disabled)?.value || '';
}
function render() {
  if (!getNode(state.network, selected)) selected = state.network.nodes[0]?.id || '';
  document.querySelectorAll('[data-lesson]').forEach(button => { const id = button.dataset.lesson; if (state.lesson === id) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current'); const done = button.querySelector('.done-mark'); if (done) { done.textContent = state.completed.includes(id) ? '✓' : ''; done.setAttribute('aria-label', state.completed.includes(id) ? 'Completed previously' : ''); } });
  const lesson = lessons[state.lesson]; $('brief-title').textContent = lesson.title; $('brief-text').textContent = lesson.text;
  $('brief-label').textContent = state.lesson === 'sandbox' ? 'YOUR EXPERIMENT' : 'YOUR CHALLENGE';
  $('lesson-state').textContent = state.completed.includes(state.lesson) ? 'Completed previously · retest changes' : state.lesson === 'sandbox' ? 'Sandbox' : 'To investigate'; $('lesson-state').classList.toggle('verified', false);
  $('hint-button').hidden = !lesson.hints.length; $('hint-text').hidden = !hintCount || !lesson.hints.length; $('hint-text').textContent = lesson.hints.slice(0, hintCount).join(' ');
  $('undo').disabled = !history.length; $('redo').disabled = !future.length;
  renderBoard(); renderDevice(); renderCables(); renderPingOptions(); renderTrace();
}
function hasLink(ep) { return state.network.links.some(l => l.enabled && ((key(l.a) === key(ep) && getPort(state.network, l.b)?.enabled) || (key(l.b) === key(ep) && getPort(state.network, l.a)?.enabled))); }
function position(ep) { const node = getNode(state.network, ep.node); return { x: node.x + 48, y: node.y + 51 }; }
function renderBoard() {
  const event = trace?.events[step];
  $('nodes').innerHTML = state.network.nodes.map(n => `<button class="device ${n.type}${n.id === selected ? ' selected' : ''}${event?.nodes.includes(n.id) ? event.kind === 'failure' ? ' failed' : ' active' : ''}" data-node="${n.id}" style="left:${n.x}px;top:${n.y}px" aria-label="${esc(n.name)}, ${TYPES[n.type]}${isHost(n) ? ', ' + (n.ports[0].ip || 'unconfigured') : ''}. Select to configure; arrow keys move." aria-pressed="${n.id === selected}"><svg viewBox="0 0 80 50" aria-hidden="true">${icons[n.type]}</svg><span class="device-name">${esc(n.name)}</span><span class="device-ip">${isHost(n) ? esc(n.ports[0].ip || 'No address') + (n.ports[0].ip ? '/' + n.ports[0].prefix : '') : n.type === 'router' ? 'Connected routes' : 'Layer 2 · 8 ports'}</span><span class="port-leds" aria-hidden="true">${n.ports.map(p => `<i class="${p.enabled && hasLink(endpoint(n.id,p.id)) ? 'up' : ''}"></i>`).join('')}</span></button>`).join('');
  $('empty-canvas').hidden = state.network.nodes.length > 0;
  const defs = '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#50ddd2"/></marker></defs>';
  let wires = state.network.links.map(l => { const a=position(l.a),b=position(l.b); const up=l.enabled&&getPort(state.network,l.a).enabled&&getPort(state.network,l.b).enabled; return `<path class="cable${up?'':' down'}" d="M${a.x} ${a.y}L${b.x} ${b.y}"/>`; }).join('');
  if (event) for (const id of event.links) {
    const l=state.network.links.find(l=>l.id===id); if(!l)continue;
    const route=event.path?.find(h=>h.link===id), a=position(route?.from||l.a),b=position(route?.to||l.b),arp=event.kind.startsWith('arp');
    const d=`M${a.x} ${a.y}L${b.x} ${b.y}`;
    wires+=`<path class="frame${arp?' arp':''}" d="${d}" ${route?'marker-end="url(#arrow)"':''}/>`;
    wires+=playing&&!motion.matches?`<circle class="packet${arp?' arp':''}" r="6"><animateMotion dur="${Number($('speed').value)/1000}s" repeatCount="indefinite" path="${d}"/></circle>`:`<circle class="packet${arp?' arp':''}" r="5" cx="${(a.x+b.x)/2}" cy="${(a.y+b.y)/2}"/>`;
  }
  $('wires').innerHTML=defs+wires;
  // The same trace drives the full workspace and the overview beside playback.
  $('journey-map').innerHTML=(defs+wires).replaceAll('id="arrow"','id="overview-arrow"').replaceAll('url(#arrow)','url(#overview-arrow)')+state.network.nodes.map(n=>`<g><rect x="${n.x-8}" y="${n.y-8}" width="112" height="103" rx="10" fill="#102328" stroke="${event?.nodes.includes(n.id)?event.kind==='failure'?'#ff9c9c':'#50ddd2':'#46636b'}" stroke-width="3"/><svg x="${n.x+8}" y="${n.y}" width="80" height="50" viewBox="0 0 80 50">${icons[n.type]}</svg><text x="${n.x+48}" y="${n.y+80}" text-anchor="middle" fill="#f1f7f7" font-size="24">${esc(n.name.length>11?n.name.slice(0,10)+'…':n.name)}</text></g>`).join('');

  $('network-count').textContent=`${state.network.nodes.length} devices · ${state.network.links.length} cables`;
}
function renderDevice() {
  options($('device-select'), state.network.nodes.map(n=>({value:n.id,label:`${n.name} · ${TYPES[n.type]}`})),selected);
  const node=getNode(state.network,selected);
  if(!node){$('device-form-area').innerHTML='<p class="small">Add a device to begin. Switches forward frames; routers connect IP networks.</p>';return;}
  if(!node.ports.some(p=>p.id===selectedPort))selectedPort=node.ports[0].id;
  const port=node.ports.find(p=>p.id===selectedPort);
  $('device-form-area').innerHTML=`<form class="device-form" id="device-form"><label>Device name<input id="device-name" maxlength="40" required value="${esc(node.name)}"></label><label>Interface<select id="interface-select">${node.ports.map(p=>`<option value="${p.id}"${p.id===selectedPort?' selected':''}>${p.id}${p.ip?' · '+esc(p.ip):''}</option>`).join('')}</select></label><p class="device-meta">${node.type==='switch'?'Ethernet switching port':`MAC ${esc(port.mac)}`}<br>${hasLink(endpoint(node.id,port.id))&&port.enabled?'● Ethernet link up':'○ No active Ethernet link'}</p>${node.type==='switch'?'<p class="hint">An IP address is not needed to forward frames. This switch learns source MAC addresses as traffic arrives.</p>':`<label>IPv4 address<input id="device-ip" inputmode="decimal" autocomplete="off" placeholder="e.g. 192.168.1.10" value="${esc(port.ip)}"></label><label>Prefix or subnet mask<input id="device-prefix" autocomplete="off" value="${port.prefix}" aria-describedby="mask-help"></label><p class="small" id="mask-help">/${port.prefix} = ${maskText(port.prefix)}. Use /1–/30 or a contiguous mask.</p>${isHost(node)?`<label>Default gateway <span class="small">Leave blank for local-only traffic.</span><input id="device-gateway" inputmode="decimal" autocomplete="off" placeholder="e.g. 192.168.1.1" value="${esc(port.gateway)}"></label>`:'<p class="hint">Give each router interface an address on its attached LAN. The router learns those connected routes automatically.</p>'}` }<label class="check"><input id="port-enabled" type="checkbox"${port.enabled?' checked':''}> Interface enabled</label><div class="device-actions"><button type="submit" class="primary">Apply changes</button><button type="button" id="delete-device" class="danger">Remove device</button></div></form>`;
  $('interface-select').addEventListener('change',e=>{selectedPort=e.target.value;renderDevice();$('interface-select').focus();});
  $('device-form').addEventListener('submit',e=>{e.preventDefault();const name=$('device-name').value.trim();if(!name)return notice('Give this device a name.',true);const values={enabled:$('port-enabled').checked,ip:$('device-ip')?.value||'',prefix:$('device-prefix')?.value||24,gateway:$('device-gateway')?.value||''};commit(()=>{configurePort(state.network,endpoint(node.id,selectedPort),values);getNode(state.network,node.id).name=name;},'Configuration applied. Run a new test to verify it.');});
  $('delete-device').addEventListener('click',()=>{commit(()=>removeNode(state.network,node.id),'Device removed. Undo restores it and its cables.');$('device-select').focus();});
}
function renderCables(){
  const entries=state.network.nodes.flatMap(n=>n.ports.map(p=>{const busy=state.network.links.some(l=>[key(l.a),key(l.b)].includes(key(endpoint(n.id,p.id))));return{value:key(endpoint(n.id,p.id)),label:`${n.name} · ${p.id}${busy?' (in use)':''}`,disabled:busy};}));
  options($('connect-from'),entries,$('connect-from').value);options($('connect-to'),entries,$('connect-to').value);
  if($('connect-from').value===$('connect-to').value){const other=entries.find(e=>!e.disabled&&e.value.split(':')[0]!==$('connect-from').value.split(':')[0]);if(other)$('connect-to').value=other.value;}
  $('cable-list').innerHTML=state.network.links.map(l=>{const label=`${getNode(state.network,l.a.node).name} ${l.a.port} ↔ ${getNode(state.network,l.b.node).name} ${l.b.port}`;return`<li><span>${esc(label)}${!l.enabled?' · disabled':''}</span><button data-toggle-cable="${l.id}" aria-label="${l.enabled?'Disable':'Enable'} cable ${esc(label)}">${l.enabled?'Disable':'Enable'}</button><button data-remove-cable="${l.id}" aria-label="Remove cable ${esc(label)}">Remove</button></li>`;}).join('')||'<li><span class="small">No cables yet. Select a port at each end and choose Connect.</span></li>';
}
function renderPingOptions(){const entries=state.network.nodes.filter(isHost).map(n=>({value:n.id,label:`${n.name}${n.ports[0].ip?' · '+n.ports[0].ip:''}`}));options($('ping-source'),entries,$('ping-source').value);options($('ping-target'),entries,$('ping-target').value);if($('ping-source').value===$('ping-target').value&&entries.length>1)$('ping-target').value=entries.find(e=>e.value!==$('ping-source').value).value;}
function makeTable(headers,rows){return rows.length?`<table><thead><tr>${headers.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`:'<p class="small">No entries learnt at this step.</p>';}
function renderTrace(announce=false){
  const event=trace?.events[step],atEnd=!!trace&&step===trace.events.length-1;
  $('step-back').disabled=!trace||step<=0;$('step-next').disabled=!trace||atEnd;$('play').disabled=!trace||atEnd;$('show-result').disabled=!trace||atEnd;$('play').textContent=playing?'Pause':'Play journey';
  $('step-count').textContent=trace?`Step ${step+1} of ${trace.events.length}`:'No test yet';
  $('event-card').className='event-card'+(event&&['failure','success'].includes(event.kind)?' '+event.kind:'');
  $('event-kind').textContent=event?`${event.kind.replaceAll('-',' ')} · ${event.direction==='reply'?'RETURN PATH':'OUTWARD PATH'}`:'READY TO INVESTIGATE';
  $('event-title').textContent=event?.title||'What do you expect to happen?';
  $('event-detail').textContent=event?.detail||'Choose two end devices and make a prediction. Then run ping and step through the decisions, Ethernet frames and return path.';
  const fields=event?Object.entries({ 'Source IP':event.srcIP,'Destination IP':event.dstIP,'Source MAC':event.srcMac,'Destination MAC':event.dstMac,'ARP sender IP':event.arpSender,'ARP target IP':event.arpTarget,'TTL':event.ttl }).filter(([,v])=>v!==undefined):[];
  $('packet-fields').innerHTML=fields.map(([label,value])=>`<dt>${label}</dt><dd>${esc(value)}</dd>`).join('');
  $('prediction-result').textContent=atEnd?(predicted==='unsure'?'You investigated an uncertain outcome. Use the trace to explain it.':(predicted==='yes')===trace.success?'Your prediction matched. Which evidence explains the result?':'The result differed from your prediction. Find the first decision that explains why.') : '';
  $('timeline').innerHTML=trace?trace.events.map((e,i)=>`<li><button data-step="${i}"${i===step?' aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span><span>${esc(e.title)}</span></button></li>`).join(''):'<li class="small">Your test steps will appear here.</li>';
  $('mac-table').innerHTML=makeTable(['Switch','Source MAC','Learnt port'],event?.macTable.map(r=>[r.name,r.mac,r.port])||[]);
  $('arp-table').innerHTML=makeTable(['Interface','IPv4','MAC'],event?.arpTable.map(r=>{const [id,port]=r.endpoint.split(':');return[`${getNode(state.network,id)?.name||id} ${port}`,r.ip,r.mac];})||[]);
  $('explain-section').hidden=!atEnd||state.lesson==='sandbox';$('next-lesson').hidden=true;
  if(atEnd&&state.lesson!=='sandbox'){
    const lesson=lessons[state.lesson];$('explain-intro').textContent=goalReached()?'The network meets this activity’s goal. Explain why it works to complete the activity.':'This result is useful evidence. Repair the network and verify the activity’s goal before completing it.';
    $('explain-question').textContent=lesson.question;$('explain-options').innerHTML=lesson.answers.map((answer,i)=>`<label><input type="radio" name="explanation" value="${i}" required>${esc(answer)}</label>`).join('');$('explain-feedback').textContent='';
  }
  if(announce&&event)$('trace-live').textContent=`Step ${step+1} of ${trace.events.length}. ${event.title}. ${event.detail}`;
  if(!event)$('trace-live').textContent='';renderBoard();
}
function goalReached(){if(!trace?.success)return false;const a=getNode(state.network,testedSource),b=getNode(state.network,testedTarget);if(!a||!b)return false;return state.lesson==='local'?!trace.routed&&trace.events.some(e=>e.kind==='icmp'&&e.nodes.some(id=>getNode(state.network,id)?.type==='switch')):trace.routed&&!sameSubnet(a.ports[0].ip,b.ports[0].ip,a.ports[0].prefix);}
function goStep(index){stop();step=Math.max(0,Math.min(trace.events.length-1,index));renderTrace(true);}
function tick(){if(!playing||!trace)return;if(step>=trace.events.length-1){stop();renderTrace(true);return;}step++;if(step===trace.events.length-1)stop();renderTrace(true);if(playing)timer=setTimeout(tick,Number($('speed').value));}
document.querySelectorAll('[data-lesson]').forEach(button=>button.addEventListener('click',()=>{if(button.dataset.lesson===state.lesson)return;hintCount=0;selectedPort='';commit(()=>{state.lesson=button.dataset.lesson;state.network=makeScenario(state.lesson);selected=state.network.nodes[0]?.id||'';},'Activity loaded. Your previous network is available with Undo.');}));
document.querySelectorAll('[data-add]').forEach(button=>button.addEventListener('click',()=>{commit(()=>{const i=state.network.nodes.length;const node=addNode(state.network,button.dataset.add,40+(i%5)*150,45+Math.floor(i/5)*105);selected=node.id;selectedPort='';},'Device added. Configure it in the device inspector.');}));
$('hint-button').addEventListener('click',()=>{hintCount=Math.min(hintCount+1,lessons[state.lesson].hints.length);$('hint-text').hidden=false;$('hint-text').textContent=lessons[state.lesson].hints.slice(0,hintCount).join(' ');});
$('device-select').addEventListener('change',e=>{selected=e.target.value;selectedPort='';renderDevice();renderBoard();});
$('connect-form').addEventListener('submit',e=>{e.preventDefault();const parse=v=>{const [node,port]=v.split(':');return endpoint(node,port);};commit(()=>connect(state.network,parse($('connect-from').value),parse($('connect-to').value)),'Ethernet cable connected.');});
$('cable-list').addEventListener('click',e=>{const toggle=e.target.closest('[data-toggle-cable]'),remove=e.target.closest('[data-remove-cable]');if(toggle)commit(()=>{const l=state.network.links.find(l=>l.id===toggle.dataset.toggleCable);l.enabled=!l.enabled;},'Cable state changed. Run ping again.');if(remove)commit(()=>{state.network.links=state.network.links.filter(l=>l.id!==remove.dataset.removeCable);},'Cable removed. Undo restores it.');});
$('undo').addEventListener('click',()=>{if(!history.length)return;future.push(clone(state));state=history.pop();invalidate();hintCount=0;persist();render();notice('Previous network restored.');});
$('redo').addEventListener('click',()=>{if(!future.length)return;history.push(clone(state));state=future.pop();invalidate();hintCount=0;persist();render();notice('Network change restored.');});
$('reset').addEventListener('click',()=>{hintCount=0;commit(()=>{state.network=makeScenario(state.lesson);selected='';selectedPort='';},'Activity reset. Undo can recover your previous network.');});
$('ping-form').addEventListener('submit',e=>{e.preventDefault();stop();predicted=$('prediction').value;testedSource=$('ping-source').value;testedTarget=$('ping-target').value;trace=tracePing(state.network,testedSource,testedTarget);step=0;renderTrace(true);notice('Prediction recorded. Step through the journey, or choose Play journey.');});
for(const id of ['ping-source','ping-target','prediction'])$(id).addEventListener('change',()=>{if(trace){stop();trace=null;step=-1;renderTrace();}});
$('step-back').addEventListener('click',()=>{if(trace)goStep(step-1);});$('step-next').addEventListener('click',()=>{if(trace)goStep(step+1);});$('show-result').addEventListener('click',()=>{if(trace)goStep(trace.events.length-1);});
$('play').addEventListener('click',()=>{if(!trace)return;if(playing){stop();renderTrace();}else{playing=true;renderTrace();timer=setTimeout(tick,Number($('speed').value));}});
$('speed').addEventListener('change',()=>{if(playing){clearTimeout(timer);timer=setTimeout(tick,Number($('speed').value));renderBoard();}});
$('timeline').addEventListener('click',e=>{const b=e.target.closest('[data-step]');if(b&&trace){const next=Number(b.dataset.step);goStep(next);document.querySelector(`[data-step="${next}"]`)?.focus({preventScroll:true});}});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stop();renderTrace();}});motion.addEventListener('change',()=>{stop();renderTrace();});
$('explain-form').addEventListener('submit',e=>{e.preventDefault();const checked=document.querySelector('input[name="explanation"]:checked');if(!checked)return;if(!goalReached()){$('explain-feedback').textContent='First meet the network goal and run a successful test. Use the failed trace to choose a repair.';return;}const lesson=lessons[state.lesson];if(Number(checked.value)!==lesson.correct){$('explain-feedback').textContent='Revisit the next-hop decision and the Ethernet/IP fields in the trace, then try again.';return;}if(!state.completed.includes(state.lesson))state.completed.push(state.lesson);persist();$('explain-feedback').textContent='Activity complete. '+lesson.explanation;$('lesson-state').textContent='Verified & explained';$('lesson-state').classList.add('verified');document.querySelector(`[data-lesson="${state.lesson}"] .done-mark`).textContent='✓';$('next-lesson').hidden=false;});
$('next-lesson').addEventListener('click',()=>{const next=state.lesson==='local'?'route':state.lesson==='route'?'repair':'sandbox';document.querySelector(`[data-lesson="${next}"]`).click();$('workspace').focus();});
$('save').addEventListener('click',()=>persist(true));
$('show-data').addEventListener('click',()=>{$('network-data').value=JSON.stringify(pack(),null,2);$('network-data').focus();$('network-data').select();notice('Current network data is ready to copy.');});
$('restore-data').addEventListener('click',()=>{try{const imported=unpack(JSON.parse($('network-data').value));commit(()=>{state=imported;selected='';selectedPort='';hintCount=0;},'Network restored from data. Run a new test to verify it.');}catch(error){notice('Could not restore data: '+error.message,true);}});
$('export').addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(pack(),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='ntworldink-lan-network.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notice('Export requested. If no file appears, use Copy or paste network data below.');});
$('import').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>300000)throw Error('Choose a network file smaller than 300 KB.');const imported=unpack(JSON.parse(await file.text()));commit(()=>{state=imported;selected='';selectedPort='';hintCount=0;},'Network imported. Choose two devices and verify it.');}catch(error){notice('Import failed: '+error.message,true);}finally{e.target.value='';}});

// Pointer movement is optional: every edit is also available by form and
// every device can be placed with arrow keys. One drag creates one undo step.
let drag=null,suppressClick=false;
$('board').addEventListener('pointerdown',e=>{const b=e.target.closest('[data-node]');if(!b||e.button!==0)return;const node=getNode(state.network,b.dataset.node);drag={id:node.id,startX:e.clientX,startY:e.clientY,x:node.x,y:node.y,before:clone(state),moved:false,pointer:e.pointerId};});
$('board').addEventListener('pointermove',e=>{if(!drag||drag.pointer!==e.pointerId)return;const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;if(Math.abs(dx)+Math.abs(dy)<5&&!drag.moved)return;if(!drag.moved)$('board').setPointerCapture(e.pointerId);drag.moved=true;const node=getNode(state.network,drag.id);node.x=Math.max(8,Math.min(756,drag.x+dx));node.y=Math.max(8,Math.min(335,drag.y+dy));stop();renderBoard();});
$('board').addEventListener('pointerup',e=>{if(!drag||drag.pointer!==e.pointerId)return;const moved=drag.moved;if(moved){history.push(drag.before);if(history.length>60)history.shift();future=[];selected=drag.id;invalidate();persist();render();}suppressClick=moved;drag=null;});
$('board').addEventListener('pointercancel',()=>{if(drag){state=drag.before;drag=null;renderBoard();}});
$('board').addEventListener('click',e=>{if(suppressClick){suppressClick=false;return;}const b=e.target.closest('[data-node]');if(b){selected=b.dataset.node;selectedPort='';renderDevice();renderBoard();document.querySelector(`[data-node="${selected}"]`)?.focus({preventScroll:true});}});
$('board').addEventListener('keydown',e=>{const b=e.target.closest('[data-node]'),delta={ArrowLeft:[-10,0],ArrowRight:[10,0],ArrowUp:[0,-10],ArrowDown:[0,10]}[e.key];if(!b||!delta)return;e.preventDefault();const id=b.dataset.node;commit(()=>{const n=getNode(state.network,id);n.x=Math.max(8,Math.min(756,n.x+delta[0]));n.y=Math.max(8,Math.min(335,n.y+delta[1]));selected=id;});document.querySelector(`[data-node="${id}"]`)?.focus({preventScroll:true});});
render();
