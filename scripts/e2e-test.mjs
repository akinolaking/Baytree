/**
 * BayTree E2E Tests — focused, fast Playwright checks
 */
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright-core';

const root = '/home/user/Baytree';
const BROWSER_EXEC = '/home/user/Baytree/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';

const pages = [
  { file: 'index.html',    label: 'Home',     active: 'Home' },
  { file: 'services.html', label: 'Services', active: 'Services' },
  { file: 'projects.html', label: 'Projects', active: 'Projects' },
  { file: 'about.html',    label: 'About',    active: 'About' },
  { file: 'contact.html',  label: 'Contact',  active: null },
];

function url(file) {
  return pathToFileURL(path.join(root, file)).toString();
}

let passed = 0;
let failed = 0;
const failures = [];

function pass(name) { console.log(`  ✓ ${name}`); passed++; }
function fail(name, detail) { console.log(`  ✗ ${name}: ${detail}`); failed++; failures.push({ name, detail }); }

async function runTests() {
  const browser = await chromium.launch({
    executablePath: BROWSER_EXEC,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  for (const p of pages) {
    console.log(`\n── ${p.label} (${p.file}) ──`);
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto(url(p.file), { waitUntil: 'commit', timeout: 15000 });
    // Wait for full DOM to parse (footer is near end of file)
    try {
      await page.waitForSelector('.whatsapp-fab', { timeout: 8000 });
    } catch { /* proceed anyway */ }
    await page.waitForTimeout(200);

    // 1. No JS page errors
    if (errors.length === 0) pass('No JS page errors');
    else fail('No JS page errors', errors.join('; '));

    // 2. Header has bg-white
    const headerHasWhite = await page.evaluate(() => {
      const h = document.getElementById('header');
      return h ? h.classList.contains('bg-white') : false;
    });
    if (headerHasWhite) pass('Header has bg-white class');
    else fail('Header has bg-white class', 'Missing bg-white on #header');

    // 3. Drawer elements present
    const drawerPresent = await page.evaluate(() =>
      !!document.getElementById('mobile-drawer') && !!document.getElementById('drawer-overlay')
    );
    if (drawerPresent) pass('Mobile drawer HTML present');
    else fail('Mobile drawer HTML present', '#mobile-drawer or #drawer-overlay missing');

    // 4. No old inline mobile-menu div
    const oldMenuGone = await page.evaluate(() => !document.getElementById('mobile-menu'));
    if (oldMenuGone) pass('Old #mobile-menu removed');
    else fail('Old #mobile-menu removed', '#mobile-menu still present');

    // 5. Active nav link correct (desktop nav)
    if (p.active) {
      const activeText = await page.evaluate(() => {
        const links = document.querySelectorAll('header .hidden.md\\:flex a');
        for (const l of links) {
          if (l.classList.contains('text-forest-green') && !l.classList.contains('paper-btn-primary')) {
            return l.textContent.trim();
          }
        }
        return null;
      });
      if (activeText === p.active) pass(`Active nav link is "${p.active}"`);
      else fail(`Active nav link is "${p.active}"`, `Got: "${activeText}"`);
    }

    // 6. Footer has social icons
    const footerSocials = await page.evaluate(() =>
      document.querySelectorAll('footer.site-footer .footer-social-btn').length
    );
    if (footerSocials >= 4) pass(`Footer has ${footerSocials} social icons`);
    else fail('Footer social icons', `Found ${footerSocials}, expected ≥4`);

    // 7. Footer has full address
    const footerText = await page.evaluate(() =>
      document.querySelector('footer.site-footer')?.textContent || ''
    );
    const hasAddr = footerText.includes('Gbagada');
    if (hasAddr) pass('Footer has full address (Gbagada)');
    else fail('Footer full address', 'Missing Gbagada address in footer');

    // 8. Footer has real phone (not placeholder)
    const hasRealPhone = footerText.includes('+234 805 777 7724');
    if (hasRealPhone) pass('Footer has real phone number');
    else fail('Footer real phone', 'Placeholder or missing phone number');

    // 9. WhatsApp FAB present
    const fabPresent = await page.evaluate(() => !!document.querySelector('.whatsapp-fab'));
    if (fabPresent) pass('WhatsApp FAB present');
    else fail('WhatsApp FAB', '.whatsapp-fab not found');

    // 10. Nav links (py-4 on inner nav)
    const navPy4 = await page.evaluate(() => {
      const nav = document.querySelector('header nav');
      return nav ? nav.classList.contains('py-4') : false;
    });
    if (navPy4) pass('Header nav has py-4 padding');
    else fail('Header nav py-4', 'Missing py-4 on header nav');

    // 11. Slider checks (index only)
    if (p.file === 'index.html') {
      const slideImages = await page.evaluate(() => {
        const slides = document.querySelectorAll('.hero-slide');
        return Array.from(slides).map(s => s.style.backgroundImage || '');
      });
      const hasImages = slideImages.every(img => img.includes('slider/slide_'));
      if (hasImages) pass('Slider slides have background images');
      else fail('Slider background images', `Got: ${JSON.stringify(slideImages)}`);

      const overlays = await page.evaluate(() =>
        document.querySelectorAll('.hero-slide > div[style*="background-color"]').length
      );
      if (overlays === 3) pass('Slider has color overlays on all 3 slides');
      else fail('Slider color overlays', `Found ${overlays}/3 overlays`);
    }

    await ctx.close();
  }

  await browser.close();

  console.log(`\n════════════════════════════`);
  console.log(`Results: ${passed} passed, ${failed} failed`);
  if (failures.length) {
    console.log('\nFailures:');
    failures.forEach(f => console.log(`  - ${f.name}: ${f.detail}`));
  }
  console.log('════════════════════════════');

  if (failed > 0) process.exit(1);
}

runTests().catch(err => { console.error(err); process.exit(1); });
