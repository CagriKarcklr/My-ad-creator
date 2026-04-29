/**
 * Social App — Main controller for the Social Media Post Creator
 * Manages state, UI bindings, backgrounds, templates, and export
 */

(function () {
  'use strict';

  const AVAILABLE_FONTS = [
    'SF Pro Display', 'SF Pro Text',
    'Inter', 'Poppins', 'Montserrat', 'DM Sans', 'Space Grotesk',
    'Plus Jakarta Sans', 'Outfit', 'Sora', 'Nunito', 'Raleway',
    'Manrope', 'Lexend', 'Figtree', 'Onest', 'Bricolage Grotesque',
    'Rubik', 'Work Sans', 'Quicksand', 'Josefin Sans', 'Archivo',
    'Source Sans 3', 'Cabin', 'Karla', 'Urbanist', 'Red Hat Display',
    'Playfair Display',
  ];

  const FONT_WEIGHTS = [
    { value: 300, label: 'Light' },
    { value: 400, label: 'Regular' },
    { value: 500, label: 'Medium' },
    { value: 600, label: 'SemiBold' },
    { value: 700, label: 'Bold' },
    { value: 800, label: 'ExtraBold' },
    { value: 900, label: 'Black' },
  ];

  // ==================== STATE ====================
  let state = createDefaultState();

  function createDefaultState() {
    const size = BackgroundLibrary.SIZE_PRESETS[0]; // Instagram Square
    return {
      canvasWidth: size.width,
      canvasHeight: size.height,
      sizePresetId: size.id,
      screenshot: null,
      screenshot2: null,
      showPhone: true,
      showPhone2: false,
      phoneX: 50,
      phoneY: 58,
      phoneScale: 50,
      phoneRotation: 0,
      phonePerspective: '',
      phone2X: 70,
      phone2Y: 62,
      phone2Scale: 45,
      phone2Rotation: 5,
      phone2Perspective: '',
      phoneShadow: true,
      shadowIntensity: 40,
      shadowBlur: 60,
      screenBrightness: 0,
      background: {
        type: 'gradient',
        colors: ['#5B9BD5', '#8B6DB5', '#D4779C'],
        angle: 180,
        color: '#F5F0EB',
        url: null,
        patternId: 'pat-ribbon-layers',
        patternColors: ['#8D7EDB', '#C5B8F0', '#ECE5FF'],
        patternIntensity: 72,
        patternGrain: 0,
        customImage: null,
        blur: 0,
        gradientId: 'brand-1',
        mockupPresetId: 'mk-center-cream',
        mockupBgColor: null,
        iphoneMockupScreenImage: null,
      },
      bgOverlay: {
        enabled: false,
        color: 'rgba(0,0,0,0.3)',
      },
      texts: [
        {
          id: 1,
          content: 'Your headline here.',
          font: 'Inter',
          size: 72,
          weight: 700,
          color: '#FFFFFF',
          x: 50, y: 6,
          align: 'center',
          lineHeight: 1.1,
          maxWidth: 85,
          letterSpacing: -1,
          shadow: false,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 4,
        },
        {
          id: 2,
          content: 'Subtitle text goes here.',
          font: 'Inter',
          size: 36,
          weight: 400,
          color: '#FFFFFFCC',
          x: 50, y: 20,
          align: 'center',
          lineHeight: 1.3,
          maxWidth: 80,
          letterSpacing: 0,
          shadow: false,
          shadowColor: 'rgba(0,0,0,0.2)',
          shadowBlur: 8,
          shadowOffsetX: 0,
          shadowOffsetY: 3,
        },
      ],
      nextTextId: 3,
      logo: null,
      logoX: 50,
      logoY: 90,
      logoScale: 15,
      logoOpacity: 100,
    };
  }

  // ==================== DOM ====================
  let canvas, canvasWrapper;
  let active = false;
  const SNAP_THRESHOLD_PX = 12;
  let canvasDragState = null;
  let dragGuideLines = [];

  function init() {
    canvas = document.getElementById('social-canvas');
    canvasWrapper = document.getElementById('social-canvas-wrapper');
    if (!canvas) return;

    setupCanvas();
    setupCanvasDrag();
    setupSizePresets();
    setupUpload();
    setupBackgroundPanel();
    setupLayoutPanel();
    setupTextPanel();
    setupPhonePanel();
    setupLogoPanel();
    setupTemplatePanel();
    setupTabs();
    setupExport();
    setupZoom();
    setupOverlayControls();

    document.fonts.ready.then(() => {
      if (active) requestRender();
    });
  }

  // ==================== ACTIVATION ====================
  function activate() {
    active = true;
    requestRender();
  }

  function deactivate() {
    active = false;
    canvasDragState = null;
    dragGuideLines = [];
    if (canvas) {
      canvas.classList.remove('is-dragging');
      canvas.style.cursor = 'default';
    }
  }

  // Expose globally for navigation
  window.SocialApp = { init, activate, deactivate };

  // ==================== CANVAS ====================
  function setupCanvas() {
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
  }

  let renderPending = false;
  function requestRender() {
    if (!active || renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      if (active) {
        // Auto-exit AI mode if background switched away
        if (aiModeActive && state.background.type !== 'ai-generated') {
          exitAIMode();
        }
        SocialRenderer.render(canvas, state);
        drawDragGuides();
      }
    });
  }

  function setupCanvasDrag() {
    if (!canvas) return;
    canvas.classList.add('canvas-draggable');
    canvas.addEventListener('pointerdown', onCanvasPointerDown);
    canvas.addEventListener('pointermove', onCanvasPointerMove);
    canvas.addEventListener('pointerup', onCanvasPointerUp);
    canvas.addEventListener('pointercancel', onCanvasPointerUp);
    canvas.addEventListener('pointerleave', () => {
      if (!canvasDragState) canvas.style.cursor = 'default';
    });
  }

  function onCanvasPointerDown(e) {
    if (!active) return;

    const point = toCanvasPoint(e);
    const hit = getTopmostHit(point.x, point.y);
    if (!hit) {
      updateCanvasCursor(point);
      return;
    }

    canvasDragState = {
      pointerId: e.pointerId,
      itemId: hit.id,
      itemType: hit.type,
      grabDx: point.x - hit.cx,
      grabDy: point.y - hit.cy,
    };

    dragGuideLines = [];
    canvas.classList.add('is-dragging');
    canvas.style.cursor = 'grabbing';
    if (canvas.setPointerCapture) canvas.setPointerCapture(e.pointerId);
    e.preventDefault();
  }

  function onCanvasPointerMove(e) {
    if (!active) return;

    const point = toCanvasPoint(e);
    if (!canvasDragState || canvasDragState.pointerId !== e.pointerId) {
      updateCanvasCursor(point);
      return;
    }

    const nextCx = point.x - canvasDragState.grabDx;
    const nextCy = point.y - canvasDragState.grabDy;
    const didMove = applyDraggedPosition(canvasDragState.itemId, nextCx, nextCy);
    if (didMove) requestRender();
    e.preventDefault();
  }

  function onCanvasPointerUp(e) {
    if (!canvasDragState || canvasDragState.pointerId !== e.pointerId) return;

    const draggedType = canvasDragState.itemType;

    if (canvas.releasePointerCapture && canvas.hasPointerCapture && canvas.hasPointerCapture(e.pointerId)) {
      canvas.releasePointerCapture(e.pointerId);
    }

    canvasDragState = null;
    dragGuideLines = [];
    canvas.classList.remove('is-dragging');
    updateCanvasCursor(toCanvasPoint(e));

    if (draggedType === 'text') renderTextLayers();
    requestRender();
  }

  function toCanvasPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function updateCanvasCursor(point) {
    if (!active) return;
    if (canvasDragState) {
      canvas.style.cursor = 'grabbing';
      return;
    }
    if (!point) {
      canvas.style.cursor = 'default';
      return;
    }
    const hit = getTopmostHit(point.x, point.y);
    canvas.style.cursor = hit ? 'grab' : 'default';
  }

  function getTopmostHit(x, y) {
    const items = getDraggableItems();
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (x >= item.left && x <= item.right && y >= item.top && y <= item.bottom) {
        return item;
      }
    }
    return null;
  }

  function getDraggableItems() {
    const items = [];
    const W = canvas.width;
    const H = canvas.height;
    const aiLockedPhone = state.background && state.background.type === 'ai-generated';
    const phoneAspect = Renderer.PHONE_W_TO_H || (1456 / 3000);

    if (!aiLockedPhone && state.showPhone !== false) {
      const w = W * (state.phoneScale / 100);
      const h = w / phoneAspect;
      const cx = W * (state.phoneX / 100);
      const cy = H * (state.phoneY / 100);
      items.push({
        id: 'phone-1',
        type: 'phone',
        index: 0,
        cx,
        cy,
        w,
        h,
        left: cx - w / 2,
        right: cx + w / 2,
        top: cy - h / 2,
        bottom: cy + h / 2,
      });
    }

    if (!aiLockedPhone && state.showPhone2) {
      const w = W * (state.phone2Scale / 100);
      const h = w / phoneAspect;
      const cx = W * (state.phone2X / 100);
      const cy = H * (state.phone2Y / 100);
      items.push({
        id: 'phone-2',
        type: 'phone',
        index: 1,
        cx,
        cy,
        w,
        h,
        left: cx - w / 2,
        right: cx + w / 2,
        top: cy - h / 2,
        bottom: cy + h / 2,
      });
    }

    for (const text of state.texts) {
      const bounds = measureTextBounds(text, W, H);
      if (!bounds) continue;
      items.push({
        id: `text-${text.id}`,
        type: 'text',
        textId: text.id,
        ...bounds,
      });
    }

    if (state.logo) {
      const img = state.logo;
      const imgW = img.naturalWidth || img.width;
      const imgH = img.naturalHeight || img.height;
      if (imgW > 0 && imgH > 0) {
        const ratio = imgW / imgH;
        const w = W * ((state.logoScale || 15) / 100);
        const h = w / ratio;
        const cx = W * (state.logoX / 100);
        const cy = H * (state.logoY / 100);
        items.push({
          id: 'logo',
          type: 'logo',
          cx,
          cy,
          w,
          h,
          left: cx - w / 2,
          right: cx + w / 2,
          top: cy - h / 2,
          bottom: cy + h / 2,
        });
      }
    }

    return items;
  }

  function measureTextBounds(text, canvasW, canvasH) {
    if (!text.content || text.content.trim() === '') return null;

    const ctx = canvas.getContext('2d');
    const fontSize = text.size || 48;
    const fontWeight = text.weight || 700;
    const fontFamily = text.font || 'Inter';
    const align = text.align || 'center';
    const lineHeight = text.lineHeight || 1.15;
    const maxWidth = (text.maxWidth / 100) * canvasW || canvasW * 0.85;
    const letterSpacing = text.letterSpacing || 0;
    const posX = (text.x / 100) * canvasW;
    const posY = (text.y / 100) * canvasH;

    ctx.save();
    ctx.font = `${fontWeight} ${fontSize}px "${fontFamily}", "SF Pro Display", -apple-system, system-ui, sans-serif`;

    const paragraphs = text.content.split('\n');
    const lines = [];
    for (const paragraph of paragraphs) {
      const wrapped = wrapTextForBounds(ctx, paragraph, maxWidth);
      for (const line of wrapped) lines.push(line);
    }
    if (lines.length === 0) lines.push('');

    let minX = Number.POSITIVE_INFINITY;
    let maxX = Number.NEGATIVE_INFINITY;
    let currentY = posY;
    for (const line of lines) {
      const lineWidth = measureLineWidth(ctx, line, letterSpacing);
      let startX = posX;
      if (align === 'center') startX = posX - lineWidth / 2;
      else if (align === 'right') startX = posX - lineWidth;
      minX = Math.min(minX, startX);
      maxX = Math.max(maxX, startX + lineWidth);
      currentY += fontSize * lineHeight;
    }

    ctx.restore();

    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, currentY - posY);
    const cx = minX + width / 2;
    const cy = posY + height / 2;

    return {
      cx,
      cy,
      w: width,
      h: height,
      left: minX,
      right: minX + width,
      top: posY,
      bottom: posY + height,
    };
  }

  function wrapTextForBounds(ctx, text, maxWidth) {
    if (!text) return [''];
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
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

  function measureLineWidth(ctx, text, spacing) {
    if (!text) return 0;
    if (!spacing) return ctx.measureText(text).width;

    let width = 0;
    for (let i = 0; i < text.length; i++) {
      width += ctx.measureText(text[i]).width;
      if (i < text.length - 1) width += spacing;
    }
    return width;
  }

  function applyDraggedPosition(itemId, proposedCx, proposedCy) {
    const items = getDraggableItems();
    const activeItem = items.find((item) => item.id === itemId);
    if (!activeItem) return false;

    const others = items.filter((item) => item.id !== itemId);
    const snapped = snapToGuides(activeItem, proposedCx, proposedCy, others, canvas.width, canvas.height);
    let xPct = (snapped.cx / canvas.width) * 100;
    let yPct = (snapped.cy / canvas.height) * 100;

    if (activeItem.type === 'phone') {
      if (activeItem.index === 0) {
        const [minX, maxX] = getSliderBounds('social-phone-x', 0, 100);
        const [minY, maxY] = getSliderBounds('social-phone-y', 0, 100);
        state.phoneX = roundToStep(clamp(xPct, minX, maxX), 0.1);
        state.phoneY = roundToStep(clamp(yPct, minY, maxY), 0.1);
      } else {
        const [minX, maxX] = getSliderBounds('social-phone2-x', 0, 100);
        const [minY, maxY] = getSliderBounds('social-phone2-y', 0, 100);
        state.phone2X = roundToStep(clamp(xPct, minX, maxX), 0.1);
        state.phone2Y = roundToStep(clamp(yPct, minY, maxY), 0.1);
      }
      syncDraggedControls('phone', activeItem.index);
    } else if (activeItem.type === 'text') {
      const target = state.texts.find((text) => `text-${text.id}` === itemId);
      if (target) {
        target.x = roundToStep(clamp(xPct, 5, 95), 0.1);
        target.y = roundToStep(clamp(yPct, 0, 95), 0.1);
      }
    } else if (activeItem.type === 'logo') {
      const [minX, maxX] = getSliderBounds('social-logo-x', 0, 100);
      const [minY, maxY] = getSliderBounds('social-logo-y', 0, 100);
      state.logoX = roundToStep(clamp(xPct, minX, maxX), 0.1);
      state.logoY = roundToStep(clamp(yPct, minY, maxY), 0.1);
      syncDraggedControls('logo');
    }

    dragGuideLines = snapped.guides;
    return true;
  }

  function snapToGuides(activeItem, cx, cy, otherItems, W, H) {
    const xCandidates = [W / 2];
    const yCandidates = [H / 2];
    for (const item of otherItems) {
      xCandidates.push(item.left, item.cx, item.right);
      yCandidates.push(item.top, item.cy, item.bottom);
    }

    const xPoints = [cx - activeItem.w / 2, cx, cx + activeItem.w / 2];
    const yPoints = [cy - activeItem.h / 2, cy, cy + activeItem.h / 2];

    const bestX = findBestSnap(xPoints, xCandidates);
    if (bestX) cx += bestX.delta;
    const bestY = findBestSnap(yPoints, yCandidates);
    if (bestY) cy += bestY.delta;

    const guides = [];
    if (bestX) guides.push({ axis: 'x', value: bestX.line });
    if (bestY) guides.push({ axis: 'y', value: bestY.line });

    return { cx, cy, guides };
  }

  function findBestSnap(points, guideLines) {
    let best = null;
    for (const point of points) {
      for (const line of guideLines) {
        const delta = line - point;
        const dist = Math.abs(delta);
        if (dist > SNAP_THRESHOLD_PX) continue;
        if (!best || dist < best.dist) {
          best = { delta, line, dist };
        }
      }
    }
    return best;
  }

  function getSliderBounds(id, fallbackMin, fallbackMax) {
    const slider = document.getElementById(id);
    if (!slider) return [fallbackMin, fallbackMax];
    const min = Number.isFinite(parseFloat(slider.min)) ? parseFloat(slider.min) : fallbackMin;
    const max = Number.isFinite(parseFloat(slider.max)) ? parseFloat(slider.max) : fallbackMax;
    return [min, max];
  }

  function syncDraggedControls(type, index = 0) {
    if (type === 'phone' && index === 0) {
      setSlider('social-phone-x', state.phoneX, `${state.phoneX}%`);
      setSlider('social-phone-y', state.phoneY, `${state.phoneY}%`);
      return;
    }
    if (type === 'phone' && index === 1) {
      setSlider('social-phone2-x', state.phone2X, `${state.phone2X}%`);
      setSlider('social-phone2-y', state.phone2Y, `${state.phone2Y}%`);
      return;
    }
    if (type === 'logo') {
      setSlider('social-logo-x', state.logoX, `${state.logoX}%`);
      setSlider('social-logo-y', state.logoY, `${state.logoY}%`);
    }
  }

  function drawDragGuides() {
    if (!dragGuideLines || dragGuideLines.length === 0) return;

    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.save();
    ctx.strokeStyle = 'rgba(125, 211, 252, 0.95)';
    ctx.lineWidth = Math.max(1, Math.round(Math.min(W, H) * 0.0016));
    ctx.setLineDash([10, 6]);

    for (const guide of dragGuideLines) {
      if (guide.axis === 'x') {
        ctx.beginPath();
        ctx.moveTo(guide.value, 0);
        ctx.lineTo(guide.value, H);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.moveTo(0, guide.value);
        ctx.lineTo(W, guide.value);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function roundToStep(value, step) {
    return Math.round(value / step) * step;
  }

  // ==================== AI MODE ====================
  let aiModeActive = false;

  function enterAIMode() {
    aiModeActive = true;
    const phonePanel = document.querySelector('[data-social-panel="s-phone"]');
    if (phonePanel) {
      phonePanel.querySelectorAll('input, select').forEach(el => { el.disabled = true; });
      let notice = phonePanel.querySelector('.ai-mode-notice');
      if (!notice) {
        notice = document.createElement('div');
        notice.className = 'ai-mode-notice';
        notice.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg> Phone is auto-positioned in AI mode. Switch to another background to unlock controls.';
        phonePanel.insertBefore(notice, phonePanel.querySelector('.control-group'));
      }
      notice.classList.remove('hidden');
    }
  }

  function exitAIMode() {
    aiModeActive = false;
    const phonePanel = document.querySelector('[data-social-panel="s-phone"]');
    if (phonePanel) {
      phonePanel.querySelectorAll('input, select').forEach(el => { el.disabled = false; });
      const notice = phonePanel.querySelector('.ai-mode-notice');
      if (notice) notice.classList.add('hidden');
    }
  }

  // ==================== SIZE PRESETS ====================
  function setupSizePresets() {
    const container = document.getElementById('social-size-presets');
    if (!container) return;

    const select = document.getElementById('social-canvas-size');
    if (select) {
      for (const preset of BackgroundLibrary.SIZE_PRESETS) {
        const opt = document.createElement('option');
        opt.value = preset.id;
        opt.textContent = `${preset.name} (${preset.width}×${preset.height})`;
        if (preset.id === state.sizePresetId) opt.selected = true;
        select.appendChild(opt);
      }
      select.addEventListener('change', () => {
        const preset = BackgroundLibrary.SIZE_PRESETS.find(p => p.id === select.value);
        if (preset) {
          const prevW = state.canvasWidth;
          state.canvasWidth = preset.width;
          state.canvasHeight = preset.height;
          state.sizePresetId = preset.id;
          canvas.width = preset.width;
          canvas.height = preset.height;
          document.getElementById('social-canvas-info').textContent = `${preset.width} × ${preset.height} px`;

          // Scale text sizes proportionally
          const scaleFactor = preset.width / prevW;
          for (const text of state.texts) {
            text.size = Math.round(text.size * scaleFactor);
          }
          renderTextLayers();
          requestRender();
        }
      });
    }
  }

  // ==================== UPLOAD ====================
  function setupUpload() {
    const zone = document.getElementById('social-upload-zone');
    const input = document.getElementById('social-upload-input');
    const preview = document.getElementById('social-upload-preview');
    const placeholder = document.getElementById('social-upload-placeholder');
    const removeBtn = document.getElementById('social-upload-remove');

    if (!zone) return;

    zone.addEventListener('click', (e) => {
      if (e.target === removeBtn) return;
      input.click();
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) loadScreenshot(file);
    });

    input.addEventListener('change', () => {
      if (input.files[0]) loadScreenshot(input.files[0]);
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.screenshot = null;
      preview.src = '';
      preview.classList.add('hidden');
      removeBtn.classList.add('hidden');
      placeholder.classList.remove('hidden');
      zone.classList.remove('has-image');
      input.value = '';
      requestRender();
    });

    // Second screenshot upload zone
    const zone2 = document.getElementById('social-upload-zone-2');
    const input2 = document.getElementById('social-upload-input-2');
    const preview2 = document.getElementById('social-upload-preview-2');
    const placeholder2 = document.getElementById('social-upload-placeholder-2');
    const removeBtn2 = document.getElementById('social-upload-remove-2');

    if (zone2) {
      zone2.addEventListener('click', (e) => {
        if (e.target === removeBtn2) return;
        input2.click();
      });
      zone2.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone2.classList.add('drag-over');
      });
      zone2.addEventListener('dragleave', () => zone2.classList.remove('drag-over'));
      zone2.addEventListener('drop', (e) => {
        e.preventDefault();
        zone2.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadScreenshot2(file);
      });
      input2.addEventListener('change', () => {
        if (input2.files[0]) loadScreenshot2(input2.files[0]);
      });
      removeBtn2.addEventListener('click', (e) => {
        e.stopPropagation();
        state.screenshot2 = null;
        preview2.src = '';
        preview2.classList.add('hidden');
        removeBtn2.classList.add('hidden');
        placeholder2.classList.remove('hidden');
        zone2.classList.remove('has-image');
        input2.value = '';
        requestRender();
      });
    }
  }

  function loadScreenshot(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.screenshot = img;

        const preview = document.getElementById('social-upload-preview');
        const placeholder = document.getElementById('social-upload-placeholder');
        const removeBtn = document.getElementById('social-upload-remove');
        const zone = document.getElementById('social-upload-zone');

        preview.src = e.target.result;
        preview.classList.remove('hidden');
        removeBtn.classList.remove('hidden');
        placeholder.classList.add('hidden');
        zone.classList.add('has-image');

        // Auto-extract theme
        const colors = ColorExtractor.extract(img, 8);
        const brightness = ColorExtractor.analyzeBrightness(img);
        const gradient = ColorExtractor.generateGradient(colors, brightness);
        const textColor = ColorExtractor.suggestTextColor(gradient.colors);

        state.background.type = 'gradient';
        state.background.colors = gradient.colors;
        state.background.angle = gradient.angle;

        for (const text of state.texts) {
          text.color = textColor;
        }

        updateBackgroundUI();
        renderTextLayers();
        requestRender();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function loadScreenshot2(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.screenshot2 = img;

        const preview2 = document.getElementById('social-upload-preview-2');
        const placeholder2 = document.getElementById('social-upload-placeholder-2');
        const removeBtn2 = document.getElementById('social-upload-remove-2');
        const zone2 = document.getElementById('social-upload-zone-2');

        preview2.src = e.target.result;
        preview2.classList.remove('hidden');
        removeBtn2.classList.remove('hidden');
        placeholder2.classList.add('hidden');
        zone2.classList.add('has-image');
        requestRender();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ==================== BACKGROUND PANEL ====================
  let bgActiveTab = 'gradients';

  function setupBackgroundPanel() {
    // Background sub-tabs
    document.querySelectorAll('.social-bg-tab').forEach(btn => {
      btn.addEventListener('click', () => {
        bgActiveTab = btn.dataset.bgTab;
        document.querySelectorAll('.social-bg-tab').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.social-bg-panel').forEach(p => p.classList.toggle('active', p.dataset.bgPanel === bgActiveTab));
      });
    });

    // Set background count badge
    const countBadge = document.getElementById('social-bg-count');
    if (countBadge) countBadge.textContent = BackgroundLibrary.getTotalCount();

    renderGradientGrid();
    setupIphoneMockupBgPanel();
    setupAIGeneratePanel();
    renderPatternGrid();
    setupPatternColorControls();
    syncPatternColorInputs();
    setupPatternToneControls();
    syncPatternToneInputs();
    renderSolidColorGrid();
    setupCustomBgUpload();
    setupBgBlur();
  }

  function renderGradientGrid() {
    const container = document.getElementById('social-gradient-grid');
    if (!container) return;
    container.innerHTML = '';

    const categories = BackgroundLibrary.getGradientCategories();
    for (const cat of categories) {
      const group = document.createElement('div');
      group.className = 'social-bg-group';

      const title = document.createElement('h4');
      title.className = 'social-bg-group-title';
      title.textContent = cat.label;
      group.appendChild(title);

      const grid = document.createElement('div');
      grid.className = 'social-bg-grid';

      for (const gradient of cat.items) {
        const item = document.createElement('div');
        item.className = 'social-bg-item';
        item.title = gradient.name;
        const gradCSS = `linear-gradient(${gradient.angle}deg, ${gradient.colors.join(', ')})`;
        item.style.background = gradCSS;

        if (state.background.gradientId === gradient.id) {
          item.classList.add('active');
        }

        item.addEventListener('click', () => {
          state.background.type = 'gradient';
          state.background.colors = [...gradient.colors];
          state.background.angle = gradient.angle;
          state.background.gradientId = gradient.id;

          container.querySelectorAll('.social-bg-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');

          requestRender();
        });

        grid.appendChild(item);
      }

      group.appendChild(grid);
      container.appendChild(group);
    }
  }

  function setupIphoneMockupBgPanel() {
    // --- Render mockup preset grid ---
    const grid = document.getElementById('social-mockup-grid');
    if (grid) {
      renderMockupGrid('all');
    }

    // --- Category filter buttons ---
    document.querySelectorAll('#mockup-categories .layout-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('#mockup-categories .layout-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderMockupGrid(btn.dataset.mockupCat);
      });
    });

    // --- Screen image upload ---
    const zone = document.getElementById('social-iphone-mockup-screen-zone');
    const input = document.getElementById('social-iphone-mockup-screen-input');
    const preview = document.getElementById('social-iphone-mockup-screen-preview');
    const placeholder = document.getElementById('social-iphone-mockup-screen-placeholder');
    const removeBtn = document.getElementById('social-iphone-mockup-screen-remove');

    if (zone && input) {
      zone.addEventListener('click', (e) => {
        if (e.target === removeBtn) return;
        input.click();
      });
      zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadIphoneMockupScreenImage(file);
      });
      input.addEventListener('change', () => {
        if (input.files[0]) loadIphoneMockupScreenImage(input.files[0]);
      });
      if (removeBtn) {
        removeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          state.background.iphoneMockupScreenImage = null;
          state.iphoneMockupScreenImage = null;
          preview.src = '';
          preview.classList.add('hidden');
          removeBtn.classList.add('hidden');
          placeholder.classList.remove('hidden');
          zone.classList.remove('has-image');
          input.value = '';
          requestRender();
        });
      }
    }

    // --- Background color picker ---
    const colorPicker = document.getElementById('social-iphone-mockup-bg-color');
    const colorHex = document.getElementById('social-iphone-mockup-bg-color-hex');
    if (colorPicker) {
      colorPicker.addEventListener('input', () => {
        state.background.mockupBgColor = colorPicker.value;
        if (colorHex) colorHex.value = colorPicker.value;
        if (state.background.type === 'iphone-mockup') requestRender();
      });
    }
    if (colorHex) {
      colorHex.addEventListener('change', () => {
        let val = colorHex.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        if (/^#[0-9a-fA-F]{6}$/.test(val)) {
          state.background.mockupBgColor = val;
          if (colorPicker) colorPicker.value = val;
          if (state.background.type === 'iphone-mockup') requestRender();
        }
      });
    }
  }

  function renderMockupGrid(catFilter) {
    const grid = document.getElementById('social-mockup-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const presets = SocialRenderer.IPHONE_MOCKUP_PRESETS;
    const filtered = catFilter === 'all' ? presets : presets.filter(p => p.cat === catFilter);

    for (const preset of filtered) {
      const item = document.createElement('div');
      item.className = 'social-bg-item social-mockup-item';
      item.title = preset.name;
      if (state.background.mockupPresetId === preset.id) item.classList.add('active');

      // Generate thumbnail canvas
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 120;
      thumbCanvas.height = 120;
      SocialRenderer.drawMockupThumbnail(thumbCanvas, preset);
      item.style.backgroundImage = `url(${thumbCanvas.toDataURL()})`;
      item.style.backgroundSize = 'cover';
      item.style.backgroundPosition = 'center';

      // Label
      const label = document.createElement('span');
      label.className = 'social-mockup-label';
      label.textContent = preset.name;
      item.appendChild(label);

      item.addEventListener('click', () => {
        state.background.type = 'iphone-mockup';
        state.background.mockupPresetId = preset.id;
        state.background.gradientId = null;
        grid.querySelectorAll('.social-mockup-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        requestRender();
      });

      grid.appendChild(item);
    }
  }

  function loadIphoneMockupScreenImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.background.iphoneMockupScreenImage = img;
        state.iphoneMockupScreenImage = img;

        const preview = document.getElementById('social-iphone-mockup-screen-preview');
        const placeholder = document.getElementById('social-iphone-mockup-screen-placeholder');
        const removeBtn = document.getElementById('social-iphone-mockup-screen-remove');
        const zone = document.getElementById('social-iphone-mockup-screen-zone');

        if (preview) { preview.src = e.target.result; preview.classList.remove('hidden'); }
        if (removeBtn) removeBtn.classList.remove('hidden');
        if (placeholder) placeholder.classList.add('hidden');
        if (zone) zone.classList.add('has-image');

        // Auto-switch to iphone-mockup background type
        state.background.type = 'iphone-mockup';
        state.background.gradientId = null;
        requestRender();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ==================== AI GENERATE PANEL ====================
  function setupAIGeneratePanel() {
    const apiKeyInput = document.getElementById('ai-api-key');
    const kimiKeyInput = document.getElementById('ai-kimi-api-key');
    const keyPanel = document.getElementById('ai-key-panel');
    const settingsToggle = document.getElementById('ai-settings-toggle');
    const providerSelect = document.getElementById('ai-provider-select');
    const openaiKeyGroup = document.getElementById('ai-openai-key-group');
    const kimiKeyGroup = document.getElementById('ai-kimi-key-group');
    const styleGrid = document.getElementById('ai-style-grid');
    const promptInput = document.getElementById('ai-custom-prompt');
    const generateBtn = document.getElementById('ai-generate-btn');
    const loadingEl = document.getElementById('ai-loading');
    const errorEl = document.getElementById('ai-error');
    const gallery = document.getElementById('ai-generated-gallery');
    const sizeSelect = document.getElementById('ai-image-size');
    const qualitySelect = document.getElementById('ai-image-quality');

    if (!generateBtn) return;

    let selectedPresetId = null;

    // --- Screenshot upload within AI panel ---
    const ssZone = document.getElementById('ai-screenshot-zone');
    const ssInput = document.getElementById('ai-screenshot-input');
    const ssPreview = document.getElementById('ai-screenshot-preview');
    const ssPlaceholder = document.getElementById('ai-screenshot-placeholder');
    const ssRemove = document.getElementById('ai-screenshot-remove');

    if (ssZone && ssInput) {
      ssZone.addEventListener('click', (e) => {
        if (e.target === ssRemove) return;
        ssInput.click();
      });
      ssZone.addEventListener('dragover', (e) => { e.preventDefault(); ssZone.classList.add('drag-over'); });
      ssZone.addEventListener('dragleave', () => ssZone.classList.remove('drag-over'));
      ssZone.addEventListener('drop', (e) => {
        e.preventDefault();
        ssZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) loadAIScreenshot(file);
      });
      ssInput.addEventListener('change', () => {
        if (ssInput.files[0]) loadAIScreenshot(ssInput.files[0]);
      });
      if (ssRemove) {
        ssRemove.addEventListener('click', (e) => {
          e.stopPropagation();
          state.screenshot = null;
          ssPreview.src = '';
          ssPreview.classList.add('hidden');
          ssRemove.classList.add('hidden');
          ssPlaceholder.classList.remove('hidden');
          ssZone.classList.remove('has-image');
          ssInput.value = '';
          // Also clear the main upload panel preview
          const mainPreview = document.getElementById('social-upload-preview');
          const mainPlaceholder = document.getElementById('social-upload-placeholder');
          const mainRemove = document.getElementById('social-upload-remove');
          const mainZone = document.getElementById('social-upload-zone');
          if (mainPreview) { mainPreview.src = ''; mainPreview.classList.add('hidden'); }
          if (mainRemove) mainRemove.classList.add('hidden');
          if (mainPlaceholder) mainPlaceholder.classList.remove('hidden');
          if (mainZone) mainZone.classList.remove('has-image');
          requestRender();
        });
      }
    }

    function loadAIScreenshot(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          state.screenshot = img;
          if (ssPreview) { ssPreview.src = e.target.result; ssPreview.classList.remove('hidden'); }
          if (ssRemove) ssRemove.classList.remove('hidden');
          if (ssPlaceholder) ssPlaceholder.classList.add('hidden');
          if (ssZone) ssZone.classList.add('has-image');
          // Sync with main upload panel
          const mainPreview = document.getElementById('social-upload-preview');
          const mainPlaceholder = document.getElementById('social-upload-placeholder');
          const mainRemove = document.getElementById('social-upload-remove');
          const mainZone = document.getElementById('social-upload-zone');
          if (mainPreview) { mainPreview.src = e.target.result; mainPreview.classList.remove('hidden'); }
          if (mainRemove) mainRemove.classList.remove('hidden');
          if (mainPlaceholder) mainPlaceholder.classList.add('hidden');
          if (mainZone) mainZone.classList.add('has-image');
          requestRender();
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    // --- Provider selector ---
    if (providerSelect) {
      providerSelect.value = AIGenerator.getProvider();
      updateProviderUI(providerSelect.value);
      providerSelect.addEventListener('change', () => {
        AIGenerator.saveProvider(providerSelect.value);
        updateProviderUI(providerSelect.value);
      });
    }

    function updateProviderUI(provider) {
      if (openaiKeyGroup) openaiKeyGroup.classList.toggle('hidden', provider !== 'openai');
      if (kimiKeyGroup) kimiKeyGroup.classList.toggle('hidden', provider !== 'kimi');
    }

    // Load saved API keys
    if (apiKeyInput) {
      apiKeyInput.value = AIGenerator.getApiKey();
      apiKeyInput.addEventListener('change', () => {
        AIGenerator.saveApiKey(apiKeyInput.value.trim());
      });
    }
    if (kimiKeyInput) {
      kimiKeyInput.value = AIGenerator.getKimiApiKey();
      kimiKeyInput.addEventListener('change', () => {
        AIGenerator.saveKimiApiKey(kimiKeyInput.value.trim());
      });
    }

    // Toggle API key panel
    if (settingsToggle && keyPanel) {
      settingsToggle.addEventListener('click', () => {
        keyPanel.classList.toggle('hidden');
      });
      // Auto-show if no key saved for current provider
      const prov = AIGenerator.getProvider();
      if ((prov === 'openai' && !AIGenerator.getApiKey()) || (prov === 'kimi' && !AIGenerator.getKimiApiKey())) {
        keyPanel.classList.remove('hidden');
      }
    }

    // Render style preset grid
    if (styleGrid) {
      styleGrid.innerHTML = '';
      for (const preset of AIGenerator.STYLE_PRESETS) {
        const item = document.createElement('button');
        item.className = 'ai-style-item';
        item.dataset.presetId = preset.id;
        item.innerHTML = `<span class="ai-style-icon">${preset.icon}</span><span class="ai-style-label">${preset.label}</span>`;
        item.addEventListener('click', () => {
          styleGrid.querySelectorAll('.ai-style-item').forEach(el => el.classList.remove('active'));
          item.classList.add('active');
          selectedPresetId = preset.id;
          // Pre-fill prompt
          if (promptInput) promptInput.value = preset.prompt;
        });
        styleGrid.appendChild(item);
      }
    }

    // Generate button
    generateBtn.addEventListener('click', async () => {
      const provider = providerSelect ? providerSelect.value : 'openai';
      const apiKey = provider === 'kimi'
        ? (kimiKeyInput ? kimiKeyInput.value.trim() : AIGenerator.getKimiApiKey())
        : (apiKeyInput ? apiKeyInput.value.trim() : AIGenerator.getApiKey());
      const prompt = promptInput ? promptInput.value.trim() : '';

      if (!apiKey) {
        showAIError(`Please enter your ${provider === 'kimi' ? 'Kimi' : 'OpenAI'} API key in the settings.`);
        if (keyPanel) keyPanel.classList.remove('hidden');
        return;
      }
      if (!prompt) {
        showAIError('Please select a style preset or enter a custom prompt.');
        return;
      }

      // Save keys
      if (provider === 'kimi') {
        AIGenerator.saveKimiApiKey(apiKey);
      } else {
        AIGenerator.saveApiKey(apiKey);
      }

      // Show loading
      generateBtn.disabled = true;
      if (loadingEl) loadingEl.classList.remove('hidden');
      if (errorEl) errorEl.classList.add('hidden');

      try {
        const dataUrl = await AIGenerator.generate({
          prompt: prompt,
          apiKey: apiKey,
          provider: provider,
          size: sizeSelect ? sizeSelect.value : '1024x1024',
          quality: qualitySelect ? qualitySelect.value : 'standard',
        });

        // Load as Image element
        const img = await AIGenerator.loadImageFromDataUrl(dataUrl);

        // Add to gallery
        addToAIGallery(img, dataUrl, prompt);

        // Auto-apply as background
        state.background.type = 'ai-generated';
        state.background.customImage = img;
        state.background.gradientId = null;
        enterAIMode();
        requestRender();
      } catch (err) {
        showAIError(err.message);
      } finally {
        generateBtn.disabled = false;
        if (loadingEl) loadingEl.classList.add('hidden');
      }
    });

    function showAIError(msg) {
      if (errorEl) {
        errorEl.textContent = msg;
        errorEl.classList.remove('hidden');
        setTimeout(() => errorEl.classList.add('hidden'), 8000);
      }
    }

    function addToAIGallery(img, dataUrl, prompt) {
      if (!gallery) return;

      const item = document.createElement('div');
      item.className = 'ai-gallery-item';

      const thumb = document.createElement('img');
      thumb.src = dataUrl;
      thumb.alt = prompt.slice(0, 50);

      const useBtn = document.createElement('button');
      useBtn.className = 'ai-gallery-use';
      useBtn.textContent = 'Use';
      useBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.background.type = 'ai-generated';
        state.background.customImage = img;
        state.background.gradientId = null;
        enterAIMode();
        requestRender();
        gallery.querySelectorAll('.ai-gallery-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
      });

      const removeBtn = document.createElement('button');
      removeBtn.className = 'ai-gallery-remove';
      removeBtn.textContent = '×';
      removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        item.remove();
      });

      item.appendChild(thumb);
      item.appendChild(useBtn);
      item.appendChild(removeBtn);
      gallery.insertBefore(item, gallery.firstChild);

      // Mark as active
      gallery.querySelectorAll('.ai-gallery-item').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
    }
  }

  function renderPatternGrid() {
    const container = document.getElementById('social-pattern-grid');
    if (!container) return;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'social-bg-grid';

    const colors = ensurePatternColors();
    const accent = colors[0];

    for (const pattern of BackgroundLibrary.PATTERNS) {
      const item = document.createElement('div');
      item.className = 'social-bg-item social-bg-pattern-item';
      item.title = pattern.name;
      item.dataset.patternId = pattern.id;
      if (state.background.type === 'pattern' && state.background.patternId === pattern.id) {
        item.classList.add('active');
      }

      // Generate thumbnail
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 100;
      thumbCanvas.height = 100;
      pattern.generate(thumbCanvas.getContext('2d'), 100, 100, accent);
      item.style.backgroundImage = `url(${thumbCanvas.toDataURL()})`;
      item.style.backgroundSize = 'cover';

      item.addEventListener('click', () => {
        state.background.type = 'pattern';
        state.background.patternId = pattern.id;
        state.background.gradientId = null;

        updateBackgroundUI();
        requestRender();
      });

      grid.appendChild(item);
    }

    container.appendChild(grid);
  }

  function setupPatternColorControls() {
    for (let i = 1; i <= 3; i++) {
      const picker = document.getElementById(`social-pattern-color-${i}`);
      const hex = document.getElementById(`social-pattern-color-${i}-hex`);
      if (!picker || !hex) continue;

      picker.addEventListener('input', () => {
        const colors = ensurePatternColors();
        colors[i - 1] = picker.value;
        hex.value = picker.value.toUpperCase();
        renderPatternGrid();
        requestRender();
      });

      hex.addEventListener('change', () => {
        const normalized = normalizeHexColor(hex.value);
        if (!normalized) return;
        const colors = ensurePatternColors();
        colors[i - 1] = normalized;
        picker.value = normalized;
        hex.value = normalized.toUpperCase();
        renderPatternGrid();
        requestRender();
      });
    }
  }

  function ensurePatternColors() {
    if (!Array.isArray(state.background.patternColors)) {
      state.background.patternColors = ['#8D7EDB', '#C5B8F0', '#ECE5FF'];
      return state.background.patternColors;
    }
    while (state.background.patternColors.length < 3) {
      state.background.patternColors.push('#ECE5FF');
    }
    return state.background.patternColors;
  }

  function syncPatternColorInputs() {
    const colors = ensurePatternColors();
    for (let i = 1; i <= 3; i++) {
      const picker = document.getElementById(`social-pattern-color-${i}`);
      const hex = document.getElementById(`social-pattern-color-${i}-hex`);
      if (!picker || !hex) continue;
      picker.value = colors[i - 1];
      hex.value = colors[i - 1].toUpperCase();
    }
  }

  function setupPatternToneControls() {
    const intensity = document.getElementById('social-pattern-intensity');
    const grain = document.getElementById('social-pattern-grain');

    if (intensity) {
      intensity.addEventListener('input', () => {
        ensurePatternTuning();
        state.background.patternIntensity = parseInt(intensity.value, 10);
        const value = document.getElementById('social-pattern-intensity-value');
        if (value) value.textContent = `${state.background.patternIntensity}%`;
        requestRender();
      });
    }

    if (grain) {
      grain.addEventListener('input', () => {
        ensurePatternTuning();
        state.background.patternGrain = parseInt(grain.value, 10);
        const value = document.getElementById('social-pattern-grain-value');
        if (value) value.textContent = `${state.background.patternGrain}%`;
        requestRender();
      });
    }
  }

  function ensurePatternTuning() {
    const intensity = Number(state.background.patternIntensity);
    const grain = Number(state.background.patternGrain);

    state.background.patternIntensity = Number.isFinite(intensity) ? Math.max(0, Math.min(100, Math.round(intensity))) : 72;
    state.background.patternGrain = Number.isFinite(grain) ? Math.max(0, Math.min(100, Math.round(grain))) : 0;
  }

  function syncPatternToneInputs() {
    ensurePatternTuning();

    const intensity = document.getElementById('social-pattern-intensity');
    const intensityValue = document.getElementById('social-pattern-intensity-value');
    const grain = document.getElementById('social-pattern-grain');
    const grainValue = document.getElementById('social-pattern-grain-value');

    if (intensity) intensity.value = state.background.patternIntensity;
    if (intensityValue) intensityValue.textContent = `${state.background.patternIntensity}%`;
    if (grain) grain.value = state.background.patternGrain;
    if (grainValue) grainValue.textContent = `${state.background.patternGrain}%`;
  }

  function normalizeHexColor(value) {
    if (!value) return null;
    let normalized = value.trim();
    if (!normalized.startsWith('#')) normalized = '#' + normalized;
    if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) return null;
    return normalized.toUpperCase();
  }

  function renderSolidColorGrid() {
    const container = document.getElementById('social-solid-grid');
    if (!container) return;
    container.innerHTML = '';

    const grid = document.createElement('div');
    grid.className = 'social-bg-grid';

    for (const solid of BackgroundLibrary.SOLID_COLORS) {
      const item = document.createElement('div');
      item.className = 'social-bg-item';
      item.title = solid.name;
      item.style.background = solid.color;

      if (solid.color === '#FFFFFF' || solid.color === '#FAF9F6' || solid.color === '#FFFFF0' || solid.color === '#FFFDD0') {
        item.style.border = '1px solid rgba(255,255,255,0.2)';
      }

      item.addEventListener('click', () => {
        state.background.type = 'solid';
        state.background.color = solid.color;
        state.background.gradientId = null;

        container.querySelectorAll('.social-bg-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');

        requestRender();
      });

      grid.appendChild(item);
    }

    // Custom color picker
    const customItem = document.createElement('div');
    customItem.className = 'social-bg-item social-bg-custom-color';
    customItem.innerHTML = '<span>+</span>';
    customItem.title = 'Custom color';

    const colorInput = document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = '#C8B6FF';
    colorInput.style.cssText = 'position:absolute;opacity:0;width:100%;height:100%;cursor:pointer;top:0;left:0;';
    customItem.style.position = 'relative';
    customItem.appendChild(colorInput);

    colorInput.addEventListener('input', () => {
      state.background.type = 'solid';
      state.background.color = colorInput.value;
      state.background.gradientId = null;
      customItem.style.background = colorInput.value;
      requestRender();
    });

    grid.appendChild(customItem);
    container.appendChild(grid);
  }

  function setupCustomBgUpload() {
    const zone = document.getElementById('social-custom-bg-zone');
    const input = document.getElementById('social-custom-bg-input');
    if (!zone || !input) return;

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) loadCustomBg(file);
    });
    input.addEventListener('change', () => {
      if (input.files[0]) loadCustomBg(input.files[0]);
    });
  }

  function loadCustomBg(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.background.type = 'custom';
        state.background.customImage = img;
        state.background.gradientId = null;
        requestRender();

        // Show preview in the zone
        const zone = document.getElementById('social-custom-bg-zone');
        zone.style.backgroundImage = `url(${e.target.result})`;
        zone.style.backgroundSize = 'cover';
        zone.style.backgroundPosition = 'center';
        zone.classList.add('has-image');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function setupBgBlur() {
    const slider = document.getElementById('social-bg-blur');
    if (!slider) return;
    slider.addEventListener('input', () => {
      state.background.blur = parseInt(slider.value);
      document.getElementById('social-bg-blur-value').textContent = `${slider.value}px`;
      requestRender();
    });
  }

  function setupOverlayControls() {
    const toggle = document.getElementById('social-bg-overlay-toggle');
    if (!toggle) return;
    toggle.addEventListener('change', () => {
      state.bgOverlay.enabled = toggle.checked;
      requestRender();
    });

    const color = document.getElementById('social-bg-overlay-color');
    if (color) {
      color.addEventListener('input', () => {
        const opacity = document.getElementById('social-bg-overlay-opacity');
        const opVal = opacity ? parseInt(opacity.value) / 100 : 0.3;
        state.bgOverlay.color = hexToRgba(color.value, opVal);
        requestRender();
      });
    }

    const opacity = document.getElementById('social-bg-overlay-opacity');
    if (opacity) {
      opacity.addEventListener('input', () => {
        const colorEl = document.getElementById('social-bg-overlay-color');
        const opVal = parseInt(opacity.value) / 100;
        state.bgOverlay.color = hexToRgba(colorEl.value, opVal);
        document.getElementById('social-bg-overlay-opacity-value').textContent = `${opacity.value}%`;
        requestRender();
      });
    }
  }

  function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  function updateBackgroundUI() {
    syncPatternColorInputs();
    syncPatternToneInputs();

    const patternItems = document.querySelectorAll('.social-bg-pattern-item');
    patternItems.forEach(el => {
      const isActive = state.background.type === 'pattern' && el.dataset.patternId === state.background.patternId;
      el.classList.toggle('active', isActive);
    });
  }

  // ==================== LAYOUT PANEL ====================
  const SOCIAL_LAYOUTS = [
    // ===== FLAT / FRONT-FACING =====
    { id: 'center', name: 'Center', phone: { x: 50, y: 58, scale: 50, rotation: 0, perspective: '' } },
    { id: 'center-large', name: 'Center XL', phone: { x: 50, y: 60, scale: 65, rotation: 0, perspective: '' } },
    { id: 'center-small', name: 'Center S', phone: { x: 50, y: 55, scale: 38, rotation: 0, perspective: '' } },
    { id: 'left', name: 'Left', phone: { x: 32, y: 58, scale: 48, rotation: 0, perspective: '' } },
    { id: 'right', name: 'Right', phone: { x: 68, y: 58, scale: 48, rotation: 0, perspective: '' } },
    { id: 'bottom-peek', name: 'Peek Up', phone: { x: 50, y: 72, scale: 55, rotation: 0, perspective: '' } },
    { id: 'hero-bleed', name: 'Hero Bleed', phone: { x: 50, y: 68, scale: 72, rotation: 0, perspective: '' } },
    // ===== TILTED =====
    { id: 'tilt-left', name: 'Tilt Left', phone: { x: 50, y: 58, scale: 50, rotation: -8, perspective: '' } },
    { id: 'tilt-right', name: 'Tilt Right', phone: { x: 50, y: 58, scale: 50, rotation: 8, perspective: '' } },
    { id: 'dramatic', name: 'Dramatic', phone: { x: 50, y: 55, scale: 55, rotation: -15, perspective: '' } },
    { id: 'left-tilt', name: 'Left + Tilt', phone: { x: 35, y: 58, scale: 50, rotation: 5, perspective: '' } },
    { id: 'right-tilt', name: 'Right + Tilt', phone: { x: 65, y: 58, scale: 50, rotation: -5, perspective: '' } },
    // ===== 3D PERSPECTIVE =====
    { id: '3d-left', name: '3D Left', phone: { x: 50, y: 55, scale: 52, rotation: 0, perspective: 'left' } },
    { id: '3d-right', name: '3D Right', phone: { x: 50, y: 55, scale: 52, rotation: 0, perspective: 'right' } },
    { id: '3d-left-strong', name: '3D Left Deep', phone: { x: 48, y: 55, scale: 55, rotation: 0, perspective: 'left-strong' } },
    { id: '3d-right-strong', name: '3D Right Deep', phone: { x: 52, y: 55, scale: 55, rotation: 0, perspective: 'right-strong' } },
    { id: '3d-iso-left', name: 'Isometric L', phone: { x: 48, y: 55, scale: 55, rotation: 0, perspective: 'isometric-left' } },
    { id: '3d-iso-right', name: 'Isometric R', phone: { x: 52, y: 55, scale: 55, rotation: 0, perspective: 'isometric-right' } },
    { id: '3d-flat', name: 'Laying Flat', phone: { x: 50, y: 50, scale: 60, rotation: 0, perspective: 'flat' } },
    { id: '3d-tilt-fwd', name: 'Tilt Forward', phone: { x: 50, y: 55, scale: 55, rotation: 0, perspective: 'tilt-forward' } },
    // ===== 3D + ROTATION COMBOS =====
    { id: '3d-left-rot', name: '3D Left + Tilt', phone: { x: 45, y: 58, scale: 55, rotation: -8, perspective: 'left' } },
    { id: '3d-right-rot', name: '3D Right + Tilt', phone: { x: 55, y: 58, scale: 55, rotation: 8, perspective: 'right' } },
    { id: '3d-float', name: '3D Float', phone: { x: 50, y: 48, scale: 50, rotation: -5, perspective: 'left' } },
    { id: '3d-showcase', name: '3D Showcase', phone: { x: 55, y: 55, scale: 60, rotation: 5, perspective: 'right-strong' } },
    // ===== DUAL PHONE LAYOUTS =====
    { id: 'dual-side', name: 'Side by Side', phone: { x: 35, y: 58, scale: 40, rotation: 0, perspective: '' }, phone2: { x: 65, y: 58, scale: 40, rotation: 0, perspective: '' } },
    { id: 'dual-overlap', name: 'Overlap', phone: { x: 38, y: 56, scale: 45, rotation: -8, perspective: '' }, phone2: { x: 62, y: 62, scale: 45, rotation: 5, perspective: '' } },
    { id: 'dual-stagger', name: 'Stagger', phone: { x: 35, y: 52, scale: 42, rotation: -5, perspective: '' }, phone2: { x: 65, y: 64, scale: 42, rotation: 5, perspective: '' } },
    { id: 'dual-3d-fan', name: '3D Fan', phone: { x: 38, y: 55, scale: 48, rotation: 0, perspective: 'left' }, phone2: { x: 62, y: 55, scale: 48, rotation: 0, perspective: 'right' } },
    { id: 'dual-3d-showcase', name: '3D Showcase', phone: { x: 35, y: 58, scale: 50, rotation: -5, perspective: 'left-strong' }, phone2: { x: 65, y: 58, scale: 50, rotation: 5, perspective: 'right-strong' } },
    { id: 'dual-iso', name: 'Isometric Pair', phone: { x: 38, y: 55, scale: 48, rotation: 0, perspective: 'isometric-left' }, phone2: { x: 62, y: 60, scale: 48, rotation: 0, perspective: 'isometric-right' } },
    { id: 'dual-big-small', name: 'Feature + Detail', phone: { x: 40, y: 55, scale: 55, rotation: -3, perspective: '' }, phone2: { x: 72, y: 65, scale: 35, rotation: 5, perspective: '' } },
    { id: 'dual-v-shape', name: 'V Shape', phone: { x: 35, y: 58, scale: 45, rotation: -12, perspective: '' }, phone2: { x: 65, y: 58, scale: 45, rotation: 12, perspective: '' } },
  ];

  function setupLayoutPanel() {
    const grid = document.getElementById('social-layout-grid');
    if (!grid) return;

    for (const layout of SOCIAL_LAYOUTS) {
      const item = document.createElement('div');
      item.className = 'social-layout-item';
      item.title = layout.name;

      // Draw thumbnail
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 60;
      thumbCanvas.height = 60;
      drawLayoutThumb(thumbCanvas, layout);
      item.appendChild(thumbCanvas);

      const label = document.createElement('span');
      label.textContent = layout.name;
      item.appendChild(label);

      item.addEventListener('click', () => {
        state.phoneX = layout.phone.x;
        state.phoneY = layout.phone.y;
        state.phoneScale = layout.phone.scale;
        state.phoneRotation = layout.phone.rotation;
        state.phonePerspective = layout.phone.perspective || '';

        const dualControls = document.getElementById('social-dual-controls');
        const upload2 = document.getElementById('social-upload-zone-2');
        if (layout.phone2) {
          state.showPhone2 = true;
          state.phone2X = layout.phone2.x;
          state.phone2Y = layout.phone2.y;
          state.phone2Scale = layout.phone2.scale;
          state.phone2Rotation = layout.phone2.rotation;
          state.phone2Perspective = layout.phone2.perspective || '';
          if (dualControls) dualControls.classList.remove('hidden');
          if (upload2) upload2.classList.remove('hidden');
        } else {
          state.showPhone2 = false;
          if (dualControls) dualControls.classList.add('hidden');
          if (upload2) upload2.classList.add('hidden');
        }

        updatePhoneSliders();
        grid.querySelectorAll('.social-layout-item').forEach(el => el.classList.remove('active'));
        item.classList.add('active');
        requestRender();
      });

      grid.appendChild(item);
    }
  }

  function drawLayoutThumb(canvas, layout) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#818cf8');
    grad.addColorStop(1, '#c084fc');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Draw phone helper
    function drawThumbPhone(ph) {
      const pw = W * (ph.scale / 100) * 0.6;
      const pHeight = pw / Renderer.PHONE_W_TO_H;
      const px = W * (ph.x / 100);
      const py = H * (ph.y / 100);

      ctx.save();
      ctx.translate(px, py);
      if (ph.rotation) ctx.rotate(ph.rotation * Math.PI / 180);
      if (ph.perspective === 'left' || ph.perspective === 'left-strong') {
        ctx.transform(1, ph.perspective === 'left-strong' ? 0.15 : 0.08, 0, 1, 0, 0);
      } else if (ph.perspective === 'right' || ph.perspective === 'right-strong') {
        ctx.transform(1, ph.perspective === 'right-strong' ? -0.15 : -0.08, 0, 1, 0, 0);
      } else if (ph.perspective === 'isometric-left' || ph.perspective === 'isometric-right') {
        const dir = ph.perspective === 'isometric-left' ? 1 : -1;
        ctx.transform(0.95, dir * 0.12, 0, 1, 0, 0);
      } else if (ph.perspective === 'flat') {
        ctx.transform(1, 0, 0, 0.5, 0, pHeight * 0.25);
      } else if (ph.perspective === 'tilt-forward') {
        ctx.transform(1, 0, 0, 0.85, 0, pHeight * 0.08);
      }
      ctx.translate(-px, -py);

      const phoneX = px - pw / 2;
      const phoneY = py - pHeight / 2;
      const cr = pw * 0.17;

      ctx.beginPath();
      roundedRect(ctx, phoneX, phoneY, pw, pHeight, cr);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();

      const bezel = pw * 0.05;
      ctx.beginPath();
      roundedRect(ctx, phoneX + bezel, phoneY + bezel, pw - bezel * 2, pHeight - bezel * 2, cr - bezel);
      ctx.fillStyle = 'rgba(255,255,255,0.2)';
      ctx.fill();

      ctx.restore();
    }

    drawThumbPhone(layout.phone);
    if (layout.phone2) drawThumbPhone(layout.phone2);
  }

  // ==================== PHONE PANEL ====================
  function setupPhonePanel() {
    bindSlider('social-phone-scale', (val) => {
      state.phoneScale = val;
      document.getElementById('social-phone-scale-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-phone-x', (val) => {
      state.phoneX = val;
      document.getElementById('social-phone-x-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-phone-y', (val) => {
      state.phoneY = val;
      document.getElementById('social-phone-y-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-phone-rotation', (val) => {
      state.phoneRotation = val;
      document.getElementById('social-phone-rotation-value').textContent = `${val}°`;
      requestRender();
    });

    const shadowToggle = document.getElementById('social-phone-shadow');
    if (shadowToggle) {
      shadowToggle.addEventListener('change', () => {
        state.phoneShadow = shadowToggle.checked;
        requestRender();
      });
    }

    bindSlider('social-shadow-intensity', (val) => {
      state.shadowIntensity = val;
      document.getElementById('social-shadow-intensity-value').textContent = `${val}%`;
      requestRender();
    });

    bindSlider('social-shadow-blur', (val) => {
      state.shadowBlur = val;
      document.getElementById('social-shadow-blur-value').textContent = val;
      requestRender();
    });

    const showPhoneToggle = document.getElementById('social-show-phone');
    if (showPhoneToggle) {
      showPhoneToggle.addEventListener('change', () => {
        state.showPhone = showPhoneToggle.checked;
        requestRender();
      });
    }

    const perspSelect = document.getElementById('social-phone-perspective');
    if (perspSelect) {
      perspSelect.addEventListener('change', () => {
        state.phonePerspective = perspSelect.value;
        requestRender();
      });
    }

    // Phone 2 controls
    const showPhone2Toggle = document.getElementById('social-show-phone2');
    if (showPhone2Toggle) {
      showPhone2Toggle.addEventListener('change', () => {
        state.showPhone2 = showPhone2Toggle.checked;
        requestRender();
      });
    }

    bindSlider('social-phone2-scale', (val) => {
      state.phone2Scale = val;
      document.getElementById('social-phone2-scale-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-phone2-x', (val) => {
      state.phone2X = val;
      document.getElementById('social-phone2-x-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-phone2-y', (val) => {
      state.phone2Y = val;
      document.getElementById('social-phone2-y-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-phone2-rotation', (val) => {
      state.phone2Rotation = val;
      document.getElementById('social-phone2-rotation-value').textContent = `${val}°`;
      requestRender();
    });

    const persp2Select = document.getElementById('social-phone2-perspective');
    if (persp2Select) {
      persp2Select.addEventListener('change', () => {
        state.phone2Perspective = persp2Select.value;
        requestRender();
      });
    }
  }

  function updatePhoneSliders() {
    setSlider('social-phone-scale', state.phoneScale, `${state.phoneScale}%`);
    setSlider('social-phone-x', state.phoneX, `${state.phoneX}%`);
    setSlider('social-phone-y', state.phoneY, `${state.phoneY}%`);
    setSlider('social-phone-rotation', state.phoneRotation, `${state.phoneRotation}°`);
    const perspSel = document.getElementById('social-phone-perspective');
    if (perspSel) perspSel.value = state.phonePerspective || '';

    // Phone 2 sliders
    setSlider('social-phone2-scale', state.phone2Scale, `${state.phone2Scale}%`);
    setSlider('social-phone2-x', state.phone2X, `${state.phone2X}%`);
    setSlider('social-phone2-y', state.phone2Y, `${state.phone2Y}%`);
    setSlider('social-phone2-rotation', state.phone2Rotation, `${state.phone2Rotation}°`);
    const persp2Sel = document.getElementById('social-phone2-perspective');
    if (persp2Sel) persp2Sel.value = state.phone2Perspective || '';
    const showPhone2Toggle = document.getElementById('social-show-phone2');
    if (showPhone2Toggle) showPhone2Toggle.checked = !!state.showPhone2;
  }

  // ==================== TEXT PANEL ====================
  function setupTextPanel() {
    renderTextLayers();
    setupTextPresetControls();

    const addBtn = document.getElementById('social-btn-add-text');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        state.texts.push({
          id: state.nextTextId++,
          content: 'New text',
          font: 'Inter',
          size: 36,
          weight: 500,
          color: '#FFFFFF',
          x: 50, y: 30 + state.texts.length * 10,
          align: 'center',
          lineHeight: 1.2,
          maxWidth: 80,
          letterSpacing: 0,
          shadow: false,
          shadowColor: 'rgba(0,0,0,0.3)',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 4,
        });
        renderTextLayers();
        requestRender();
      });
    }
  }

  function setupTextPresetControls() {
    const select = document.getElementById('social-text-preset-select');
    const prevBtn = document.getElementById('social-btn-prev-text-preset');
    const applyBtn = document.getElementById('social-btn-apply-text-preset');
    const nextBtn = document.getElementById('social-btn-next-text-preset');
    const description = document.getElementById('social-text-preset-description');
    const screenshotNote = document.getElementById('social-text-preset-screenshot-note');
    if (!select || !applyBtn || !description || !screenshotNote) return;

    const presets = getSharedTextPresets();
    select.innerHTML = '';
    if (presets.length === 0) {
      const option = document.createElement('option');
      option.textContent = 'No text presets loaded';
      option.value = '';
      select.appendChild(option);
      select.disabled = true;
      applyBtn.disabled = true;
      description.textContent = 'Text preset library is unavailable.';
      screenshotNote.textContent = '';
      return;
    }

    for (const preset of presets) {
      const option = document.createElement('option');
      option.value = String(preset.number);
      option.textContent = `Preset text ${preset.number}`;
      select.appendChild(option);
    }

    const syncInfo = () => {
      const active = presets.find((item) => String(item.number) === select.value) || presets[0];
      if (!active) return;
      description.textContent = `${active.category}: ${active.subtext}`;
      screenshotNote.textContent = `Screenshot note: ${active.screenshotNote}`;
    };

    const applySelection = () => {
      const active = presets.find((item) => String(item.number) === select.value);
      if (!active) return;
      applyTextPreset(active);
    };

    const cyclePreset = (step) => {
      if (presets.length === 0) return;
      const currentIndex = Math.max(0, select.selectedIndex);
      const nextIndex = (currentIndex + step + presets.length) % presets.length;
      select.selectedIndex = nextIndex;
      syncInfo();
      applySelection();
    };

    select.addEventListener('change', syncInfo);
    applyBtn.addEventListener('click', applySelection);
    if (prevBtn) prevBtn.addEventListener('click', () => cyclePreset(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => cyclePreset(1));

    syncInfo();
  }

  function getSharedTextPresets() {
    if (!window.AdTextPresets || !Array.isArray(window.AdTextPresets.items)) return [];
    return window.AdTextPresets.items;
  }

  function applyTextPreset(preset) {
    const existing = Array.isArray(state.texts) ? state.texts : [];
    const heroTemplate = existing[0] || {};
    const subTemplate = existing[1] || {};

    const heroId = Number.isFinite(heroTemplate.id) ? heroTemplate.id : 1;
    let subId = Number.isFinite(subTemplate.id) ? subTemplate.id : 2;
    if (subId === heroId) subId = heroId + 1;

    const hero = {
      ...heroTemplate,
      id: heroId,
      content: preset.hero,
      font: 'Inter',
      weight: 700,
      size: Number.isFinite(heroTemplate.size) ? heroTemplate.size : 72,
      color: heroTemplate.color || '#FFFFFF',
      x: Number.isFinite(heroTemplate.x) ? heroTemplate.x : 50,
      y: Number.isFinite(heroTemplate.y) ? heroTemplate.y : 6,
      align: heroTemplate.align || 'center',
      lineHeight: Number.isFinite(heroTemplate.lineHeight) ? heroTemplate.lineHeight : 1.1,
      maxWidth: Number.isFinite(heroTemplate.maxWidth) ? heroTemplate.maxWidth : 85,
      letterSpacing: Number.isFinite(heroTemplate.letterSpacing) ? heroTemplate.letterSpacing : -1,
      shadow: typeof heroTemplate.shadow === 'boolean' ? heroTemplate.shadow : false,
      shadowColor: heroTemplate.shadowColor || 'rgba(0,0,0,0.3)',
      shadowBlur: Number.isFinite(heroTemplate.shadowBlur) ? heroTemplate.shadowBlur : 10,
      shadowOffsetX: Number.isFinite(heroTemplate.shadowOffsetX) ? heroTemplate.shadowOffsetX : 0,
      shadowOffsetY: Number.isFinite(heroTemplate.shadowOffsetY) ? heroTemplate.shadowOffsetY : 4,
    };

    const sub = {
      ...subTemplate,
      id: subId,
      content: preset.subtext,
      font: 'Inter',
      weight: 400,
      size: Number.isFinite(subTemplate.size) ? subTemplate.size : 36,
      color: subTemplate.color || '#FFFFFFCC',
      x: Number.isFinite(subTemplate.x) ? subTemplate.x : 50,
      y: Number.isFinite(subTemplate.y) ? subTemplate.y : 20,
      align: subTemplate.align || 'center',
      lineHeight: Number.isFinite(subTemplate.lineHeight) ? subTemplate.lineHeight : 1.3,
      maxWidth: Number.isFinite(subTemplate.maxWidth) ? subTemplate.maxWidth : 80,
      letterSpacing: Number.isFinite(subTemplate.letterSpacing) ? subTemplate.letterSpacing : 0,
      shadow: typeof subTemplate.shadow === 'boolean' ? subTemplate.shadow : false,
      shadowColor: subTemplate.shadowColor || 'rgba(0,0,0,0.2)',
      shadowBlur: Number.isFinite(subTemplate.shadowBlur) ? subTemplate.shadowBlur : 8,
      shadowOffsetX: Number.isFinite(subTemplate.shadowOffsetX) ? subTemplate.shadowOffsetX : 0,
      shadowOffsetY: Number.isFinite(subTemplate.shadowOffsetY) ? subTemplate.shadowOffsetY : 3,
    };

    state.texts = [hero, sub, ...existing.slice(2)];
    state.nextTextId = state.texts.reduce((maxId, text) => {
      return Math.max(maxId, Number.isFinite(text.id) ? text.id : 0);
    }, 0) + 1;

    renderTextLayers();
    requestRender();
  }

  function renderTextLayers() {
    const container = document.getElementById('social-text-layers');
    if (!container) return;
    container.innerHTML = '';

    for (const text of state.texts) {
      container.appendChild(createTextCard(text));
    }
  }

  function createTextCard(text) {
    const card = document.createElement('div');
    card.className = 'text-layer-card';

    // Header
    const header = document.createElement('div');
    header.className = 'text-layer-header';

    const name = document.createElement('span');
    name.className = 'text-layer-name';
    name.textContent = `Text ${text.id}`;

    const actions = document.createElement('div');
    actions.className = 'text-layer-actions';

    const dupBtn = document.createElement('button');
    dupBtn.className = 'text-layer-action';
    dupBtn.innerHTML = '⧉';
    dupBtn.title = 'Duplicate';
    dupBtn.addEventListener('click', () => {
      state.texts.push({ ...text, id: state.nextTextId++, y: text.y + 5 });
      renderTextLayers();
      requestRender();
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'text-layer-action delete';
    delBtn.innerHTML = '×';
    delBtn.title = 'Delete';
    delBtn.addEventListener('click', () => {
      state.texts = state.texts.filter(t => t.id !== text.id);
      renderTextLayers();
      requestRender();
    });

    actions.appendChild(dupBtn);
    actions.appendChild(delBtn);
    header.appendChild(name);
    header.appendChild(actions);
    card.appendChild(header);

    // Content textarea
    const textarea = document.createElement('textarea');
    textarea.className = 'text-layer-content';
    textarea.value = text.content;
    textarea.rows = 2;
    textarea.placeholder = 'Enter text...';
    textarea.addEventListener('input', () => {
      text.content = textarea.value;
      requestRender();
    });
    card.appendChild(textarea);

    // Font and weight
    const row1 = document.createElement('div');
    row1.className = 'text-controls-grid';

    const fontGroup = makeControlGroup('Font');
    const fontSelect = document.createElement('select');
    for (const font of AVAILABLE_FONTS) {
      const opt = document.createElement('option');
      opt.value = font;
      opt.textContent = font;
      if (font === text.font) opt.selected = true;
      fontSelect.appendChild(opt);
    }
    fontSelect.addEventListener('change', () => { text.font = fontSelect.value; requestRender(); });
    fontGroup.appendChild(fontSelect);
    row1.appendChild(fontGroup);

    const weightGroup = makeControlGroup('Weight');
    const weightSelect = document.createElement('select');
    for (const w of FONT_WEIGHTS) {
      const opt = document.createElement('option');
      opt.value = w.value;
      opt.textContent = w.label;
      if (w.value === text.weight) opt.selected = true;
      weightSelect.appendChild(opt);
    }
    weightSelect.addEventListener('change', () => { text.weight = parseInt(weightSelect.value); requestRender(); });
    weightGroup.appendChild(weightSelect);
    row1.appendChild(weightGroup);
    card.appendChild(row1);

    // Size and Color
    const row2 = document.createElement('div');
    row2.className = 'text-controls-row';

    const sizeGroup = makeControlGroup('Size');
    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.value = text.size;
    sizeInput.min = 12;
    sizeInput.max = 300;
    sizeInput.step = 2;
    sizeInput.style.cssText = 'width:100%;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);padding:7px 10px;color:var(--text-primary);font-size:12px;font-family:inherit;outline:none;';
    sizeInput.addEventListener('input', () => { text.size = parseInt(sizeInput.value) || 36; requestRender(); });
    sizeGroup.appendChild(sizeInput);
    row2.appendChild(sizeGroup);

    const colorGroup = makeControlGroup('Color');
    const colorRow = document.createElement('div');
    colorRow.className = 'color-input-row';
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = text.color.length === 7 ? text.color : '#FFFFFF';
    const colorHex = document.createElement('input');
    colorHex.type = 'text';
    colorHex.className = 'hex-input';
    colorHex.value = text.color;
    colorPicker.addEventListener('input', () => { text.color = colorPicker.value; colorHex.value = colorPicker.value; requestRender(); });
    colorHex.addEventListener('change', () => {
      if (/^#[0-9a-fA-F]{6,8}$/.test(colorHex.value)) {
        text.color = colorHex.value;
        if (colorHex.value.length === 7) colorPicker.value = colorHex.value;
        requestRender();
      }
    });
    colorRow.appendChild(colorPicker);
    colorRow.appendChild(colorHex);
    colorGroup.appendChild(colorRow);
    row2.appendChild(colorGroup);
    card.appendChild(row2);

    // Position
    const row3 = document.createElement('div');
    row3.className = 'text-controls-row';

    const yGroup = makeControlGroup('Y Position');
    yGroup.appendChild(makeRange(text.y, 0, 95, 1, (val) => { text.y = val; requestRender(); }));
    row3.appendChild(yGroup);

    const xGroup = makeControlGroup('X Position');
    xGroup.appendChild(makeRange(text.x, 5, 95, 1, (val) => { text.x = val; requestRender(); }));
    row3.appendChild(xGroup);
    card.appendChild(row3);

    // Width and Line Height
    const row4 = document.createElement('div');
    row4.className = 'text-controls-row';

    const mwGroup = makeControlGroup('Width');
    mwGroup.appendChild(makeRange(text.maxWidth, 20, 100, 1, (val) => { text.maxWidth = val; requestRender(); }));
    row4.appendChild(mwGroup);

    const lhGroup = makeControlGroup('Line Height');
    lhGroup.appendChild(makeRange(text.lineHeight * 100, 80, 200, 5, (val) => { text.lineHeight = val / 100; requestRender(); }));
    row4.appendChild(lhGroup);
    card.appendChild(row4);

    // Letter Spacing and Alignment
    const row5 = document.createElement('div');
    row5.className = 'text-controls-row';

    const lsGroup = makeControlGroup('Letter Spacing');
    lsGroup.appendChild(makeRange(text.letterSpacing, -5, 20, 1, (val) => { text.letterSpacing = val; requestRender(); }));
    row5.appendChild(lsGroup);

    const alignGroup = makeControlGroup('Align');
    const alignRow = document.createElement('div');
    alignRow.className = 'text-style-row';
    ['left', 'center', 'right'].forEach(a => {
      const btn = document.createElement('button');
      btn.className = `text-style-btn${a === text.align ? ' active' : ''}`;
      if (a === 'left') btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>';
      if (a === 'center') btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="10" x2="6" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="18" y1="18" x2="6" y2="18"/></svg>';
      if (a === 'right') btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="21" y1="10" x2="7" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="21" y1="18" x2="7" y2="18"/></svg>';
      btn.addEventListener('click', () => {
        text.align = a;
        alignRow.querySelectorAll('.text-style-btn').forEach(b => b.classList.toggle('active', b === btn));
        requestRender();
      });
      alignRow.appendChild(btn);
    });
    alignGroup.appendChild(alignRow);
    row5.appendChild(alignGroup);
    card.appendChild(row5);

    // Text shadow
    const shadowRow = document.createElement('div');
    shadowRow.className = 'text-shadow-row';
    const shadowLabel = document.createElement('span');
    shadowLabel.textContent = 'Text Shadow';
    shadowLabel.style.cssText = 'font-size:11px;font-weight:500;color:var(--text-secondary);text-transform:uppercase;letter-spacing:0.03em;';
    const shadowToggle = document.createElement('label');
    shadowToggle.className = 'toggle';
    const shadowCheck = document.createElement('input');
    shadowCheck.type = 'checkbox';
    shadowCheck.checked = text.shadow;
    shadowCheck.addEventListener('change', () => { text.shadow = shadowCheck.checked; requestRender(); });
    const shadowSlider = document.createElement('span');
    shadowSlider.className = 'toggle-slider';
    shadowToggle.appendChild(shadowCheck);
    shadowToggle.appendChild(shadowSlider);
    shadowRow.appendChild(shadowLabel);
    shadowRow.appendChild(shadowToggle);
    card.appendChild(shadowRow);

    return card;
  }

  // ==================== LOGO PANEL ====================
  function setupLogoPanel() {
    const zone = document.getElementById('social-logo-upload-zone');
    const input = document.getElementById('social-logo-upload-input');
    const preview = document.getElementById('social-logo-upload-preview');
    const placeholder = document.getElementById('social-logo-upload-placeholder');
    const removeBtn = document.getElementById('social-logo-upload-remove');
    if (!zone) return;

    zone.addEventListener('click', () => input.click());
    zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('drag-over'); });
    zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) loadLogo(file);
    });
    input.addEventListener('change', () => { if (input.files[0]) loadLogo(input.files[0]); });
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      state.logo = null;
      preview.classList.add('hidden');
      removeBtn.classList.add('hidden');
      placeholder.classList.remove('hidden');
      zone.classList.remove('has-image');
      requestRender();
    });

    function loadLogo(file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const img = new Image();
        img.onload = () => {
          state.logo = img;
          preview.src = ev.target.result;
          preview.classList.remove('hidden');
          removeBtn.classList.remove('hidden');
          placeholder.classList.add('hidden');
          zone.classList.add('has-image');
          requestRender();
        };
        img.src = ev.target.result;
      };
      reader.readAsDataURL(file);
    }

    bindSlider('social-logo-scale', (val) => {
      state.logoScale = val;
      document.getElementById('social-logo-scale-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-logo-x', (val) => {
      state.logoX = val;
      document.getElementById('social-logo-x-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-logo-y', (val) => {
      state.logoY = val;
      document.getElementById('social-logo-y-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('social-logo-opacity', (val) => {
      state.logoOpacity = val;
      document.getElementById('social-logo-opacity-value').textContent = `${val}%`;
      requestRender();
    });
  }

  // ==================== TEMPLATE PANEL ====================
  function setupTemplatePanel() {
    const grid = document.getElementById('social-template-grid');
    if (!grid) return;

    for (const template of BackgroundLibrary.TEMPLATES) {
      const item = document.createElement('div');
      item.className = 'social-template-item';

      const thumbCanvas = document.createElement('canvas');
      // Size based on template aspect ratio
      const preset = BackgroundLibrary.SIZE_PRESETS.find(p => p.id === template.size);
      const aspect = preset ? preset.width / preset.height : 1;
      thumbCanvas.width = 120;
      thumbCanvas.height = Math.round(120 / aspect);
      SocialRenderer.drawTemplateThumbnail(thumbCanvas, template);
      item.appendChild(thumbCanvas);

      const label = document.createElement('div');
      label.className = 'social-template-label';
      label.textContent = template.name;
      item.appendChild(label);

      const desc = document.createElement('div');
      desc.className = 'social-template-desc';
      desc.textContent = template.description;
      item.appendChild(desc);

      item.addEventListener('click', () => applyTemplate(template));
      grid.appendChild(item);
    }
  }

  function applyTemplate(template) {
    // Apply size
    const preset = BackgroundLibrary.SIZE_PRESETS.find(p => p.id === template.size);
    if (preset) {
      state.canvasWidth = preset.width;
      state.canvasHeight = preset.height;
      state.sizePresetId = preset.id;
      canvas.width = preset.width;
      canvas.height = preset.height;
      document.getElementById('social-canvas-info').textContent = `${preset.width} × ${preset.height} px`;

      const sizeSelect = document.getElementById('social-canvas-size');
      if (sizeSelect) sizeSelect.value = preset.id;
    }

    // Apply background
    if (template.background.type === 'gradient' && template.background.gradientId) {
      const gradient = BackgroundLibrary.getGradientById(template.background.gradientId);
      if (gradient) {
        state.background.type = 'gradient';
        state.background.colors = [...gradient.colors];
        state.background.angle = gradient.angle;
        state.background.gradientId = gradient.id;
      }
    } else if (template.background.type === 'solid') {
      state.background.type = 'solid';
      state.background.color = template.background.color;
    }

    // Apply phone position
    if (template.phone) {
      state.phoneX = template.phone.x;
      state.phoneY = template.phone.y;
      state.phoneScale = template.phone.scale;
      state.phoneRotation = template.phone.rotation || 0;
      updatePhoneSliders();
    }

    // Apply texts
    if (template.texts) {
      state.texts = template.texts.map((t, i) => ({
        ...t,
        id: i + 1,
        shadow: t.shadow || false,
        shadowColor: t.shadowColor || 'rgba(0,0,0,0.3)',
        shadowBlur: t.shadowBlur || 10,
        shadowOffsetX: t.shadowOffsetX || 0,
        shadowOffsetY: t.shadowOffsetY || 4,
      }));
      state.nextTextId = state.texts.length + 1;
      renderTextLayers();
    }

    requestRender();
  }

  // ==================== TABS ====================
  function setupTabs() {
    document.querySelectorAll('.social-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.socialTab;
        document.querySelectorAll('.social-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.social-tab-panel').forEach(p => p.classList.toggle('active', p.dataset.socialPanel === tab));
      });
    });
  }

  // ==================== EXPORT ====================
  function setupExport() {
    const btn = document.getElementById('social-btn-export');
    if (btn) {
      btn.addEventListener('click', exportImage);
    }

    const batchBtn = document.getElementById('social-btn-batch-export');
    if (batchBtn) {
      batchBtn.addEventListener('click', batchExport);
    }
  }

  function exportImage() {
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = state.canvasWidth;
    exportCanvas.height = state.canvasHeight;
    SocialRenderer.render(exportCanvas, state);

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      a.download = `social-post-${state.canvasWidth}x${state.canvasHeight}-${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  function batchExport() {
    // Export current design in all selected sizes
    const sizes = BackgroundLibrary.SIZE_PRESETS;
    let exported = 0;

    const currentW = state.canvasWidth;
    const currentH = state.canvasHeight;

    for (const size of sizes) {
      const exportCanvas = document.createElement('canvas');
      exportCanvas.width = size.width;
      exportCanvas.height = size.height;

      // Temporarily change state
      const origW = state.canvasWidth;
      const origH = state.canvasHeight;
      const origTexts = state.texts.map(t => ({ ...t }));

      state.canvasWidth = size.width;
      state.canvasHeight = size.height;

      // Scale text for this size
      const scaleFactor = size.width / currentW;
      for (const text of state.texts) {
        text.size = Math.round(text.size * scaleFactor);
      }

      SocialRenderer.render(exportCanvas, state);

      // Restore state
      state.canvasWidth = origW;
      state.canvasHeight = origH;
      state.texts = origTexts;

      exportCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
        a.download = `social-${size.id}-${size.width}x${size.height}-${timestamp}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        exported++;
      }, 'image/png');
    }
  }

  // ==================== ZOOM ====================
  function setupZoom() {
    let zoomLevel = 'fit';
    const zoomLevels = ['fit', 25, 50, 75, 100];
    let zoomIdx = 0;

    const display = document.getElementById('social-zoom-level');
    const zoomInBtn = document.getElementById('social-zoom-in');
    const zoomOutBtn = document.getElementById('social-zoom-out');

    if (!zoomInBtn) return;

    function applyZoom() {
      if (zoomLevel === 'fit') {
        canvas.style.maxWidth = '100%';
        canvas.style.maxHeight = '100%';
        canvas.style.width = 'auto';
        canvas.style.height = 'auto';
        display.textContent = 'Fit';
      } else {
        const scale = zoomLevel / 100;
        canvas.style.maxWidth = 'none';
        canvas.style.maxHeight = 'none';
        canvas.style.width = `${state.canvasWidth * scale}px`;
        canvas.style.height = `${state.canvasHeight * scale}px`;
        display.textContent = `${zoomLevel}%`;
      }
    }

    zoomInBtn.addEventListener('click', () => {
      if (zoomIdx < zoomLevels.length - 1) zoomIdx++;
      zoomLevel = zoomLevels[zoomIdx];
      applyZoom();
    });

    zoomOutBtn.addEventListener('click', () => {
      if (zoomIdx > 0) zoomIdx--;
      zoomLevel = zoomLevels[zoomIdx];
      applyZoom();
    });
  }

  // ==================== HELPERS ====================
  function bindSlider(id, onChange) {
    const slider = document.getElementById(id);
    if (!slider) return;
    slider.addEventListener('input', () => onChange(parseFloat(slider.value)));
  }

  function setSlider(id, value, displayText) {
    const slider = document.getElementById(id);
    const display = document.getElementById(`${id}-value`);
    if (slider) slider.value = value;
    if (display) display.textContent = displayText;
  }

  function makeControlGroup(label) {
    const group = document.createElement('div');
    group.className = 'control-group';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    group.appendChild(lbl);
    return group;
  }

  function makeRange(value, min, max, step, onChange) {
    const wrapper = document.createElement('div');
    wrapper.className = 'range-with-value';
    const input = document.createElement('input');
    input.type = 'range';
    input.value = value;
    input.min = min;
    input.max = max;
    input.step = step;
    const display = document.createElement('span');
    display.className = 'range-value';
    display.textContent = value;
    input.addEventListener('input', () => {
      const val = parseFloat(input.value);
      display.textContent = val;
      onChange(val);
    });
    wrapper.appendChild(input);
    wrapper.appendChild(display);
    return wrapper;
  }

  function roundedRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
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

  // ==================== INIT ====================
  document.addEventListener('DOMContentLoaded', () => {
    // Delay init until needed, but set up immediately if DOM ready
    init();
  });

})();
