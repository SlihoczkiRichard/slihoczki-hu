// Small extras. Everything still works with JavaScript turned off.
(function () {
  var root = document.documentElement;
  var THEMES = ['dos', 'c64', 'paper'];
  var LABEL = { dos: 'DOS', c64: 'C64', paper: 'PAPER' };

  function setTheme(t) {
    root.dataset.theme = t;
    document.querySelectorAll('.theme-name').forEach(function (el) { el.textContent = LABEL[t]; });
    try { localStorage.setItem('theme', t); } catch (e) {}
  }
  function nextTheme() {
    var i = THEMES.indexOf(root.dataset.theme);
    setTheme(THEMES[(i + 1) % THEMES.length]);
  }
  document.querySelectorAll('.theme-btn').forEach(function (b) { b.addEventListener('click', nextTheme); });
  document.querySelectorAll('.theme-name').forEach(function (el) { el.textContent = LABEL[root.dataset.theme] || 'DOS'; });

  // Number keys 1-9 mirror the bottom bar (the game screen handles its own keys)
  var bar = Array.prototype.slice.call(document.querySelectorAll('.keybar a, .keybar button'));
  document.addEventListener('keydown', function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
    var tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'canvas' || e.target.isContentEditable) return;
    var n = parseInt(e.key, 10);
    if (n >= 1 && n <= bar.length) bar[n - 1].click();
  });

  // Highlight the section in view
  if ('IntersectionObserver' in window) {
    var links = Array.prototype.slice.call(document.querySelectorAll('.keybar a[href^="#"]'));
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('main section[id]').forEach(function (s) { io.observe(s); });
  }

  // A packet ■ travels along the wires in fig. 1
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    document.querySelectorAll('[data-wire]').forEach(function (wire) {
      var text = wire.textContent;
      var slots = [];
      for (var i = 0; i < text.length; i++) if (text[i] === '─') slots.push(i);
      var step = -parseInt(wire.dataset.delay || '0', 10);
      setInterval(function () {
        step = (step + 1) % (slots.length + 6);
        if (step < 0 || step >= slots.length) { wire.textContent = text; return; }
        var p = slots[step];
        wire.innerHTML = text.slice(0, p) + '<span class="pkt">■</span>' + text.slice(p + 1);
      }, 160);
    });
  }

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
