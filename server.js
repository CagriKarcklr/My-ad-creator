/**
 * Shotsmith server — static host + Kimi proxy.
 *
 * Why a server at all: the Kimi endpoint sends no CORS headers, so a browser
 * fetch() to it is blocked. This tiny zero-dependency Node server:
 *   1. serves the static tool, and
 *   2. proxies POST /api/kimi to Kimi with the API key injected server-side
 *      so the key is never shipped to (or visible in) the browser.
 *
 * The key is read from the KIMI_API_KEY env var, or the gitignored `.kimi-key`
 * file. Nothing about the key is exposed to the client.
 */

'use strict';

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 4317;

const KIMI_HOST = 'api.kimi.com';
const KIMI_PATH = '/coding/v1/chat/completions';
const KIMI_MODEL = 'kimi-for-coding';

// ── Key loading (env first, then gitignored file) ───────────────────────────
function loadKey() {
  if (process.env.KIMI_API_KEY) return process.env.KIMI_API_KEY.trim();
  try {
    return fs.readFileSync(path.join(ROOT, '.kimi-key'), 'utf8').trim();
  } catch {
    return '';
  }
}
const KIMI_KEY = loadKey();

// ── Static file serving ─────────────────────────────────────────────────────
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function serveStatic(req, res) {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  // Block path traversal and dotfiles (so .kimi-key is never served)
  const safe = path
    .normalize(urlPath)
    .replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(ROOT, safe);
  if (!filePath.startsWith(ROOT) || path.basename(filePath).startsWith('.')) {
    res.writeHead(403); res.end('Forbidden'); return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'Content-Type': MIME[ext] || 'application/octet-stream',
      // Iterative dev tool — never serve stale HTML/JS/CSS from the browser cache.
      'Cache-Control': 'no-store',
    });
    res.end(data);
  });
}

// ── Kimi proxy ──────────────────────────────────────────────────────────────
function kimiOnce(messages) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: KIMI_MODEL,
      temperature: 1, // this model only accepts temperature = 1
      messages,
    });

    const reqOptions = {
      host: KIMI_HOST,
      path: KIMI_PATH,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${KIMI_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const kReq = https.request(reqOptions, (kRes) => {
      let chunks = '';
      kRes.on('data', (c) => { chunks += c; });
      kRes.on('end', () => {
        if (kRes.statusCode < 200 || kRes.statusCode >= 300) {
          let msg = `Kimi error ${kRes.statusCode}`;
          try { msg = JSON.parse(chunks).error.message || msg; } catch {}
          const err = new Error(msg);
          err.permanent = true; // an HTTP error from Kimi is not worth retrying
          reject(err);
          return;
        }
        try {
          const data = JSON.parse(chunks);
          const content = data?.choices?.[0]?.message?.content || '';
          resolve({ content, usage: data?.usage || null });
        } catch (e) {
          reject(new Error('Bad response from Kimi'));
        }
      });
    });

    // Thinking model — responses can take a while.
    kReq.setTimeout(180000, () => { kReq.destroy(new Error('Kimi request timed out')); });
    kReq.on('error', reject);
    kReq.write(payload);
    kReq.end();
  });
}

// The upstream occasionally resets the first connection — retry transient
// network failures once before giving up.
async function callKimi(messages) {
  try {
    return await kimiOnce(messages);
  } catch (e) {
    if (e.permanent) throw e;
    return await kimiOnce(messages);
  }
}

function handleKimi(req, res) {
  if (!KIMI_KEY) {
    sendJson(res, 500, { error: 'Server has no Kimi key configured.' });
    return;
  }
  let body = '';
  req.on('data', (c) => {
    body += c;
    if (body.length > 16_000_000) req.destroy(); // guard (allows an attached screenshot)
  });
  req.on('end', async () => {
    let parsed;
    try { parsed = JSON.parse(body || '{}'); } catch { sendJson(res, 400, { error: 'Invalid JSON body' }); return; }
    const messages = Array.isArray(parsed.messages) ? parsed.messages : null;
    if (!messages || !messages.length) { sendJson(res, 400, { error: 'messages[] required' }); return; }
    try {
      const out = await callKimi(messages);
      sendJson(res, 200, out);
    } catch (e) {
      sendJson(res, 502, { error: e.message || 'Kimi request failed' });
    }
  });
}

// ── Router ──────────────────────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  if (req.url === '/api/health') {
    sendJson(res, 200, { ok: true, kimi: Boolean(KIMI_KEY), model: KIMI_MODEL });
    return;
  }
  if (req.url === '/api/kimi' && req.method === 'POST') {
    handleKimi(req, res);
    return;
  }
  if (req.method === 'GET') { serveStatic(req, res); return; }
  res.writeHead(405); res.end('Method not allowed');
});

server.listen(PORT, () => {
  console.log(`\n  Shotsmith running →  http://localhost:${PORT}`);
  console.log(`  Kimi proxy:          ${KIMI_KEY ? 'ready ✓ (key hidden server-side)' : 'NO KEY — set KIMI_API_KEY or .kimi-key'}\n`);
});
