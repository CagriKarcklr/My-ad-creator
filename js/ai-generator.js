/**
 * AI Generator — Handles AI image generation for ad backgrounds
 * Uses OpenAI DALL-E 3 API to generate lifestyle mockup scenes
 */

window.AIGenerator = (() => {
  'use strict';

  const STORAGE_KEY = 'ad-creator-ai-api-key';
  const STORAGE_KIMI_KEY = 'ad-creator-ai-kimi-key';
  const STORAGE_PROVIDER_KEY = 'ad-creator-ai-provider';

  // ========== Style Presets ==========
  const STYLE_PRESETS = [
    {
      id: 'meeting-room',
      label: 'Meeting Room',
      icon: '🏢',
      prompt: 'A polished conference table in a modern meeting room, soft natural light from floor-to-ceiling windows, blurred office background with glass partitions, professional corporate atmosphere, warm neutral tones, shallow depth of field, photorealistic interior photography, empty table surface in the center',
    },
    {
      id: 'organized-desk',
      label: 'Organized Desk',
      icon: '📋',
      prompt: 'A clean white desk with colorful sticky notes, a pen, a small notebook, and a coffee cup, overhead perspective, soft even lighting, minimal and organized workspace aesthetic, pastel accents, photorealistic top-down photography, empty space in the center of the desk',
    },
    {
      id: 'cozy-workspace',
      label: 'Cozy Workspace',
      icon: '🕯️',
      prompt: 'A warm wooden desk surface with a cup of herbal tea, a small potted plant, and a lit candle, cozy and inviting atmosphere, soft warm lighting, shallow depth of field, lifestyle interior photography, earth tones, empty space in the center',
    },
    {
      id: 'purple-aesthetic',
      label: 'Purple Aesthetic',
      icon: '💜',
      prompt: 'A stylish desk with purple gradient lighting atmosphere, modern minimalist setup, purple and violet ambient tones, sleek accessories nearby, contemporary lifestyle photography, studio lighting with purple gel, empty center area on the desk surface',
    },
    {
      id: 'concrete-edge',
      label: 'Urban Edge',
      icon: '🏙️',
      prompt: 'A concrete ledge or shelf with an urban cityscape blurred in the background, modern architectural setting, dramatic natural lighting, moody atmosphere, shallow depth of field, editorial photography, empty surface in the center',
    },
    {
      id: 'minimal-gradient',
      label: 'Gradient Studio',
      icon: '🎨',
      prompt: 'A clean minimal surface with a beautiful smooth gradient background in soft pastel colors, studio product photography setup, perfect lighting, minimal and modern composition, soft shadows, professional photography backdrop, empty center area',
    },
    {
      id: 'nature-desk',
      label: 'Nature & Plants',
      icon: '🌿',
      prompt: 'A light wooden desk surrounded by lush green indoor plants, a small succulent, natural sunlight streaming through a window, fresh and airy atmosphere, lifestyle interior photography, green and white tones, empty center area on the desk',
    },
    {
      id: 'flat-lay',
      label: 'Flat Lay Setup',
      icon: '📱',
      prompt: 'A top-down flat lay photo of a marble surface with AirPods, a leather wallet, sunglasses, a notebook, and a coffee cup arranged around an empty center space, perfectly arranged, even soft lighting, Instagram-style flat lay photography',
    },
    {
      id: 'morning-coffee',
      label: 'Morning Coffee',
      icon: '☕',
      prompt: 'A beautifully crafted latte art coffee on a cafe table surface, morning sunlight, warm and inviting atmosphere, wooden table, blurred cafe background, lifestyle photography, warm golden tones, clean empty space next to the coffee',
    },
    {
      id: 'dark-moody',
      label: 'Dark & Moody',
      icon: '🌙',
      prompt: 'A dark matte surface with dramatic moody lighting, dark background with subtle warm accent lighting, premium and luxurious feel, low-key photography, deep shadows and highlights, elegant empty space in the center',
    },
    {
      id: 'beach-vibes',
      label: 'Beach Vibes',
      icon: '🏖️',
      prompt: 'A wooden beach table with ocean waves blurred in the background, tropical relaxed atmosphere, bright natural sunlight, sandy textures, summer vibes lifestyle photography, blue and warm tones, empty table surface',
    },
    {
      id: 'home-office',
      label: 'Home Office',
      icon: '🏠',
      prompt: 'A stylish home office desk next to a modern monitor, keyboard, and a small plant, well-organized workspace, soft ambient lighting, contemporary home office setup, lifestyle photography, empty desk space in the center',
    },
  ];

  // ========== API Key Management ==========
  function getApiKey() {
    try {
      return localStorage.getItem(STORAGE_KEY) || '';
    } catch {
      return '';
    }
  }

  function saveApiKey(key) {
    try {
      localStorage.setItem(STORAGE_KEY, key);
    } catch {
      // localStorage may be unavailable
    }
  }

  function getProvider() {
    try {
      return localStorage.getItem(STORAGE_PROVIDER_KEY) || 'openai';
    } catch {
      return 'openai';
    }
  }

  function saveProvider(provider) {
    try {
      localStorage.setItem(STORAGE_PROVIDER_KEY, provider);
    } catch {
      // localStorage may be unavailable
    }
  }

  function getKimiApiKey() {
    try {
      return localStorage.getItem(STORAGE_KIMI_KEY) || '';
    } catch {
      return '';
    }
  }

  function saveKimiApiKey(key) {
    try {
      localStorage.setItem(STORAGE_KIMI_KEY, key);
    } catch {
      // localStorage may be unavailable
    }
  }

  // ========== Image Generation ==========

  /**
   * Generate an image using OpenAI DALL-E 3
   * @param {Object} options
   * @param {string} options.prompt - The generation prompt
   * @param {string} options.apiKey - OpenAI API key
   * @param {string} options.size - Image size ('1024x1024', '1792x1024', '1024x1792')
   * @param {string} options.quality - 'standard' or 'hd'
   * @returns {Promise<string>} - base64-encoded image data URL
   */
  async function generateWithOpenAI({ prompt, apiKey, size = '1024x1024', quality = 'standard' }) {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: 1,
        size: size,
        quality: quality,
        response_format: 'b64_json',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || `API error ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const b64 = data.data[0].b64_json;
    return `data:image/png;base64,${b64}`;
  }

  /**
   * Generate an image using Kimi / Moonshot AI
   */
  async function generateWithKimi({ prompt, apiKey, size = '1024x1024', quality = 'standard' }) {
    const response = await fetch('https://api.moonshot.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'kimi',
        prompt: prompt,
        n: 1,
        size: size,
        response_format: 'b64_json',
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const msg = err?.error?.message || `Kimi API error ${response.status}`;
      throw new Error(msg);
    }

    const data = await response.json();
    const b64 = data.data[0].b64_json;
    return `data:image/png;base64,${b64}`;
  }

  /**
   * Main generate function — dispatches to the right provider
   */
  async function generate({ prompt, apiKey, provider = 'openai', size = '1024x1024', quality = 'standard' }) {
    if (!apiKey) throw new Error('Please enter your API key in the settings.');
    if (!prompt) throw new Error('Please enter a prompt or select a style.');

    if (provider === 'openai') {
      return generateWithOpenAI({ prompt, apiKey, size, quality });
    }
    if (provider === 'kimi') {
      return generateWithKimi({ prompt, apiKey, size, quality });
    }

    throw new Error(`Unknown provider: ${provider}`);
  }

  /**
   * Load a data URL string into an Image element
   * @param {string} dataUrl
   * @returns {Promise<HTMLImageElement>}
   */
  function loadImageFromDataUrl(dataUrl) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load generated image'));
      img.src = dataUrl;
    });
  }

  // ========== Public API ==========
  return {
    STYLE_PRESETS,
    getApiKey,
    saveApiKey,
    getKimiApiKey,
    saveKimiApiKey,
    getProvider,
    saveProvider,
    generate,
    loadImageFromDataUrl,
  };
})();
