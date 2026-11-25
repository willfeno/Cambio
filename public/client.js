/* Cambio client — solo (local AI) + online (Socket.IO server). */
const $ = id => document.getElementById(id);
const PACKS = ['Classic','Midnight','Vintage','Berry'];
const FELTS = [['green','Green'],['blue','Blue'],['burgundy','Burgundy'],['charcoal','Charcoal'],['teal','Teal']];
let settings = JSON.parse(localStorage.getItem('cambio-settings') || '{}');
settings.pack = settings.pack || 'Classic'; settings.felt = settings.felt || 'green';
function saveSettings(){ localStorage.setItem('cambio-settings', JSON.stringify(settings)); renderSettings(); }
function show(id){ document.querySelectorAll('main > section').forEach(s=>s.classList.add('hidden')); $(id).classList.remove('hidden'); if(id==='game') $('table').className='table felt-'+settings.felt; }
function cardVal(r,s){ if(r==='JOKER')return 0; if(r==='A')return 1; if(r==='J'||r==='Q')return 10; if(r==='K')return (s==='♥'||s==='♦')?-1:10; return parseInt(r,10); }
function cardHtml(c, opts={}){
  if(!c) return '';
  if(c.back) return `<div class="card back ${settings.pack.toLowerCase()} ${opts.small?'small':''}" onclick="${opts.onclick||''}"><span style="font-size:22px">?</span></div>`;
  const red = c.color==='red' || c.suit==='♥' || c.suit==='♦';
  const rem = opts.rem!=null ? `<span class="rem">${opts.rem}</span>` : '';
  return `<div class="card ${red?'red':''} ${opts.small?'small':''} ${opts.cls||''}" onclick="${opts.onclick||''}">${c.rank}<span style="font-size:20px">${c.suit}</span>${rem}</div>`;
}
function renderSettings(){
  $('pack-list').innerHTML = PACKS.map(p=>`<button class="secondary" style="margin:4px" onclick="settings.pack='${p}';saveSettings()">${p} ${settings.pack===p?'✓':''}</button><span class="preview">${cardHtml({rank:'Q',suit:'♥',color:'red'})} ${cardHtml({back:true})}</span>`).join('');
  $('felt-list').innerHTML = FELTS.map(([v,n])=>`<button class="secondary" style="margin:4px" onclick="settings.felt='${v}';saveSettings()"><span class="swatch" style="background:${v==='green'?'#0f3d2e':v==='blue'?'#173a5e':v==='burgundy'?'#5e1f2e':v==='charcoal'?'#2b2f33':'#0f5257'};display:inline-block;vertical-align:middle"></span> ${n} ${settings.felt===v?'✓':''}</button>`).join('');
  $('preview-line').textContent = `${settings.pack} cards on ${settings.felt} felt — this is how your table will look.`;
}
renderSettings();

/* ---------- server connection ---------- */
function serverUrl(){
  const q = new URLSearchParams(location.search);
  return q.get('server') || window.CAMBIO_SERVER || location.origin;
}
let socket = null, myId = null, roomCode = null, lastState = null, isHost = false;
function connectSocket(){
  if(socket) return socket;
  socket = io(serverUrl());
  socket.on('connect', ()=>{ myId = socket.id; $('server-note').textContent = 'Connected to game server: ' + serverUrl(); });
  socket.on('connect_error', ()=>{ $('server-note').textContent = 'Could not reach the game server at ' + serverUrl() + ' — it may be waking up (free servers sleep). Wait 30–50 seconds and refresh.'; });
  socket.on('roomJoined', d=>{ roomCode = d.code; show('lobby'); $('lobby-code').textContent = roomCode; });
  socket.on('errorMsg', m=>{ alert(m); const e=$('join-error'); if(e) e.textContent=m; });
  socket.on('lookedCard', d=>{ alert(`You looked at ${d.targetName}'s card: ${d.card.rank}${d.card.suit}`); });
  socket.on('state', s=>{ lastState = s; renderOnline(s); });
  return socket;
}
function createRoom(){ connectSocket(); socket.emit('createRoom', { name: $('host-name').value, memoryAid: $('host-memory').value==='on', pack: settings.pack, felt: settings.felt }); isHost = true; }
function joinRoom(){ connectSocket(); const code = $('join-code').value.trim().toUpperCase(); if(!code) return; socket.emit('joinRoom', { code, name: $('join-name').value }); }
function startGame(){ socket.emit('startGame'); }
function copyCode(){ navigator.clipboard?.writeText(roomCode); alert('Code copied: ' + roomCode); }
function copyLink(){ const u = location.origin + location.pathname + '?code=' + roomCode; navigator.clipboard?.writeText(u); alert('Invite link copied — friends open it, then enter code ' + roomCode); }
function drawOrTake(which){ if(solo) return soloDrawOrTake(which); if(!lastState) return; if(which==='draw') socket.emit('drawCard'); else socket.emit('takeDiscard'); }
function renderOnline(s){
  show('game'); $('table').className = 'table felt-' + (s.felt || settings.felt);
  $('turn-strip').innerHTML = '<span>↻ Clockwise:</span>' + s.players.map((p,i)=>`<div class="${p.id===s.turnId?'active':''}">${i+1}. ${p.name}${p.id===myId?' (you)':''}</div>`).join('');
  const me = s.players.find(p=>p.id===myId);
  const banner = $('banner');
  if(s.phase==='finished'){ banner.classList.remove('hidden'); banner.textContent = s.winnerId===myId ? '🎉 You win!' : `🏆 ${s.players.find(p=>p.id===s.winnerId)?.name} wins!`; }
  else if(s.turnId===myId){ banner.classList.remove('hidden'); banner.classList.add('pulse'); banner.textContent = s.phase==='peek' ? 'Your turn to peek — look at your 2 nearest cards' : 'YOUR TURN'; }
  else { banner.classList.add('hidden'); }
  $('deck-count').textContent = s.deckCount;
  const dp = $('discard-pile'); dp.textContent = s.discardTop ? s.discardTop.rank + s.discardTop.suit : 'Empty';
  dp.classList.toggle('glow', s.turnId===myId && !!me?.drawCard);
  $('draw-pile').classList.toggle('glow', s.turnId===myId && !me?.drawCard);
  if(s.phase==='drawFirst'){ $('drawfirst').classList.remove('hidden'); $('board').classList.add('hidden');
    $('fan').innerHTML = Array.from({length:18},(_,i)=>cardHtml({back:true},{onclick:`socket.emit('pickDrawFirst',{index:${i}})`})).join('');
    $('drawfirst-result').innerHTML = s.drawFirst ? s.drawFirst.picks.map(p=>`<div>${p.name}: ${p.card? p.card.rank+p.card.suit : '…'}</div>`).join('') : '';
    if(s.drawFirst?.winnerId) $('drawfirst-result').innerHTML += '<p>Winner goes first…</p>';
  } else { $('drawfirst').classList.add('hidden'); $('board').classList.remove('hidden'); }
  if(s.phase==='peek' && s.turnId===myId){ $('game-actions').innerHTML = `<button onclick="socket.emit('peekDone')">I've peeked — start play</button>`; }
  else if(me?.drawCard){
    const fromDiscard = me.drawCard.fromDiscard;
    $('game-actions').innerHTML = `<p>You hold ${me.drawCard.rank}${me.drawCard.suit}. Tap one of your cards to swap it in${fromDiscard?' (discard-pile card must be swapped in)':', or put it straight on the discard pile'}.</p>` +
      (fromDiscard?'':`<button onclick="socket.emit('discardDrawn')">Put it straight on the discard pile</button>`);
  } else if(s.turnId===myId && s.phase==='playing'){
    $('game-actions').innerHTML = `<button onclick="socket.emit('callCambio')">Call CAMBIO!</button><span style="align-self:center">Tap the draw pile or the discard pile. Tap a face-up card to snap it.</span>`;
  } else if(s.pendingPower?.playerId===myId){
    $('game-actions').innerHTML = `<p><b>${s.pendingPower.rank} power — mandatory.</b> Tap a card to ${s.pendingPower.step==='look'?'look at it':'swap (tap two cards)'}.</p>`;
  } else { $('game-actions').innerHTML = s.snapOpen ? '<p>⚡ Snap window open — tap a matching card to snap!</p>' : ''; }
  $('players').innerHTML = s.players.map(p=>{
    const isMe = p.id===myId;
    const hand = p.hand.map((c,i)=>{
      const rem = (isMe && s.memoryAid && p.known?.includes(c.id)) ? c.value : null;
      const knownVal = rem!=null ? (c.rank==='JOKER'?'0':c.rank) : null;
      const onclick = isMe && me?.drawCard ? `socket.emit('swapIn',{handIndex:${i}})` : (s.pendingPower?.playerId===myId ? `powerTap('${p.id}',${i})` : (s.snapOpen ? `socket.emit('snap',{targetId:'${p.id}',handIndex:${i}})` : ''));
      // For opponents, hand items are backs; for you, real cards.
      return cardHtml(c, { onclick, rem: knownVal, cls: p.isCaller?'':'' });
    }).join('');
    return `<div class="player ${p.id===s.turnId?'active':''} ${p.isCaller?'immune':''}"><h3>${p.name}${isMe?' (you)':''} — ${p.count} cards${p.isCaller?' • CAMBIO — immune':''}</h3><div class="hand">${hand}</div>${p.isCaller?'<div class="cambio-stamp"><span>CAMBIO!</span></div>':''}${isMe && me?.drawCard?`<div style="margin-top:6px">Holding: ${cardHtml(me.drawCard)}</div>`:''}</div>`;
  }).join('');
  $('game-log').innerHTML = (s.log||[]).join('<br>');
  if(s.phase==='lobby' || $('lobby').classList.contains('hidden')===false){}
  // Lobby screen
  if(s.phase==='lobby'){ show('lobby'); $('lobby-code').textContent = s.code; $('lobby-players').innerHTML = s.players.map(p=>`<div>${p.name}${p.id===s.players[0]?.id?' (host)':''}</div>`).join(''); $('lobby-memory').textContent = 'Card memory: ' + (s.memoryAid?'On':'Off') + ' (host decides, same for everyone)'; $('start-btn').style.display = (myId===s.players[0]?.id)?'':'none'; }
}
let powerFirst = null;
function powerTap(playerId, idx){
  if(!lastState?.pendingPower) return;
  if(lastState.pendingPower.step==='look'){ socket.emit('powerLook',{targetId:playerId, handIndex:idx}); }
  else {
    if(!powerFirst){ powerFirst={playerId, idx}; alert('First card chosen — now tap the second card to swap with.'); }
    else { socket.emit('powerSwap',{aPlayerId:powerFirst.playerId,aIndex:powerFirst.idx,bPlayerId:playerId,bIndex:idx}); powerFirst=null; }
  }
}
// Auto-fill code from invite link ?code=
(function(){ const c=new URLSearchParams(location.search).get('code'); if(c){ $('join-code').value=c; show('join'); } })();

/* ---------- SOLO vs computer (local) ---------- */
let solo = null;
function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function buildDeck(){
  const suits=[['♥','red'],['♦','red'],['♣','black'],['♠','black']]; const ranks=['A','2','3','4','5','6','7','8','9','10','J','Q','K']; const d=[]; let id=0;
  for(const [s,c] of suits) for(const r of ranks) d.push({id:id++,rank:r,suit:s,color:c,value:cardVal(r,s)});
  d.push({id:id++,rank:'JOKER',suit:'★',color:'red',value:0}); d.push({id:id++,rank:'JOKER',suit:'★',color:'black',value:0});
  return shuffle(d);
}
function score(hand){ return hand.reduce((t,c)=>t+c.value,0); }
function startSolo(){
  const n = 1 + parseInt($('solo-count').value,10);
  const diff = $('solo-diff').value; const memory = $('solo-memory').value==='on';
  const names = [$('solo-name').value||'You','Ruby','Max','Lena','Omar','Priya'];
  solo = { diff, memory, phase:'drawFirst', players: names.slice(0,n).map((name,i)=>({id:'p'+i,name,hand:[],known:[],isAI:i>0,aiMemory:{}})), deck:[], discard:[], turn:0, drawCard:null, snapUntil:0, pendingPower:null, cambio:null, finalLeft:0, log:[], fan: shuffle(buildDeck()).slice(0,18), picks:[] };
  show('game'); renderSolo(); soloLog('Draw to go first — tap a card from the fan.');
}
function soloLog(m){ solo.log.push(m); const el=$('game-log'); if(el) el.innerHTML=solo.log.slice(-6).join('<br>'); }
function soloPick(i){
  if(!solo || solo.phase!=='drawFirst') return;
  const card = solo.fan[i]; solo.picks.push({name:solo.players[0].name,card});
  // AI picks too
  solo.players.slice(1).forEach(p=>solo.picks.push({name:p.name,card:solo.fan[Math.floor(Math.random()*solo.fan.length)]}));
  const best = Math.min(...solo.picks.map(x=>x.card.value));
  const winners = solo.picks.filter(x=>x.card.value===best);
  soloLog('Draw: ' + solo.picks.map(x=>`${x.name} ${x.card.rank}${x.card.suit}`).join(' • '));
  if(winners.length===1){ const w = solo.players.findIndex(p=>p.name===winners[0].name); solo.turn=w; dealSolo(); }
  else { soloLog('Tie on the draw — drawing again.'); solo.fan=shuffle(buildDeck()).slice(0,18); solo.picks=[]; renderSolo(); }
}
function dealSolo(){
  solo.deck=buildDeck(); solo.discard=[];
  solo.players.forEach(p=>{ p.hand=solo.deck.splice(0,4); p.known=p.hand.slice(2).map(c=>c.id); });
  solo.phase='playing'; soloLog(`${solo.players[solo.turn].name} goes first. Lowest score wins.`); renderSolo(); setTimeout(aiTurn, 1200);
}
function soloDrawOrTake(which){
  if(!solo || solo.phase!=='playing' || solo.turn!==0 || solo.drawCard || Date.now()<solo.snapUntil) return;
  const me=solo.players[0];
  if(which==='draw'){ solo.drawCard=solo.deck.pop(); soloLog('You drew from the pile.'); }
  else { if(!solo.discard.length) return; solo.drawCard=solo.discard.pop(); solo.drawCard.fromDiscard=true; soloLog(`You took the top discard (${solo.drawCard.rank}${solo.drawCard.suit}) — the table saw it.`); }
  renderSolo();
}
function soloSwap(i){
  if(!solo || !solo.drawCard) return; const me=solo.players[0]; const drawn=solo.drawCard; solo.drawCard=null;
  const old=me.hand[i]; me.hand[i]=drawn; me.known=me.known.filter(id=>id!==old.id); if(solo.memory) me.known.push(drawn.id);
  soloDiscard(me, old);
}
function soloDiscardDrawn(){ if(!solo||!solo.drawCard||solo.drawCard.fromDiscard) return; const c=solo.drawCard; solo.drawCard=null; soloDiscard(solo.players[0], c); }
function soloDiscard(player, card){
  solo.discard.push(card); solo.snapUntil=Date.now()+4000; soloLog(`${player.name} discarded ${card.rank}${card.suit}. Snap window — 4 seconds.`);
  renderSolo();
  // AI snap attempts during the window, speed/reliability by difficulty
  const delay = solo.diff==='hard'?350: solo.diff==='moderate'?900: 1600;
  setTimeout(()=>aiSnap(card), delay);
  setTimeout(()=>{
    if(!['J','Q','K'].includes(card.rank)) return soloNext();
    solo.pendingPower={playerId:player.id,rank:card.rank,step:card.rank==='K'?'look':card.rank==='Q'?'look':'swap'};
    soloLog(`${player.name} must use the ${card.rank} power.`);
    renderSolo();
    if(player.isAI) setTimeout(()=>aiPower(player), 1400); else alert(`You discarded a ${card.rank} — you must use its power. Tap a card to ${solo.pendingPower.step}.`);
  }, 4100);
}
function aiSnap(topCard){
  if(!solo) return;
  const rel = solo.diff==='hard'?0.98: solo.diff==='moderate'?0.75:0.45;
  if(Math.random()>rel) return;
  // Hard AI: perfect memory — snap a known matching card. Others: only snap if they happen to know one.
  for(const p of solo.players){ if(p.isAI){ const idx=p.hand.findIndex(c=>c.rank===topCard.rank && (solo.diff==='hard' || p.aiMemory[c.id])); if(idx>=0){ soloLog(`${p.name} snapped ${topCard.rank}!`); p.hand.splice(idx,1); renderSolo(); return; } } }
}
function aiPower(player){
  if(!solo||!solo.pendingPower) return;
  const others=solo.players.filter(p=>p!==player);
  const target=others[Math.floor(Math.random()*others.length)];
  if(solo.pendingPower.step==='look'){ const idx=Math.floor(Math.random()*target.hand.length); player.aiMemory[target.hand[idx].id]=target.hand[idx]; soloLog(`${player.name} looked at one of ${target.name}'s cards.`); if(solo.pendingPower.rank==='Q'){ solo.pendingPower=null; return soloNext(); } solo.pendingPower.step='swap'; }
  // swap two random cards
  const a=solo.players[Math.floor(Math.random()*solo.players.length)], b=solo.players[Math.floor(Math.random()*solo.players.length)];
  if(a.hand.length&&b.hand.length){ const i=Math.floor(Math.random()*a.hand.length), j=Math.floor(Math.random()*b.hand.length); [a.hand[i],b.hand[j]]=[b.hand[j],a.hand[i]]; soloLog(`${player.name} swapped two cards.`); }
  solo.pendingPower=null; soloNext();
}
function soloNext(){
  if(solo.cambio){ solo.finalLeft--; if(solo.finalLeft<=0 || solo.players[solo.turn].id===solo.cambio) return soloFinish(); }
  solo.turn=(solo.turn+1)%solo.players.length; solo.drawCard=null; renderSolo(); setTimeout(aiTurn, 1400);
}
function soloFinish(){
  solo.phase='finished'; const scored=solo.players.map(p=>({p,s:score(p.hand)})); const best=Math.min(...scored.map(x=>x.s));
  const tied=scored.filter(x=>x.s===best).sort((a,b)=>(b.p.hand.length-a.p.hand.length)||((a.p.id===solo.cambio)-(b.p.id===solo.cambio)));
  solo.winner=tied[0].p; soloLog(`🏆 ${tied[0].p.name} wins with ${best}!`); renderSolo();
}
function aiTurn(){
  if(!solo||solo.phase!=='playing'||solo.turn===0||solo.pendingPower) return;
  const p=solo.players[solo.turn];
  // Simple AI: draw, keep if it improves a known high card, else discard drawn.
  const drawn=solo.deck.pop(); const worstIdx=p.hand.reduce((wi,c,i,arr)=>c.value>arr[wi].value?i:wi,0);
  if(drawn.value < p.hand[worstIdx].value){ const old=p.hand[worstIdx]; p.hand[worstIdx]=drawn; if(solo.diff==='hard') p.aiMemory[drawn.id]=drawn; soloDiscard(p, old); }
  else soloDiscard(p, drawn);
  // AI may call Cambio on a low hand
  const threshold = solo.diff==='hard'?4: solo.diff==='moderate'?5:7;
  if(score(p.hand)<=threshold && !solo.cambio){ solo.cambio=p.id; solo.finalLeft=solo.players.length-1; soloLog(`${p.name} called CAMBIO!`); }
}
function soloCallCambio(){ if(!solo||solo.turn!==0) return; solo.cambio='p0'; solo.finalLeft=solo.players.length-1; soloLog('You called CAMBIO! Your cards are immune.'); soloNext(); }
function soloSnap(targetIdx, handIdx){
  if(!solo||Date.now()>solo.snapUntil||!solo.discard.length) return;
  const target=solo.players[targetIdx]; if(target.id===solo.cambio) return alert('That player called Cambio — immune.');
  const top=solo.discard[solo.discard.length-1]; const card=target.hand[handIdx];
  if(card.rank===top.rank){ target.hand.splice(handIdx,1); soloLog(`You snapped ${card.rank}${card.suit} off ${target.name}!`); if(targetIdx!==0){ const give=solo.players[0].hand.pop(); if(give) target.hand.push(give); } renderSolo(); }
  else { const pen=solo.deck.pop(); pen.unknown=true; solo.players[0].hand.push(pen); soloLog('Wrong snap — that card goes back, and you take a face-down penalty card.'); alert('Wrong snap — penalty card added face down.'); renderSolo(); }
}
function renderSolo(){
  if(!solo) return; show('game'); $('table').className='table felt-'+settings.felt;
  $('turn-strip').innerHTML='<span>↻ Clockwise:</span>'+solo.players.map((p,i)=>`<div class="${i===solo.turn?'active':''}">${i+1}. ${p.name}${i===0?' (you)':''} • ${solo.diff}</div>`).join('');
  const banner=$('banner');
  if(solo.phase==='finished'){ banner.classList.remove('hidden'); banner.textContent = solo.winner?.id==='p0'?'🎉 You win!':`🏆 ${solo.winner?.name} wins!`; }
  else if(solo.turn===0){ banner.classList.remove('hidden'); banner.classList.add('pulse'); banner.textContent='YOUR TURN'; } else banner.classList.add('hidden');
  $('deck-count').textContent=solo.deck.length;
  $('discard-pile').textContent=solo.discard.length? solo.discard[solo.discard.length-1].rank+solo.discard[solo.discard.length-1].suit : 'Empty';
  if(solo.phase==='drawFirst'){ $('drawfirst').classList.remove('hidden'); $('board').classList.add('hidden'); $('fan').innerHTML=Array.from({length:18},(_,i)=>cardHtml({back:true},{onclick:`soloPick(${i})`})).join(''); $('drawfirst-result').innerHTML=solo.picks.map(p=>`${p.name}: ${p.card.rank}${p.card.suit}`).join(' • '); }
  else { $('drawfirst').classList.add('hidden'); $('board').classList.remove('hidden'); }
  const me=solo.players[0];
  if(solo.drawCard){ $('game-actions').innerHTML=`<p>You hold ${solo.drawCard.rank}${solo.drawCard.suit}. Tap one of your cards to swap it in.</p>${solo.drawCard.fromDiscard?'':`<button onclick="soloDiscardDrawn()">Put it straight on the discard pile</button>`}`; }
  else if(solo.turn===0&&solo.phase==='playing'){ $('game-actions').innerHTML=`<button onclick="soloCallCambio()">Call CAMBIO!</button><span>Tap draw / discard pile, or a face-up card to snap.</span>`; }
  else if(solo.pendingPower?.playerId==='p0'){ $('game-actions').innerHTML=`<p><b>${solo.pendingPower.rank} power — mandatory.</b> Tap a card to ${solo.pendingPower.step}.</p>`; }
  else $('game-actions').innerHTML= Date.now()<solo.snapUntil?'<p>⚡ Snap window open — tap a matching card!</p>':'';
  $('players').innerHTML=solo.players.map((p,pi)=>{
    const hand=p.hand.map((c,i)=>{
      if(pi===0) return cardHtml(c,{onclick: solo.drawCard?`soloSwap(${i})`:(solo.pendingPower?.playerId==='p0'?`soloPowerTap(${pi},${i})`:`soloSnap(${pi},${i})`), rem: (solo.memory&&me.known.includes(c.id))?(c.rank==='JOKER'?'0':c.rank):null});
      return cardHtml({back:true},{onclick:`soloSnap(${pi},${i})`});
    }).join('');
    return `<div class="player ${pi===solo.turn?'active':''} ${solo.cambio===p.id?'immune':''}"><h3>${p.name}${pi===0?' (you)':''} — ${p.hand.length} cards${solo.phase==='finished'?' • '+score(p.hand):''}${solo.cambio===p.id?' • CAMBIO — immune':''}</h3><div class="hand">${hand}</div>${solo.cambio===p.id?'<div class="cambio-stamp"><span>CAMBIO!</span></div>':''}${pi===0&&solo.drawCard?`<div style="margin-top:6px">Holding: ${cardHtml(solo.drawCard)}</div>`:''}</div>`;
  }).join('');
  $('game-log').innerHTML=solo.log.slice(-6).join('<br>');
}
let soloPowerFirst=null;
function soloPowerTap(pi, idx){
  if(!solo?.pendingPower) return;
  if(solo.pendingPower.step==='look'){ const t=solo.players[pi]; alert(`You looked at ${t.name}'s card: ${t.hand[idx].rank}${t.hand[idx].suit}`); if(solo.memory) solo.players[0].known.push(t.hand[idx].id); if(solo.pendingPower.rank==='Q'){ solo.pendingPower=null; return soloNext(); } solo.pendingPower.step='swap'; renderSolo(); }
  else { if(!soloPowerFirst){ soloPowerFirst={pi,idx}; alert('First card chosen — tap the second.'); } else { const a=solo.players[soloPowerFirst.pi], b=solo.players[pi]; [a.hand[soloPowerFirst.idx],b.hand[idx]]=[b.hand[idx],a.hand[soloPowerFirst.idx]]; soloLog('You swapped two cards.'); soloPowerFirst=null; solo.pendingPower=null; soloNext(); } }
}
