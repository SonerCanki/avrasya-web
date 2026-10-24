// Browser tests for the one-page site. Each project in playwright.config.mjs runs the same file;
// tests that only make sense with animation, on a phone, or with JavaScript skip themselves.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mkdirSync, writeFileSync } from 'node:fs';

const project = () => test.info().project.name;
const hasJs = () => project() !== 'javascriptsiz';
const hasMotion = () => hasJs() && !project().endsWith('hareketsiz');
const isPhone = () => project().startsWith('telefon');

const WA = 'https://wa.me/905306656373';

// ---------- Helpers ----------

// Scrolls so the element's bottom edge sits at the given fraction of the viewport (0 = top).
const scrollPast = (page, selector, at = 0.2) => page.evaluate(([sel, at]) => {
  const r = document.querySelector(sel).getBoundingClientRect();
  window.scrollTo(0, window.scrollY + r.bottom - window.innerHeight * at);
}, [selector, at]);

const opacity = (page, selector) => page.evaluate(sel => {
  const s = getComputedStyle(document.querySelector(sel));
  return s.visibility === 'hidden' ? 0 : Number(s.opacity);
}, selector);

// html reserves the scrollbar gutter, so scrollWidth can be smaller than clientWidth; only a positive value is overflow.
const horizontalOverflow = page => page.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));

// ---------- Every test: no script errors and no failed requests ----------

let problems;
test.beforeEach(async ({ page }) => {
  problems = [];
  page.on('pageerror', err => problems.push(`Sayfa hatası: ${err.message}`));
  page.on('console', msg => { if (msg.type() === 'error') problems.push(`Konsol: ${msg.text()}`); });
  page.on('response', res => { if (res.status() >= 400) problems.push(`${res.status()} ${res.url()}`); });
  page.on('requestfailed', req => {
    // Videos and images cut off by navigation or by the browser's own range requests are not errors.
    if (/ERR_ABORTED/.test(req.failure()?.errorText ?? '')) return;
    problems.push(`İstek başarısız: ${req.url()} (${req.failure()?.errorText})`);
  });
  // Skip the opening curtain except in the test that is about it.
  if (!test.info().title.includes('açılış perdesi')) {
    await page.addInitScript(() => localStorage.setItem('avrasya-acilis', '1'));
  }
});

test.afterEach(() => {
  expect(problems, 'konsol hatası ya da başarısız istek olmamalı').toEqual([]);
});

// ---------- Whole page ----------

test('sayfa yüklenir, baştan sona kaydırılınca yana taşma olmaz', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('h1')).toHaveText('Pastaneniz için süslerle dolu teşhir standı');
  expect(await horizontalOverflow(page)).toBe(0);

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = Math.round((page.viewportSize().height) * 0.7);
  for (let y = 0; y <= height; y += step) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(120);
    expect(await horizontalOverflow(page), `${y}px kaydırınca`).toBe(0);
  }
  await page.waitForLoadState('networkidle');

  // Images that tried to load must have loaded (lazy ones further away may not have started).
  const broken = await page.evaluate(() => [...document.images]
    .filter(img => img.getAttribute('src') && img.complete && img.naturalWidth === 0)
    .map(img => img.getAttribute('src')));
  expect(broken).toEqual([]);
});

test('açılış perdesi yalnızca ilk ziyarette oynar', async ({ page }) => {
  test.skip(!hasMotion(), 'perde yalnızca hareket açıkken oynar');
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => document.documentElement.classList.contains('acilis-on'))).toBe(true);
  await expect(page.locator('html')).not.toHaveClass(/acilis-on/, { timeout: 5000 });
  await expect(page.locator('.acilis')).toBeHidden();
  expect(await page.evaluate(() => localStorage.getItem('avrasya-acilis'))).toBe('1');

  await page.reload({ waitUntil: 'domcontentloaded' });
  expect(await page.evaluate(() => document.documentElement.classList.contains('acilis-on'))).toBe(false);
  await expect(page.locator('.acilis')).toBeHidden();
});

test('üstteki başlık bozulmadan kalır, süs pastaya iner', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => opacity(page, '#sus'), { timeout: 6000 }).toBe(1);
  await expect(page.locator('h1')).toHaveText('Pastaneniz için süslerle dolu teşhir standı');
  // SplitText is reverted after the letters land, so screen readers get the plain title.
  await expect(page.locator('h1 div, h1 span')).toHaveCount(0, { timeout: 4000 });
  await expect(page.locator('.hero .lede')).toBeVisible();
  await expect(page.locator('.hero-actions')).toBeVisible();
});

// ---------- Scene 2: the stand ----------

test('stand sahnesi kaydırınca son hâline varır', async ({ page }) => {
  await page.goto('/');
  if (hasMotion()) await expect(page.locator('.sahne-stand .sahne-karo')).toHaveCount(20);
  await scrollPast(page, '.stand-copy .steps', 0.3);
  await expect.poll(() => opacity(page, '.sahne-stand img'), { timeout: 5000 }).toBe(1);
  await expect.poll(() => opacity(page, '.sahne-sus'), { timeout: 5000 }).toBe(1);
  await expect.poll(() => opacity(page, '.sahne-pasta'), { timeout: 5000 }).toBe(1);
  if (hasMotion()) {
    expect(await page.evaluate(() => getComputedStyle(document.querySelector('.sahne-stand .sahne-karo')).backgroundImage)).toContain('stand-cocuk-karakter-kesik.webp');
  }
  // The topper ends on the cake: their centres line up horizontally.
  await expect.poll(() => page.evaluate(() => {
    const s = document.querySelector('.sahne-sus').getBoundingClientRect();
    const p = document.querySelector('.sahne-pasta').getBoundingClientRect();
    return Math.round(Math.abs((s.left + s.width / 2) - (p.left + p.width / 2)));
  }), { timeout: 5000 }).toBeLessThan(12);
});

// ---------- Scene 3: the collection ----------

test('koleksiyon geniş ekranda sabitlenip yana kayar', async ({ page }) => {
  test.skip(!hasMotion() || isPhone(), 'yalnızca geniş ekranda, hareket açıkken');
  await page.goto('/');
  const pin = await page.evaluate(() => {
    const st = window.ScrollTrigger.getAll().find(s => s.pin?.classList.contains('koleksiyon'));
    return { start: st.start, end: st.end };
  });
  expect(pin.end - pin.start).toBeGreaterThan(200);
  await page.evaluate(y => window.scrollTo(0, y), pin.start + 5);
  await page.waitForTimeout(900);
  const top = await page.evaluate(() => document.querySelector('.koleksiyon').getBoundingClientRect().top);
  await page.evaluate(y => window.scrollTo(0, y), pin.end);
  await expect.poll(() => page.evaluate(() => window.gsap.getProperty('#gallery', 'x')), { timeout: 5000 })
    .toBeLessThan(-(pin.end - pin.start) + 10);
  // Still pinned in the same place at the end of the slide.
  const topAtEnd = await page.evaluate(() => document.querySelector('.koleksiyon').getBoundingClientRect().top);
  expect(Math.abs(topAtEnd - top)).toBeLessThan(3);
  // The last card is fully on screen.
  const last = await page.locator('#gallery li').last().boundingBox();
  expect(last.x + last.width).toBeLessThanOrEqual(page.viewportSize().width);
});

test('koleksiyon telefonda parmakla kaydırılır', async ({ page }) => {
  test.skip(!isPhone(), 'yalnızca telefonda');
  await page.goto('/');
  await page.locator('#gallery').scrollIntoViewIfNeeded();
  const scrollable = await page.evaluate(() => {
    const g = document.getElementById('gallery');
    g.scrollLeft = 300;
    return { overflow: g.scrollWidth - g.clientWidth, left: g.scrollLeft };
  });
  expect(scrollable.overflow).toBeGreaterThan(300);
  expect(scrollable.left).toBeGreaterThan(0);
});

test('süzgeç doğru sayıda stand gösterir', async ({ page }) => {
  test.skip(!hasJs(), 'süzgeç JavaScript ister');
  await page.goto('/');
  const filter = page.getByRole('group', { name: 'Standları konuya göre süzün' });
  await expect(filter).toBeVisible();
  const visible = page.locator('#gallery li:not([hidden])');
  const count = page.locator('.filtre-sayi');

  for (const [name, n] of [['Futbol', 1], ['Ayna', 4], ['Çocuk', 1], ['Tümü', 11]]) {
    const btn = filter.getByRole('button', { name, exact: true });
    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await expect(visible).toHaveCount(n);
    await expect(count).toHaveText(`${n} stand`);
  }
  await expect(filter.locator('[aria-pressed="true"]')).toHaveCount(1);
  // After filtering, the shown cards fade back in fully.
  await expect.poll(() => opacity(page, '#gallery li:last-child'), { timeout: 3000 }).toBe(1);
});

test('stand kartı büyük görseli açar, Esc kapatır', async ({ page }) => {
  test.skip(!hasJs(), 'büyük görsel JavaScript ister');
  await page.goto('/');
  const card = page.locator('#gallery li button').first();
  await card.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await card.click();
  const box = page.locator('#lightbox');
  await expect(box).toHaveJSProperty('open', true);
  await expect(box.locator('img')).toHaveAttribute('src', /-1040\.webp$/);
  await expect(box.locator('img')).not.toHaveAttribute('alt', '');
  await expect.poll(() => box.locator('img').evaluate(img => img.complete && img.naturalWidth > 0)).toBe(true);
  await expect(page.getByRole('button', { name: 'Kapat' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(box).toHaveJSProperty('open', false);
  await expect(card).toBeFocused();
});

// ---------- Scenes 4 and 5: tower and workshop ----------

test('kule stand kaydırınca tamamen kurulur', async ({ page }) => {
  const photo = [];
  page.on('request', req => { if (req.url().includes('kule-stand-kesik.webp')) photo.push(req.url()); });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  // The scene must not fetch the photo ahead of lazy loading: it is far below the first screen.
  // (Without JavaScript the browser turns lazy loading off, so every image loads at once there.)
  if (hasJs()) expect(photo, 'kule fotoğrafı sayfa açılışında indirilmemeli').toEqual([]);
  if (hasMotion()) await expect(page.locator('.kule-foto .sahne-karo')).toHaveCount(14);
  await scrollPast(page, '.kule-foto', 0.6);
  await expect.poll(() => opacity(page, '.kule-foto img'), { timeout: 5000 }).toBe(1);
  if (hasMotion()) {
    await expect.poll(() => page.evaluate(() => getComputedStyle(document.querySelector('.kule-foto .sahne-karo')).backgroundImage))
      .toContain('kule-stand-kesik.webp');
  }
  if (hasMotion() && !isPhone()) {
    await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.kule-katlar li')]
      .map(li => Number(getComputedStyle(li).opacity))), { timeout: 5000 }).toEqual([1, 1, 1, 1]);
  }
});

test('atölye adımlarının çizgileri sonuna kadar çizilir', async ({ page }) => {
  await page.goto('/');
  await scrollPast(page, '.adimlar', 0.3);
  // Share of each gold line that is drawn (1 when there is no dash at all).
  await expect.poll(() => page.evaluate(() => [...document.querySelectorAll('.adim-cizgi path')].map(p => {
    const dash = getComputedStyle(p).strokeDasharray;
    if (dash === 'none') return 1;
    return Math.round((parseFloat(dash) / p.getTotalLength()) * 100) / 100;
  })), { timeout: 5000 }).toEqual([1, 1, 1]);
  await expect.poll(() => opacity(page, '.adimlar li:last-child .adim-ikon'), { timeout: 5000 }).toBe(1);
  await expect.poll(() => opacity(page, '.adimlar li:last-child p'), { timeout: 5000 }).toBe(1);
});

// ---------- Scene 6: the final cake ----------

test('final pastasının mumları söner ve yeniden yanar', async ({ page }) => {
  test.skip(!hasJs(), 'mum söndürme JavaScript ister');
  // Count confetti bursts: wrap the library's create() as soon as the library assigns window.confetti.
  await page.addInitScript(() => {
    window.konfeti = 0;
    let lib;
    Object.defineProperty(window, 'confetti', {
      configurable: true,
      get: () => lib,
      set(value) {
        const create = value.create;
        value.create = (...args) => { const fire = create(...args); return (...o) => { window.konfeti++; return fire(...o); }; };
        lib = value;
      },
    });
  });
  await page.goto('/');
  const button = page.locator('.final-dugme');
  const hint = page.locator('.final-ipucu');
  await button.scrollIntoViewIfNeeded();
  await expect(button).toBeEnabled();
  await expect(button).toHaveAccessibleName('Mumları üfle');
  await expect(hint).toBeVisible();

  await button.click();
  await expect(page.locator('.final-pasta .mum.sondu')).toHaveCount(5);
  await expect(hint).toHaveText('Dileğiniz kabul olsun! Standınız için bize yazın.');
  await expect(button).toHaveAccessibleName('Mumları yeniden yak');
  await expect(page.locator('.contact-copy .btn-wa')).toHaveClass(/parla/);
  // Confetti only with motion (two bursts); with reduced motion the celebration is the text and the glow.
  await expect.poll(() => page.evaluate(() => window.konfeti)).toBe(hasMotion() ? 2 : 0);
  // The confetti canvas is hidden from screen readers.
  await expect(page.locator('body > canvas:not(.konfeti[aria-hidden="true"])')).toHaveCount(0);

  await button.click();
  await expect(page.locator('.final-pasta .mum.sondu')).toHaveCount(0);
  await expect(button).toHaveAccessibleName('Mumları üfle');
  await expect(hint).toHaveText('Dilek tutun, mumları üfleyin.');
  await expect(page.locator('.contact-copy .btn-wa')).not.toHaveClass(/parla/);
});

test('fare tek bir mumun üzerinden geçince o mum söner', async ({ page }) => {
  test.skip(!hasJs() || isPhone(), 'fare yalnızca masaüstünde');
  await page.goto('/');
  await page.locator('.final-dugme').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator('.final-pasta .mum').first().hover();
  await expect(page.locator('.final-pasta .mum.sondu')).toHaveCount(1);
});

// ---------- Links and navigation ----------

test('WhatsApp bağlantıları numarayı ve hazır mesajı taşır', async ({ page }) => {
  await page.goto('/');
  const links = await page.locator('a[href*="wa.me"]').evaluateAll(as => as.map(a => ({
    href: a.href, text: a.dataset.waText ?? null, target: a.target, rel: a.rel,
  })));
  expect(links.length).toBeGreaterThanOrEqual(6);
  for (const link of links) {
    expect(link.href.startsWith(WA)).toBe(true);
    expect(link.target).toBe('_blank');
    expect(link.rel).toContain('noopener');
    if (link.text && hasJs()) expect(new URL(link.href).searchParams.get('text')).toBe(link.text);
  }
});

test('ilk Tab "İçeriğe geç" bağlantısına gider', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const skip = page.locator('.skip-link');
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#icerik$/);
});

test('telefonda menü açılır ve bağlantıya basınca kapanır', async ({ page }) => {
  test.skip(!isPhone(), 'menü düğmesi yalnızca telefonda');
  await page.goto('/');
  const toggle = page.locator('.menu-toggle');
  const nav = page.locator('#site-nav');
  await expect(toggle).toBeVisible();
  await expect(nav.getByRole('link', { name: 'İletişim' })).toBeHidden();
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await expect(nav.getByRole('link', { name: 'İletişim' })).toBeVisible();
  await nav.getByRole('link', { name: 'İletişim' }).click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect.poll(() => page.evaluate(() => {
    const r = document.getElementById('iletisim').getBoundingClientRect();
    return r.top >= 0 && r.top < window.innerHeight / 2;
  }), { timeout: 5000 }).toBe(true);
});

// ---------- Without animation ----------

test('hareket azaltılınca sayfa animasyonsuz, son hâliyle görünür', async ({ page }) => {
  test.skip(hasMotion(), 'yalnızca hareketsiz ve JavaScript\'siz projelerde');
  await page.goto('/');
  await expect(page.locator('html')).not.toHaveClass(/\banim\b|acilis-on|lenis/);
  await expect(page.locator('.sahne-karo, .sahne-hayalet')).toHaveCount(0);
  for (const sel of ['#sus', '.sahne-stand img', '.sahne-sus', '.sahne-pasta', '.kule-foto img', '.adimlar li:last-child .adim-ikon']) {
    expect(await opacity(page, sel), sel).toBe(1);
  }
  const transforms = await page.evaluate(() => ['.sahne-stand', '.sahne-sus', '#gallery', '.hero-balloons']
    .map(sel => getComputedStyle(document.querySelector(sel)).transform));
  expect(transforms.every(t => t === 'none')).toBe(true);
});

test('JavaScript kapalıyken içerik görünür, etkileşimli parçalar gizli', async ({ page }) => {
  test.skip(hasJs(), 'yalnızca JavaScript\'siz projede');
  await page.goto('/');
  await expect(page.locator('#gallery li:not([hidden])')).toHaveCount(11);
  await expect(page.locator('.filtre')).toBeHidden();
  await expect(page.locator('.filtre-sayi')).toBeHidden();
  await expect(page.locator('.final-dugme')).toBeDisabled();
  await expect(page.locator('.final-ipucu')).toBeHidden();
  await expect(page.locator('.acilis')).toBeHidden();
  await expect(page.locator('.final-pasta .mum.sondu')).toHaveCount(0);
});

// ---------- Accessibility (axe) ----------

test('erişilebilirlik: axe ciddi ya da kritik ihlal bulmaz', async ({ page }) => {
  test.skip(!hasJs(), 'axe sayfaya betik olarak yüklenir; JavaScript kapalıyken çalışamaz');
  await page.goto('/');
  // Let the entrances finish, then walk the page so every scene reaches its end state.
  await page.waitForTimeout(2500);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= height; y += 500) {
    await page.evaluate(y => window.scrollTo(0, y), y);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1000);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'])
    .analyze();
  const summary = results.violations.map(v => ({
    kural: v.id, etki: v.impact, aciklama: v.help, adet: v.nodes.length,
    ornekler: v.nodes.slice(0, 5).map(n => n.target.join(' ')),
  }));
  mkdirSync(new URL('../sonuc/axe/', import.meta.url), { recursive: true });
  writeFileSync(new URL(`../sonuc/axe/${project()}.json`, import.meta.url), JSON.stringify(summary, null, 2));

  const serious = summary.filter(v => v.etki === 'serious' || v.etki === 'critical');
  expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
});
