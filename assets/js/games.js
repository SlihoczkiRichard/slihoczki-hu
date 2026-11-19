// C:\GAMES — two tiny originals drawn on one canvas.
// SNAKE.EXE: eat packets, don't byte yourself.
// PACKETS.EXE: malware is inbound and you are the firewall.
(function () {
  var cv = document.getElementById('game');
  if (!cv) return;
  var ctx = cv.getContext('2d');
  var W = cv.width, H = cv.height;
  var held = {};
  var C = {};
  var current = null;
  var visible = false;
  var last = 0;
  var TOUCH = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  // ---------- helpers ----------
  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  function readColors() {
    var bg = cssVar('--win-bg');
    C.bg = (!bg || bg === 'transparent') ? cssVar('--bg') : bg;
    C.fg = cssVar('--fg'); C.hi = cssVar('--hi'); C.hi2 = cssVar('--hi2');
    C.bad = cssVar('--bad'); C.ok = cssVar('--ok'); C.muted = cssVar('--muted'); C.bright = cssVar('--bright');
  }
  function txt(s, x, y, c, size, align) {
    ctx.fillStyle = c;
    ctx.font = (size || 16) + 'px "3270", ui-monospace, monospace';
    ctx.textAlign = align || 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s, x, y);
  }
  function best(key, v) {
    try {
      if (v !== undefined) { localStorage.setItem('hs_' + key, String(v)); return v; }
      return parseInt(localStorage.getItem('hs_' + key), 10) || 0;
    } catch (e) { return 0; }
  }
  function sprite(rows, x, y, s, c) {
    ctx.fillStyle = c;
    for (var r = 0; r < rows.length; r++)
      for (var k = 0; k < rows[r].length; k++)
        if (rows[r][k] === 'X') ctx.fillRect(Math.round(x + k * s), Math.round(y + r * s), s, s);
  }
  function overlay(lines) {
    ctx.fillStyle = C.bg; ctx.globalAlpha = 0.82; ctx.fillRect(40, 90, W - 80, 150); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.hi; ctx.lineWidth = 2; ctx.strokeRect(44, 94, W - 88, 142);
    var y = 125;
    lines.forEach(function (l) { txt(l[0], W / 2, y, l[1], l[2] || 16); y += l[2] ? l[2] + 12 : 26; });
  }
  function hud(name, score, hi, extra) {
    txt(name, 8, 10, C.hi2, 14, 'left');
    txt('SCORE ' + score + '   HI ' + hi + (extra ? '   ' + extra : ''), W - 8, 10, C.fg, 14, 'right');
    ctx.fillStyle = C.muted; ctx.fillRect(0, 20, W, 1);
  }
  function isStart(k) { return k === ' ' || k === 'Enter'; }

  // ---------- SNAKE.EXE ----------
  var Snake = {
    id: 'snake', title: 'SNAKE.EXE', cell: 16,
    init: function () {
      this.cols = W / this.cell; this.rows = H / this.cell;
      this.body = [{ x: 6, y: 17 }, { x: 5, y: 17 }, { x: 4, y: 17 }];
      this.dir = { x: 1, y: 0 }; this.queue = [];
      this.acc = 0; this.step = 120; this.score = 0; this.state = 'ready';
      this.hi = best('snake'); this.food();
    },
    food: function () {
      var f, b = this.body;
      do { f = { x: Math.floor(Math.random() * this.cols), y: 2 + Math.floor(Math.random() * (this.rows - 2)) }; }
      while (b.some(function (p) { return p.x === f.x && p.y === f.y; }));
      this.f = f;
    },
    key: function (k) {
      if (isStart(k)) {
        if (this.state === 'ready' || this.state === 'paused') this.state = 'play';
        else if (this.state === 'over') { this.init(); this.state = 'play'; }
        return;
      }
      var d = { ArrowUp: [0, -1], w: [0, -1], ArrowDown: [0, 1], s: [0, 1], ArrowLeft: [-1, 0], a: [-1, 0], ArrowRight: [1, 0], d: [1, 0] }[k];
      if (!d) return;
      if (this.state === 'ready') this.state = 'play';
      var lastDir = this.queue.length ? this.queue[this.queue.length - 1] : this.dir;
      if (d[0] === -lastDir.x && d[1] === -lastDir.y) return;
      if (this.queue.length < 3) this.queue.push({ x: d[0], y: d[1] });
    },
    update: function (dt) {
      if (this.state !== 'play') return;
      this.acc += dt;
      while (this.acc >= this.step && this.state === 'play') { this.acc -= this.step; this.tick(); }
    },
    tick: function () {
      if (this.queue.length) this.dir = this.queue.shift();
      var h = { x: this.body[0].x + this.dir.x, y: this.body[0].y + this.dir.y };
      var hitWall = h.x < 0 || h.x >= this.cols || h.y < 2 || h.y >= this.rows;
      var hitSelf = this.body.some(function (p) { return p.x === h.x && p.y === h.y; });
      if (hitWall || hitSelf) {
        this.state = 'over';
        if (this.score > this.hi) this.hi = best('snake', this.score);
        return;
      }
      this.body.unshift(h);
      if (h.x === this.f.x && h.y === this.f.y) {
        this.score += 10; this.step = Math.max(55, this.step - 3); this.food();
      } else this.body.pop();
    },
    draw: function () {
      var s = this.cell, self = this;
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      hud(this.title, this.score, this.hi);
      // packet
      var fx = this.f.x * s, fy = this.f.y * s;
      ctx.fillStyle = C.hi2; ctx.fillRect(fx + 2, fy + 3, s - 4, s - 6);
      ctx.fillStyle = C.bg; ctx.fillRect(fx + 4, fy + 5, s - 8, 2);
      // snake
      this.body.forEach(function (p, i) {
        ctx.fillStyle = i === 0 ? C.bright : C.hi;
        ctx.fillRect(p.x * s + 1, p.y * s + 1, s - 2, s - 2);
      });
      if (this.state === 'ready') overlay([[self.title, C.hi2, 22], ["eat the packets. don't byte yourself.", C.fg], [TOUCH ? 'swipe to steer · tap to start' : 'arrows / WASD · SPACE or click to start', C.muted, 14]]);
      if (this.state === 'paused') overlay([['PAUSED', C.hi2, 22], [TOUCH ? 'tap to resume' : 'click or press SPACE to resume', C.fg]]);
      if (this.state === 'over') overlay([['CONNECTION RESET', C.bad, 22], ['score ' + this.score + ' · hi ' + this.hi, C.fg], [TOUCH ? 'tap to retry' : 'SPACE or click to retry', C.muted, 14]]);
    }
  };

  // ---------- PACKETS.EXE ----------
  var BUG = [
    ['..XXXXXXX..', '.X.......X.', 'X..X...X..X', 'X...XXX...X', 'X.........X', '.XXXXXXXXX.', '.X.X...X.X.', 'X.........X'],
    ['..XXXXXXX..', '.X.......X.', 'X..X...X..X', 'X...XXX...X', 'X.........X', '.XXXXXXXXX.', '..X.X.X.X..', '.X.......X.']
  ];
  var WALL = ['.....XXX.....', '....XXXXX....', '.XXXXXXXXXXX.', 'XX.XX.X.XX.XX', 'XXXXXXXXXXXXX'];
  var PX = 3;

  var Packets = {
    id: 'packets', title: 'PACKETS.EXE',
    init: function () {
      this.score = 0; this.lives = 3; this.level = 1; this.state = 'ready';
      this.hi = best('packets');
      this.px = W / 2 - (WALL[0].length * PX) / 2; this.py = H - 26;
      this.wave();
    },
    wave: function () {
      this.enemies = [];
      for (var r = 0; r < 4; r++)
        for (var c = 0; c < 7; c++)
          this.enemies.push({ x: 36 + c * 54, y: 40 + r * 34, alive: true });
      this.dx = 1; this.anim = 0; this.animT = 0;
      this.shots = []; this.bombs = []; this.cool = 0; this.bombT = 900; this.inv = 0;
    },
    key: function (k) {
      if (isStart(k)) {
        if (this.state === 'ready' || this.state === 'paused') { this.state = 'play'; return; }
        if (this.state === 'over') { this.init(); this.state = 'play'; return; }
      }
      if (this.state === 'ready' && (k === 'ArrowLeft' || k === 'ArrowRight')) this.state = 'play';
    },
    update: function (dt) {
      if (this.state !== 'play') return;
      var t = dt / 1000, self = this;
      var ew = BUG[0][0].length * PX, eh = BUG[0].length * PX, pw = WALL[0].length * PX;

      // player
      var left = held.ArrowLeft || held.a, right = held.ArrowRight || held.d;
      if (left) this.px -= 230 * t;
      if (right) this.px += 230 * t;
      this.px = Math.max(4, Math.min(W - pw - 4, this.px));
      this.cool -= dt;
      if ((held[' '] || held.fire) && this.cool <= 0 && this.shots.length < 2) {
        this.shots.push({ x: this.px + pw / 2 - 1, y: this.py - 6 }); this.cool = 320;
      }
      this.inv = Math.max(0, this.inv - dt);

      // fleet
      var alive = this.enemies.filter(function (e) { return e.alive; });
      if (!alive.length) { this.level++; this.score += 100; this.wave(); return; }
      var speed = 22 + (28 - alive.length) * 3.2 + this.level * 9;
      var edge = false;
      alive.forEach(function (e) {
        e.x += self.dx * speed * t;
        if (e.x < 6 || e.x + ew > W - 6) edge = true;
      });
      if (edge) {
        this.dx *= -1;
        alive.forEach(function (e) { e.x += self.dx * speed * t; e.y += 12; });
      }
      this.animT += dt; if (this.animT > 420) { this.animT = 0; this.anim ^= 1; }

      // enemy fire
      this.bombT -= dt;
      if (this.bombT <= 0) {
        var shooter = alive[Math.floor(Math.random() * alive.length)];
        this.bombs.push({ x: shooter.x + ew / 2, y: shooter.y + eh });
        this.bombT = Math.max(260, 900 - this.level * 90) * (0.6 + Math.random() * 0.8);
      }

      // bullets
      this.shots.forEach(function (s) { s.y -= 380 * t; });
      this.bombs.forEach(function (b) { b.y += (150 + self.level * 12) * t; });
      this.shots = this.shots.filter(function (s) {
        if (s.y < 22) return false;
        for (var i = 0; i < alive.length; i++) {
          var e = alive[i];
          if (s.x >= e.x && s.x <= e.x + ew && s.y >= e.y && s.y <= e.y + eh) {
            e.alive = false; self.score += 10; return false;
          }
        }
        return true;
      });
      this.bombs = this.bombs.filter(function (b) {
        if (b.y > H) return false;
        if (self.inv <= 0 && b.x >= self.px && b.x <= self.px + pw && b.y >= self.py && b.y <= self.py + 15) {
          self.lives--; self.inv = 1200;
          if (self.lives <= 0) self.end();
          return false;
        }
        return true;
      });
      if (alive.some(function (e) { return e.y + eh >= self.py - 4; })) this.end();
    },
    end: function () {
      this.state = 'over';
      if (this.score > this.hi) this.hi = best('packets', this.score);
    },
    draw: function () {
      var self = this;
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      hud(this.title, this.score, this.hi, 'LVL ' + this.level + '   FW ' + Array(this.lives + 1).join('█'));
      this.enemies.forEach(function (e) { if (e.alive) sprite(BUG[self.anim], e.x, e.y, PX, C.bad); });
      if (!(this.inv > 0 && Math.floor(this.inv / 100) % 2)) sprite(WALL, this.px, this.py, PX, C.hi);
      ctx.fillStyle = C.bright; this.shots.forEach(function (s) { ctx.fillRect(s.x, s.y, 2, 8); });
      ctx.fillStyle = C.hi2; this.bombs.forEach(function (b) { ctx.fillRect(b.x - 1, b.y, 3, 7); });
      ctx.fillStyle = C.muted; ctx.fillRect(0, H - 6, W, 1);
      if (this.state === 'ready') overlay([[this.title, C.hi2, 22], ['malware is inbound. you are the firewall.', C.fg], [TOUCH ? 'drag to move · hold to fire · tap to start' : '◀ ▶ move · SPACE fire · SPACE to start', C.muted, 14]]);
      if (this.state === 'paused') overlay([['PAUSED', C.hi2, 22], [TOUCH ? 'tap to resume' : 'click or press SPACE to resume', C.fg]]);
      if (this.state === 'over') overlay([['PERIMETER BREACHED', C.bad, 22], ['score ' + this.score + ' · hi ' + this.hi, C.fg], [TOUCH ? 'tap to retry' : 'SPACE or click to retry', C.muted, 14]]);
    }
  };


  // ---------- BUFFER.EXE (falling blocks) ----------
  var SHAPES = [
    [[1,1,1,1]],
    [[1,1],[1,1]],
    [[0,1,0],[1,1,1]],
    [[1,0,0],[1,1,1]],
    [[0,0,1],[1,1,1]],
    [[0,1,1],[1,1,0]],
    [[1,1,0],[0,1,1]]
  ];
  function rot(m) {
    var r = [];
    for (var x = 0; x < m[0].length; x++) { r.push([]); for (var y = m.length - 1; y >= 0; y--) r[x].push(m[y][x]); }
    return r;
  }
  var Buffer = {
    id: 'buffer', title: 'BUFFER.EXE', cols: 10, rows: 20, cell: 14,
    init: function () {
      this.grid = [];
      for (var r = 0; r < this.rows; r++) { this.grid.push(new Array(this.cols).fill(0)); }
      this.ox = Math.round((W - this.cols * this.cell) / 2); this.oy = 28;
      this.score = 0; this.lines = 0; this.level = 1; this.state = 'ready';
      this.hi = best('buffer'); this.bag = []; this.next = this.draw7(); this.spawn();
      this.fall = 0; this.rep = {}; this.soft = false;
    },
    draw7: function () {
      if (!this.bag.length) { this.bag = [0, 1, 2, 3, 4, 5, 6]; for (var i = 6; i > 0; i--) { var k = Math.floor(Math.random() * (i + 1)); var t = this.bag[i]; this.bag[i] = this.bag[k]; this.bag[k] = t; } }
      return SHAPES[this.bag.pop()];
    },
    spawn: function () {
      this.m = this.next; this.next = this.draw7();
      this.x = Math.floor((this.cols - this.m[0].length) / 2); this.y = 0;
      if (this.hit(this.m, this.x, this.y)) this.end();
    },
    hit: function (m, px, py) {
      for (var y = 0; y < m.length; y++) for (var x = 0; x < m[y].length; x++) {
        if (!m[y][x]) continue;
        var gx = px + x, gy = py + y;
        if (gx < 0 || gx >= this.cols || gy >= this.rows) return true;
        if (gy >= 0 && this.grid[gy][gx]) return true;
      }
      return false;
    },
    move: function (dx) { if (!this.hit(this.m, this.x + dx, this.y)) this.x += dx; },
    turn: function () {
      var r = rot(this.m), kicks = [0, -1, 1, -2, 2];
      for (var i = 0; i < kicks.length; i++) if (!this.hit(r, this.x + kicks[i], this.y)) { this.m = r; this.x += kicks[i]; return; }
    },
    drop: function () {
      if (!this.hit(this.m, this.x, this.y + 1)) { this.y++; return true; }
      this.lock(); return false;
    },
    lock: function () {
      var self = this;
      this.m.forEach(function (row, y) { row.forEach(function (v, x) { if (v && self.y + y >= 0) self.grid[self.y + y][self.x + x] = 1; }); });
      var full = 0;
      for (var r = this.rows - 1; r >= 0; r--) {
        if (this.grid[r].every(function (v) { return v; })) { this.grid.splice(r, 1); this.grid.unshift(new Array(this.cols).fill(0)); full++; r++; }
      }
      if (full) {
        this.score += [0, 100, 300, 500, 800][full] * this.level;
        this.lines += full; this.level = 1 + Math.floor(this.lines / 10);
      }
      this.spawn();
    },
    end: function () { this.state = 'over'; if (this.score > this.hi) this.hi = best('buffer', this.score); },
    key: function (k) {
      if (this.state !== 'play') {
        if (isStart(k) || k === 'ArrowLeft' || k === 'ArrowRight' || k === 'ArrowUp') {
          if (this.state === 'over') this.init();
          this.state = 'play';
        }
        return;
      }
      if (k === 'ArrowLeft' || k === 'a') { this.move(-1); this.rep[k] = 170; }
      else if (k === 'ArrowRight' || k === 'd') { this.move(1); this.rep[k] = 170; }
      else if (k === 'ArrowUp' || k === 'w' || k === 'x') this.turn();
      else if (k === 'ArrowDown' || k === 's') { if (this.drop()) this.score += 1; this.rep[k] = 120; }
      else if (k === ' ' || k === 'fire') { while (this.drop()) this.score += 2; }
    },
    update: function (dt) {
      if (this.state !== 'play') return;
      var self = this;
      // auto-repeat for held keys
      ['ArrowLeft', 'a', 'ArrowRight', 'd', 'ArrowDown', 's'].forEach(function (k) {
        if (!held[k]) { delete self.rep[k]; return; }
        if (self.rep[k] === undefined) return;
        self.rep[k] -= dt;
        if (self.rep[k] <= 0) {
          self.rep[k] = 45;
          if (k === 'ArrowLeft' || k === 'a') self.move(-1);
          else if (k === 'ArrowRight' || k === 'd') self.move(1);
          else if (self.drop()) self.score += 1;
        }
      });
      this.fall += dt;
      var speed = this.soft ? 40 : Math.max(90, 700 - (this.level - 1) * 60);
      if (this.fall >= speed) { this.fall = 0; this.drop(); }
    },
    cellAt: function (gx, gy, c, ghost) {
      var s = this.cell, x = this.ox + gx * s, y = this.oy + gy * s;
      if (ghost) { ctx.strokeStyle = c; ctx.lineWidth = 1; ctx.strokeRect(x + 1.5, y + 1.5, s - 3, s - 3); return; }
      ctx.fillStyle = c; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
      ctx.fillStyle = C.bg; ctx.fillRect(x + 4, y + 4, s - 8, s - 8);
      ctx.fillStyle = c; ctx.fillRect(x + 5, y + 5, s - 10, s - 10);
    },
    draw: function () {
      var self = this, s = this.cell;
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, W, H);
      hud(this.title, this.score, this.hi, 'LVL ' + this.level);
      // well
      ctx.strokeStyle = C.muted; ctx.lineWidth = 2;
      ctx.strokeRect(this.ox - 2, this.oy - 2, this.cols * s + 4, this.rows * s + 4);
      ctx.fillStyle = C.muted;
      for (var gy = 0; gy < this.rows; gy++) for (var gx = 0; gx < this.cols; gx++)
        if (!this.grid[gy][gx]) ctx.fillRect(this.ox + gx * s + s / 2, this.oy + gy * s + s / 2, 1, 1);
      this.grid.forEach(function (row, y) { row.forEach(function (v, x) { if (v) self.cellAt(x, y, C.hi); }); });
      if (this.state !== 'over') {
        var gy2 = this.y; while (!this.hit(this.m, this.x, gy2 + 1)) gy2++;
        this.m.forEach(function (row, y) { row.forEach(function (v, x) { if (v) self.cellAt(self.x + x, gy2 + y, C.muted, true); }); });
        this.m.forEach(function (row, y) { row.forEach(function (v, x) { if (v && self.y + y >= 0) self.cellAt(self.x + x, self.y + y, C.hi2); }); });
      }
      // side panel
      var px = this.ox + this.cols * s + 30;
      txt('NEXT', px, 44, C.muted, 14, 'left');
      this.next.forEach(function (row, y) { row.forEach(function (v, x) {
        if (!v) return;
        ctx.fillStyle = C.fg; ctx.fillRect(px + x * 12, 62 + y * 12, 10, 10);
      }); });
      txt('LINES  ' + this.lines, px, 120, C.fg, 14, 'left');
      txt('FLUSHED', px, 138, C.muted, 12, 'left');
      var lx = this.ox - 30;
      var hints = TOUCH ? ['drag  move', 'tap  rotate', 'hold  soft', 'flick ↓  drop'] : ['← → move', '↑ rotate', '↓ soft', 'SPACE drop'];
      hints.forEach(function (h, i) { txt(h, lx, 44 + i * 18, C.muted, 12, 'right'); });
      if (this.state === 'ready') overlay([[this.title, C.hi2, 22], ['packets are stacking up. flush full rows.', C.fg], [TOUCH ? 'drag · tap rotate · flick down drop · tap to start' : 'SPACE or click to start', C.muted, 14]]);
      if (this.state === 'paused') overlay([['PAUSED', C.hi2, 22], [TOUCH ? 'tap to resume' : 'click or press SPACE to resume', C.fg]]);
      if (this.state === 'over') overlay([['BUFFER OVERFLOW', C.bad, 22], ['score ' + this.score + ' · lines ' + this.lines, C.fg], [TOUCH ? 'tap to retry' : 'SPACE or click to retry', C.muted, 14]]);
    }
  };

  // ---------- shell ----------
  var gesture = null;
  function endGesture() {
    if (!gesture) return;
    clearTimeout(gesture.timer);
    held.fire = false;
    Buffer.soft = false;
    gesture = null;
  }
  var GAMES = { snake: Snake, packets: Packets, buffer: Buffer };
  var tabs = document.querySelectorAll('[data-game]');
  function load(id) {
    endGesture();
    current = GAMES[id]; current.init();
    tabs.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.game === id ? 'true' : 'false'); });
    document.querySelectorAll('[data-for]').forEach(function (el) { el.hidden = el.dataset.for !== id; });
    readColors(); current.draw();
  }
  tabs.forEach(function (b) {
    b.addEventListener('click', function () { load(b.dataset.game); cv.focus({ preventScroll: true }); });
  });

  var GAME_KEYS = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' ', 'Enter', 'w', 'a', 's', 'd', 'x'];
  cv.addEventListener('keydown', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    if (GAME_KEYS.indexOf(k) === -1) return;
    e.preventDefault();
    if (!held[k]) current.key(k);
    held[k] = true;
  });
  cv.addEventListener('keyup', function (e) {
    var k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    held[k] = false;
  });
  cv.addEventListener('blur', function () {
    held = {};
    endGesture();
    if (current.state === 'play') current.state = 'paused';
  });

  // ---------- touch gestures (no on-screen buttons) ----------
  // SNAKE   swipe to steer
  // PACKETS drag anywhere to move, keep the finger down to fire
  // BUFFER  drag sideways to move, tap to rotate, hold for soft drop, flick down to drop
  var SWIPE = 22;     // px of finger travel that counts as a swipe
  var HOLD = 260;     // ms before a still finger counts as "hold"
  function toCanvas(px) { return px * W / cv.getBoundingClientRect().width; }
  cv.addEventListener('pointerdown', function (e) {
    cv.focus({ preventScroll: true });
    if (e.pointerType === 'mouse') { if (current.state !== 'play') current.key(' '); return; }
    e.preventDefault();
    endGesture();
    if (current.state !== 'play') { current.key(' '); return; }
    try { cv.setPointerCapture(e.pointerId); } catch (err) {}
    gesture = { id: e.pointerId, x: e.clientX, y: e.clientY, x0: e.clientX, t0: Date.now(), moved: false, hold: false, px: Packets.px };
    if (current === Packets) held.fire = true;
    if (current === Buffer) gesture.timer = setTimeout(function () {
      if (gesture && !gesture.moved) { gesture.hold = true; Buffer.soft = true; }
    }, HOLD);
  });
  cv.addEventListener('pointermove', function (e) {
    var g = gesture;
    if (!g || e.pointerId !== g.id || current.state !== 'play') return;
    var dx = e.clientX - g.x, dy = e.clientY - g.y;
    if (current === Packets) {
      var pw = WALL[0].length * PX;
      Packets.px = Math.max(4, Math.min(W - pw - 4, g.px + toCanvas(e.clientX - g.x0) * 1.4));
      return;
    }
    if (current === Snake) {
      if (Math.abs(dx) < SWIPE && Math.abs(dy) < SWIPE) return;
      current.key(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp'));
      g.x = e.clientX; g.y = e.clientY; g.moved = true; // one long drag can turn several times
      return;
    }
    // BUFFER
    if (g.hold) return;
    if (dy > 40 && dy > Math.abs(dx) * 1.5 && Date.now() - g.t0 < 350) { current.key(' '); endGesture(); return; }
    var step = Math.max(16, cv.getBoundingClientRect().width * Buffer.cell / W);
    while (Math.abs(e.clientX - g.x) >= step) {
      var dir = e.clientX > g.x ? 1 : -1;
      Buffer.move(dir); g.x += dir * step; g.moved = true;
    }
    if (Math.abs(dy) > SWIPE) g.moved = true;
  });
  function pointerEnd(e) {
    var g = gesture;
    if (!g || e.pointerId !== g.id) return;
    if (e.type === 'pointerup' && current === Buffer && current.state === 'play' && !g.moved && !g.hold) Buffer.turn();
    endGesture();
  }
  cv.addEventListener('pointerup', pointerEnd);
  cv.addEventListener('pointercancel', pointerEnd);
  cv.addEventListener('contextmenu', function (e) { if (TOUCH) e.preventDefault(); });

  // only animate while on screen
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (!visible && current && current.state === 'play') current.state = 'paused';
    }).observe(cv);
  } else visible = true;

  var colorT = 0;
  function frame(t) {
    var dt = Math.min(50, t - (last || t)); last = t;
    if (visible && current) {
      colorT -= dt; if (colorT <= 0) { readColors(); colorT = 500; }
      current.update(dt); current.draw();
    }
    requestAnimationFrame(frame);
  }
  load('snake');
  requestAnimationFrame(frame);
})();
