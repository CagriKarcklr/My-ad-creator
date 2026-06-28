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

  let brand = null;
  let screens = [];
  let activeIndex = 0;
  let device = 'iphone';
  let selectedPillId = null;
  let userZoom = 1;
  let uid = 1;
  let pillLibrary = []; // persisted, per-brand reusable pills
  const nextId = () => `p${uid++}`;

  const $ = (id) => document.getElementById(id);
  const canvas = $('canvas');
  const ctx = canvas.getContext('2d');
  const prevCanvas = $('canvas-prev');
  const nextCanvas = $('canvas-next');
  let showNeighbors = false;

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

    await document.fonts.ready.catch(() => {});
    setDevice(device, true);
    renderScreenTabs();
    syncAllPanels();
    renderLibrary();
    fitCanvas();
    requestRender();
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
        y: 0.05,
        eyebrow: { text: def.eyebrow || '', show: !!def.eyebrow, size: 30 },
        headline: {
          show: true, size: 116, weight: 800, tracking: -1, lineHeight: 1.04,
          lines: (def.headline || []).map((l) => ({ text: l.text, accent: !!l.accent })),
        },
        accentBar: { show: true, width: 64, height: 7 },
        subtitle: { text: def.subtitle || '', show: !!def.subtitle, size: 46, maxWidth: 0.78, weight: 500 },
      },
      phones: [defaultPhone()],
      activePhone: 0,
      pills: [],
    };
    const feats = (def.pills || []).map((p, i) => makePill(p, i));
    if (def.rating) feats.push({ id: nextId(), kind: 'rating', stars: def.rating.stars || 5, label: def.rating.label || '', style: 'solid', x: 0.5, y: 0.30, rotation: 0, scale: 1 });
    s.pills = feats;
    arrangePills(s);
    return s;
  }

  function makePill(p, i) {
    return {
      id: nextId(), kind: 'feature',
      emoji: p.emoji || '✨', title: p.title || '', subtitle: p.subtitle || '',
      style: p.style || PILL_STYLE_CYCLE[i % PILL_STYLE_CYCLE.length],
      x: 0.5, y: 0.5, rotation: 0, scale: 1,
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
    Renderer.render(canvasEl, s, { prev, next, ...extra });
  }

  let renderPending = false;
  let neighborTimer = null;
  function requestRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      if (!screens[activeIndex]) return;
      renderScreenTo(canvas, activeIndex, { selectedPillId });
      // A change to this screen's phone changes the neighbour continuations,
      // so refresh them (debounced; skipped while dragging a pill).
      if (showNeighbors && !drag) {
        clearTimeout(neighborTimer);
        neighborTimer = setTimeout(() => { if (showNeighbors) renderNeighbors(); }, 90);
      }
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
    [canvas, prevCanvas, nextCanvas].forEach((c) => { c.style.width = w; c.style.height = h; });
    $('zoom-level').textContent = userZoom === 1 ? 'Fit' : `${Math.round(userZoom * 100)}%`;
  }

  // Render the previous/next screens flanking the current one (bleed preview).
  function renderNeighbors() {
    $('filmstrip').classList.toggle('has-neighbors', showNeighbors);
    prevCanvas.style.display = showNeighbors ? '' : 'none';
    nextCanvas.style.display = showNeighbors ? '' : 'none';
    if (showNeighbors) {
      paintNeighbor(prevCanvas, activeIndex - 1);
      paintNeighbor(nextCanvas, activeIndex + 1);
    }
    fitCanvas();
  }
  function paintNeighbor(c, index) {
    c.width = canvas.width; c.height = canvas.height;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    if (index < 0 || index >= screens.length) { c.classList.add('empty'); return; }
    c.classList.remove('empty');
    renderScreenTo(c, index);
  }

  function canvasPoint(e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * canvas.width, y: (e.clientY - r.top) / r.height * canvas.height };
  }

  let drag = null;
  function setupCanvasInteraction() {
    canvas.addEventListener('pointerdown', (e) => {
      const pt = canvasPoint(e);
      const rects = Renderer.getPillRects(canvas.width, canvas.height, screen());
      let hit = null;
      for (let i = rects.length - 1; i >= 0; i--) { if (Renderer.hitTestPill(pt.x, pt.y, rects[i])) { hit = rects[i]; break; } }
      if (hit) {
        selectedPillId = hit.id;
        const p = screen().pills.find((x) => x.id === hit.id);
        drag = { id: hit.id, dx: pt.x / canvas.width - p.x, dy: pt.y / canvas.height - p.y };
        canvas.classList.add('dragging');
        canvas.setPointerCapture(e.pointerId);
        renderPillList();
        requestRender();
      } else if (selectedPillId) {
        selectedPillId = null; renderPillList(); requestRender();
      }
    });
    canvas.addEventListener('pointermove', (e) => {
      if (!drag) return;
      const pt = canvasPoint(e);
      const p = screen().pills.find((x) => x.id === drag.id);
      if (!p) return;
      p.x = Math.max(0.02, Math.min(0.98, pt.x / canvas.width - drag.dx));
      p.y = Math.max(0.02, Math.min(0.98, pt.y / canvas.height - drag.dy));
      requestRender();
    });
    const end = () => { if (drag) { drag = null; canvas.classList.remove('dragging'); } };
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

    // ---- Text panel ----
    bindCheckbox('header-show', (v) => { screen().header.show = v; });
    bindInput('eyebrow-text', (v) => { screen().header.eyebrow.text = v; });
    bindCheckbox('eyebrow-show', (v) => { screen().header.eyebrow.show = v; });
    $('btn-add-line').addEventListener('click', () => { screen().header.headline.lines.push({ text: 'New line', accent: true }); renderHeadlineLines(); requestRender(); });
    bindRange('headline-size', (v) => { screen().header.headline.size = +v; });
    bindSelect('headline-weight', (v) => { screen().header.headline.weight = +v; });
    bindCheckbox('bar-show', (v) => { screen().header.accentBar.show = v; });
    bindInput('subtitle-text', (v) => { screen().header.subtitle.text = v; screen().header.subtitle.show = !!v; });
    bindRange('header-y', (v) => { screen().header.y = +v / 100; });
    bindCheckbox('theme-dark', (v) => { screen().theme.mode = v ? 'dark' : 'light'; });

    // ---- Pills panel ----
    $('btn-add-pill').addEventListener('click', () => {
      const p = makePill({ emoji: '✨', title: 'New pill', subtitle: 'subtitle' }, screen().pills.length);
      p.x = 0.2; p.y = 0.5;
      screen().pills.push(p); selectedPillId = p.id; renderPillList(); requestRender();
    });
    $('btn-add-rating').addEventListener('click', () => {
      const p = { id: nextId(), kind: 'rating', stars: 5, label: 'Loved by everyday budgeters', style: 'solid', x: 0.5, y: 0.3, rotation: 0, scale: 1 };
      screen().pills.push(p); selectedPillId = p.id; renderPillList(); requestRender();
    });
    $('btn-arrange-pills').addEventListener('click', () => { arrangePills(screen()); renderPillList(); requestRender(); });
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

    // ---- Device panel ---- (controls target the active phone on this screen)
    bindCheckbox('phone-show', (v) => { activePhone().show = v; });
    bindRange('phone-scale', (v) => { activePhone().scale = +v; $('v-scale').textContent = `${v}%`; });
    bindRange('phone-x', (v) => { activePhone().x = +v; $('v-x').textContent = `${v}%`; });
    bindRange('phone-y', (v) => { activePhone().y = +v; $('v-y').textContent = `${v}%`; });
    bindRange('phone-rotation', (v) => { activePhone().rotation = +v; $('v-rot').textContent = `${v}°`; });
    const bumpLayer = (d) => { const p = activePhone(); p.z = (p.z || 0) + d; $('v-z').textContent = p.z; requestRender(); if (showNeighbors) renderNeighbors(); };
    $('phone-front').addEventListener('click', () => bumpLayer(1));
    $('phone-back').addEventListener('click', () => bumpLayer(-1));
    bindCheckbox('phone-shadow', (v) => { activePhone().shadow = v; });
    bindRange('shadow-intensity', (v) => { activePhone().shadowIntensity = +v; $('v-shadow').textContent = `${v}%`; });
    bindRange('shadow-blur', (v) => { activePhone().shadowBlur = +v; $('v-blur').textContent = v; });
    setupUpload();
    $('btn-clear-shot').addEventListener('click', () => { activePhone().screenshot = null; syncDeviceControls(); requestRender(); if (showNeighbors) renderNeighbors(); });

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
      activePhone().x = x;
      $('phone-x').value = x; $('v-x').textContent = `${x}%`;
      requestRender();
      if (showNeighbors) renderNeighbors();
    }));
    $('show-neighbors').addEventListener('change', () => { showNeighbors = $('show-neighbors').checked; renderNeighbors(); });
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
    $('bar-show').checked = s.header.accentBar.show !== false;
    $('subtitle-text').value = s.header.subtitle.text || '';
    $('header-y').value = Math.round((s.header.y || 0.05) * 100);
    $('theme-dark').checked = s.theme.mode === 'dark';

    renderPillList();

    syncStylePanel();

    renderPhoneTabs();
    syncDeviceControls();

    $('font-display').value = s.fonts.display;
    $('font-body').value = s.fonts.body;
    updateFontPreview();

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
    $('phone-show').checked = p.show !== false;
    $('phone-scale').value = p.scale; $('v-scale').textContent = `${p.scale}%`;
    $('phone-x').value = p.x; $('v-x').textContent = `${p.x}%`;
    $('phone-y').value = p.y; $('v-y').textContent = `${p.y}%`;
    $('phone-rotation').value = p.rotation; $('v-rot').textContent = `${p.rotation}°`;
    $('v-z').textContent = p.z || 0;
    $('phone-shadow').checked = p.shadow !== false;
    $('shadow-intensity').value = p.shadowIntensity; $('v-shadow').textContent = `${p.shadowIntensity}%`;
    $('shadow-blur').value = p.shadowBlur; $('v-blur').textContent = p.shadowBlur;
    const hasImg = !!p.screenshot;
    $('upload-zone').classList.toggle('has-img', hasImg);
    $('upload-zone').querySelector('span').textContent = hasImg ? 'Screenshot loaded · click to replace' : 'Drop screen here · or click';
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
      input.addEventListener('input', () => { ln.text = input.value; requestRender(); });
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
          </div>`;
        const saveBtn = row.querySelector('.pr-save');
        const refreshSave = () => { const inLib = isInLibrary(p); saveBtn.classList.toggle('saved', inLib); saveBtn.textContent = inLib ? '★' : '☆'; };
        saveBtn.addEventListener('click', () => { const n = addToLibrary([p]); refreshSave(); renderLibrary(); toast(n ? 'Saved to library' : 'Already saved'); });
        row.querySelector('.pr-emoji').addEventListener('input', (e) => { p.emoji = e.target.value; refreshSave(); requestRender(); });
        row.querySelector('.pr-title').addEventListener('input', (e) => { p.title = e.target.value; refreshSave(); requestRender(); });
        row.querySelector('.pr-sub').addEventListener('input', (e) => { p.subtitle = e.target.value; requestRender(); });
        row.querySelector('.pr-style').addEventListener('change', (e) => { p.style = e.target.value; requestRender(); });
        const rot = row.querySelector('.pr-rot');
        for (let r = -10; r <= 10; r += 2) rot.add(new Option(`${r}°`, r, false, p.rotation === r));
        rot.addEventListener('change', (e) => { p.rotation = +e.target.value; requestRender(); });
      }
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
    const pal = brand.palettes.find((p) => p.id === id);
    if (!pal) return;
    s._paletteId = id;
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
      img.onload = () => { activePhone().screenshot = img; syncDeviceControls(); renderPhoneTabs(); requestRender(); if (showNeighbors) renderNeighbors(); };
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

  // ──────────────────────────────────────────────────────────────────────────
  // Boot
  // ──────────────────────────────────────────────────────────────────────────
  function boot() {
    initBrandPicker();
    setupCanvasInteraction();
    // Dev affordance: ?dev=1 auto-selects the first brand for headless rendering.
    // Optional &screen=N (1-based) and &device=android jump to a specific view.
    const params = new URLSearchParams(location.search);
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
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
