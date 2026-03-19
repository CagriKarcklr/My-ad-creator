/**
 * Color Extractor — Extracts dominant colors from images
 * Uses median-cut quantization for reliable palette extraction
 * Also generates complementary gradients for backgrounds
 */

window.ColorExtractor = (() => {

  /**
   * Extract dominant colors from an Image element
   * @param {HTMLImageElement} image
   * @param {number} colorCount — number of colors to extract (power of 2 recommended)
   * @returns {Array<{rgb: number[], hex: string, population: number}>}
   */
  function extract(image, colorCount = 8) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Scale down for performance — 100px max dimension
    const maxDim = 100;
    const scale = maxDim / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height);
    canvas.width = Math.max(1, Math.floor((image.naturalWidth || image.width) * scale));
    canvas.height = Math.max(1, Math.floor((image.naturalHeight || image.height) * scale));
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = [];

    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      const a = imageData.data[i + 3];
      // Skip near-transparent, near-black, near-white pixels
      if (a < 128) continue;
      if (r + g + b < 30) continue;
      if (r > 240 && g > 240 && b > 240) continue;
      pixels.push([r, g, b]);
    }

    if (pixels.length === 0) {
      return [{ rgb: [128, 128, 128], hex: '#808080', population: 1 }];
    }

    // Median cut
    const depth = Math.ceil(Math.log2(colorCount));
    const buckets = medianCut(pixels, depth);

    // Convert buckets to color objects sorted by population
    const colors = buckets
      .map(bucket => {
        const avg = averageColor(bucket);
        return {
          rgb: avg,
          hex: rgbToHex(avg),
          population: bucket.length,
        };
      })
      .sort((a, b) => b.population - a.population);

    return colors.slice(0, colorCount);
  }

  function medianCut(pixels, depth) {
    if (depth === 0 || pixels.length <= 1) return [pixels];

    // Find channel with largest range
    let minR = 255, maxR = 0, minG = 255, maxG = 0, minB = 255, maxB = 0;
    for (const p of pixels) {
      if (p[0] < minR) minR = p[0]; if (p[0] > maxR) maxR = p[0];
      if (p[1] < minG) minG = p[1]; if (p[1] > maxG) maxG = p[1];
      if (p[2] < minB) minB = p[2]; if (p[2] > maxB) maxB = p[2];
    }

    const rangeR = maxR - minR;
    const rangeG = maxG - minG;
    const rangeB = maxB - minB;

    let channel = 0;
    if (rangeG >= rangeR && rangeG >= rangeB) channel = 1;
    else if (rangeB >= rangeR && rangeB >= rangeG) channel = 2;

    // Sort by that channel
    pixels.sort((a, b) => a[channel] - b[channel]);

    const mid = Math.floor(pixels.length / 2);
    const left = pixels.slice(0, mid);
    const right = pixels.slice(mid);

    return [...medianCut(left, depth - 1), ...medianCut(right, depth - 1)];
  }

  function averageColor(pixels) {
    if (pixels.length === 0) return [128, 128, 128];
    let r = 0, g = 0, b = 0;
    for (const p of pixels) { r += p[0]; g += p[1]; b += p[2]; }
    const n = pixels.length;
    return [Math.round(r / n), Math.round(g / n), Math.round(b / n)];
  }

  function rgbToHex(rgb) {
    return '#' + rgb.map(v => Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0')).join('');
  }

  /**
   * Analyze image brightness
   * @returns {'light' | 'dark'}
   */
  function analyzeBrightness(image) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const maxDim = 50;
    const scale = maxDim / Math.max(image.naturalWidth || image.width, image.naturalHeight || image.height);
    canvas.width = Math.max(1, Math.floor((image.naturalWidth || image.width) * scale));
    canvas.height = Math.max(1, Math.floor((image.naturalHeight || image.height) * scale));
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    let totalBrightness = 0;
    let count = 0;
    for (let i = 0; i < data.length; i += 4) {
      totalBrightness += data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
      count++;
    }
    return (totalBrightness / count) > 128 ? 'light' : 'dark';
  }

  /**
   * Convert RGB to HSL
   */
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return [h * 360, s * 100, l * 100];
  }

  /**
   * Convert HSL to RGB
   */
  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  /**
   * Generate a gradient background from extracted colors
   * Creates a smooth, aesthetically pleasing gradient
   * @param {Array} colors — extracted color objects
   * @param {string} brightness — 'light' or 'dark'
   * @returns {{colors: string[], angle: number}}
   */
  function generateGradient(colors, brightness) {
    if (colors.length < 2) {
      return { colors: ['#667eea', '#764ba2', '#f093fb'], angle: 180 };
    }

    // Get the top colors and convert to HSL for manipulation
    const topColors = colors.slice(0, Math.min(5, colors.length));
    const hslColors = topColors.map(c => rgbToHsl(c.rgb[0], c.rgb[1], c.rgb[2]));

    // Create gradient colors by adjusting saturation and lightness
    // Goal: make the gradient feel like a soft, elevated version of the app's palette
    const gradientHsls = [];

    // First stop: vibrant version of dominant color, shifted in hue
    const c1 = [...hslColors[0]];
    c1[0] = (c1[0] - 20 + 360) % 360; // Shift hue slightly
    c1[1] = Math.min(100, c1[1] * 1.4 + 20); // Strong saturation boost
    c1[2] = brightness === 'light' ? Math.min(60, Math.max(40, c1[2])) : Math.min(50, Math.max(30, c1[2]));
    gradientHsls.push(c1);

    // Second stop: use second most prominent color
    const c2idx = hslColors.length > 1 ? 1 : 0;
    const c2 = [...hslColors[c2idx]];
    c2[1] = Math.min(100, c2[1] * 1.3 + 15); // Strong saturation boost
    c2[2] = brightness === 'light' ? Math.min(55, Math.max(35, c2[2])) : Math.min(45, Math.max(25, c2[2]));
    gradientHsls.push(c2);

    // Third stop: complementary shift from first color
    const c3 = [...hslColors[0]];
    c3[0] = (c3[0] + 40) % 360; // Shift hue forward
    c3[1] = Math.min(100, c3[1] * 1.3 + 15); // Strong saturation boost
    c3[2] = brightness === 'light' ? Math.min(60, Math.max(40, c3[2])) : Math.min(50, Math.max(30, c3[2]));
    gradientHsls.push(c3);

    // Convert back to hex
    const gradientColors = gradientHsls.map(hsl => {
      const rgb = hslToRgb(hsl[0], hsl[1], hsl[2]);
      return rgbToHex(rgb);
    });

    return {
      colors: gradientColors,
      angle: 180, // Top to bottom, classic app store style
    };
  }

  /**
   * Suggest text color based on background gradient
   * @param {string[]} gradientColors — array of hex colors
   * @returns {string} — hex color for text
   */
  function suggestTextColor(gradientColors) {
    // Average brightness of gradient colors
    const avgBrightness = gradientColors.reduce((sum, hex) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return sum + (r * 0.299 + g * 0.587 + b * 0.114);
    }, 0) / gradientColors.length;

    return avgBrightness > 160 ? '#1a1a2e' : '#ffffff';
  }

  // Public API
  return {
    extract,
    analyzeBrightness,
    generateGradient,
    suggestTextColor,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
  };

})();
