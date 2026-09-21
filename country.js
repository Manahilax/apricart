// Apricart — Pakistan site scripts
// Shared across all pages: nav dropdown behavior, stats counter, process card highlighter.

// ---------- NAV DROPDOWN (click-to-open, closes on outside click / Escape / link click) ----------
document.querySelectorAll('.nav-item').forEach(function (item) {
  var trigger = item.querySelector('.nav-trigger');
  if (!trigger) return;
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    var isOpen = item.classList.contains('open');
    document.querySelectorAll('.nav-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false'); });
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});
document.addEventListener('click', function () {
  document.querySelectorAll('.nav-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false'); });
});
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.nav-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false'); });
  }
});
document.querySelectorAll('.dropdown-panel a').forEach(function (link) {
  link.addEventListener('click', function () {
    document.querySelectorAll('.nav-item.open').forEach(function (o) { o.classList.remove('open'); o.querySelector('.nav-trigger').setAttribute('aria-expanded', 'false'); });
  });
});

// ---------- STATS COUNTER (animates numbers up when #stats-section scrolls into view) ----------
(function () {
  var section = document.getElementById('stats-section');
  if (!section) return;

  var counts = section.querySelectorAll('.count');
  var hasRun = false;

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-target'), 10) || 0;
    var duration = 1400; // ms
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out
      el.textContent = Math.floor(eased * target);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target;
      }
    }
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        counts.forEach(animateCount);
        observer.disconnect();
      }
    });
  }, { threshold: 0.4 });

  observer.observe(section);
})();

// ---------- PROCESS CARD HIGHLIGHTER (cycles the "active" card in #process-grid) ----------
(function () {
  var grid = document.getElementById('process-grid');
  if (!grid) return;

  var cards = grid.querySelectorAll('.process-card');
  var current = 0;
  var holdTime = 2200;

  function highlightNext() {
    cards.forEach(function (c) { c.classList.remove('active'); });
    cards[current].classList.add('active');
    current = (current + 1) % cards.length;
  }

  highlightNext(); // start immediately on load
  setInterval(highlightNext, holdTime);
})();