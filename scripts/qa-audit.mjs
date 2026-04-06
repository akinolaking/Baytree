import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium, firefox } from 'playwright-core';
import axe from 'axe-core';

const root = '/home/user/Baytree';
const outDir = path.join(root, 'output/qa');
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  'index.html',
  'services.html',
  'projects.html',
  'about.html',
  'contact.html',
];

const breakpoints = [
  { name: 'mobile-sm', width: 320, height: 900 },
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'laptop', width: 1024, height: 900 },
  { name: 'desktop', width: 1280, height: 900 },
  { name: 'desktop-xl', width: 1440, height: 1000 },
];

function pageUrl(fileName) {
  return pathToFileURL(path.join(root, fileName)).toString();
}

async function runResponsiveScreenshots(browser, report) {
  for (const pageName of pages) {
    for (const bp of breakpoints) {
      const context = await browser.newContext({ viewport: { width: bp.width, height: bp.height } });
      const page = await context.newPage();
      const target = pageUrl(pageName);
      const shot = path.join(outDir, `${path.basename(pageName, '.html')}-${bp.name}.png`);
      const item = { page: pageName, breakpoint: bp.name, width: bp.width, height: bp.height, screenshot: shot };
      try {
        await page.goto(target, { waitUntil: 'load', timeout: 30000 });
        await page.waitForTimeout(300);
        await page.screenshot({ path: shot, fullPage: true });
        item.status = 'pass';
      } catch (error) {
        item.status = 'fail';
        item.error = String(error.message || error);
      }
      report.responsive.push(item);
      await context.close();
    }
  }
}

async function runBrowserSmoke(name, browser, report) {
  for (const pageName of pages) {
    const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
    const page = await context.newPage();
    const logs = [];
    const errors = [];

    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        logs.push({ type: msg.type(), text: msg.text() });
      }
    });
    page.on('pageerror', (err) => errors.push(String(err.message || err)));

    const entry = { browser: name, page: pageName, status: 'pass', console: logs, pageErrors: errors };
    try {
      await page.goto(pageUrl(pageName), { waitUntil: 'load', timeout: 30000 });
      await page.waitForTimeout(500);
    } catch (error) {
      entry.status = 'fail';
      entry.error = String(error.message || error);
    }

    if (errors.length > 0) {
      entry.status = 'fail';
    }

    report.crossBrowser.push(entry);
    await context.close();
  }
}

function compactNode(node) {
  return {
    html: node.html,
    target: node.target,
    failureSummary: node.failureSummary,
  };
}

async function runA11yAudit(browser, report) {
  for (const pageName of pages) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    const entry = { page: pageName, status: 'pass', violationsCount: 0, violations: [] };
    try {
      await page.goto(pageUrl(pageName), { waitUntil: 'load', timeout: 30000 });
      await page.addScriptTag({ content: axe.source });
      const results = await page.evaluate(async () => {
        return await window.axe.run(document, {
          runOnly: {
            type: 'tag',
            values: ['wcag2a', 'wcag2aa'],
          },
        });
      });

      entry.violationsCount = results.violations.length;
      entry.violations = results.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        description: v.description,
        help: v.help,
        helpUrl: v.helpUrl,
        nodes: v.nodes.map(compactNode),
      }));
      if (entry.violationsCount > 0) {
        entry.status = 'fail';
      }
    } catch (error) {
      entry.status = 'fail';
      entry.error = String(error.message || error);
    }

    report.accessibility.push(entry);
    await context.close();
  }
}

async function main() {
  const report = {
    timestamp: new Date().toISOString(),
    responsive: [],
    crossBrowser: [],
    accessibility: [],
    summary: {},
  };

  const chrome = await chromium.launch({
    executablePath: '/home/user/Baytree/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell',
    headless: true,
    args: ['--no-sandbox', '--disable-gpu'],
  });

  let ff = null;
  report.crossBrowser.push({ browser: 'firefox', status: 'skipped', reason: 'Firefox not available in this environment' });

  await runResponsiveScreenshots(chrome, report);
  await runBrowserSmoke('chrome', chrome, report);
  await runA11yAudit(chrome, report);

  await chrome.close();

  report.summary = {
    responsiveFailures: report.responsive.filter((x) => x.status === 'fail').length,
    crossBrowserFailures: report.crossBrowser.filter((x) => x.status === 'fail').length,
    accessibilityFailures: report.accessibility.filter((x) => x.status === 'fail').length,
    accessibilityViolations: report.accessibility.reduce((sum, x) => sum + (x.violationsCount || 0), 0),
  };

  const jsonPath = path.join(outDir, 'qa-report.json');
  fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));

  const md = [];
  md.push('# QA Report');
  md.push(`Generated: ${report.timestamp}`);
  md.push('');
  md.push('## Summary');
  md.push(`- Responsive failures: ${report.summary.responsiveFailures}`);
  md.push(`- Cross-browser failures: ${report.summary.crossBrowserFailures}`);
  md.push(`- Accessibility pages with violations/errors: ${report.summary.accessibilityFailures}`);
  md.push(`- Total accessibility violations: ${report.summary.accessibilityViolations}`);
  md.push('');
  md.push('## Accessibility Violations');

  for (const a of report.accessibility) {
    md.push(`### ${a.page} (${a.status})`);
    if (a.error) {
      md.push(`- Error: ${a.error}`);
      continue;
    }
    if (!a.violations || a.violations.length === 0) {
      md.push('- No WCAG A/AA violations detected by axe.');
      continue;
    }
    for (const v of a.violations) {
      md.push(`- ${v.id} (${v.impact || 'n/a'}): ${v.help}`);
      const node = v.nodes[0];
      if (node?.target?.length) {
        md.push(`  - Target: ${node.target.join(', ')}`);
      }
    }
  }

  const mdPath = path.join(outDir, 'qa-report.md');
  fs.writeFileSync(mdPath, md.join('\n'));

  console.log(JSON.stringify({ jsonPath, mdPath, summary: report.summary }, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
