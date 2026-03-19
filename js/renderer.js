/**
 * Renderer — Canvas rendering engine
 * Draws backgrounds, iPhone mockups, text layers, and effects
 */

window.Renderer = (() => {

  // iPhone frame image (1456×3000 PNG with transparent screen cutout)
  const FRAME_IMG_W = 1456;
  const FRAME_IMG_H = 3000;
  const PHONE_W_TO_H = FRAME_IMG_W / FRAME_IMG_H; // ≈ 0.4853

  // Screen opening within the frame image (detected from transparent region)
  // Slightly generous insets so content extends under frame edges — the frame
  // image overlays on top and masks the bezels.
  const SCREEN_LEFT   = 55  / FRAME_IMG_W;  // ≈ 0.038
  const SCREEN_TOP    = 44  / FRAME_IMG_H;  // ≈ 0.015 (top of screen, above Dynamic Island)
  const SCREEN_RIGHT  = 55  / FRAME_IMG_W;  // ≈ 0.038
  const SCREEN_BOTTOM = 40  / FRAME_IMG_H;  // ≈ 0.013

  // Inner screen corner radius as a fraction of phone width
  const SCREEN_CORNER_RADIUS = 0.12;

  // Corner radius of the phone body (must match frame image corners)
  const CORNER_RADIUS_RATIO = 0.22;

  // Pre-load the iPhone frame image
  let frameImage = null;
  const frameImg = new Image();
  frameImg.onload = () => { frameImage = frameImg; };
  frameImg.src = 'Iphone-frame-upscaled.png';

  /**
   * Main render function — draws everything to the canvas
   * @param {HTMLCanvasElement} canvas
   * @param {Object} state — full application state
   */
  function render(canvas, state) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // 1. Background
    drawBackground(ctx, W, H, state.background);

    // 2. Phone mockups
    const layout = state.currentLayout;
    if (layout) {
      const phones = layout.phones;
      for (let i = 0; i < phones.length; i++) {
        const phoneDef = phones[i];
        const screenshot = i === 0 ? state.screenshot : state.screenshot2;

        // Merge layout defaults with user adjustments
        let px, py, pw, rotation, perspective;
        if (i === 0) {
          pw = W * (state.phoneScale / 100);
          px = W * (state.phoneX / 100);
          py = H * (state.phoneY / 100);
          rotation = state.phoneRotation;
          perspective = state.phonePerspective || phoneDef.perspective || '';
        } else {
          pw = W * (state.phone2Scale / 100);
          px = W * (state.phone2X / 100);
          py = H * (state.phone2Y / 100);
          rotation = state.phone2Rotation;
          perspective = state.phone2Perspective || phoneDef.perspective || '';
        }

        const ph = pw / PHONE_W_TO_H;

        drawPhoneMockup(ctx, px, py, pw, ph, screenshot, {
          rotation: rotation,
          frameColor: state.phoneFrameColor,
          shadow: state.phoneShadow,
          shadowIntensity: state.shadowIntensity / 100,
          shadowBlur: state.shadowBlur,
          screenBrightness: state.screenBrightness,
          screenRadius: state.screenRadius,
          perspective: perspective,
        });
      }
    }

    // 3. Text layers
    for (const text of state.texts) {
      drawTextLayer(ctx, W, H, text);
    }

    // 4. Logo overlay
    if (state.logo) {
      drawLogoOverlay(ctx, W, H, state);
    }
  }

  /**
   * Draw background (gradient, solid, or mesh)
   */
  function drawBackground(ctx, W, H, bg) {
    if (bg.type === 'solid') {
      ctx.fillStyle = bg.color || '#1a1a2e';
      ctx.fillRect(0, 0, W, H);
    } else if (bg.type === 'gradient') {
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
      const stops = bg.stops || colors.map((_, i) => i / (colors.length - 1));

      for (let i = 0; i < colors.length; i++) {
        grad.addColorStop(stops[i] !== undefined ? stops[i] : i / (colors.length - 1), colors[i]);
      }

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    } else if (bg.type === 'mesh') {
      drawMeshGradient(ctx, W, H, bg);
    }
  }

  /**
   * Draw a mesh gradient (multi-point organic gradient)
   */
  function drawMeshGradient(ctx, W, H, bg) {
    const colors = bg.meshColors || ['#667eea', '#764ba2', '#f093fb', '#4facfe'];
    const complexity = bg.meshComplexity || 5;

    // Base fill
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, W, H);

    // Create organic blobs for each color
    const positions = [
      { x: 0.2, y: 0.2 },
      { x: 0.8, y: 0.15 },
      { x: 0.75, y: 0.85 },
      { x: 0.15, y: 0.8 },
    ];

    for (let i = 0; i < colors.length && i < 4; i++) {
      const pos = positions[i];
      const radius = (0.4 + complexity * 0.06) * Math.max(W, H);

      const grad = ctx.createRadialGradient(
        pos.x * W, pos.y * H, 0,
        pos.x * W, pos.y * H, radius
      );
      grad.addColorStop(0, colors[i]);
      grad.addColorStop(0.5, colors[i] + '80');
      grad.addColorStop(1, colors[i] + '00');

      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    }

    ctx.globalCompositeOperation = 'source-over';

    // Optional: add subtle noise overlay for texture
    // (skip for performance in real-time preview)
  }

  /**
   * Draw rounded rectangle path
   */
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

  /**
   * Apply a simulated perspective transform using 2D canvas skew/scale.
   * Modifies the current transform matrix around the phone's center.
   */
  function applyPerspectiveTransform(ctx, cx, cy, w, h, perspective) {
    ctx.translate(cx, cy);

    switch (perspective) {
      case 'left':
        // Phone angled slightly to the left — right side recedes
        ctx.transform(0.95, 0.04, 0, 1.02, 0, 0);
        break;
      case 'right':
        // Phone angled slightly to the right — left side recedes
        ctx.transform(0.95, -0.04, 0, 1.02, 0, 0);
        break;
      case 'left-strong':
        // Stronger left angle
        ctx.transform(0.88, 0.08, 0, 1.04, 0, 0);
        break;
      case 'right-strong':
        // Stronger right angle
        ctx.transform(0.88, -0.08, 0, 1.04, 0, 0);
        break;
      case 'flat':
        // Laying flat — foreshortened vertically
        ctx.transform(1, 0, 0.15, 0.75, 0, 0);
        break;
      case 'tilt-forward':
        // Slight forward tilt
        ctx.transform(1, 0, 0, 0.92, 0, 0);
        break;
      case 'isometric-left':
        // Isometric left view
        ctx.transform(0.85, 0.1, -0.1, 0.95, 0, 0);
        break;
      case 'isometric-right':
        // Isometric right view
        ctx.transform(0.85, -0.1, 0.1, 0.95, 0, 0);
        break;
      default:
        break;
    }

    ctx.translate(-cx, -cy);
  }

  /**
   * Draw a single iPhone mockup
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} cx — center X
   * @param {number} cy — center Y
   * @param {number} w — phone width
   * @param {number} h — phone height
   * @param {HTMLImageElement|null} screenshot
   * @param {Object} opts
   */
  function drawPhoneMockup(ctx, cx, cy, w, h, screenshot, opts = {}) {
    const {
      rotation = 0,
      shadow = true,
      shadowIntensity = 0.35,
      shadowBlur = 60,
      screenBrightness = 0,
      perspective = '',
    } = opts;

    if (!frameImage) return; // nothing to draw until the frame loads

    ctx.save();

    // Apply rotation around center
    if (rotation !== 0) {
      ctx.translate(cx, cy);
      ctx.rotate(rotation * Math.PI / 180);
      ctx.translate(-cx, -cy);
    }

    // Apply perspective transform
    if (perspective) {
      applyPerspectiveTransform(ctx, cx, cy, w, h, perspective);
    }

    // Build the phone composite on an offscreen canvas so the frame PNG
    // is used exactly as-is — its transparent pixels (screen area, button
    // gaps, outer corners) stay transparent.
    // Use frame's native resolution for maximum screenshot quality,
    // then scale down when compositing onto the main canvas.
    const pw = frameImage.naturalWidth || Math.round(w);
    const ph = frameImage.naturalHeight || Math.round(h);
    const off = document.createElement('canvas');
    off.width = pw;
    off.height = ph;
    const octx = off.getContext('2d');
    octx.imageSmoothingEnabled = true;
    octx.imageSmoothingQuality = 'high';

    // Screen area (relative to the offscreen canvas at 0,0)
    const sx = pw * SCREEN_LEFT;
    const sy = ph * SCREEN_TOP;
    const sw = pw * (1 - SCREEN_LEFT - SCREEN_RIGHT);
    const sh = ph * (1 - SCREEN_TOP - SCREEN_BOTTOM);
    const screenR = pw * SCREEN_CORNER_RADIUS;

    // 1. Draw screenshot content
    if (screenshot) {
      const imgW = screenshot.naturalWidth || screenshot.width;
      const imgH = screenshot.naturalHeight || screenshot.height;
      const imgRatio = imgW / imgH;
      const screenRatio = sw / sh;

      let drawW, drawH, drawX, drawY;
      if (imgRatio > screenRatio) {
        drawH = sh;
        drawW = sh * imgRatio;
        drawX = sx + (sw - drawW) / 2;
        drawY = sy;
      } else {
        drawW = sw;
        drawH = sw / imgRatio;
        drawX = sx;
        drawY = sy + (sh - drawH) / 2;
      }

      octx.save();
      roundedRectPath(octx, sx, sy, sw, sh, screenR);
      octx.clip();
      octx.fillStyle = '#000000';
      octx.fillRect(sx, sy, sw, sh);
      octx.drawImage(screenshot, drawX, drawY, drawW, drawH);

      if (screenBrightness !== 0) {
        if (screenBrightness > 0) {
          octx.fillStyle = `rgba(255,255,255,${screenBrightness / 100})`;
        } else {
          octx.fillStyle = `rgba(0,0,0,${Math.abs(screenBrightness) / 100})`;
        }
        octx.fillRect(sx, sy, sw, sh);
      }
      octx.restore();
    } else {
      // Placeholder
      const grad = octx.createLinearGradient(sx, sy, sx, sy + sh);
      grad.addColorStop(0, '#e8e0f0');
      grad.addColorStop(1, '#d4c8e8');
      octx.fillStyle = grad;
      roundedRectPath(octx, sx, sy, sw, sh, screenR);
      octx.fill();
    }

    // 2. Draw frame image on top — this masks bezels, buttons, Dynamic
    //    Island, corners. Transparent gaps between buttons stay transparent.
    octx.drawImage(frameImage, 0, 0, pw, ph);

    // 3. Stamp the composite onto the main canvas (with optional shadow)
    const x = cx - w / 2;
    const y = cy - h / 2;

    if (shadow) {
      ctx.shadowColor = `rgba(0, 0, 0, ${shadowIntensity})`;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = shadowBlur * 0.4;
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(off, x, y, w, h);

    ctx.restore(); // restore rotation/perspective
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
   * Draw a text layer with word wrapping
   */
  function drawTextLayer(ctx, canvasW, canvasH, text) {
    if (!text.content || text.content.trim() === '') return;

    const fontSize = text.size || 72;
    const fontWeight = text.weight || 700;
    const fontFamily = text.font || 'Inter';
    const color = text.color || '#ffffff';
    const align = text.align || 'center';
    const lineHeight = text.lineHeight || 1.15;
    const maxWidth = (text.maxWidth / 100) * canvasW || canvasW * 0.85;
    const letterSpacing = text.letterSpacing || 0;

    // Position (percentage of canvas)
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

    // Handle letter spacing via manual character placement
    // For simplicity, if letter spacing is 0, use standard drawText
    // Split text by explicit newlines first
    const paragraphs = text.content.split('\n');
    let currentY = posY;

    for (const paragraph of paragraphs) {
      const lines = wrapText(ctx, paragraph, maxWidth);
      for (const line of lines) {
        if (letterSpacing !== 0) {
          drawTextWithSpacing(ctx, line, posX, currentY, letterSpacing, align, maxWidth);
        } else {
          ctx.fillText(line, posX, currentY);
        }
        currentY += fontSize * lineHeight;
      }
    }

    ctx.restore();
  }

  /**
   * Word-wrap text to fit within maxWidth
   */
  function wrapText(ctx, text, maxWidth) {
    if (!text) return [''];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine) {
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

  /**
   * Draw text with custom letter spacing
   */
  function drawTextWithSpacing(ctx, text, x, y, spacing, align, maxWidth) {
    // Calculate total width with spacing
    let totalWidth = 0;
    for (let i = 0; i < text.length; i++) {
      totalWidth += ctx.measureText(text[i]).width + (i < text.length - 1 ? spacing : 0);
    }

    let startX;
    if (align === 'center') startX = x - totalWidth / 2;
    else if (align === 'right') startX = x - totalWidth;
    else startX = x;

    let currentX = startX;
    const savedAlign = ctx.textAlign;
    ctx.textAlign = 'left';

    for (let i = 0; i < text.length; i++) {
      ctx.fillText(text[i], currentX, y);
      currentX += ctx.measureText(text[i]).width + spacing;
    }

    ctx.textAlign = savedAlign;
  }

  /**
   * Draw a layout thumbnail (small preview of phone position)
   */
  function drawLayoutThumbnail(canvas, layout) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#4a6cf7');
    grad.addColorStop(0.5, '#8b5cf6');
    grad.addColorStop(1, '#d946a8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Text placeholder
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    const textArea = layout.textArea;
    const textY = H * (textArea.y + 0.02);
    const textH = 3;
    const textW1 = W * 0.7;
    const textW2 = W * 0.5;
    roundedRectPath(ctx, (W - textW1) / 2, textY, textW1, textH, 1.5);
    ctx.fill();
    roundedRectPath(ctx, (W - textW2) / 2, textY + textH + 3, textW2, textH, 1.5);
    ctx.fill();

    // Phone(s)
    for (const phone of layout.phones) {
      const pw = W * phone.width * 0.65; // Scale down for thumbnail
      const ph = pw / PHONE_W_TO_H;
      const px = W * phone.x;
      const py = H * phone.y;

      ctx.save();
      if (phone.rotation) {
        ctx.translate(px, py);
        ctx.rotate(phone.rotation * Math.PI / 180);
        ctx.translate(-px, -py);
      }
      if (phone.perspective) {
        applyPerspectiveTransform(ctx, px, py, pw, ph, phone.perspective);
      }

      const phoneX = px - pw / 2;
      const phoneY = py - ph / 2;
      const cr = pw * 0.17;

      // Phone body
      roundedRectPath(ctx, phoneX, phoneY, pw, ph, cr);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();

      // Screen
      const bezel = pw * 0.03;
      roundedRectPath(ctx, phoneX + bezel, phoneY + bezel, pw - bezel * 2, ph - bezel * 2, cr - bezel);
      ctx.fillStyle = 'rgba(255,255,255,0.15)';
      ctx.fill();

      ctx.restore();
    }
  }

  // Public API
  return {
    render,
    drawLayoutThumbnail,
    drawBackground,
    drawPhoneMockup,
    PHONE_W_TO_H,
  };

})();
