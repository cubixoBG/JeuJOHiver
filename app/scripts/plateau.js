const OC = ['#0085C7','#1a1a1a','#DF0024','#F4A900','#009F6B'];

const CAT_BY_ID = {
  0: { bg:'#fff8e1', border:'#F4A900', fg:'#c48800', ring:'#F4A900' },
  1: { bg:'#edfaf3', border:'#009F6B', fg:'#007a52', ring:'#009F6B' },
  2: { bg:'#e8f4fc', border:'#0085C7', fg:'#0068a0', ring:'#0085C7' },
  3: { bg:'#f2f2f2', border:'#333',    fg:'#333',    ring:'#1a1a1a' },
  4: { bg:'#fff0f2', border:'#DF0024', fg:'#c0001e', ring:'#DF0024' },
};

const RING_DISPLAY = [
  { color:'#0085C7', catId: 2 },
  { color:'#1a1a1a', catId: 3 },
  { color:'#DF0024', catId: 4 },
  { color:'#F4A900', catId: 0 },
  { color:'#009F6B', catId: 1 },
];

const PLAYER_COLORS = ['#0085C7','#DF0024','#F4A900','#009F6B','#7c4dff'];

const CS   = 52;
const GAP  = 8;
const STEP = CS + GAP;
const CR   = 10;

let boardCells = [];

function drawBoard() {
  const canvas = document.getElementById('c-board');
  const wrap   = document.getElementById('board-wrap');
  const W = wrap.clientWidth  - 20;
  const H = wrap.clientHeight - 20;
  canvas.width  = W;
  canvas.height = H;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = '#ffffff';
  rrect(ctx, 0, 0, W, H, 14);
  ctx.fill();

  buildCells(W, H);

  const img = new Image();
  img.onload  = () => renderBoard(ctx, W, H, img);
  img.onerror = () => renderBoard(ctx, W, H, null);
  img.src = 'logoAppli.webp';
}

function renderBoard(ctx, W, H, img) {
  if (img) {
    const mw = W * 0.28, mh = H * 0.24;
    const sc = Math.min(mw / img.width, mh / img.height);
    const iw = img.width * sc, ih = img.height * sc;
    const ix = (W - iw) / 2, iy = (H - ih) / 2 - 16;
    ctx.drawImage(img, ix, iy, iw, ih);
    ctx.font = '800 13px "Segoe UI", sans-serif';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('OLYMPIA QUIZZ', W/2, iy + ih + 6);
  } else {
    drawRingsCtx(ctx, W/2, H/2 - 22, 18, OC);
    ctx.font = '800 13px "Segoe UI", sans-serif';
    ctx.fillStyle = '#111';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    ctx.fillText('OLYMPIA QUIZZ', W/2, H/2 + 20);
  }

  ctx.save();
  ctx.strokeStyle = '#d4d4d4';
  ctx.lineWidth   = 1.5;
  ctx.setLineDash([3, 4]);
  for (let i = 0; i < boardCells.length - 1; i++) {
    const a = boardCells[i], b = boardCells[i+1];
    ctx.beginPath();
    ctx.moveTo(a.x + CS/2, a.y + CS/2);
    ctx.lineTo(b.x + CS/2, b.y + CS/2);
    ctx.stroke();
  }
  ctx.restore();

  boardCells.forEach(cell => drawCell(ctx, cell));

  drawPawns(ctx);
}

function buildCells(W, H) {
  boardCells = [];
  const cols = Math.floor((W - CS) / STEP) + 1;
  const rows = Math.floor((H - CS) / STEP) + 1;
  const ox   = Math.round((W - ((cols-1)*STEP + CS)) / 2);
  const oy   = Math.round((H - ((rows-1)*STEP + CS)) / 2);

  const seq = (typeof plateauLogique !== 'undefined' && plateauLogique.length)
    ? plateauLogique : [];

  let idx = 0;
  const push = (col, row) => {
    const catId = seq[idx] ? seq[idx].categorieId : (idx % 5);
    boardCells.push({ x: ox + col*STEP, y: oy + row*STEP, cat: catId, n: idx });
    idx++;
  };

  // Haut (gauche → droite)
  for (let c = 0; c < cols; c++) push(c, 0);
  // Droite (haut+1 → bas, on évite le coin haut-droit déjà posé)
  for (let r = 1; r < rows; r++) push(cols-1, r);
  // Bas (droite-1 → gauche, on évite le coin bas-droit déjà posé)
  for (let c = cols-2; c >= 0; c--) push(c, rows-1);
  // Gauche (bas-1 → haut+1, on évite les deux coins déjà posés)
  for (let r = rows-2; r >= 1; r--) push(0, r);
}

function drawCell(ctx, cell) {
  const { x, y, cat, n } = cell;

  if (n === 0) {
    // Case départ
    ctx.fillStyle = '#0085C7';
    rrect(ctx, x, y, CS, CS, CR);
    ctx.fill();
    const j = (typeof gameState !== 'undefined') && gameState.joueurs[gameState.indexJoueurActif];
    ctx.font = 'bold 16px "Segoe UI"';
    ctx.fillStyle    = '#fff';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(j ? j.nom[0].toUpperCase() : 'J', x + CS/2, y + CS/2 - 7);
    ctx.font = 'bold 8px "Segoe UI"';
    ctx.fillText('START', x + CS/2, y + CS/2 + 10);
    return;
  }

  const c = CAT_BY_ID[cat] || CAT_BY_ID[0];

  ctx.fillStyle = c.bg;
  rrect(ctx, x, y, CS, CS, CR);
  ctx.fill();

  ctx.strokeStyle = c.border;
  ctx.lineWidth   = 1.5;
  rrect(ctx, x, y, CS, CS, CR);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + CS/2, y + CS/2 - 5, 13, 0, Math.PI*2);
  ctx.strokeStyle = c.ring;
  ctx.lineWidth   = 4.5;
  ctx.stroke();

  ctx.font = '400 10px "Segoe UI"';
  ctx.fillStyle    = c.fg;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(n, x + CS/2, y + CS/2 + 15);
}

function drawPawns(ctx) {
  if (typeof gameState === 'undefined' || !gameState) return;
  gameState.joueurs.forEach((j, pi) => {
    const cell = boardCells[j.position % boardCells.length];
    if (!cell) return;
    const total  = gameState.joueurs.length;
    const offset = (pi - (total - 1) / 2) * 14;
    const px = cell.x + CS/2 + offset;
    const py = cell.y + CS/2;

    ctx.beginPath();
    ctx.arc(px, py, 11, 0, Math.PI*2);
    ctx.fillStyle = PLAYER_COLORS[pi % PLAYER_COLORS.length];
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth   = 2.5;
    ctx.stroke();

    ctx.font = 'bold 10px "Segoe UI"';
    ctx.fillStyle    = '#fff';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(j.nom[0].toUpperCase(), px, py);
  });
}

function renderSidebar() {
  const list = document.getElementById('players-list');
  list.innerHTML = '';
  if (typeof gameState === 'undefined' || !gameState) return;

  gameState.joueurs.forEach((j, pi) => {
    const isActive = pi === gameState.indexJoueurActif;
    const card = document.createElement('div');
    card.className = 'player-card' + (isActive ? ' active' : '');

    const header = document.createElement('div');
    header.className = 'player-header';

    const av = document.createElement('div');
    av.className = 'player-avatar';
    av.style.background = PLAYER_COLORS[pi % PLAYER_COLORS.length];
    av.textContent = j.nom[0].toUpperCase();

    const info = document.createElement('div');
    const nm = document.createElement('div');
    nm.className = 'player-name';
    nm.textContent = j.nom;
    info.appendChild(nm);
    if (isActive) {
      const t = document.createElement('div');
      t.className = 'player-turn';
      t.textContent = "C'est ton tour !";
      info.appendChild(t);
    }
    header.appendChild(av);
    header.appendChild(info);
    card.appendChild(header);

    const ringsRow = document.createElement('div');
    ringsRow.className = 'player-rings';
    RING_DISPLAY.forEach(({ color, catId }) => {
      const filled = j.anneaux && j.anneaux[catId] === true;
      const c = document.createElement('canvas');
      c.width = 24; c.height = 24;
      drawSmallRing(c, color, filled);
      ringsRow.appendChild(c);
    });
    card.appendChild(ringsRow);
    list.appendChild(card);
  });
}

function drawSmallRing(canvas, color, filled) {
  const ctx = canvas.getContext('2d');
  const S   = canvas.width;
  ctx.clearRect(0, 0, S, S);
  if (filled) {
    ctx.beginPath();
    ctx.arc(S/2, S/2, S/2-4, 0, Math.PI*2);
    ctx.fillStyle = color + '30';
    ctx.fill();
  }
  ctx.beginPath();
  ctx.arc(S/2, S/2, S/2-3, 0, Math.PI*2);
  ctx.strokeStyle = filled ? color : color + '55';
  ctx.lineWidth   = filled ? 3 : 2.5;
  ctx.stroke();
}

function drawLogoRings() {
  const canvas = document.getElementById('c-logo-rings');
  const ctx    = canvas.getContext('2d');
  ctx.clearRect(0, 0, 156, 30);
  drawRingsCtx(ctx, 78, 15, 8, OC);
}

function drawRingsCtx(ctx, cx, cy, r, colors) {
  const cols = colors || OC;
  const pos = [
    { dx:-r*2.15, dy:-r*0.28 },
    { dx:-r*0.72, dy:-r*0.28 },
    { dx: r*0.72, dy:-r*0.28 },
    { dx:-r*1.44, dy: r*0.50 },
    { dx: r*0.00, dy: r*0.50 },
  ];
  cols.forEach((col, i) => {
    ctx.beginPath();
    ctx.arc(cx + pos[i].dx, cy + pos[i].dy, r, 0, Math.PI*2);
    ctx.strokeStyle = col;
    ctx.lineWidth   = Math.max(2, r * 0.32);
    ctx.stroke();
  });
}


function drawDice(val) {
  const canvas = document.getElementById('c-dice');
  const ctx    = canvas.getContext('2d');
  const S = 60;
  ctx.clearRect(0, 0, S, S);

  ctx.fillStyle = '#f0f2f5';
  rrect(ctx, 4, 4, S-8, S-8, 10); ctx.fill();
  ctx.strokeStyle = '#ddd';
  ctx.lineWidth   = 1;
  rrect(ctx, 4, 4, S-8, S-8, 10); ctx.stroke();

  if (!val) {
    ctx.font = 'bold 24px "Segoe UI"';
    ctx.fillStyle    = '#bbb';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', S/2, S/2);
    return;
  }

  const dots = {
    1: [[.5,.5]],
    2: [[.27,.27],[.73,.73]],
    3: [[.27,.27],[.5,.5],[.73,.73]],
    4: [[.27,.27],[.73,.27],[.27,.73],[.73,.73]],
    5: [[.27,.27],[.73,.27],[.5,.5],[.27,.73],[.73,.73]],
    6: [[.27,.23],[.73,.23],[.27,.5],[.73,.5],[.27,.77],[.73,.77]],
  };
  ctx.fillStyle = '#222';
  (dots[val]||[]).forEach(([dx,dy]) => {
    ctx.beginPath();
    ctx.arc(4 + dx*(S-8), 4 + dy*(S-8), 4.5, 0, Math.PI*2);
    ctx.fill();
  });
}

function rrect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.lineTo(x+w-r, y);    ctx.quadraticCurveTo(x+w, y,   x+w, y+r);
  ctx.lineTo(x+w, y+h-r);  ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
  ctx.lineTo(x+r, y+h);    ctx.quadraticCurveTo(x,   y+h, x,   y+h-r);
  ctx.lineTo(x,   y+r);    ctx.quadraticCurveTo(x,   y,   x+r, y);
  ctx.closePath();
}