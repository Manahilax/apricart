(function () {
  var KEY = 'apricart-market';
 
  var markets = {
    pk:  { name: 'Pakistan', full: 'Pakistan',     home: 'Pakistan.html', about: 'pakaboutus.html', business: 'supplies.html',     businessLabel: 'Supplies' },
    ksa: { name: 'Saudi Arabia',      full: 'Saudi Arabia', home: 'KSA.html',      about: 'ksaaboutus.html', business: 'supplies_ksa.html', businessLabel: 'Products' }
  };
 
  // Pages that belong to one market (file name, lowercase, without .html)
  var pageMarket = {
    pakistan: 'pk', supplies: 'pk', osupplies: 'pk', pakaboutus: 'pk',
    ksa: 'ksa', supplies_ksa: 'ksa', ksa_products: 'ksa', ksaaboutus: 'ksa'
  };
 
  // Links that should follow the selected market
  var groups = {
    about:    ['aboutus', 'pakaboutus', 'ksaaboutus'],
    business: ['supplies', 'osupplies', 'supplies_ksa', 'ksa_products', 'our_business']
  };
 
  /* ---------- helpers ---------- */
  function base(href) {
    return (href || '').split('#')[0].split('?')[0].split('/').pop().replace(/\.html?$/i, '').toLowerCase();
  }
  function suffix(href) {
    var i = (href || '').search(/[?#]/);
    return i === -1 ? '' : href.slice(i);
  }
 
  // Save in several places so it works on a web server, on file://, and in private windows
  function save(m) {
    if (!markets[m]) return;
    try { localStorage.setItem(KEY, m); } catch (e) {}
    try { sessionStorage.setItem(KEY, m); } catch (e) {}
    try { document.cookie = KEY + '=' + m + ';path=/;max-age=31536000;SameSite=Lax'; } catch (e) {}
    try { window.name = KEY + '=' + m; } catch (e) {}
  }
  function load() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    if (markets[v]) return v;
    try { v = sessionStorage.getItem(KEY); } catch (e) {}
    if (markets[v]) return v;
    try {
      var c = document.cookie.match(new RegExp('(?:^|; )' + KEY + '=(\\w+)'));
      if (c && markets[c[1]]) return c[1];
    } catch (e) {}
    var w = (window.name || '').match(/apricart-market=(\w+)/);
    if (w && markets[w[1]]) return w[1];
    return null;
  }
 
  /* ---------- work out the market ---------- */
  var param = null;
  try { param = new URLSearchParams(location.search).get('market'); } catch (e) {}
  var fromPage = pageMarket[base(location.pathname)];
  if (markets[param]) save(param);          // ?market=pk or ?market=ksa forces it
  else if (fromPage) save(fromPage);        // visiting a market page sets it
 
  // Clicking any link to a market page (e.g. the cards on the landing page) sets it
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a) return;
    var m = a.getAttribute('data-market') || pageMarket[base(a.getAttribute('href'))];
    if (m) save(m);
  }, true);
 
  var current = load();
  var m = markets[current];
 
  /* ---------- point shared links at the right market ---------- */
  if (m) {
    document.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var b = base(href);
      if (groups.about.indexOf(b) !== -1) {
        a.setAttribute('href', m.about + suffix(href));
      } else if (groups.business.indexOf(b) !== -1) {
        a.setAttribute('href', m.business + suffix(href));
        if (a.closest('.dropdown-panel')) a.textContent = m.businessLabel;
      } else if (b === 'index' && a.textContent.trim().toLowerCase() === 'home') {
        a.setAttribute('href', m.home);     // the logo still goes to the market picker
      }
    });
  }
 
  /* ---------- nav bar badge + switch menu ---------- */
  var header = document.querySelector('header.site-header');
  if (!header) return;                      // landing page has no nav bar
 
  function star(cx, cy, R, r) {
    var pts = [];
    for (var i = 0; i < 10; i++) {
      var ang = -Math.PI / 2 + i * Math.PI / 5, d = i % 2 ? r : R;
      pts.push((cx + d * Math.cos(ang)).toFixed(2) + ',' + (cy + d * Math.sin(ang)).toFixed(2));
    }
    return pts.join(' ');
  }
 
  var flags = {
    pk: '<svg class="market-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#01411C"/><rect width="7.5" height="20" fill="#FFFFFF"/><circle cx="18.2" cy="10.4" r="5.2" fill="#FFFFFF"/><circle cx="19.9" cy="9.1" r="4.5" fill="#01411C"/><polygon points="' + star(22.2, 7.4, 1.8, 0.75) + '" fill="#FFFFFF"/></svg>',
    ksa: '<svg class="market-flag" viewBox="0 0 30 20" aria-hidden="true"><rect width="30" height="20" fill="#006C35"/><rect x="7" y="6" width="16" height="1.6" rx=".8" fill="#FFFFFF"/><rect x="9" y="9.2" width="12" height="1.2" rx=".6" fill="#FFFFFF"/><rect x="8" y="13.4" width="14" height="1" rx=".5" fill="#FFFFFF"/><rect x="20.5" y="12.6" width="1" height="2.6" fill="#FFFFFF"/></svg>'
  };
  var css = document.createElement('style');
  css.textContent =
    '.market-actions { margin-left: auto; display: flex; align-items: center; gap: 10px; flex-shrink: 0; }' +
    '.market-actions .menu-toggle { margin-left: 0 !important; }' +
    '.market-badge { display: flex; align-items: center; gap: 10px; height: 42px; padding: 0 16px 0 10px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.28); background: rgba(255,255,255,0.08); color: #FFFFFF; font: 600 14px Montserrat, system-ui, sans-serif; white-space: nowrap; cursor: default; user-select: none; flex-shrink: 0; }' +
    '.market-flag { width: 26px; height: 18px; border-radius: 4px; display: block; flex-shrink: 0; box-shadow: 0 0 0 1px rgba(255,255,255,0.25); }' +
    'header.site-header > a:first-child, header.site-header .logo-img { flex-shrink: 0; }' +
    '.market-nav-label { display: none; }' +
    /* flag only when the name does not fit (decided by fitBadge below, not by screen width) */
    '.market-compact .market-badge { width: 44px; height: 44px; padding: 0; gap: 0; justify-content: center; }' +
    '.market-compact .market-badge .market-name { display: none; }' +
    /* when the name is hidden on a small screen, show it at the top of the opened menu instead */
    '@media (max-width: 980px) { .market-compact nav.main-nav .market-nav-label { display: flex; align-items: center; gap: 10px; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #FFFFFF; font: 600 15px Montserrat, system-ui, sans-serif; }' +
    ' .market-compact nav.main-nav .market-nav-label small { font-weight: 500; color: rgba(255,255,255,0.6); margin-right: 2px; } }';
  document.head.appendChild(css);
 
  // Only show a badge once a market has been chosen; it is a label, not a switcher
  if (!m) return;
  var badge = document.createElement('span');
  badge.className = 'market-badge';
  badge.setAttribute('aria-label', 'Market: ' + m.full);
  badge.setAttribute('title', m.full);
  badge.innerHTML = flags[current] + '<span class="market-name">' + m.name + '</span>';
 
  // flag + menu button sit together on the right (the menu button keeps its click handler when moved)
  var actions = document.createElement('div');
  actions.className = 'market-actions';
  var toggle = header.querySelector('.menu-toggle');
  if (toggle) header.insertBefore(actions, toggle); else header.appendChild(actions);
  actions.appendChild(badge);
  if (toggle) actions.appendChild(toggle);

  // on phones, also show the country name at the top of the opened menu
  var nav = header.querySelector('nav.main-nav');
  if (nav) {
    var label = document.createElement('div');
    label.className = 'market-nav-label';
    label.innerHTML = flags[current] + '<span><small>Market:</small> ' + m.full + '</span>';
    nav.insertBefore(label, nav.firstChild);
  }

  // Show the country name whenever it fits; fall back to flag only when the header is too tight
  function fitBadge() {
    header.classList.remove('market-compact');
    var hr = header.getBoundingClientRect(), ar = actions.getBoundingClientRect();
    var logoLink = header.querySelector('a');
    var lr = logoLink ? logoLink.getBoundingClientRect() : { right: hr.left };
    var tooTight = header.scrollWidth > header.clientWidth + 1 || ar.right > hr.right + 1 || ar.left < lr.right + 8;
    if (tooTight) header.classList.add('market-compact');
  }
  fitBadge();
  window.addEventListener('resize', fitBadge);
  window.addEventListener('load', fitBadge);
  var logoImg = header.querySelector('img');
  if (logoImg && !logoImg.complete) logoImg.addEventListener('load', fitBadge);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBadge);
})();