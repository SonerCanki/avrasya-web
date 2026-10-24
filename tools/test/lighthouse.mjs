// Lighthouse for the site, phone and desktop, in the installed Google Chrome.
// Serves the project root on port 5511. Each round starts a fresh Chrome and audits the page twice:
// the first visit (with the opening curtain) and a repeat visit (Lighthouse clears the HTTP cache
// between runs but keeps localStorage, so the curtain is skipped). Three rounds; for each case the
// run with the median performance score is kept, since one run varies too much.
// Reports go to sonuc/lighthouse/.
// Text files are sent gzip-compressed, as any real static host does (http-server would send them
// uncompressed and Lighthouse would time three times the bytes).
import { createServer } from 'node:http';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import * as chromeLauncher from 'chrome-launcher';
import lighthouse from 'lighthouse';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const PORT = 5511;
const ROUNDS = 3;
const URL_ = `http://localhost:${PORT}/`;
const root = fileURLToPath(new URL('../..', import.meta.url));
const out = new URL('./sonuc/lighthouse/', import.meta.url);
mkdirSync(out, { recursive: true });

const CATEGORIES = ['performance', 'accessibility', 'best-practices', 'seo'];
const METRICS = {
  'first-contentful-paint': 'FCP',
  'largest-contentful-paint': 'LCP',
  'total-blocking-time': 'TBT',
  'cumulative-layout-shift': 'CLS',
  'speed-index': 'SI',
};

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.mp4': 'video/mp4', '.woff2': 'font/woff2', '.ico': 'image/x-icon',
};
const COMPRESS = new Set(['.html', '.css', '.js', '.json', '.svg']);
const server = createServer((req, res) => {
  let path = decodeURIComponent(new URL(req.url, URL_).pathname);
  if (path.endsWith('/')) path += 'index.html';
  const file = normalize(join(root, path));
  if (!file.startsWith(normalize(root))) { res.writeHead(403).end(); return; }
  let body;
  try { body = readFileSync(file); } catch { res.writeHead(404).end(); return; }
  const ext = extname(file).toLowerCase();
  const headers = { 'Content-Type': TYPES[ext] ?? 'application/octet-stream', 'Cache-Control': 'no-cache' };
  if (COMPRESS.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] ?? '')) {
    body = gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
    headers.Vary = 'Accept-Encoding';
  }
  res.writeHead(200, headers).end(body);
});
await new Promise(resolve => server.listen(PORT, resolve));

const summarize = (runs, name) => {
  runs.sort((a, b) => a.lhr.categories.performance.score - b.lhr.categories.performance.score);
  const median = runs[Math.floor(runs.length / 2)];
  const [html, json] = median.report;
  writeFileSync(new URL(`${name}.html`, out), html);
  writeFileSync(new URL(`${name}.json`, out), json);
  const { lhr } = median;
  return {
    puanlar: Object.fromEntries(CATEGORIES.map(c => [c, Math.round(lhr.categories[c].score * 100)])),
    performansTumKosular: runs.map(r => Math.round(r.lhr.categories.performance.score * 100)),
    olcumler: Object.fromEntries(Object.entries(METRICS).map(([id, short]) => [short, lhr.audits[id].displayValue])),
    lcpOgesi: lhr.audits['lcp-breakdown-insight']?.details?.items?.find(i => i.type === 'node')?.selector ?? null,
    // Audits that lost points, worst first, so the report can say what to fix.
    eksikler: Object.values(lhr.audits)
      .filter(a => a.score !== null && a.score < 0.9 && a.scoreDisplayMode !== 'informative' && a.scoreDisplayMode !== 'notApplicable')
      .sort((a, b) => a.score - b.score)
      .map(a => `${a.id} (${Math.round(a.score * 100)})${a.displayValue ? `: ${a.displayValue}` : ''}`),
  };
};

const summary = {};
try {
  for (const [name, config] of [['telefon', undefined], ['masaustu', desktopConfig]]) {
    const first = [], repeat = [];
    for (let i = 0; i < ROUNDS; i++) {
      const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new'] });
      try {
        const flags = { port: chrome.port, output: ['html', 'json'], onlyCategories: CATEGORIES, logLevel: 'error' };
        first.push(await lighthouse(URL_, flags, config));
        repeat.push(await lighthouse(URL_, flags, config));
      } finally {
        await chrome.kill();
      }
    }
    summary[`${name}-ilk`] = summarize(first, `${name}-ilk`);
    summary[`${name}-tekrar`] = summarize(repeat, `${name}-tekrar`);
  }
} finally {
  server.close();
}

writeFileSync(new URL('ozet.json', out), JSON.stringify(summary, null, 2));
console.log(JSON.stringify(summary, null, 2));
