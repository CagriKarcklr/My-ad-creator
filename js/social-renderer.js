/**
 * Social Renderer — Canvas rendering engine for social media posts
 * Draws backgrounds (gradient/image/pattern), phone mockups, and text layers
 * Reuses Renderer for phone drawing, adds social-specific features
 */

window.SocialRenderer = (() => {
  'use strict';

  // Image cache for stock photo backgrounds
  const imageCache = new Map();

  /**
   * Main render function for social posts
   * @param {HTMLCanvasElement} canvas
   * @param {Object} state — social post state
   */
  function render(canvas, state) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 1. Background
    drawSocialBackground(ctx, W, H, state.background, state);

    // 2. Background overlay (optional dimming/tinting for readability)
    if (state.bgOverlay && state.bgOverlay.enabled) {
      ctx.fillStyle = state.bgOverlay.color || 'rgba(0,0,0,0.3)';
      ctx.fillRect(0, 0, W, H);
    }

    // 3. Phone mockup (show even without screenshot — placeholder screen)
    if (state.showPhone !== false) {
      const pw = W * (state.phoneScale / 100);
      const px = W * (state.phoneX / 100);
      const py = H * (state.phoneY / 100);

      Renderer.drawPhoneMockup(ctx, px, py, pw, pw / Renderer.PHONE_W_TO_H, state.screenshot || null, {
        rotation: state.phoneRotation || 0,
        shadow: state.phoneShadow !== false,
        shadowIntensity: (state.shadowIntensity || 40) / 100,
        shadowBlur: state.shadowBlur || 60,
        screenBrightness: state.screenBrightness || 0,
        perspective: state.phonePerspective || '',
      });
    }

    // 3b. Second phone mockup
    if (state.showPhone2) {
      const pw2 = W * (state.phone2Scale / 100);
      const px2 = W * (state.phone2X / 100);
      const py2 = H * (state.phone2Y / 100);

      Renderer.drawPhoneMockup(ctx, px2, py2, pw2, pw2 / Renderer.PHONE_W_TO_H, state.screenshot2 || null, {
        rotation: state.phone2Rotation || 0,
        shadow: state.phoneShadow !== false,
        shadowIntensity: (state.shadowIntensity || 40) / 100,
        shadowBlur: state.shadowBlur || 60,
        screenBrightness: state.screenBrightness || 0,
        perspective: state.phone2Perspective || '',
      });
    }

    // 4. Text layers
    if (state.texts) {
      for (const text of state.texts) {
        drawTextLayer(ctx, W, H, text);
      }
    }

    // 5. Logo overlay
    if (state.logo) {
      drawLogoOverlay(ctx, W, H, state);
    }
  }

  /**
   * Draw social media background
   */
  function drawSocialBackground(ctx, W, H, bg, state) {
    if (!bg) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
      return;
    }

    switch (bg.type) {
      case 'gradient':
        drawGradientBg(ctx, W, H, bg);
        break;
      case 'solid':
        ctx.fillStyle = bg.color || '#FFFFFF';
        ctx.fillRect(0, 0, W, H);
        break;
      case 'image':
        drawImageBg(ctx, W, H, bg);
        break;
      case 'pattern':
        drawPatternBg(ctx, W, H, bg);
        break;
      case 'iphone-mockup':
        drawIphoneMockupBg(ctx, W, H, bg, state);
        break;
      case 'custom':
        if (bg.customImage) {
          drawCustomImageBg(ctx, W, H, bg.customImage);
        } else {
          ctx.fillStyle = '#E8E8E8';
          ctx.fillRect(0, 0, W, H);
        }
        break;
      default:
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(0, 0, W, H);
    }
  }

  /**
   * Draw gradient background
   */
  function drawGradientBg(ctx, W, H, bg) {
    const angle = (bg.angle || 180) * Math.PI / 180;
    const cx = W / 2;
    const cy = H / 2;
    const len = Math.sqrt(W * W + H * H) / 2;
    const x1 = cx - Math.sin(angle) * len;
    const y1 = cy - Math.cos(angle) * len;
    const x2 = cx + Math.sin(angle) * len;
    const y2 = cy + Math.cos(angle) * len;

    const grad = ctx.createLinearGradient(x1, y1, x2, y2);
    const colors = bg.colors || ['#667eea', '#764ba2'];

    for (let i = 0; i < colors.length; i++) {
      grad.addColorStop(i / (colors.length - 1), colors[i]);
    }

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  /**
   * Draw stock image background (loaded from URL)
   */
  function drawImageBg(ctx, W, H, bg) {
    const url = bg.url;
    if (!url) {
      ctx.fillStyle = '#E8E8E8';
      ctx.fillRect(0, 0, W, H);
      return;
    }

    const cached = imageCache.get(url);
    if (cached && cached.complete && cached.naturalWidth > 0) {
      drawCoverImage(ctx, W, H, cached, bg.blur || 0);
    } else if (!cached) {
      // Start loading
      const img = new Image();
      img.crossOrigin = 'anonymous';
      imageCache.set(url, img);
      img.src = url;

      // Draw placeholder
      ctx.fillStyle = '#E0E0E0';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading background...', W / 2, H / 2);
    } else {
      // Still loading
      ctx.fillStyle = '#E0E0E0';
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#AAAAAA';
      ctx.font = '24px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading...', W / 2, H / 2);
    }
  }

  /**
   * Draw custom uploaded image as background
   */
  function drawCustomImageBg(ctx, W, H, img) {
    drawCoverImage(ctx, W, H, img, 0);
  }

  /**
   * Draw an image to cover the canvas (like CSS background-size: cover)
   */
  function drawCoverImage(ctx, W, H, img, blur) {
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const imgRatio = imgW / imgH;
    const canvasRatio = W / H;

    let drawW, drawH, drawX, drawY;
    if (imgRatio > canvasRatio) {
      drawH = H;
      drawW = H * imgRatio;
      drawX = (W - drawW) / 2;
      drawY = 0;
    } else {
      drawW = W;
      drawH = W / imgRatio;
      drawX = 0;
      drawY = (H - drawH) / 2;
    }

    ctx.save();
    if (blur > 0) {
      ctx.filter = `blur(${blur}px)`;
    }
    ctx.drawImage(img, drawX, drawY, drawW, drawH);
    ctx.restore();
  }

  // ==================== iPHONE MOCKUP PRESETS ====================
  const IPHONE_MOCKUP_PRESETS = [
    // --- CLEAN / MINIMAL ---
    { id: 'mk-center-white', name: 'Center — White', cat: 'clean', phone: { x: 50, y: 50, scale: 48, rot: 0 }, bgStyle: 'solid', bgColor: '#FFFFFF', shadow: { blur: 0.12, intensity: 0.2, oy: 0.04 } },
    { id: 'mk-center-cream', name: 'Center — Cream', cat: 'clean', phone: { x: 50, y: 50, scale: 48, rot: 0 }, bgStyle: 'solid', bgColor: '#F5F0EB', shadow: { blur: 0.12, intensity: 0.22, oy: 0.04 } },
    { id: 'mk-center-light-gray', name: 'Center — Light Gray', cat: 'clean', phone: { x: 50, y: 50, scale: 48, rot: 0 }, bgStyle: 'solid', bgColor: '#F0F0F0', shadow: { blur: 0.14, intensity: 0.18, oy: 0.04 } },
    { id: 'mk-center-dark', name: 'Center — Dark', cat: 'clean', phone: { x: 50, y: 50, scale: 48, rot: 0 }, bgStyle: 'solid', bgColor: '#1A1A1A', shadow: { blur: 0.16, intensity: 0.5, oy: 0.05 }, frameColor: 'silver' },
    { id: 'mk-left-aligned', name: 'Left Aligned', cat: 'clean', phone: { x: 32, y: 50, scale: 44, rot: 0 }, bgStyle: 'solid', bgColor: '#FAFAFA', shadow: { blur: 0.12, intensity: 0.2, oy: 0.04 } },
    { id: 'mk-right-aligned', name: 'Right Aligned', cat: 'clean', phone: { x: 68, y: 50, scale: 44, rot: 0 }, bgStyle: 'solid', bgColor: '#FAFAFA', shadow: { blur: 0.12, intensity: 0.2, oy: 0.04 } },
    // --- TILTED / ANGLED ---
    { id: 'mk-tilt-left', name: 'Tilt Left', cat: 'angled', phone: { x: 50, y: 50, scale: 46, rot: -12 }, bgStyle: 'gradient', bgColors: ['#667eea', '#764ba2'], bgAngle: 135, shadow: { blur: 0.14, intensity: 0.3, oy: 0.05 } },
    { id: 'mk-tilt-right', name: 'Tilt Right', cat: 'angled', phone: { x: 50, y: 50, scale: 46, rot: 12 }, bgStyle: 'gradient', bgColors: ['#f093fb', '#f5576c'], bgAngle: 135, shadow: { blur: 0.14, intensity: 0.3, oy: 0.05 } },
    { id: 'mk-dramatic-angle', name: 'Dramatic Angle', cat: 'angled', phone: { x: 45, y: 52, scale: 50, rot: -20 }, bgStyle: 'gradient', bgColors: ['#0c0c0c', '#1a1a2e', '#16213e'], bgAngle: 180, shadow: { blur: 0.18, intensity: 0.5, oy: 0.06 }, frameColor: 'silver' },
    { id: 'mk-slight-tilt', name: 'Slight Tilt', cat: 'angled', phone: { x: 50, y: 50, scale: 48, rot: -5 }, bgStyle: 'solid', bgColor: '#F8F6F3', shadow: { blur: 0.1, intensity: 0.18, oy: 0.03 } },
    { id: 'mk-perspective-left', name: '3D Left', cat: 'angled', phone: { x: 50, y: 50, scale: 46, rot: 0, perspective: 'left' }, bgStyle: 'gradient', bgColors: ['#e0eafc', '#cfdef3'], bgAngle: 180, shadow: { blur: 0.14, intensity: 0.25, oy: 0.05 } },
    { id: 'mk-perspective-right', name: '3D Right', cat: 'angled', phone: { x: 50, y: 50, scale: 46, rot: 0, perspective: 'right' }, bgStyle: 'gradient', bgColors: ['#ffecd2', '#fcb69f'], bgAngle: 180, shadow: { blur: 0.14, intensity: 0.25, oy: 0.05 } },
    // --- GRADIENT BACKGROUNDS ---
    { id: 'mk-grad-purple', name: 'Purple Haze', cat: 'gradient', phone: { x: 50, y: 52, scale: 46, rot: -3 }, bgStyle: 'gradient', bgColors: ['#a18cd1', '#fbc2eb'], bgAngle: 135, shadow: { blur: 0.14, intensity: 0.28, oy: 0.04 } },
    { id: 'mk-grad-ocean', name: 'Ocean Blue', cat: 'gradient', bgColors: ['#2193b0', '#6dd5ed'], bgAngle: 180, phone: { x: 50, y: 50, scale: 48, rot: 0 }, bgStyle: 'gradient', shadow: { blur: 0.14, intensity: 0.28, oy: 0.04 } },
    { id: 'mk-grad-sunset', name: 'Sunset', cat: 'gradient', phone: { x: 50, y: 50, scale: 46, rot: 5 }, bgStyle: 'gradient', bgColors: ['#fa709a', '#fee140'], bgAngle: 135, shadow: { blur: 0.14, intensity: 0.3, oy: 0.04 } },
    { id: 'mk-grad-forest', name: 'Forest', cat: 'gradient', phone: { x: 50, y: 50, scale: 46, rot: -4 }, bgStyle: 'gradient', bgColors: ['#134e5e', '#71b280'], bgAngle: 135, shadow: { blur: 0.14, intensity: 0.3, oy: 0.04 } },
    { id: 'mk-grad-midnight', name: 'Midnight', cat: 'gradient', phone: { x: 50, y: 50, scale: 48, rot: 0 }, bgStyle: 'gradient', bgColors: ['#0f0c29', '#302b63', '#24243e'], bgAngle: 180, shadow: { blur: 0.16, intensity: 0.45, oy: 0.05 }, frameColor: 'silver' },
    { id: 'mk-grad-peach', name: 'Peach', cat: 'gradient', phone: { x: 50, y: 50, scale: 46, rot: 3 }, bgStyle: 'gradient', bgColors: ['#fdfcfb', '#e2d1c3'], bgAngle: 180, shadow: { blur: 0.12, intensity: 0.2, oy: 0.04 } },
    // --- FLOATING / HERO ---
    { id: 'mk-float-shadow', name: 'Floating Shadow', cat: 'hero', phone: { x: 50, y: 45, scale: 50, rot: 0 }, bgStyle: 'solid', bgColor: '#F5F5F5', shadow: { blur: 0.25, intensity: 0.15, oy: 0.12 }, reflection: true },
    { id: 'mk-hero-large', name: 'Hero Large', cat: 'hero', phone: { x: 50, y: 55, scale: 60, rot: 0 }, bgStyle: 'gradient', bgColors: ['#141E30', '#243B55'], bgAngle: 180, shadow: { blur: 0.2, intensity: 0.4, oy: 0.06 }, frameColor: 'silver' },
    { id: 'mk-peek-bottom', name: 'Peek from Bottom', cat: 'hero', phone: { x: 50, y: 68, scale: 55, rot: 0 }, bgStyle: 'gradient', bgColors: ['#c471f5', '#fa71cd'], bgAngle: 135, shadow: { blur: 0.14, intensity: 0.3, oy: 0.04 } },
    { id: 'mk-float-neon', name: 'Neon Glow', cat: 'hero', phone: { x: 50, y: 50, scale: 46, rot: 0 }, bgStyle: 'solid', bgColor: '#0a0a0a', shadow: { blur: 0.16, intensity: 0.5, oy: 0.05 }, neonGlow: '#6366f1', frameColor: 'silver' },
    // --- SCENE / LIFESTYLE ---
    { id: 'mk-desk-minimal', name: 'Desk — Minimal', cat: 'scene', phone: { x: 50, y: 48, scale: 42, rot: -2 }, bgStyle: 'solid', bgColor: '#F0EDE8', shadow: { blur: 0.08, intensity: 0.15, oy: 0.02 }, scene: 'desk-minimal' },
    { id: 'mk-desk-coffee', name: 'Desk & Coffee', cat: 'scene', phone: { x: 40, y: 50, scale: 38, rot: -3 }, bgStyle: 'solid', bgColor: '#FAF7F2', shadow: { blur: 0.08, intensity: 0.15, oy: 0.02 }, scene: 'desk-coffee' },
    { id: 'mk-desk-plant', name: 'Desk & Plant', cat: 'scene', phone: { x: 55, y: 52, scale: 40, rot: 2 }, bgStyle: 'solid', bgColor: '#F5F2ED', shadow: { blur: 0.08, intensity: 0.15, oy: 0.02 }, scene: 'desk-plant' },
    { id: 'mk-hand-hold', name: 'Hand Holding', cat: 'scene', phone: { x: 50, y: 55, scale: 44, rot: 4 }, bgStyle: 'gradient', bgColors: ['#ffecd2', '#fcb69f'], bgAngle: 180, shadow: { blur: 0.1, intensity: 0.2, oy: 0.03 }, scene: 'hand' },
    { id: 'mk-flatlay-top', name: 'Flat Lay Top-Down', cat: 'scene', phone: { x: 50, y: 50, scale: 50, rot: 0 }, bgStyle: 'solid', bgColor: '#E8E3DB', shadow: { blur: 0.05, intensity: 0.12, oy: 0.01 }, scene: 'flatlay' },
    { id: 'mk-dual-phones', name: 'Dual Phones', cat: 'scene', phone: { x: 38, y: 50, scale: 38, rot: -6 }, phone2: { x: 62, y: 52, scale: 36, rot: 6 }, bgStyle: 'gradient', bgColors: ['#e0eafc', '#cfdef3'], bgAngle: 135, shadow: { blur: 0.12, intensity: 0.22, oy: 0.04 } },
  ];

  /**
   * Draw iPhone mockup background using a preset
   */
  function drawIphoneMockupBg(ctx, W, H, bg, state) {
    const presetId = bg.mockupPresetId || 'mk-center-cream';
    const preset = IPHONE_MOCKUP_PRESETS.find(p => p.id === presetId) || IPHONE_MOCKUP_PRESETS[1];
    const screenImg = bg.iphoneMockupScreenImage || (state && state.iphoneMockupScreenImage);

    // Allow user to override bg color
    const userBgColor = bg.mockupBgColor;

    // 1. Draw background
    _drawMockupBackground(ctx, W, H, preset, userBgColor);

    // 2. Draw scene decorations (before phone)
    if (preset.scene) {
      _drawSceneDecorations(ctx, W, H, preset, 'before');
    }

    // 3. Draw phone(s)
    _drawMockupPhone(ctx, W, H, preset.phone, screenImg, preset, state);

    // Second phone (same screen or placeholder)
    if (preset.phone2) {
      _drawMockupPhone(ctx, W, H, preset.phone2, screenImg, preset, state);
    }

    // 4. Draw scene decorations (after phone — overlays)
    if (preset.scene) {
      _drawSceneDecorations(ctx, W, H, preset, 'after');
    }

    // 5. Reflection effect
    if (preset.reflection) {
      _drawReflection(ctx, W, H, preset.phone, screenImg, preset, state);
    }

    // 6. Neon glow
    if (preset.neonGlow) {
      _drawNeonGlow(ctx, W, H, preset.phone, preset.neonGlow);
    }
  }

  /** Draw background for mockup preset */
  function _drawMockupBackground(ctx, W, H, preset, userBgColor) {
    if (preset.bgStyle === 'gradient') {
      const colors = preset.bgColors || ['#667eea', '#764ba2'];
      const angle = (preset.bgAngle || 180) * Math.PI / 180;
      const cx = W / 2, cy = H / 2;
      const len = Math.sqrt(W * W + H * H) / 2;
      const grad = ctx.createLinearGradient(
        cx - Math.sin(angle) * len, cy - Math.cos(angle) * len,
        cx + Math.sin(angle) * len, cy + Math.cos(angle) * len
      );
      for (let i = 0; i < colors.length; i++) grad.addColorStop(i / (colors.length - 1), colors[i]);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = userBgColor || preset.bgColor || '#F5F0EB';
      ctx.fillRect(0, 0, W, H);
    }
    // Subtle radial light
    const rg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
    rg.addColorStop(0, 'rgba(255,255,255,0.08)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
  }

  /** Draw a single generative iPhone for a mockup preset */
  function _drawMockupPhone(ctx, W, H, phoneDef, screenImg, preset, state) {
    const scale = phoneDef.scale / 100;
    const phoneW = W * scale;
    const phoneH = phoneW / 0.4853;
    const cx = W * (phoneDef.x / 100);
    const cy = H * (phoneDef.y / 100);
    const rot = phoneDef.rot || 0;
    const perspectiveType = phoneDef.perspective || '';
    const cr = phoneW * 0.18;
    const isLight = preset.frameColor === 'silver';
    const shadow = preset.shadow || { blur: 0.12, intensity: 0.22, oy: 0.04 };

    ctx.save();

    // Rotation
    if (rot !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate(rot * Math.PI / 180);
      ctx.translate(-cx, -cy);
    }

    // Perspective
    if (perspectiveType) {
      ctx.translate(cx, cy);
      switch (perspectiveType) {
        case 'left': ctx.transform(0.95, 0.04, 0, 1.02, 0, 0); break;
        case 'right': ctx.transform(0.95, -0.04, 0, 1.02, 0, 0); break;
        case 'left-strong': ctx.transform(0.88, 0.08, 0, 1.04, 0, 0); break;
        case 'right-strong': ctx.transform(0.88, -0.08, 0, 1.04, 0, 0); break;
      }
      ctx.translate(-cx, -cy);
    }

    const phoneX = cx - phoneW / 2;
    const phoneY = cy - phoneH / 2;

    // --- Drop shadow ---
    ctx.save();
    ctx.shadowColor = `rgba(0,0,0,${shadow.intensity})`;
    ctx.shadowBlur = phoneW * shadow.blur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = phoneW * shadow.oy;
    roundedRectPath(ctx, phoneX, phoneY, phoneW, phoneH, cr);
    ctx.fillStyle = isLight ? '#D1D1D6' : '#1C1C1E';
    ctx.fill();
    ctx.restore();

    // --- Phone body ---
    const fg1 = isLight ? '#E5E5EA' : '#2C2C2E';
    const fg2 = isLight ? '#D1D1D6' : '#3A3A3C';
    const fg3 = isLight ? '#C7C7CC' : '#1C1C1E';
    const frameGrad = ctx.createLinearGradient(phoneX, phoneY, phoneX + phoneW, phoneY + phoneH);
    frameGrad.addColorStop(0, fg1);
    frameGrad.addColorStop(0.5, fg2);
    frameGrad.addColorStop(1, fg3);
    roundedRectPath(ctx, phoneX, phoneY, phoneW, phoneH, cr);
    ctx.fillStyle = frameGrad;
    ctx.fill();

    // Edge highlight
    ctx.save();
    roundedRectPath(ctx, phoneX, phoneY, phoneW, phoneH, cr);
    ctx.clip();
    const shineGrad = ctx.createLinearGradient(phoneX, phoneY, phoneX + phoneW * 0.5, phoneY + phoneH * 0.3);
    shineGrad.addColorStop(0, isLight ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = shineGrad;
    ctx.fillRect(phoneX, phoneY, phoneW, phoneH);
    ctx.restore();

    // --- Side buttons ---
    const btnW = phoneW * 0.012;
    const btnColor = isLight ? '#C7C7CC' : '#3A3A3C';
    ctx.fillStyle = btnColor;
    // Volume buttons (left)
    const volH = phoneH * 0.06, volGap = phoneH * 0.015, volTop = phoneY + phoneH * 0.2;
    roundedRectPath(ctx, phoneX - btnW, volTop, btnW, volH, btnW / 2); ctx.fill();
    roundedRectPath(ctx, phoneX - btnW, volTop + volH + volGap, btnW, volH, btnW / 2); ctx.fill();
    // Action button
    roundedRectPath(ctx, phoneX - btnW, phoneY + phoneH * 0.14, btnW, phoneH * 0.035, btnW / 2); ctx.fill();
    // Power (right)
    roundedRectPath(ctx, phoneX + phoneW, phoneY + phoneH * 0.22, btnW, phoneH * 0.08, btnW / 2); ctx.fill();

    // --- Screen area ---
    const bezel = phoneW * 0.038;
    const sx = phoneX + bezel, sy = phoneY + bezel;
    const sw = phoneW - bezel * 2, sh = phoneH - bezel * 2;
    const sr = cr - bezel * 0.7;

    ctx.save();
    roundedRectPath(ctx, sx, sy, sw, sh, sr);
    ctx.clip();

    if (screenImg) {
      const iw = screenImg.naturalWidth || screenImg.width;
      const ih = screenImg.naturalHeight || screenImg.height;
      const ir = iw / ih, scrR = sw / sh;
      let dw, dh, dx, dy;
      if (ir > scrR) { dh = sh; dw = sh * ir; dx = sx + (sw - dw) / 2; dy = sy; }
      else { dw = sw; dh = sw / ir; dx = sx; dy = sy + (sh - dh) / 2; }
      ctx.drawImage(screenImg, dx, dy, dw, dh);
    } else {
      const sGrad = ctx.createLinearGradient(sx, sy, sx, sy + sh);
      sGrad.addColorStop(0, '#1a1a2e');
      sGrad.addColorStop(0.5, '#16213e');
      sGrad.addColorStop(1, '#0f3460');
      ctx.fillStyle = sGrad;
      ctx.fillRect(sx, sy, sw, sh);
      const ps = Math.round(sw * 0.055);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.font = `500 ${ps}px "Inter", -apple-system, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Your screenshot here', sx + sw / 2, sy + sh / 2);
    }

    // Dynamic Island
    const diW = sw * 0.28, diH = sw * 0.075;
    const diX = sx + (sw - diW) / 2, diY = sy + sw * 0.035;
    ctx.fillStyle = '#000';
    roundedRectPath(ctx, diX, diY, diW, diH, diH / 2); ctx.fill();
    ctx.fillStyle = '#1a1a2e';
    ctx.beginPath(); ctx.arc(diX + diW * 0.72, diY + diH / 2, diH * 0.2, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'rgba(60,60,80,0.6)';
    ctx.beginPath(); ctx.arc(diX + diW * 0.72, diY + diH / 2, diH * 0.1, 0, Math.PI * 2); ctx.fill();

    // Home indicator
    const barW = sw * 0.35, barH = sw * 0.012;
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    roundedRectPath(ctx, sx + (sw - barW) / 2, sy + sh - sw * 0.04, barW, barH, barH / 2); ctx.fill();

    ctx.restore();

    // Screen border
    ctx.save();
    roundedRectPath(ctx, sx, sy, sw, sh, sr);
    ctx.strokeStyle = isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();

    ctx.restore(); // rotation/perspective
  }

  /** Draw reflection beneath the phone */
  function _drawReflection(ctx, W, H, phoneDef, screenImg, preset) {
    const scale = phoneDef.scale / 100;
    const phoneW = W * scale;
    const phoneH = phoneW / 0.4853;
    const cx = W * (phoneDef.x / 100);
    const cy = H * (phoneDef.y / 100);
    const phoneBottom = cy + phoneH / 2;
    const reflH = phoneH * 0.3;

    ctx.save();
    ctx.globalAlpha = 0.08;
    ctx.translate(cx, phoneBottom);
    ctx.scale(1, -0.3);
    ctx.translate(-cx, -phoneBottom);

    const cr = phoneW * 0.18;
    const phoneX = cx - phoneW / 2;
    const phoneY = cy - phoneH / 2;
    roundedRectPath(ctx, phoneX, phoneY, phoneW, phoneH, cr);
    ctx.fillStyle = '#888';
    ctx.fill();
    ctx.restore();

    // Fade out the reflection
    const fadeGrad = ctx.createLinearGradient(0, phoneBottom, 0, phoneBottom + reflH);
    fadeGrad.addColorStop(0, 'rgba(255,255,255,0)');
    fadeGrad.addColorStop(1, preset.bgStyle === 'gradient' ? 'rgba(0,0,0,0)' : (preset.bgColor || '#F5F5F5'));
    ctx.fillStyle = fadeGrad;
    ctx.fillRect(0, phoneBottom, W, reflH);
  }

  /** Draw neon glow behind the phone */
  function _drawNeonGlow(ctx, W, H, phoneDef, color) {
    const scale = phoneDef.scale / 100;
    const phoneW = W * scale;
    const phoneH = phoneW / 0.4853;
    const cx = W * (phoneDef.x / 100);
    const cy = H * (phoneDef.y / 100);

    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    // Outer glow
    const rg = ctx.createRadialGradient(cx, cy, phoneW * 0.3, cx, cy, phoneW * 1.0);
    rg.addColorStop(0, color + '55');
    rg.addColorStop(0.5, color + '20');
    rg.addColorStop(1, color + '00');
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, W, H);
    // Inner glow (tight)
    const ig = ctx.createRadialGradient(cx, cy, 0, cx, cy, phoneW * 0.55);
    ig.addColorStop(0, color + '30');
    ig.addColorStop(1, color + '00');
    ctx.fillStyle = ig;
    ctx.fillRect(cx - phoneW, cy - phoneH * 0.6, phoneW * 2, phoneH * 1.2);
    ctx.restore();
  }

  /** Draw scene decorative elements */
  function _drawSceneDecorations(ctx, W, H, preset, phase) {
    const scene = preset.scene;
    if (!scene) return;

    if (scene === 'desk-minimal' && phase === 'before') {
      // Surface line
      const surfY = H * 0.72;
      ctx.fillStyle = 'rgba(0,0,0,0.03)';
      ctx.fillRect(0, surfY, W, H - surfY);
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, surfY); ctx.lineTo(W, surfY); ctx.stroke();
      // Small pen
      ctx.save(); ctx.translate(W * 0.78, H * 0.56); ctx.rotate(-0.3);
      ctx.fillStyle = '#3A3A3C'; roundedRectPath(ctx, 0, 0, W * 0.015, H * 0.12, 3); ctx.fill();
      ctx.fillStyle = '#FFD700'; ctx.fillRect(0, H * 0.12 - 4, W * 0.015, 4);
      ctx.restore();
      // Notepad
      ctx.fillStyle = '#FFFDE7';
      roundedRectPath(ctx, W * 0.72, H * 0.62, W * 0.16, H * 0.12, 4); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
      roundedRectPath(ctx, W * 0.72, H * 0.62, W * 0.16, H * 0.12, 4); ctx.stroke();
      // Lines on notepad
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      for (let i = 1; i <= 4; i++) {
        const ly = H * 0.62 + (H * 0.12 / 5) * i;
        ctx.beginPath(); ctx.moveTo(W * 0.735, ly); ctx.lineTo(W * 0.865, ly); ctx.stroke();
      }
    }

    if (scene === 'desk-coffee' && phase === 'before') {
      // Surface
      const surfY = H * 0.72;
      ctx.fillStyle = 'rgba(0,0,0,0.025)';
      ctx.fillRect(0, surfY, W, H - surfY);
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, surfY); ctx.lineTo(W, surfY); ctx.stroke();
      // Coffee cup (top view - circle) 
      const cupX = W * 0.75, cupY = H * 0.45, cupR = W * 0.07;
      // Saucer
      ctx.beginPath(); ctx.arc(cupX, cupY, cupR * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = '#F5F5F0'; ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.stroke();
      // Cup
      ctx.beginPath(); ctx.arc(cupX, cupY, cupR, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF'; ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.stroke();
      // Coffee surface
      ctx.beginPath(); ctx.arc(cupX, cupY, cupR * 0.85, 0, Math.PI * 2);
      ctx.fillStyle = '#5D3A1A'; ctx.fill();
      // Highlight on coffee
      ctx.beginPath(); ctx.arc(cupX - cupR * 0.2, cupY - cupR * 0.2, cupR * 0.25, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; ctx.fill();
      // Cup handle
      ctx.beginPath();
      ctx.arc(cupX + cupR * 1.1, cupY, cupR * 0.35, -0.8, 0.8);
      ctx.strokeStyle = 'rgba(0,0,0,0.1)'; ctx.lineWidth = cupR * 0.12; ctx.stroke();
    }

    if (scene === 'desk-plant' && phase === 'before') {
      // Surface
      const surfY = H * 0.72;
      ctx.fillStyle = 'rgba(0,0,0,0.025)';
      ctx.fillRect(0, surfY, W, H - surfY);
      // Plant pot
      const potX = W * 0.18, potY = H * 0.58;
      const potW = W * 0.08, potH = H * 0.06;
      // Pot body (trapezoid)
      ctx.fillStyle = '#D2691E';
      ctx.beginPath();
      ctx.moveTo(potX - potW * 0.4, potY);
      ctx.lineTo(potX + potW * 0.4, potY);
      ctx.lineTo(potX + potW * 0.3, potY + potH);
      ctx.lineTo(potX - potW * 0.3, potY + potH);
      ctx.closePath(); ctx.fill();
      // Pot rim
      ctx.fillStyle = '#C05A20';
      roundedRectPath(ctx, potX - potW * 0.45, potY - potH * 0.12, potW * 0.9, potH * 0.15, 2); ctx.fill();
      // Soil
      ctx.beginPath(); ctx.arc(potX, potY + 2, potW * 0.35, Math.PI, 0);
      ctx.fillStyle = '#3E2723'; ctx.fill();
      // Leaves (simple ovals)
      const leafColors = ['#2E7D32', '#388E3C', '#43A047', '#4CAF50', '#66BB6A'];
      const leaves = [
        { angle: -0.8, len: H * 0.1 }, { angle: -0.3, len: H * 0.12 },
        { angle: 0.1, len: H * 0.11 }, { angle: 0.5, len: H * 0.09 },
        { angle: 0.8, len: H * 0.08 }, { angle: -0.5, len: H * 0.07 },
        { angle: 0.3, len: H * 0.06 },
      ];
      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i];
        ctx.save();
        ctx.translate(potX, potY - 2);
        ctx.rotate(l.angle);
        ctx.beginPath();
        ctx.ellipse(0, -l.len * 0.6, potW * 0.12, l.len * 0.45, 0, 0, Math.PI * 2);
        ctx.fillStyle = leafColors[i % leafColors.length];
        ctx.fill();
        // Leaf vein
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, -l.len * 0.9); ctx.stroke();
        ctx.restore();
      }
    }

    if (scene === 'hand' && phase === 'before') {
      // Abstract hand shape behind phone
      const px = W * (preset.phone.x / 100);
      const py = H * (preset.phone.y / 100);
      const pScale = preset.phone.scale / 100;
      const pW = W * pScale;
      const pH = pW / 0.4853;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate((preset.phone.rot || 0) * Math.PI / 180);

      // Palm (rounded)
      ctx.fillStyle = '#E8C4A0';
      ctx.beginPath();
      ctx.ellipse(pW * 0.02, pH * 0.15, pW * 0.42, pH * 0.28, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thumb (left side)
      ctx.save();
      ctx.translate(-pW * 0.35, -pH * 0.05);
      ctx.rotate(-0.3);
      ctx.beginPath();
      ctx.ellipse(0, 0, pW * 0.1, pH * 0.12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#DEAE7B';
      ctx.fill();
      ctx.restore();

      // Fingers wrapping (right side)
      const fingerData = [
        { ox: pW * 0.38, oy: -pH * 0.08, rx: pW * 0.06, ry: pH * 0.1 },
        { ox: pW * 0.4, oy: pH * 0.05, rx: pW * 0.055, ry: pH * 0.09 },
        { ox: pW * 0.38, oy: pH * 0.17, rx: pW * 0.05, ry: pH * 0.08 },
        { ox: pW * 0.32, oy: pH * 0.28, rx: pW * 0.05, ry: pH * 0.075 },
      ];
      for (const f of fingerData) {
        ctx.beginPath();
        ctx.ellipse(f.ox, f.oy, f.rx, f.ry, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#DEAE7B';
        ctx.fill();
      }

      ctx.restore();
    }

    if (scene === 'flatlay' && phase === 'before') {
      // Flat lay accessories scattered around
      const bgCol = preset.bgColor || '#E8E3DB';
      // AirPods case
      const apX = W * 0.78, apY = H * 0.35;
      ctx.save(); ctx.translate(apX, apY); ctx.rotate(0.2);
      ctx.fillStyle = '#FFFFFF';
      roundedRectPath(ctx, -W * 0.04, -H * 0.035, W * 0.08, H * 0.07, W * 0.025); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.08)'; ctx.lineWidth = 1;
      roundedRectPath(ctx, -W * 0.04, -H * 0.035, W * 0.08, H * 0.07, W * 0.025); ctx.stroke();
      // Hinge line
      ctx.strokeStyle = 'rgba(0,0,0,0.06)';
      ctx.beginPath(); ctx.moveTo(-W * 0.03, -H * 0.005); ctx.lineTo(W * 0.03, -H * 0.005); ctx.stroke();
      // LED dot
      ctx.fillStyle = '#4CAF50'; ctx.beginPath(); ctx.arc(0, H * 0.015, 2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Watch
      const wX = W * 0.2, wY = H * 0.32;
      ctx.save(); ctx.translate(wX, wY); ctx.rotate(-0.3);
      // Band
      ctx.fillStyle = '#444';
      roundedRectPath(ctx, -W * 0.015, -H * 0.06, W * 0.03, H * 0.12, 4); ctx.fill();
      // Watch body
      roundedRectPath(ctx, -W * 0.025, -H * 0.025, W * 0.05, H * 0.05, W * 0.012);
      ctx.fillStyle = '#2C2C2E'; ctx.fill();
      // Screen
      roundedRectPath(ctx, -W * 0.02, -H * 0.02, W * 0.04, H * 0.04, W * 0.008);
      ctx.fillStyle = '#000'; ctx.fill();
      // Crown
      ctx.fillStyle = '#555';
      roundedRectPath(ctx, W * 0.025, -H * 0.005, W * 0.006, H * 0.01, 1); ctx.fill();
      ctx.restore();

      // Pen
      ctx.save(); ctx.translate(W * 0.28, H * 0.68); ctx.rotate(0.6);
      ctx.fillStyle = '#1a1a1a'; roundedRectPath(ctx, 0, 0, W * 0.01, H * 0.15, 3); ctx.fill();
      ctx.fillStyle = '#C0C0C0'; ctx.fillRect(0, 0, W * 0.01, H * 0.008);
      ctx.fillStyle = '#2196F3'; roundedRectPath(ctx, W * 0.002, -H * 0.01, W * 0.006, H * 0.01, 2); ctx.fill();
      ctx.restore();

      // Small card/business card
      ctx.save(); ctx.translate(W * 0.75, H * 0.68); ctx.rotate(-0.15);
      ctx.fillStyle = '#FFF';
      roundedRectPath(ctx, 0, 0, W * 0.14, H * 0.06, 3); ctx.fill();
      ctx.strokeStyle = 'rgba(0,0,0,0.06)'; ctx.lineWidth = 1;
      roundedRectPath(ctx, 0, 0, W * 0.14, H * 0.06, 3); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      roundedRectPath(ctx, W * 0.01, H * 0.015, W * 0.08, H * 0.005, 2); ctx.fill();
      roundedRectPath(ctx, W * 0.01, H * 0.028, W * 0.06, H * 0.004, 2); ctx.fill();
      ctx.restore();
    }
  }

  /**
   * Draw a thumbnail for a mockup preset (used in the picker grid)
   */
  function drawMockupThumbnail(canvas, preset) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    _drawMockupBackground(ctx, W, H, preset, null);

    // Simplified phone (small thumbnail)
    const ph = preset.phone;
    const phoneW = W * (ph.scale / 100) * 0.9;
    const phoneH = phoneW / 0.4853;
    const cx = W * (ph.x / 100);
    const cy = H * (ph.y / 100);
    const rot = ph.rot || 0;
    const cr = phoneW * 0.17;

    ctx.save();
    if (rot !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate(rot * Math.PI / 180);
      ctx.translate(-cx, -cy);
    }
    if (ph.perspective) {
      ctx.translate(cx, cy);
      switch (ph.perspective) {
        case 'left': ctx.transform(0.95, 0.04, 0, 1.02, 0, 0); break;
        case 'right': ctx.transform(0.95, -0.04, 0, 1.02, 0, 0); break;
      }
      ctx.translate(-cx, -cy);
    }

    const px = cx - phoneW / 2, py = cy - phoneH / 2;
    const isLight = preset.frameColor === 'silver';

    // Shadow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = phoneW * 0.08;
    ctx.shadowOffsetY = phoneW * 0.03;
    roundedRectPath(ctx, px, py, phoneW, phoneH, cr);
    ctx.fillStyle = isLight ? '#D1D1D6' : '#1a1a1a';
    ctx.fill();
    ctx.restore();

    // Body
    roundedRectPath(ctx, px, py, phoneW, phoneH, cr);
    ctx.fillStyle = isLight ? '#E5E5EA' : '#2C2C2E';
    ctx.fill();

    // Screen
    const bz = phoneW * 0.05;
    roundedRectPath(ctx, px + bz, py + bz, phoneW - bz * 2, phoneH - bz * 2, cr - bz);
    const sg = ctx.createLinearGradient(px, py, px, py + phoneH);
    sg.addColorStop(0, '#1a1a2e');
    sg.addColorStop(1, '#0f3460');
    ctx.fillStyle = sg;
    ctx.fill();

    // Second phone in thumbnail
    if (preset.phone2) {
      const p2 = preset.phone2;
      const pw2 = W * (p2.scale / 100) * 0.9;
      const ph2 = pw2 / 0.4853;
      const cx2 = W * (p2.x / 100), cy2 = H * (p2.y / 100);
      const cr2 = pw2 * 0.17;
      ctx.save();
      if (p2.rot) { ctx.translate(cx2, cy2); ctx.rotate(p2.rot * Math.PI / 180); ctx.translate(-cx2, -cy2); }
      roundedRectPath(ctx, cx2 - pw2 / 2, cy2 - ph2 / 2, pw2, ph2, cr2);
      ctx.fillStyle = isLight ? '#E5E5EA' : '#2C2C2E'; ctx.fill();
      const bz2 = pw2 * 0.05;
      roundedRectPath(ctx, cx2 - pw2 / 2 + bz2, cy2 - ph2 / 2 + bz2, pw2 - bz2 * 2, ph2 - bz2 * 2, cr2 - bz2);
      ctx.fillStyle = sg; ctx.fill();
      ctx.restore();
    }

    ctx.restore();

    // Neon glow indicator in thumbnail
    if (preset.neonGlow) {
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, phoneW * 0.8);
      rg.addColorStop(0, preset.neonGlow + '40');
      rg.addColorStop(1, preset.neonGlow + '00');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
    }
  }

  /**
   * Draw canvas-generated pattern background
   */
  function drawPatternBg(ctx, W, H, bg) {
    const patternId = bg.patternId;
    const pattern = BackgroundLibrary.PATTERNS.find(p => p.id === patternId);
    if (pattern) {
      pattern.generate(ctx, W, H, bg.accent);
    } else {
      ctx.fillStyle = '#E8E8E8';
      ctx.fillRect(0, 0, W, H);
    }
  }

  /**
   * Draw logo/image overlay
   */
  function drawLogoOverlay(ctx, W, H, state) {
    const img = state.logo;
    const scale = (state.logoScale || 15) / 100;
    const opacity = (state.logoOpacity ?? 100) / 100;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    const ratio = imgW / imgH;

    const drawW = W * scale;
    const drawH = drawW / ratio;
    const x = W * (state.logoX / 100) - drawW / 2;
    const y = H * (state.logoY / 100) - drawH / 2;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, x, y, drawW, drawH);
    ctx.restore();
  }

  /**
   * Draw text layer with word wrapping and advanced styling
   */
  function drawTextLayer(ctx, canvasW, canvasH, text) {
    if (!text.content || text.content.trim() === '') return;

    const fontSize = text.size || 48;
    const fontWeight = text.weight || 700;
    const fontFamily = text.font || 'Inter';
    const color = text.color || '#FFFFFF';
    const align = text.align || 'center';
    const lineHeight = text.lineHeight || 1.15;
    const maxWidth = (text.maxWidth / 100) * canvasW || canvasW * 0.85;
    const letterSpacing = text.letterSpacing || 0;

    const posX = (text.x / 100) * canvasW;
    const posY = (text.y / 100) * canvasH;

    ctx.save();

    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", "SF Pro Display", -apple-system, system-ui, sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = align;
    ctx.textBaseline = 'top';

    // Text shadow
    if (text.shadow) {
      ctx.shadowColor = text.shadowColor || 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = text.shadowBlur || 10;
      ctx.shadowOffsetX = text.shadowOffsetX || 0;
      ctx.shadowOffsetY = text.shadowOffsetY || 4;
    }

    const paragraphs = text.content.split('\n');
    let currentY = posY;

    for (const paragraph of paragraphs) {
      const lines = wrapText(ctx, paragraph, maxWidth);
      for (const line of lines) {
        if (letterSpacing !== 0) {
          drawTextWithSpacing(ctx, line, posX, currentY, letterSpacing, align);
        } else {
          ctx.fillText(line, posX, currentY);
        }
        currentY += fontSize * lineHeight;
      }
    }

    ctx.restore();
  }

  function wrapText(ctx, text, maxWidth) {
    if (!text) return [''];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      if (ctx.measureText(testLine).width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    if (lines.length === 0) lines.push('');
    return lines;
  }

  function drawTextWithSpacing(ctx, text, x, y, spacing, align) {
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
      totalWidth += ctx.measureText(text[i]).width + (i < text.length - 1 ? spacing : 0);
    }

    let startX;
    if (align === 'center') startX = x - totalWidth / 2;
    else if (align === 'right') startX = x - totalWidth;
    else startX = x;

    const savedAlign = ctx.textAlign;
    ctx.textAlign = 'left';
    let currentX = startX;
    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], currentX, y);
      currentX += ctx.measureText(text[i]).width + spacing;
    }
    ctx.textAlign = savedAlign;
  }

  /**
   * Load a stock photo and trigger callback when ready
   */
  function preloadImage(url, onLoad) {
    if (imageCache.has(url)) {
      const img = imageCache.get(url);
      if (img.complete && img.naturalWidth > 0) {
        if (onLoad) onLoad(img);
        return img;
      }
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    imageCache.set(url, img);
    img.onload = () => {
      if (onLoad) onLoad(img);
    };
    img.src = url;
    return img;
  }

  /**
   * Check if an image URL is loaded and ready
   */
  function isImageLoaded(url) {
    const img = imageCache.get(url);
    return img && img.complete && img.naturalWidth > 0;
  }

  /**
   * Draw a thumbnail preview of a template
   */
  function drawTemplateThumbnail(canvas, template) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    const bg = template.background;
    if (bg.type === 'gradient') {
      const gradient = bg.gradientId
        ? BackgroundLibrary.getGradientById(bg.gradientId)
        : { colors: bg.colors || ['#667eea', '#764ba2'], angle: bg.angle || 180 };
      if (gradient) {
        drawGradientBg(ctx, W, H, { colors: gradient.colors, angle: gradient.angle });
      }
    } else if (bg.type === 'solid') {
      ctx.fillStyle = bg.color || '#FFFFFF';
      ctx.fillRect(0, 0, W, H);
    } else {
      ctx.fillStyle = '#E0E0E0';
      ctx.fillRect(0, 0, W, H);
    }

    // Phone placeholder
    if (template.phone) {
      const ph = template.phone;
      const pw = W * (ph.scale / 100) * 0.65;
      const pHeight = pw / Renderer.PHONE_W_TO_H;
      const px = W * (ph.x / 100);
      const py = H * (ph.y / 100);

      ctx.save();
      if (ph.rotation) {
        ctx.translate(px, py);
        ctx.rotate(ph.rotation * Math.PI / 180);
        ctx.translate(-px, -py);
      }

      const phoneX = px - pw / 2;
      const phoneY = py - pHeight / 2;
      const cr = pw * 0.17;

      roundedRectPath(ctx, phoneX, phoneY, pw, pHeight, cr);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();

      const bezel = pw * 0.04;
      roundedRectPath(ctx, phoneX + bezel, phoneY + bezel, pw - bezel * 2, pHeight - bezel * 2, cr - bezel);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fill();

      ctx.restore();
    }

    // Text placeholders
    if (template.texts) {
      for (const text of template.texts) {
        const tx = W * (text.x / 100);
        const ty = H * (text.y / 100);
        const textW = W * ((text.maxWidth || 80) / 100) * 0.6;
        const textH = 3;
        ctx.fillStyle = text.color ? text.color + '60' : 'rgba(255,255,255,0.4)';

        let startX;
        if (text.align === 'left') startX = tx;
        else if (text.align === 'right') startX = tx - textW;
        else startX = tx - textW / 2;

        roundedRectPath(ctx, startX, ty, textW, textH, 1.5);
        ctx.fill();

        if (text.content.includes('\n') || text.content.length > 20) {
          roundedRectPath(ctx, startX, ty + textH + 3, textW * 0.7, textH, 1.5);
          ctx.fill();
        }
      }
    }
  }

  function roundedRectPath(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Public API
  return {
    render,
    preloadImage,
    isImageLoaded,
    drawTemplateThumbnail,
    drawGradientBg,
    drawIphoneMockupBg,
    drawMockupThumbnail,
    IPHONE_MOCKUP_PRESETS,
  };

})();
