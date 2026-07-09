const song         = document.getElementById('birthdaySong');
const canvas       = document.getElementById('scratchCanvas');
const ctx          = canvas.getContext('2d', { willReadFrequently: true });
const container    = document.getElementById('scratchContainer');
const progressBar  = document.getElementById('progressBar');
const btnCelebrate = document.getElementById('btnCelebrate');
const burstCanvas  = document.getElementById('burstCanvas');
const bCtx         = burstCanvas.getContext('2d');

const terminalLines = [
  { text: '$ sudo run birthday_hack.sh',         cls: 'white',   pause: 120  },
  { text: '[*] Initializing exploit modules...', cls: 'dim',     pause: 300  },
  { text: '[*] Scanning target...',              cls: 'dim',     pause: 250  },
  { text: '[+] Target found: Samer',             cls: '',        pause: 280  },
  { text: '[*] Bypassing firewall...',           cls: 'dim',     pause: 260  },
  { text: '[+] Firewall bypassed ✓',             cls: '',        pause: 280  },
  { text: '[!] Decrypting birthday message...', cls: 'yellow',  pause: 200  },
  { text: 'PROGRESS_BAR',                        cls: 'bar',     pause: 600  },
  { text: '',                                    cls: 'dim',     pause: 100  },
  { text: '  ACCESS GRANTED 🎂',                 cls: 'granted', pause: 120  },
  { text: '  Happy Birthday, Samer! 🎉',         cls: 'granted', pause: 100  },
  { text: '',                                    cls: 'dim',     pause: 80   },
  { text: '$ _',                                 cls: 'white',   pause: 80   },
];

function typeTerminal() {
  const body = document.getElementById('terminalBody');
  let lineIndex = 0;

  function typeLine(lineEl, text, cb) {
    let i = 0;
    function tick() {
      lineEl.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) {
        const speed = text.includes('GRANTED') || text.includes('Happy') ? 40 : 18;
        setTimeout(tick, speed);
      } else {
        if (cb) cb();
      }
    }
    tick();
  }

  function animateProgressBar(barEl, cb) {
    const bars = [
      { el: null, pct: 0 },
      { el: null, pct: 0 },
      { el: null, pct: 0 },
    ];
    const colors = ['#00c840', '#febc2e', '#00c840'];
    const labels = ['[>] Cracking key...  ', '[>] Decoding data... ', '[>] Injecting msg... '];

    bars.forEach((b, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex; align-items:center; gap:8px; margin:2px 0;';
      const lbl = document.createElement('span');
      lbl.textContent = labels[idx];
      lbl.style.cssText = `color:#555; font-size:0.78rem; white-space:pre; min-width:140px;`;
      const track = document.createElement('div');
      track.style.cssText = `flex:1; height:6px; background:#1a1a1a; border-radius:3px; overflow:hidden;`;
      const fill = document.createElement('div');
      fill.style.cssText = `height:100%; width:0%; background:${colors[idx]}; border-radius:3px; transition:width 0.05s linear;`;
      track.appendChild(fill);
      row.appendChild(lbl);
      row.appendChild(track);
      barEl.appendChild(row);
      bars[idx].fill = fill;
    });

    let idx = 0;
    function runBar() {
      if (idx >= bars.length) { setTimeout(cb, 200); return; }
      const fill = bars[idx].fill;
      let pct = 0;
      function step() {
        pct += Math.random() * 6 + 3;
        if (pct >= 100) { fill.style.width = '100%'; idx++; setTimeout(runBar, 120); return; }
        fill.style.width = pct + '%';
        setTimeout(step, 30);
      }
      step();
    }
    runBar();
  }

  function nextLine() {
    if (lineIndex >= terminalLines.length) {
      document.getElementById('btnStart').style.display = 'block';
      return;
    }
    const { text, cls, pause } = terminalLines[lineIndex];
    lineIndex++;

    setTimeout(() => {
      if (text === 'PROGRESS_BAR') {
        const el = document.createElement('div');
        el.style.cssText = 'margin: 4px 0;';
        body.appendChild(el);
        body.scrollTop = body.scrollHeight;
        animateProgressBar(el, nextLine);
        return;
      }

      const el = document.createElement('div');
      el.className = 'terminal-line' + (cls ? ' ' + cls : '');
      body.appendChild(el);
      body.scrollTop = body.scrollHeight;

      if (text === '') {
        el.innerHTML = '&nbsp;';
        nextLine();
      } else {
        typeLine(el, text, nextLine);
      }
    }, pause);
  }

  nextLine();
}

typeTerminal();

document.getElementById('btnStart').addEventListener('click', function () {
  // Direct play inside click handler — required for mobile audio unlock
  const playPromise = song.play();
  if (playPromise !== undefined) {
    playPromise.catch(() => {
      // If autoplay blocked, re-try once on next user interaction
      document.addEventListener('touchstart', function retryPlay() {
        song.play().catch(() => {});
        document.removeEventListener('touchstart', retryPlay);
      }, { once: true });
    });
  }
  const screen = document.getElementById('startScreen');
  screen.classList.add('hidden');
  setTimeout(() => { screen.style.display = 'none'; }, 650);
});

(function loadPhoto() {
  const img   = document.getElementById('friendsPhoto');
  const names = ['photoo.png', 'photoo.jpg'];
  let idx = 0;
  function tryNext() {
    if (idx >= names.length) return;
    img.onerror = () => { idx++; tryNext(); };
    img.onload  = () => {};
    img.src = names[idx];
  }
  tryNext();
})();

(function spawnConfetti() {
  const wrap   = document.getElementById('confettiWrap');
  const colors = ['#00c840', '#00ff46', '#39ff14', '#00ffa0', '#aaffcc', '#005520'];
  const count  = window.innerWidth < 500 ? 25 : 45;
  for (let i = 0; i < count; i++) {
    const el   = document.createElement('div');
    el.className = 'dot';
    const size = Math.random() * 5 + 2;
    el.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}vw;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      animation-duration:${Math.random() * 6 + 5}s;
      animation-delay:${Math.random() * 8}s;
      opacity:0.35;
    `;
    wrap.appendChild(el);
  }
})();

let isDrawing  = false;
let revealed   = false;
let frameCount = 0;

function initCanvas() {
  const rect  = container.getBoundingClientRect();
  const dpr   = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width        = rect.width  * dpr;
  canvas.height       = rect.height * dpr;
  canvas.style.width  = rect.width  + 'px';
  canvas.style.height = rect.height + 'px';
  ctx.scale(dpr, dpr);
  drawScratchLayer(rect.width, rect.height);
}

function drawScratchLayer(w, h) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0,   '#0f1f0f');
  grad.addColorStop(0.4, '#1a2e1a');
  grad.addColorStop(0.7, '#0a180a');
  grad.addColorStop(1,   '#162616');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  for (let y = 0; y < h; y += 4) {
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.fillRect(0, y, w, 2);
  }

  ctx.save();
  ctx.fillStyle    = 'rgba(0, 255, 70, 0.55)';
  ctx.font         = `bold ${Math.floor(w * 0.065)}px Courier New, monospace`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('[ SCRATCH TO DECRYPT ]', w / 2, h / 2 - 14);
  ctx.font = `${Math.floor(w * 0.045)}px Courier New, monospace`;
  ctx.fillStyle = 'rgba(0, 200, 64, 0.35)';
  ctx.restore();
}

function scratch(x, y) {
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  const r = window.matchMedia('(pointer: coarse)').matches ? 32 : 26;
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  frameCount++;
  if (frameCount % 4 === 0) checkProgress();
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  if (e.touches) {
    return {
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    };
  }
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function checkProgress() {
  if (revealed) return;
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let transparent = 0, total = 0;
  for (let i = 3; i < data.length; i += 16) {
    if (data[i] < 128) transparent++;
    total++;
  }
  const pct = Math.min(100, Math.round((transparent / total) * 100));
  progressBar.style.width = pct + '%';

  if (pct >= 80) {
    revealed = true;
    canvas.style.transition = 'opacity 0.8s ease';
    canvas.style.opacity    = '0';
    setTimeout(() => { canvas.style.display = 'none'; }, 800);
    progressBar.style.width = '100%';
    btnCelebrate.style.display = 'block';
  }
}

canvas.addEventListener('mousedown',  e => { isDrawing = true;  const p = getPos(e); scratch(p.x, p.y); });
canvas.addEventListener('mousemove',  e => { if (isDrawing) { const p = getPos(e); scratch(p.x, p.y); } });
canvas.addEventListener('mouseup',    () => { isDrawing = false; });
canvas.addEventListener('mouseleave', () => { isDrawing = false; });

canvas.addEventListener('touchstart',  e => { e.preventDefault(); isDrawing = true;  const p = getPos(e); scratch(p.x, p.y); }, { passive: false });
canvas.addEventListener('touchmove',   e => { e.preventDefault(); if (isDrawing) { const p = getPos(e); scratch(p.x, p.y); } }, { passive: false });
canvas.addEventListener('touchend',    () => { isDrawing = false; });
canvas.addEventListener('touchcancel', () => { isDrawing = false; });

window.addEventListener('resize', initCanvas);
initCanvas();

let particles = [];
let animId    = null;
const isMobile = window.innerWidth < 600;

function resizeBurst() {
  burstCanvas.width  = window.innerWidth;
  burstCanvas.height = window.innerHeight;
}
resizeBurst();
window.addEventListener('resize', resizeBurst);

function createBurst(x, y) {
  const palettes = [
    ['#ffd700', '#ffaa00', '#fff7a0'],
    ['#ff69b4', '#ff1493', '#ffb6d9'],
    ['#7b68ee', '#4a3fbf', '#c4baff'],
    ['#00cfff', '#0077ff', '#a0e8ff'],
    ['#ff4500', '#ff6a00', '#ffbb80'],
    ['#adff2f', '#39ff14', '#d4ffaa'],
  ];
  const palette = palettes[Math.floor(Math.random() * palettes.length)];
  const count   = isMobile ? 55 : 90;

  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5) * 0.3;
    const speed = Math.random() * 7 + 1.5;
    particles.push({
      x, y, px: x, py: y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      alpha:   1,
      color:   palette[Math.floor(Math.random() * palette.length)],
      size:    Math.random() * 3.5 + 1.5,
      isStar:  Math.random() < 0.3,
      gravity: 0.07 + Math.random() * 0.06,
      decay:   0.016 + Math.random() * 0.008,
    });
  }
}

function drawStar(x, y, r, color, alpha) {
  bCtx.globalAlpha = alpha;
  bCtx.fillStyle   = color;
  bCtx.beginPath();
  for (let s = 0; s < 10; s++) {
    const rad = s % 2 === 0 ? r : r * 0.42;
    const a   = (Math.PI / 5) * s - Math.PI / 2;
    s === 0
      ? bCtx.moveTo(x + rad * Math.cos(a), y + rad * Math.sin(a))
      : bCtx.lineTo(x + rad * Math.cos(a), y + rad * Math.sin(a));
  }
  bCtx.closePath();
  bCtx.fill();
}

function animateBurst() {
  bCtx.globalAlpha = 0.22;
  bCtx.fillStyle   = '#0d0d1a';
  bCtx.fillRect(0, 0, burstCanvas.width, burstCanvas.height);
  bCtx.globalAlpha = 1;

  const alive = [];
  for (let k = 0; k < particles.length; k++) {
    const p = particles[k];
    if (p.alpha <= 0.01) continue;
    alive.push(p);

    bCtx.globalAlpha = p.alpha * 0.35;
    bCtx.strokeStyle = p.color;
    bCtx.lineWidth   = p.size * 0.7;
    bCtx.beginPath();
    bCtx.moveTo(p.px, p.py);
    bCtx.lineTo(p.x,  p.y);
    bCtx.stroke();

    if (p.isStar) {
      drawStar(p.x, p.y, p.size + 1, p.color, p.alpha);
    } else {
      bCtx.globalAlpha = p.alpha;
      bCtx.fillStyle   = p.color;
      bCtx.beginPath();
      bCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      bCtx.fill();
    }

    p.px     = p.x;
    p.py     = p.y;
    p.x     += p.vx;
    p.y     += p.vy;
    p.vy    += p.gravity;
    p.vx    *= 0.985;
    p.alpha -= p.decay;
  }

  particles = alive;

  if (particles.length > 0) {
    animId = requestAnimationFrame(animateBurst);
  } else {
    cancelAnimationFrame(animId);
    bCtx.clearRect(0, 0, burstCanvas.width, burstCanvas.height);
  }
}

function launchFireworks() {

  const w = burstCanvas.width;
  const h = burstCanvas.height;
  const spots = [
    [w * 0.25, h * 0.28],
    [w * 0.75, h * 0.28],
    [w * 0.5,  h * 0.16],
    [w * 0.15, h * 0.48],
    [w * 0.85, h * 0.48],
    [w * 0.4,  h * 0.36],
    [w * 0.6,  h * 0.36],
  ];
  let i = 0;
  const rounds = isMobile ? 2 : 3;
  function fire() {
    if (i >= spots.length * rounds) return;
    const [x, y] = spots[i % spots.length];
    createBurst(x + (Math.random() - 0.5) * 90, y + (Math.random() - 0.5) * 70);
    i++;
    setTimeout(fire, isMobile ? 180 : 140);
  }
  fire();
  cancelAnimationFrame(animId);
  animateBurst();
}
