/**
 * Renderer — canvas engine for App Store screenshots.
 * Draws: background → header (eyebrow + two-tone headline + accent bar + subtitle)
 *        → phone mockup (uploaded screenshot inside the real device frame)
 *        → floating feature pills.
 *
 * The phone-mockup + alpha screen-detection logic is carried over from the
 * previous renderer (battle-tested against the frame PNGs).
 */
window.Renderer = (() => {
  'use strict';

  // ── Frame configs ──────────────────────────────────────────────────────────
  const FRAMES = {
    iphone: {
      imgW: 1456, imgH: 3000,
      screenLeft: 55 / 1456, screenTop: 44 / 3000,
      screenRight: 55 / 1456, screenBottom: 40 / 3000,
      screenCornerRadius: 0.12,
      src: 'Iphone-frame-upscaled.png',
    },
    android: {
      imgW: 884, imgH: 1842,
      screenLeft: 34 / 884, screenTop: 28 / 1842,
      screenRight: 34 / 884, screenBottom: 30 / 1842,
      screenCornerRadius: 0.11,
      src: 'Android-frame.png?v=20260503a',
      autoDetectScreen: true,
    },
  };
  const AUTO_SCREEN_BLEED_PAD_PX = 3;
  const DESIGN_W = 1284; // metrics are tuned for this canvas width, then scaled

  const frameImages = {};
  const frameRuntimeMeta = {};
  const detectedScreenMetrics = new Map();
  const screenMaskByFrameImage = new WeakMap();
  let onAssetLoad = null;

  for (const [key, cfg] of Object.entries(FRAMES)) {
    const img = new Image();
    img.onload = () => {
      frameImages[key] = img;
      frameRuntimeMeta[key] = { imgW: img.naturalWidth || cfg.imgW, imgH: img.naturalHeight || cfg.imgH };
      if (cfg.autoDetectScreen) {
        const detected = detectScreenBoundsFromAlpha(img);
        if (detected) detectedScreenMetrics.set(key, detected);
      }
      if (onAssetLoad) onAssetLoad();
    };
    img.src = cfg.src;
  }

  function getPhoneAspectRatio(frameType = 'iphone') {
    const r = frameRuntimeMeta[frameType];
    if (r && r.imgW && r.imgH) return r.imgW / r.imgH;
    const cfg = FRAMES[frameType] || FRAMES.iphone;
    return cfg.imgW / cfg.imgH;
  }

  // ── Alpha-based screen detection (for frames whose screen is a cutout) ──────
  function getResolvedScreenConfig(frameType, frameCfg, image) {
    if (!frameCfg.autoDetectScreen) return frameCfg;
    const cached = detectedScreenMetrics.get(frameType);
    if (cached) return { ...frameCfg, ...cached };
    const detected = detectScreenBoundsFromAlpha(image);
    if (!detected) return frameCfg;
    detectedScreenMetrics.set(frameType, detected);
    return { ...frameCfg, ...detected };
  }

  function detectScreenBoundsFromAlpha(image, threshold = 8) {
    const W = image.naturalWidth || image.width;
    const H = image.naturalHeight || image.height;
    if (!W || !H) return null;
    const off = document.createElement('canvas');
    off.width = W; off.height = H;
    const ctx = off.getContext('2d');
    ctx.drawImage(image, 0, 0, W, H);
    const data = ctx.getImageData(0, 0, W, H).data;
    const alphaAt = (x, y) => data[(y * W + x) * 4 + 3];

    const isWindow = (x, y) => alphaAt(x, y) < 250;
    const seed = findSeedNearCenter(W, H, isWindow);
    const region = seed ? floodFill(W, H, isWindow, seed, 0.08, true) : null;
    if (region) {
      const mask = maskCanvasFromVisited(region.mask, W, H);
      if (mask) screenMaskByFrameImage.set(image, mask);
      const detected = boundsToInsets(region, W, H, 0);
      const r = estimateCorner(region, W, H, isWindow);
      if (Number.isFinite(r)) detected.screenCornerRadius = r;
      return detected;
    }

    const isTransparent = (x, y) => alphaAt(x, y) <= threshold;
    const tSeed = findSeedNearCenter(W, H, isTransparent);
    const tBounds = tSeed ? floodFill(W, H, isTransparent, tSeed, 0.08) : null;
    if (tBounds) {
      const detected = boundsToInsets(tBounds, W, H, -AUTO_SCREEN_BLEED_PAD_PX);
      const r = estimateCorner(tBounds, W, H, isTransparent);
      if (Number.isFinite(r)) detected.screenCornerRadius = r;
      return detected;
    }
    return null;
  }

  function findSeedNearCenter(W, H, isMatch) {
    const cx = Math.floor(W / 2), cy = Math.floor(H / 2);
    const maxR = Math.max(cx, cy);
    for (let r = 0; r <= maxR; r += 2) {
      const x0 = Math.max(1, cx - r), x1 = Math.min(W - 2, cx + r);
      const y0 = Math.max(1, cy - r), y1 = Math.min(H - 2, cy + r);
      for (let x = x0; x <= x1; x += 2) { if (isMatch(x, y0)) return { x, y: y0 }; if (isMatch(x, y1)) return { x, y: y1 }; }
      for (let y = y0 + 2; y <= y1 - 2; y += 2) { if (isMatch(x0, y)) return { x: x0, y }; if (isMatch(x1, y)) return { x: x1, y }; }
    }
    return null;
  }

  function floodFill(W, H, isMatch, seed, minAreaRatio = 0.08, includeVisited = false) {
    const total = W * H;
    const visited = new Uint8Array(total);
    const qx = new Int32Array(total), qy = new Int32Array(total);
    let minX = seed.x, maxX = seed.x, minY = seed.y, maxY = seed.y, area = 0, edge = false;
    let head = 0, tail = 0;
    visited[seed.y * W + seed.x] = 1; qx[tail] = seed.x; qy[tail] = seed.y; tail++;
    while (head < tail) {
      const x = qx[head], y = qy[head]; head++;
      area++;
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (x === 0 || x === W - 1 || y === 0 || y === H - 1) edge = true;
      const push = (nx, ny) => { const i = ny * W + nx; if (!visited[i] && isMatch(nx, ny)) { visited[i] = 1; qx[tail] = nx; qy[tail] = ny; tail++; } };
      if (x > 0) push(x - 1, y);
      if (x < W - 1) push(x + 1, y);
      if (y > 0) push(x, y - 1);
      if (y < H - 1) push(x, y + 1);
    }
    if (edge) return null;
    if (area < total * minAreaRatio) return null;
    const region = { minX, maxX, minY, maxY };
    if (includeVisited) region.mask = visited;
    return region;
  }

  function maskCanvasFromVisited(visited, W, H) {
    if (!(visited instanceof Uint8Array) || visited.length !== W * H) return null;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const mctx = c.getContext('2d');
    const img = mctx.createImageData(W, H);
    const px = img.data;
    for (let i = 0; i < visited.length; i++) { if (!visited[i]) continue; const p = i * 4; px[p] = 255; px[p + 1] = 255; px[p + 2] = 255; px[p + 3] = 255; }
    mctx.putImageData(img, 0, 0);
    return c;
  }

  function boundsToInsets(b, W, H, pad = 1) {
    const p = Number.isFinite(pad) ? pad : 1;
    const minX = Math.max(0, b.minX + p), minY = Math.max(0, b.minY + p);
    const maxX = Math.min(W - 1, b.maxX - p), maxY = Math.min(H - 1, b.maxY - p);
    return { screenLeft: minX / W, screenTop: minY / H, screenRight: (W - (maxX + 1)) / W, screenBottom: (H - (maxY + 1)) / H };
  }

  function estimateCorner(b, W, H, isT) {
    const minX = Math.max(0, b.minX), maxX = Math.min(W - 1, b.maxX);
    const minY = Math.max(0, b.minY), maxY = Math.min(H - 1, b.maxY);
    if (maxX <= minX || maxY <= minY) return null;
    const screenH = maxY - minY + 1, screenW = maxX - minX + 1;
    const scanRows = Math.min(Math.max(24, Math.floor(screenH * 0.28)), 240);
    let lMax = 0, rMax = 0, rows = 0;
    for (let y = minY; y <= Math.min(maxY, minY + scanRows); y++) {
      let first = -1; for (let x = minX; x <= maxX; x++) { if (isT(x, y)) { first = x; break; } }
      if (first < 0) continue;
      let last = -1; for (let x = maxX; x >= minX; x--) { if (isT(x, y)) { last = x; break; } }
      if (last < 0) continue;
      rows++; lMax = Math.max(lMax, first - minX); rMax = Math.max(rMax, maxX - last);
    }
    if (rows < 6) return null;
    const radiusPx = Math.max(lMax, rMax) + 1;
    const maxRadiusPx = Math.max(2, Math.floor(screenW * 0.22));
    return Math.max(2, Math.min(maxRadiusPx, radiusPx)) / W;
  }

  // ── Small helpers ───────────────────────────────────────────────────────────
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function wrapText(ctx, text, maxWidth) {
    const words = String(text).split(' ');
    const lines = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      if (ctx.measureText(test).width > maxWidth && cur) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines.length ? lines : [''];
  }

  function fontStack(name) {
    return `"${name}", "SF Pro Display", -apple-system, system-ui, sans-serif`;
  }

  // ── Background ───────────────────────────────────────────────────────────────
  function drawBackground(ctx, W, H, bg, theme) {
    if (!bg || bg.type === 'solid') {
      ctx.fillStyle = (bg && bg.color) || '#EDE6FB';
      ctx.fillRect(0, 0, W, H);
    } else if (bg.type === 'gradient') {
      const angle = (bg.angle || 180) * Math.PI / 180;
      const cx = W / 2, cy = H / 2, len = Math.sqrt(W * W + H * H) / 2;
      const grad = ctx.createLinearGradient(cx - Math.sin(angle) * len, cy - Math.cos(angle) * len, cx + Math.sin(angle) * len, cy + Math.cos(angle) * len);
      const colors = bg.colors || ['#EDE6FB', '#FBE6DD'];
      const stops = bg.stops || colors.map((_, i) => i / (colors.length - 1));
      colors.forEach((c, i) => grad.addColorStop(stops[i] != null ? stops[i] : i / (colors.length - 1), c));
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (bg.type === 'mesh') {
      drawMesh(ctx, W, H, bg);
    }
    // Soft top glow behind the headline (matches the reference warmth)
    if (bg && bg.glow !== false && (!bg.type || bg.type !== 'solid')) {
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.12, 0, W * 0.5, H * 0.12, W * 0.6);
      const warm = (theme && theme.mode === 'dark') ? 'rgba(167,139,250,0.18)' : 'rgba(255,255,255,0.45)';
      glow.addColorStop(0, warm);
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);
    }
  }

  // Panorama: one master gradient spanning all screens; each screen draws its
  // horizontal slice so the colour flows continuously across the whole set.
  function drawPanorama(ctx, W, H, pano, index, count, theme) {
    const n = Math.max(1, count);
    const i = Math.max(0, Math.min(n - 1, index));
    const colors = (pano.colors && pano.colors.length) ? pano.colors : ['#EDE6FB', '#FBE6DD'];
    const dark = theme && theme.mode === 'dark';

    // 1) Continuous horizontal hue track — this screen draws its slice of one
    //    master gradient spanning the whole set, so colour flows across seams.
    const base = ctx.createLinearGradient(-i * W, 0, (n - i) * W, 0);
    if (colors.length === 1) { base.addColorStop(0, colors[0]); base.addColorStop(1, colors[0]); }
    else colors.forEach((c, k) => base.addColorStop(k / (colors.length - 1), c));
    ctx.fillStyle = base;
    ctx.fillRect(0, 0, W, H);

    // 2) Uniform vertical sheen (identical on every screen, so seams stay
    //    continuous) — gives each image a soft top-light → deeper-bottom gradient.
    const v = ctx.createLinearGradient(0, 0, 0, H);
    if (dark) {
      v.addColorStop(0, 'rgba(255,255,255,0.10)'); v.addColorStop(0.5, 'rgba(255,255,255,0)'); v.addColorStop(1, 'rgba(0,0,0,0.22)');
    } else {
      v.addColorStop(0, 'rgba(255,255,255,0.32)'); v.addColorStop(0.5, 'rgba(255,255,255,0.02)'); v.addColorStop(1, 'rgba(40,20,70,0.07)');
    }
    ctx.fillStyle = v;
    ctx.fillRect(0, 0, W, H);

    // 3) Soft top-centre glow for depth.
    if (pano.glow !== false) {
      const glow = ctx.createRadialGradient(W * 0.5, H * 0.1, 0, W * 0.5, H * 0.1, W * 0.7);
      glow.addColorStop(0, dark ? 'rgba(167,139,250,0.16)' : 'rgba(255,255,255,0.30)');
      glow.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);
    }
  }

  function drawMesh(ctx, W, H, bg) {
    const colors = bg.meshColors || ['#EDE6FB', '#F3E0F0', '#FBE6DD', '#E9E2FB'];
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, W, H);
    const pos = [{ x: 0.2, y: 0.2 }, { x: 0.8, y: 0.15 }, { x: 0.75, y: 0.85 }, { x: 0.15, y: 0.8 }];
    for (let i = 0; i < colors.length && i < 4; i++) {
      const p = pos[i];
      const radius = (0.4 + (bg.meshComplexity || 5) * 0.06) * Math.max(W, H);
      const g = ctx.createRadialGradient(p.x * W, p.y * H, 0, p.x * W, p.y * H, radius);
      g.addColorStop(0, colors[i]); g.addColorStop(0.5, colors[i] + '80'); g.addColorStop(1, colors[i] + '00');
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ── Header (eyebrow / two-tone headline / accent bar / subtitle) ────────────
  function layoutHeader(ctx, W, H, state) {
    const sf = W / DESIGN_W;
    const t = state.theme || {};
    const h = state.header || {};
    const fonts = state.fonts || {};
    const isDark = t.mode === 'dark';
    const baseColor = isDark ? (t.headlineBaseDark || '#FFFFFF') : (t.headlineBase || '#16161F');
    const accentColor = t.headlineAccent || t.accent || '#7C3AED';
    const subColor = isDark ? (t.subtitleDark || 'rgba(255,255,255,0.78)') : (t.subtitle || '#5E5E70');
    const eyebrowColor = isDark ? (t.eyebrowDark || '#C4B5FD') : (t.eyebrow || '#8B5CF6');
    const ruleColor = t.accent2 || '#34D399';

    const blocks = [];
    let y = (h.y != null ? h.y : 0.05) * H;
    const top = y;
    let halfW = 0;

    // Eyebrow
    const eyebrow = h.eyebrow || {};
    if (eyebrow.show !== false && eyebrow.text) {
      const size = (eyebrow.size || 30) * sf;
      ctx.font = `700 ${size}px ${fontStack(fonts.body || 'DM Sans')}`;
      const ew = ctx.measureText(String(eyebrow.text).toUpperCase().split('').join('  ')).width;
      halfW = Math.max(halfW, ew / 2 + size * 0.7 + size * 1.1); // text + flanking rules
      blocks.push({ kind: 'eyebrow', text: eyebrow.text, size, color: eyebrowColor, ruleColor, y, h: size });
      y += size + 34 * sf;
    }

    // Headline
    const hl = h.headline || {};
    const lines = (hl.lines || []).filter((l) => l && l.text != null);
    if (hl.show !== false && lines.length) {
      const weight = hl.weight || 800;
      const lh = hl.lineHeight || 1.04;
      const tracking = (hl.tracking != null ? hl.tracking : -1) * sf;
      // Auto-fit: shrink the headline if the widest line would overflow.
      let size = (hl.size || 116) * sf;
      ctx.font = `${weight} ${size}px ${fontStack(fonts.display || 'Poppins')}`;
      let widest = 0;
      lines.forEach((ln) => {
        const chars = [...String(ln.text)];
        let lw = 0;
        for (let i = 0; i < chars.length; i++) lw += ctx.measureText(chars[i]).width + (i < chars.length - 1 ? tracking : 0);
        widest = Math.max(widest, lw);
      });
      const maxAllowed = W * 0.90;
      if (widest > maxAllowed) size = Math.max(size * (maxAllowed / widest), 40 * sf);
      halfW = Math.max(halfW, Math.min(widest, maxAllowed) / 2);
      lines.forEach((ln) => {
        blocks.push({ kind: 'headline', text: ln.text, size, weight, tracking, lineHeight: lh, color: ln.accent ? accentColor : baseColor, font: fonts.display, y, h: size * lh });
        y += size * lh;
      });
      y += 24 * sf;
    }

    // Accent mark — a centred bar (divider) or an underline drawn under a word.
    const bar = h.accentBar || {};
    const mode = bar.mode || 'bar';
    if (bar.show !== false && mode === 'bar') {
      const bw = (bar.width || 64) * sf, bh = (bar.height || 7) * sf;
      halfW = Math.max(halfW, bw / 2);
      blocks.push({ kind: 'bar', w: bw, h: bh, color: ruleColor, y });
      y += bh + 30 * sf;
    } else if (bar.show !== false && mode === 'underline') {
      y += 18 * sf; // underline is drawn under the headline; just keep breathing room
    }

    // Subtitle
    const sub = h.subtitle || {};
    if (sub.show !== false && sub.text) {
      const size = (sub.size || 46) * sf;
      const lh = 1.32;
      const maxW = (sub.maxWidth || 0.78) * W;
      ctx.font = `${sub.weight || 500} ${size}px ${fontStack(fonts.body || 'DM Sans')}`;
      const wrapped = wrapText(ctx, sub.text, maxW);
      let subHalf = 0;
      wrapped.forEach((ln) => { subHalf = Math.max(subHalf, ctx.measureText(ln).width / 2); });
      halfW = Math.max(halfW, subHalf);
      blocks.push({ kind: 'subtitle', lines: wrapped, size, lineHeight: lh, color: subColor, font: fonts.body, weight: sub.weight || 500, y, h: wrapped.length * size * lh });
      y += wrapped.length * size * lh;
    }

    return { blocks, bottom: y, sf, top, halfW };
  }

  // Bounding box of the header content (for hit-testing / dragging).
  function getHeaderRect(W, H, state) {
    if (!state.header || state.header.show === false) return null;
    const meas = document.createElement('canvas').getContext('2d');
    const lay = layoutHeader(meas, W, H, state);
    if (!lay.blocks.length) return null;
    const cx = (state.header.x != null ? state.header.x : 0.5) * W;
    const halfW = Math.max(lay.halfW, 60);
    return { x: cx - halfW, y: lay.top, w: halfW * 2, h: Math.max(20, lay.bottom - lay.top) };
  }

  // Pixel range (relative to line centre) of a word within a centred line.
  function wordRange(ctx, text, word, size, weight, font, tracking) {
    if (!word) return null;
    ctx.save();
    ctx.font = `${weight} ${size}px ${fontStack(font || 'Poppins')}`;
    const cps = [...String(text)];
    const widths = cps.map((c) => ctx.measureText(c).width);
    const left = []; let acc = 0;
    for (let i = 0; i < cps.length; i++) { left[i] = acc; acc += widths[i] + tracking; }
    const total = acc - tracking;
    const sIdx = String(text).toLowerCase().indexOf(String(word).toLowerCase());
    if (sIdx < 0) { ctx.restore(); return null; }
    const startCp = [...String(text).slice(0, sIdx)].length;
    const endCp = startCp + [...String(word)].length;
    if (endCp > cps.length || endCp <= startCp) { ctx.restore(); return null; }
    const start = -total / 2 + left[startCp];
    const end = -total / 2 + left[endCp - 1] + widths[endCp - 1];
    ctx.restore();
    return { start, end };
  }

  function drawHeader(ctx, W, H, state) {
    const { blocks, sf } = layoutHeader(ctx, W, H, state);
    const cx = (state.header && state.header.x != null ? state.header.x : 0.5) * W;
    const ab = (state.header && state.header.accentBar) || {};
    const underlineWord = (ab.show !== false && ab.mode === 'underline') ? ab.word : '';
    const ruleColor = (state.theme && state.theme.accent2) || '#34D399';
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (const b of blocks) {
      if (b.kind === 'eyebrow') {
        ctx.font = `700 ${b.size}px ${fontStack((state.fonts || {}).body || 'DM Sans')}`;
        const letterSpaced = String(b.text).toUpperCase().split('').join('  ');
        ctx.fillStyle = b.color;
        const textW = ctx.measureText(letterSpaced).width;
        ctx.fillText(letterSpaced, cx, b.y);
        // Flanking rules
        const ruleLen = b.size * 1.1;
        const gap = b.size * 0.7;
        const midY = b.y + b.size / 2;
        ctx.strokeStyle = b.ruleColor;
        ctx.lineWidth = Math.max(2, b.size * 0.09);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(cx - textW / 2 - gap, midY);
        ctx.lineTo(cx - textW / 2 - gap - ruleLen, midY);
        ctx.moveTo(cx + textW / 2 + gap, midY);
        ctx.lineTo(cx + textW / 2 + gap + ruleLen, midY);
        ctx.stroke();
      } else if (b.kind === 'headline') {
        drawTrackedLine(ctx, b.text, cx, b.y, b.size, b.weight, b.font, b.color, b.tracking);
        if (underlineWord) {
          const r = wordRange(ctx, b.text, underlineWord, b.size, b.weight, b.font, b.tracking);
          if (r) {
            const th = (ab.height || 7) * sf * 0.9;
            const uy = b.y + b.size * 0.98;
            const pad = b.size * 0.04;
            ctx.fillStyle = ruleColor;
            roundRect(ctx, cx + r.start - pad, uy, (r.end - r.start) + pad * 2, th, th / 2);
            ctx.fill();
          }
        }
      } else if (b.kind === 'bar') {
        ctx.fillStyle = b.color;
        roundRect(ctx, cx - b.w / 2, b.y, b.w, b.h, b.h / 2);
        ctx.fill();
      } else if (b.kind === 'subtitle') {
        ctx.font = `${b.weight} ${b.size}px ${fontStack(b.font || 'DM Sans')}`;
        ctx.fillStyle = b.color;
        let yy = b.y;
        for (const line of b.lines) { ctx.fillText(line, cx, yy); yy += b.size * b.lineHeight; }
      }
    }
    ctx.restore();
  }

  // Centered line with letter-spacing (so headlines can track tight)
  function drawTrackedLine(ctx, text, cx, y, size, weight, font, color, tracking) {
    ctx.save();
    ctx.font = `${weight} ${size}px ${fontStack(font || 'Poppins')}`;
    ctx.fillStyle = color;
    ctx.textBaseline = 'top';
    if (!tracking) { ctx.textAlign = 'center'; ctx.fillText(text, cx, y); ctx.restore(); return; }
    ctx.textAlign = 'left';
    const chars = [...String(text)];
    let total = 0;
    for (let i = 0; i < chars.length; i++) total += ctx.measureText(chars[i]).width + (i < chars.length - 1 ? tracking : 0);
    let x = cx - total / 2;
    for (let i = 0; i < chars.length; i++) { ctx.fillText(chars[i], x, y); x += ctx.measureText(chars[i]).width + tracking; }
    ctx.restore();
  }

  // ── Phone mockup ─────────────────────────────────────────────────────────────
  function drawPhoneMockup(ctx, cx, cy, w, h, screenshot, opts = {}) {
    const { rotation = 0, shadow = true, shadowIntensity = 0.35, shadowBlur = 60, screenBrightness = 0, frameType = 'iphone' } = opts;
    const frameCfg = FRAMES[frameType] || FRAMES.iphone;
    const frameImage = frameImages[frameType];
    if (!frameImage) return;
    const cfg = getResolvedScreenConfig(frameType, frameCfg, frameImage);

    ctx.save();
    if (rotation !== 0) { ctx.translate(cx, cy); ctx.rotate(rotation * Math.PI / 180); ctx.translate(-cx, -cy); }

    const pw = frameImage.naturalWidth || Math.round(w);
    const ph = frameImage.naturalHeight || Math.round(h);
    const off = document.createElement('canvas');
    off.width = pw; off.height = ph;
    const octx = off.getContext('2d');
    octx.imageSmoothingEnabled = true; octx.imageSmoothingQuality = 'high';

    const sx = pw * cfg.screenLeft, sy = ph * cfg.screenTop;
    const sw = pw * (1 - cfg.screenLeft - cfg.screenRight);
    const sh = ph * (1 - cfg.screenTop - cfg.screenBottom);
    const screenR = pw * cfg.screenCornerRadius;
    const mask = screenMaskByFrameImage.get(frameImage) || null;

    if (screenshot) {
      const iw = screenshot.naturalWidth || screenshot.width;
      const ih = screenshot.naturalHeight || screenshot.height;
      const iRatio = iw / ih, sRatio = sw / sh;
      let dW, dH, dX, dY;
      if (iRatio > sRatio) { dH = sh; dW = sh * iRatio; dX = sx + (sw - dW) / 2; dY = sy; }
      else { dW = sw; dH = sw / iRatio; dX = sx; dY = sy + sh - dH; }
      octx.save();
      if (!mask) { roundRect(octx, sx, sy, sw, sh, screenR); octx.clip(); }
      octx.fillStyle = '#000'; octx.fillRect(sx, sy, sw, sh);
      octx.drawImage(screenshot, dX, dY, dW, dH);
      if (screenBrightness !== 0) {
        octx.fillStyle = screenBrightness > 0 ? `rgba(255,255,255,${screenBrightness / 100})` : `rgba(0,0,0,${Math.abs(screenBrightness) / 100})`;
        octx.fillRect(sx, sy, sw, sh);
      }
      if (mask) { octx.globalCompositeOperation = 'destination-in'; octx.drawImage(mask, 0, 0, pw, ph); octx.globalCompositeOperation = 'source-over'; }
      octx.restore();
    } else {
      const grad = octx.createLinearGradient(sx, sy, sx, sy + sh);
      grad.addColorStop(0, '#efeafb'); grad.addColorStop(1, '#e3d9f3');
      octx.save();
      octx.fillStyle = grad;
      if (!mask) { roundRect(octx, sx, sy, sw, sh, screenR); octx.fill(); }
      else { octx.fillRect(sx, sy, sw, sh); octx.globalCompositeOperation = 'destination-in'; octx.drawImage(mask, 0, 0, pw, ph); octx.globalCompositeOperation = 'source-over'; }
      octx.restore();
    }

    octx.drawImage(frameImage, 0, 0, pw, ph);

    const x = cx - w / 2, y = cy - h / 2;
    if (shadow) {
      ctx.shadowColor = `rgba(24, 16, 48, ${shadowIntensity})`;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = shadowBlur * 0.4;
    }
    ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(off, x, y, w, h);
    ctx.restore();
  }

  // ── Floating pills ───────────────────────────────────────────────────────────
  const PILL_FONT_BODY = 'DM Sans';
  // Explicit colour-emoji stack so every emoji renders on canvas (some emoji
  // fall back to a blank glyph when only a text font is set).
  const EMOJI_FONT = '"Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla","EmojiOne Color",sans-serif';

  function pillMetrics(ctx, pill, W, fonts) {
    const sf = (W / DESIGN_W) * (pill.scale || 1);
    const isRating = pill.kind === 'rating';
    const bodyFont = fontStack((fonts && fonts.body) || PILL_FONT_BODY);

    if (isRating) {
      const starSize = 30 * sf;
      const labelSize = 28 * sf;
      const padX = 26 * sf, padY = 18 * sf, gap = 14 * sf;
      const stars = Math.max(1, Math.min(5, pill.stars || 5));
      const starStr = '★'.repeat(stars);
      ctx.font = `700 ${starSize}px ${bodyFont}`;
      const starW = ctx.measureText(starStr).width;
      ctx.font = `700 ${labelSize}px ${bodyFont}`;
      const labelW = ctx.measureText(pill.label || '').width;
      const w = padX * 2 + starW + (pill.label ? gap + labelW : 0);
      const h = padY * 2 + Math.max(starSize, labelSize);
      return { sf, w, h, padX, padY, gap, starSize, labelSize, starStr, starW, labelW, isRating: true, r: h / 2 };
    }

    const titleSize = 30 * sf;
    const subSize = 22 * sf;
    const emojiSize = 38 * sf;
    const padX = 26 * sf, padY = 19 * sf, gap = 15 * sf;
    ctx.font = `700 ${titleSize}px ${bodyFont}`;
    const titleW = ctx.measureText(pill.title || '').width;
    let subW = 0;
    if (pill.subtitle) { ctx.font = `500 ${subSize}px ${bodyFont}`; subW = ctx.measureText(pill.subtitle).width; }
    const textW = Math.max(titleW, subW);
    const emojiW = pill.emoji ? emojiSize + gap : 0;
    const textH = pill.subtitle ? titleSize + subSize * 1.18 + 3 * sf : titleSize;
    const w = padX * 2 + emojiW + textW;
    const h = padY * 2 + Math.max(textH, emojiW ? emojiSize : 0);
    return { sf, w, h, padX, padY, gap, titleSize, subSize, emojiSize, emojiW, textW, textH, r: Math.min(h / 2, 36 * sf), isRating: false };
  }

  function drawPill(ctx, pill, W, H, fonts, opts = {}) {
    const m = pillMetrics(ctx, pill, W, fonts);
    const cx = (pill.x != null ? pill.x : 0.5) * W;
    const cy = (pill.y != null ? pill.y : 0.5) * H;
    const style = pill.style || 'solid';
    const bodyFont = fontStack((fonts && fonts.body) || PILL_FONT_BODY);

    const isGlass = style === 'glass';
    const cardFill = isGlass ? 'rgba(255,255,255,0.66)' : '#FFFFFF';
    const titleColor = '#1A1A24';
    const subColor = isGlass ? 'rgba(38,34,58,0.72)' : '#8A8A99';

    ctx.save();
    ctx.translate(cx, cy);
    if (pill.rotation) ctx.rotate(pill.rotation * Math.PI / 180);

    // Card + shadow
    ctx.save();
    ctx.shadowColor = `rgba(24,16,48,${isGlass ? 0.14 : 0.16})`;
    ctx.shadowBlur = 34 * m.sf;
    ctx.shadowOffsetY = 12 * m.sf;
    roundRect(ctx, -m.w / 2, -m.h / 2, m.w, m.h, m.r);
    ctx.fillStyle = cardFill;
    ctx.fill();
    ctx.restore();
    if (isGlass) {
      roundRect(ctx, -m.w / 2, -m.h / 2, m.w, m.h, m.r);
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = 1.4 * m.sf;
      ctx.stroke();
    }
    if (opts.selected) {
      roundRect(ctx, -m.w / 2 - 4 * m.sf, -m.h / 2 - 4 * m.sf, m.w + 8 * m.sf, m.h + 8 * m.sf, m.r + 4 * m.sf);
      ctx.strokeStyle = (opts.accent || '#7C3AED');
      ctx.lineWidth = 3 * m.sf;
      ctx.setLineDash([8 * m.sf, 6 * m.sf]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.textBaseline = 'middle';

    if (m.isRating) {
      let x = -m.w / 2 + m.padX;
      ctx.textAlign = 'left';
      ctx.font = `700 ${m.starSize}px ${bodyFont}`;
      ctx.fillStyle = '#F5B301';
      ctx.fillText(m.starStr, x, 1 * m.sf);
      x += m.starW + (pill.label ? m.gap : 0);
      if (pill.label) {
        ctx.font = `700 ${m.labelSize}px ${bodyFont}`;
        ctx.fillStyle = titleColor;
        ctx.fillText(pill.label, x, 0);
      }
      ctx.restore();
      return;
    }

    let x = -m.w / 2 + m.padX;
    if (pill.emoji) {
      if (style === 'tint') {
        const chip = m.emojiSize + 14 * m.sf;
        roundRect(ctx, x - 7 * m.sf, -chip / 2, chip, chip, chip * 0.32);
        ctx.fillStyle = hexA(pill.accent || (opts.accent || '#7C3AED'), 0.14);
        ctx.fill();
      }
      ctx.font = `${m.emojiSize}px ${EMOJI_FONT}`;
      ctx.textAlign = 'left';
      // Colour emoji ignore fillStyle; but where the browser renders an emoji as
      // a monochrome glyph, fillStyle decides its colour — so set a dark fill
      // (otherwise it inherits the white card colour and vanishes).
      ctx.fillStyle = titleColor;
      ctx.fillText(pill.emoji, x, 1 * m.sf);
      x += m.emojiSize + m.gap;
    }

    ctx.textAlign = 'left';
    if (pill.subtitle) {
      const blockH = m.titleSize + m.subSize * 1.18;
      const titleY = -blockH / 2 + m.titleSize / 2;
      const subY = titleY + m.titleSize / 2 + m.subSize * 0.72;
      ctx.font = `700 ${m.titleSize}px ${bodyFont}`;
      ctx.fillStyle = titleColor;
      ctx.fillText(pill.title || '', x, titleY);
      ctx.font = `500 ${m.subSize}px ${bodyFont}`;
      ctx.fillStyle = subColor;
      ctx.fillText(pill.subtitle, x, subY);
    } else {
      ctx.font = `700 ${m.titleSize}px ${bodyFont}`;
      ctx.fillStyle = titleColor;
      ctx.fillText(pill.title || '', x, 0);
    }
    ctx.restore();
  }

  function hexA(hex, a) {
    const h = String(hex).replace('#', '');
    const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // Pixel-space rects for hit testing (used by the drag editor)
  function getPillRects(canvasW, canvasH, state) {
    const meas = document.createElement('canvas').getContext('2d');
    const fonts = state.fonts || {};
    return (state.pills || []).map((pill) => {
      const m = pillMetrics(meas, pill, canvasW, fonts);
      return { id: pill.id, cx: (pill.x != null ? pill.x : 0.5) * canvasW, cy: (pill.y != null ? pill.y : 0.5) * canvasH, w: m.w, h: m.h, rotation: pill.rotation || 0 };
    });
  }

  function hitTestPill(px, py, rect) {
    const dx = px - rect.cx, dy = py - rect.cy;
    const a = -(rect.rotation || 0) * Math.PI / 180;
    const lx = dx * Math.cos(a) - dy * Math.sin(a);
    const ly = dx * Math.sin(a) + dy * Math.cos(a);
    return Math.abs(lx) <= rect.w / 2 && Math.abs(ly) <= rect.h / 2;
  }

  // Hit rects for this screen's own phones (for dragging)
  function getPhoneRects(canvasW, canvasH, state) {
    const frameType = state.device || 'iphone';
    return (state.phones || []).filter((p) => p.show !== false).map((p) => {
      const w = canvasW * ((p.scale != null ? p.scale : 55) / 100);
      const h = w / getPhoneAspectRatio(frameType);
      return { id: p.id, cx: (p.x != null ? p.x : 50) / 100 * canvasW, cy: (p.y != null ? p.y : 62) / 100 * canvasH, w, h, rotation: p.rotation || 0 };
    });
  }

  // Horizontal edges of a phone as canvas fractions (for bleed detection)
  function phoneEdges(p) {
    if (!p) return null;
    const scale = p.scale != null ? p.scale : 55;
    const x = (p.x != null ? p.x : 50) / 100;
    return { left: x - scale / 200, right: x + scale / 200 };
  }

  function paintPhone(ctx, W, H, p, frameType, xPercent) {
    if (!p || p.show === false) return;
    const pw = W * ((p.scale != null ? p.scale : 55) / 100);
    const ph = pw / getPhoneAspectRatio(frameType);
    drawPhoneMockup(ctx, W * (xPercent / 100), H * ((p.y != null ? p.y : 62) / 100), pw, ph, p.screenshot, {
      rotation: p.rotation || 0,
      shadow: p.shadow !== false,
      shadowIntensity: (p.shadowIntensity != null ? p.shadowIntensity : 40) / 100,
      shadowBlur: p.shadowBlur != null ? p.shadowBlur : 60,
      screenBrightness: p.screenBrightness || 0,
      frameType,
    });
  }

  // All phones (a screen can have several) as continuation-aware draw entries.
  function collectPhones(state, opts) {
    const frameType = state.device || 'iphone';
    const out = [];
    for (const p of (state.phones || [])) {
      if (p.show === false) continue;
      out.push({ phone: p, frameType, x: p.x != null ? p.x : 50, z: p.z || 0, order: 1 });
    }
    const prev = opts.prev, next = opts.next;
    if (prev && prev.phones) {
      const pt = prev.device || 'iphone';
      for (const p of prev.phones) {
        if (p.show === false) continue;
        const e = phoneEdges(p);
        if (e && e.right > 1.0) out.push({ phone: p, frameType: pt, x: (p.x != null ? p.x : 50) - 100, z: p.z || 0, order: 0 });
      }
    }
    if (next && next.phones) {
      const nt = next.device || 'iphone';
      for (const p of next.phones) {
        if (p.show === false) continue;
        const e = phoneEdges(p);
        if (e && e.left < 0.0) out.push({ phone: p, frameType: nt, x: (p.x != null ? p.x : 50) + 100, z: p.z || 0, order: 2 });
      }
    }
    out.sort((a, b) => (a.z - b.z) || (a.order - b.order)); // lower layer first → higher on top
    return out;
  }

  // ── Main render ──────────────────────────────────────────────────────────────
  function render(canvas, state, opts = {}) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    if (opts.panorama && opts.panorama.enabled) drawPanorama(ctx, W, H, opts.panorama, opts.index || 0, opts.count || 1, state.theme);
    else drawBackground(ctx, W, H, state.background, state.theme);

    if (state.header && state.header.show !== false) drawHeader(ctx, W, H, state);

    // Every phone that lands on this canvas — this screen's own phone(s) plus
    // continuations of neighbours whose phone bleeds across the seam — drawn
    // ordered by layer (phone.z) so the user controls overlap.
    for (const d of collectPhones(state, opts)) paintPhone(ctx, W, H, d.phone, d.frameType, d.x);

    const fonts = state.fonts || {};
    const selectedId = opts.selectedPillId;
    const accent = (state.theme && state.theme.accent) || '#7C3AED';
    for (const pill of (state.pills || [])) {
      drawPill(ctx, pill, W, H, fonts, { selected: pill.id === selectedId, accent });
    }

    // Drag-guides (only while dragging on the interactive canvas). vx/hy are
    // fractions (0..1); a guide line is drawn there to show alignment/snap.
    const g = opts.guides;
    if (g && (g.vx != null || g.hy != null)) {
      ctx.save();
      ctx.strokeStyle = accent;
      ctx.globalAlpha = 0.9;
      ctx.lineWidth = 2 * (W / DESIGN_W);
      ctx.setLineDash([12 * (W / DESIGN_W), 9 * (W / DESIGN_W)]);
      if (g.vx != null) { ctx.beginPath(); ctx.moveTo(g.vx * W, 0); ctx.lineTo(g.vx * W, H); ctx.stroke(); }
      if (g.hy != null) { ctx.beginPath(); ctx.moveTo(0, g.hy * H); ctx.lineTo(W, g.hy * H); ctx.stroke(); }
      ctx.restore();
    }
  }

  return {
    render, drawBackground, drawPhoneMockup, drawPill,
    getPhoneAspectRatio, getPillRects, getPhoneRects, hitTestPill, layoutHeader, getHeaderRect,
    setAssetLoadCallback(fn) { onAssetLoad = fn; },
    FRAMES,
  };
})();
