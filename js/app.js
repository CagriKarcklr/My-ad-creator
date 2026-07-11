/**
 * Shotsmith app — single focused App Store screenshot creator.
 * State is a list of "screens" (variant tabs); each screen is a full render state.
 */
(() => {
  'use strict';

  const FONTS = [
    'Poppins', 'Inter', 'DM Sans', 'Montserrat', 'Space Grotesk', 'Plus Jakarta Sans',
    'Outfit', 'Sora', 'Nunito', 'Manrope', 'Lexend', 'Figtree', 'Onest',
    'Bricolage Grotesque', 'Rubik', 'Work Sans', 'Urbanist', 'Red Hat Display', 'Fredoka',
  ];
  const PILL_STYLE_CYCLE = ['solid', 'solid', 'glass', 'tint'];
  const TILT_SEQ = [-3, 3, -2, 4, -4, 2, -3, 2];
  const DEVICE_RES = { iphone: [1284, 2778], android: [1080, 2340] };

  // Whole-SET layouts — each preset composes all screens together. build(i,n)
  // returns the phone positions for screen i. A spanning phone (x≈100, no phone
  // on the next screen) flows continuously across the seam (the renderer draws
  // the neighbour's bleeding phone as a continuation). x/y are % of canvas.
  const MOCKUP_PRESETS = [
    {
      id: 'set-flow', name: 'Continuous flow', desc: 'Centred openers, then phones span pairs of screens for a connected, panoramic feel.',
      build: (i) => {
        const seq = [
          [{ scale: 60, x: 50, y: 61 }],               // 0 centred hero
          [{ scale: 55, x: 50, y: 62 }],               // 1 centred
          [{ scale: 78, x: 100, y: 59 }],              // 2 spans → 3
          [],                                          // 3 continuation of 2
          [{ scale: 55, x: 50, y: 62 }],               // 4 centred
          [{ scale: 78, x: 100, y: 59 }],              // 5 spans → 6
          [],                                          // 6 continuation of 5
          [{ scale: 55, x: 50, y: 62 }],               // 7 centred
          [{ scale: 78, x: 100, y: 59 }],              // 8 spans → 9
          [],                                          // 9 continuation of 8
        ];
        return seq[i % seq.length];
      },
    },
    {
      id: 'set-mixed', name: 'Designed mix', desc: 'A curated rhythm: bold hero, a spanning pair, clean centres, bottom bleeds and a tilt.',
      build: (i) => {
        const seq = [
          [{ scale: 64, x: 50, y: 60 }],               // hero
          [{ scale: 78, x: 100, y: 58 }],              // span →
          [],                                          // continuation
          [{ scale: 55, x: 50, y: 62 }],               // centre
          [{ scale: 82, x: 50, y: 86 }],               // bleed bottom
          [{ scale: 58, x: 50, y: 62, rotation: -6 }], // tilt
          [{ scale: 78, x: 100, y: 58 }],              // span →
          [],                                          // continuation
          [{ scale: 55, x: 50, y: 62 }],               // centre
          [{ scale: 88, x: 50, y: 87 }],               // bleed bottom big
        ];
        return seq[i % seq.length];
      },
    },
    {
      id: 'set-panorama', name: 'Full panorama', desc: 'Every pair of screens shares one big phone — a bold, fully continuous set.',
      build: (i) => (i % 2 === 0 ? [{ scale: 80, x: 100, y: 60 }] : []),
    },
    {
      id: 'set-bold', name: 'Bold bleeds', desc: 'Every screen bleeds dramatically, alternating edges and angles. Maximum energy.',
      build: (i) => {
        const seq = [
          [{ scale: 82, x: 50, y: 86 }],               // bottom
          [{ scale: 80, x: 84, y: 60, rotation: -8 }], // right angled
          [{ scale: 86, x: 70, y: 80, rotation: -12 }],// diagonal corner
          [{ scale: 80, x: 16, y: 60, rotation: 8 }],  // left angled
          [{ scale: 100, x: 50, y: 80 }],              // giant centre
        ];
        return seq[i % seq.length];
      },
    },
    {
      id: 'set-zigzag', name: 'Zig-zag', desc: 'Phones bleed off alternating left and right edges down the whole set.',
      build: (i) => (i % 2 === 0 ? [{ scale: 74, x: 86, y: 60, rotation: -5 }] : [{ scale: 74, x: 14, y: 60, rotation: 5 }]),
    },
    {
      id: 'set-calm', name: 'Calm & clean', desc: 'All phones fully visible with gentle tilts — a tidy, premium, no-bleed set.',
      build: (i) => {
        const seq = [
          [{ scale: 56, x: 50, y: 62 }],
          [{ scale: 56, x: 50, y: 62, rotation: -5 }],
          [{ scale: 56, x: 50, y: 62 }],
          [{ scale: 56, x: 50, y: 62, rotation: 5 }],
        ];
        return seq[i % seq.length];
      },
    },
    {
      id: 'set-hero-rest', name: 'Hero, then flow', desc: 'A big centred first screen to hook, then a continuous spanning flow for the rest.',
      build: (i) => {
        if (i === 0) return [{ scale: 66, x: 50, y: 60 }];
        return ((i - 1) % 2 === 0) ? [{ scale: 78, x: 100, y: 59 }] : [];
      },
    },
    {
      id: 'set-twin', name: 'Twin mockups', desc: 'Two angled phones on every screen — great for showing two views at once.',
      build: () => [{ scale: 48, x: 34, y: 64, rotation: -5 }, { scale: 48, x: 66, y: 60, rotation: 5 }],
    },
  ];

  let brand = null;
  let screens = [];
  let activeIndex = 0;
  let device = 'iphone';
  let selectedPillId = null;
  let userZoom = 1;
  let uid = 1;
  let pillLibrary = []; // persisted, per-brand reusable pills
  let textSetLibrary = []; // persisted, per-brand reusable text sets (eyebrow/headline/subtitle)
  const nextId = () => `p${uid++}`;

  const $ = (id) => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');
  let showNeighbors = false;   // "show all screens side-by-side while editing"
  let stripCanvases = [];      // context canvas per screen index (active slot = #canvas)
  let panorama = { enabled: false, glow: true, hue: 0, sat: 100, light: 0, colors: ['#EDE6FB', '#F3E0F0', '#FBE6DD', '#FBE3EC', '#E9E2FB'] };
  let savedPanoramas = [];

  const screen = () => screens[activeIndex];
  const activePhone = () => { const s = screen(); return s.phones[s.activePhone] || s.phones[0]; };
  function defaultPhone(overrides = {}) {
    return Object.assign({ id: `ph${uid++}`, show: true, scale: 55, x: 50, y: 62, rotation: 0, z: 0, shadow: true, shadowIntensity: 40, shadowBlur: 60, screenBrightness: 0, screenshot: null }, overrides);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Brand picker
  // ──────────────────────────────────────────────────────────────────────────
  function initBrandPicker() {
    const grid = $('brand-grid');
    const all = Object.values(window.BRANDS || {});
    grid.innerHTML = '';
    for (const b of all) {
      const card = document.createElement('div');
      card.className = 'brand-card';
      card.innerHTML = `
        <div class="bc-mark" style="background:linear-gradient(135deg,${b.logoGradient[0]},${b.logoGradient[1]})">${b.logoChar || b.name[0]}</div>
        <div class="bc-name">${b.name}</div>
        <div class="bc-tag">${b.tagline}</div>`;
      card.addEventListener('click', () => chooseBrand(b));
      grid.appendChild(card);
    }
    const soon = document.createElement('div');
    soon.className = 'brand-card soon';
    soon.innerHTML = `<div class="bc-mark" style="background:#2a2a36">+</div><div class="bc-name">Add a brand</div><div class="bc-tag">Drop a blueprint to add your own.</div>`;
    grid.appendChild(soon);
  }

  async function chooseBrand(b) {
    brand = b;
    $('brand-overlay').classList.add('hidden');
    $('app').classList.remove('hidden');
    $('active-brand-name').textContent = b.name;
    $('active-brand-dot').style.background = `linear-gradient(135deg,${b.logoGradient[0]},${b.logoGradient[1]})`;
    document.querySelector('.brand-chip').title = b.tagline;

    screens = b.screens.map((def) => buildScreen(def));
    activeIndex = 0;

    initFontSelects();
    initPaletteGrid();
    initGradientPresets();
    buildPanelStaticBindings();
    Renderer.setAssetLoadCallback(() => requestRender());
    Kimi.setBrand(b); // loads blueprint in the background
    pillLibrary = loadLibrary();
    textSetLibrary = loadTextSets();
    savedPanoramas = loadSavedPanoramas();
    seedLibraries();
    const builtins = builtinPanoramas();
    if (builtins[0]) panorama.colors = builtins[0].colors.slice();

    await document.fonts.ready.catch(() => {});
    setDevice(device, true);
    renderScreenTabs();
    syncAllPanels();
    renderLibrary();
    renderTextSetSelect();
    renderPanoPresets();
    renderPanoStops();
    updatePanoPreview();
    fitCanvas();
    requestRender();
    resetHistory();
    maybeOfferAutosave();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Screen construction
  // ──────────────────────────────────────────────────────────────────────────
  function themeFor(mode, accent, accent2) {
    const t = brand.theme;
    return {
      mode: mode || 'light',
      accent: accent || t.accent,
      accent2: accent2 || t.accent2,
      headlineBase: t.headlineBase,
      headlineBaseDark: t.headlineBaseDark,
      headlineAccent: accent || t.accent,
      subtitle: t.subtitle,
      subtitleDark: t.subtitleDark,
      eyebrow: t.eyebrow,
      eyebrowDark: '#C4B5FD',
    };
  }

  function buildScreen(def) {
    const mode = def.theme || 'light';
    const s = {
      id: `s${uid++}`,
      name: def.name || 'Screen',
      screenNote: def.screenNote || '',
      theme: themeFor(mode),
      fonts: { ...brand.fonts },
      background: { ...JSON.parse(JSON.stringify(def.bg || brand.gradients.lavender)), glow: true },
      header: {
        show: true,
        x: 0.5, y: 0.05, bleed: false,
        eyebrow: { text: def.eyebrow || '', show: !!def.eyebrow, size: 30 },
        headline: {
          show: true, size: 116, weight: 800, tracking: -1, lineHeight: 1.04,
          lines: (def.headline || []).map((l) => ({ text: l.text, accent: !!l.accent })),
        },
        accentBar: { show: true, mode: 'bar', word: '', width: 64, height: 7 },
        subtitle: { text: def.subtitle || '', show: !!def.subtitle, size: 46, maxWidth: 0.78, weight: 500 },
      },
      phones: [defaultPhone()],
      activePhone: 0,
      pills: [],
    };
    const feats = (def.pills || []).map((p, i) => makePill(p, i));
    if (def.rating) feats.push({ id: nextId(), kind: 'rating', stars: def.rating.stars || 5, label: def.rating.label || '', style: 'solid', x: 0.5, y: 0.30, rotation: 0, scale: 1, bleed: false });
    s.pills = feats;
    arrangePills(s);
    return s;
  }

  function makePill(p, i) {
    return {
      id: nextId(), kind: 'feature',
      emoji: p.emoji || '✨', title: p.title || '', subtitle: p.subtitle || '',
      style: p.style || PILL_STYLE_CYCLE[i % PILL_STYLE_CYCLE.length],
      x: 0.5, y: 0.5, rotation: 0, scale: 1, bleed: false,
    };
  }

  function arrangePills(s) {
    const rating = s.pills.find((p) => p.kind === 'rating');
    const feats = s.pills.filter((p) => p.kind !== 'rating');
    if (rating) { rating.x = 0.5; rating.y = 0.305; rating.rotation = 0; }
    const left = [], right = [];
    feats.forEach((p, i) => (i % 2 === 0 ? left : right).push(p));
    const band = [0.40, 0.90];
    const place = (list, x) => {
      list.forEach((p, j) => {
        const t = list.length > 1 ? j / (list.length - 1) : 0.5;
        p.x = x;
        p.y = band[0] + t * (band[1] - band[0]);
        p.rotation = TILT_SEQ[(j + (x < 0.5 ? 0 : 4)) % TILT_SEQ.length];
      });
    };
    place(left, 0.17);
    place(right, 0.83);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Pill library (persisted per brand; reusable; feeds Kimi's "avoid" list)
  // ──────────────────────────────────────────────────────────────────────────
  const libStorageKey = () => `shotsmith:pills:${brand.id}`;
  function loadLibrary() { try { return JSON.parse(localStorage.getItem(libStorageKey()) || '[]'); } catch { return []; } }
  function persistLibrary() { try { localStorage.setItem(libStorageKey(), JSON.stringify(pillLibrary)); } catch { /* storage full / unavailable */ } }
  function libKey(p) { return `${(p.title || '').trim().toLowerCase()}|${(p.subtitle || '').trim().toLowerCase()}`; }
  function isInLibrary(p) { return pillLibrary.some((x) => libKey(x) === libKey(p)); }

  function addToLibrary(pills) {
    const seen = new Set(pillLibrary.map(libKey));
    let added = 0;
    for (const p of pills) {
      if (!p || p.kind === 'rating' || !p.title) continue;
      const item = { emoji: p.emoji || '✨', title: p.title, subtitle: p.subtitle || '' };
      const k = libKey(item);
      if (seen.has(k)) continue;
      seen.add(k); pillLibrary.unshift(item); added++;
    }
    if (added) persistLibrary();
    return added;
  }
  function removeFromLibrary(k) { pillLibrary = pillLibrary.filter((p) => libKey(p) !== k); persistLibrary(); renderLibrary(); renderPillList(); }
  function clearLibrary() {
    if (!pillLibrary.length) return;
    if (!confirm('Clear all saved pills for this brand?')) return;
    pillLibrary = []; persistLibrary(); renderLibrary(); renderPillList();
  }

  // Titles Kimi should not repeat: everything saved + everything on this screen.
  function avoidTitles() {
    const set = new Set();
    pillLibrary.forEach((p) => p.title && set.add(p.title));
    if (screens.length) screen().pills.forEach((p) => p.kind !== 'rating' && p.title && set.add(p.title));
    return Array.from(set).slice(0, 120);
  }

  function renderLibrary() {
    const grid = $('lib-grid');
    if (!grid) return;
    $('lib-count').textContent = pillLibrary.length ? `(${pillLibrary.length})` : '';
    $('lib-empty').classList.toggle('hidden', pillLibrary.length > 0);
    grid.innerHTML = '';
    pillLibrary.forEach((p) => {
      const chip = document.createElement('div');
      chip.className = 'lib-chip';
      chip.title = `${p.title}${p.subtitle ? ' — ' + p.subtitle : ''}\nClick to add to this screen`;
      chip.innerHTML = `<span class="lc-emoji">${escapeHtml(p.emoji || '✨')}</span><span class="lc-title">${escapeHtml(p.title)}</span><span class="lc-x" title="Remove from library">×</span>`;
      chip.addEventListener('click', (e) => {
        if (e.target.classList.contains('lc-x')) { removeFromLibrary(libKey(p)); return; }
        addPillFromLibrary(p);
      });
      grid.appendChild(chip);
    });
  }

  function addPillFromLibrary(p) {
    const pill = makePill({ emoji: p.emoji, title: p.title, subtitle: p.subtitle }, screen().pills.length);
    pill.x = 0.2; pill.y = 0.46;
    screen().pills.push(pill); selectedPillId = pill.id;
    renderPillList(); requestRender(); toast('Pill added — drag to place');
  }

  // ── Text-set library (eyebrow / headline / subtitle presets) ───────────────
  const tsStorageKey = () => `shotsmith:textsets:${brand.id}`;
  function loadTextSets() { try { return JSON.parse(localStorage.getItem(tsStorageKey()) || '[]'); } catch { return []; } }
  function persistTextSets() { try { localStorage.setItem(tsStorageKey(), JSON.stringify(textSetLibrary)); } catch {} }
  function tsKeyOf(t) { return (t.headline || []).map((l) => l.text).join(' | ').trim().toLowerCase(); }
  function addTextSets(sets) {
    const seen = new Set(textSetLibrary.map(tsKeyOf));
    let added = 0;
    for (const t of sets) {
      if (!t || !Array.isArray(t.headline) || !t.headline.length) continue;
      const item = { eyebrow: String(t.eyebrow || ''), headline: t.headline.map((l) => ({ text: String(l.text || ''), accent: !!l.accent })), subtitle: String(t.subtitle || '') };
      const k = tsKeyOf(item);
      if (!k || seen.has(k)) continue;
      seen.add(k); textSetLibrary.push(item); added++;
    }
    if (added) persistTextSets();
    return added;
  }
  function renderTextSetSelect() {
    const sel = $('textset-select');
    if (!sel) return;
    sel.innerHTML = '';
    textSetLibrary.forEach((t, i) => {
      const label = `${t.eyebrow ? t.eyebrow + ' · ' : ''}${t.headline.map((l) => l.text).join(' ')}`.slice(0, 64);
      sel.add(new Option(label, String(i)));
    });
    $('textset-count').textContent = textSetLibrary.length ? `(${textSetLibrary.length})` : '';
  }
  function applyTextSet(t) {
    const h = screen().header;
    h.eyebrow.text = t.eyebrow || ''; h.eyebrow.show = !!t.eyebrow;
    h.headline.lines = t.headline.map((l) => ({ text: l.text, accent: !!l.accent }));
    h.subtitle.text = t.subtitle || ''; h.subtitle.show = !!t.subtitle;
    syncAllPanels(); requestRender(); if (showNeighbors) renderNeighbors();
  }

  // ── Panorama gradient library ──────────────────────────────────────────────
  const panoStoreKey = () => `shotsmith:panoramas:${brand.id}`;
  function loadSavedPanoramas() { try { return JSON.parse(localStorage.getItem(panoStoreKey()) || '[]'); } catch { return []; } }
  function persistSavedPanoramas() { try { localStorage.setItem(panoStoreKey(), JSON.stringify(savedPanoramas)); } catch {} }
  function builtinPanoramas() { return (((window.BRAND_CONTENT || {})[brand.id] || {}).panoramas) || []; }
  function allPanoramas() { return builtinPanoramas().concat(savedPanoramas); }
  // ── Colour utilities (for panorama resampling + adjusted preview) ──────────
  function pHexToRgb(hex) { const h = String(hex).replace('#', ''); const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h; return { r: parseInt(n.slice(0, 2), 16), g: parseInt(n.slice(2, 4), 16), b: parseInt(n.slice(4, 6), 16) }; }
  function pRgbToHex(r, g, b) { const c = (v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0'); return `#${c(r)}${c(g)}${c(b)}`; }
  function pSample(colors, t) {
    if (colors.length === 1) return colors[0];
    const seg = t * (colors.length - 1); const i = Math.floor(seg); const f = seg - i;
    const a = pHexToRgb(colors[Math.min(i, colors.length - 1)]); const b = pHexToRgb(colors[Math.min(i + 1, colors.length - 1)]);
    return pRgbToHex(a.r + (b.r - a.r) * f, a.g + (b.g - a.g) * f, a.b + (b.b - a.b) * f);
  }
  function resampleColors(colors, n) { const src = (colors && colors.length) ? colors : ['#EDE6FB', '#FBE6DD']; const out = []; for (let i = 0; i < n; i++) out.push(pSample(src, n <= 1 ? 0 : i / (n - 1))); return out; }
  function pAdjust(hex, hueDeg, satMul, lightAdd) {
    let { r, g, b } = pHexToRgb(hex); r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b); let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else { const d = max - min; s = l > 0.5 ? d / (2 - max - min) : d / (max + min); if (max === r) h = (g - b) / d + (g < b ? 6 : 0); else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h /= 6; }
    h = ((h * 360 + hueDeg) % 360 + 360) % 360 / 360; s = Math.max(0, Math.min(1, s * satMul)); l = Math.max(0, Math.min(1, l + lightAdd));
    const h2 = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
    let R, G, B; if (s === 0) { R = G = B = l; } else { const q = l < 0.5 ? l * (1 + s) : l + s - l * s; const p = 2 * l - q; R = h2(p, q, h + 1 / 3); G = h2(p, q, h); B = h2(p, q, h - 1 / 3); }
    return pRgbToHex(R * 255, G * 255, B * 255);
  }
  function adjustedPanoColors() {
    const hue = panorama.hue || 0, satMul = (panorama.sat != null ? panorama.sat : 100) / 100, lightAdd = (panorama.light || 0) / 100;
    return panorama.colors.map((c) => ((hue || satMul !== 1 || lightAdd) ? pAdjust(c, hue, satMul, lightAdd) : c));
  }
  // Keep one colour anchor per screen so editing a screen blends into neighbours.
  function syncPanoramaAnchors() {
    const n = screens.length || 1;
    if (!panorama.colors || panorama.colors.length !== n) panorama.colors = resampleColors(panorama.colors, n);
  }

  function gradientCss(colors) { return `linear-gradient(90deg, ${colors.join(',')})`; }
  function applyPanorama(colors) {
    panorama.colors = resampleColors(colors, screens.length || colors.length);
    renderPanoStops(); updatePanoPreview(); requestRender(); if (showNeighbors) renderNeighbors();
  }
  function renderPanoPresets() {
    const wrap = $('pano-presets'); if (!wrap) return;
    const list = allPanoramas();
    wrap.innerHTML = '';
    list.forEach((p, idx) => {
      const el = document.createElement('div');
      el.className = 'pano-preset';
      el.title = `${p.name} — click to apply`;
      el.style.background = gradientCss(p.colors);
      const isSaved = idx >= builtinPanoramas().length;
      el.innerHTML = `<span>${escapeHtml(p.name)}</span>${isSaved ? '<b class="pp-x" title="Remove">×</b>' : ''}`;
      el.addEventListener('click', (e) => {
        if (e.target.classList.contains('pp-x')) { savedPanoramas.splice(idx - builtinPanoramas().length, 1); persistSavedPanoramas(); renderPanoPresets(); return; }
        applyPanorama(p.colors);
      });
      wrap.appendChild(el);
    });
    $('pano-count').textContent = list.length ? `(${list.length})` : '';
  }
  function renderPanoStops() {
    const wrap = $('pano-stops'); if (!wrap) return;
    syncPanoramaAnchors();
    wrap.innerHTML = '';
    panorama.colors.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'grad-stop';
      row.innerHTML = `<span class="ps-label">${i + 1}</span><input type="color" value="${c}"><span class="gs-hex">${c}</span>`;
      row.querySelector('input').addEventListener('input', (e) => { panorama.colors[i] = e.target.value; row.querySelector('.gs-hex').textContent = e.target.value; updatePanoPreview(); requestRender(); if (showNeighbors) renderNeighbors(); });
      wrap.appendChild(row);
    });
  }
  function updatePanoPreview() { const el = $('pano-preview'); if (el) el.style.background = gradientCss(adjustedPanoColors()); }

  // Seed both libraries once (per brand, versioned) from the curated content pack.
  function seedLibraries() {
    const content = (window.BRAND_CONTENT || {})[brand.id] || {};
    try {
      const k = `shotsmith:pillseed:${brand.id}`;
      if (localStorage.getItem(k) !== '2') {
        const starter = [];
        brand.screens.forEach((sc) => (sc.pills || []).forEach((p) => starter.push(p)));
        addToLibrary(starter);
        addToLibrary(content.pills || []);
        localStorage.setItem(k, '2');
      }
    } catch {}
    try {
      const k = `shotsmith:textsetseed:${brand.id}`;
      if (localStorage.getItem(k) !== '3') {
        const starterSets = brand.screens.map((sc) => ({ eyebrow: sc.eyebrow, headline: (sc.headline || []).map((l) => ({ text: l.text, accent: !!l.accent })), subtitle: sc.subtitle }));
        addTextSets(starterSets);
        addTextSets(content.textSets || []);
        localStorage.setItem(k, '3');
      }
    } catch {}
  }

  // ── Emoji picker ────────────────────────────────────────────────────────────
  let emojiPop = null;
  function closeEmojiPicker() {
    if (!emojiPop) return;
    emojiPop.remove(); emojiPop = null;
    document.removeEventListener('mousedown', onEmojiOutside, true);
  }
  function onEmojiOutside(e) { if (emojiPop && !emojiPop.contains(e.target)) closeEmojiPicker(); }
  function openEmojiPicker(anchor, onPick) {
    closeEmojiPicker();
    const lib = window.EMOJI_LIBRARY || [];
    const pop = document.createElement('div');
    pop.className = 'emoji-pop';
    pop.innerHTML = '<div class="ep-head">Pick an emoji<span class="ep-x">×</span></div>'
      + '<input class="ep-search" type="text" placeholder="Search emojis (money, happy, food, arrow…)">'
      + '<div class="ep-grid"></div>';
    document.body.appendChild(pop);
    emojiPop = pop;
    const grid = pop.querySelector('.ep-grid');
    const search = pop.querySelector('.ep-search');

    const buildGrid = (q) => {
      grid.innerHTML = '';
      const query = (q || '').trim().toLowerCase();
      let shown = 0;
      lib.forEach((cat) => {
        const hay = `${cat.name} ${cat.keywords || ''}`.toLowerCase();
        if (query && !hay.includes(query)) return;
        const h = document.createElement('div'); h.className = 'ep-cat'; h.textContent = cat.name; grid.appendChild(h);
        const row = document.createElement('div'); row.className = 'ep-row';
        cat.emojis.forEach((em) => {
          const b = document.createElement('div'); b.className = 'ep-em'; b.textContent = em;
          b.title = em;
          b.addEventListener('click', () => { onPick(em); closeEmojiPicker(); });
          row.appendChild(b);
        });
        grid.appendChild(row);
        shown++;
      });
      if (!shown) { const e = document.createElement('div'); e.className = 'ep-empty'; e.textContent = 'No matching group — try “money”, “happy”, “arrow”…'; grid.appendChild(e); }
    };
    buildGrid('');
    search.addEventListener('input', () => buildGrid(search.value));
    search.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeEmojiPicker(); });

    pop.querySelector('.ep-x').addEventListener('click', closeEmojiPicker);
    const r = anchor.getBoundingClientRect();
    pop.style.left = `${Math.max(8, Math.min(r.left, window.innerWidth - 332))}px`;
    pop.style.top = `${Math.max(8, Math.min(r.bottom + 6, window.innerHeight - 432))}px`;
    setTimeout(() => { document.addEventListener('mousedown', onEmojiOutside, true); search.focus(); }, 0);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Rendering
  // ──────────────────────────────────────────────────────────────────────────
  // Render screens[index] to a canvas, giving the renderer its neighbours so a
  // phone bleeding off one screen continues onto the adjacent one.
  function renderScreenTo(canvasEl, index, extra = {}) {
    const s = screens[index];
    if (!s) return;
    s.device = device;
    const prev = screens[index - 1] || null;
    const next = screens[index + 1] || null;
    if (prev) prev.device = device;
    if (next) next.device = device;
    Renderer.render(canvasEl, s, { prev, next, panorama: panorama.enabled ? panorama : null, index, count: screens.length, ...extra });
  }

  let renderPending = false;
  let neighborTimer = null;
  function requestRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      if (!screens[activeIndex]) return;
      if (panorama.enabled) syncPanoramaAnchors();
      renderScreenTo(canvas, activeIndex, { selectedPillId, guides: dragGuides });
      // A change to this screen's phone changes the neighbour continuations, so
      // refresh them (debounced). Skip while dragging pills/text (no effect),
      // but keep updating while dragging a phone so the bleed tracks live.
      if (showNeighbors && (!drag || drag.kind === 'phone')) {
        clearTimeout(neighborTimer);
        neighborTimer = setTimeout(refreshAdjacent, 90);
      }
      scheduleHistory();
    });
  }

  function setDevice(d, silent) {
    device = d;
    const [w, h] = DEVICE_RES[d];
    canvas.width = w; canvas.height = h;
    document.querySelectorAll('[data-device]').forEach((b) => b.classList.toggle('active', b.dataset.device === d));
    $('res-label').textContent = `${w} × ${h}`;
    $('canvas-dims').textContent = `${w} × ${h} px`;
    fitCanvas();
    if (!silent) requestRender();
    if (showNeighbors) renderNeighbors();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Canvas fit + zoom + pill drag
  // ──────────────────────────────────────────────────────────────────────────
  function fitCanvas() {
    const host = $('canvas-host');
    const pad = 44;
    const availW = host.clientWidth - pad, availH = host.clientHeight - pad;
    const fit = Math.min(availW / canvas.width, availH / canvas.height);
    const scale = Math.max(0.05, fit * userZoom);
    const w = `${canvas.width * scale}px`, h = `${canvas.height * scale}px`;
    $('filmstrip').querySelectorAll('canvas').forEach((c) => { c.style.width = w; c.style.height = h; });
    $('zoom-level').textContent = userZoom === 1 ? 'Fit' : `${Math.round(userZoom * 100)}%`;
    if (showNeighbors) requestAnimationFrame(positionActiveDot);
  }

  // Build the editing filmstrip. When "show all" is on, every screen renders in
  // order (continuous, so bleeds/panorama connect); the active screen is the
  // interactive #canvas, the rest are clickable context canvases.
  function renderNeighbors() {
    const strip = $('filmstrip');
    strip.classList.toggle('has-neighbors', showNeighbors);
    $('canvas-host').classList.toggle('multi', showNeighbors);
    stripCanvases = [];
    if (!showNeighbors) {
      strip.innerHTML = ''; strip.appendChild(canvas); stripCanvases[activeIndex] = canvas;
      fitCanvas(); return;
    }
    const frag = document.createDocumentFragment();
    screens.forEach((s, i) => {
      if (i === activeIndex) { stripCanvases[i] = canvas; frag.appendChild(canvas); return; }
      const c = document.createElement('canvas');
      c.className = 'neighbor'; c.width = canvas.width; c.height = canvas.height; c.title = `${i + 1}. ${s.name} — click to edit`;
      renderScreenTo(c, i);
      c.addEventListener('click', () => switchScreen(i));
      stripCanvases[i] = c; frag.appendChild(c);
    });
    strip.innerHTML = ''; strip.appendChild(frag);
    const dot = document.createElement('div'); dot.id = 'active-dot'; dot.className = 'active-dot'; strip.appendChild(dot);
    fitCanvas();
    requestAnimationFrame(positionActiveDot);
    try { canvas.scrollIntoView({ inline: 'center', block: 'nearest' }); } catch {}
  }
  // Place the "selected" dot just above the active screen (inside the filmstrip,
  // so it scrolls with the strip).
  function positionActiveDot() {
    const dot = $('active-dot');
    if (!dot) return;
    dot.style.left = `${canvas.offsetLeft + canvas.offsetWidth / 2}px`;
    dot.style.top = `${canvas.offsetTop}px`;
  }
  // Cheap update while editing — only the screens adjacent to the active one can
  // change (their bleed continuation of the active phone).
  function refreshAdjacent() {
    if (!showNeighbors) return;
    [activeIndex - 1, activeIndex + 1].forEach((i) => {
      const c = stripCanvases[i];
      if (c && c !== canvas && i >= 0 && i < screens.length) { c.getContext('2d').clearRect(0, 0, c.width, c.height); renderScreenTo(c, i); }
    });
  }

  function canvasPoint(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * canvas.width, y: (e.clientY - r.top) / r.height * canvas.height };
  }
  function startDrag(e) { canvas.classList.add('dragging'); try { canvas.setPointerCapture(e.pointerId); } catch {} }

  let drag = null;        // { kind:'pill'|'phone'|'header', id?, dx, dy, bleed, halfH? }
  let dragGuides = null;  // { v, h } centre guides while dragging
  const SNAP = 0.012;     // ~1.2% of canvas → snap to centre
  const clampN = (v, a, b) => Math.max(a, Math.min(b, v));

  function setupCanvasInteraction() {
    canvas.addEventListener('pointerdown', (e) => {
      const pt = canvasPoint(e);
      const W = canvas.width, H = canvas.height;

      // 1) Pills (drawn on top)
      const pillRects = Renderer.getPillRects(W, H, screen());
      for (let i = pillRects.length - 1; i >= 0; i--) {
        if (Renderer.hitTestPill(pt.x, pt.y, pillRects[i])) {
          const p = screen().pills.find((x) => x.id === pillRects[i].id);
          selectedPillId = p.id;
          drag = { kind: 'pill', id: p.id, dx: pt.x / W - p.x, dy: pt.y / H - p.y, bleed: !!p.bleed };
          startDrag(e); renderPillList(); requestRender(); return;
        }
      }
      // 2) Phones (own phones on this screen)
      const phoneRects = Renderer.getPhoneRects(W, H, screen());
      for (let i = phoneRects.length - 1; i >= 0; i--) {
        if (Renderer.hitTestPill(pt.x, pt.y, phoneRects[i])) {
          const idx = screen().phones.findIndex((x) => x.id === phoneRects[i].id);
          const p = screen().phones[idx];
          screen().activePhone = idx; renderPhoneTabs(); syncDeviceControls();
          selectedPillId = null;
          drag = { kind: 'phone', id: p.id, dx: pt.x / W - p.x / 100, dy: pt.y / H - p.y / 100 };
          startDrag(e); renderPillList(); requestRender(); return;
        }
      }
      // 3) Header text block
      const hr = Renderer.getHeaderRect(W, H, screen());
      if (hr && pt.x >= hr.x && pt.x <= hr.x + hr.w && pt.y >= hr.y && pt.y <= hr.y + hr.h) {
        const h = screen().header;
        drag = { kind: 'header', dx: pt.x / W - (h.x != null ? h.x : 0.5), dy: pt.y / H - (h.y != null ? h.y : 0.05), bleed: !!h.bleed, halfH: (hr.h / 2) / H };
        selectedPillId = null; startDrag(e); renderPillList(); requestRender(); return;
      }
      // 4) Empty → deselect
      if (selectedPillId) { selectedPillId = null; renderPillList(); requestRender(); }
    });

    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const pt = canvasPoint(e);
      let cx = pt.x / canvas.width - drag.dx;
      let cy = pt.y / canvas.height - drag.dy;
      const guides = { vx: null, hy: null };
      // Snap to the nearest candidate within threshold; record the guide line.
      const snapTo = (val, candidates, thresh = SNAP) => {
        let best = null, bestD = thresh;
        for (const c of candidates) { const d = Math.abs(val - c); if (d < bestD) { bestD = d; best = c; } }
        return best;
      };
      // Seam guide: when an item is dragged near a screen edge, snap its centre to
      // the seam (0 = left/prev screen, 1 = right/next screen) so it splits cleanly
      // across the two screens. Generous threshold so it's easy to catch.
      const seamSnap = () => { const se = snapTo(cx, [0, 1], 0.04); if (se != null) { cx = se; guides.vx = se; } };

      if (drag.kind === 'pill') {
        const others = screen().pills.filter((x) => x.id !== drag.id);
        // align to centre, other pills' x, and the MIRROR of other pills (symmetry)
        const xc = [0.5]; const yc = [0.5];
        others.forEach((o) => { xc.push(o.x, 1 - o.x); yc.push(o.y); });
        const sx = snapTo(cx, xc); if (sx != null) { cx = sx; guides.vx = sx; }
        const sy = snapTo(cy, yc); if (sy != null) { cy = sy; guides.hy = sy; }
        if (drag.bleed) seamSnap();
        const lo = drag.bleed ? -0.6 : 0.02, hi = drag.bleed ? 1.6 : 0.98;
        const p = screen().pills.find((x) => x.id === drag.id);
        if (p) { p.x = clampN(cx, lo, hi); p.y = clampN(cy, lo, hi); }
      } else if (drag.kind === 'phone') {
        const p = screen().phones.find((x) => x.id === drag.id);
        const noBleed = p && p.bleed === false;
        const sx = snapTo(cx, [0.5]); if (sx != null) { cx = sx; guides.vx = sx; }
        const sy = snapTo(cy, [0.5]); if (sy != null) { cy = sy; guides.hy = sy; }
        if (!noBleed) seamSnap(); // phones continue across the seam unless bleed is disabled
        if (p) {
          if (noBleed) { const half = (p.scale != null ? p.scale : 55) / 2; p.x = clampN(cx * 100, half, 100 - half); p.y = clampN(cy * 100, 0, 100); }
          else { p.x = clampN(cx * 100, -120, 220); p.y = clampN(cy * 100, -20, 130); }
          syncDeviceControls();
        }
      } else { // header (text block) — generous centre snap so bleeding text is easy to centre
        const h = screen().header;
        const HSNAP = 0.045;
        if (Math.abs(cx - 0.5) < HSNAP) { cx = 0.5; guides.vx = 0.5; }
        const centerY = cy + (drag.halfH || 0);
        if (Math.abs(centerY - 0.5) < HSNAP) { cy = 0.5 - (drag.halfH || 0); guides.hy = 0.5; }
        if (drag.bleed) seamSnap();
        const lo = drag.bleed ? -0.8 : 0.02, hi = drag.bleed ? 1.8 : 0.98;
        h.x = clampN(cx, lo, hi);
        h.y = clampN(cy, drag.bleed ? -0.5 : 0, drag.bleed ? 1.5 : 0.92);
      }
      dragGuides = (guides.vx != null || guides.hy != null) ? guides : null;
      requestRender();
    });

    const end = () => {
      if (!drag) return;
      const k = drag.kind;
      drag = null; dragGuides = null; canvas.classList.remove('dragging'); requestRender(); if (showNeighbors) renderNeighbors();
      // Reflect the dragged position back into the manual-entry fields.
      if (k === 'pill') renderPillList();
      else if (k === 'header') { const h = screen().header; const hx = Math.round((h.x != null ? h.x : 0.5) * 100), hy = Math.round((h.y != null ? h.y : 0.05) * 100); $('header-x').value = hx; $('v-header-x').value = hx; $('header-y').value = hy; $('v-header-y').value = hy; }
    };
    canvas.addEventListener('pointerup', end);
    canvas.addEventListener('pointercancel', end);

    $('zoom-in').addEventListener('click', () => { userZoom = Math.min(2, userZoom + 0.15); fitCanvas(); });
    $('zoom-out').addEventListener('click', () => { userZoom = Math.max(0.4, userZoom - 0.15); fitCanvas(); });
    $('zoom-level').addEventListener('click', () => { userZoom = 1; fitCanvas(); });
    window.addEventListener('resize', fitCanvas);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Screen tabs
  // ──────────────────────────────────────────────────────────────────────────
  function renderScreenTabs() {
    const wrap = $('screen-tabs');
    wrap.innerHTML = '';
    screens.forEach((s, i) => {
      const tab = document.createElement('div');
      tab.className = `screen-tab${i === activeIndex ? ' active' : ''}`;
      tab.innerHTML = `<span class="st-name">${i + 1}. ${escapeHtml(s.name)}</span>`;
      const close = document.createElement('span');
      close.className = 'st-close'; close.textContent = '×';
      close.addEventListener('click', (e) => { e.stopPropagation(); removeScreen(i); });
      tab.appendChild(close);
      tab.querySelector('.st-name').addEventListener('dblclick', () => {
        const name = prompt('Screen name', s.name);
        if (name) { s.name = name; renderScreenTabs(); }
      });
      tab.addEventListener('click', () => switchScreen(i));
      wrap.appendChild(tab);
    });
    const add = document.createElement('button');
    add.className = 'screen-tab-add'; add.textContent = '+'; add.title = 'Add screen';
    add.addEventListener('click', addScreen);
    wrap.appendChild(add);
  }

  function switchScreen(i) {
    activeIndex = i; selectedPillId = null;
    renderScreenTabs(); syncAllPanels(); requestRender();
    if (showNeighbors) renderNeighbors();
  }
  function addScreen() {
    const blank = buildScreen({ name: `Screen ${screens.length + 1}`, eyebrow: '', theme: 'light', bg: brand.gradients.lavender, headline: [{ text: 'New headline', accent: false }, { text: 'second line', accent: true }], subtitle: 'A calm one-line subtitle.', pills: [] });
    screens.push(blank); switchScreen(screens.length - 1);
  }
  function duplicateScreen() {
    const src = screen();
    const copy = JSON.parse(JSON.stringify(src)); // Image objects don't survive JSON
    copy.id = `s${uid++}`; copy.name = `${src.name} copy`;
    copy.phones.forEach((p, i) => { p.id = `ph${uid++}`; p.screenshot = src.phones[i] ? src.phones[i].screenshot : null; });
    copy.pills.forEach((p) => (p.id = nextId()));
    screens.splice(activeIndex + 1, 0, copy);
    switchScreen(activeIndex + 1);
  }
  function removeScreen(i) {
    if (screens.length === 1) { toast('Keep at least one screen', true); return; }
    screens.splice(i, 1);
    if (activeIndex >= screens.length) activeIndex = screens.length - 1;
    selectedPillId = null;
    renderScreenTabs(); syncAllPanels(); requestRender();
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Panels — static bindings (once)
  // ──────────────────────────────────────────────────────────────────────────
  function buildPanelStaticBindings() {
    // panel tabs
    document.querySelectorAll('.ptab').forEach((t) => t.addEventListener('click', () => {
      document.querySelectorAll('.ptab').forEach((x) => x.classList.remove('active'));
      document.querySelectorAll('.ppanel').forEach((x) => x.classList.remove('active'));
      t.classList.add('active');
      document.querySelector(`.ppanel[data-panel="${t.dataset.tab}"]`).classList.add('active');
    }));

    // device toggles (topbar + device panel)
    document.querySelectorAll('[data-device]').forEach((b) => b.addEventListener('click', () => setDevice(b.dataset.device)));

    // topbar actions
    $('btn-add-screen').addEventListener('click', addScreen);
    $('btn-duplicate-screen').addEventListener('click', duplicateScreen);
    $('btn-export').addEventListener('click', exportCurrent);
    $('btn-export-all').addEventListener('click', exportAll);

    // Light / dark interface
    const applyThemeBtn = () => { $('btn-theme').textContent = document.body.classList.contains('light') ? '🌙' : '☀️'; };
    applyThemeBtn();
    $('btn-theme').addEventListener('click', () => {
      const light = document.body.classList.toggle('light');
      try { localStorage.setItem('shotsmith:uitheme', light ? 'light' : 'dark'); } catch {}
      applyThemeBtn();
    });

    // History
    $('btn-undo').addEventListener('click', undo);
    $('btn-redo').addEventListener('click', redo);
    // Drafts
    $('btn-save-draft').addEventListener('click', saveDraft);
    $('btn-export-json').addEventListener('click', exportProjectFile);
    $('btn-import-json').addEventListener('click', () => $('import-json-input').click());
    $('import-json-input').addEventListener('change', (e) => { const f = e.target.files && e.target.files[0]; if (f) importProjectFile(f); e.target.value = ''; });
    $('btn-drafts').addEventListener('click', openDraftsMenu);
    $('drafts-close').addEventListener('click', closeDraftsMenu);
    $('drafts-overlay').addEventListener('click', (e) => { if (e.target.id === 'drafts-overlay') closeDraftsMenu(); });
    // Mockup-position presets (Layouts menu)
    $('btn-layouts').addEventListener('click', openLayoutsMenu);
    $('layouts-close').addEventListener('click', closeLayoutsMenu);
    $('layouts-overlay').addEventListener('click', (e) => { if (e.target.id === 'layouts-overlay') closeLayoutsMenu(); });
    // All screens side-by-side (inline, while editing)
    $('btn-all-screens').addEventListener('click', () => {
      showNeighbors = !showNeighbors;
      $('btn-all-screens').classList.toggle('active', showNeighbors);
      const c = $('show-neighbors'); if (c) c.checked = showNeighbors;
      renderNeighbors();
    });
    // Reset
    $('btn-reset').addEventListener('click', () => {
      if (!confirm('Discard the current work and reset to the starter screens? (Saved drafts are kept.)')) return;
      screens = brand.screens.map(buildScreen); activeIndex = 0; selectedPillId = null;
      refreshAfterProjectChange(); resetHistory();
      toast('Reset to starter screens');
    });
    // Autosave banner (restore last session) — try the live autosave, then the
    // rolling backup, before giving up (and point at the recovery page).
    $('draft-resume').addEventListener('click', async () => {
      const tryLoad = async (key) => { const proj = await idbGet(key); if (proj && Array.isArray(proj.screens) && proj.screens.length) { restoreProject(proj); refreshAfterProjectChange(); resetHistory(); return true; } return false; };
      try {
        if (await tryLoad(`autosave:${brand.id}`)) { toast('Restored your last session'); $('draft-banner').classList.add('hidden'); return; }
        if (await tryLoad(`autosave-prev:${brand.id}`)) { toast('Restored from backup'); $('draft-banner').classList.add('hidden'); return; }
        toast('Could not restore — open /recover.html to recover it', true);
      } catch (e) {
        console.error('restore failed', e);
        try { if (await tryLoad(`autosave-prev:${brand.id}`)) { toast('Restored from backup'); $('draft-banner').classList.add('hidden'); return; } } catch {}
        toast('Could not restore — open /recover.html to recover it', true);
      }
    });
    $('draft-discard').addEventListener('click', async () => { try { await idbDel(`autosave:${brand.id}`); } catch {} $('draft-banner').classList.add('hidden'); });

    // ---- Text panel ----
    bindCheckbox('header-show', (v) => { screen().header.show = v; });
    bindInput('eyebrow-text', (v) => { screen().header.eyebrow.text = v; });
    bindCheckbox('eyebrow-show', (v) => { screen().header.eyebrow.show = v; });
    $('btn-add-line').addEventListener('click', () => { screen().header.headline.lines.push({ text: 'New line', accent: true }); renderHeadlineLines(); requestRender(); });
    bindRange('headline-size', (v) => { screen().header.headline.size = +v; });
    bindSelect('headline-weight', (v) => { screen().header.headline.weight = +v; });
    $('accent-mode').addEventListener('change', () => {
      const m = $('accent-mode').value;
      const ab = screen().header.accentBar;
      if (m === 'none') { ab.show = false; }
      else { ab.show = true; ab.mode = m; }
      if (m === 'underline' && !ab.word) ab.word = defaultUnderlineWord();
      populateAccentWords();
      $('accent-word').style.display = m === 'underline' ? '' : 'none';
      requestRender();
    });
    $('accent-word').addEventListener('change', () => { screen().header.accentBar.word = $('accent-word').value; requestRender(); });

    // Text-set library
    $('textset-apply').addEventListener('click', () => { const t = textSetLibrary[+$('textset-select').value]; if (t) { applyTextSet(t); toast('Text set applied'); } });
    $('textset-shuffle').addEventListener('click', () => {
      if (!textSetLibrary.length) return;
      const i = Math.floor(Math.random() * textSetLibrary.length);
      $('textset-select').value = String(i);
      applyTextSet(textSetLibrary[i]); toast('Applied a random set');
    });
    $('textset-save').addEventListener('click', () => {
      const h = screen().header;
      const n = addTextSets([{ eyebrow: h.eyebrow.text, headline: h.headline.lines, subtitle: h.subtitle.text }]);
      renderTextSetSelect();
      toast(n ? 'Saved to text-set library' : 'Already in library');
    });
    $('ai-textset').addEventListener('click', aiTextSet);
    bindInput('subtitle-text', (v) => { screen().header.subtitle.text = v; screen().header.subtitle.show = !!v; });
    bindRange('header-x', (v) => { screen().header.x = +v / 100; $('v-header-x').value = v; if (showNeighbors) renderNeighbors(); });
    bindRange('header-y', (v) => { screen().header.y = +v / 100; $('v-header-y').value = v; if (showNeighbors) renderNeighbors(); });
    bindNum('v-header-x', 'header-x', (v) => { screen().header.x = v / 100; });
    bindNum('v-header-y', 'header-y', (v) => { screen().header.y = v / 100; });
    $('header-centre-x').addEventListener('click', () => { screen().header.x = 0.5; $('header-x').value = 50; $('v-header-x').value = 50; requestRender(); if (showNeighbors) renderNeighbors(); });
    $('header-copy-pos').addEventListener('click', () => { const h = screen().header; setPosClip(h.x != null ? h.x : 0.5, h.y != null ? h.y : 0.05, 0); });
    $('header-paste-pos').addEventListener('click', () => { if (!needPosClip()) return; const h = screen().header; h.x = posClipboard.x; h.y = posClipboard.y; const hx = Math.round(h.x * 100), hy = Math.round(h.y * 100); $('header-x').value = hx; $('v-header-x').value = hx; $('header-y').value = hy; $('v-header-y').value = hy; requestRender(); if (showNeighbors) renderNeighbors(); });
    $('header-bleed').addEventListener('change', () => { screen().header.bleed = $('header-bleed').checked; requestRender(); if (showNeighbors) renderNeighbors(); });
    bindCheckbox('theme-dark', (v) => { screen().theme.mode = v ? 'dark' : 'light'; });

    // ---- Pills panel ----
    $('btn-add-pill').addEventListener('click', () => {
      const p = makePill({ emoji: '✨', title: 'New pill', subtitle: 'subtitle' }, screen().pills.length);
      p.x = 0.2; p.y = 0.5;
      screen().pills.push(p); selectedPillId = p.id; renderPillList(); requestRender();
    });
    $('btn-add-rating').addEventListener('click', () => {
      const p = { id: nextId(), kind: 'rating', stars: 5, label: 'Loved by everyday budgeters', style: 'solid', x: 0.5, y: 0.3, rotation: 0, scale: 1, bleed: false };
      screen().pills.push(p); selectedPillId = p.id; renderPillList(); requestRender();
    });
    $('btn-arrange-pills').addEventListener('click', () => { arrangePills(screen()); renderPillList(); requestRender(); });
    $('btn-same-size').addEventListener('click', () => {
      const feats = screen().pills.filter((p) => p.kind !== 'rating');
      if (!feats.length) return;
      const sel = selectedPill();
      const target = (sel && sel.kind !== 'rating') ? (sel.scale || 1) : (feats.reduce((a, p) => a + (p.scale || 1), 0) / feats.length);
      feats.forEach((p) => { p.scale = target; });
      renderPillList(); requestRender();
      toast('Pills set to the same size');
    });
    $('pills-ai').addEventListener('click', aiPills);
    $('lib-clear').addEventListener('click', clearLibrary);

    // ---- Style panel ----
    document.querySelectorAll('#bg-type-seg .seg-btn').forEach((b) => b.addEventListener('click', () => {
      document.querySelectorAll('#bg-type-seg .seg-btn').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      const type = b.dataset.bg;
      const bg = screen().background;
      bg.type = type;
      if (type === 'solid' && !bg.color) bg.color = '#EDE6FB';
      if (type === 'mesh' && !bg.meshColors) bg.meshColors = (bg.colors || ['#EDE6FB', '#FBE6DD']).concat(['#E9E2FB', '#F3E0F0']).slice(0, 4);
      $('bg-gradient-controls').classList.toggle('hidden', type !== 'gradient');
      $('bg-solid-controls').classList.toggle('hidden', type !== 'solid');
      syncStylePanel(); requestRender();
    }));
    bindRange('grad-angle', (v) => { screen().background.angle = +v; });
    bindColor('solid-color', (v) => { screen().background.color = v; });
    bindCheckbox('bg-glow', (v) => { screen().background.glow = v; });

    // Panorama background (project-wide)
    $('pano-enable').addEventListener('change', () => {
      panorama.enabled = $('pano-enable').checked;
      $('pano-controls').classList.toggle('hidden', !panorama.enabled);
      if (panorama.enabled) { syncPanoramaAnchors(); renderPanoStops(); updatePanoPreview(); }
      requestRender(); if (showNeighbors) renderNeighbors();
    });
    const panoAdjust = () => { updatePanoPreview(); requestRender(); if (showNeighbors) renderNeighbors(); };
    $('pano-hue').addEventListener('input', (e) => { panorama.hue = +e.target.value; $('v-pano-hue').textContent = `${e.target.value}°`; panoAdjust(); });
    $('pano-tone').addEventListener('input', (e) => { panorama.light = +e.target.value; $('v-pano-tone').textContent = e.target.value; panoAdjust(); });
    $('pano-vibrancy').addEventListener('input', (e) => { panorama.sat = +e.target.value; $('v-pano-vib').textContent = `${e.target.value}%`; panoAdjust(); });
    $('pano-save').addEventListener('click', () => {
      const name = prompt('Name this panorama', `My panorama ${savedPanoramas.length + 1}`);
      if (!name) return;
      savedPanoramas.push({ name: name.slice(0, 30), colors: panorama.colors.slice() });
      persistSavedPanoramas(); renderPanoPresets(); toast('Saved to panorama library');
    });

    // ---- Device panel ---- (controls target the active phone on this screen;
    // a screen may legitimately have no phone, e.g. a spanning continuation)
    bindCheckbox('phone-show', (v) => { const p = activePhone(); if (p) p.show = v; });
    bindCheckbox('phone-bleed', (v) => {
      const p = activePhone(); if (!p) return;
      p.bleed = v;
      if (!v) { const half = (p.scale != null ? p.scale : 55) / 2; p.x = Math.max(half, Math.min(100 - half, p.x)); p.y = Math.max(0, Math.min(100, p.y)); syncDeviceControls(); }
      if (showNeighbors) renderNeighbors();
    });
    bindRange('phone-scale', (v) => { const p = activePhone(); if (p) p.scale = +v; $('v-scale').value = v; });
    bindRange('phone-x', (v) => { const p = activePhone(); if (p) p.x = +v; $('v-x').value = v; });
    bindRange('phone-y', (v) => { const p = activePhone(); if (p) p.y = +v; $('v-y').value = v; });
    bindRange('phone-rotation', (v) => { const p = activePhone(); if (p) p.rotation = +v; $('v-rot').value = v; });
    bindNum('v-scale', 'phone-scale', (v) => { const p = activePhone(); if (p) p.scale = v; });
    bindNum('v-x', 'phone-x', (v) => { const p = activePhone(); if (p) p.x = v; });
    bindNum('v-y', 'phone-y', (v) => { const p = activePhone(); if (p) p.y = v; });
    bindNum('v-rot', 'phone-rotation', (v) => { const p = activePhone(); if (p) p.rotation = v; });
    $('phone-copy-pos').addEventListener('click', () => { const p = activePhone(); if (p) setPosClip(p.x / 100, p.y / 100, p.rotation); });
    $('phone-paste-pos').addEventListener('click', () => { const p = activePhone(); if (!p || !needPosClip()) return; p.x = Math.round(posClipboard.x * 100); p.y = Math.round(posClipboard.y * 100); if (posClipboard.rotation != null) p.rotation = Math.max(-35, Math.min(35, posClipboard.rotation)); syncDeviceControls(); requestRender(); if (showNeighbors) renderNeighbors(); });
    const bumpLayer = (d) => { const p = activePhone(); if (!p) return; p.z = (p.z || 0) + d; $('v-z').textContent = p.z; requestRender(); if (showNeighbors) renderNeighbors(); };
    $('phone-front').addEventListener('click', () => bumpLayer(1));
    $('phone-back').addEventListener('click', () => bumpLayer(-1));
    bindCheckbox('phone-shadow', (v) => { const p = activePhone(); if (p) p.shadow = v; });
    bindRange('shadow-intensity', (v) => { const p = activePhone(); if (p) p.shadowIntensity = +v; $('v-shadow').textContent = `${v}%`; });
    bindRange('shadow-blur', (v) => { const p = activePhone(); if (p) p.shadowBlur = +v; $('v-blur').textContent = v; });
    setupUpload();
    $('btn-clear-shot').addEventListener('click', () => { const p = activePhone(); if (p) p.screenshot = null; syncDeviceControls(); requestRender(); if (showNeighbors) renderNeighbors(); });

    // Add / remove phone mockups
    $('btn-add-phone').addEventListener('click', () => {
      const s = screen();
      const maxZ = Math.max(0, ...s.phones.map((p) => p.z || 0));
      s.phones.push(defaultPhone({ x: 72, scale: 48, rotation: 4, z: maxZ + 1 }));
      s.activePhone = s.phones.length - 1;
      renderPhoneTabs(); syncDeviceControls(); requestRender(); if (showNeighbors) renderNeighbors();
    });

    // Bleed presets + neighbour preview
    document.querySelectorAll('[data-bleed]').forEach((b) => b.addEventListener('click', () => {
      const mode = b.dataset.bleed;
      const x = mode === 'left' ? 4 : mode === 'right' ? 96 : 50;
      const p = activePhone(); if (!p) return;
      p.x = x;
      $('phone-x').value = x; $('v-x').value = x;
      requestRender();
      if (showNeighbors) renderNeighbors();
    }));
    $('show-neighbors').addEventListener('change', () => { showNeighbors = $('show-neighbors').checked; $('btn-all-screens').classList.toggle('active', showNeighbors); renderNeighbors(); });
    $('match-prev-bg').addEventListener('click', () => {
      const prev = screens[activeIndex - 1];
      if (!prev) { toast('No previous screen to match', true); return; }
      const s = screen();
      s.background = JSON.parse(JSON.stringify(prev.background));
      s.theme = JSON.parse(JSON.stringify(prev.theme));
      s._paletteId = prev._paletteId;
      syncStylePanel();
      $('theme-dark').checked = s.theme.mode === 'dark';
      requestRender();
      if (showNeighbors) renderNeighbors();
      toast('Matched previous screen background');
    });

    // ---- Fonts panel ----
    bindSelect('font-display', (v) => { screen().fonts.display = v; updateFontPreview(); });
    bindSelect('font-body', (v) => { screen().fonts.body = v; updateFontPreview(); });
    $('fonts-ai').addEventListener('click', aiFonts);

    // ---- AI panel ----
    $('ai-auto').addEventListener('click', aiAutoDesign);
    $('ai-copy').addEventListener('click', aiCopy);
    $('ai-pills').addEventListener('click', aiPills);
    $('ai-fonts').addEventListener('click', aiFonts);
    $('ai-set').addEventListener('click', aiSet);
  }

  // generic binders — write to current screen then re-render
  function bindInput(id, fn) { $(id).addEventListener('input', () => { fn($(id).value); requestRender(); }); }
  function bindRange(id, fn) { $(id).addEventListener('input', () => { fn($(id).value); requestRender(); }); }
  function bindSelect(id, fn) { $(id).addEventListener('change', () => { fn($(id).value); requestRender(); }); }
  function bindCheckbox(id, fn) { $(id).addEventListener('change', () => { fn($(id).checked); requestRender(); }); }
  function bindColor(id, fn) { $(id).addEventListener('input', () => { fn($(id).value); requestRender(); }); }
  // Two-way bind a number input to its range slider so a value can be typed
  // exactly (and can exceed the slider's range for extreme/bleed placement).
  function bindNum(numId, rangeId, apply) {
    const num = $(numId), rng = $(rangeId);
    if (!num) return;
    num.addEventListener('input', () => {
      const v = +num.value; if (Number.isNaN(v)) return;
      apply(v);
      if (rng) rng.value = Math.max(+rng.min, Math.min(+rng.max, v));
      requestRender(); if (showNeighbors) renderNeighbors();
    });
  }
  // Position clipboard — stored as fractions so a placement copied from a pill,
  // phone or the headline can be pasted onto any of them.
  let posClipboard = null;
  function setPosClip(xFrac, yFrac, rotation) { posClipboard = { x: xFrac, y: yFrac, rotation: rotation }; toast('Position copied'); }
  function needPosClip() { if (!posClipboard) { toast('Copy a position first', true); return false; } return true; }

  // ──────────────────────────────────────────────────────────────────────────
  // Panel sync (when switching screens)
  // ──────────────────────────────────────────────────────────────────────────
  function syncAllPanels() {
    const s = screen();
    $('header-show').checked = s.header.show !== false;
    $('eyebrow-text').value = s.header.eyebrow.text || '';
    $('eyebrow-show').checked = s.header.eyebrow.show !== false;
    renderHeadlineLines();
    $('headline-size').value = s.header.headline.size;
    $('headline-weight').value = s.header.headline.weight;
    const ab = s.header.accentBar;
    $('accent-mode').value = (ab.show === false) ? 'none' : (ab.mode || 'bar');
    populateAccentWords();
    $('accent-word').style.display = (ab.show !== false && (ab.mode || 'bar') === 'underline') ? '' : 'none';
    $('subtitle-text').value = s.header.subtitle.text || '';
    const hx = Math.round((s.header.x != null ? s.header.x : 0.5) * 100);
    $('header-x').value = hx; $('v-header-x').value = hx;
    const hy = Math.round((s.header.y || 0.05) * 100);
    $('header-y').value = hy; $('v-header-y').value = hy;
    $('header-bleed').checked = s.header.bleed === true;
    $('theme-dark').checked = s.theme.mode === 'dark';

    renderPillList();

    syncStylePanel();

    renderPhoneTabs();
    syncDeviceControls();

    $('font-display').value = s.fonts.display;
    $('font-body').value = s.fonts.body;
    updateFontPreview();

    // Panorama tone sliders + per-screen anchors (project-level)
    $('pano-hue').value = panorama.hue || 0; $('v-pano-hue').textContent = `${panorama.hue || 0}°`;
    $('pano-tone').value = panorama.light || 0; $('v-pano-tone').textContent = `${panorama.light || 0}`;
    $('pano-vibrancy').value = panorama.sat != null ? panorama.sat : 100; $('v-pano-vib').textContent = `${panorama.sat != null ? panorama.sat : 100}%`;
    if (panorama.enabled) { syncPanoramaAnchors(); renderPanoStops(); updatePanoPreview(); }

    $('ai-brief').value = s.screenNote || '';
  }

  // Per-screen list of phone mockups (each has its own screenshot)
  function renderPhoneTabs() {
    const wrap = $('phone-tabs');
    if (!wrap) return;
    const s = screen();
    wrap.innerHTML = '';
    s.phones.forEach((p, i) => {
      const chip = document.createElement('div');
      chip.className = `phone-tab${i === s.activePhone ? ' active' : ''}`;
      chip.innerHTML = `<span>Phone ${i + 1}${p.screenshot ? ' •' : ''}</span>`;
      if (s.phones.length > 1) {
        const x = document.createElement('span');
        x.className = 'pt-close'; x.textContent = '×';
        x.addEventListener('click', (e) => { e.stopPropagation(); removePhone(i); });
        chip.appendChild(x);
      }
      chip.addEventListener('click', () => { s.activePhone = i; renderPhoneTabs(); syncDeviceControls(); });
      wrap.appendChild(chip);
    });
  }
  function removePhone(i) {
    const s = screen();
    if (s.phones.length <= 1) return;
    s.phones.splice(i, 1);
    if (s.activePhone >= s.phones.length) s.activePhone = s.phones.length - 1;
    renderPhoneTabs(); syncDeviceControls(); requestRender(); if (showNeighbors) renderNeighbors();
  }
  function syncDeviceControls() {
    const p = activePhone();
    if (!p) {
      $('phone-show').checked = false;
      $('upload-zone').classList.remove('has-img');
      $('upload-zone').querySelector('span').textContent = 'No mockup here — drop a screen / click to add';
      return;
    }
    $('phone-show').checked = p.show !== false;
    $('phone-bleed').checked = p.bleed !== false;
    $('phone-scale').value = p.scale; $('v-scale').value = p.scale;
    $('phone-x').value = p.x; $('v-x').value = p.x;
    $('phone-y').value = p.y; $('v-y').value = p.y;
    $('phone-rotation').value = p.rotation; $('v-rot').value = p.rotation;
    $('v-z').textContent = p.z || 0;
    $('phone-shadow').checked = p.shadow !== false;
    $('shadow-intensity').value = p.shadowIntensity; $('v-shadow').textContent = `${p.shadowIntensity}%`;
    $('shadow-blur').value = p.shadowBlur; $('v-blur').textContent = p.shadowBlur;
    const hasImg = !!p.screenshot;
    $('upload-zone').classList.toggle('has-img', hasImg);
    $('upload-zone').querySelector('span').textContent = hasImg ? 'Screenshot loaded · click to replace' : 'Drop screen here · or click';
  }

  function headlineWords() {
    const words = [];
    screen().header.headline.lines.forEach((l) => String(l.text || '').split(/\s+/).filter(Boolean).forEach((w) => { if (!words.includes(w)) words.push(w); }));
    return words;
  }
  function defaultUnderlineWord() {
    const lines = screen().header.headline.lines;
    const accentLine = lines.find((l) => l.accent) || lines[lines.length - 1] || lines[0];
    const words = String((accentLine && accentLine.text) || '').split(/\s+/).filter(Boolean);
    return words[0] || (headlineWords()[0] || '');
  }
  function populateAccentWords() {
    const sel = $('accent-word');
    if (!sel) return;
    const ab = screen().header.accentBar;
    const words = headlineWords();
    sel.innerHTML = '';
    words.forEach((w) => sel.add(new Option(w, w)));
    if (ab.word && words.includes(ab.word)) sel.value = ab.word;
  }

  function renderHeadlineLines() {
    const wrap = $('headline-lines');
    wrap.innerHTML = '';
    const lines = screen().header.headline.lines;
    lines.forEach((ln, i) => {
      const row = document.createElement('div');
      row.className = 'hl-line';
      const input = document.createElement('input');
      input.type = 'text'; input.className = 'input'; input.value = ln.text;
      input.addEventListener('input', () => { ln.text = input.value; populateAccentWords(); requestRender(); });
      const acc = document.createElement('button');
      acc.className = `hl-accent${ln.accent ? ' on' : ''}`; acc.textContent = 'A'; acc.title = 'Accent colour';
      acc.addEventListener('click', () => { ln.accent = !ln.accent; acc.classList.toggle('on', ln.accent); requestRender(); });
      const del = document.createElement('button');
      del.className = 'hl-del'; del.textContent = '×';
      del.addEventListener('click', () => { lines.splice(i, 1); renderHeadlineLines(); requestRender(); });
      row.append(input, acc, del);
      wrap.appendChild(row);
    });
  }

  // Move a pill within the draw order (array order = z; later = on top).
  function movePill(p, dir) {
    const arr = screen().pills;
    const i = arr.indexOf(p);
    if (i < 0) return;
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    arr.splice(i, 1); arr.splice(j, 0, p);
    renderPillList(); requestRender();
  }

  function renderPillList() {
    const wrap = $('pill-list');
    wrap.innerHTML = '';
    screen().pills.forEach((p) => {
      const row = document.createElement('div');
      row.className = `pill-row${p.id === selectedPillId ? ' sel' : ''}${p.kind === 'rating' ? ' rating-row' : ''}`;
      if (p.kind === 'rating') {
        row.innerHTML = `
          <div class="pr-top">
            <input class="input pr-emoji" value="${p.stars}" type="number" min="1" max="5" title="Stars">
            <input class="input pr-title" value="${escapeAttr(p.label)}" placeholder="Rating label">
            <button class="pr-del" title="Delete">×</button>
          </div>
          <div class="pr-meta">
            <label class="pr-mini">Size <input type="range" class="pr-scale" min="55" max="190" value="${Math.round((p.scale || 1) * 100)}"></label>
            <button class="pr-lz" data-d="1" title="Bring forward">▲</button>
            <button class="pr-lz" data-d="-1" title="Send back">▼</button>
            <label class="pr-mini"><input type="checkbox" class="pr-bleed"${p.bleed ? ' checked' : ''}> Bleed</label>
          </div>`;
        row.querySelector('.pr-emoji').addEventListener('input', (e) => { p.stars = Math.max(1, Math.min(5, +e.target.value || 5)); requestRender(); });
        row.querySelector('.pr-title').addEventListener('input', (e) => { p.label = e.target.value; requestRender(); });
      } else {
        row.innerHTML = `
          <div class="pr-top">
            <input class="input pr-emoji" value="${escapeAttr(p.emoji)}" title="Emoji">
            <input class="input pr-title" value="${escapeAttr(p.title)}" placeholder="Title">
            <button class="pr-save${isInLibrary(p) ? ' saved' : ''}" title="Save to library">${isInLibrary(p) ? '★' : '☆'}</button>
            <button class="pr-del" title="Delete">×</button>
          </div>
          <input class="input pr-sub" value="${escapeAttr(p.subtitle)}" placeholder="Subtitle (optional)">
          <div class="pr-meta">
            <select class="pr-style">
              ${['solid', 'glass', 'tint'].map((st) => `<option value="${st}"${p.style === st ? ' selected' : ''}>${st}</option>`).join('')}
            </select>
            <select class="pr-rot"></select>
          </div>
          <div class="pr-meta">
            <label class="pr-mini">Size <input type="range" class="pr-scale" min="55" max="190" value="${Math.round((p.scale || 1) * 100)}"></label>
            <button class="pr-lz" data-d="1" title="Bring forward">▲</button>
            <button class="pr-lz" data-d="-1" title="Send back">▼</button>
            <label class="pr-mini"><input type="checkbox" class="pr-bleed"${p.bleed ? ' checked' : ''}> Bleed</label>
          </div>`;
        const saveBtn = row.querySelector('.pr-save');
        const refreshSave = () => { const inLib = isInLibrary(p); saveBtn.classList.toggle('saved', inLib); saveBtn.textContent = inLib ? '★' : '☆'; };
        saveBtn.addEventListener('click', () => { const n = addToLibrary([p]); refreshSave(); renderLibrary(); toast(n ? 'Saved to library' : 'Already saved'); });
        const emojiInput = row.querySelector('.pr-emoji');
        emojiInput.title = 'Click to pick an emoji, or type one';
        emojiInput.addEventListener('input', (e) => { p.emoji = e.target.value; refreshSave(); requestRender(); });
        emojiInput.addEventListener('click', () => openEmojiPicker(emojiInput, (em) => { p.emoji = em; emojiInput.value = em; refreshSave(); requestRender(); }));
        row.querySelector('.pr-title').addEventListener('input', (e) => { p.title = e.target.value; refreshSave(); requestRender(); });
        row.querySelector('.pr-sub').addEventListener('input', (e) => { p.subtitle = e.target.value; requestRender(); });
        row.querySelector('.pr-style').addEventListener('change', (e) => { p.style = e.target.value; requestRender(); });
        const rot = row.querySelector('.pr-rot');
        for (let r = -10; r <= 10; r += 2) rot.add(new Option(`${r}°`, r, false, p.rotation === r));
        rot.addEventListener('change', (e) => { p.rotation = +e.target.value; requestRender(); });
      }
      // Precise position entry + copy/paste, appended to every pill row.
      const posRow = document.createElement('div');
      posRow.className = 'pr-meta';
      posRow.innerHTML = `
        <label class="pr-mini">X <input type="number" class="pr-num pr-x" value="${Math.round((p.x != null ? p.x : 0.5) * 100)}" min="-60" max="160">%</label>
        <label class="pr-mini">Y <input type="number" class="pr-num pr-y" value="${Math.round((p.y != null ? p.y : 0.5) * 100)}" min="-60" max="160">%</label>
        <label class="pr-mini">⟲ <input type="number" class="pr-num pr-rotn" value="${p.rotation || 0}" min="-45" max="45">°</label>
        <button class="pr-cp" title="Copy position">⧉</button>
        <button class="pr-pp" title="Paste position">⤵</button>`;
      row.appendChild(posRow);
      posRow.querySelector('.pr-x').addEventListener('input', (e) => { p.x = (+e.target.value) / 100; requestRender(); if (showNeighbors) renderNeighbors(); });
      posRow.querySelector('.pr-y').addEventListener('input', (e) => { p.y = (+e.target.value) / 100; requestRender(); if (showNeighbors) renderNeighbors(); });
      posRow.querySelector('.pr-rotn').addEventListener('input', (e) => { p.rotation = +e.target.value || 0; requestRender(); if (showNeighbors) renderNeighbors(); });
      posRow.querySelector('.pr-cp').addEventListener('click', () => setPosClip(p.x != null ? p.x : 0.5, p.y != null ? p.y : 0.5, p.rotation || 0));
      posRow.querySelector('.pr-pp').addEventListener('click', () => { if (!needPosClip()) return; p.x = posClipboard.x; p.y = posClipboard.y; if (posClipboard.rotation != null) p.rotation = posClipboard.rotation; renderPillList(); requestRender(); if (showNeighbors) renderNeighbors(); });
      const scaleEl = row.querySelector('.pr-scale');
      if (scaleEl) scaleEl.addEventListener('input', (e) => { p.scale = (+e.target.value) / 100; requestRender(); });
      row.querySelectorAll('.pr-lz').forEach((b) => b.addEventListener('click', () => movePill(p, +b.dataset.d)));
      const bleedEl = row.querySelector('.pr-bleed');
      if (bleedEl) bleedEl.addEventListener('change', (e) => { p.bleed = e.target.checked; });
      row.querySelector('.pr-del').addEventListener('click', () => {
        screen().pills = screen().pills.filter((x) => x.id !== p.id);
        if (selectedPillId === p.id) selectedPillId = null;
        renderPillList(); requestRender();
      });
      row.addEventListener('click', (e) => {
        if (e.target.closest('input,select,button')) return;
        selectedPillId = p.id; renderPillList(); requestRender();
      });
      wrap.appendChild(row);
    });
  }

  function syncStylePanel() {
    const bg = screen().background;
    const type = bg.type || 'gradient';
    document.querySelectorAll('#bg-type-seg .seg-btn').forEach((x) => x.classList.toggle('active', x.dataset.bg === type));
    $('bg-gradient-controls').classList.toggle('hidden', type !== 'gradient');
    $('bg-solid-controls').classList.toggle('hidden', type !== 'solid');
    $('grad-angle').value = bg.angle || 165;
    $('solid-color').value = bg.color || '#EDE6FB';
    $('bg-glow').checked = bg.glow !== false;
    renderGradStops();
    // active palette highlight
    document.querySelectorAll('.pal-swatch').forEach((sw) => sw.classList.toggle('active', sw.dataset.pal === screen()._paletteId));
  }

  function renderGradStops() {
    const wrap = $('grad-stops');
    wrap.innerHTML = '';
    const bg = screen().background;
    if (bg.type !== 'gradient') return;
    bg.colors = bg.colors || ['#EDE6FB', '#FBE6DD'];
    bg.colors.forEach((c, i) => {
      const row = document.createElement('div');
      row.className = 'grad-stop';
      row.innerHTML = `<input type="color" value="${c}"><span class="gs-hex">${c}</span><button class="gs-del" title="Remove">×</button>`;
      row.querySelector('input').addEventListener('input', (e) => { bg.colors[i] = e.target.value; row.querySelector('.gs-hex').textContent = e.target.value; requestRender(); });
      row.querySelector('.gs-del').addEventListener('click', () => { if (bg.colors.length <= 2) return; bg.colors.splice(i, 1); bg.stops = null; renderGradStops(); requestRender(); });
      wrap.appendChild(row);
    });
    const add = document.createElement('button');
    add.className = 'btn ghost sm'; add.textContent = '+ Colour';
    add.addEventListener('click', () => { bg.colors.push('#ffffff'); bg.stops = null; renderGradStops(); requestRender(); });
    wrap.appendChild(add);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Palette + gradient presets + fonts
  // ──────────────────────────────────────────────────────────────────────────
  function initPaletteGrid() {
    const grid = $('palette-grid');
    grid.innerHTML = '';
    brand.palettes.forEach((pal) => {
      const sw = document.createElement('div');
      sw.className = 'pal-swatch'; sw.dataset.pal = pal.id;
      const cols = pal.bg.colors || ['#888'];
      sw.style.background = `linear-gradient(135deg,${cols.join(',')})`;
      sw.innerHTML = `<span>${pal.name}</span>`;
      sw.addEventListener('click', () => applyPalette(pal.id));
      grid.appendChild(sw);
    });
  }

  function applyPalette(id, s = screen()) {
    const key = String(id || '').toLowerCase().trim();
    const pal = brand.palettes.find((p) => p.id === key || p.name.toLowerCase() === key);
    if (!pal) return;
    s._paletteId = pal.id;
    s.background = { ...JSON.parse(JSON.stringify(pal.bg)), glow: s.background.glow !== false };
    s.theme = themeFor(pal.theme, pal.accent, pal.accent2);
    if (s === screen()) { syncStylePanel(); $('theme-dark').checked = pal.theme === 'dark'; requestRender(); }
  }

  function initGradientPresets() {
    const wrap = $('grad-presets');
    wrap.innerHTML = '';
    Object.entries(brand.gradients).forEach(([key, g]) => {
      if (!g.colors) return;
      const el = document.createElement('div');
      el.className = 'gp';
      el.title = key;
      el.style.background = `linear-gradient(${(g.angle || 165)}deg,${g.colors.join(',')})`;
      el.addEventListener('click', () => {
        const bg = screen().background;
        bg.type = 'gradient'; bg.colors = [...g.colors]; bg.stops = g.stops ? [...g.stops] : null; bg.angle = g.angle || 165;
        document.querySelectorAll('#bg-type-seg .seg-btn').forEach((x) => x.classList.toggle('active', x.dataset.bg === 'gradient'));
        $('bg-gradient-controls').classList.remove('hidden'); $('bg-solid-controls').classList.add('hidden');
        renderGradStops(); $('grad-angle').value = bg.angle; requestRender();
      });
      wrap.appendChild(el);
    });
  }

  function initFontSelects() {
    ['font-display', 'font-body'].forEach((id) => {
      const sel = $(id); sel.innerHTML = '';
      FONTS.forEach((f) => sel.add(new Option(f, f)));
    });
  }

  function updateFontPreview() {
    const s = screen();
    const d = $('font-preview').querySelector('.fp-display');
    const b = $('font-preview').querySelector('.fp-body');
    d.style.fontFamily = `"${s.fonts.display}"`;
    b.style.fontFamily = `"${s.fonts.body}"`;
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Upload
  // ──────────────────────────────────────────────────────────────────────────
  function setupUpload() {
    const zone = $('upload-zone'), input = $('upload-input');
    zone.addEventListener('click', () => input.click());
    input.addEventListener('change', () => { if (input.files[0]) loadShot(input.files[0]); });
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('over'));
    zone.addEventListener('drop', (e) => { e.preventDefault(); zone.classList.remove('over'); const f = e.dataTransfer.files[0]; if (f) loadShot(f); });
  }
  function loadShot(file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let p = activePhone();
        if (!p) { p = defaultPhone(); screen().phones.push(p); screen().activePhone = screen().phones.length - 1; }
        p.screenshot = img;
        syncDeviceControls(); renderPhoneTabs(); requestRender(); if (showNeighbors) renderNeighbors();
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // AI actions (Kimi)
  // ──────────────────────────────────────────────────────────────────────────
  // Downscaled JPEG of a screenshot on this screen to attach to Kimi (vision).
  function screenshotDataURL(maxW = 820) {
    const ap = activePhone();
    const img = (ap && ap.screenshot) || (screen().phones.find((p) => p.screenshot) || {}).screenshot;
    if (!img) return null;
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) return null;
    const scale = Math.min(1, maxW / iw);
    const w = Math.max(1, Math.round(iw * scale)), h = Math.max(1, Math.round(ih * scale));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    try { return c.toDataURL('image/jpeg', 0.82); } catch { return null; }
  }

  function aiBusy(on, text) {
    $('ai-status').classList.toggle('hidden', !on);
    $('ai-error').classList.add('hidden');
    if (text) $('ai-status-text').textContent = text;
    document.querySelectorAll('.ai-btn').forEach((b) => (b.disabled = on));
  }
  function aiFail(e) { aiBusy(false); const el = $('ai-error'); el.textContent = e.message || String(e); el.classList.remove('hidden'); toast('Kimi error', true); }

  async function aiAutoDesign() {
    const image = screenshotDataURL();
    if (!image) { aiFail(new Error('Upload a screenshot first (Device tab → Screenshot) so Kimi can design from it.')); return; }
    aiBusy(true, 'Reading screenshot & designing…');
    try {
      const note = $('ai-brief').value || screen().screenNote;
      const layout = ($('ai-layout') && $('ai-layout').value) || 'auto';
      const out = await Kimi.autoDesign({ screenNote: note, image, paletteIds: brand.palettes.map((p) => p.id), layout });
      const h = screen().header;
      if (out.eyebrow) { h.eyebrow.text = out.eyebrow; h.eyebrow.show = true; }
      if (out.headline.length) h.headline.lines = out.headline;
      if (out.subtitle) { h.subtitle.text = out.subtitle; h.subtitle.show = true; }
      if (out.palette) applyPalette(out.palette);
      // Apply the recommended phone layout (1–2 phones), all sharing the upload.
      const shot = activePhone().screenshot;
      screen().phones = out.phones.map((pp, i) => defaultPhone({ scale: pp.scale, x: pp.x, y: pp.y, rotation: pp.rotation, z: i, screenshot: shot }));
      screen().activePhone = 0;
      const rating = screen().pills.find((p) => p.kind === 'rating');
      screen().pills = out.pills.map((p, i) => {
        const pill = makePill(p, i);
        pill.x = p.x; pill.y = p.y; pill.rotation = p.rotation; pill.style = p.style;
        return pill;
      });
      if (rating) screen().pills.push(rating);
      addToLibrary(out.pills);
      aiBusy(false); syncAllPanels(); renderLibrary(); requestRender(); if (showNeighbors) renderNeighbors();
      toast('Kimi designed the screen ✨');
    } catch (e) { aiFail(e); }
  }

  // Strategic text set (Text panel) — marketing-grade, blueprint + screenshot aware.
  async function aiTextSet() {
    const image = screenshotDataURL();
    toast(image ? 'Kimi is reading the screen & writing…' : 'Kimi is writing a strategic text set…');
    aiBusy(true, image ? 'Reading screenshot & writing…' : 'Writing a strategic text set…');
    try {
      const note = $('ai-brief').value || screen().screenNote;
      const out = await Kimi.copy({ screenNote: note, image });
      const h = screen().header;
      if (out.eyebrow) { h.eyebrow.text = out.eyebrow; h.eyebrow.show = true; }
      if (out.headline.length) h.headline.lines = out.headline;
      if (out.subtitle) { h.subtitle.text = out.subtitle; h.subtitle.show = true; }
      addTextSets([{ eyebrow: out.eyebrow, headline: out.headline, subtitle: out.subtitle }]);
      renderTextSetSelect();
      aiBusy(false); syncAllPanels(); requestRender();
      toast('Strategic text set written ✨ (also saved to your library)');
    } catch (e) { aiFail(e); }
  }

  async function aiCopy() {
    const image = screenshotDataURL();
    aiBusy(true, image ? 'Reading screenshot…' : 'Writing copy…');
    try {
      const note = $('ai-brief').value || screen().screenNote;
      const out = await Kimi.copy({ screenNote: note, image });
      const h = screen().header;
      if (out.eyebrow) { h.eyebrow.text = out.eyebrow; h.eyebrow.show = true; }
      if (out.headline && out.headline.length) h.headline.lines = out.headline;
      if (out.subtitle) { h.subtitle.text = out.subtitle; h.subtitle.show = true; }
      aiBusy(false); syncAllPanels(); requestRender(); toast('Copy updated');
    } catch (e) { aiFail(e); }
  }

  async function aiPills() {
    const image = screenshotDataURL();
    aiBusy(true, image ? 'Reading screenshot…' : 'Designing pills…');
    try {
      const note = $('ai-brief').value || screen().screenNote;
      const headline = screen().header.headline.lines.map((l) => l.text).join(' ');
      const generated = await Kimi.pills({ screenNote: note, headline, count: 5, avoid: avoidTitles(), image });
      const rating = screen().pills.find((p) => p.kind === 'rating');
      screen().pills = generated.map((p, i) => makePill(p, i));
      if (rating) screen().pills.push(rating);
      arrangePills(screen());
      const saved = addToLibrary(generated);
      aiBusy(false); renderPillList(); renderLibrary(); requestRender();
      toast(`Added ${generated.length} pills${saved ? ` · ${saved} new saved` : ''}`);
    } catch (e) { aiFail(e); }
  }

  async function aiFonts() {
    aiBusy(true, 'Pairing fonts…');
    try {
      const out = await Kimi.fonts({ vibe: 'calm, premium, friendly budgeting app', available: FONTS });
      screen().fonts.display = out.display; screen().fonts.body = out.body;
      aiBusy(false); $('font-display').value = out.display; $('font-body').value = out.body; updateFontPreview(); requestRender();
      toast(out.reason ? `Fonts: ${out.display} + ${out.body}` : 'Fonts updated');
    } catch (e) { aiFail(e); }
  }

  async function aiSet() {
    const count = Math.max(2, Math.min(10, +$('ai-set-count').value || 5));
    aiBusy(true, `Generating ${count} screens…`);
    try {
      const paletteIds = brand.palettes.map((p) => p.id);
      const out = await Kimi.screenSet({ brief: $('ai-brief').value, count, paletteIds, avoid: avoidTitles(), onProgress: (m) => { $('ai-status-text').textContent = m; } });
      if (!out.length) throw new Error('No screens returned');
      out.forEach((sc) => addToLibrary(sc.pills || []));
      screens = out.map((sc) => {
        const def = {
          name: sc.name, eyebrow: sc.eyebrow, theme: 'light',
          bg: brand.gradients.lavender, headline: sc.headline, subtitle: sc.subtitle,
          screenNote: sc.screenNote, pills: sc.pills,
        };
        const built = buildScreen(def);
        if (sc.palette) applyPalette(sc.palette, built);
        return built;
      });
      activeIndex = 0; selectedPillId = null;
      aiBusy(false); renderScreenTabs(); syncAllPanels(); renderLibrary(); requestRender(); toast(`Generated ${screens.length} screens`);
    } catch (e) { aiFail(e); }
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Export
  // ──────────────────────────────────────────────────────────────────────────
  function renderToBlob(index) {
    const off = document.createElement('canvas');
    const [w, h] = DEVICE_RES[device];
    off.width = w; off.height = h;
    renderScreenTo(off, index);
    return new Promise((res) => off.toBlob((b) => res(b), 'image/png'));
  }

  async function exportCurrent() {
    await document.fonts.ready.catch(() => {});
    const blob = await renderToBlob(activeIndex);
    downloadBlob(blob, fileName(screen(), activeIndex));
    toast('Exported PNG');
  }

  async function exportAll() {
    await document.fonts.ready.catch(() => {});
    if (typeof JSZip === 'undefined') { toast('ZIP library missing', true); return; }
    toast('Rendering all screens…');
    const zip = new JSZip();
    for (let i = 0; i < screens.length; i++) {
      const blob = await renderToBlob(i);
      zip.file(fileName(screens[i], i), blob);
    }
    const out = await zip.generateAsync({ type: 'blob' });
    downloadBlob(out, `${brand.id}-${device}-screenshots.zip`);
    toast(`Exported ${screens.length} screens`);
  }

  function fileName(s, i) {
    const safe = (s.name || 'screen').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return `${brand.id}-${device}-${String(i + 1).padStart(2, '0')}-${safe}.png`;
  }
  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Save / discard draft — stored in IndexedDB (no localStorage size limit)
  // ──────────────────────────────────────────────────────────────────────────
  const draftKey = () => `draft:${brand.id}`;
  function idbOpen() {
    return new Promise((res, rej) => {
      const r = indexedDB.open('shotsmith', 1);
      r.onupgradeneeded = () => { if (!r.result.objectStoreNames.contains('drafts')) r.result.createObjectStore('drafts'); };
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  }
  async function idbPut(key, val) { const db = await idbOpen(); return new Promise((res, rej) => { const tx = db.transaction('drafts', 'readwrite'); tx.objectStore('drafts').put(val, key); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); }
  async function idbGet(key) { const db = await idbOpen(); return new Promise((res, rej) => { const tx = db.transaction('drafts', 'readonly'); const rq = tx.objectStore('drafts').get(key); rq.onsuccess = () => res(rq.result); rq.onerror = () => rej(rq.error); }); }
  async function idbDel(key) { const db = await idbOpen(); return new Promise((res, rej) => { const tx = db.transaction('drafts', 'readwrite'); tx.objectStore('drafts').delete(key); tx.oncomplete = () => res(); tx.onerror = () => rej(tx.error); }); }

  const _imgUrlCache = new WeakMap(); // avoid re-encoding the same screenshot repeatedly
  function imageToDataURL(img, maxW) {
    if (!img) return null;
    const cached = _imgUrlCache.get(img);
    if (cached && cached.maxW === maxW) return cached.url;
    const iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height;
    if (!iw || !ih) return null;
    const scale = Math.min(1, maxW / iw);
    const w = Math.max(1, Math.round(iw * scale)), h = Math.max(1, Math.round(ih * scale));
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.getContext('2d').drawImage(img, 0, 0, w, h);
    let url = null;
    try { url = c.toDataURL('image/png'); } catch { return null; }
    _imgUrlCache.set(img, { maxW, url });
    return url;
  }
  function serializeScreenForSave(s) {
    const phones = s.phones.map((p) => {
      const { screenshot, ...rest } = p;
      return { ...rest, shot: screenshot ? imageToDataURL(screenshot, 2000) : null }; // near-original, IndexedDB has room
    });
    return JSON.parse(JSON.stringify({
      id: s.id, name: s.name, screenNote: s.screenNote, theme: s.theme, fonts: s.fonts,
      background: s.background, header: s.header, pills: s.pills, activePhone: s.activePhone || 0,
      _paletteId: s._paletteId, phones,
    }));
  }
  function serializeProject() {
    return { v: 1, device, panorama, activeIndex, screens: screens.map(serializeScreenForSave) };
  }
  function deserializeScreen(s) {
    s.activePhone = s.activePhone || 0;
    s.phones = (s.phones || [defaultPhone()]).map((p) => {
      const shot = p.shot; const phone = { ...p }; delete phone.shot; phone.screenshot = null;
      if (shot) { const img = new Image(); img.onload = () => requestRender(); img.src = shot; phone.screenshot = img; }
      return phone;
    });
    return s;
  }
  function restoreProject(proj) {
    device = proj.device || 'iphone';
    if (proj.panorama) panorama = proj.panorama;
    screens = (proj.screens || []).map(deserializeScreen);
    if (!screens.length) screens = brand.screens.map(buildScreen);
    activeIndex = Math.max(0, Math.min(proj.activeIndex || 0, screens.length - 1));
    selectedPillId = null;
  }
  // Re-sync the whole UI after device/screens/panorama were swapped wholesale.
  function refreshAfterProjectChange() {
    setDevice(device, true);
    renderScreenTabs(); syncAllPanels();
    $('pano-enable').checked = panorama.enabled; $('pano-controls').classList.toggle('hidden', !panorama.enabled);
    renderPanoPresets(); renderPanoStops(); updatePanoPreview();
    requestRender(); if (showNeighbors) renderNeighbors();
  }

  // ── File backup / restore (durable — survives storage clears) ──────────────
  function exportProjectFile() {
    try {
      const blob = new Blob([JSON.stringify(serializeProject())], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      const stamp = new Date().toISOString().slice(0, 16).replace(/[:T]/g, '-');
      a.download = `shotsmith-${brand.id}-${stamp}.json`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      toast('Backup downloaded ✓');
    } catch (e) { console.error(e); toast('Could not export file', true); }
  }
  function importProjectFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        let data = JSON.parse(reader.result);
        // Accept either a project, or a full recover.html dump (pick the biggest project).
        if (data && Array.isArray(data.entries)) {
          const projects = data.entries.map((e) => e.value).filter((v) => v && Array.isArray(v.screens));
          projects.sort((a, b) => JSON.stringify(b).length - JSON.stringify(a).length);
          data = projects[0];
        }
        if (!data || !Array.isArray(data.screens) || !data.screens.length) { toast('That file has no project in it', true); return; }
        restoreProject(data); refreshAfterProjectChange(); resetHistory();
        closeDraftsMenu(); toast('Project imported ✓');
      } catch (e) { console.error(e); toast('Could not read that file', true); }
    };
    reader.onerror = () => toast('Could not read that file', true);
    reader.readAsText(file);
  }

  // ── Named drafts (multiple, in IndexedDB) ──────────────────────────────────
  const draftListKey = () => `list:${brand.id}`;
  const draftDataKey = (id) => `data:${brand.id}:${id}`;
  async function getDraftList() { try { return (await idbGet(draftListKey())) || []; } catch { return []; } }
  async function saveDraft() {
    const list = await getDraftList();
    const name = prompt('Name this draft', `Draft ${list.length + 1}`);
    if (name === null) return;
    toast('Saving…');
    const id = Date.now().toString(36);
    try {
      await idbPut(draftDataKey(id), serializeProject());
      list.unshift({ id, name: (name.trim() || `Draft ${list.length + 1}`).slice(0, 40), savedAt: Date.now(), screens: screens.length });
      await idbPut(draftListKey(), list);
      toast('Draft saved ✓');
    } catch { toast('Could not save draft', true); }
  }
  async function openDraft(id) {
    try {
      const proj = await idbGet(draftDataKey(id));
      if (proj) { restoreProject(proj); refreshAfterProjectChange(); resetHistory(); toast('Draft opened'); }
    } catch { toast('Could not open draft', true); }
    closeDraftsMenu();
  }
  async function deleteDraft(id) {
    try { await idbDel(draftDataKey(id)); const list = (await getDraftList()).filter((d) => d.id !== id); await idbPut(draftListKey(), list); renderDraftsMenu(); }
    catch {}
  }
  async function renderDraftsMenu() {
    const wrap = $('drafts-list'); if (!wrap) return;
    const list = await getDraftList();
    wrap.innerHTML = '';
    if (!list.length) { wrap.innerHTML = '<p class="muted tiny" style="padding:8px 0">No saved drafts yet. Hit Save to store your work — screenshots included.</p>'; return; }
    list.forEach((d) => {
      const row = document.createElement('div'); row.className = 'draft-item';
      row.innerHTML = `<div class="di-info"><b>${escapeHtml(d.name)}</b><span>${new Date(d.savedAt).toLocaleString()} · ${d.screens || '?'} screens</span></div><div class="di-actions"><button class="btn sm primary di-open">Open</button><button class="btn sm ghost di-del">Delete</button></div>`;
      row.querySelector('.di-open').addEventListener('click', () => openDraft(d.id));
      row.querySelector('.di-del').addEventListener('click', () => { if (confirm(`Delete draft "${d.name}"?`)) deleteDraft(d.id); });
      wrap.appendChild(row);
    });
  }
  function openDraftsMenu() { renderDraftsMenu(); $('drafts-overlay').classList.remove('hidden'); }
  function closeDraftsMenu() { $('drafts-overlay').classList.add('hidden'); }

  // ── History (undo / redo) ──────────────────────────────────────────────────
  let history = []; let histIndex = -1; let histTimer = null; let lastHistSig = '';
  function cloneScreenKeepImages(s) {
    const imgs = (s.phones || []).map((p) => p.screenshot);
    const clone = JSON.parse(JSON.stringify({ ...s, phones: (s.phones || []).map((p) => ({ ...p, screenshot: null })) }));
    clone.phones.forEach((p, i) => { p.screenshot = imgs[i] || null; });
    return clone;
  }
  function projectSnapshot() { return { device, panorama: JSON.parse(JSON.stringify(panorama)), activeIndex, screens: screens.map(cloneScreenKeepImages) }; }
  // Signature for change-detection — excludes activeIndex so navigation isn't an undo step.
  function historySig() { return JSON.stringify({ device, panorama, screens: screens.map((s) => ({ ...s, phones: (s.phones || []).map((p) => ({ ...p, screenshot: p.screenshot ? 1 : 0 })) })) }); }
  function scheduleHistory() { clearTimeout(histTimer); histTimer = setTimeout(() => commitHistory(false), 500); }
  function commitHistory(skipAuto) {
    const sig = historySig();
    if (sig === lastHistSig) return;
    lastHistSig = sig;
    history = history.slice(0, histIndex + 1);
    history.push(projectSnapshot());
    if (history.length > 80) history.shift();
    histIndex = history.length - 1;
    updateUndoRedo();
    if (!skipAuto) autoSave();
  }
  function resetHistory() { history = []; histIndex = -1; lastHistSig = ''; commitHistory(true); }
  function applySnapshot(snap) {
    device = snap.device; panorama = JSON.parse(JSON.stringify(snap.panorama));
    screens = snap.screens.map(cloneScreenKeepImages);
    activeIndex = Math.min(Math.max(0, snap.activeIndex), screens.length - 1);
    selectedPillId = null;
    refreshAfterProjectChange();
    lastHistSig = historySig();
  }
  function undo() { if (histIndex > 0) { histIndex--; applySnapshot(history[histIndex]); updateUndoRedo(); } }
  function redo() { if (histIndex < history.length - 1) { histIndex++; applySnapshot(history[histIndex]); updateUndoRedo(); } }
  function updateUndoRedo() { const u = $('btn-undo'), r = $('btn-redo'); if (u) u.disabled = histIndex <= 0; if (r) r.disabled = histIndex >= history.length - 1; }

  // Auto-save the working session so nothing is lost (separate from named drafts)
  let autoTimer = null;
  let lastBackupTs = 0;
  function autoSave() {
    clearTimeout(autoTimer);
    autoTimer = setTimeout(async () => {
      const proj = serializeProject();
      try {
        // Keep a rolling backup so a single bad/interrupted write can't wipe everything.
        if (Date.now() - lastBackupTs > 20000) {
          const prev = await idbGet(`autosave:${brand.id}`).catch(() => null);
          if (prev) { await idbPut(`autosave-prev:${brand.id}`, prev).catch(() => {}); lastBackupTs = Date.now(); }
        }
        await idbPut(`autosave:${brand.id}`, proj);
      } catch (e) {
        console.error('autosave failed', e);
        toast('Auto-save failed (storage full?) — Export or Drafts → Save a draft now', true);
      }
    }, 1500);
  }
  async function maybeOfferAutosave() {
    try { const raw = await idbGet(`autosave:${brand.id}`); $('draft-banner').classList.toggle('hidden', !raw); }
    catch { $('draft-banner').classList.add('hidden'); }
  }

  // ── Keyboard shortcuts + selected-pill helpers ─────────────────────────────
  function selectedPill() { return screen().pills.find((p) => p.id === selectedPillId); }
  function deleteSelectedPill() { if (!selectedPillId) return; screen().pills = screen().pills.filter((p) => p.id !== selectedPillId); selectedPillId = null; renderPillList(); requestRender(); }
  function duplicateSelectedPill() {
    const p = selectedPill(); if (!p) return;
    const c = { ...p, id: nextId(), x: Math.min(0.96, (p.x || 0.5) + 0.04), y: Math.min(0.96, (p.y || 0.5) + 0.04) };
    const i = screen().pills.indexOf(p);
    screen().pills.splice(i + 1, 0, c); selectedPillId = c.id;
    renderPillList(); requestRender();
  }
  function nudgeSelectedPill(key, big) {
    const p = selectedPill(); if (!p) return;
    const step = big ? 0.02 : 0.005;
    if (key === 'ArrowLeft') p.x -= step;
    if (key === 'ArrowRight') p.x += step;
    if (key === 'ArrowUp') p.y -= step;
    if (key === 'ArrowDown') p.y += step;
    requestRender();
  }
  function setupKeyboard() {
    document.addEventListener('keydown', (e) => {
      if (!brand || !screens.length) return;
      const t = e.target;
      if (t && (t.matches('input,textarea,select') || t.isContentEditable)) { if (e.key === 'Escape') t.blur(); return; }
      const mod = e.metaKey || e.ctrlKey;
      const k = e.key.toLowerCase();
      if (mod && k === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
      if (mod && k === 'y') { e.preventDefault(); redo(); return; }
      if (mod && k === 's') { e.preventDefault(); saveDraft(); return; }
      if (mod && k === 'e') { e.preventDefault(); exportCurrent(); return; }
      if (mod && k === 'd') { e.preventDefault(); duplicateSelectedPill(); return; }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedPillId) { e.preventDefault(); deleteSelectedPill(); return; }
      if (e.key === 'Escape') {
        if (emojiPop) closeEmojiPicker();
        else if (!$('layouts-overlay').classList.contains('hidden')) closeLayoutsMenu();
        else if (!$('drafts-overlay').classList.contains('hidden')) closeDraftsMenu();
        else if (selectedPillId) { selectedPillId = null; renderPillList(); requestRender(); }
        return;
      }
      if (selectedPillId && e.key.indexOf('Arrow') === 0) { e.preventDefault(); nudgeSelectedPill(e.key, e.shiftKey); }
    });
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Misc
  // ──────────────────────────────────────────────────────────────────────────
  let toastTimer = null;
  function toast(msg, err) {
    const el = $('toast');
    el.textContent = msg; el.className = `toast${err ? ' err' : ''}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.add('hidden'), 2400);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c])); }
  function escapeAttr(s) { return String(s == null ? '' : s).replace(/"/g, '&quot;').replace(/</g, '&lt;'); }

  // ── Mockup-position presets (Layouts menu, with previews) ──────────────────
  function miniRoundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath(); ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  // Preview the WHOLE set: a strip of mini-screens (gap 0) with phones drawn at
  // global positions so spanning/bleeding phones flow across the seams.
  function drawSetPreview(cv, preset) {
    const ctx = cv.getContext('2d'); const W = cv.width, H = cv.height;
    const n = screens.length || 10;
    const slotW = W / n;
    const phoneAspect = Renderer.getPhoneAspectRatio(device);
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < n; i++) {
      const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#ece6fb'); g.addColorStop(1, '#f7e7ec');
      ctx.fillStyle = g; ctx.fillRect(i * slotW, 0, slotW, H);
      ctx.strokeStyle = 'rgba(0,0,0,0.07)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(i * slotW, 0); ctx.lineTo(i * slotW, H); ctx.stroke();
    }
    for (let i = 0; i < n; i++) {
      (preset.build(i, n) || []).forEach((pos) => {
        const pw = (pos.scale / 100) * slotW;
        const ph = pw / phoneAspect;
        ctx.save();
        ctx.translate(i * slotW + (pos.x / 100) * slotW, (pos.y / 100) * H);
        if (pos.rotation) ctx.rotate(pos.rotation * Math.PI / 180);
        miniRoundRect(ctx, -pw / 2, -ph / 2, pw, ph, pw * 0.16); ctx.fillStyle = '#20202a'; ctx.fill();
        miniRoundRect(ctx, -pw / 2 + pw * 0.08, -ph / 2 + pw * 0.08, pw - pw * 0.16, ph - pw * 0.16, pw * 0.1); ctx.fillStyle = '#cdbff0'; ctx.fill();
        ctx.restore();
      });
    }
  }
  function renderLayoutsMenu() {
    const grid = $('layouts-grid'); if (!grid) return;
    const n = screens.length || 10;
    const aspect = DEVICE_RES[device][0] / DEVICE_RES[device][1];
    const slotW = 52;
    grid.innerHTML = '';
    MOCKUP_PRESETS.forEach((p) => {
      const card = document.createElement('div'); card.className = 'set-card'; card.title = `Apply "${p.name}" across all ${n} screens`;
      const cv = document.createElement('canvas');
      cv.width = n * slotW; cv.height = Math.round(slotW / aspect); cv.className = 'set-prev';
      drawSetPreview(cv, p);
      const info = document.createElement('div'); info.className = 'set-info';
      info.innerHTML = `<b>${escapeHtml(p.name)}</b><span>${escapeHtml(p.desc || '')}</span>`;
      card.append(cv, info);
      card.addEventListener('click', () => applyMockupPreset(p));
      grid.appendChild(card);
    });
  }
  function applyMockupPreset(preset) {
    screens.forEach((s, i) => {
      const shots = s.phones.map((p) => p.screenshot).filter(Boolean);
      s.phones = preset.build(i, screens.length).map((pos, k) => defaultPhone({ scale: pos.scale, x: pos.x, y: pos.y, rotation: pos.rotation || 0, z: k, screenshot: shots[k] || shots[0] || null }));
      s.activePhone = 0;
    });
    closeLayoutsMenu();
    renderScreenTabs(); syncAllPanels(); requestRender(); if (showNeighbors) renderNeighbors();
    toast(`Applied "${preset.name}" to all ${screens.length} screens`);
  }
  function openLayoutsMenu() { renderLayoutsMenu(); $('layouts-overlay').classList.remove('hidden'); }
  function closeLayoutsMenu() { $('layouts-overlay').classList.add('hidden'); }

  // ──────────────────────────────────────────────────────────────────────────
  // Boot
  // ──────────────────────────────────────────────────────────────────────────
  function boot() {
    try { if (localStorage.getItem('shotsmith:uitheme') === 'light') document.body.classList.add('light'); } catch {}
    initBrandPicker();
    setupCanvasInteraction();
    setupKeyboard();
    // Dev affordance: ?dev=1 auto-selects the first brand for headless rendering.
    // Optional &screen=N (1-based) and &device=android jump to a specific view.
    const params = new URLSearchParams(location.search);
    if (params.get('recover') === '1') {
      const first = Object.values(window.BRANDS || {})[0];
      if (first) chooseBrand(first).then(async () => {
        try {
          const proj = await idbGet('recover:latest');
          if (proj && Array.isArray(proj.screens) && proj.screens.length) {
            restoreProject(proj); refreshAfterProjectChange(); resetHistory();
            toast('Recovered your work ✓ — export it now, or Drafts → Save a draft');
          } else { toast('Nothing staged to recover', true); }
        } catch (e) { console.error('recover failed', e); toast('Recover failed — use the .json download instead', true); }
      });
      return;
    }
    if (params.get('dev') === '1') {
      const first = Object.values(window.BRANDS || {})[0];
      if (first) chooseBrand(first).then(() => {
        if (params.get('device') === 'android') setDevice('android');
        const n = parseInt(params.get('screen'), 10);
        if (n >= 1 && n <= screens.length) switchScreen(n - 1);
        const panel = params.get('panel');
        if (panel) { const t = document.querySelector(`.ptab[data-tab="${panel}"]`); if (t) t.click(); }
        if (params.get('bleed')) { const b = document.querySelector(`[data-bleed="${params.get('bleed')}"]`); if (b) b.click(); }
        if (params.get('neighbors') === '1') { const c = $('show-neighbors'); c.checked = true; c.dispatchEvent(new Event('change')); }
        if (params.get('addphone') === '1') $('btn-add-phone').click();
        if (params.get('pano') === '1') { const c = $('pano-enable'); c.checked = true; c.dispatchEvent(new Event('change')); }
        if (params.get('light') === '1') $('btn-theme').click();
        if (params.get('layouts') === '1') openLayoutsMenu();
        if (params.get('textbleed') === '1') { screen().header.headline.size = 200; const cb = $('header-bleed'); cb.checked = true; cb.dispatchEvent(new Event('change')); }
        if (params.get('guidetest')) { dragGuides = { vx: parseFloat(params.get('guidetest')), hy: null }; renderScreenTo(canvas, activeIndex, { guides: dragGuides }); }
        if (params.get('loadtest')) { fetch('/recovered-project.json').then((r) => r.json()).then((p) => { restoreProject(p); refreshAfterProjectChange(); resetHistory(); toast('Rebuilt project loaded — re-upload screenshots, then save'); }); }
        if (params.get('emoji')) { setTimeout(() => { openEmojiPicker($('panel-pills') || document.body, () => {}); const q = params.get('emoji'); if (q !== '1' && emojiPop) { const s = emojiPop.querySelector('.ep-search'); s.value = q; s.dispatchEvent(new Event('input')); } }, 150); }
        if (params.get('nobleed')) { const s0 = screens[0]; const ph = s0.phones[0]; ph.x = 96; ph.scale = 62; ph.bleed = (params.get('nobleed') === 'on'); switchScreen(1); requestRender(); }
        if (params.get('conttest') === '1') { const s0 = screens[0]; s0.header.bleed = true; s0.header.x = 0.82; s0.header.headline.size = 150; const fp = s0.pills.find((p) => p.kind !== 'rating'); if (fp) { fp.bleed = true; fp.x = 1.03; fp.y = 0.55; } switchScreen(1); requestRender(); }
        if (params.get('applyLayout')) { const pr = MOCKUP_PRESETS.find((x) => x.id === params.get('applyLayout')); if (pr) applyMockupPreset(pr); }
        if (params.get('exporttest')) {
          const idx = Math.max(0, (parseInt(params.get('exporttest'), 10) || 1) - 1);
          setTimeout(() => {
            const off = document.createElement('canvas'); const [w, h] = DEVICE_RES[device]; off.width = w; off.height = h;
            renderScreenTo(off, Math.min(idx, screens.length - 1));
            off.toBlob((b) => {
              if (!b) { document.title = 'EXPORT FAIL (toBlob null)'; return; }
              const img = new Image();
              img.src = URL.createObjectURL(b);
              img.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;object-fit:contain;background:#1a1a1a;z-index:9999';
              document.body.appendChild(img);
              document.title = `EXPORT OK ${b.size} bytes · ${w}x${h}`;
            }, 'image/png');
          }, 900);
        }
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
