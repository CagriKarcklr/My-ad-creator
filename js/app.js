/**
 * App — Main application controller
 * Manages state, UI bindings, and orchestrates rendering
 */

(function () {
  'use strict';

  // ==================== FONTS ====================
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

  // ==================== LAYOUT TEMPLATES ====================
  // Categories: single, dual, bleed, float, perspective
  const LAYOUTS = {
    // ===== SINGLE PHONE =====
    'single-center': {
      name: 'Center',
      category: 'single',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: 0 }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'single-top-peek': {
      name: 'Top Peek',
      category: 'single',
      phones: [{ x: 0.5, y: 0.68, width: 0.58, rotation: 0 }],
      textArea: { y: 0.05, height: 0.25 },
    },
    'single-large': {
      name: 'Large',
      category: 'single',
      phones: [{ x: 0.5, y: 0.62, width: 0.65, rotation: 0 }],
      textArea: { y: 0.04, height: 0.22 },
    },
    'tilt-left': {
      name: 'Tilt Left',
      category: 'single',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: -8 }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'tilt-right': {
      name: 'Tilt Right',
      category: 'single',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: 8 }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'offset-left': {
      name: 'Left',
      category: 'single',
      phones: [{ x: 0.38, y: 0.62, width: 0.52, rotation: 0 }],
      textArea: { y: 0.05, height: 0.28 },
    },
    'offset-right': {
      name: 'Right',
      category: 'single',
      phones: [{ x: 0.62, y: 0.62, width: 0.52, rotation: 0 }],
      textArea: { y: 0.05, height: 0.28 },
    },
    'single-small': {
      name: 'Small',
      category: 'single',
      phones: [{ x: 0.5, y: 0.58, width: 0.42, rotation: 0 }],
      textArea: { y: 0.06, height: 0.28 },
    },
    'single-hero': {
      name: 'Hero',
      category: 'single',
      phones: [{ x: 0.5, y: 0.55, width: 0.72, rotation: 0 }],
      textArea: { y: 0.03, height: 0.18 },
    },
    'single-tilt-gentle': {
      name: 'Gentle Tilt',
      category: 'single',
      phones: [{ x: 0.5, y: 0.62, width: 0.55, rotation: -4 }],
      textArea: { y: 0.06, height: 0.26 },
    },

    // ===== DUAL PHONE =====
    'dual-overlap': {
      name: 'Overlap',
      category: 'dual',
      phones: [
        { x: 0.35, y: 0.58, width: 0.48, rotation: -10 },
        { x: 0.7, y: 0.65, width: 0.48, rotation: 5 },
      ],
      textArea: { y: 0.04, height: 0.22 },
    },
    'dual-side': {
      name: 'Side by Side',
      category: 'dual',
      phones: [
        { x: 0.3, y: 0.62, width: 0.4, rotation: 0 },
        { x: 0.7, y: 0.62, width: 0.4, rotation: 0 },
      ],
      textArea: { y: 0.04, height: 0.22 },
    },
    'dual-stacked': {
      name: 'Stacked',
      category: 'dual',
      phones: [
        { x: 0.42, y: 0.56, width: 0.44, rotation: -5 },
        { x: 0.58, y: 0.68, width: 0.44, rotation: 5 },
      ],
      textArea: { y: 0.04, height: 0.2 },
    },
    'dual-fan': {
      name: 'Fan',
      category: 'dual',
      phones: [
        { x: 0.38, y: 0.6, width: 0.45, rotation: -15 },
        { x: 0.62, y: 0.6, width: 0.45, rotation: 15 },
      ],
      textArea: { y: 0.04, height: 0.22 },
    },
    'dual-cascade': {
      name: 'Cascade',
      category: 'dual',
      phones: [
        { x: 0.4, y: 0.52, width: 0.42, rotation: 0 },
        { x: 0.6, y: 0.72, width: 0.42, rotation: 0 },
      ],
      textArea: { y: 0.04, height: 0.18 },
    },
    'dual-tight': {
      name: 'Tight Pair',
      category: 'dual',
      phones: [
        { x: 0.38, y: 0.6, width: 0.42, rotation: -3 },
        { x: 0.62, y: 0.63, width: 0.42, rotation: 3 },
      ],
      textArea: { y: 0.04, height: 0.22 },
    },
    'dual-big-small': {
      name: 'Big + Small',
      category: 'dual',
      phones: [
        { x: 0.42, y: 0.58, width: 0.52, rotation: 0 },
        { x: 0.72, y: 0.7, width: 0.35, rotation: 8 },
      ],
      textArea: { y: 0.04, height: 0.2 },
    },

    // ===== EDGE BLEED (phone extends beyond canvas) =====
    'bleed-bottom': {
      name: 'Bottom Bleed',
      category: 'bleed',
      phones: [{ x: 0.5, y: 0.75, width: 0.6, rotation: 0 }],
      textArea: { y: 0.05, height: 0.3 },
    },
    'bleed-right': {
      name: 'Right Bleed',
      category: 'bleed',
      phones: [{ x: 0.72, y: 0.6, width: 0.62, rotation: 0 }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'bleed-left': {
      name: 'Left Bleed',
      category: 'bleed',
      phones: [{ x: 0.28, y: 0.6, width: 0.62, rotation: 0 }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'bleed-bottom-large': {
      name: 'Bottom XL',
      category: 'bleed',
      phones: [{ x: 0.5, y: 0.78, width: 0.75, rotation: 0 }],
      textArea: { y: 0.04, height: 0.3 },
    },
    'bleed-corner-right': {
      name: 'Corner Right',
      category: 'bleed',
      phones: [{ x: 0.68, y: 0.75, width: 0.6, rotation: 8 }],
      textArea: { y: 0.05, height: 0.28 },
    },
    'bleed-corner-left': {
      name: 'Corner Left',
      category: 'bleed',
      phones: [{ x: 0.32, y: 0.75, width: 0.6, rotation: -8 }],
      textArea: { y: 0.05, height: 0.28 },
    },
    'bleed-right-tilt': {
      name: 'Right Tilt Out',
      category: 'bleed',
      phones: [{ x: 0.65, y: 0.65, width: 0.58, rotation: 12 }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'bleed-left-tilt': {
      name: 'Left Tilt Out',
      category: 'bleed',
      phones: [{ x: 0.35, y: 0.65, width: 0.58, rotation: -12 }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'bleed-dual-spread': {
      name: 'Spread Out',
      category: 'bleed',
      phones: [
        { x: 0.22, y: 0.65, width: 0.5, rotation: -8 },
        { x: 0.78, y: 0.65, width: 0.5, rotation: 8 },
      ],
      textArea: { y: 0.04, height: 0.25 },
    },
    'bleed-dual-bottom': {
      name: 'Dual Bottom',
      category: 'bleed',
      phones: [
        { x: 0.32, y: 0.78, width: 0.48, rotation: -5 },
        { x: 0.68, y: 0.78, width: 0.48, rotation: 5 },
      ],
      textArea: { y: 0.04, height: 0.28 },
    },
    'bleed-overflow': {
      name: 'Overflow',
      category: 'bleed',
      phones: [{ x: 0.5, y: 0.85, width: 0.7, rotation: 0 }],
      textArea: { y: 0.04, height: 0.36 },
    },
    'bleed-peek-right': {
      name: 'Peek Right',
      category: 'bleed',
      phones: [{ x: 0.8, y: 0.58, width: 0.55, rotation: -5 }],
      textArea: { y: 0.05, height: 0.3 },
    },

    // ===== FLOATING (elevated, dramatic) =====
    'float-center-high': {
      name: 'High Float',
      category: 'float',
      phones: [{ x: 0.5, y: 0.52, width: 0.5, rotation: 0 }],
      textArea: { y: 0.05, height: 0.18 },
    },
    'float-dramatic': {
      name: 'Dramatic',
      category: 'float',
      phones: [{ x: 0.5, y: 0.55, width: 0.55, rotation: -12 }],
      textArea: { y: 0.05, height: 0.2 },
    },
    'float-lean-left': {
      name: 'Lean Left',
      category: 'float',
      phones: [{ x: 0.4, y: 0.56, width: 0.5, rotation: -18 }],
      textArea: { y: 0.05, height: 0.22 },
    },
    'float-lean-right': {
      name: 'Lean Right',
      category: 'float',
      phones: [{ x: 0.6, y: 0.56, width: 0.5, rotation: 18 }],
      textArea: { y: 0.05, height: 0.22 },
    },
    'float-angled-pair': {
      name: 'Angled Pair',
      category: 'float',
      phones: [
        { x: 0.35, y: 0.55, width: 0.42, rotation: -20 },
        { x: 0.65, y: 0.55, width: 0.42, rotation: 20 },
      ],
      textArea: { y: 0.04, height: 0.2 },
    },
    'float-v-shape': {
      name: 'V-Shape',
      category: 'float',
      phones: [
        { x: 0.32, y: 0.58, width: 0.4, rotation: -25 },
        { x: 0.68, y: 0.58, width: 0.4, rotation: 25 },
      ],
      textArea: { y: 0.04, height: 0.22 },
    },

    // ===== PERSPECTIVE / 3D =====
    'persp-left': {
      name: 'Turn Left',
      category: 'perspective',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: 0, perspective: 'left' }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'persp-right': {
      name: 'Turn Right',
      category: 'perspective',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: 0, perspective: 'right' }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'persp-left-strong': {
      name: 'Deep Left',
      category: 'perspective',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: 0, perspective: 'left-strong' }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'persp-right-strong': {
      name: 'Deep Right',
      category: 'perspective',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: 0, perspective: 'right-strong' }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'persp-iso-left': {
      name: 'Iso Left',
      category: 'perspective',
      phones: [{ x: 0.5, y: 0.6, width: 0.52, rotation: 10, perspective: 'left' }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'persp-iso-right': {
      name: 'Iso Right',
      category: 'perspective',
      phones: [{ x: 0.5, y: 0.6, width: 0.52, rotation: -10, perspective: 'right' }],
      textArea: { y: 0.06, height: 0.26 },
    },
    'persp-flat': {
      name: 'Flat Lay',
      category: 'perspective',
      phones: [{ x: 0.5, y: 0.6, width: 0.55, rotation: 0, perspective: 'flat' }],
      textArea: { y: 0.04, height: 0.2 },
    },
    'persp-dual-showcase': {
      name: 'Duo Showcase',
      category: 'perspective',
      phones: [
        { x: 0.35, y: 0.6, width: 0.44, rotation: 0, perspective: 'left' },
        { x: 0.65, y: 0.6, width: 0.44, rotation: 0, perspective: 'right' },
      ],
      textArea: { y: 0.04, height: 0.22 },
    },
  };

  // ==================== GRADIENT PRESETS ====================
  const GRADIENT_PRESETS = [
    { name: 'Spendaily', colors: ['#5B9BD5', '#8B6DB5', '#D4779C'], angle: 180 },
    { name: 'Ocean', colors: ['#667eea', '#764ba2'], angle: 135 },
    { name: 'Sunset', colors: ['#fa709a', '#fee140'], angle: 135 },
    { name: 'Mint', colors: ['#a8edea', '#fed6e3'], angle: 135 },
    { name: 'Deep Sea', colors: ['#0f0c29', '#302b63', '#24243e'], angle: 180 },
    { name: 'Peach', colors: ['#ffecd2', '#fcb69f'], angle: 135 },
    { name: 'Cosmic', colors: ['#ff6a88', '#ff99ac', '#fcb045'], angle: 135 },
    { name: 'Northern', colors: ['#43e97b', '#38f9d7'], angle: 135 },
    { name: 'Royal', colors: ['#536976', '#292E49'], angle: 180 },
    { name: 'Lavender', colors: ['#c471f5', '#fa71cd'], angle: 135 },
    { name: 'Night Sky', colors: ['#0f2027', '#203a43', '#2c5364'], angle: 180 },
    { name: 'Warm', colors: ['#f5af19', '#f12711'], angle: 135 },
    { name: 'Berry', colors: ['#8E2DE2', '#4A00E0'], angle: 135 },
    { name: 'Sky', colors: ['#89f7fe', '#66a6ff'], angle: 180 },
    { name: 'Rose', colors: ['#eecda3', '#ef629f'], angle: 135 },
    { name: 'Midnight', colors: ['#232526', '#414345'], angle: 180 },
    { name: 'Aurora', colors: ['#56CCF2', '#2F80ED', '#6FCF97'], angle: 145 },
    { name: 'Cherry Soda', colors: ['#ff4e50', '#f9d423'], angle: 135 },
    { name: 'Indigo Dust', colors: ['#3f2b96', '#a8c0ff'], angle: 160 },
    { name: 'Sea Glass', colors: ['#7de2d1', '#b8f2e6', '#faf3dd'], angle: 170 },
    { name: 'Saffron Glow', colors: ['#f7971e', '#ffd200', '#ffecd2'], angle: 135 },
    { name: 'Graphite', colors: ['#0f2027', '#203a43', '#2c5364'], angle: 180 },
    { name: 'Blueberry Milk', colors: ['#8ec5fc', '#e0c3fc', '#fef9d7'], angle: 150 },
    { name: 'Neon Tide', colors: ['#00c6ff', '#0072ff', '#9b23ea'], angle: 140 },
    { name: 'Copper Rose', colors: ['#b76e79', '#d8a39d', '#f7d9c4'], angle: 160 },
    { name: 'Emerald Night', colors: ['#0f5132', '#198754', '#74c69d'], angle: 155 },
    { name: 'Frosted Lilac', colors: ['#d6cff0', '#e9d8fd', '#f7f7ff'], angle: 180 },
    { name: 'Tangerine Pop', colors: ['#ff7e5f', '#feb47b', '#ffe29f'], angle: 135 },
  ];

  // ==================== APPLICATION STATE ====================
  let state = createDefaultState();

  function createDefaultState() {
    return {
      canvasWidth: 1290,
      canvasHeight: 2796,
      screenshot: null,
      screenshot2: null,
      currentLayoutId: 'single-center',
      currentLayout: LAYOUTS['single-center'],
      background: {
        type: 'gradient',
        colors: ['#5B9BD5', '#8B6DB5', '#D4779C'],
        stops: [0, 0.5, 1],
        angle: 180,
        color: '#1a1a2e',
        patternId: 'pat-ribbon-layers',
        patternColors: ['#8D7EDB', '#C5B8F0', '#ECE5FF'],
        patternIntensity: 72,
        patternGrain: 0,
        meshColors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
        meshComplexity: 5,
      },
      phoneScale: 55,
      phoneX: 50,
      phoneY: 60,
      phoneRotation: 0,
      phonePerspective: '',
      phone2Scale: 48,
      phone2X: 70,
      phone2Y: 65,
      phone2Rotation: 5,
      phone2Perspective: '',
      phoneFrameColor: '#1C1C1E',
      frameType: 'iphone',
      phoneShadow: true,
      shadowIntensity: 40,
      shadowBlur: 60,
      screenBrightness: 0,
      screenRadius: 17,
      texts: [
        {
          id: 1,
          content: 'Know exactly what\nyou can spend today.',
          font: 'Inter',
          size: 96,
          weight: 700,
          color: '#FFFFFF',
          x: 50, y: 7,
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
          content: 'Stay in your monthly limit.',
          font: 'Inter',
          size: 52,
          weight: 400,
          color: '#FFFFFF',
          x: 50, y: 25,
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
      extractedColors: [],
      logo: null,
      logoX: 50,
      logoY: 90,
      logoScale: 15,
      logoOpacity: 100,
    };
  }

  // ==================== DOM REFERENCES ====================
  const canvas = document.getElementById('main-canvas');
  const canvasWrapper = document.getElementById('canvas-wrapper');

  const SNAP_THRESHOLD_PX = 12;
  let canvasDragState = null;
  let dragGuideLines = [];

  // ==================== INITIALIZATION ====================
  function init() {
    setupCanvas();
    setupCanvasDrag();
    setupUploadZones();
    setupLayoutGrid();
    setupTextPanel();
    setupBackgroundPanel();
    setupPhonePanel();
    setupLogoPanel();
    setupTabs();
    setupNavigation();
    setupExport();
    setupReset();
    setupZoom();
    setupCanvasSize();
    setupKeyboardShortcuts();

    // Wait for fonts then render
    document.fonts.ready.then(() => {
      requestRender();
    });
  }

  // ==================== CANVAS SETUP ====================
  function setupCanvas() {
    canvas.width = state.canvasWidth;
    canvas.height = state.canvasHeight;
    requestRender();
  }

  let renderPending = false;
  function requestRender() {
    if (renderPending) return;
    renderPending = true;
    requestAnimationFrame(() => {
      renderPending = false;
      Renderer.render(canvas, state);
      drawDragGuides();
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

    if (draggedType === 'text') updateTextUI();
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

    if (state.currentLayout && Array.isArray(state.currentLayout.phones)) {
      for (let i = 0; i < state.currentLayout.phones.length; i++) {
        const isPrimary = i === 0;
        const phoneScale = isPrimary ? state.phoneScale : state.phone2Scale;
        const phoneX = isPrimary ? state.phoneX : state.phone2X;
        const phoneY = isPrimary ? state.phoneY : state.phone2Y;
        const frameType = state.frameType || 'iphone';
        const phoneAspect = Renderer.getPhoneAspectRatio
          ? Renderer.getPhoneAspectRatio(frameType)
          : Renderer.PHONE_W_TO_H;

        const w = W * (phoneScale / 100);
        const h = w / phoneAspect;
        const cx = W * (phoneX / 100);
        const cy = H * (phoneY / 100);

        items.push({
          id: isPrimary ? 'phone-1' : 'phone-2',
          type: 'phone',
          index: i,
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
    const fontSize = text.size || 72;
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
        const [minX, maxX] = getSliderBounds('phone-x', 0, 100);
        const [minY, maxY] = getSliderBounds('phone-y', 0, 100);
        state.phoneX = roundToStep(clamp(xPct, minX, maxX), 0.1);
        state.phoneY = roundToStep(clamp(yPct, minY, maxY), 0.1);
      } else {
        const [minX, maxX] = getSliderBounds('phone2-x', 0, 100);
        const [minY, maxY] = getSliderBounds('phone2-y', 0, 100);
        state.phone2X = roundToStep(clamp(xPct, minX, maxX), 0.1);
        state.phone2Y = roundToStep(clamp(yPct, minY, maxY), 0.1);
      }
      syncDraggedControls('phone', activeItem.index);
    } else if (activeItem.type === 'text') {
      const target = state.texts.find((text) => `text-${text.id}` === itemId);
      if (target) {
        target.x = roundToStep(clamp(xPct, 5, 95), 0.1);
        target.y = roundToStep(clamp(yPct, 0, 90), 0.1);
      }
    } else if (activeItem.type === 'logo') {
      const [minX, maxX] = getSliderBounds('logo-x', 0, 100);
      const [minY, maxY] = getSliderBounds('logo-y', 0, 100);
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
      setSliderValue('phone-x', state.phoneX, `${state.phoneX}%`);
      setSliderValue('phone-y', state.phoneY, `${state.phoneY}%`);
      return;
    }
    if (type === 'phone' && index === 1) {
      setSliderValue('phone2-x', state.phone2X, `${state.phone2X}%`);
      setSliderValue('phone2-y', state.phone2Y, `${state.phone2Y}%`);
      return;
    }
    if (type === 'logo') {
      setSliderValue('logo-x', state.logoX, `${state.logoX}%`);
      setSliderValue('logo-y', state.logoY, `${state.logoY}%`);
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

  // ==================== UPLOAD ZONES ====================
  function setupUploadZones() {
    setupSingleUpload(1);
    setupSingleUpload(2);

    // Auto theme button
    document.getElementById('btn-auto-theme').addEventListener('click', () => {
      if (!state.screenshot) return;
      applyAutoTheme();
    });
  }

  function setupSingleUpload(num) {
    const zone = document.getElementById(`upload-zone-${num}`);
    const input = document.getElementById(`upload-input-${num}`);
    const preview = document.getElementById(`upload-preview-${num}`);
    const placeholder = document.getElementById(`upload-placeholder-${num}`);
    const removeBtn = document.getElementById(`upload-remove-${num}`);

    zone.addEventListener('click', (e) => {
      if (e.target === removeBtn) return;
      input.click();
    });

    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('drag-over');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('drag-over');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        loadImageFile(file, num);
      }
    });

    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) loadImageFile(file, num);
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (num === 1) state.screenshot = null;
      else state.screenshot2 = null;
      preview.src = '';
      preview.classList.add('hidden');
      removeBtn.classList.add('hidden');
      placeholder.classList.remove('hidden');
      zone.classList.remove('has-image');
      input.value = '';
      requestRender();
    });
  }

  function loadImageFile(file, num) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        if (num === 1) {
          state.screenshot = img;
          // Auto-apply theme whenever a new screenshot is uploaded
          applyAutoTheme();
        } else {
          state.screenshot2 = img;
        }

        const preview = document.getElementById(`upload-preview-${num}`);
        const placeholder = document.getElementById(`upload-placeholder-${num}`);
        const removeBtn = document.getElementById(`upload-remove-${num}`);
        const zone = document.getElementById(`upload-zone-${num}`);

        preview.src = e.target.result;
        preview.classList.remove('hidden');
        removeBtn.classList.remove('hidden');
        placeholder.classList.add('hidden');
        zone.classList.add('has-image');

        requestRender();
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function applyAutoTheme() {
    if (!state.screenshot) return;

    const colors = ColorExtractor.extract(state.screenshot, 8);
    const brightness = ColorExtractor.analyzeBrightness(state.screenshot);
    const gradient = ColorExtractor.generateGradient(colors, brightness);
    const textColor = ColorExtractor.suggestTextColor(gradient.colors);

    state.extractedColors = colors;
    state.background.type = 'gradient';
    state.background.colors = gradient.colors;
    state.background.stops = gradient.colors.map((_, i) => i / (gradient.colors.length - 1));
    state.background.angle = gradient.angle;

    // Update text colors
    for (const text of state.texts) {
      text.color = textColor;
    }

    // Show extracted colors in UI
    showExtractedColors(colors);
    updateBackgroundUI();
    updateTextUI();
    activateBgType('gradient');
    requestRender();
  }

  function showExtractedColors(colors) {
    const container = document.getElementById('extracted-colors');
    const swatches = document.getElementById('color-swatches');
    container.classList.remove('hidden');
    swatches.innerHTML = '';

    for (const color of colors) {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      swatch.style.background = color.hex;
      swatch.title = color.hex;
      swatch.addEventListener('click', () => {
        // Copy to clipboard
        navigator.clipboard.writeText(color.hex).catch(() => {});
      });
      swatches.appendChild(swatch);
    }
  }

  // ==================== LAYOUT GRID ====================
  let activeCat = 'all';

  function setupLayoutGrid() {
    renderLayoutGrid('all');

    // Category buttons
    document.querySelectorAll('.layout-cat-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.layout-cat-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.dataset.cat;
        renderLayoutGrid(activeCat);
      });
    });
  }

  const CATEGORY_LABELS = {
    single: 'Single',
    dual: 'Dual',
    bleed: 'Edge Bleed',
    float: 'Floating',
    perspective: '3D'
  };

  function renderLayoutGrid(category) {
    const grid = document.getElementById('layout-grid');
    grid.innerHTML = '';

    // Group layouts by category
    const groups = {};
    for (const [id, layout] of Object.entries(LAYOUTS)) {
      if (category !== 'all' && layout.category !== category) continue;
      const cat = layout.category;
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push({ id, layout });
    }

    // Render each group as a labelled horizontal row
    for (const [cat, items] of Object.entries(groups)) {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'layout-group';

      const title = document.createElement('h4');
      title.className = 'layout-group-title';
      title.textContent = CATEGORY_LABELS[cat] || cat;
      groupDiv.appendChild(title);

      const row = document.createElement('div');
      row.className = 'layout-group-row';

      for (const { id, layout } of items) {
        const option = document.createElement('div');
        option.className = `layout-option${id === state.currentLayoutId ? ' active' : ''}`;
        option.dataset.layoutId = id;

        const thumbCanvas = document.createElement('canvas');
        thumbCanvas.width = 72;
        thumbCanvas.height = 130;
        Renderer.drawLayoutThumbnail(thumbCanvas, layout);
        option.appendChild(thumbCanvas);

        const label = document.createElement('div');
        label.className = 'layout-label';
        label.textContent = layout.name;
        option.appendChild(label);

        option.addEventListener('click', () => {
          selectLayout(id);
        });

        row.appendChild(option);
      }

      groupDiv.appendChild(row);
      grid.appendChild(groupDiv);
    }
  }

  function selectLayout(layoutId) {
    state.currentLayoutId = layoutId;
    state.currentLayout = LAYOUTS[layoutId];

    // Reset phone positions to layout defaults
    const p1 = state.currentLayout.phones[0];
    state.phoneScale = Math.round(p1.width * 100);
    state.phoneX = Math.round(p1.x * 100);
    state.phoneY = Math.round(p1.y * 100);
    state.phoneRotation = p1.rotation || 0;
    state.phonePerspective = p1.perspective || '';

    if (state.currentLayout.phones.length > 1) {
      const p2 = state.currentLayout.phones[1];
      state.phone2Scale = Math.round(p2.width * 100);
      state.phone2X = Math.round(p2.x * 100);
      state.phone2Y = Math.round(p2.y * 100);
      state.phone2Rotation = p2.rotation || 0;
      state.phone2Perspective = p2.perspective || '';
      document.getElementById('dual-controls').classList.remove('hidden');
    } else {
      document.getElementById('dual-controls').classList.add('hidden');
    }

    // Update active state in grid
    document.querySelectorAll('.layout-option').forEach(el => {
      el.classList.toggle('active', el.dataset.layoutId === layoutId);
    });

    // Update slider UI
    updateLayoutSlidersUI();
    requestRender();
  }

  function updateLayoutSlidersUI() {
    setSliderValue('phone-scale', state.phoneScale, `${state.phoneScale}%`);
    setSliderValue('phone-x', state.phoneX, `${state.phoneX}%`);
    setSliderValue('phone-y', state.phoneY, `${state.phoneY}%`);
    setSliderValue('phone-rotation', state.phoneRotation, `${state.phoneRotation}°`);

    setSliderValue('phone2-scale', state.phone2Scale, `${state.phone2Scale}%`);
    setSliderValue('phone2-x', state.phone2X, `${state.phone2X}%`);
    setSliderValue('phone2-y', state.phone2Y, `${state.phone2Y}%`);
    setSliderValue('phone2-rotation', state.phone2Rotation, `${state.phone2Rotation}°`);
  }

  function setSliderValue(id, value, displayText) {
    const slider = document.getElementById(id);
    const display = document.getElementById(`${id}-value`);
    if (slider) slider.value = value;
    if (display) display.textContent = displayText;
  }

  // ==================== TEXT PANEL ====================
  function setupTextPanel() {
    renderTextLayers();

    document.getElementById('btn-add-text').addEventListener('click', () => {
      state.texts.push({
        id: state.nextTextId++,
        content: 'New text',
        font: 'Inter',
        size: 56,
        weight: 500,
        color: '#FFFFFF',
        x: 50, y: 35 + state.texts.length * 8,
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

  function renderTextLayers() {
    const container = document.getElementById('text-layers');
    container.innerHTML = '';

    for (const text of state.texts) {
      const card = createTextLayerCard(text);
      container.appendChild(card);
    }
  }

  function createTextLayerCard(text) {
    const card = document.createElement('div');
    card.className = 'text-layer-card';
    card.dataset.textId = text.id;

    // Header
    const header = document.createElement('div');
    header.className = 'text-layer-header';

    const name = document.createElement('span');
    name.className = 'text-layer-name';
    name.textContent = `Text ${text.id}`;

    const actions = document.createElement('div');
    actions.className = 'text-layer-actions';

    // Duplicate button
    const dupBtn = document.createElement('button');
    dupBtn.className = 'text-layer-action';
    dupBtn.innerHTML = '⧉';
    dupBtn.title = 'Duplicate';
    dupBtn.addEventListener('click', () => {
      const newText = { ...text, id: state.nextTextId++, y: text.y + 5 };
      state.texts.push(newText);
      renderTextLayers();
      requestRender();
    });

    // Delete button
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

    // Font and weight row
    const controlsGrid = document.createElement('div');
    controlsGrid.className = 'text-controls-grid';

    // Font select
    const fontGroup = createControlGroup('Font');
    const fontSelect = document.createElement('select');
    for (const font of AVAILABLE_FONTS) {
      const opt = document.createElement('option');
      opt.value = font;
      opt.textContent = font;
      opt.style.fontFamily = font;
      if (font === text.font) opt.selected = true;
      fontSelect.appendChild(opt);
    }
    fontSelect.addEventListener('change', () => {
      text.font = fontSelect.value;
      requestRender();
    });
    fontGroup.appendChild(fontSelect);
    controlsGrid.appendChild(fontGroup);

    // Weight select
    const weightGroup = createControlGroup('Weight');
    const weightSelect = document.createElement('select');
    for (const w of FONT_WEIGHTS) {
      const opt = document.createElement('option');
      opt.value = w.value;
      opt.textContent = w.label;
      if (w.value === text.weight) opt.selected = true;
      weightSelect.appendChild(opt);
    }
    weightSelect.addEventListener('change', () => {
      text.weight = parseInt(weightSelect.value);
      requestRender();
    });
    weightGroup.appendChild(weightSelect);
    controlsGrid.appendChild(weightGroup);

    card.appendChild(controlsGrid);

    // Size and Color row
    const row2 = document.createElement('div');
    row2.className = 'text-controls-row';

    // Size
    const sizeGroup = createControlGroup('Size');
    const sizeInput = document.createElement('input');
    sizeInput.type = 'number';
    sizeInput.value = text.size;
    sizeInput.min = 12;
    sizeInput.max = 300;
    sizeInput.step = 2;
    sizeInput.style.cssText = 'width:100%;background:var(--bg-tertiary);border:1px solid var(--border);border-radius:var(--radius-sm);padding:7px 10px;color:var(--text-primary);font-size:12px;font-family:inherit;outline:none;';
    sizeInput.addEventListener('input', () => {
      text.size = parseInt(sizeInput.value) || 48;
      requestRender();
    });
    sizeGroup.appendChild(sizeInput);
    row2.appendChild(sizeGroup);

    // Color
    const colorGroup = createControlGroup('Color');
    const colorRow = document.createElement('div');
    colorRow.className = 'color-input-row';
    const colorPicker = document.createElement('input');
    colorPicker.type = 'color';
    colorPicker.value = text.color;
    const colorHex = document.createElement('input');
    colorHex.type = 'text';
    colorHex.className = 'hex-input';
    colorHex.value = text.color;

    colorPicker.addEventListener('input', () => {
      text.color = colorPicker.value;
      colorHex.value = colorPicker.value;
      requestRender();
    });
    colorHex.addEventListener('change', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(colorHex.value)) {
        text.color = colorHex.value;
        colorPicker.value = colorHex.value;
        requestRender();
      }
    });
    colorRow.appendChild(colorPicker);
    colorRow.appendChild(colorHex);
    colorGroup.appendChild(colorRow);
    row2.appendChild(colorGroup);

    card.appendChild(row2);

    // Position and spacing
    const row3 = document.createElement('div');
    row3.className = 'text-controls-row';

    // Y position
    const yGroup = createControlGroup('Y Position');
    const yRange = createRange(text.y, 0, 90, 1, (val) => {
      text.y = val;
      requestRender();
    });
    yGroup.appendChild(yRange);
    row3.appendChild(yGroup);

    // X position
    const xGroup = createControlGroup('X Position');
    const xRange = createRange(text.x, 5, 95, 1, (val) => {
      text.x = val;
      requestRender();
    });
    xGroup.appendChild(xRange);
    row3.appendChild(xGroup);

    card.appendChild(row3);

    const row4 = document.createElement('div');
    row4.className = 'text-controls-row';

    // Max Width
    const mwGroup = createControlGroup('Width');
    const mwRange = createRange(text.maxWidth, 20, 100, 1, (val) => {
      text.maxWidth = val;
      requestRender();
    });
    mwGroup.appendChild(mwRange);
    row4.appendChild(mwGroup);

    // Line Height
    const lhGroup = createControlGroup('Line Height');
    const lhRange = createRange(text.lineHeight * 100, 80, 200, 5, (val) => {
      text.lineHeight = val / 100;
      requestRender();
    });
    lhGroup.appendChild(lhRange);
    row4.appendChild(lhGroup);

    card.appendChild(row4);

    // Letter spacing
    const row5 = document.createElement('div');
    row5.className = 'text-controls-row';

    const lsGroup = createControlGroup('Letter Spacing');
    const lsRange = createRange(text.letterSpacing, -5, 20, 1, (val) => {
      text.letterSpacing = val;
      requestRender();
    });
    lsGroup.appendChild(lsRange);
    row5.appendChild(lsGroup);

    // Alignment
    const alignGroup = createControlGroup('Align');
    const alignRow = document.createElement('div');
    alignRow.className = 'text-style-row';
    ['left', 'center', 'right'].forEach(a => {
      const btn = document.createElement('button');
      btn.className = `text-style-btn${a === text.align ? ' active' : ''}`;
      btn.innerHTML = a === 'left' ? '≡' : a === 'center' ? '≡' : '≡';
      btn.title = a.charAt(0).toUpperCase() + a.slice(1);
      btn.style.fontWeight = a === 'center' ? '400' : '400';
      // Use distinct symbols
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

    // Text shadow toggle
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
    shadowCheck.addEventListener('change', () => {
      text.shadow = shadowCheck.checked;
      requestRender();
    });
    const shadowSlider = document.createElement('span');
    shadowSlider.className = 'toggle-slider';
    shadowToggle.appendChild(shadowCheck);
    shadowToggle.appendChild(shadowSlider);
    shadowRow.appendChild(shadowLabel);
    shadowRow.appendChild(shadowToggle);
    card.appendChild(shadowRow);

    return card;
  }

  function createControlGroup(label) {
    const group = document.createElement('div');
    group.className = 'control-group';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    group.appendChild(lbl);
    return group;
  }

  function createRange(value, min, max, step, onChange) {
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

  function updateTextUI() {
    renderTextLayers();
  }

  // ==================== BACKGROUND PANEL ====================
  function setupBackgroundPanel() {
    // Background type toggle
    document.querySelectorAll('.bg-type-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        activateBgType(btn.dataset.bgType);
      });
    });

    // Gradient presets
    renderGradientPresets();
    renderGradientStops();
    renderPatternPresets();
    bindPatternColorInputs();
    syncPatternColorInputs();
    bindPatternToneInputs();
    syncPatternToneInputs();

    // Gradient angle slider
    bindSlider('gradient-angle', (val) => {
      state.background.angle = val;
      document.getElementById('gradient-angle-value').textContent = `${val}°`;
      requestRender();
    });

    // Add stop button
    document.getElementById('btn-add-stop').addEventListener('click', () => {
      state.background.colors.push('#ffffff');
      state.background.stops = state.background.colors.map((_, i) => i / (state.background.colors.length - 1));
      renderGradientStops();
      requestRender();
    });

    // Solid color
    const solidColor = document.getElementById('solid-color');
    const solidHex = document.getElementById('solid-color-hex');
    solidColor.addEventListener('input', () => {
      state.background.color = solidColor.value;
      solidHex.value = solidColor.value;
      requestRender();
    });
    solidHex.addEventListener('change', () => {
      if (/^#[0-9a-fA-F]{6}$/.test(solidHex.value)) {
        state.background.color = solidHex.value;
        solidColor.value = solidHex.value;
        requestRender();
      }
    });

    // Mesh colors
    for (let i = 1; i <= 4; i++) {
      const input = document.getElementById(`mesh-color-${i}`);
      input.addEventListener('input', () => {
        state.background.meshColors[i - 1] = input.value;
        requestRender();
      });
    }

    // Mesh complexity
    bindSlider('mesh-complexity', (val) => {
      state.background.meshComplexity = val;
      document.getElementById('mesh-complexity-value').textContent = val;
      requestRender();
    });

    syncBgTypeVisibility(state.background.type);
  }

  function activateBgType(type) {
    state.background.type = type;
    syncBgTypeVisibility(type);

    requestRender();
  }

  function syncBgTypeVisibility(type) {
    document.querySelectorAll('.bg-type-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.bgType === type);
    });

    document.getElementById('bg-gradient-controls').classList.toggle('hidden', type !== 'gradient');
    document.getElementById('bg-solid-controls').classList.toggle('hidden', type !== 'solid');
    document.getElementById('bg-pattern-controls').classList.toggle('hidden', type !== 'pattern');
    document.getElementById('bg-mesh-controls').classList.toggle('hidden', type !== 'mesh');
  }

  function renderGradientPresets() {
    const container = document.getElementById('gradient-presets');
    container.innerHTML = '';

    for (const preset of GRADIENT_PRESETS) {
      const btn = document.createElement('div');
      btn.className = 'gradient-preset';
      const gradCSS = `linear-gradient(${preset.angle}deg, ${preset.colors.join(', ')})`;
      btn.style.background = gradCSS;
      btn.title = preset.name;

      btn.addEventListener('click', () => {
        state.background.colors = [...preset.colors];
        state.background.stops = preset.colors.map((_, i) => i / (preset.colors.length - 1));
        state.background.angle = preset.angle;
        renderGradientStops();
        setSliderValue('gradient-angle', preset.angle, `${preset.angle}°`);

        // Update active preset
        container.querySelectorAll('.gradient-preset').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');

        requestRender();
      });

      container.appendChild(btn);
    }
  }

  function renderGradientStops() {
    const container = document.getElementById('gradient-stops');
    container.innerHTML = '';

    for (let i = 0; i < state.background.colors.length; i++) {
      const row = document.createElement('div');
      row.className = 'gradient-stop-row';

      const colorInput = document.createElement('input');
      colorInput.type = 'color';
      colorInput.value = state.background.colors[i];
      colorInput.addEventListener('input', () => {
        state.background.colors[i] = colorInput.value;
        requestRender();
      });

      const hexInput = document.createElement('input');
      hexInput.type = 'text';
      hexInput.className = 'hex-input';
      hexInput.value = state.background.colors[i];
      hexInput.style.flex = '1';
      hexInput.addEventListener('change', () => {
        if (/^#[0-9a-fA-F]{6}$/.test(hexInput.value)) {
          state.background.colors[i] = hexInput.value;
          colorInput.value = hexInput.value;
          requestRender();
        }
      });

      row.appendChild(colorInput);
      row.appendChild(hexInput);

      // Remove button (minimum 2 stops)
      if (state.background.colors.length > 2) {
        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove-stop';
        removeBtn.innerHTML = '×';
        removeBtn.addEventListener('click', () => {
          state.background.colors.splice(i, 1);
          state.background.stops = state.background.colors.map((_, j) => j / (state.background.colors.length - 1));
          renderGradientStops();
          requestRender();
        });
        row.appendChild(removeBtn);
      }

      container.appendChild(row);
    }
  }

  function renderPatternPresets() {
    const container = document.getElementById('pattern-presets');
    if (!container) return;
    container.innerHTML = '';

    const patterns = window.BackgroundLibrary && window.BackgroundLibrary.PATTERNS;
    if (!patterns || patterns.length === 0) return;

    ensurePatternColors();
    const accent = state.background.patternColors[0];

    for (const pattern of patterns) {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = `pattern-preset-item${state.background.patternId === pattern.id ? ' active' : ''}`;
      item.dataset.patternId = pattern.id;
      item.title = pattern.name;

      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 120;
      thumbCanvas.height = 120;
      const tctx = thumbCanvas.getContext('2d');
      try {
        pattern.generate(tctx, 120, 120, accent);
      } catch (_) {
        tctx.fillStyle = '#D8D8E8';
        tctx.fillRect(0, 0, 120, 120);
      }
      item.style.backgroundImage = `url(${thumbCanvas.toDataURL()})`;

      item.addEventListener('click', () => {
        state.background.patternId = pattern.id;
        activateBgType('pattern');
        updateBackgroundUI();
      });

      container.appendChild(item);
    }
  }

  function bindPatternColorInputs() {
    for (let i = 1; i <= 3; i++) {
      const picker = document.getElementById(`pattern-color-${i}`);
      const hex = document.getElementById(`pattern-color-${i}-hex`);
      if (!picker || !hex) continue;

      picker.addEventListener('input', () => {
        ensurePatternColors();
        state.background.patternColors[i - 1] = picker.value;
        hex.value = picker.value.toUpperCase();
        renderPatternPresets();
        requestRender();
      });

      hex.addEventListener('change', () => {
        const normalized = normalizeHexColor(hex.value);
        if (!normalized) return;
        ensurePatternColors();
        state.background.patternColors[i - 1] = normalized;
        picker.value = normalized;
        hex.value = normalized.toUpperCase();
        renderPatternPresets();
        requestRender();
      });
    }
  }

  function ensurePatternColors() {
    if (!Array.isArray(state.background.patternColors)) {
      state.background.patternColors = ['#8D7EDB', '#C5B8F0', '#ECE5FF'];
      return;
    }

    while (state.background.patternColors.length < 3) {
      state.background.patternColors.push('#ECE5FF');
    }
  }

  function syncPatternColorInputs() {
    ensurePatternColors();
    for (let i = 1; i <= 3; i++) {
      const picker = document.getElementById(`pattern-color-${i}`);
      const hex = document.getElementById(`pattern-color-${i}-hex`);
      if (!picker || !hex) continue;
      picker.value = state.background.patternColors[i - 1];
      hex.value = state.background.patternColors[i - 1].toUpperCase();
    }
  }

  function bindPatternToneInputs() {
    const intensity = document.getElementById('pattern-intensity');
    const grain = document.getElementById('pattern-grain');

    if (intensity) {
      intensity.addEventListener('input', () => {
        ensurePatternTuning();
        state.background.patternIntensity = parseInt(intensity.value, 10);
        const value = document.getElementById('pattern-intensity-value');
        if (value) value.textContent = `${state.background.patternIntensity}%`;
        requestRender();
      });
    }

    if (grain) {
      grain.addEventListener('input', () => {
        ensurePatternTuning();
        state.background.patternGrain = parseInt(grain.value, 10);
        const value = document.getElementById('pattern-grain-value');
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

    const intensity = document.getElementById('pattern-intensity');
    const intensityValue = document.getElementById('pattern-intensity-value');
    const grain = document.getElementById('pattern-grain');
    const grainValue = document.getElementById('pattern-grain-value');

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

  function updateBackgroundUI() {
    renderGradientStops();
    setSliderValue('gradient-angle', state.background.angle, `${state.background.angle}°`);

    const solidColor = document.getElementById('solid-color');
    const solidHex = document.getElementById('solid-color-hex');
    if (solidColor && solidHex) {
      solidColor.value = state.background.color;
      solidHex.value = state.background.color;
    }

    for (let i = 1; i <= 4; i++) {
      const input = document.getElementById(`mesh-color-${i}`);
      if (input && state.background.meshColors[i - 1]) {
        input.value = state.background.meshColors[i - 1];
      }
    }
    setSliderValue('mesh-complexity', state.background.meshComplexity, `${state.background.meshComplexity}`);

    syncPatternColorInputs();
    syncPatternToneInputs();
    renderPatternPresets();
    syncBgTypeVisibility(state.background.type);
  }

  // ==================== PHONE PANEL ====================
  function setupPhonePanel() {
    // Phone position sliders
    bindSlider('phone-scale', (val) => {
      state.phoneScale = val;
      document.getElementById('phone-scale-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('phone-y', (val) => {
      state.phoneY = val;
      document.getElementById('phone-y-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('phone-x', (val) => {
      state.phoneX = val;
      document.getElementById('phone-x-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('phone-rotation', (val) => {
      state.phoneRotation = val;
      document.getElementById('phone-rotation-value').textContent = `${val}°`;
      requestRender();
    });

    // Second phone sliders
    bindSlider('phone2-scale', (val) => {
      state.phone2Scale = val;
      document.getElementById('phone2-scale-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('phone2-y', (val) => {
      state.phone2Y = val;
      document.getElementById('phone2-y-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('phone2-x', (val) => {
      state.phone2X = val;
      document.getElementById('phone2-x-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('phone2-rotation', (val) => {
      state.phone2Rotation = val;
      document.getElementById('phone2-rotation-value').textContent = `${val}°`;
      requestRender();
    });

    // Frame type toggle (iPhone / Android)
    document.querySelectorAll('.frame-type-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.frame-type-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        state.frameType = btn.dataset.frameType;
        requestRender();
      });
    });

    // Shadow toggle
    document.getElementById('phone-shadow').addEventListener('change', (e) => {
      state.phoneShadow = e.target.checked;
      requestRender();
    });

    // Shadow intensity
    bindSlider('shadow-intensity', (val) => {
      state.shadowIntensity = val;
      document.getElementById('shadow-intensity-value').textContent = `${val}%`;
      requestRender();
    });

    // Shadow blur
    bindSlider('shadow-blur', (val) => {
      state.shadowBlur = val;
      document.getElementById('shadow-blur-value').textContent = val;
      requestRender();
    });

    // Screen brightness
    bindSlider('screen-brightness', (val) => {
      state.screenBrightness = val;
      document.getElementById('screen-brightness-value').textContent = val;
      requestRender();
    });
  }

  // ==================== TABS ====================
  function setupTabs() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tab = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === tab));
      });
    });
  }

  // ==================== NAVIGATION ====================
  function setupNavigation() {
    const appSection = document.querySelector('.app-main:not(.social-main)');
    const socialSection = document.getElementById('social-section');
    const navBtns = document.querySelectorAll('.nav-btn');
    const appstoreOnlyEls = document.querySelectorAll('.appstore-only');

    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.dataset.section;
        navBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (section === 'social') {
          appSection.classList.add('hidden');
          socialSection.classList.remove('hidden');
          appstoreOnlyEls.forEach(el => el.classList.add('hidden'));
          if (window.SocialApp) SocialApp.activate();
        } else {
          socialSection.classList.add('hidden');
          appSection.classList.remove('hidden');
          appstoreOnlyEls.forEach(el => el.classList.remove('hidden'));
          if (window.SocialApp) SocialApp.deactivate();
          // Switch frame type based on section
          if (section === 'googleplay') {
            state.frameType = 'android';
          } else {
            state.frameType = 'iphone';
          }
          // Sync the frame-type toggle buttons in the Phone tab
          document.querySelectorAll('.frame-type-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.frameType === state.frameType);
          });
          requestRender();
        }
      });
    });
  }

  // ==================== LOGO PANEL ====================
  function setupLogoPanel() {
    const zone = document.getElementById('logo-upload-zone');
    const input = document.getElementById('logo-upload-input');
    const preview = document.getElementById('logo-upload-preview');
    const placeholder = document.getElementById('logo-upload-placeholder');
    const removeBtn = document.getElementById('logo-upload-remove');
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

    bindSlider('logo-scale', (val) => {
      state.logoScale = val;
      document.getElementById('logo-scale-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('logo-x', (val) => {
      state.logoX = val;
      document.getElementById('logo-x-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('logo-y', (val) => {
      state.logoY = val;
      document.getElementById('logo-y-value').textContent = `${val}%`;
      requestRender();
    });
    bindSlider('logo-opacity', (val) => {
      state.logoOpacity = val;
      document.getElementById('logo-opacity-value').textContent = `${val}%`;
      requestRender();
    });
  }

  // ==================== EXPORT ====================
  function setupExport() {
    document.getElementById('btn-export').addEventListener('click', () => {
      // Delegate to social export if social section is active
      const socialSection = document.getElementById('social-section');
      if (socialSection && !socialSection.classList.contains('hidden') && window.SocialApp) {
        document.getElementById('social-btn-export')?.click();
        return;
      }
      exportImage();
    });
  }

  function exportImage() {
    // Render at full resolution
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = state.canvasWidth;
    exportCanvas.height = state.canvasHeight;

    // Copy state for export
    Renderer.render(exportCanvas, state);

    exportCanvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
      a.download = `ad-screenshot-${state.canvasWidth}x${state.canvasHeight}-${timestamp}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 'image/png');
  }

  // ==================== RESET ====================
  function setupReset() {
    document.getElementById('btn-reset').addEventListener('click', () => {
      if (!confirm('Reset all settings to defaults?')) return;
      state = createDefaultState();
      setupCanvas();
      renderTextLayers();
      updateBackgroundUI();
      updateLayoutSlidersUI();
      selectLayout('single-center');

      // Reset upload previews
      for (const num of [1, 2]) {
        document.getElementById(`upload-preview-${num}`).src = '';
        document.getElementById(`upload-preview-${num}`).classList.add('hidden');
        document.getElementById(`upload-remove-${num}`).classList.add('hidden');
        document.getElementById(`upload-placeholder-${num}`).classList.remove('hidden');
        document.getElementById(`upload-zone-${num}`).classList.remove('has-image');
        document.getElementById(`upload-input-${num}`).value = '';
      }

      document.getElementById('extracted-colors').classList.add('hidden');
      requestRender();
    });
  }

  // ==================== ZOOM ====================
  function setupZoom() {
    let zoomLevel = 'fit';
    const zoomLevels = ['fit', 25, 50, 75, 100];
    let zoomIdx = 0;

    const display = document.getElementById('zoom-level');

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

    document.getElementById('zoom-in').addEventListener('click', () => {
      if (zoomIdx < zoomLevels.length - 1) zoomIdx++;
      zoomLevel = zoomLevels[zoomIdx];
      applyZoom();
    });

    document.getElementById('zoom-out').addEventListener('click', () => {
      if (zoomIdx > 0) zoomIdx--;
      zoomLevel = zoomLevels[zoomIdx];
      applyZoom();
    });
  }

  // ==================== CANVAS SIZE ====================
  function setupCanvasSize() {
    document.getElementById('canvas-size').addEventListener('change', (e) => {
      const [w, h] = e.target.value.split('x').map(Number);
      const prevW = state.canvasWidth;
      state.canvasWidth = w;
      state.canvasHeight = h;
      canvas.width = w;
      canvas.height = h;
      document.getElementById('canvas-info').textContent = `${w} × ${h} px`;

      // Scale text sizes proportionally relative to previous size
      const scaleFactor = w / prevW;
      for (const text of state.texts) {
        text.size = Math.round(text.size * scaleFactor);
      }
      renderTextLayers();
      requestRender();
    });
  }

  // ==================== KEYBOARD SHORTCUTS ====================
  function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Ctrl/Cmd + S: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        exportImage();
      }
      // Ctrl/Cmd + E: Export
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        exportImage();
      }
    });
  }

  // ==================== HELPERS ====================
  function bindSlider(id, onChange) {
    const slider = document.getElementById(id);
    if (!slider) return;
    slider.addEventListener('input', () => {
      onChange(parseFloat(slider.value));
    });
  }

  // ==================== START ====================
  document.addEventListener('DOMContentLoaded', init);

})();
