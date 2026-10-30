// ============== KEYBOARD LAYOUT ==============
const KEY_LAYOUT = [
  { note: 'C3', black: false, key: 'z' },
  { note: 'C#3', black: true, key: 's' },
  { note: 'D3', black: false, key: 'x' },
  { note: 'D#3', black: true, key: 'd' },
  { note: 'E3', black: false, key: 'c' },
  { note: 'F3', black: false, key: 'v' },
  { note: 'F#3', black: true, key: 'g' },
  { note: 'G3', black: false, key: 'b' },
  { note: 'G#3', black: true, key: 'h' },
  { note: 'A3', black: false, key: 'n' },
  { note: 'A#3', black: true, key: 'j' },
  { note: 'B3', black: false, key: 'm' },

  { note: 'C4', black: false, key: 'q' },
  { note: 'C#4', black: true, key: '2' },
  { note: 'D4', black: false, key: 'w' },
  { note: 'D#4', black: true, key: '3' },
  { note: 'E4', black: false, key: 'e' },
  { note: 'F4', black: false, key: 'r' },
  { note: 'F#4', black: true, key: '5' },
  { note: 'G4', black: false, key: 't' },
  { note: 'G#4', black: true, key: '6' },
  { note: 'A4', black: false, key: 'y' },
  { note: 'A#4', black: true, key: '7' },
  { note: 'B4', black: false, key: 'u' },

  { note: 'C5', black: false, key: 'i' },
  { note: 'C#5', black: true, key: '9' },
  { note: 'D5', black: false, key: 'o' },
  { note: 'D#5', black: true, key: '0' },
  { note: 'E5', black: false, key: 'p' },
  { note: 'F5', black: false, key: '[' },
  { note: 'F#5', black: true, key: '=' },
  { note: 'G5', black: false, key: ']' },
];

const keyToNote = {};
const noteToKey = {};
KEY_LAYOUT.forEach(k => {
  keyToNote[k.key] = k.note;
  noteToKey[k.note] = k.key;
});

// SVG icons (professional, no emoji)
const ICONS = {
  music: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
  star: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  tree: `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L8 8h2L6 14h3l-4 6h14l-4-6h3L14 8h2L12 2z"/><rect x="11" y="20" width="2" height="3"/></svg>`,
  bell: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
  gift: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M8 8c0-2 1.5-4 4-4s4 2 4 4"/></svg>`
};

// ============== SNOW ==============
class SnowSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.flakes = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.initFlakes(100);
  }
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }
  initFlakes(n) {
    this.flakes = [];
    for (let i = 0; i < n; i++) this.flakes.push(this.make());
  }
  make() {
    return {
      x: Math.random() * this.canvas.width,
      y: Math.random() * this.canvas.height,
      r: Math.random() * 2.8 + 0.8,
      speed: Math.random() * 1.4 + 0.4,
      wind: Math.random() * 0.5 - 0.25,
      opacity: Math.random() * 0.55 + 0.25,
      swing: Math.random() * Math.PI * 2,
      swingSpeed: Math.random() * 0.02 + 0.008
    };
  }
  update() {
    for (const f of this.flakes) {
      f.y += f.speed;
      f.swing += f.swingSpeed;
      f.x += f.wind + Math.sin(f.swing) * 0.35;
      if (f.y > this.canvas.height + 8) { f.y = -8; f.x = Math.random() * this.canvas.width; }
      if (f.x > this.canvas.width + 8) f.x = -8;
      if (f.x < -8) f.x = this.canvas.width + 8;
    }
  }
  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const f of this.flakes) {
      this.ctx.beginPath();
      this.ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255,255,255,${f.opacity})`;
      this.ctx.fill();
    }
  }
}

// ============== GARLAND ==============
class Garland {
  constructor(container) {
    this.el = container;
    this.bulbs = [];
    this.colors = ['red', 'green', 'gold', 'blue'];
    this.build();
  }
  build() {
    this.el.innerHTML = '';
    this.bulbs = [];
    const count = Math.min(48, Math.floor(window.innerWidth / 22));
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'bulb ' + this.colors[i % this.colors.length];
      this.el.appendChild(b);
      this.bulbs.push(b);
    }
  }
  // Pulse random bulbs (ambient)
  ambientPulse() {
    if (this.bulbs.length === 0) return;
    const n = 3 + Math.floor(Math.random() * 4);
    for (let i = 0; i < n; i++) {
      const idx = Math.floor(Math.random() * this.bulbs.length);
      const b = this.bulbs[idx];
      b.classList.add('on');
      setTimeout(() => b.classList.remove('on'), 180 + Math.random() * 220);
    }
  }
  // Flash in response to a played note
  flashNote(noteIndex) {
    if (this.bulbs.length === 0) return;
    const start = Math.floor((noteIndex / 32) * this.bulbs.length);
    const count = 4;
    for (let i = 0; i < count; i++) {
      const idx = (start + i) % this.bulbs.length;
      const b = this.bulbs[idx];
      b.classList.add('on');
      setTimeout(() => b.classList.remove('on'), 160);
    }
  }
  // Strong flash on hit
  flashHit() {
    const n = Math.min(8, this.bulbs.length);
    const start = Math.floor(Math.random() * Math.max(1, this.bulbs.length - n));
    for (let i = 0; i < n; i++) {
      const b = this.bulbs[start + i];
      if (b) {
        b.classList.add('on');
        setTimeout(() => b.classList.remove('on'), 200);
      }
    }
  }
  // All on briefly
  flashAll(ms = 300) {
    this.bulbs.forEach(b => b.classList.add('on'));
    setTimeout(() => this.bulbs.forEach(b => b.classList.remove('on')), ms);
  }
}

// ============== RHYTHM GAME ==============
class RhythmGame {
  constructor() {
    this.canvas = document.getElementById('notes-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.notes = [];
    this.chart = [];
    this.startTime = 0;
    this.pausedAt = 0;
    this.playing = false;
    this.paused = false;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.totalNotes = 0;
    this.fallDuration = 2.2;
    this.hitWindow = 0.18;
    this.lanePositions = {};
    this.animId = null;
    this.songTitle = '';
  }

  resize() {
    const container = document.getElementById('track-container');
    if (!container || container.classList.contains('hidden')) return;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.calculateLanes();
  }

  calculateLanes() {
    const piano = document.getElementById('piano');
    const keys = piano.querySelectorAll('.key');
    const containerRect = document.getElementById('track-container').getBoundingClientRect();
    this.lanePositions = {};
    keys.forEach(keyEl => {
      const note = keyEl.dataset.note;
      const rect = keyEl.getBoundingClientRect();
      this.lanePositions[note] = {
        x: rect.left + rect.width / 2 - containerRect.left,
        width: rect.width,
        isBlack: keyEl.classList.contains('black')
      };
    });
  }

  loadChart(chartNotes, title) {
    this.chart = chartNotes.map(n => ({ ...n, hit: false, spawned: false }));
    this.totalNotes = this.chart.length;
    this.score = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.hits = 0;
    this.misses = 0;
    this.notes = [];
    this.songTitle = title || '';
    this.paused = false;
    this.playing = false;
    this.updateHUD();
    this.updatePauseButton();
  }

  start() {
    this.playing = true;
    this.paused = false;
    this.startTime = performance.now() / 1000;
    this.notes = [];
    this.chart.forEach(n => { n.hit = false; n.spawned = false; });
    this.updatePauseButton();
    this.loop();
  }

  pause() {
    if (!this.playing || this.paused) return;
    this.paused = true;
    this.pausedAt = performance.now() / 1000;
    this.updatePauseButton();
  }

  resume() {
    if (!this.playing || !this.paused) return;
    const now = performance.now() / 1000;
    this.startTime += (now - this.pausedAt);
    this.paused = false;
    this.updatePauseButton();
    this.loop();
  }

  togglePause() {
    if (!this.playing) return;
    if (this.paused) this.resume();
    else this.pause();
  }

  stop() {
    this.playing = false;
    this.paused = false;
    if (this.animId) cancelAnimationFrame(this.animId);
    this.animId = null;
    this.updatePauseButton();
  }

  restart() {
    this.stop();
    this.loadChart(this.chart.map(n => ({ time: n.time, note: n.note, duration: n.duration })), this.songTitle);
    document.getElementById('results-overlay').classList.add('hidden');
    document.getElementById('start-overlay').classList.remove('hidden');
  }

  getTime() {
    return performance.now() / 1000 - this.startTime;
  }

  loop() {
    if (!this.playing || this.paused) return;
    const t = this.getTime();
    this.spawnNotes(t);
    this.updateNotes(t);
    this.draw(t);
    this.checkMisses(t);
    this.animId = requestAnimationFrame(() => this.loop());

    if (this.chart.length > 0) {
      const last = this.chart[this.chart.length - 1];
      if (t > last.time + last.duration + this.fallDuration + 1.2) {
        this.finish();
      }
    }
  }

  spawnNotes(t) {
    for (const n of this.chart) {
      if (!n.spawned && t >= n.time - this.fallDuration) {
        n.spawned = true;
        this.notes.push({
          note: n.note,
          targetTime: n.time,
          duration: n.duration,
          hit: false,
          y: 0
        });
      }
    }
  }

  updateNotes(t) {
    for (const n of this.notes) {
      if (n.hit) continue;
      const progress = (t - (n.targetTime - this.fallDuration)) / this.fallDuration;
      n.y = progress * this.canvas.height;
    }
    this.notes = this.notes.filter(n => {
      if (n.hit) return false;
      if (n.y > this.canvas.height + 40) return false;
      return true;
    });
  }

  checkMisses(t) {
    for (const n of this.notes) {
      if (n.hit) continue;
      if (t > n.targetTime + this.hitWindow) {
        n.hit = true;
        this.misses++;
        this.combo = 0;
        this.flashKey(n.note, false);
        this.updateHUD();
      }
    }
  }

  tryHit(note) {
    if (!this.playing || this.paused) return false;
    const t = this.getTime();
    let best = null;
    let bestDiff = Infinity;
    for (const n of this.notes) {
      if (n.hit || n.note !== note) continue;
      const diff = Math.abs(t - n.targetTime);
      if (diff < this.hitWindow && diff < bestDiff) {
        best = n;
        bestDiff = diff;
      }
    }
    if (best) {
      best.hit = true;
      this.hits++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      const accuracy = 1 - (bestDiff / this.hitWindow);
      const points = Math.round(100 * accuracy * (1 + this.combo * 0.05));
      this.score += points;
      this.flashKey(note, true);
      piano.playHit();
      garland.flashHit();
      this.updateHUD();
      return true;
    }
    return false;
  }

  flashKey(note, success) {
    const el = document.querySelector(`.key[data-note="${note}"]`);
    if (!el) return;
    el.classList.add(success ? 'hit' : 'miss');
    setTimeout(() => el.classList.remove('hit', 'miss'), 180);
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const note in this.lanePositions) {
      const lane = this.lanePositions[note];
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255,255,255,0.03)';
      ctx.lineWidth = 1;
      ctx.moveTo(lane.x, 0);
      ctx.lineTo(lane.x, this.canvas.height);
      ctx.stroke();
    }

    for (const n of this.notes) {
      if (n.hit) continue;
      const lane = this.lanePositions[n.note];
      if (!lane) continue;
      const w = lane.isBlack ? 20 : 32;
      const h = 16 + Math.min(n.duration * 22, 36);
      const x = lane.x - w / 2;
      const y = n.y - h;

      ctx.shadowBlur = 14;
      ctx.shadowColor = lane.isBlack ? '#ff6b6b' : '#2ee89a';

      const grad = ctx.createLinearGradient(x, y, x, y + h);
      if (lane.isBlack) {
        grad.addColorStop(0, '#ff9a9a');
        grad.addColorStop(1, '#c41e3a');
      } else {
        grad.addColorStop(0, '#7dffc0');
        grad.addColorStop(1, '#1a9a5c');
      }
      ctx.fillStyle = grad;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, 5);
      else { ctx.rect(x, y, w, h); }
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = 'rgba(255,255,255,0.3)';
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x + 2, y + 2, w - 4, 4, 2);
      else ctx.rect(x + 2, y + 2, w - 4, 4);
      ctx.fill();
    }
  }

  updateHUD() {
    document.getElementById('score').textContent = this.score;
    document.getElementById('combo').textContent = this.combo;
    const total = this.hits + this.misses;
    const acc = total === 0 ? 100 : Math.round((this.hits / total) * 100);
    document.getElementById('accuracy').textContent = acc + '%';
  }

  updatePauseButton() {
    const btn = document.getElementById('btn-pause');
    if (!btn) return;
    const label = document.getElementById('pause-label');
    const icoPause = btn.querySelector('.ico-pause');
    const icoPlay = btn.querySelector('.ico-play');
    if (!this.playing) {
      if (label) label.textContent = 'Пауза';
      if (icoPause) icoPause.style.display = '';
      if (icoPlay) icoPlay.style.display = 'none';
      btn.disabled = true;
      btn.style.opacity = '0.5';
    } else if (this.paused) {
      if (label) label.textContent = 'Продолжить';
      if (icoPause) icoPause.style.display = 'none';
      if (icoPlay) icoPlay.style.display = '';
      btn.disabled = false;
      btn.style.opacity = '1';
    } else {
      if (label) label.textContent = 'Пауза';
      if (icoPause) icoPause.style.display = '';
      if (icoPlay) icoPlay.style.display = 'none';
      btn.disabled = false;
      btn.style.opacity = '1';
    }
  }

  finish() {
    this.stop();
    garland.flashAll(600);
    const total = this.hits + this.misses;
    const acc = total === 0 ? 100 : Math.round((this.hits / total) * 100);
    document.getElementById('final-score').textContent = this.score;
    document.getElementById('final-combo').textContent = this.maxCombo;
    document.getElementById('final-accuracy').textContent = acc + '%';
    document.getElementById('results-overlay').classList.remove('hidden');
  }
}

// ============== APP ==============
const snowCanvas = document.getElementById('snow-canvas');
const snow = new SnowSystem(snowCanvas);
const garland = new Garland(document.getElementById('garland'));
const rhythm = new RhythmGame();

let mode = 'free';
let currentSongId = null;
let currentSongData = null;
let pressedKeys = new Set();
let ambientTimer = null;

function buildPiano() {
  const pianoEl = document.getElementById('piano');
  pianoEl.innerHTML = '';
  KEY_LAYOUT.forEach((k, idx) => {
    const el = document.createElement('div');
    el.className = 'key ' + (k.black ? 'black' : 'white');
    el.dataset.note = k.note;
    el.dataset.key = k.key;
    el.dataset.idx = idx;

    const name = document.createElement('div');
    name.className = 'note-name';
    name.textContent = k.note.replace(/[0-9]/, '');
    el.appendChild(name);

    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = k.key.toUpperCase();
    el.appendChild(label);

    el.addEventListener('mousedown', e => { e.preventDefault(); pressNote(k.note, idx); });
    el.addEventListener('mouseup', () => releaseNote(k.note));
    el.addEventListener('mouseleave', () => releaseNote(k.note));
    el.addEventListener('touchstart', e => { e.preventDefault(); pressNote(k.note, idx); }, { passive: false });
    el.addEventListener('touchend', () => releaseNote(k.note));

    pianoEl.appendChild(el);
  });
}

function pressNote(note, idx) {
  if (pressedKeys.has(note)) return;
  pressedKeys.add(note);
  const el = document.querySelector(`.key[data-note="${note}"]`);
  if (el) el.classList.add('active');
  piano.play(note, mode === 'rhythm' ? 0.45 : 1.0);
  const noteIdx = idx !== undefined ? idx : KEY_LAYOUT.findIndex(k => k.note === note);
  garland.flashNote(noteIdx >= 0 ? noteIdx : 0);
  if (mode === 'rhythm' && rhythm.playing) rhythm.tryHit(note);
}

function releaseNote(note) {
  pressedKeys.delete(note);
  const el = document.querySelector(`.key[data-note="${note}"]`);
  if (el) el.classList.remove('active');
}

// Keyboard
document.addEventListener('keydown', e => {
  if (e.repeat) return;
  const key = e.key.toLowerCase();

  // Space: start or pause
  if (key === ' ') {
    e.preventDefault();
    if (mode === 'rhythm') {
      if (!rhythm.playing && !document.getElementById('start-overlay').classList.contains('hidden')) {
        startRhythmSong();
      } else if (rhythm.playing) {
        rhythm.togglePause();
      }
    }
    return;
  }

  // Escape: stop
  if (key === 'escape' && mode === 'rhythm' && rhythm.playing) {
    e.preventDefault();
    stopAndReset();
    return;
  }

  if (keyToNote[key]) {
    e.preventDefault();
    const idx = KEY_LAYOUT.findIndex(k => k.key === key);
    pressNote(keyToNote[key], idx);
  }
});

document.addEventListener('keyup', e => {
  const key = e.key.toLowerCase();
  if (keyToNote[key]) releaseNote(keyToNote[key]);
});

// Mode
document.getElementById('btn-free').addEventListener('click', () => setMode('free'));
document.getElementById('btn-rhythm').addEventListener('click', () => showSongModal());
document.getElementById('btn-upload').addEventListener('click', () => {
  document.getElementById('upload-modal').classList.remove('hidden');
});
document.getElementById('close-modal').addEventListener('click', () => {
  document.getElementById('song-modal').classList.add('hidden');
});
document.getElementById('close-upload').addEventListener('click', () => {
  document.getElementById('upload-modal').classList.add('hidden');
});

function setMode(m) {
  mode = m;
  document.getElementById('btn-free').classList.toggle('active', m === 'free');
  document.getElementById('btn-rhythm').classList.toggle('active', m === 'rhythm');

  if (m === 'free') {
    rhythm.stop();
    document.getElementById('track-container').classList.add('hidden');
    document.getElementById('score-panel').classList.add('hidden');
    document.getElementById('playback-controls').classList.add('hidden');
    document.getElementById('start-overlay').classList.add('hidden');
    document.getElementById('results-overlay').classList.add('hidden');
  } else {
    document.getElementById('track-container').classList.remove('hidden');
    document.getElementById('score-panel').classList.remove('hidden');
    document.getElementById('playback-controls').classList.remove('hidden');
    setTimeout(() => rhythm.resize(), 40);
  }
}

function showSongModal() {
  const list = document.getElementById('song-list');
  list.innerHTML = '';

  const iconMap = {
    'jingle-bells': ICONS.bell,
    'silent-night': ICONS.star,
    'we-wish-you': ICONS.gift,
    'deck-the-halls': ICONS.tree
  };

  for (const id in SONGS) {
    const btn = document.createElement('button');
    btn.className = 'song-btn';
    const icon = iconMap[id] || ICONS.music;
    btn.innerHTML = `<span class="song-icon">${icon}</span><span>${SONGS[id].title}</span>`;
    btn.onclick = () => selectSong(id, SONGS[id]);
    list.appendChild(btn);
  }
  for (const id in customSongs) {
    const btn = document.createElement('button');
    btn.className = 'song-btn';
    btn.innerHTML = `<span class="song-icon">${ICONS.star}</span><span>${customSongs[id].title}</span>`;
    btn.onclick = () => selectSong(id, customSongs[id]);
    list.appendChild(btn);
  }
  document.getElementById('song-modal').classList.remove('hidden');
}

function selectSong(id, songData) {
  currentSongId = id;
  currentSongData = songData;
  document.getElementById('song-modal').classList.add('hidden');
  setMode('rhythm');
  document.getElementById('song-title').textContent = songData.title;
  document.getElementById('song-name-display').textContent = songData.title;
  rhythm.loadChart(songData.notes, songData.title);
  document.getElementById('start-overlay').classList.remove('hidden');
  document.getElementById('results-overlay').classList.add('hidden');
}

function startRhythmSong() {
  document.getElementById('start-overlay').classList.add('hidden');
  rhythm.start();
}

function stopAndReset() {
  rhythm.stop();
  document.getElementById('start-overlay').classList.add('hidden');
  document.getElementById('results-overlay').classList.add('hidden');
  setMode('free');
  currentSongId = null;
  currentSongData = null;
}

// Playback controls
document.getElementById('btn-pause').addEventListener('click', () => {
  if (rhythm.playing) rhythm.togglePause();
});
document.getElementById('btn-restart').addEventListener('click', () => {
  if (currentSongData) {
    rhythm.restart();
  }
});
document.getElementById('btn-stop').addEventListener('click', () => {
  stopAndReset();
});

// Results
document.getElementById('btn-retry').addEventListener('click', () => {
  document.getElementById('results-overlay').classList.add('hidden');
  if (currentSongData) {
    rhythm.loadChart(currentSongData.notes, currentSongData.title);
    document.getElementById('start-overlay').classList.remove('hidden');
  }
});
document.getElementById('btn-menu').addEventListener('click', () => {
  stopAndReset();
});

// Upload
document.getElementById('file-input').addEventListener('change', e => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = ev => {
    try {
      const data = JSON.parse(ev.target.result);
      let notes, title;
      if (Array.isArray(data)) {
        notes = data;
        title = file.name.replace(/\.json$/i, '') || 'Custom Song';
      } else if (data.notes) {
        notes = data.notes;
        title = data.title || file.name.replace(/\.json$/i, '');
      } else throw new Error('Неверный формат');

      if (!notes.length || !notes[0].note || typeof notes[0].time !== 'number') {
        throw new Error('Нужны поля time, note, duration');
      }

      const id = 'custom-' + Date.now();
      customSongs[id] = { title: title, notes };
      document.getElementById('upload-status').textContent = 'Загружено: ' + title;
      document.getElementById('upload-status').style.color = '#2ee89a';
      setTimeout(() => {
        document.getElementById('upload-modal').classList.add('hidden');
        selectSong(id, customSongs[id]);
      }, 600);
    } catch (err) {
      document.getElementById('upload-status').textContent = 'Ошибка: ' + err.message;
      document.getElementById('upload-status').style.color = '#ff5a5a';
    }
  };
  reader.readAsText(file);
});

document.getElementById('start-overlay').addEventListener('click', () => {
  if (!rhythm.playing) startRhythmSong();
});

// Ambient garland + snow
function animate() {
  snow.update();
  snow.draw();
  requestAnimationFrame(animate);
}

function startAmbient() {
  if (ambientTimer) clearInterval(ambientTimer);
  ambientTimer = setInterval(() => {
    if (mode === 'free' || (mode === 'rhythm' && !rhythm.playing)) {
      garland.ambientPulse();
    }
  }, 700);
}

window.addEventListener('load', () => {
  buildPiano();
  animate();
  startAmbient();
  document.body.addEventListener('click', () => piano.init(), { once: true });
  document.body.addEventListener('keydown', () => piano.init(), { once: true });
});

window.addEventListener('resize', () => {
  garland.build();
  if (mode === 'rhythm') setTimeout(() => rhythm.resize(), 80);
});
