// Tweaks panel. Loaded ONLY when the URL carries ?tweaks=1, so production ships nothing extra:
// no framework, no build step, no bytes on a normal visit. Values are session-only by design —
// reload without the flag and the site is exactly itself again.
//
// Everything here is a code-only change. Copy edits and one-off colours are faster to do in the
// file directly; these are the values that cascade or that you can only judge in motion.
(function () {
  var root = document.documentElement;
  var p = window.portfolio;

  var ACCENTS = [
    ['violet', '#a06bff'],
    ['blue',   '#5b8cff'],
    ['green',  '#4fbf82'],
    ['gold',   '#e0b84a']
  ];

  var panel = document.createElement('aside');
  panel.setAttribute('aria-label', 'Tweaks');
  panel.style.cssText = 'position:fixed;top:74px;right:16px;z-index:200;width:236px;' +
    'padding:16px;border:1px solid #262623;border-radius:12px;background:rgba(11,11,10,.94);' +
    'backdrop-filter:blur(14px);box-shadow:0 30px 64px -24px rgba(0,0,0,.95);' +
    "font-family:'JetBrains Mono',monospace;color:#e9e7df;display:flex;flex-direction:column;gap:16px";

  function label(text) {
    var el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = 'font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:#7d786f;margin-bottom:8px';
    return el;
  }

  function group(title) {
    var g = document.createElement('div');
    g.appendChild(label(title));
    return g;
  }

  // --- accent: rewrites both custom properties, so every band, ring and rule follows ---
  var accentGroup = group('accent');
  var swatches = document.createElement('div');
  swatches.style.cssText = 'display:flex;gap:8px';
  ACCENTS.forEach(function (a) {
    var b = document.createElement('button');
    b.type = 'button';
    b.title = a[0];
    b.setAttribute('aria-label', a[0]);
    b.style.cssText = 'width:34px;height:26px;border-radius:6px;cursor:pointer;background:' + a[1] +
      ';border:1px solid ' + (a[1] === '#a06bff' ? '#e9e7df' : 'transparent');
    b.onclick = function () {
      var hex = a[1];
      var r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), bl = parseInt(hex.slice(5, 7), 16);
      root.style.setProperty('--accent', hex);
      root.style.setProperty('--accent-rgb', r + ',' + g + ',' + bl);
      Array.prototype.forEach.call(swatches.children, function (c) { c.style.borderColor = 'transparent'; });
      b.style.borderColor = '#e9e7df';
    };
    swatches.appendChild(b);
  });
  accentGroup.appendChild(swatches);

  // --- ghost word: the hero mark, which is the thing most worth seeing options for ---
  var ghostGroup = group('hero ghost');
  var sel = document.createElement('select');
  sel.style.cssText = 'width:100%;padding:7px 9px;border:1px solid #34332f;border-radius:6px;' +
    "background:#131312;color:#e9e7df;font-family:'JetBrains Mono',monospace;font-size:11px;cursor:pointer";
  ['KD', 'KRISTIAN', 'DAVIS', 'none'].forEach(function (v) {
    var o = document.createElement('option');
    o.value = v; o.textContent = v;
    sel.appendChild(o);
  });
  sel.onchange = function () {
    var g = document.getElementById('heroGhost');
    if (!g) return;
    if (sel.value === 'none') { g.style.display = 'none'; return; }
    g.style.display = '';
    g.textContent = sel.value;
    // Long words need to come down in size or they run off the measure; short ones can go big.
    g.style.fontSize = sel.value.length > 3 ? 'clamp(72px,10vw,150px)' : 'clamp(120px,19vw,270px)';
  };
  ghostGroup.appendChild(sel);

  function slider(title, min, max, step, value, unit, onInput) {
    var g = group(title);
    var row = document.createElement('div');
    row.style.cssText = 'display:flex;align-items:center;gap:10px';
    var input = document.createElement('input');
    input.type = 'range';
    input.min = min; input.max = max; input.step = step; input.value = value;
    input.style.cssText = 'flex:1;min-width:0;accent-color:var(--accent);cursor:pointer';
    var out = document.createElement('span');
    out.style.cssText = 'flex-shrink:0;width:46px;text-align:right;font-size:10px;color:#a09c92';
    out.textContent = value + unit;
    input.oninput = function () {
      out.textContent = input.value + unit;
      onInput(parseFloat(input.value));
    };
    row.appendChild(input); row.appendChild(out);
    g.appendChild(row);
    return g;
  }

  var ghostStrength = slider('ghost strength', 0, 1, 0.01, 0.35, '', function (v) {
    var g = document.getElementById('heroGhost');
    if (g) { g.style.transition = 'none'; g.style.opacity = v; }
    var w = document.getElementById('workGhost');
    if (w) w.style.opacity = v;
  });

  var reflStrength = slider('reflection', 0, 0.6, 0.01, 0.22, '', function (v) {
    var rf = document.getElementById('reflection');
    if (rf) rf.style.opacity = v;
  });

  var dropSpeed = slider('raindrop fall', 0.4, 2.4, 0.1, (p && p.fall) || 1, 's', function (v) {
    if (p) p.fall = v;
  });

  var heroSpeed = slider('hero fall', 0.6, 3, 0.1, (p && p.heroFall) || 1.6, 's', function (v) {
    if (p) p.heroFall = v;
  });

  // --- replay: the only way to actually judge the timing changes above ---
  var replay = document.createElement('button');
  replay.type = 'button';
  replay.textContent = 'replay animations';
  replay.style.cssText = 'padding:10px;border:1px solid var(--accent);border-radius:7px;' +
    'background:rgba(var(--accent-rgb),.14);color:#e9e7df;cursor:pointer;' +
    "font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.04em";
  replay.onclick = function () { if (p && p.resetAll) p.resetAll(); };

  var note = document.createElement('div');
  note.textContent = 'session only · not saved';
  note.style.cssText = 'font-size:9px;letter-spacing:.06em;color:#5a5754;text-align:center';

  [accentGroup, ghostGroup, ghostStrength, reflStrength, dropSpeed, heroSpeed, replay, note]
    .forEach(function (el) { panel.appendChild(el); });
  document.body.appendChild(panel);
})();
