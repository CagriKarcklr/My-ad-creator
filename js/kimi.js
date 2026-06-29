/**
 * Kimi client — talks to the local /api/kimi proxy (key stays server-side).
 * Grounds every request in the active brand's blueprint so copy + pills stay
 * on-brand. Exposes four creative tasks: pills, copy, fonts, screenSet.
 */
window.Kimi = (() => {
  'use strict';

  let brand = null;
  let blueprintCache = '';

  async function setBrand(brandObj) {
    brand = brandObj;
    blueprintCache = '';
    if (brand && brand.blueprintUrl) {
      try {
        const res = await fetch(brand.blueprintUrl);
        if (res.ok) blueprintCache = await res.text();
      } catch { /* fall back to no blueprint */ }
    }
  }

  function brandSystem(extra) {
    const name = brand ? brand.name : 'the app';
    const parts = [
      `You write marketing copy for ${name}'s App Store screenshots.`,
      'Voice: calm, warm, encouraging, plain language. Never hype-y, salesy, preachy or guilt-trippy.',
      'Keep it concrete and visual. Short. No finance jargon. Sentence/Title case, not ALL CAPS.',
      'Only make claims the blueprint supports. Never claim bank syncing or automatic import.',
      extra || '',
      blueprintCache ? `\n--- BRAND BLUEPRINT ---\n${blueprintCache}` : '',
    ];
    return parts.filter(Boolean).join('\n');
  }

  // ── Low-level call ─────────────────────────────────────────────────────────
  async function ask(messages) {
    const res = await fetch('/api/kimi', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
    return data.content || '';
  }

  // Robust JSON extraction from model output (handles ``` fences and stray prose)
  function parseJson(text) {
    if (!text) throw new Error('Empty response');
    let t = String(text).trim();
    t = t.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim();
    // Grab the outermost JSON object/array if there's surrounding prose
    const firstObj = t.indexOf('{');
    const firstArr = t.indexOf('[');
    let start = -1;
    if (firstObj === -1) start = firstArr;
    else if (firstArr === -1) start = firstObj;
    else start = Math.min(firstObj, firstArr);
    if (start > 0) {
      const open = t[start];
      const close = open === '{' ? '}' : ']';
      const end = t.lastIndexOf(close);
      if (end > start) t = t.slice(start, end + 1);
    }
    return JSON.parse(t);
  }

  async function askJson(messages) {
    const raw = await ask(messages);
    return parseJson(raw);
  }

  // Build a user message that optionally carries an attached screenshot so the
  // (vision-capable) model can read the actual screen.
  function userMsg(text, image) {
    if (!image) return { role: 'user', content: text };
    return {
      role: 'user',
      content: [
        { type: 'text', text },
        { type: 'image_url', image_url: { url: image } },
      ],
    };
  }

  function clampPill(p) {
    return {
      emoji: String(p.emoji || '✨').slice(0, 4),
      title: String(p.title || '').slice(0, 28),
      subtitle: String(p.subtitle || '').slice(0, 34),
    };
  }

  // ── Task: pills ────────────────────────────────────────────────────────────
  // Returns an array of { emoji, title, subtitle }.
  async function pills({ screenNote = '', headline = '', count = 5, avoid = [], image = null } = {}) {
    const sys = brandSystem(
      'You design "floating feature pills" — tiny badges that hover around a phone mockup. ' +
      'Each pill = one emoji + a 1–3 word bold title + an optional 2–4 word subtitle. ' +
      'Titles are punchy and concrete (numbers, features, outcomes). Mix proof (streaks, amounts), ' +
      'features and reassurance. Subtitle may be empty for category-style pills.'
    );
    const user = [
      `Screen: ${screenNote || 'app home screen'}.`,
      headline ? `Headline on this screen: "${headline}".` : '',
      image ? 'A screenshot of the app screen is attached. FIRST identify which Spendaily feature/section it shows (e.g. daily number, rollover, goals, calendar, privacy, logging). Then write pills that SELL THAT FEATURE\'S BENEFITS using the brand blueprint — do not just transcribe what is on screen. You may use at most one real on-screen number as proof; make the rest benefit/feature pills.' : '',
      avoid.length ? `Avoid repeating these titles: ${avoid.join(', ')}.` : '',
      `Return ONLY minified JSON: {"pills":[{"emoji":"","title":"","subtitle":""}]} with exactly ${count} pills.`,
    ].filter(Boolean).join(' ');
    const data = await askJson([
      { role: 'system', content: sys },
      userMsg(user, image),
    ]);
    const arr = Array.isArray(data) ? data : data.pills;
    if (!Array.isArray(arr)) throw new Error('Kimi did not return a pills array');
    return arr.slice(0, count).map(clampPill);
  }

  // ── Task: copy (eyebrow + two-tone headline + subtitle) ───────────────────
  async function copy({ screenNote = '', angle = '', image = null } = {}) {
    const sys = brandSystem(
      'You write the text block for one screenshot: a one-word uppercase EYEBROW label (e.g. TODAY, GOALS, PRIVACY), ' +
      'a two-line HEADLINE, and a one-line SUBTITLE. The headline is split into 2 lines; the second ' +
      'line is the "accent" line (shown in the brand colour). Headline lines are short and bold. ' +
      'Subtitle is one calm sentence (max ~12 words).'
    );
    const user = [
      `Screen: ${screenNote || 'app home screen'}.`,
      angle ? `Angle to lead with: ${angle}.` : '',
      image ? 'A screenshot of the app screen is attached. Identify which Spendaily feature it shows, then write benefit-led marketing copy ABOUT that feature (grounded in the blueprint) — sell the value, do not just describe the screen.' : '',
      'Return ONLY minified JSON: {"eyebrow":"","headline":[{"text":"","accent":false},{"text":"","accent":true}],"subtitle":""}.',
    ].filter(Boolean).join(' ');
    const data = await askJson([
      { role: 'system', content: sys },
      userMsg(user, image),
    ]);
    const lines = Array.isArray(data.headline) ? data.headline : [];
    return {
      eyebrow: String(data.eyebrow || '').toUpperCase().slice(0, 18),
      headline: lines.slice(0, 3).map((l, i) => ({
        text: String(l.text || '').slice(0, 28),
        accent: l.accent != null ? Boolean(l.accent) : i > 0,
      })),
      subtitle: String(data.subtitle || '').slice(0, 90),
    };
  }

  // ── Task: font pairing ─────────────────────────────────────────────────────
  async function fonts({ vibe = '', available = [] } = {}) {
    const sys = brandSystem(
      'You are a typographer. Pick a font PAIRING for App Store screenshots: a heavy DISPLAY font for ' +
      'headlines and a clean BODY font for subtitles/pills. Choose ONLY from the provided list. ' +
      'Favour friendly, rounded, confident sans-serifs that feel calm and premium.'
    );
    const user = [
      vibe ? `Desired vibe: ${vibe}.` : 'Vibe: calm, premium, friendly.',
      `Available fonts: ${available.join(', ')}.`,
      'Return ONLY minified JSON: {"display":"","body":"","reason":""}. Names must match the list exactly.',
    ].join(' ');
    const data = await askJson([
      { role: 'system', content: sys },
      { role: 'user', content: user },
    ]);
    const pick = (name, fallback) => (available.includes(name) ? name : fallback);
    return {
      display: pick(data.display, available[0]),
      body: pick(data.body, available[1] || available[0]),
      reason: String(data.reason || '').slice(0, 160),
    };
  }

  // Run async tasks with a concurrency cap (the model is slow; one mega-call
  // times out, so we fan out small calls instead).
  async function pool(items, limit, worker) {
    const out = new Array(items.length);
    let i = 0;
    const runners = new Array(Math.min(limit, items.length)).fill(0).map(async () => {
      while (i < items.length) {
        const idx = i++;
        out[idx] = await worker(items[idx], idx);
      }
    });
    await Promise.all(runners);
    return out;
  }

  // ── Task: full screen set ──────────────────────────────────────────────────
  // Two phases: (1) a fast outline of N screens, then (2) copy + pills per
  // screen generated in parallel. Keeps every call small enough to stay well
  // under the proxy timeout, and is much faster than one giant request.
  async function screenSet({ brief = '', count = 5, paletteIds = [], avoid = [], onProgress } = {}) {
    const outlineSys = brandSystem(
      'You plan the OUTLINE of an App Store screenshot set. For each screen give only: a short name, ' +
      'a one-word uppercase eyebrow (e.g. TODAY, GOALS, PRIVACY), a one-line "angle" (the benefit it sells), a screenNote ' +
      '(which app screen to show), and a palette id. Order them like a great store listing (hook first); ' +
      'each screen sells a different benefit. Keep it SHORT — no headlines or pills yet.'
    );
    const outlineUser = [
      brief ? `Extra brief: ${brief}.` : 'Use the strongest benefits from the blueprint.',
      paletteIds.length ? `Choose palette ids from: ${paletteIds.join(', ')}.` : '',
      `Return ONLY minified JSON: {"screens":[{"name":"","eyebrow":"","angle":"","screenNote":"","palette":""}]} with exactly ${count} screens.`,
    ].filter(Boolean).join(' ');

    if (onProgress) onProgress('Planning the set…');
    const outlineData = await askJson([
      { role: 'system', content: outlineSys },
      { role: 'user', content: outlineUser },
    ]);
    const outline = (Array.isArray(outlineData.screens) ? outlineData.screens : (Array.isArray(outlineData) ? outlineData : [])).slice(0, count);
    if (!outline.length) throw new Error('Kimi returned no screen outline');

    let done = 0;
    const screens = await pool(outline, 3, async (o) => {
      const note = o.screenNote || o.name || '';
      const [c, p] = await Promise.all([
        copy({ screenNote: note, angle: o.angle || '' }).catch(() => null),
        pills({ screenNote: note, count: 4, avoid }).catch(() => []),
      ]);
      if (onProgress) onProgress(`Writing screens… ${++done}/${outline.length}`);
      return {
        name: String(o.name || 'Screen').slice(0, 24),
        eyebrow: String(o.eyebrow || (c && c.eyebrow) || '').toUpperCase().slice(0, 18),
        headline: (c && c.headline && c.headline.length) ? c.headline : [{ text: 'Headline', accent: false }, { text: o.angle || 'second line', accent: true }],
        subtitle: (c && c.subtitle) || String(o.angle || '').slice(0, 90),
        screenNote: note.slice(0, 160),
        palette: String(o.palette || '').slice(0, 24),
        pills: Array.isArray(p) ? p : [],
      };
    });
    return screens;
  }

  function clampNum(v, lo, hi, fb) { const n = Number(v); return Number.isFinite(n) ? Math.max(lo, Math.min(hi, n)) : fb; }

  // ── Task: full auto-design from a screenshot ───────────────────────────────
  // Kimi looks at the screenshot and recommends the WHOLE layout: copy, phone
  // size/position, and pills with positions.
  async function autoDesign({ screenNote = '', image = null, paletteIds = [], layout = 'auto' } = {}) {
    const layoutGuide = {
      centered: 'LAYOUT: a single CENTRED phone (x≈50, scale 50–60, rotation 0).',
      bleed: 'LAYOUT: a single modern BLEED-OFF phone that runs off one side of the canvas (x≈90–106 or x≈ −6–10), larger (scale 72–92), optionally a slight rotation (−8..8). Place pills mostly on the opposite side.',
      multiple: 'LAYOUT: TWO phone mockups — a primary phone plus a second offset one; one of them may bleed off an edge for a modern overlapping look. Keep them from fully covering each other.',
      multiBleed: 'LAYOUT: TWO phone mockups that BOTH bleed off the canvas edges — e.g. one running off the left (x≈ −8–8) and one off the right (x≈92–108), or both overlapping and running off the same side. Larger phones (scale 72–96), small opposite rotations for a bold modern look.',
      auto: 'LAYOUT: choose the most striking option for this feature — a centred phone, a single bleeding-off phone, or two phones (some bleeding off).',
    }[layout] || '';
    const sys = brandSystem(
      'You are an App Store screenshot ART DIRECTOR. FIRST identify which Spendaily feature/section the attached screenshot shows ' +
      '(e.g. daily number, rollover, goals, calendar, categories, insights, privacy, logging). THEN design the WHOLE marketing image ' +
      'that SELLS THAT FEATURE using the brand blueprint — benefit-led copy and pills, not a transcription of the screen. ' +
      'Output: eyebrow + two-line headline (the 2nd line is the accent line) + a one-line subtitle; choose the phone layout; ' +
      'and place 4–6 floating feature pills around the phone(s). You may use one or two real on-screen numbers as proof, but lead with the value. ' +
      layoutGuide + ' ' +
      'COORDINATES are percentages 0–100 (x = left→right, y = top→bottom) of a tall portrait canvas. ' +
      'The headline occupies the top (~y 5–30), so keep every pill below y≈38. Place pills in the margins (x≈10–24 and x≈76–90), spread vertically between y≈40 and y≈92, overlapping the phone edges a little. ' +
      'Return phone layout as a "phones" array (1 or 2 entries).'
    );
    const user = [
      `Screen: ${screenNote || 'app screen'}.`,
      paletteIds.length ? `Palette id options (pick one that suits the screenshot): ${paletteIds.join(', ')}.` : '',
      'Return ONLY minified JSON: {"eyebrow":"","headline":[{"text":"","accent":false},{"text":"","accent":true}],"subtitle":"","palette":"","phones":[{"scale":55,"x":50,"y":62,"rotation":0}],"pills":[{"emoji":"","title":"","subtitle":"","x":15,"y":45,"rotation":0,"style":"solid"}]}.',
    ].filter(Boolean).join(' ');
    const data = await askJson([{ role: 'system', content: sys }, userMsg(user, image)]);
    let phonesArr = Array.isArray(data.phones) ? data.phones : (data.phone ? [data.phone] : []);
    if (!phonesArr.length) phonesArr = [{ scale: 55, x: 50, y: 62, rotation: 0 }];
    return {
      eyebrow: String(data.eyebrow || '').toUpperCase().slice(0, 18),
      headline: (Array.isArray(data.headline) ? data.headline : []).slice(0, 3).map((l, i) => ({ text: String(l.text || '').slice(0, 28), accent: l.accent != null ? !!l.accent : i > 0 })),
      subtitle: String(data.subtitle || '').slice(0, 90),
      palette: String(data.palette || '').slice(0, 24),
      phones: phonesArr.slice(0, 3).map((ph) => ({ scale: clampNum(ph.scale, 28, 135, 55), x: clampNum(ph.x, -40, 140, 50), y: clampNum(ph.y, 18, 112, 62), rotation: clampNum(ph.rotation, -25, 25, 0) })),
      pills: (Array.isArray(data.pills) ? data.pills : []).slice(0, 6).map((p) => ({
        emoji: String(p.emoji || '✨').slice(0, 4), title: String(p.title || '').slice(0, 28), subtitle: String(p.subtitle || '').slice(0, 34),
        x: clampNum(p.x, 2, 98, 50) / 100, y: clampNum(p.y, 2, 98, 50) / 100,
        rotation: clampNum(p.rotation, -10, 10, 0),
        style: ['solid', 'glass', 'tint'].includes(p.style) ? p.style : 'solid',
      })),
    };
  }

  return { setBrand, ask, pills, copy, fonts, screenSet, autoDesign };
})();
